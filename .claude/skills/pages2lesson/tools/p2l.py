#!/usr/bin/env python
"""pages2lesson —— 一本书的一段页码 → 一课，入库，一条命令。

    p2l.py run --book 3m --lesson math3-c1-ex5
    p2l.py run --book 3m --pages 44-47

为什么存在：这条链（ld-s10y-lesson 的 cap1..cap6 + ld-s10y-image）每一步之间都有一道缝，
每道缝都要模型接一次。STEMROBIN-191 实测一课 254 个 turn，其中 107 个既没调工具也没出一个字；
132 条 shell 命令里管线本身只需要约 20 条。成本 = turns × 每轮上下文，所以要治的是来回次数。

这个驱动把缝焊上：**机械活一路跑到下一个未满足的 gate**，失败时一次报出本阶段全部问题，
而不是在第一处失败就回来问。模型只在三个点介入：

    G1  看页面图写页面文本          pages/<page>/page.md
    G2  写现代版文本                editions/<edition>/lessons/<card>/*.template.json
    G3  写插图语义 + 目视验收       figures/<id>.spec.json，然后 --accept-figure <id>

每次调用都从文件系统重新判断进度，没有状态文件（状态文件会和真相不一致）。
反复跑同一条命令直到它说 done。

退出码：0 已交付 / 3 停在 gate（已打印工单）/ 1 本阶段有失败（已全部列出）/ 2 硬停（需要人）。
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

SKILL = Path(__file__).resolve().parent.parent
REPO = SKILL.parents[2]
LESSON_SKILL = REPO / ".claude" / "skills" / "ld-s10y-lesson"
IMAGE_SKILL = REPO / ".agents" / "skills" / "ld-s10y-image"
P2C = LESSON_SKILL / "tools" / "p2c.py"
PUBLISH = LESSON_SKILL / "tools" / "publish.mjs"
ARTIFACTS = REPO / "ssot-resources" / "soviet10year-textbooks" / "artifacts"
TOCS = REPO / "ssot-resources" / "soviet10year-textbooks" / "toc"
WORK = REPO / ".tmp" / "pages2lesson"
LESSON_WORK = REPO / ".tmp" / "ld-s10y-lesson"

sys.path.insert(0, str(LESSON_SKILL / "tools"))
import assemble as A  # noqa: E402

GATE_PAGES = "G1 写页面文本"
GATE_EDITION = "G2 写现代版文本"
GATE_FIGURES = "G3 写插图语义"


# --------------------------------------------------------------- 报告
@dataclass
class Report:
    """一次调用的全部结论。失败不在第一处退出，都收进这里一次性输出。"""

    book: str
    edition: str
    phase: str = "resolve"
    plan: dict = field(default_factory=dict)
    steps: list[dict] = field(default_factory=list)
    failures: list[str] = field(default_factory=list)
    stops: list[str] = field(default_factory=list)
    gate: str | None = None
    work_order: list[str] = field(default_factory=list)
    done: bool = False
    quiet_when_idle: bool = False

    def step(self, name: str, ok: bool, detail: str = "") -> None:
        self.steps.append({"step": name, "ok": ok, "detail": detail})

    def exit_code(self) -> int:
        if self.stops:
            return 2
        if self.failures:
            return 1
        if self.gate:
            return 3
        return 0

    def emit(self, path: Path, as_json: bool) -> int:
        payload = {
            "schema": "pages2lesson/report@1",
            "book": self.book,
            "edition": self.edition,
            "phase": self.phase,
            "plan": self.plan,
            "steps": self.steps,
            "failures": self.failures,
            "stops": self.stops,
            "gate": self.gate,
            "work_order": self.work_order,
            "done": self.done,
            "status": {0: "done", 1: "failures", 2: "stop", 3: "gate"}[self.exit_code()],
        }
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8",
        )
        if as_json:
            print(json.dumps(payload, ensure_ascii=False, indent=2))
            return self.exit_code()
        for item in self.steps:
            print(f"  {'✓' if item['ok'] else '✗'} {item['step']}"
                  f"{'  ' + item['detail'] if item['detail'] else ''}")
        if self.stops:
            print(f"\n■ 硬停 {len(self.stops)} 项——需要人决定：")
            for stop in self.stops:
                print(f"    - {stop}")
        if self.failures:
            print(f"\n✗ 本阶段失败 {len(self.failures)} 项（全部，不是第一项）：")
            for failure in self.failures:
                print(f"    - {failure}")
        if self.gate:
            print(f"\n⏸ 停在 {self.gate}。要做的事：")
            for line in self.work_order:
                print(f"    {line}")
            print(f"\n  做完后原样再跑一次这条命令。完整报告: {_rel(path)}")
        if self.done:
            print("\n✓ done —— 这一课已入库。")
        elif not self.gate and not self.failures and not self.stops and not self.quiet_when_idle:
            print("\n（没有要做的事，也没有失败：检查 --lesson/--pages 是否指向预期的卡片）")
        return self.exit_code()


def _rel(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(REPO))
    except ValueError:
        return str(path)


def _run(argv: list[str], cwd: Path = REPO) -> subprocess.CompletedProcess:
    return subprocess.run(
        argv, cwd=cwd, capture_output=True, text=True, check=False,
        env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"},
    )


def _tool_failures(result: subprocess.CompletedProcess, label: str) -> list[str]:
    """把一个 cap 工具的输出摊成逐条失败，而不是一句「退出码非零」。"""
    if result.returncode == 0:
        return []
    lines = [
        line.strip().lstrip("- ").strip()
        for line in (result.stdout + "\n" + result.stderr).splitlines()
        if line.strip().startswith(("-", "ERROR", "✗")) or "ERROR" in line
    ]
    bullets = [line for line in lines if line and not line.startswith("✗ 失败")]
    return [f"{label}: {item}" for item in bullets] or [
        f"{label}: 退出码 {result.returncode}\n"
        + (result.stdout + result.stderr).strip()[-1500:]
    ]


# --------------------------------------------------------------- P0 解析
def _toc_path(book: str) -> Path:
    candidates = sorted((TOCS / book).glob("*.json")) if (TOCS / book).is_dir() else []
    preferred = [path for path in candidates if path.stem == "zh"]
    return (preferred or candidates or [TOCS / book / "zh.json"])[0]


def _printed_offset(book_dir: Path) -> int | None:
    """印刷页 − PDF 页。从已转写页里取；全书一致才算，不一致就不猜。"""
    offsets = set()
    for page_json in sorted(book_dir.glob("pages/*/page.json")):
        try:
            meta = json.loads(page_json.read_text(encoding="utf-8"))["meta"]
        except (json.JSONDecodeError, OSError, KeyError):
            continue
        if meta.get("printed_page") is None or meta.get("page") is None:
            continue
        offsets.add(int(meta["printed_page"]) - int(meta["page"]))
    if len(offsets) == 1:
        return offsets.pop()
    return None


def _parse_pages(value: str) -> list[int]:
    match = re.fullmatch(r"(\d+)(?:\s*-\s*(\d+))?", value.strip())
    if not match:
        raise SystemExit(f"ERROR: --pages 要写成 44 或 44-47，收到 {value!r}")
    first = int(match.group(1))
    last = int(match.group(2) or first)
    if last < first:
        raise SystemExit("ERROR: --pages 的结束页小于起始页")
    return list(range(first, last + 1))


def resolve(args, report: Report) -> dict | None:
    book_dir = ARTIFACTS / args.book
    toc_path = _toc_path(args.book)
    if not toc_path.is_file():
        report.stops.append(f"找不到 {args.book} 的 TOC: {_rel(toc_path)}")
        return None
    toc = json.loads(toc_path.read_text(encoding="utf-8"))
    cards = {card["id"]: card for card in A._toc_cards(toc) if card.get("page")}
    boundaries = sorted(
        (node for node in A._toc_nodes(toc) if node.get("page")),
        key=lambda node: node["page"],
    )
    offset = _printed_offset(book_dir)

    def next_boundary(card: dict) -> dict | None:
        return next(
            (
                node for node in boundaries
                if node["page"] > card["page"] and node["id"] != card["id"]
            ),
            None,
        )

    card = None
    if args.lesson:
        card = cards.get(args.lesson)
        if card is None:
            report.stops.append(
                f"{args.lesson} 不是 {args.book} 目录里的可发布卡片"
                f"（有: {', '.join(sorted(cards))}）"
            )
            return None

    if args.pages:
        pdf_pages = _parse_pages(args.pages)
        if offset is None and not args.lesson:
            report.stops.append(
                f"{args.book} 还没有任何已转写页，推不出印刷页与 PDF 页的偏移；"
                "先用 --lesson 指明卡片，或手工转写一页"
            )
            return None
    else:
        if card is None:
            report.stops.append("至少给一个 --lesson 或 --pages")
            return None
        if offset is None:
            report.stops.append(
                f"{args.book} 的印刷页/PDF 页偏移推不出来（没有已转写页，或各页不一致）；"
                "这一次用 --pages 明确给出 PDF 页范围"
            )
            return None
        following = next_boundary(card)
        last_printed = (
            following["page"] if following else card["page"]
        )
        # 收口页也要转写：小节边界常落在印刷页中间，下一张卡的首页正是本卡的末页。
        printed_pages = list(range(card["page"], last_printed + 1))
        pdf_pages = [page - offset for page in printed_pages]

    printed_pages = (
        [page + offset for page in pdf_pages] if offset is not None else []
    )
    if card and printed_pages and card["page"] not in printed_pages:
        report.stops.append(
            f"{card['id']} 起于印刷页 {card['page']}，不在 --pages 换算出的印刷页 "
            f"{printed_pages[0]}–{printed_pages[-1]} 里；两个参数对不上"
        )
        return None
    if card is None:
        covered = [
            item for item in cards.values() if item["page"] in printed_pages
        ]
        if len(covered) != 1:
            report.stops.append(
                f"印刷页 {printed_pages[0]}–{printed_pages[-1]} 覆盖了 "
                f"{len(covered)} 张卡片 {[item['id'] for item in covered]}；"
                "用 --lesson 指明这一次交付哪一张"
            )
            return None
        card = covered[0]

    following = next_boundary(card)
    plan = {
        "card": card["id"],
        "title": card.get("title"),
        "card_printed_page": card["page"],
        "next_card": following["id"] if following else None,
        "next_printed_page": following["page"] if following else None,
        "printed_offset": offset,
        "pdf_pages": pdf_pages,
        "printed_pages": printed_pages,
        "toc": _rel(toc_path),
    }
    report.plan = plan
    closing = plan["next_printed_page"]
    report.step(
        "P0 解析",
        True,
        f"{card['id']}「{card.get('title')}」印刷页 "
        f"{printed_pages[0] if printed_pages else '?'}–"
        f"{printed_pages[-1] if printed_pages else '?'}"
        f" = PDF {pdf_pages[0]}–{pdf_pages[-1]}"
        + (f"；收口于 {plan['next_card']}（印刷页 {closing}）" if closing else "；全书末卡"),
    )
    if closing is not None and printed_pages and closing not in printed_pages:
        report.failures.append(
            f"页码范围没有包含收口页：{card['id']} 之后是 {plan['next_card']}"
            f"（印刷页 {closing}），这一页必须一起转写，否则无法判断本卡是否收完"
        )
    return plan


# --------------------------------------------------------------- P1 页面
def page_state(book_dir: Path, page: int) -> dict:
    page_dir = book_dir / "pages" / f"{page:04d}"
    audit = page_dir / "audit.json"
    errors = None
    if audit.is_file():
        try:
            errors = json.loads(audit.read_text(encoding="utf-8")).get("errors")
        except (json.JSONDecodeError, OSError):
            errors = None
    return {
        "page": page,
        "has_md": (page_dir / "page.md").is_file(),
        "finalized": errors == [],
        "errors": errors,
    }


def phase_pages(args, plan: dict, report: Report) -> bool:
    """备料所有页，再收口所有页。两步都批量，错误一次报全。"""
    book_dir = ARTIFACTS / args.book
    report.phase = "pages"
    missing = []
    for page in plan["pdf_pages"]:
        work_page = LESSON_WORK / args.book / "pages" / f"{page:04d}"
        prepared = (work_page / "layout.json").is_file() and (
            work_page / "page.grid.png"
        ).is_file()
        if not prepared or args.force_prepare:
            result = _run([
                sys.executable, str(P2C), "prepare",
                "--book", args.book, "--page", str(page),
            ] + (["--force"] if args.force_prepare else []))
            if result.returncode != 0:
                report.failures += _tool_failures(result, f"prepare p{page:04d}")
                continue
        state = page_state(book_dir, page)
        if not state["has_md"]:
            missing.append(page)
    if report.failures:
        report.step("P1 备料", False, f"{len(plan['pdf_pages'])} 页")
        return False
    report.step("P1 备料", True, f"{len(plan['pdf_pages'])} 页已备料")

    if missing:
        report.gate = GATE_PAGES
        report.work_order.append(
            f"逐页读 .tmp 里的图，把 page.md 写到持久目录。缺 {len(missing)} 页："
        )
        for page in missing:
            work_page = LESSON_WORK / args.book / "pages" / f"{page:04d}"
            layout = json.loads((work_page / "layout.json").read_text(encoding="utf-8"))
            printed = page + plan["printed_offset"] if plan["printed_offset"] is not None else "?"
            report.work_order.append(
                f"  PDF {page}（印刷页 {printed}）: 读 {_rel(work_page / 'page.grid.png')}"
                f" 和 {_rel(work_page / 'page.regions.png')}"
                f"；印刷行 {len(layout.get('line_bands', []))} 行"
                f"；候选裁图区域 "
                + (", ".join(
                    f"{region['id']}(跨{region['printed_rows']}行)"
                    for region in layout.get("candidate_regions", [])
                ) or "无")
            )
            report.work_order.append(
                f"      写入 {_rel(ARTIFACTS / args.book / 'pages' / f'{page:04d}' / 'page.md')}"
                f"，模板在 {_rel(work_page / 'page.template.md')}"
                "；插图块头用 `region r3`（或 `region r2+r3`）认领候选，别再手报坐标"
            )
        return False

    # 收口：每页都跑，把全部页的失败收齐
    finalize_failures = []
    for page in plan["pdf_pages"]:
        result = _run([
            sys.executable, str(P2C), "finalize",
            "--book", args.book, "--page", str(page),
        ])
        finalize_failures += _tool_failures(result, f"finalize p{page:04d}")
    report.failures += finalize_failures
    report.step("P1 收口", not finalize_failures, f"{len(plan['pdf_pages'])} 页")
    return not finalize_failures


# --------------------------------------------------------------- P2 装订
def _pollution(book_dir: Path, card: str) -> list[str]:
    """assemble 是全书重算；它顺手改了别的课就还原并记录（工单 Constraints）。"""
    result = _run(["git", "status", "--porcelain", "--", str(book_dir)])
    if result.returncode != 0:
        return []
    touched = []
    for line in result.stdout.splitlines():
        path = line[3:].strip().strip('"')
        if "/lessons/" not in path:
            continue
        owner = path.split("/lessons/", 1)[1].split("/", 1)[0]
        if owner != card:
            touched.append(path)
    restored = []
    for path in touched:
        if _run(["git", "checkout", "--", path]).returncode == 0:
            restored.append(path)
    return restored


def _assemble_verdict(book_dir: Path, plan: dict, report: Report) -> None:
    """对账按**本次交付的那张卡**作用域。

    `assemble` 是全书重算，它的退出码带着全书的既有失败——3m 的 `x1-承上页` 自
    STEMROBIN-191 起就报「题号缺号 [17, 24..93]」。拿退出码当判据，这条路径在这本书上
    永远是红的，而那条红和本次交付无关。所以判据取 book.json 的 audit：提到本卡的
    失败才拦，其余只报告。
    """
    index_path = book_dir / "book.json"
    if not index_path.is_file():
        report.failures.append("assemble 没有写出 book.json——装订整体失败")
        return
    try:
        audit = json.loads(index_path.read_text(encoding="utf-8")).get("audit", {})
    except (json.JSONDecodeError, OSError) as error:
        report.failures.append(f"book.json 读不出来: {error}")
        return
    card = plan["card"]
    title = plan.get("title") or ""
    mine, theirs = [], []
    for error in audit.get("errors", []):
        (mine if card in error or (title and title in error) else theirs).append(error)
    report.failures += [f"装订: {error}" for error in mine]
    if theirs:
        report.step(
            "P2 既有失败（不属于本次交付，只报告）", True,
            f"{len(theirs)} 项: " + "; ".join(item[:120] for item in theirs),
        )
    for item in audit.get("unclosed_cards", []):
        if item.get("card_id") == card:
            report.failures.append(f"小节边界: {item['message']}")


def phase_assemble(args, plan: dict, report: Report) -> bool:
    book_dir = ARTIFACTS / args.book
    report.phase = "assemble"
    toc = REPO / plan["toc"]
    for label, argv in (
        ("assemble", ["assemble", "--book", args.book, "--toc", str(toc)]),
        ("vectorize", ["vectorize", "--book", args.book]),
        ("assemble(图库同步)", ["assemble", "--book", args.book, "--toc", str(toc)]),
    ):
        result = _run([sys.executable, str(P2C)] + argv)
        if label == "vectorize":
            report.failures += _tool_failures(result, label)

    restored = _pollution(book_dir, plan["card"])
    if restored:
        report.step(
            "P2 邻课污染", True,
            f"assemble 改了 {len(restored)} 个别的课的文件，已 git 还原: "
            + ", ".join(_rel(REPO / path) for path in restored),
        )

    _assemble_verdict(book_dir, plan, report)
    report.step("P2 装订", not report.failures, f"{plan['card']}")
    return not report.failures


# --------------------------------------------------------------- P3 现代版
def _edition_paths(args, plan: dict) -> dict[str, Path]:
    book_dir = ARTIFACTS / args.book
    edition_dir = book_dir / "editions" / args.edition
    template_dir = (
        LESSON_WORK / "adapt" / args.book / args.edition / "lessons" / plan["card"]
    )
    return {
        "edition": edition_dir,
        "lesson": edition_dir / "lessons" / plan["card"],
        "figures": edition_dir / "figures",
        "templates": template_dir,
    }


def phase_edition(args, plan: dict, report: Report) -> bool:
    paths = _edition_paths(args, plan)
    report.phase = "edition"
    templates = [
        paths["templates"] / name for name in
        ("lesson.template.json", "exercises.template.json", "figures.template.json")
    ]
    if not all(path.is_file() for path in templates):
        result = _run([
            sys.executable, str(P2C), "adapt-prepare",
            "--book", args.book, "--edition", args.edition,
            "--lesson", plan["card"],
        ])
        if result.returncode != 0:
            report.failures += _tool_failures(result, "adapt-prepare")
            report.step("P3 现代版备料", False)
            return False
        report.step("P3 现代版备料", True, _rel(paths["templates"]))

    source_lesson = ARTIFACTS / args.book / "lessons" / plan["card"]
    rewritten = args.edition_ready or _templates_rewritten(templates[0], templates[1])
    if not rewritten:
        report.gate = GATE_EDITION
        report.work_order += [
            f"改写 {_rel(paths['templates'])} 下的三个模板（只改模板，adapt-finalize 负责提升）：",
            f"  lesson.template.json / exercises.template.json —— 把 text 改成 "
            f"modern-us-neutral；source_text、题号、分组、图引用、题量都不许动",
            f"  原始课文与题在 {_rel(source_lesson)}",
            f"  figures.template.json 已预置 mode/svg/render/review 四个路径，"
            f"默认 deterministic；真需要 hybrid 时改 mode 并补 artwork",
            "改完原样再跑这条命令，它会接着做插图与校验。",
            "（判据是「有任何一条 text 与 source_text 不同」。确实一字不改时加 "
            "--edition-ready 跳过这个判据。）",
        ]
        return False
    report.step("P3 现代版文本", True, "模板已改写")
    return True


def _templates_rewritten(lesson_template: Path, exercises_template: Path) -> bool:
    """模板是否已经被改写过——判据是「有任何一条 text 与 source_text 不同」。"""
    for path, key in ((lesson_template, "prose"), (exercises_template, "exercises")):
        try:
            document = json.loads(path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return False
        for item in document.get(key, []):
            if isinstance(item, dict) and item.get("text") != item.get("source_text"):
                return True
    return False


# --------------------------------------------------------------- P3b 插图
def phase_figures(args, plan: dict, report: Report) -> bool:
    paths = _edition_paths(args, plan)
    report.phase = "figures"
    manifest_path = paths["templates"] / "figures.template.json"
    figures = json.loads(manifest_path.read_text(encoding="utf-8")).get("figures", [])
    missing_specs, pending_review, rendered = [], [], []
    for figure in figures:
        figure_id = figure.get("id")
        spec_path = paths["edition"] / figure.get("spec", "")
        if not spec_path.is_file():
            missing_specs.append((figure_id, spec_path))
            continue
        spec = json.loads(spec_path.read_text(encoding="utf-8"))
        if spec.get("mode") == "generated":
            report.stops.append(
                f"{figure_id}: FigureSpec 是 generated 模式，需要付费的 Azure gpt-image-2。"
                "本单零付费图像调用——改成 deterministic/hybrid，或者让人来决定"
            )
            continue
        # 每张图都跑完，一张失败不跳过其余（工单 Scope：一次报出全部）
        for stage in ("draft",):
            validation = _run([
                sys.executable, str(IMAGE_SKILL / "scripts" / "validate_spec.py"),
                str(spec_path), "--stage", stage, "--json",
            ])
            payload = _json_or_none(validation.stdout)
            report.failures += [
                f"{figure_id} spec({stage}): {error}"
                for error in (payload or {}).get("errors", [])
            ]
            if payload is None:
                report.failures.append(
                    f"{figure_id} spec({stage}): validator 输出异常 "
                    f"{(validation.stderr or validation.stdout).strip()[:200]}"
                )
        svg_path = paths["edition"] / (figure.get("svg") or "")
        render_path = paths["edition"] / (figure.get("render") or "")
        review_path = paths["edition"] / (figure.get("review") or "")
        argv = [
            "node", str(IMAGE_SKILL / "scripts" / "render_spec.mjs"),
            "--spec", str(spec_path), "--report", str(render_path),
        ]
        if spec.get("mode") == "hybrid":
            argv += ["--svg", str(svg_path),
                     "--artwork", str(paths["edition"] / (figure.get("artwork") or ""))]
        else:
            argv += ["--svg", str(svg_path)]
        render = _run(argv)
        if render.returncode != 0:
            report.failures += _render_failures(figure_id, render, render_path)
        else:
            rendered.append((figure_id, svg_path, render_path))
            validation = _run([
                sys.executable, str(IMAGE_SKILL / "scripts" / "validate_spec.py"),
                str(spec_path), "--stage", "rendered", "--json",
            ])
            payload = _json_or_none(validation.stdout) or {}
            report.failures += [
                f"{figure_id} spec(rendered): {error}"
                for error in payload.get("errors", [])
            ]
            if figure_id in (args.accept_figure or []):
                accept = _run([
                    sys.executable, str(IMAGE_SKILL / "scripts" / "record_review.py"),
                    "--spec", str(spec_path), "--render", str(render_path),
                    "--output", str(review_path), "--status", "pass",
                    "--notes", args.review_note,
                ])
                report.failures += _tool_failures(accept, f"{figure_id} record-review")
            if not review_path.is_file():
                pending_review.append((figure_id, svg_path, render_path))

    if report.stops or report.failures:
        report.step("P3 插图", False, f"{len(figures)} 张")
        if missing_specs:
            report.failures += [
                f"{figure_id}: 缺 FigureSpec {_rel(path)}"
                for figure_id, path in missing_specs
            ]
        return False
    if missing_specs or pending_review:
        report.gate = GATE_FIGURES
        if missing_specs:
            report.work_order.append(
                f"写 {len(missing_specs)} 张图的 FigureSpec（figure-spec@2，语义角色配色，"
                "英文标签，不许泄答案）："
            )
            for figure_id, path in missing_specs:
                source = ARTIFACTS / args.book / "figures"
                report.work_order.append(
                    f"  {figure_id} → {_rel(path)}"
                    f"；原书图在 {_rel(source)}/{figure_id}.png|svg"
                )
            report.work_order.append(
                "  标签位置不用自己算：写 labelPlacement.position 当首选就行，"
                "渲染器会自己错位/错开/扩画布去解，解不开才报它试过什么。"
            )
        if pending_review:
            report.work_order.append(
                f"看 {len(pending_review)} 张已渲出的图，和原书 PNG 对照，然后带 "
                "--accept-figure <id> 再跑一次："
            )
            for figure_id, svg_path, render_path in pending_review:
                report.work_order.append(
                    f"  {figure_id}: {_rel(svg_path)}（渲染报告 {_rel(render_path)}）"
                )
        report.step("P3 插图", True, f"{len(figures)} 张，等 gate")
        return False
    report.step("P3 插图", True, f"{len(figures)} 张渲染 + 验收齐备")
    return True


def _json_or_none(text: str) -> dict | None:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None


def _render_failures(
    figure_id: str, result: subprocess.CompletedProcess, render_path: Path,
) -> list[str]:
    """渲染失败时报出渲染器试过的布局，而不是一句「碰撞」。"""
    payload = _json_or_none(result.stderr) or (
        _json_or_none(render_path.read_text(encoding="utf-8"))
        if render_path.is_file() else None
    )
    if payload is None:
        return [f"{figure_id} render: {(result.stderr or result.stdout).strip()[:400]}"]
    failures = []
    for error in payload.get("layoutErrors", []):
        failures.append(f"{figure_id} render: {error}")
    for collision in payload.get("collisions", []):
        tried = ", ".join(
            f"{item['position']}×{item['gapScale']}={item['score']}"
            for item in collision.get("tried", [])[:12]
        )
        failures.append(
            f"{figure_id} render: 标签 {collision['id']}「{collision['text']}」"
            f"解不开碰撞（落在 {collision['position']}×{collision.get('gapScale')}，"
            f"分 {collision['score']}）；渲染器试过 {tried}"
            f"；画布让步到 "
            + ", ".join(
                f"margin {item['margin']}(碰撞{item['collisions']}/显示{item['display']})"
                for item in payload.get("layout", {}).get("attempts", [])
            )
        )
    for check in payload.get("displayChecks", []):
        if check.get("status") == "pass":
            continue
        failures.append(
            f"{figure_id} render: 宽 {check['width']}px 下实测最小字号 "
            f"{check.get('measuredMinPx')}px < {check['minTextPx']}px"
            f"（{', '.join(item['text'] for item in check.get('failures', [])[:6])}）"
        )
    for fit in payload.get("imageFits", []):
        if fit.get("status") != "pass":
            failures.append(f"{figure_id} render: 素材 {fit['id']} {fit.get('reason', '未就位')}")
    return failures or [f"{figure_id} render: 退出码 {result.returncode}"]


# --------------------------------------------------------------- P3c 收口
def phase_adapt_finalize(args, plan: dict, report: Report) -> bool:
    report.phase = "adapt-finalize"
    result = _run([
        sys.executable, str(P2C), "adapt-finalize",
        "--book", args.book, "--edition", args.edition, "--lesson", plan["card"],
    ])
    failures = [
        line.strip()
        for line in result.stdout.splitlines() + result.stderr.splitlines()
        if line.strip().startswith("ERROR")
    ]
    if result.returncode != 0 and not failures:
        failures = _tool_failures(result, "adapt-finalize")
    report.failures += failures
    report.step("P3 现代版收口", not failures)
    return not failures


# --------------------------------------------------------------- P4 交付
def phase_ship(args, plan: dict, report: Report) -> bool:
    report.phase = "ship"
    book_dir = ARTIFACTS / args.book
    result = _run([
        sys.executable, str(P2C), "render",
        "--book", args.book, "--edition", args.edition, "--lesson", plan["card"],
    ])
    report.failures += _tool_failures(result, "render")
    if report.failures:
        report.step("P4 离线显示证据", False)
        return False
    report.step("P4 离线显示证据", True)

    dry = _run([
        "node", str(PUBLISH), str(book_dir),
        "--edition", args.edition, "--lesson", plan["card"], "--dry",
    ])
    report.failures += _tool_failures(dry, "publish --dry")
    if report.failures:
        report.step("P4 发布预检", False)
        return False
    report.step("P4 发布预检", True)
    if args.no_publish:
        report.gate = "P4 入库（--no-publish 时由人执行）"
        report.work_order.append(
            f"预检通过。真实入库：node {_rel(PUBLISH)} {_rel(book_dir)} "
            f"--edition {args.edition} --lesson {plan['card']}"
        )
        return False

    live = _run([
        "node", str(PUBLISH), str(book_dir),
        "--edition", args.edition, "--lesson", plan["card"],
    ])
    report.failures += _tool_failures(live, "publish")
    if report.failures:
        report.step("P4 入库", False)
        return False
    report.step("P4 入库", True, live.stdout.strip().splitlines()[-1] if live.stdout.strip() else "")
    report.done = True
    return True


# --------------------------------------------------------------- 入口
def cmd_run(args) -> int:
    report = Report(book=args.book, edition=args.edition)
    out = WORK / args.book / (args.lesson or "range") / "report.json"
    (REPO / ".tmp").mkdir(parents=True, exist_ok=True)
    plan = resolve(args, report)
    if plan is None or report.failures or report.stops:
        return report.emit(out, args.json)
    out = WORK / args.book / plan["card"] / "report.json"

    for phase in (phase_pages, phase_assemble, phase_edition,
                  phase_figures, phase_adapt_finalize, phase_ship):
        if not phase(args, plan, report):
            return report.emit(out, args.json)
    return report.emit(out, args.json)


def cmd_status(args) -> int:
    report = Report(book=args.book, edition=args.edition, quiet_when_idle=True)
    plan = resolve(args, report)
    if plan is None:
        return report.emit(WORK / args.book / "status.json", args.json)
    book_dir = ARTIFACTS / args.book
    states = [page_state(book_dir, page) for page in plan["pdf_pages"]]
    report.step(
        "页", all(state["finalized"] for state in states),
        ", ".join(
            f"p{state['page']:04d}"
            + ("✓" if state["finalized"] else ("md" if state["has_md"] else "空"))
            for state in states
        ),
    )
    paths = _edition_paths(args, plan)
    audit = paths["lesson"] / "adaptation.audit.json"
    report.step(
        "现代版", audit.is_file(),
        json.loads(audit.read_text(encoding="utf-8")).get("status", "?")
        if audit.is_file() else "未产出",
    )
    return report.emit(WORK / args.book / plan["card"] / "status.json", args.json)


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__.splitlines()[0],
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    commands = parser.add_subparsers(dest="command", required=True)

    def common(sub):
        sub.add_argument("--book", required=True, help="book id，如 3m")
        sub.add_argument("--lesson", help="目录里的卡片 id，如 math3-c1-ex5（推荐入口）")
        sub.add_argument("--pages", help="PDF 页范围，如 44-47；与 --lesson 互推互校")
        sub.add_argument("--edition", default="modern-us-neutral")
        sub.add_argument("--json", action="store_true", help="只输出结构化报告")

    run = commands.add_parser("run", help="跑到下一个 gate；反复跑到 done")
    common(run)
    run.add_argument("--force-prepare", action="store_true",
                     help="重建 .tmp 里的页渲染与模板")
    run.add_argument("--accept-figure", action="append",
                     help="目视验收这张图，记 review 证据；可重复")
    run.add_argument("--review-note", default="pages2lesson 驱动下的目视验收",
                     help="写进 review 证据的说明")
    run.add_argument("--edition-ready", action="store_true",
                     help="模板确实一字不改时跳过 G2 的「已改写」判据")
    run.add_argument("--no-publish", action="store_true",
                     help="做到发布预检就停，真实入库交给人")
    run.set_defaults(func=cmd_run)

    status = commands.add_parser("status", help="只看进度，什么都不改")
    common(status)
    status.set_defaults(func=cmd_status)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
