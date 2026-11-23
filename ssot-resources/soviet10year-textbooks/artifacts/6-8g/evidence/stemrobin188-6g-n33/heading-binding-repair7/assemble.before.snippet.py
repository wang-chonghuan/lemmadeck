SEC_NUM = re.compile(
    r"^\s*(?:§\s*)?(?=\$?(\d+))(?:\d+(?:\*|\$\^\{\*\}\$)?|\$\d+(?:\^\{[+*]\})?\$)"
    r"\s*(?:\$\\blacktriangledown\$\s*)?(?:[.．、]\s*|\s+)(\S.*)$"
)

def _slug(text: str) -> str:
    return re.sub(r"[^\w一-鿿]+", "-", text.strip()).strip("-")[:40]

def cut_lessons(
    stream: list[dict],
    toc: Path | None = None,
    binding_errors: list[dict] | None = None,
) -> list[dict]:
    """h3 或 TOC 确认的独立 exhead 开一课；普通习题栏仍属于当前课。"""
    lessons, pending = [], {"h1": None, "h2": None}
    exhead_boundaries = _toc_exhead_boundaries(toc) if toc is not None else set()
    cur = None
    preface = []
    for b in stream:
        if b["kind"] in ("h1", "h2"):
            pending[b["kind"]] = B.text_of(b)
            if b["kind"] == "h1":
                pending["h2"] = None
            continue
        if b["kind"] == "p" and b.get("label") == "preface":
            preface.append(b)
            continue
        standalone_exhead = (
            b["kind"] == "exhead"
            and (B.text_of(b), b.get("printed_page")) in exhead_boundaries
        )
        if b["kind"] == "h3" or standalone_exhead:
            title = B.text_of(b)
            m = SEC_NUM.match(title)
            cur = {"chapter": pending["h1"], "section": pending["h2"],
                   "number": m.group(1) if m else None,
                   "title": m.group(2).strip() if m else title,
                   "printed_title": title,
                   "blocks": preface + ([b] if standalone_exhead else []),
                   "start_page": b["page"], "start_printed": b.get("printed_page")}
            preface = []
            lessons.append(cur)
            continue
        if b["kind"] == "foot":
            if b.get("label") != "note":
                continue
            if b.get("owner_exercise"):
                matches = [
                    candidate
                    for lesson in lessons
                    for candidate in lesson["blocks"]
                    if candidate["kind"] == "ex"
                    and str(candidate.get("label")) == str(b["owner_exercise"])
                ]
                if len(matches) != 1:
                    error = "教学脚注 owner-ex 无法唯一绑定已出现的原题"
                    if binding_errors is None:
                        raise ValueError(error)
                    binding_errors.append({
                        "page": b["page"], "ref": b["ref"], "error": error,
                        "affected_refs": [
                            ref for target in matches
                            for ref in target.get("spans") or [target["ref"]]
                        ],
                    })
                    continue
                target = matches[0]
                target["lines"] = target["lines"] + ["\n".join(b["lines"])]
                target.setdefault("spans", [target["ref"]]).append(b["ref"])
                continue
            b = {**b, "kind": "p"}
        if cur is None:                     # 小节标题之前的内容（承前页的残段）
            cur = {"chapter": pending["h1"], "section": pending["h2"], "number": None,
                   "title": "（承上页）", "printed_title": None, "blocks": [],
                   "start_page": b["page"], "start_printed": b.get("printed_page")}
            lessons.append(cur)
        cur["blocks"].append(b)
    if preface:
        raise ValueError("preface 没有后续 h3，不能静默丢弃章节导语")
    return lessons
