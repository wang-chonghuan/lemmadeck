#!/usr/bin/env python
"""ld-s10y-lesson —— 扫描教材 PDF → 按小节成课、按题成件。

    p2c.py prepare   --book 5m --page 15      # 在 .tmp 渲染整页 + 坐标网格图
    #  ↓ 视觉环节：读 .tmp 里的 page.grid.png，写持久 page.md（带类型的块）
    p2c.py finalize  --book 5m --page 15      # 吸附裁图 + 规范化 + 页级体检
    p2c.py assemble  --book 5m                # 跨页装订 → 小节 + 独立编号的题
    p2c.py vectorize --book 5m                # 插图 PNG → SVG（描摹 + 保真自检）
    p2c.py adapt-prepare  --book 5m --edition modern-us-neutral --lesson id
    p2c.py adapt-finalize --book 5m --edition modern-us-neutral --lesson id
    p2c.py render    --book 5m --edition modern-us-neutral [--lesson id]
    p2c.py publish   --book 5m --edition modern-us-neutral --lesson id

机器不猜哪里是图、哪一段是第几题——那是模型看图的活；
模型也不量像素、不做跨页拼接、不做全书对账——那是机器的活。
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import blocks as B
import layout
import mathcheck
import normalize as nz
from PIL import Image

SKILL = Path(__file__).resolve().parent.parent
TOOLS = SKILL / "tools"
REPO = Path(__file__).resolve().parents[4]
DEFAULT_ROOT = Path("ssot-resources/soviet10year-textbooks/artifacts")
DEFAULT_BOOKS = Path("ssot-resources/soviet10year-textbooks/sources")
DEFAULT_WORK = Path(".tmp/ld-s10y-lesson")
DEFAULT_PROFILE = SKILL / "profiles" / "soviet-cn.json"

ENUM_LINE = re.compile(r"^\s*(?:\d+\.\s*)?([A-Za-z\u0400-\u04ff])\s*[)）]", re.M)


def _dump(p: Path, o) -> None:
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(o, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def _book_dir(a) -> Path:
    return Path(a.root) / a.book


def _page_dir(a, page: int) -> Path:
    return _book_dir(a) / "pages" / f"{page:04d}"


def _work_page_dir(a, page: int) -> Path:
    return Path(a.work) / a.book / "pages" / f"{page:04d}"


def _source_manifest(a) -> tuple[Path, dict] | None:
    path = Path(a.books) / "manifest.json"
    if not path.is_file():
        return None
    try:
        return path, json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise SystemExit(f"ERROR: source manifest 不是有效 JSON: {path}: {error}")


def _catalog_config(a) -> dict:
    loaded = _source_manifest(a)
    if loaded is None:
        return {}
    _, manifest = loaded
    return next(
        (
            catalog
            for catalog in manifest.get("catalogs", [])
            if catalog.get("book") == a.book
        ),
        {},
    )


def _manifest_path(manifest_path: Path, value: str) -> Path:
    path = Path(value)
    if path.is_absolute():
        return path
    candidates = (REPO / path, manifest_path.parent / path)
    return next((candidate for candidate in candidates if candidate.exists()), candidates[-1])


def _find_pdf(a) -> Path:
    if getattr(a, "pdf", None):
        return Path(a.pdf)
    loaded = _source_manifest(a)
    if loaded is not None:
        manifest_path, manifest = loaded
        catalog = next(
            (
                item
                for item in manifest.get("catalogs", [])
                if item.get("book") == a.book
            ),
            None,
        )
        if catalog is not None:
            source_id = catalog.get("sourcePdf")
            if not source_id:
                raise SystemExit(f"ERROR: {a.book!r} 没有可用的 sourcePdf")
            record = next(
                (
                    item
                    for item in manifest.get("pdfs", [])
                    if item.get("book") == source_id
                ),
                None,
            )
            if record is None:
                raise SystemExit(
                    f"ERROR: {a.book!r} 的 sourcePdf {source_id!r} 未在 manifest.pdfs 声明"
                )
            pdf_root = _manifest_path(manifest_path, manifest.get("pdfRoot", ""))
            pdf = pdf_root / record.get("file", "")
            if not pdf.is_file():
                raise SystemExit(f"ERROR: source manifest 指向的 PDF 不存在: {pdf}")
            return pdf
    books = Path(a.books)
    pattern = f"{a.series}/*.pdf" if getattr(a, "series", None) else "*/*.pdf"
    hits = sorted(p for p in books.glob(pattern)
                  if p.stem == a.book or p.stem.startswith(a.book + " "))
    if not hits:
        raise SystemExit(f"ERROR: {books}/{pattern} 里找不到书名以 {a.book!r} 开头的 PDF")
    if len(hits) > 1:
        raise SystemExit(f"ERROR: {a.book!r} 匹配到多本，用 --series 指明: "
                         + ", ".join(f"{p.parent.name}/{p.name}" for p in hits))
    return hits[0]


def _reusable_figure_geometry(
    meta: dict,
    prior_audit: dict,
    figure_id: str,
    requested_box: list[int],
    render_sha256: str,
) -> tuple[list[int], dict] | None:
    if not meta.get("provenance", {}).get("normalized"):
        return None
    if meta.get("render", {}).get("sha256") != render_sha256:
        return None

    for figure in prior_audit.get("figures", []):
        if figure.get("id") != figure_id or figure.get("box") != requested_box:
            continue
        info = {
            key: value
            for key, value in figure.items()
            if key not in {"id", "label", "box"}
        }
        return list(requested_box), info
    return None


TEMPLATE = """---
{meta}
---

<!-- 照着 page.grid.png 写。块头声明这一块是什么，块体里**一行 = 印刷一行**：

  <!-- h1 --> 章  <!-- h2 --> §  <!-- h3 --> 小节标题
  <!-- p -->  正文段
  <!-- exhead --> 习题栏标题（复习题/家庭作业题）
  <!-- ex 20 --> 第 20 题（原书题号）
  <!-- fig 图 7 box 790,1640,490,250 -->  插图/表格，框照网格估，收口会吸附
  <!-- cap 图 7 --> 印刷出来的图题行     <!-- foot --> 页码

块头可加 cont（承接上页同一对象）/ open（延续到下页），跨页装订全靠这两个标记。
一条公式被印刷从中间切开时：公式写完整，断点处写 ↵。
确认的数学印刷错误仍照抄，并在 frontmatter 的 errata 中登记
{{"id":"pNNNN-math-1","block":"pNNNN#K","original":"$原式$","reason":"核验说明"}}。
删掉本条注释。 -->
"""


def _validate_page_errata(meta: dict, blocks: list[dict], page: int) -> list[str]:
    records = meta.get("errata", [])
    if not isinstance(records, list):
        return ["errata 必须是数组"]
    errors = []
    seen = set()
    by_ref = {
        f"p{page:04d}#{index + 1}": block
        for index, block in enumerate(blocks)
    }
    for index, record in enumerate(records):
        label = f"errata[{index}]"
        if not isinstance(record, dict):
            errors.append(f"{label} 必须是对象")
            continue
        erratum_id = record.get("id")
        block_ref = record.get("block")
        original = record.get("original")
        reason = record.get("reason")
        if not isinstance(erratum_id, str) or not erratum_id.strip():
            errors.append(f"{label}.id 不能为空")
        elif erratum_id in seen:
            errors.append(f"{label}.id={erratum_id!r} 重复")
        else:
            seen.add(erratum_id)
        if block_ref not in by_ref:
            errors.append(f"{label}.block 必须指向本页现有块")
            continue
        if not isinstance(original, str) or not original.strip():
            errors.append(f"{label}.original 不能为空")
        elif original not in B.text_of(by_ref[block_ref]):
            errors.append(f"{label}.original 不在 {block_ref} 的忠实转写中")
        if not isinstance(reason, str) or not reason.strip():
            errors.append(f"{label}.reason 不能为空")
    return errors


# ---------------------------------------------------------------- cap1 备料
def cmd_prepare(a) -> int:
    pdf = _find_pdf(a)
    pdir = _work_page_dir(a, a.page)
    pdir.mkdir(parents=True, exist_ok=True)

    png = layout.render_page(pdf, a.page, pdir / "page.png", dpi=a.dpi)
    layout.grid_overlay(png, pdir / "page.grid.png")
    img = Image.open(png)
    ink = layout.ink_mask(img)
    cols = ink.any(axis=0).nonzero()[0]
    content_w = int(cols[-1] - cols[0] + 1) if cols.size else img.width
    bands = layout.line_bands(ink, content_w)

    profile = json.loads(DEFAULT_PROFILE.read_text(encoding="utf-8"))
    meta = {
        "schema": "ld-s10y-lesson/page@3", "book": a.book, "page": a.page,
        "printed_page": None,
        "source": {"pdf": pdf.name, "pdf_sha256": layout.sha256_file(pdf),
                   "pdf_page": a.page},
        "render": {"dpi": a.dpi, "w": img.width, "h": img.height,
                   "sha256": layout.sha256_file(png)},
        "profile": {"id": profile["id"], "sha256": layout.sha256_file(DEFAULT_PROFILE)},
        "notes": [],
        "errata": [],
    }
    _dump(pdir / "layout.json", {"w": img.width, "h": img.height,
                                 "content_width": content_w,
                                 "line_bands": [[int(x), int(y)] for x, y in bands]})
    if not (pdir / "page.template.md").exists() or a.force:
        (pdir / "page.template.md").write_text(
            TEMPLATE.format(meta=json.dumps(meta, ensure_ascii=False, indent=2)),
            encoding="utf-8")
    print(f"[prepare] {a.book} p{a.page:04d} -> {pdir}")
    print(f"  {img.width}x{img.height} @{a.dpi}dpi  印刷行 {len(bands)} 行"
          f"  读图用 page.grid.png（网格 {layout.GRID}px）")
    print(f"  按模板写入持久文件 {_page_dir(a, a.page) / 'page.md'}")
    return 0


# ---------------------------------------------------------------- cap1 收口
def cmd_finalize(a) -> int:
    pdir = _page_dir(a, a.page)
    work = _work_page_dir(a, a.page)
    md_path = pdir / "page.md"
    if not md_path.exists():
        print(f"ERROR: 缺少 {md_path}（视觉转写尚未产出）", file=sys.stderr)
        return 2

    meta, blks = B.parse(md_path.read_text(encoding="utf-8"))
    profile = nz.load_profile(DEFAULT_PROFILE)
    render_path = work / "page.png"
    if not render_path.exists():
        print(f"ERROR: 缺少 {render_path}（先运行 prepare；.tmp 可随时重建）", file=sys.stderr)
        return 2
    img = Image.open(render_path)
    ink = layout.ink_mask(img)
    render_sha256 = layout.sha256_file(render_path)
    audit_path = pdir / "audit.json"
    prior_audit = {}
    if audit_path.exists():
        try:
            prior_audit = json.loads(audit_path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            prior_audit = {}
    errors: list[str] = []

    # 1) 插图：粗框吸附到真实墨迹再裁；文件名用原书图号，跨页唯一
    figs, seq = [], 0
    for b in blks:
        if b["kind"] != "fig":
            continue
        seq += 1
        if not b.get("box"):
            errors.append(f"fig {b.get('label')}: 缺 box")
            continue
        b["id"] = B.fig_id(b.get("label"), a.page, seq)
        reused = _reusable_figure_geometry(
            meta, prior_audit, b["id"], b["box"], render_sha256
        )
        box, info = reused if reused is not None else layout.snap(ink, b["box"])
        b["box"] = box
        layout.crop(render_path, box, work / "figures" / f"{b['id']}.png")
        figs.append({"id": b["id"], "label": b.get("label"), "box": box, **info})
        if info.get("components", 0) == 0:
            errors.append(f"{b['id']}: 粗框里没有完整连通域，框可能给错了")
    for i in range(len(figs)):
        for j in range(i + 1, len(figs)):
            (x1, y1, w1, h1), (x2, y2, w2, h2) = figs[i]["box"], figs[j]["box"]
            if x1 < x2 + w2 and x2 < x1 + w1 and y1 < y2 + h2 and y2 < y1 + h1:
                errors.append(f"{figs[i]['id']} 与 {figs[j]['id']} 框重叠，"
                              "同一块墨迹会被裁两次")
    keep = {f"{f['id']}.png" for f in figs}
    for stale in (work / "figures").glob("*.png"):
        if stale.name not in keep:
            stale.unlink()

    # 2) 行数对账：挖掉插图后的印刷行数 == 块体行数。页级唯一的完整性硬证据。
    masked = ink.copy()
    for f in figs:
        x, y, w, h = f["box"]
        masked[max(0, y):y + h, max(0, x):x + w] = False
    cols = ink.any(axis=0).nonzero()[0]
    content_w = int(cols[-1] - cols[0] + 1) if cols.size else img.width
    want = len(layout.line_bands(masked, content_w))
    got = B.printed_lines(blks)
    if want != got:
        errors.append(f"行数对不上：印刷 {want} 行，块体 {got} 行"
                      "（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）")

    # 3) 规范化 + 字符 + 公式 + 小问标号
    applied = []
    for b in blks:
        for i, ln in enumerate(b["lines"]):
            new, ch = nz.normalize_text(ln, profile)
            if new != ln:
                b["lines"][i] = new
                applied.append({"kind": b["kind"], "rules": sorted({c["rule"] for c in ch})})

    unknown, texts = [], []
    for n, b in enumerate(blks):
        t = B.text_of(b, join="")
        if not t and b["kind"] in B.KINDS_TEXT:
            errors.append(f"块 #{n+1} ({b['kind']}) 是空的")
        texts.append({"id": f"{b['kind']}#{n+1}", "text": t})
        for bad in nz.check_charset(t, profile):
            unknown.append({**bad, "block": f"{b['kind']}#{n+1}"})
    if unknown:
        errors.append("白名单外字符 %d 处: %s" % (
            len(unknown), ", ".join(f"{u['char']}({u['codepoint']})" for u in unknown[:8])))

    m_err, m_warn = mathcheck.collect_and_check(texts, lambda x: [("text", x["text"])])
    # 跨页残片的公式配不平是必然的，校验义务推给 assemble（那时才有完整公式）
    open_ids = {f"{b['kind']}#{i+1}" for i, b in enumerate(blks) if b["open"] or b["cont"]}
    for e in m_err:
        if e.split(".")[0] in open_ids and "花括号" in e or e.split(".")[0] in open_ids and "配对" in e:
            continue
        errors.append(e)

    for i, b in enumerate(blks):
        if profile.get("enum_marker_script") != "cyrillic":
            break
        for key in ENUM_LINE.findall(B.text_of(b, join="\n")):
            if nz.enum_key_script(key) not in ("cyrillic", "numeric"):
                errors.append(f"{b['kind']}#{i+1}: 小问标号 {key!r} 不是西里尔")

    errors += _validate_page_errata(meta, blks, a.page)

    if meta.get("printed_page") is None:
        errors.append("printed_page 未填（页码承载溯源，不能空）")

    pdf = _find_pdf(a)
    meta |= {
        "schema": "ld-s10y-lesson/page@3", "book": a.book, "page": a.page,
        "source": {"pdf": pdf.name, "pdf_sha256": layout.sha256_file(pdf),
                   "pdf_page": a.page},
        "render": {"dpi": meta.get("render", {}).get("dpi", 300),
                   "w": img.width, "h": img.height,
                   "sha256": render_sha256},
        "profile": {"id": profile["id"], "sha256": layout.sha256_file(DEFAULT_PROFILE)},
        "printed_lines": got, "figures": [{"id": f["id"], "label": f["label"],
                                           "box": f["box"]} for f in figs],
        "provenance": {"cap": "1", "normalized": True},
    }
    md_path.write_text(B.dump(meta, blks, a.page), encoding="utf-8")
    _dump(pdir / "page.json", {"meta": meta, "blocks": blks})
    _dump(pdir / "audit.json", {"page": a.page, "lines_printed": want, "lines_md": got,
                                "figures": figs, "normalizations": applied,
                                "unknown_chars": unknown, "katex_warnings": m_warn,
                                "errata": len(meta.get("errata", [])),
                                "errors": errors})

    print(f"[finalize] {a.book} p{a.page:04d}: {len(blks)} 块 / {got} 行"
          f"（印刷 {want}）, 插图 {len(figs)} 张, 规范化 {len(applied)} 处")
    for f in figs:
        print(f"    {f['id']}({f['label']}) → {f['box']}")
    if errors:
        print(f"  ✗ 失败 {len(errors)} 项:")
        for e in errors:
            print(f"    - {e}")
        return 1
    print("  ✓ 通过 行数对账 + 白名单 + 公式")
    return 0


# ---------------------------------------------------------------- cap2 装订
def cmd_assemble(a) -> int:
    import assemble
    catalog = _catalog_config(a)
    return assemble.run(_book_dir(a), Path(a.toc) if a.toc else None,
                        DEFAULT_PROFILE, strict=not a.lenient,
                        work=Path(a.work) / a.book,
                        exercise_numbering=catalog.get("exerciseNumbering", "book"))


# ---------------------------------------------------------------- cap3 矢量化
def cmd_vectorize(a) -> int:
    import vectorize as V
    work = Path(a.work) / a.book
    pngs = sorted(work.glob("pages/*/figures/*.png"))
    if a.page:
        pngs = [p for p in pngs if f"/{a.page:04d}/" in str(p)]
    ok = fail = 0
    for png in pngs:
        svg = png.with_suffix(".svg")
        r = V.vectorize(png, svg, turdsize=a.turdsize)
        mark = "✓" if r["ok"] else "✗"
        if "mismatch_ratio" in r:
            detail = (
                f"不匹配 {r['mismatch_ratio'] * 100:.3f}%  "
                f"{svg.stat().st_size // 1024}KB"
            )
        else:
            detail = r.get("error", "矢量化失败")
        print(f"  {mark} {png.parent.parent.name}/{png.stem}  {detail}")
        ok, fail = (ok + 1, fail) if r["ok"] else (ok, fail + 1)
    print(f"[vectorize] {ok} 张通过, {fail} 张不匹配超限")
    return 1 if fail else 0


# ---------------------------------------------------------------- cap4 现代 edition
def cmd_adapt(a, command: str) -> int:
    args = [
        sys.executable, str(TOOLS / "edition.py"), command,
        "--book", a.book,
        "--edition", a.edition,
        "--root", a.root,
        "--work", a.work,
    ]
    for lesson in a.lesson or []:
        args += ["--lesson", lesson]
    if command == "prepare" and a.force:
        args.append("--force")
    return subprocess.run(args).returncode


def cmd_adapt_prepare(a) -> int:
    return cmd_adapt(a, "prepare")


def cmd_adapt_finalize(a) -> int:
    return cmd_adapt(a, "finalize")


# ---------------------------------------------------------------- cap5 成品
def cmd_render(a) -> int:
    book = _book_dir(a)
    out = Path(a.work) / "render" / a.book / (a.edition or "source")
    args = ["node", str(TOOLS / "render_lesson.js"), str(book), "--out", str(out)]
    if a.edition:
        args += ["--edition", a.edition]
    for lesson in a.lesson or []:
        args += ["--lesson", lesson]
    return subprocess.run(args).returncode


# ---------------------------------------------------------------- cap6 入库
def cmd_publish(a) -> int:
    args = [
        "node", str(TOOLS / "publish.mjs"), str(_book_dir(a)),
        "--edition", a.edition,
    ]
    for lesson in a.lesson or []:
        args += ["--lesson", lesson]
    if a.dry:
        args.append("--dry")
    args += ["--env", a.env]
    return subprocess.run(args).returncode


def main() -> int:
    ap = argparse.ArgumentParser(prog="p2c.py", description="扫描教材 → 小节 + 题")
    sub = ap.add_subparsers(dest="cmd", required=True)

    def common(p, page=True):
        p.add_argument("--book", required=True)
        if page:
            p.add_argument("--page", type=int, required=True)
        p.add_argument("--root", default=str(DEFAULT_ROOT))
        p.add_argument("--books", default=str(DEFAULT_BOOKS))
        p.add_argument("--work", default=str(DEFAULT_WORK))
        p.add_argument("--series", default=None)
        p.add_argument("--pdf", default=None)

    p = sub.add_parser("prepare", help="渲染整页 + 坐标网格图")
    common(p); p.add_argument("--dpi", type=int, default=300)
    p.add_argument("--force", action="store_true"); p.set_defaults(fn=cmd_prepare)

    p = sub.add_parser("finalize", help="吸附裁图 + 规范化 + 页级体检")
    common(p); p.set_defaults(fn=cmd_finalize)

    p = sub.add_parser("assemble", help="跨页装订 → 小节 + 独立编号的题")
    common(p, page=False)
    p.add_argument("--toc", default=None, help="TOC JSON；给了就核对小节覆盖")
    p.add_argument("--lenient", action="store_true", help="对账不通过也写出产物")
    p.set_defaults(fn=cmd_assemble)

    p = sub.add_parser("vectorize", help="插图 PNG → SVG（描摹 + 保真自检）")
    common(p, page=False); p.add_argument("--page", type=int, default=None)
    p.add_argument("--turdsize", type=int, default=2); p.set_defaults(fn=cmd_vectorize)

    for command, handler in (
        ("adapt-prepare", cmd_adapt_prepare),
        ("adapt-finalize", cmd_adapt_finalize),
    ):
        p = sub.add_parser(command, help="生成或验证现代主题 edition")
        common(p, page=False)
        p.add_argument("--edition", required=True)
        p.add_argument("--lesson", action="append", required=True)
        if command == "adapt-prepare":
            p.add_argument("--force", action="store_true")
        p.set_defaults(fn=handler)

    p = sub.add_parser("render", help="自包含 HTML：课文页 + 习题页")
    common(p, page=False)
    p.add_argument("--edition", default=None)
    p.add_argument("--lesson", action="append")
    p.set_defaults(fn=cmd_render)

    p = sub.add_parser("publish", help="把已通过审计的 edition 写进内容库")
    common(p, page=False)
    p.add_argument("--edition", required=True)
    p.add_argument("--lesson", action="append", required=True)
    p.add_argument("--dry", action="store_true", help="只打印要写什么，不连库")
    p.add_argument("--env", default=".env", help="连接串所在的 .env")
    p.set_defaults(fn=cmd_publish)

    a = ap.parse_args()
    return a.fn(a)


if __name__ == "__main__":
    raise SystemExit(main())
