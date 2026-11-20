"""Resolve the numbered-topic heading from the bound TOC, without assembly."""

import hashlib
import json
import sys
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
assert Path.cwd() == REPO
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import assemble

TMP = Path(__file__).parent
source = TMP / "source213215-author/artifacts/9-10g/pages/0215/page.json"
toc_path = REPO / "ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json"
document = json.loads(source.read_text())
heading = document["blocks"][8]
assert heading["kind"] == "h3"
assert heading["lines"] == ["§60. 旋转图形. 圆柱体"]
toc = json.loads(toc_path.read_text())
cards = assemble._toc_cards(toc)
target = [card for card in cards if card["id"] == "geo910-c2-s3-n60"]
assert len(target) == 1
assert target[0]["printedNumber"] == 60
assert target[0]["page"] == 208
stream = [{**heading, "page": 215, "printed_page": 208, "ref": "p0215#9",
           "numbering_scope": "g10"}]
lessons = assemble.cut_lessons(stream, toc_path)
assert len(lessons) == 1
assert lessons[0]["number"] == "60"
warnings = assemble.check_toc(lessons, toc_path, "9-10g")
assert lessons[0]["card_id"] == "geo910-c2-s3-n60"
print(json.dumps({
    "schema": "stemrobin188-numbered-topic-heading-contract-probe@1",
    "status": "existing-topic-contract-maps-unchanged-h3-to-N60",
    "source": {"path": str(source), "sha256": hashlib.sha256(source.read_bytes()).hexdigest()},
    "toc": {"path": str(toc_path), "sha256": hashlib.sha256(toc_path.read_bytes()).hexdigest()},
    "topic": target[0], "literalHeading": heading, "mappedLesson": lessons[0],
    "warnings": warnings, "sourceRefs": ["p0215#9"],
    "interpretation": "The § glyph alone does not decide block kind: this bound TOC entry is a numbered topic, whose card boundary uses h3. The generic §/h2 example does not turn this topic into its parent section.",
    "F215HeadingContractHistoricalFindingPreserved": True,
    "sourceEdited": False, "assemblyRun": False, "nativeRun": False,
    "imageLoads": 0, "independentAdjudicationPending": True,
}, ensure_ascii=False, indent=2))
