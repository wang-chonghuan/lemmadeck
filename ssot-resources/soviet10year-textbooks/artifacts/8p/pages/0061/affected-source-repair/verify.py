"""Affected source-MD representation checks, not finalize or SOURCE approval."""
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180")
assert Path.cwd() == ROOT, "Run from the explicitly authorized workdir"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks as B
import normalize as nz

PAGES = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/8p/pages"
PROFILE = ROOT / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"
profile = nz.load_profile(PROFILE)
specs = {
    61: ([3, 2, 3, 3, 1, 3, 4, 5, 1], 6,
         "9855cd061faa371560c00da584cb600fdce3baa4e58191ae4f5cbdac8d77602e",
         [("punctuation.original.png", [1260, 240, 1445, 325])]),
    62: ([3, 6, 2, 1, 6, 3, 3, 1], 8,
         "1cc0b6abf4e22ab6fe313780ab1564ce02105ce1792c3f4d5c9da92a99c27c08",
         [("top.original.png", [150, 250, 1460, 780]),
          ("definition.original.png", [150, 1195, 1460, 1435])]),
    65: ([2, 1, 3, 2, 3, 5, 4, 4, 1], 12,
         "2d7b780b18e3feeeeba2752a4d26692dbc6bb63c2db9ac007fc1f2436823f0cc",
         [("weights.original.png", [240, 1335, 1550, 2215])]),
}


def bind(path):
    data = path.read_bytes()
    return {"path": str(path), "bytes": len(data),
            "sha256": hashlib.sha256(data).hexdigest()}


def unstyle(text):
    text = re.sub(r"</?span\b[^>]*>", "", text).replace("*", "")
    return re.sub(r"\\boldsymbol\{([A-Za-z]+)\}", r"\1", text)


formula_checker = r"""
const fs = require("node:fs");
const {inline} = require("./.claude/skills/ld-s10y-lesson/tools/htmlfrag.js");
const lines = JSON.parse(fs.readFileSync(0, "utf8"));
for (const line of lines) {
  const html = inline(line);
  if (html.includes("katex-error")) throw new Error("KaTeX error");
  if (line.includes("text-emphasis:")) {
    if (!html.includes("text-emphasis: filled dot; text-emphasis-position: under;"))
      throw new Error("Source underdot markup was not preserved");
    if (html.includes("&lt;span")) throw new Error("Escaped underdot tag");
  }
}
console.log(JSON.stringify({lines: lines.length, inline_parse: "ok"}));
"""
for page, (counts, units, initial_sha, crops) in specs.items():
    folder = PAGES / f"{page:04d}" / "affected-source-repair"
    baseline = (folder / "baseline.page.md" if page == 65 else
                PAGES / "0060/source-author-scope/candidates" /
                f"{page:04d}" / "page.md")
    repaired = folder.parent / "page.md"
    original = bind(baseline)
    assert original["sha256"] == initial_sha, "Initial baseline drift"
    old_meta, old = B.load(baseline)
    meta, new = B.load(repaired)
    assert {k: v for k, v in old_meta.items() if k != "notes"} == {
        k: v for k, v in meta.items() if k != "notes"
    }, "Non-note source metadata changed"
    assert [len(b["lines"]) for b in new] == counts
    assert B.printed_lines(new) == B.printed_lines(old) == 25
    assert not any(b["kind"] == "fig" or b["samerow"] for b in new)
    old_body = [ln for b in old if b["kind"] != "foot" for ln in b["lines"]]
    new_body = [ln for b in new if b["kind"] != "foot" for ln in b["lines"]]
    assert list(map(unstyle, old_body)) == list(map(unstyle, new_body)), (
        "Non-style body glyph or printed-row drift")
    if page == 61:
        assert new[0]["cont"] and new[-2]["open"]
        assert new[4]["kind"] == "p" and new[4]["lines"] == ["$v=v_0+at$. （3）"]
    else:
        assert [{k: v for k, v in b.items() if k != "lines"} for b in old] == [
            {k: v for k, v in b.items() if k != "lines"} for b in new
        ], "Block ownership or flags changed"
    dots = re.findall(r'<span style="text-emphasis: filled dot; '
                      r'text-emphasis-position: under;">([^<]+)</span>',
                      "\n".join(new_body))
    assert list(map(len, dots)) == ([17, 10] if page == 62 else [])
    for block in new:
        for line in block["lines"]:
            assert not nz.normalize_text(line, profile)[1]
            assert not nz.check_charset(line, profile)
    rendered = subprocess.run(
        ["node", "-e", formula_checker], cwd=ROOT,
        input=json.dumps([ln for b in new for ln in b["lines"]]),
        text=True, capture_output=True, check=True,
    )
    old_rows = [ln for b in old for ln in b["lines"]]
    new_rows = [ln for b in new for ln in b["lines"]]
    changed = [i for i, (a, b) in enumerate(zip(old_rows, new_rows), 1) if a != b]
    image_root = ROOT / f".tmp/ld-s10y-lesson/8p/pages/{page:04d}"
    record = {
        "workspace": str(ROOT), "date": "2026-11-23", "role": "AUTHOR_ONLY",
        "status": "AWAITING_AFFECTED_INDEPENDENT_REVIEW",
        "new_FIRST": False, "historical_usage_reset": False,
        "baseline_kind": ("exact_initial_normal_MD" if page == 65 else
                          "newer_retained_author_draft_not_recovered_old_freeze"),
        "baseline": original, "repaired": bind(repaired),
        "report": bind(folder / "repair-report.md"),
        "prior_report": bind(ROOT / f".intentfold/tickets/STEMROBIN-180/source-review-8p{page}.md"),
        "rules": [bind(p) for p in [
            ROOT / ".claude/skills/ld-s10y-lesson/SKILL.md",
            PROFILE, ROOT / ".agents/skills/ld-s10y-image/SKILL.md",
            ROOT / ".claude/skills/ld-s10y-lesson/references/production-resume.md",
        ]],
        "original_grid": {**bind(image_root / "page.grid.png"), "views": 1},
        "original_for_crops": {**bind(image_root / "page.png"), "direct_views": 0},
        "crops": [{**bind(folder / name), "original_box_xyxy": box, "views": 1}
                  for name, box in crops],
        "image_views_this_page": 1 + len(crops),
        "combined_author_image_batch": 7, "combined_author_image_context": 7,
        "source_representation_units": units, "author_repair_passes": 1,
        "changed_printed_rows": changed, "printed_rows": 25,
        "block_rows": counts, "figures": 0,
        "body_unstyled_glyphs_and_row_breaks_unchanged": True,
        "non_note_metadata_unchanged": True, "profile_normalizations_needed": 0,
        "profile_charset_errors": 0, "underdot_Han_counts": list(map(len, dots)),
        "inline_check": json.loads(rendered.stdout),
        "verification_script": bind(Path(__file__)),
        "pipeline_stages_run": [],
    }
    if page == 65:
        assert old[0] == new[0] and new[0]["kind"] == "ex" and new[0]["label"] == "8"
        assert new[1]["kind"] == "h3"
        record["selected_n12_ex8"] = {
            "unchanged_block": True, "printed_rows": [1, 2],
            "block_sha256": hashlib.sha256(
                json.dumps(new[0], ensure_ascii=False, sort_keys=True).encode()
            ).hexdigest(), "author_source_faithful": True,
            "uncertainty_scope": "n13_only", "whole_page_PASS": False,
        }
    target = folder / "bindings.json"
    assert not target.exists(), "Do not overwrite an existing binding record"
    target.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"page": page, "rows": 25, "blocks": len(new),
                      "changed_rows": changed, "units": units,
                      "baseline_sha256": original["sha256"],
                      "repaired": record["repaired"],
                      "bindings": str(target)}, ensure_ascii=False))
