"""Independent heading-only checks; never import or execute the assembler."""
import argparse
import ast
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
PRODUCTION = ROOT / ".claude/skills/ld-s10y-lesson/tools/assemble.py"
TOC = ROOT / "ssot-resources/soviet10year-textbooks/toc/10c/zh.json"
SOURCE_TITLE = (
    "\u81ea\u7136\u5bf9\u6570\u4f5c\u4e3a\u5177\u6709"
    "\u53ef\u53d8\u79ef\u5206\u4e0a\u9650\u7684\u79ef\u5206"
)
REPRODUCTION = ("reported-header", "$114^{*}$. " + SOURCE_TITLE, ("114", SOURCE_TITLE))


def load_pattern():
    module = ast.parse(PRODUCTION.read_text(encoding="utf-8"), filename=str(PRODUCTION))
    nodes = [
        node for node in module.body
        if isinstance(node, ast.Assign)
        and any(isinstance(target, ast.Name) and target.id == "SEC_NUM"
                for target in node.targets)
    ]
    assert len(nodes) == 1, "SEC_NUM assignment must be unique"
    namespace = {"re": re}
    exec(compile(ast.Module(body=nodes, type_ignores=[]), str(PRODUCTION), "exec"), namespace)
    pattern = namespace["SEC_NUM"]
    assert pattern.groups == 2, "number/title capture interface changed"
    assert pattern.groupindex == {}, "named-group interface changed"
    return pattern


def walk(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def focused_cases():
    cases = [REPRODUCTION]
    for number in ("6", "37", "208"):
        for suffix in ("", "^{*}", "^{+}"):
            cases.append((
                f"inline-{number}-{suffix or 'plain'}",
                f"${number}{suffix}$. Independent title",
                (number, "Independent title"),
            ))
    cases += [
        ("inline-section-star", "\u00a7 $52^{*}$. Section title", ("52", "Section title")),
        ("inline-triangle", r"$83^{*}$ $\blacktriangledown$. Triangle title",
         ("83", "Triangle title")),
        ("inline-fullwidth-dot", "$91^{*}$\uff0e Title", ("91", "Title")),
        ("inline-enumeration-comma", "$72^{*}$\u3001Title", ("72", "Title")),
        ("inline-space-separator", "$64^{*}$ Title", ("64", "Title")),
        ("inline-leading-whitespace", " \t$46^{*}$. Title", ("46", "Title")),
        ("title-math-preserved", r"$29^{*}$. Integral $\int_1^x dt/t$",
         ("29", r"Integral $\int_1^x dt/t$")),
    ]
    compatibility = [
        ("plain-dot", "9. Title", ("9", "Title")),
        ("plain-fullwidth-dot", "19\uff0eTitle", ("19", "Title")),
        ("plain-enumeration-comma", "28\u3001 Title", ("28", "Title")),
        ("plain-space", "38 Title", ("38", "Title")),
        ("plain-star", "48*. Title", ("48", "Title")),
        ("plain-star-space", "58* Title", ("58", "Title")),
        ("separate-math-star", r"68$^{*}$. Title", ("68", "Title")),
        ("plain-triangle", r"78$\blacktriangledown$. Title", ("78", "Title")),
        ("plain-star-triangle", r"88* $\blacktriangledown$. Title", ("88", "Title")),
        ("separate-star-triangle", r"98$^{*}$ $\blacktriangledown$. Title", ("98", "Title")),
        ("inline-plus", r"$108^{+}$. Title", ("108", "Title")),
        ("section-plain", "\u00a7 118. Title", ("118", "Title")),
        ("section-plain-star", "\t\u00a7 128*. Title", ("128", "Title")),
        ("plain-chinese-title", "138. \u51fd\u6570\u6027\u8d28", ("138", "\u51fd\u6570\u6027\u8d28")),
        ("plain-title-retains-star", "148. Title * note", ("148", "Title * note")),
    ]
    cases += [("compatibility-" + name, text, expected)
              for name, text, expected in compatibility]
    negatives = [
        ("empty", ""),
        ("unnumbered-title", "Independent title"),
        ("prose-prefix", "See $23^{*}$. Title"),
        ("symbolic-base", "$x^{*}$. Title"),
        ("mixed-base", "$23x^{*}$. Title"),
        ("negative-base", "$-23^{*}$. Title"),
        ("fractional-base", "$2.3^{*}$. Title"),
        ("different-superscript", "$23^{2}$. Title"),
        ("symbolic-superscript", "$23^{x}$. Title"),
        ("multiple-stars", "$23^{**}$. Title"),
        ("empty-superscript", "$23^{}$. Title"),
        ("missing-brace", "$23^{*$. Title"),
        ("missing-dollar", "$23^{*}. Title"),
        ("missing-opening-dollar", "23^{*}$. Title"),
        ("display-math", "$$23^{*}$$. Title"),
        ("bare-inline-star", "$23*$. Title"),
        ("double-superscript", "$23^{*}^{+}$. Title"),
        ("math-expression", "$23+1$. Title"),
        ("no-separator", "$23^{*}$Title"),
        ("inline-no-title", "$23^{*}$."),
        ("inline-whitespace-title", "$23^{*}$. \t"),
        ("plain-no-title", "23."),
        ("plain-whitespace-title", "23. \t"),
        ("wrong-triangle", r"$23^{*}$ $\blacktriangle$. Title"),
    ]
    cases += [("negative-" + name, text, None) for name, text in negatives]
    return cases


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--phase", choices=("reproduce", "focused"), required=True)
    args = parser.parse_args()
    pattern = load_pattern()
    cases = [REPRODUCTION] if args.phase == "reproduce" else focused_cases()
    for name, text, expected in cases:
        for method in ("match", "fullmatch"):
            match = getattr(pattern, method)(text)
            observed = match.groups() if match else None
            print(json.dumps({
                "case": name, "input": text, "method": method,
                "expected": expected, "observed": observed,
            }, ensure_ascii=True), flush=True)
            assert observed == expected, f"{name}/{method}: {observed!r} != {expected!r}"
    if args.phase == "focused":
        toc = json.loads(TOC.read_text(encoding="utf-8"))
        matches = [
            item for item in walk(toc)
            if item.get("title") == SOURCE_TITLE
            and str(item.get("printedNumber")) == REPRODUCTION[2][0]
        ]
        assert len(matches) == 1, "TOC number/title must identify exactly one entry"
        card = matches[0]
        print(json.dumps({
            "toc_entry": {
                "id": card["id"], "printedNumber": card["printedNumber"],
                "title": card["title"], "page": card["page"],
            },
            "derivation": "unique literal title and printedNumber, never slug",
            "scope": "regex only; no TOC claiming or assembly executed",
        }, ensure_ascii=True))
    print(json.dumps({"phase": args.phase, "cases": len(cases),
                      "asserted_matches": len(cases) * 2}))


if __name__ == "__main__":
    main()
