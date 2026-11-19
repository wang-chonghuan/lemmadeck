import json
import sys
from pathlib import Path

sys.path.insert(0, ".agents/skills/ld-s10y-image/scripts")
from validate_spec import validate

own = Path(__file__).resolve().parent
source = own.parent / "d1268-n100-fig228ab-first-author/FIRST/fig-228\u0431.spec.json"
spec = json.loads(source.read_text())
result = []
for index, (identifier, valid) in enumerate([
    ("fig-228a", True), ("fig-228\u0431", True), ("tbl-p0268-1", True),
    ("fig-228\u0430", True), ("fig-228\u0431/next", False),
    ("fig-../../file", False), ("fig-\u0431228", False),
    ("fig-228\u0431\u0432", False), ("fig-228 b", False),
]):
    candidate = {**spec, "id": identifier}
    file = own / f"case-{index}.json"
    file.write_text(json.dumps(candidate, ensure_ascii=True, indent=2) + "\n")
    errors = validate(file, "draft")
    id_errors = [error for error in errors if error.startswith("id must")]
    assert (not id_errors) == valid, (identifier, errors)
    result.append({"id": identifier, "validId": valid, "errors": errors})
actual_errors = validate(source, "draft")
assert actual_errors == [], actual_errors
report = {
    "status": "PASS-AFFECTED-DRAFT-ID-CONTRACT-ONLY",
    "source": str(source), "cases": result, "actualDraftErrors": actual_errors,
    "originalIdAndSpecUnchanged": True, "sourceAndImageReviewReplays": 0,
    "parentImageOpens": 0, "paidCalls": 0,
    "semanticArtworkGenerationStillMissing": True, "completeCard": False,
}
with (own / "report.json").open("x") as output:
    json.dump(report, output, indent=2)
    output.write("\n")
print("PASS: 9 identifier cases and unchanged fig-228\u0431 draft; artwork still missing")
