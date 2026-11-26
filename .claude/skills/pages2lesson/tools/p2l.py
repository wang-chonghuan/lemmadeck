#!/usr/bin/env python
"""pages2lesson —— 一本书的一段页码 → 一课，入库，一条命令。

    p2l.py run --book 3m --lesson math3-c1-ex5
    p2l.py run --book 3m --pages 44-47

为什么存在：这条链（ld-s10y-lesson 的 cap1..cap6 + ld-s10y-image）每一步之间都有一道缝，
每道缝都要模型接一次。STEMROBIN-191 实测一课 254 个 turn，其中 107 个既没调工具也没出一个字；
132 条 shell 命令里管线本身只需要约 20 条。成本 = turns × 每轮上下文，所以要治的是来回次数。

这个驱动把缝焊上：**机械活一路跑到下一个未满足的 gate**，失败时一次报出本阶段全部问题，
而不是在第一处失败就回来问。模型只在三个点介入：

    page-NNNN   看页面图写页面文本    artifacts/<book>/pages/NNNN/page.md
    edition     写现代版文本          .tmp/ld-s10y-lesson/adapt/<book>/<ed>/lessons/<card>/
    figure-<id> 写插图语义 + 目视验收  artifacts/<book>/editions/<ed>/figures/<id>.*

每个 gate 把待做的工作写成若干份**自包含 brief** 落到
.tmp/pages2lesson/<book>/<card>/units/，只打印路径；由调用方给每份 brief 派一个
**全新**子代理（不要用 fork，它会继承全部上下文）。brief 和页面图都不进主会话。

每次调用都从文件系统重新判断进度，没有状态文件（状态文件会和真相不一致）。
反复跑同一条命令直到它说 done。

退出码：0 已交付（或 --no-publish 下预检通过）/ 3 停在 gate（brief 已写好）/
1 本阶段有失败（已全部列出）/ 2 硬停（需要人）。
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
    units: list[dict] = field(default_factory=list)
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
            "units": self.units,
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
            print(f"\n⏸ 停在 {self.gate}。")
            if self.units:
                # 只打印路径，不打印 brief 内容。brief 进的是子代理的上下文，
                # 不是本会话的——这正是这条路径省钱的地方。
                print(f"\n  派 {len(self.units)} 个**全新**子代理（不要用 fork，"
                      "fork 会继承你的全部上下文，等于白搭），各读自己那一份 brief：\n")
                for unit in self.units:
                    retry = (
                        f"  ← 第 {unit['attempt']} 次（上一次的失败已写进 brief）"
                        if unit["attempt"] > 1 else ""
                    )
                    print(f"    {unit['id']}: {unit['brief']}{retry}")
                print("\n  给子代理的提示就一句：「读 <brief 路径> 并照它做完」。"
                      "\n  brief 是自包含的，不要把它的内容复制进你自己的上下文，"
                      "也不要替子代理读页面图。")
            for line in self.work_order:
                print(f"    {line}")
            tail = "子代理都回来后，" if self.units else ""
            print(f"\n  {tail}原样再跑一次这条命令。完整报告: {_rel(path)}")
        if self.done:
            print("\n✓ done。")
            for line in self.work_order:
                print(f"    {line}")
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
    if bullets:
        return [f"{label}: {item}" for item in bullets]
    # 兜底分支以前把 1500 字符的 stdout/stderr 尾巴直接打进主会话上下文
    # （STEMROBIN-192 审查 S11）。落盘，只回一行路径。
    dump = WORK / "tool-output" / f"{re.sub(r'[^A-Za-z0-9_.-]', '_', label)}.log"
    dump.parent.mkdir(parents=True, exist_ok=True)
    dump.write_text((result.stdout + result.stderr).strip() + "\n", encoding="utf-8")
    return [f"{label}: 退出码 {result.returncode}，完整输出在 {_rel(dump)}"]


# --------------------------------------------------------------- 工作单元
#
# 为什么是子代理而不是「停下来让本会话做」（STEMROBIN-192 实测）：
# 一课实付 $30.47，43.6M token 里 98.5% 是 cache read——218 轮会话重读了 218 遍
# 自己的历史。真正不可约的工作只有入 28K / 出 22K，约 $0.3–0.7。
# 钱不在步骤数上，在「所有工作挂在同一个会话里」这件事上：一页 300dpi 的图进了
# 上下文，之后每一轮都要再付一遍。
#
# 所以每个单元派一个**全新**子代理：它只看到自己那份 brief（自包含）和自己那张图，
# 做完把文件写在磁盘上、把结论还回来。页面图不进父会话的上下文。
# brief 落在磁盘上而不是打印出来，连 brief 本身也不进父会话。
# 用 fork 型子代理会继承父上下文，等于没改。

# 首发 1 次 + 修复 3 次。首发不该吃掉修复额度：adapt-finalize 有 137 条判据，
# 一个单元只给两次修复机会是不够的。
UNIT_MAX_ATTEMPTS = 4


def _units_dir(book: str, card: str) -> Path:
    return WORK / book / card / "units"


def _attempt_path(book: str, card: str, unit_id: str) -> Path:
    return _units_dir(book, card) / f"{unit_id}.attempts"


def _attempt_count(book: str, card: str, unit_id: str) -> int:
    path = _attempt_path(book, card, unit_id)
    try:
        return int(path.read_text(encoding="utf-8").strip())
    except (OSError, ValueError):
        return 0


def _bump_attempt(book: str, card: str, unit_id: str) -> int:
    count = _attempt_count(book, card, unit_id) + 1
    path = _attempt_path(book, card, unit_id)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(f"{count}\n", encoding="utf-8")
    return count


def _clear_attempts(book: str, card: str, prefix: str = "") -> None:
    """只在**交付成功**之后清，流程中途一律不清（STEMROBIN-192 审查 S3/S4）。

    中途清会出两种相反的毛病：`phase_figures` 通过后清掉 `figure-` 计数，而紧接着
    `phase_adapt_finalize` 还会把带图 id 的失败路由回图单元，于是图单元的计数每轮
    重新从 1 开始——无限循环、永不硬停、每轮都花钱；而 `edition` 的计数没有任何
    地方清，交付成功后也留着，日后返修同一张卡一轮就硬停。
    """
    for path in _units_dir(book, card).glob(f"{prefix}*.attempts"):
        path.unlink(missing_ok=True)


COMMON_DISCIPLINE = """\
## 纪律（每个单元都一样）

- 工作目录是仓库根 `{repo}`。python 一律用
  `.claude/skills/ld-s10y-lesson/.venv/bin/python`（已装好 numpy/pillow/scipy/potracer）。
  **不要重装依赖、不要新建 venv、不要装任何东西。**
- 只写本 brief 指定的文件。不要动别的课、不要动 `.intentfold/charter/`、
  不要改 lockfile、不要 git commit、不要切分支。
- 本 brief 是自包含的。需要更深的规则时才去读它点明的那个文件，不要整篇读 SKILL.md。
- 做完**先自己跑一遍本 brief 给的校验命令**，绿了再回报。校验器一次会报出全部不通过项，
  照着一次改完，不要改一条跑一次。
- 回报就两行：做完了没有、校验命令的最后结论。不要把文件内容贴回来。
"""


def _write_brief(
    book: str, card: str, unit_id: str, title: str, body: str,
    failures: list[str] | None = None,
) -> Path:
    """把一个单元写成自包含 brief。失败重试时把上一次的报错附在最前面。"""
    directory = _units_dir(book, card)
    directory.mkdir(parents=True, exist_ok=True)
    path = directory / f"{unit_id}.md"
    # 同一个项目同时有多个工作树（主 checkout 与各 ticket worktree）。子代理默认
    # 继承主会话的 cwd，不先 cd 就会在**另一个工作树**上读图写课，而 p2c 的
    # validate_workspace 只校验「cwd 等于它自己那个 checkout」，不会报警
    # （STEMROBIN-192 审查 S15）。所以工作树写在第一行，不放脚注。
    head = (
        f"# {title}\n\n"
        f"**先 `cd {REPO}`**，本 brief 里所有相对路径都从这里算。\n"
        f"这个项目同时有多个工作树，走错一个会把课写到别的分支上，而且没有任何工具会报警。\n\n"
    )
    if failures:
        head += (
            "## ⚠ 上一次没通过，先修这些\n\n"
            "下面是校验器这一次报出的**全部**不通过项。一次改完再自检。\n\n"
            + "\n".join(f"- {item}" for item in failures)
            + "\n\n---\n\n"
        )
    path.write_text(
        head + body.rstrip() + "\n\n"
        + COMMON_DISCIPLINE.format(repo=REPO) + "\n",
        encoding="utf-8",
    )
    return path


def _add_unit(
    report: Report, book: str, card: str, unit_id: str, kind: str,
    title: str, body: str, failures: list[str] | None = None,
) -> bool:
    """登记一个待派的单元；超过重试上限就变成硬失败，交给人。"""
    attempt = _bump_attempt(book, card, unit_id)
    if attempt > UNIT_MAX_ATTEMPTS:
        report.stops.append(
            f"{unit_id} 已经试了 {UNIT_MAX_ATTEMPTS} 次仍不通过，不再自动重试。"
            f"最后一次的报错写在 {_rel(_units_dir(book, card) / f'{unit_id}.md')} 的开头。"
            f"查清原因后删掉 {_rel(_attempt_path(book, card, unit_id))} 可以重新放行它"
        )
        return False
    brief = _write_brief(book, card, unit_id, title, body, failures)
    report.units.append({
        "id": unit_id,
        "kind": kind,
        "brief": _rel(brief),
        "attempt": attempt,
    })
    return True


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
        # 正确的页码范围**必然**包含下一张卡的首页（收口页），所以「覆盖 1 张卡」
        # 这个判据对全书 28 张卡里的 26 张都不成立，--pages 单给几乎没法用
        # （STEMROBIN-192 审查 S9）。判据改成：取范围**起点**那张卡。
        covered = sorted(
            (item for item in cards.values() if item["page"] in printed_pages),
            key=lambda item: item["page"],
        )
        starting = [
            item for item in covered if item["page"] == printed_pages[0]
        ]
        if len(starting) == 1:
            card = starting[0]
            if len(covered) > 1:
                report.step(
                    "P0 卡片认领", True,
                    f"印刷页 {printed_pages[0]}–{printed_pages[-1]} 起于 "
                    f"{card['id']}；范围里还有 "
                    f"{[item['id'] for item in covered if item is not card]}"
                    "（收口页带出来的，不发布）",
                )
        else:
            report.stops.append(
                f"印刷页 {printed_pages[0]} 不是任何一张卡片的首页"
                f"（这段里的卡片是 {[item['id'] for item in covered]}）；"
                "用 --lesson 指明这一次交付哪一张，或让范围从某张卡的首页开始"
            )
            return None

    if offset is None:
        report.step(
            "P0 印刷页偏移", False,
            "推不出来（没有已转写页，或各页不一致）——P0 的收口页检查本次失效，"
            "只剩 assemble 的 unclosed_cards 这一道；"
            "页 brief 里的印刷页会写成 ?，子代理需要自己从页脚读出 printed_page",
        )
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


PAGE_BLOCK_RULES = """\
## 块格式

块头声明这一块是什么；块体里**一行 = 一印刷行**。

```
<!-- h1 --> 章        <!-- h2 --> §        <!-- h3 --> 小节标题
<!-- p -->  正文段     <!-- exhead --> 习题栏标题（复习题 / 家庭作业题）
<!-- ex 20 -->        第 20 题，20 是原书题号
<!-- cap 图 7 -->     印刷出来的图题行      <!-- foot --> 页码
<!-- fig 图 7 region r3 -->               插图/表格，认领机器提的候选区域
<!-- fig 表 region r2+r3 owner-ex 20 -->  一张表被拆成两个候选时合起来，并明确归第 20 题
<!-- fig 图 7 box 790,1640,490,250 -->    候选对不上时自己画粗框，照网格估就行
```

三个标记加在块头：

- `open` —— 这个对象还没完，下面接着（跨页、也跨插图）
- `cont` —— 承接上一个同类对象
- `samerow` —— 本块与上一块共享印刷行（正文右侧的图题、并排的两个图题）

被插图从中间截断的段落写成 `p open` … `fig` … `p cont`，跨页装订会接成一段。
配对时 `fig`/`cap`/`foot` 是透明的。

## 最容易悄悄发错内容的四条

1. **行尾空格**：印刷行末本该有空格时（半角句点后、中英之间）把空格写在行尾。
   拼接是首尾直接相接的，漏了会装订出「…个一5米7分米…」——而所有校验照样全绿，
   只有肉眼看装订结果才发现。
2. **小问标号必须是西里尔** `а) б) в)`，与拉丁 `a) b) e)` 字形完全相同，只能按码点写对。
   这是全流程最常见的错误来源。
3. 一条公式被印刷从中间切开：**公式写完整**，断点处写 `↵`。
4. frontmatter 要填 `printed_page`（空的会被拒）。原书印错照抄原样；
   确认的数学印刷错误另填 `errata`（含稳定 `id`、本页块引用、忠实 `original`、核验 `reason`）。

## 数学与字符

- 行内 `$...$`；上下标一律 LaTeX（`x^2`，禁 `x²`）；分式 `\\frac`，禁 `\\dfrac`
- 数学区内减号用 ASCII `-`，禁 `−`(U+2212)
- 中文顿号、逗号、句号等全角标点放在 `$...$` **之外**
- 含中文的集合 `{俄语、数学}`、含全角标点的数组写成普通文本，不要塞进 `$...$`
- 苏联教材用法式区间记号 `]a, b[`，照抄，禁止改成 `(a, b)`
- 页边、书脊或邻页透出的重复字迹是扫描串页，不是本页内容；对照相邻页确认后不写入块

规则不够用时再读 `.claude/skills/ld-s10y-lesson/SKILL.md` 的 `## cap1` 一节；
不要整篇读它（32KB）。
"""


def _page_brief_body(args, plan: dict, page: int) -> str:
    work_page = LESSON_WORK / args.book / "pages" / f"{page:04d}"
    target = ARTIFACTS / args.book / "pages" / f"{page:04d}" / "page.md"
    layout = {}
    try:
        layout = json.loads((work_page / "layout.json").read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        pass
    offset = plan.get("printed_offset")
    printed = page + offset if offset is not None else None
    regions = layout.get("candidate_regions", [])
    region_lines = "\n".join(
        "| `{id}` | `region {id}` | `box {box}` | {components} | {rows} |".format(
            id=item["id"],
            box=",".join(str(value) for value in item["box"]),
            components=item["components"],
            rows=item["printed_rows"],
        )
        for item in regions
    ) or "| （这一页机器没提出候选） | | | | |"
    tail = _previous_page_tail(args.book, page)
    tail_block = (
        f"\n## 上一页的尾部文字（接续用，不要重复转写）\n\n```\n{tail}\n```\n"
        "\n里面的 `![…](…)` 那种行是 `finalize` 自己生成的，**不要模仿着写**；"
        "你只写块头和块体。\n"
        if tail else ""
    )
    return f"""\
把 **PDF 第 {page} 页（印刷页 {printed if printed is not None else '?'}）** 转写成带类型的块。

## 要读的

- 页面图（带 100px 坐标网格）：`{_rel(work_page / 'page.grid.png')}`
- 候选裁图区域图（框上标了 r1/r2/…）：`{_rel(work_page / 'page.regions.png')}`

**这一页机器数出 {len(layout.get('line_bands', []))} 个印刷行带**（挖掉插图之前）。
它只是参考，不是要你凑的数字：照页面实际印出来的样子写，一行输出对一行印刷。

机器提出的候选裁图区域：

| id | 认领写法 | 换成手画框就是 | 连通域 | 跨印刷行 |
|---|---|---|---|---|
{region_lines}

候选只对「有外框的连续墨块」有效。实测靠留白分组的竖式阵列提不出来、
被细网格线切碎的方格条只提出左半截，还可能把背面透印和纸边污点提成候选。
**对得上就 `region rN` 认领，对不上直接 `box x,y,w,h`，不要为了用 region 去凑。**
{tail_block}
## 要写的

写入 `{_rel(target)}`（模板在 `{_rel(work_page / 'page.template.md')}`，
照它的 frontmatter 格式，删掉模板里那段注释）。

{PAGE_BLOCK_RULES}
## 自检（写完必须自己跑，绿了再回报）

```bash
.claude/skills/ld-s10y-lesson/.venv/bin/python \\
  .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book {args.book} --page {page}
```

它会一次报出本页**全部**不通过项（行数、白名单字符、公式配平、小问标号、
行尾拼接、errata 绑定）。照着一次改完再跑。

**行数对不上时**：先对照页面图和遮图后的行带核对——高分式的分子分母属于同一印刷行，
扫描黑边和残留表格边线不是文字。**禁止加空行、重复文字或伪造 `↵` 凑数**，
那是把错误内容发给学习者。

确实是工具数错了（例如纸边阴影被当成一行），**不要改页面内容去迎合它**。
这种情况按这个格式回报，然后停下：

```
无法通过：行数对账
工具说 N 行，我数出 M 行
我核对的事实：<第几行带是什么、为什么它不是文字>
page.md 我按页面实际印出来的样子写了，没有改动去迎合
```

同样，页面图看不清、或者你判断不了某一块是什么，也照这个格式停下来回报，
不要猜一个填进去。
"""


def _previous_page_tail(book: str, page: int, lines: int = 4) -> str:
    """上一页的尾部文字。SKILL 明确要求跨页上下文传文字、不传像素。"""
    previous = ARTIFACTS / book / "pages" / f"{page - 1:04d}" / "page.md"
    if not previous.is_file():
        return ""
    body = previous.read_text(encoding="utf-8").split("---", 2)[-1]
    kept = [line for line in body.splitlines() if line.strip()]
    return "\n".join(kept[-lines:])


def phase_pages(args, plan: dict, report: Report) -> bool:
    """备料所有页，再收口所有页。两步都批量，错误按页分组回到各自的子代理。"""
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
        if not page_state(book_dir, page)["has_md"]:
            missing.append(page)
    if report.failures:
        report.step("P1 备料", False, f"{len(plan['pdf_pages'])} 页")
        return False
    report.step("P1 备料", True, f"{len(plan['pdf_pages'])} 页已备料")

    if missing:
        report.gate = GATE_PAGES
        for page in missing:
            _add_unit(
                report, args.book, plan["card"], f"page-{page:04d}", "page",
                f"转写 {args.book} 的 PDF 第 {page} 页",
                _page_brief_body(args, plan, page),
            )
        return False

    # 收口：每页都跑，失败按页分组，各自回到一个全新子代理
    per_page: dict[int, list[str]] = {}
    for page in plan["pdf_pages"]:
        result = _run([
            sys.executable, str(P2C), "finalize",
            "--book", args.book, "--page", str(page),
        ])
        failures = _tool_failures(result, f"finalize p{page:04d}")
        if failures:
            per_page[page] = failures
    if per_page:
        report.step("P1 收口", False, f"{len(per_page)}/{len(plan['pdf_pages'])} 页没过")
        report.gate = GATE_PAGES
        for page, failures in per_page.items():
            if not _add_unit(
                report, args.book, plan["card"], f"page-{page:04d}", "page",
                f"修 {args.book} 的 PDF 第 {page} 页",
                _page_brief_body(args, plan, page), failures,
            ):
                report.failures += failures
        return False
    report.step("P1 收口", True, f"{len(plan['pdf_pages'])} 页全绿")
    return True



# --------------------------------------------------------------- P2 装订
def _artifact_dirt(book_dir: Path) -> dict[str, str]:
    """本书产物树里每个脏文件 → 状态码。`-uall` 才会逐个列出未跟踪文件。

    不加 `-uall` 时 git 对一个**新目录**只输出一行 `?? lessons/`，于是按
    `/lessons/` 过滤会把整个目录漏掉——而本技能的收口页机制每课都必然为下一张卡
    产出一个新的 lesson 目录（STEMROBIN-192 审查 S5：`x7-多位数的加法和减法`
    带着 4 道题进了 git，报告一个字没提）。
    """
    result = _run(["git", "status", "--porcelain", "-uall", "--", str(book_dir)])
    if result.returncode != 0:
        return {}
    dirt = {}
    for line in result.stdout.splitlines():
        if len(line) > 3:
            dirt[line[3:].strip().strip('"')] = line[:2]
    return dirt


def _owner_of(path: str) -> str | None:
    """这个产物文件属于哪张卡。`lessons/<id>/…` 与 `editions/*/lessons/<id>/…` 都算。"""
    for marker in ("/lessons/", "lessons/"):
        if marker in path:
            tail = path.split(marker, 1)[1]
            return tail.split("/", 1)[0] if "/" in tail else None
    return None


def _pollution(book_dir: Path, card: str, before: dict[str, str]) -> dict[str, list[str]]:
    """assemble 是全书重算；它顺手改了别的课就还原并记录（工单 Constraints）。

    `before` 是跑装订之前的脏文件快照。只处理「之前干净、之后脏」的文件——
    人或另一个会话正在改的东西不属于本次装订的产物，无条件 `git checkout --`
    会把它静默销毁且不可恢复（审查 S6）。

    未跟踪的新文件还不回去（`git checkout --` 对它报 pathspec 不匹配），所以只报告，
    不删——删别人的新文件比留着更坏。
    """
    after = _artifact_dirt(book_dir)
    restored: list[str] = []
    added: list[str] = []
    kept: list[str] = []
    for path, status in after.items():
        if path in before:
            kept.append(path)
            continue
        owner = _owner_of(path)
        if owner is None or owner == card:
            continue
        if status.strip() == "??":
            added.append(path)
        elif _run(["git", "checkout", "--", path]).returncode == 0:
            restored.append(path)
        else:
            added.append(path)
    return {"restored": restored, "added": added, "preexisting": kept}


PAGE_SEGMENT = re.compile(r"页段\s*(\d+)\s*[-–]\s*(\d+)")


def _other_card_names(book_dir: Path, card: str) -> tuple[set[str], set[str]]:
    """别的卡的 id 与 title，用来把不属于本次交付的既有红排除掉。"""
    index_path = book_dir / "book.json"
    ids: set[str] = set()
    titles: set[str] = set()
    try:
        lessons = json.loads(index_path.read_text(encoding="utf-8")).get("lessons", [])
    except (OSError, json.JSONDecodeError):
        return ids, titles
    mine_title = next(
        (item.get("title") for item in lessons
         if card in {item.get("id"), item.get("card_id")}),
        None,
    )
    for item in lessons:
        if card in {item.get("id"), item.get("card_id")}:
            continue
        for key in ("id", "card_id"):
            if item.get(key):
                ids.add(item[key])
        # 同名卡存在（3m 的 math3-c1-ex1 与 ex5 都叫「巩固练习」），所以同名 title
        # 不能用来排除——否则别人的红会把本卡锁死。只收不与本卡同名的 title。
        if item.get("title") and item["title"] != mine_title:
            titles.add(item["title"])
    return ids, titles


def _owns_error(
    error: str, card: str, printed_pages: list[int],
    other_ids: set[str], other_titles: set[str],
) -> bool:
    """这条 assemble 失败是不是本次交付的责任。

    判据顺序是刻意的（STEMROBIN-192 审查 S2）：
    1. 点名本卡 → 是。
    2. 带「页段 A-B」→ 与本次页码范围相交就是，不相交就不是。`题号缺号（页段 44-47）` 和
       `图号缺号（页段 …）` 这两条恰恰是「本次这几页漏题/漏裁」的信号，而它们
       既不含卡片 id 也不含 title，按名字匹配会被当成别人的事放过去。
    3. 点名别的卡（id，或与本卡不同名的 title）→ 不是。
    4. 都认不出来 → **算本卡的**。静默放行一条可能是漏题的失败，代价比多拦一次大。
    """
    if card in error:
        return True
    segment = PAGE_SEGMENT.search(error)
    if segment and printed_pages:
        # 页段自己就说清了范围，相交与否都是定论，不用再往下猜。
        first, last = int(segment.group(1)), int(segment.group(2))
        return first <= printed_pages[-1] and printed_pages[0] <= last
    if any(name in error for name in other_ids | other_titles):
        return False
    return True


def _assemble_verdict(
    book_dir: Path, plan: dict, report: Report, completed: bool,
) -> None:
    """对账按**本次交付的那张卡**作用域。

    `assemble` 是全书重算，它的退出码带着全书的既有失败——3m 的 `x1-承上页` 自
    STEMROBIN-191 起就报「题号缺号 [17, 24..93]」。拿退出码当判据，这条路径在这本书上
    永远是红的，而那条红和本次交付无关。所以判据取 book.json 的 audit。

    但 `completed` 必须单独传进来：`book.json` 是 `assemble.run` 最后一步才写的，
    装订中途抛异常时磁盘上留着**上一次**的 audit。只看「文件存不存在」的话，
    上一次是绿的就会打 ✓，然后把一个没把新转写页算进去的旧 lesson 发布出去。
    """
    if not completed:
        report.failures.append(
            "assemble 没有跑完（输出里没有完成标记）——磁盘上的 book.json 是上一次的，"
            "不能用它判收。先单独跑一次 "
            f"`p2c.py assemble --book {plan.get('book', '')} --toc <toc>` 看它为什么崩"
        )
        return
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
    other_ids, other_titles = _other_card_names(book_dir, card)
    printed = plan.get("printed_pages") or []
    mine, theirs = [], []
    for error in audit.get("errors", []):
        target = mine if _owns_error(
            error, card, printed, other_ids, other_titles,
        ) else theirs
        target.append(error)
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
    # 装订之前先把产物树的脏文件记下来：之后只处理「之前干净、之后脏」的，
    # 不去碰人或别的会话正在改的东西。
    before_dirt = _artifact_dirt(book_dir)
    completed = False
    for label, argv in (
        ("assemble", ["assemble", "--book", args.book, "--toc", str(toc)]),
        ("vectorize", ["vectorize", "--book", args.book]),
        ("assemble(图库同步)", ["assemble", "--book", args.book, "--toc", str(toc)]),
    ):
        result = _run([sys.executable, str(P2C)] + argv)
        if label == "vectorize":
            report.failures += _tool_failures(result, label)
            continue
        # `[assemble]` 是 assemble.run 最后一步才打印的完成标记；抛异常时没有它。
        output = result.stdout + result.stderr
        if "[assemble]" in output:
            completed = True
        elif "Traceback" in output:
            report.failures.append(
                f"{label} 抛异常中止："
                + output.strip().splitlines()[-1][:300]
            )

    dirt = _pollution(book_dir, plan["card"], before_dirt)
    if dirt["restored"]:
        report.step(
            "P2 邻课污染（已还原）", True,
            f"{len(dirt['restored'])} 个别的课的已跟踪文件被装订改过，已 git 还原: "
            + ", ".join(dirt["restored"]),
        )
    if dirt["added"]:
        # 收口页属于下一张卡，装订必然为它产出一个新的 lesson 目录。还原不了，
        # 但必须让人看见——它会跟着这次交付一起进 commit。
        report.step(
            "P2 装订新建了别的课的文件（还原不了，需要人决定怎么处置）", True,
            f"{len(dirt['added'])} 个: " + ", ".join(sorted(dirt["added"])[:12]),
        )

    _assemble_verdict(book_dir, plan, report, completed)
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


def _size_label(path: Path) -> str:
    try:
        return f"{path.stat().st_size / 1024:.1f}KB"
    except OSError:
        return "还没生成"


def _edition_brief_body(args, plan: dict, paths: dict) -> str:
    source_lesson = ARTIFACTS / args.book / "lessons" / plan["card"]
    profile = LESSON_SKILL / "profiles" / f"{args.edition}.json"
    lesson_template = _rel(paths["templates"] / "lesson.template.json")
    exercises_template = paths["templates"] / "exercises.template.json"
    lesson_kb = _size_label(paths["templates"] / "lesson.template.json")
    exercises_kb = _size_label(exercises_template)
    document = _json_or_none(
        exercises_template.read_text(encoding="utf-8")
    ) if exercises_template.is_file() else None
    exercise_count = len((document or {}).get("exercises", []))
    return f"""\
把 `{plan['card']}`（{plan.get('title')}）的课文与题改写成 **{args.edition}** 版。

## 只改这两个模板

- `{_rel(paths['templates'] / 'lesson.template.json')}`（{lesson_kb}）
- `{_rel(paths['templates'] / 'exercises.template.json')}`（{exercises_kb}，
  {exercise_count} 道题）—— 大文件，按题逐个 Edit，不要整文件重写

**只改模板**，不要去写持久目录——`adapt-finalize` 负责把通过验收的结果提升进
`{_rel(paths['lesson'])}`。原始课文与题在 `{_rel(source_lesson)}`（只读，不许改）。

## 改什么、不改什么

每一项只改 `text`。**`source_text`、题号、`group`、`group_id`、`figure_refs`、题量
一个都不许动**，块数与题量必须与原书一致。

- 只改文化语境，不改知识点、不改未登记的公式
- 虚构人物换成常见现代英文姓名，同一映射在题面、图像上下文、答案里保持一致
- 小问标号从西里尔 `а) б) в)` 改成拉丁 `a) b) c)`
- 发布文本里不能再出现西里尔字母，也不能有 profile 的禁词
  （`{_rel(profile)}` 的 `forbidden_terms`，先读它一眼——卢布/戈比/少先队这类都在里面）
- 原书用于科学史教学的真实人物、地点、国家、机构**保留身份**，并在该项的
  `historical_entities` 里逐项声明 `term` 与来源绑定的 `reason`
- 非公式数字确需更新时，逐项写入 `numeric_changes`，并在 `changes` 里包含
  `context-number`；来源页 `errata` 已被带进模板，只填 `corrected` 并把该块
  `changes` 标成 `math-correction`
- 排版不用你管：`adapt-finalize` 会确定性分行组段。概念切换的横线这样取：
  `node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs {lesson_template}`
  照它输出的相邻段落 `{{before, after}}` 对象填 `section_breaks`，
  **禁止按块或换行手算整数**

## 自检（写完必须自己跑，绿了再回报）

```bash
.claude/skills/ld-s10y-lesson/.venv/bin/python \\
  .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-finalize \\
  --book {args.book} --edition {args.edition} --lesson {plan['card']}
```

它一次报出全部不通过项（137 条判据：绑定、哈希、原式、块数、题量、禁词、
西里尔残留、分题排版…）。照着一次改完再跑。
**它校验的是 `.tmp` 里的模板，不是持久文件**——改错地方会让你白绕一圈。

图还没写时它会报缺 FigureSpec / 缺 SVG / 缺 render 报告——**那是插图单元的事，
不用你管**。除此之外的任何一条都算你的，必须全绿。

判断方法：把它报出来的每一条看一遍，凡是不含 `figures/` 路径、也不是
「缺 svg / 缺 render / 缺 review 证据路径 / 现代图清单…」这几类的，都是你要修的。
**不要在还有属于你的红的时候回报完成**——那会白烧掉这个单元一次重试额度，
而额度是有限的。

完整字段表在 `.claude/skills/ld-s10y-lesson/references/edition-text-contract.md`。
"""


def phase_edition(args, plan: dict, report: Report) -> bool:
    paths = _edition_paths(args, plan)
    report.phase = "edition"
    templates = [
        paths["templates"] / name for name in
        ("lesson.template.json", "exercises.template.json", "figures.template.json")
    ]
    present = [path for path in templates if path.is_file()]
    if present and len(present) != len(templates) and not args.force_prepare:
        # adapt-prepare 见到任何一个已存在的模板就拒绝，驱动没有参数能走出这个状态
        # （STEMROBIN-192 审查 S7）。不自动 --force：已存在的那些可能是子代理改过的，
        # 强制重建会把它的工作抹掉。
        report.failures.append(
            "现代版模板只剩一部分（上次写到中途，或被人删了一个）："
            f"有 {[path.name for path in present]}，"
            f"缺 {[path.name for path in templates if path not in present]}。"
            f"确认 {_rel(paths['templates'])} 下的内容可以丢弃后，"
            "删掉整个目录再跑，或者加 --force-prepare 让驱动重建"
        )
        report.step("P3 现代版备料", False)
        return False
    if len(present) != len(templates) or args.force_prepare:
        result = _run([
            sys.executable, str(P2C), "adapt-prepare",
            "--book", args.book, "--edition", args.edition,
            "--lesson", plan["card"],
        ] + (["--force"] if args.force_prepare else []))
        if result.returncode != 0:
            report.failures += _tool_failures(result, "adapt-prepare")
            report.step("P3 现代版备料", False)
            return False
        report.step("P3 现代版备料", True, _rel(paths["templates"]))

    rewritten = args.edition_ready or _templates_rewritten(templates[0], templates[1])
    if not rewritten:
        report.gate = GATE_EDITION
        _add_unit(
            report, args.book, plan["card"], "edition", "edition",
            f"改写 {plan['card']} 的现代版文本",
            _edition_brief_body(args, plan, paths),
        )
        report.work_order.append(
            "（判据是「有一条 text 与 source_text 不同，且差异不只是 layout」。"
            "确实一字不改时加 --edition-ready 跳过它。）"
        )
        return False
    report.step("P3 现代版文本", True, "模板已改写")
    return True



# adapt-prepare 自己会把分题拆行、去掉分栏对齐空格，并把这类差异记成
# changes:["layout"]。模板一生成就带着它们，所以「text != source_text」单独
# 不能证明模型写过一个字——3m math3-c1-ex5 实测：30 题里 4 题一出生就是
# layout 差异，G2 于是在现代版文本完全没改的情况下静默通过。
MECHANICAL_CHANGES = {"layout"}


def _templates_rewritten(lesson_template: Path, exercises_template: Path) -> bool:
    """模板是否已经被改写过——判据是「有任何一条 text 与 source_text 不同，
    且这条差异不是 adapt-prepare 自己做的机械排版归一」。"""
    for path, key in ((lesson_template, "prose"), (exercises_template, "exercises")):
        try:
            document = json.loads(path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return False
        for item in document.get(key, []):
            if not isinstance(item, dict):
                continue
            if item.get("text") == item.get("source_text"):
                continue
            changes = item.get("changes")
            tags = set(changes) if isinstance(changes, list) else set()
            # 没有标签的差异也算改写：它过不了 edition.py，但确实有人动过。
            if not tags or tags - MECHANICAL_CHANGES:
                return True
    return False


# --------------------------------------------------------------- P3b 插图
FIGURE_SPEC_RULES = r"""
## FigureSpec 骨架（照抄，不要去 dump 现成的 spec 文件学格式）

```json
{
  "schema": "ld-s10y-image/figure-spec@2",
  "id": "<figure id>",
  "mode": "deterministic",
  "description": "<一句话说清这张图画的是什么>",
  "source": {
    "image": {"path": "<原书 PNG 相对仓库根的路径>", "sha256": "<该文件的 sha256>"},
    "authoritativeText": [{"text": "<相关 edition 题面/正文原文>"}],
    "inventory": [{"id": "<物件>", "description": "<按原图描述，含数值与归属>"}]
  },
  "canvas": {"width": 640, "height": 360,
             "boundingBox": [xMin, yMax, xMax, yMin], "background": "paper"},
  "display": {"layout": "inline", "maxWidthPx": 640, "minTextPx": 16,
              "widths": [331, 640]},
  "objects": [],
  "assertions": []
}
```

## 会把 spec 挡回来的数值边界（先对一遍，省一轮）

- `canvas.width` / `canvas.height` 都必须是 **320–4096** 的整数（**高度也不能小于 320**）
- `boundingBox` 是 `[xMin, yMax, xMax, yMin]`，要求 `xMin < xMax` 且 `yMin < yMax`
- `display.minTextPx ≥ 16`；`display.widths` 每项 128–1600；
  `layout: inline` 时 `widths` 必须含一个 ≤352 的产品宽度（移动端 331）
- `display.maxWidthPx`：`instructional` 取 240–960，`decorative` 取 128–240
- 颜色只用语义角色 `ink` / `muted` / `accent` / `accentSoft` / `grid` / `paper`，
  不写具体色值
- 标签文字只能是英文、数字、数学符号——**禁止中文、西里尔文**
- 几何物件必须配 `assertions`；`source.inventory` 不能空
- 关系用 `gridDimensions` / `displacement` / `inside` / `connects` 断言表达，
  **不要用 `objectCount` 代替关系断言**

## 两条红线

- **禁止泄答案**：不添加原图没有的解答标注
- **标签位置不用你算**：写 `labelPlacement.position` 当首选就行。渲染器自己错位
  （八个方位）、错开（gap ×1/1.5/2.25/3）、扩画布（边距 8%/16%/25%，且只在实测字号
  仍 ≥ `minTextPx` 时接受），解不开才失败并报出它试过哪些布局。不要手工调坐标去凑。

更深的字段说明在 `.agents/skills/ld-s10y-image/references/figure-spec.md`。
"""


def _figure_brief_body(args, plan: dict, paths: dict, figure: dict) -> str:
    figure_id = figure.get("id")
    spec_path = paths["edition"] / figure.get("spec", "")
    source_dir = ARTIFACTS / args.book / "figures"
    svg_path = paths["edition"] / (figure.get("svg") or "")
    render_path = paths["edition"] / (figure.get("render") or "")
    review_path = paths["edition"] / (figure.get("review") or "")
    exercises = paths["templates"] / "exercises.template.json"
    candidates = " 或 ".join(
        f"`{_rel(source_dir / f'{figure_id}{suffix}')}`" for suffix in (".png", ".svg")
    )
    return f"""\
为 `{plan['card']}` 的插图 **{figure_id}** 写 FigureSpec，渲出来，并做目视验收。

## 要读的

- **原书图**：{candidates} —— 这是保真的基准，必须打开看
- 相关题面（现代版，语义真相）：`{_rel(exercises)}` 里 `figure_refs` 或 `figures`
  含 `{figure_id}` 的那几题。`source.authoritativeText` 就从这些题的 `text` 原样摘。

`source.image.sha256` 这样算（填哪个文件就算那个文件）：

```bash
shasum -a 256 {_rel(source_dir)}/{figure_id}.png | cut -d" " -f1
```

## 要写的

1. `{_rel(spec_path)}` —— FigureSpec，格式见下
2. 然后跑渲染，它会写出 `{_rel(svg_path)}` 和 `{_rel(render_path)}`
3. 最后记目视验收证据 `{_rel(review_path)}`

{FIGURE_SPEC_RULES}
## 自检与验收（三步都要自己跑完，绿了再回报）

```bash
P=.claude/skills/ld-s10y-lesson/.venv/bin/python
I=.agents/skills/ld-s10y-image/scripts

$P $I/validate_spec.py {_rel(spec_path)} --stage draft --json
node $I/render_spec.mjs --spec {_rel(spec_path)} \\
  --svg {_rel(svg_path)} --report {_rel(render_path)}
$P $I/validate_spec.py {_rel(spec_path)} --stage rendered --json
```

`validate_spec` 一次报出全部判据；渲染失败时报告里有 `layout.attempts`，
写着渲染器试过哪些边距与方位——照它说的改，不要自己猜坐标。

三步都绿之后，**打开渲出来的 SVG 和原书 PNG 逐项对照**（物件数、数值、
相对位置、标签归属），确认保真后记证据：

```bash
$P $I/record_review.py --spec {_rel(spec_path)} --render {_rel(render_path)} \\
  --output {_rel(review_path)} --status pass --notes "<你对照了什么>"
```

对不上就改 spec 重来；**不要用 `--status pass` 盖过一张不保真的图**。

## 零付费图像调用

`mode` 只能是 `deterministic` 或 `hybrid`。需要 `generated`（Azure gpt-image-2）的图
**停下来回报，不要自己调** —— 本单零付费图像调用，而且那把 key 当前是失效的。
"""


def _figure_tool_errors(args, paths: dict, figure: dict) -> list[str]:
    """一张图的全部不通过项：draft spec、渲染、rendered spec，一次收齐。"""
    figure_id = figure.get("id")
    spec_path = paths["edition"] / figure.get("spec", "")
    svg_path = paths["edition"] / (figure.get("svg") or "")
    render_path = paths["edition"] / (figure.get("render") or "")
    failures: list[str] = []
    validation = _run([
        sys.executable, str(IMAGE_SKILL / "scripts" / "validate_spec.py"),
        str(spec_path), "--stage", "draft", "--json",
    ])
    payload = _json_or_none(validation.stdout)
    if payload is None:
        failures.append(
            f"{figure_id} spec(draft): validator 输出异常 "
            f"{(validation.stderr or validation.stdout).strip()[:200]}"
        )
    else:
        failures += [f"{figure_id} spec(draft): {e}" for e in payload.get("errors", [])]

    spec = _json_or_none(spec_path.read_text(encoding="utf-8")) or {}
    argv = [
        "node", str(IMAGE_SKILL / "scripts" / "render_spec.mjs"),
        "--spec", str(spec_path), "--report", str(render_path), "--svg", str(svg_path),
    ]
    if spec.get("mode") == "hybrid":
        argv += ["--artwork", str(paths["edition"] / (figure.get("artwork") or ""))]
    render = _run(argv)
    if render.returncode != 0:
        failures += _render_failures(figure_id, render, render_path)
    else:
        validation = _run([
            sys.executable, str(IMAGE_SKILL / "scripts" / "validate_spec.py"),
            str(spec_path), "--stage", "rendered", "--json",
        ])
        payload = _json_or_none(validation.stdout) or {}
        failures += [
            f"{figure_id} spec(rendered): {e}" for e in payload.get("errors", [])
        ]
    return failures


def phase_figures(args, plan: dict, report: Report) -> bool:
    paths = _edition_paths(args, plan)
    report.phase = "figures"
    manifest_path = paths["templates"] / "figures.template.json"
    figures = json.loads(manifest_path.read_text(encoding="utf-8")).get("figures", [])
    todo: list[tuple[dict, list[str]]] = []
    for figure in figures:
        figure_id = figure.get("id")
        spec_path = paths["edition"] / figure.get("spec", "")
        review_path = paths["edition"] / (figure.get("review") or "")
        if not spec_path.is_file():
            todo.append((figure, []))
            continue
        spec = _json_or_none(spec_path.read_text(encoding="utf-8")) or {}
        if spec.get("mode") == "generated":
            report.stops.append(
                f"{figure_id}: FigureSpec 是 generated 模式，需要付费的 Azure gpt-image-2。"
                "本单零付费图像调用——改成 deterministic/hybrid，或者让人来决定"
            )
            continue
        # 每张图都跑完，一张失败不跳过其余（工单 Scope：一次报出全部）
        failures = _figure_tool_errors(args, paths, figure)
        if not failures:
            review = (
                _json_or_none(review_path.read_text(encoding="utf-8"))
                if review_path.is_file() else None
            )
            if review is None:
                failures.append(
                    f"{figure_id}: 缺目视验收证据 {_rel(review_path)}"
                    "（对照原书 PNG 后用 record_review.py 记下来）"
                )
            elif review.get("status") != "pass":
                # record_review.py 的 --status 允许 fail 并照写文件，只看文件在不在
                # 会放行一张自述不保真的图（STEMROBIN-192 审查 S14）。
                failures.append(
                    f"{figure_id}: 目视验收记的是 status={review.get('status')!r}，"
                    "不是 pass——改 spec 重渲到真的保真，不要用 pass 盖过去"
                )
        if failures:
            todo.append((figure, failures))

    if report.stops:
        report.step("P3 插图", False, f"{len(figures)} 张")
        return False
    if todo:
        report.gate = GATE_FIGURES
        report.step("P3 插图", False, f"{len(todo)}/{len(figures)} 张没过")
        for figure, failures in todo:
            unit_id = f"figure-{figure.get('id')}"
            if not _add_unit(
                report, args.book, plan["card"], unit_id, "figure",
                f"做 {plan['card']} 的插图 {figure.get('id')}",
                _figure_brief_body(args, plan, paths, figure), failures,
            ):
                report.failures += failures or [f"{unit_id}: 缺 FigureSpec"]
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
    if not failures:
        report.step("P3 现代版收口", True)
        return True

    # 收口的失败按归属分流回各自的单元：提到某张图的回那张图，其余回文本单元。
    # 这一步以前是把失败报给本会话去改——那正是「模型在操作循环里」。
    paths = _edition_paths(args, plan)
    manifest = _json_or_none(
        (paths["templates"] / "figures.template.json").read_text(encoding="utf-8")
    ) or {}
    figure_ids = [
        item.get("id") for item in manifest.get("figures", []) if item.get("id")
    ]
    by_unit: dict[str, list[str]] = {}
    for failure in failures:
        owner = next((fid for fid in figure_ids if fid and fid in failure), None)
        key = f"figure-{owner}" if owner else "edition"
        by_unit.setdefault(key, []).append(failure)

    report.step("P3 现代版收口", False, f"{len(failures)} 项，分流到 {len(by_unit)} 个单元")
    report.gate = GATE_EDITION if "edition" in by_unit else GATE_FIGURES
    for unit_id, unit_failures in by_unit.items():
        if unit_id == "edition":
            ok = _add_unit(
                report, args.book, plan["card"], "edition", "edition",
                f"修 {plan['card']} 的现代版文本",
                _edition_brief_body(args, plan, paths), unit_failures,
            )
        else:
            figure = next(
                (item for item in manifest.get("figures", [])
                 if f"figure-{item.get('id')}" == unit_id), None,
            )
            if figure is None:
                report.failures += unit_failures
                continue
            ok = _add_unit(
                report, args.book, plan["card"], unit_id, "figure",
                f"修 {plan['card']} 的插图 {figure.get('id')}",
                _figure_brief_body(args, plan, paths, figure), unit_failures,
            )
        if not ok:
            report.failures += unit_failures
    return False


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
        # 终点，不是 gate：做成 gate 的话，按 SKILL「反复跑到它说 done」照做就是
        # 死循环，真正的出口藏在一行工单里（STEMROBIN-192 审查 S12）。
        report.step(
            "P4 入库", True,
            "--no-publish：预检通过，真实入库留给人执行",
        )
        report.work_order.append(
            f"真实入库：node {_rel(PUBLISH)} {_rel(book_dir)} "
            f"--edition {args.edition} --lesson {plan['card']}"
        )
        report.done = True
        return True

    live = _run([
        "node", str(PUBLISH), str(book_dir),
        "--edition", args.edition, "--lesson", plan["card"],
    ])
    report.failures += _tool_failures(live, "publish")
    if report.failures:
        report.step("P4 入库", False)
        return False
    report.step("P4 入库", True, _published_line(live.stdout, plan["card"]))
    _clear_attempts(args.book, plan["card"])
    report.done = True
    return True


def _published_line(stdout: str, card: str) -> str:
    """publish.mjs 收尾会把 sr_lessons 整张表列一遍（`· <id> …`，按 id 排序），
    所以 stdout 的最后一行是全库最后一课，不是本次写进去的那一课。取
    `✓ <card>` 这条确认行与它对应的那条清单行，别再把别人的课报成交付。"""
    lines = [line.strip() for line in stdout.splitlines() if line.strip()]
    written = [line for line in lines if line.lstrip("✓ ").strip() == card]
    listed = [line for line in lines if line.lstrip("· ").startswith(f"{card}  ")]
    detail = " ".join(listed or written)
    return detail or f"{card}（publish 没有回报这一课，请看 publish 输出）"


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
