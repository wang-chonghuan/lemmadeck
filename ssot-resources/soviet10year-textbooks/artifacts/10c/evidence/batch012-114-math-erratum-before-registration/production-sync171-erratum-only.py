"""Synchronize only the newly confirmed erratum; retain the first PASS evidence."""
import copy
import hashlib
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(".claude/skills/ld-s10y-lesson/tools").resolve()))
import blocks
import p2c

ROOT = Path("ssot-resources/soviet10year-textbooks/artifacts/10c")
PAGE = ROOT / "pages/0171"
EVIDENCE = ROOT / "evidence/batch012-114-math-erratum-before-registration"
OUTPUT = Path(".intentfold/tickets/STEMROBIN-184/tmp/production-171-erratum-registration")
assert EVIDENCE.is_dir()
assert not OUTPUT.exists(), "Only synchronize this new erratum once"
before = json.loads((EVIDENCE / "before-source171/page.json").read_text())
audit = json.loads((EVIDENCE / "before-source171/audit.json").read_text())
current = json.loads((PAGE / "page.json").read_text())
assert current == before
assert json.loads((PAGE / "audit.json").read_text()) == audit
before_md = (EVIDENCE / "before-source171/page.md").read_text()
after_md = (PAGE / "page.md").read_text()
assert before_md.split("---", 2)[2] == after_md.split("---", 2)[2]
meta, parsed = blocks.parse(after_md)
assert parsed == before["blocks"]
record = json.loads((EVIDENCE / "independent-math-inquiry/erratum.draft.json").read_text())
assert before["meta"]["errata"] == []
assert meta["errata"] == [record]
restored = copy.deepcopy(meta)
restored["errata"] = before["meta"]["errata"]
assert restored == before["meta"], "No unrelated metadata changes"
errors = p2c._validate_page_errata(meta, parsed, 171)
assert not errors, errors
current["meta"]["errata"] = meta["errata"]
after_audit = copy.deepcopy(audit)
after_audit["errata"] = len(meta["errata"])
OUTPUT.mkdir()
for name in ("page.md", "page.json", "audit.json"):
    (OUTPUT / ("before-" + name)).write_bytes((EVIDENCE / "before-source171" / name).read_bytes())
p2c._dump(PAGE / "page.json", current)
p2c._dump(PAGE / "audit.json", after_audit)
for name in ("page.md", "page.json", "audit.json"):
    (OUTPUT / ("after-" + name)).write_bytes((PAGE / name).read_bytes())
p2c._dump(OUTPUT / "result.json", {
    "operation": "NEW erratum metadata registration only; not finalize/count/math suite",
    "id": record["id"], "block": record["block"],
    "original": record["original"], "errata_errors": errors,
    "body_bytes_unchanged": True, "all_blocks_unchanged": True,
    "non_errata_metadata_unchanged": True, "audit_changed_only": "errata: 0 -> 1",
    "first_pass_evidence_unchanged": True, "model_images": 0,
    "page_json_sha256": hashlib.sha256((PAGE / "page.json").read_bytes()).hexdigest(),
})
print((OUTPUT / "result.json").read_text(), end="")
