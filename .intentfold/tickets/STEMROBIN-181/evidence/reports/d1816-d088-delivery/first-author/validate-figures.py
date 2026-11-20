import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
W = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == W
sys.path.insert(0, str(W / ".claude/skills/ld-s10y-lesson/tools"))
import edition

O = W / ".tmp/STEMROBIN-181/d1816-d073"
E = W / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d073-n126-author"
reports = []
for name in ["modern-us-neutral", "modern-us-neutral-en"]:
    folder = O / "figures" / name
    spec_path = folder / "fig-286.spec.json"
    spec, errors = edition.validate_figure_spec(spec_path, "fig-286", require_review=False)
    render = edition.load(folder / "fig-286.render.json")
    assert render["status"] == "pass"
    assert render["spec"]["sha256"] == edition.sha256(spec_path)
    assert render["output"]["svg"]["sha256"] == edition.sha256(folder / "fig-286.svg")
    assert render["renderer"]["name"] == "JSXGraph"
    assert render["theme"]["output"] == "css-variables"
    assert all(check["status"] == "pass" for check in render["displayChecks"])
    assert not (folder / "fig-286.review.json").exists()
    reports.append({"edition": name, "spec": str(spec_path), "errors": errors,
                    "renderReportStatus": render["status"],
                    "require_review": False, "independentApproval": False})
result = {"role": "FIRST_AUTHOR", "status": "pass" if all(not r["errors"] for r in reports) else "fail",
          "reports": reports, "semanticHold": "Detailed physical meaning of the small source circulation traces.",
          "adaptFinalizeCalled": False, "recordReviewCalled": False}
edition.dump(E / "native-figure-author-validation.json", result)
print(json.dumps(result))
sys.exit(0 if result["status"] == "pass" else 2)
