import copy
import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
assert Path.cwd() == REPO
OWN = Path(__file__).resolve().parent
TMP = OWN.parent
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import blocks
import edition
import p2c

RAW = REPO / "ssot-resources/soviet10year-textbooks/artifacts/10p"
SOURCE = TMP / "d1234-source267268-figure-identity-repair/root/10p"
ROOT, WORK = OWN / "root", OWN / "work"
BOOK = ROOT / "10p"
CARD = "phy10-c2-s4-n100"
RESUME = len(sys.argv) > 1 and sys.argv[1] == "repair"


def bind(file):
    return {"path": str(file), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


def save(file, data):
    file.parent.mkdir(parents=True, exist_ok=True)
    with file.open("x", encoding="utf-8") as stream:
        json.dump(data, stream, ensure_ascii=False, indent=2)
        stream.write("\n")
    return bind(file)


def retain(from_file, to_file):
    if to_file.exists():
        assert from_file.read_bytes() == to_file.read_bytes()
        return
    to_file.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(from_file, to_file)
    assert from_file.read_bytes() == to_file.read_bytes()


receipt = REPO / ".intentfold/tickets/STEMROBIN-181/evidence/reports/d1252-source267269-consumed/consumed.json"
assert json.loads(receipt.read_text())["status"] == "PASS-COMPOSED-SEQUENTIALLY-CONSUMED-ONCE"
assembly_file = TMP / "d1234-source267268-figure-identity-repair/report.json"
assembly = json.loads(assembly_file.read_text())
assert assembly["nativeAssembly"]["exitCode"] == 0
assert json.loads((SOURCE / f"lessons/{CARD}/exercises.json").read_text())["count"] == 0
inputs = [bind(receipt), bind(assembly_file)]
retain(SOURCE / "book.json", BOOK / "book.json")
for page in (267, 268, 269):
    for name in ("page.md", "page.json", "audit.json"):
        file = RAW / f"pages/{page:04d}/{name}"
        inputs.append(bind(file))
        if RESUME and page == 268:
            assert file.read_bytes() == (OWN / f"FIRST-source/0268/{name}").read_bytes()
            continue
        retain(file, BOOK / f"pages/{page:04d}/{name}")
for name in ("lesson.json", "lesson.md", "exercises.json"):
    file = SOURCE / f"lessons/{CARD}/{name}"
    inputs.append(bind(file))
    retain(file, BOOK / f"lessons/{CARD}/{name}")
for figure in ("fig-228a", "fig-228б"):
    for extension in ("png", "svg"):
        file = RAW / f"figures/{figure}.{extension}"
        inputs.append(bind(file))
        retain(file, BOOK / f"figures/{figure}.{extension}")
page_dir = BOOK / "pages/0268"
original_page = json.loads((RAW / "pages/0268/page.json").read_text())
original_audit = json.loads((RAW / "pages/0268/audit.json").read_text())
original_md_meta, original_md_blocks = blocks.load(RAW / "pages/0268/page.md")
assert original_page["meta"]["errata"] == []
assert original_audit["lines_printed"] == original_audit["lines_md"] == 19
assert not original_audit["errors"]
original = "$=1.60207\\times10^{-10}$"
corrected = "$=1.602176634\\times10^{-19}$"
assert original in "".join(original_page["blocks"][5]["lines"])
for name in ("page.md", "page.json", "audit.json"):
    retain(RAW / f"pages/0268/{name}", OWN / f"FIRST-source/0268/{name}")
current = copy.deepcopy(original_page)
record = {
    "id": "p0268-math-1", "block": "p0268#6", "original": original,
    "reason": "An electron-volt is the energy gained by one elementary charge across one volt. The source's exponent -10 is inconsistent with that definition; the exact modern SI relationship is 1 eV = 1.602176634e-19 J. Only the modern layer corrects the value.",
}
current["meta"]["errata"] = [record]
assert not p2c._validate_page_errata(current["meta"], current["blocks"], 268)
assert current["blocks"] == original_page["blocks"]
(page_dir / "page.json").write_text(json.dumps(current, ensure_ascii=False, indent=2) + "\n")
old_md = (RAW / "pages/0268/page.md").read_text()
body = old_md.split("---", 2)[2]
(page_dir / "page.md").write_text("---\n" + json.dumps(current["meta"], ensure_ascii=False, indent=2) + "\n---" + body)
audit = copy.deepcopy(original_audit)
audit["errata"] = 1
(page_dir / "audit.json").write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n")
assert blocks.load(page_dir / "page.md") == (current["meta"], original_md_blocks)
lesson = json.loads((BOOK / f"lessons/{CARD}/lesson.json").read_text())
exercises = json.loads((BOOK / f"lessons/{CARD}/exercises.json").read_text())
records = edition.source_errata(BOOK, lesson, exercises)
assert len(records) == 1
records[0]["corrected"] = corrected
save(OWN / "modern-errata-records.json", records)
save(OWN / "unit-conversion-basis.json", {
    "source": {"url": "https://physics.nist.gov/cuu/Constants/Table/allascii.txt",
               "publisher": "NIST", "retrievedLocalDate": "2026-11-19"},
    "observedRows": {
        "electron volt": "1.602 176 634 e-19 (exact) J",
        "electron volt-joule relationship": "1.602 176 634 e-19 (exact) J",
        "elementary charge": "1.602 176 634 e-19 (exact) C",
    },
    "derivation": "Delta E = |q| Delta V; one elementary charge times 1 V gives 1.602176634e-19 J.",
    "firstMalformedValuePageReads": 2,
    "sourceWordingAndOriginalFormulaRetained": True,
    "independentModernScientificReviewPending": True,
})
command = [
    str(REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"), "-B",
    ".claude/skills/ld-s10y-lesson/tools/p2c.py", "adapt-prepare",
    "--book", "10p", "--edition", "modern-us-neutral", "--lesson", CARD,
    "--root", str(ROOT), "--work", str(WORK),
]
result = subprocess.run(command, cwd=REPO, capture_output=True, text=True, timeout=120)
save(OWN / "adapt-prepare-FIRST.json", {
    "command": command, "exitCode": result.returncode,
    "stdout": result.stdout, "stderr": result.stderr,
})
assert result.returncode == 0, result.stdout + result.stderr
for item in inputs:
    assert bind(Path(item["path"]))["sha256"] == item["sha256"]
save(OWN / "report.json", {
    "ticket": "STEMROBIN-181", "batch": "D037",
    "status": "FIRST-PREPARED-SOURCE-ERRATUM-PENDING-INDEPENDENT-MODERN-REVIEW",
    "root": str(ROOT), "work": str(WORK), "card": CARD,
    "inputs": inputs, "sourceQuestions": 0, "sourceFigures": ["fig-228a", "fig-228б"],
    "rawAssemblyPassReused": True, "nativePassReplays": 0, "sourceBodyOrPixelsChanged": False,
    "source268ErrataMetadataOnly": [bind(page_dir / name) for name in ("page.md", "page.json", "audit.json")],
    "canonicalSourcePageStillUnchanged": True, "parentImageOpens": 0,
    "completeCard": False, "independentModernReviewPending": True,
})
print(json.dumps({"status": "FIRST-PREPARED", "card": CARD, "sourceQuestions": 0}))
