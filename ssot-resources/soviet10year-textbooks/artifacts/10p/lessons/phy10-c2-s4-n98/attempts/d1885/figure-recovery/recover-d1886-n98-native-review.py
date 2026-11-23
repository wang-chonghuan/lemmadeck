import hashlib
import json
from datetime import datetime, timedelta
from pathlib import Path

repo = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-181")
assert Path.cwd() == repo
ticket = repo / ".intentfold/tickets/STEMROBIN-181"
reports = ticket / "evidence/reports"
original_file = reports / "d1238-current-progress/d1221-n98-fig226-first-independent-review/fig-226.review.json"
approved_file = reports / "d1274-n98-readiness/figure-affected-review.json"
original = json.loads(original_file.read_text())
approved = json.loads(approved_file.read_text())
candidate = {
    **original,
    "status": approved["nativeReview"]["status"],
    "reviewedAt": approved["reviewedAt"],
    "render": {
        "path": ".intentfold/tickets/STEMROBIN-181/tmp/d1230-fig226-vector-glyph-native-repair/fig-226.render.json",
        "sha256": approved["bindings"]["render"]["sha256"],
    },
    "outputs": {"svg": {
        "path": ".intentfold/tickets/STEMROBIN-181/tmp/d1230-fig226-vector-glyph-native-repair/fig-226.svg",
        "sha256": approved["bindings"]["svg"]["sha256"],
    }},
    "notes": approved["nativeReview"]["notes"],
}
expected = approved["nativeReview"]["file"]
serialized = json.dumps(candidate, ensure_ascii=False, indent=2) + "\n"
prefix, suffix = serialized.split(approved["reviewedAt"])
prefix, suffix = prefix.encode(), suffix.encode()
reported_second = datetime.fromisoformat(approved["reviewedAt"][:19])
seconds = [(reported_second - timedelta(seconds=offset)).isoformat().encode()
           for offset in range(1, 11)]
found = None
tested = 0
for second in seconds:
    for microsecond in range(1_000_000):
        timestamp = second + f".{microsecond:06d}+00:00".encode()
        data = prefix + timestamp + suffix
        tested += 1
        if len(data) == expected["bytes"] and hashlib.sha256(data).hexdigest() == expected["sha256"]:
            found = data
            break
    if found is not None:
        break
out = ticket / "tmp/d1816-d1886-n98-native-review-recovery"
out.mkdir(parents=True, exist_ok=True)
if found is not None:
    (out / "fig-226.review.json").write_bytes(found)
report = {
    "card": "phy10-c2-s4-n98",
    "status": "EXACT_ORIGINAL_NATIVE_REVIEW_RECOVERED" if found else "ORIGINAL_NATIVE_REVIEW_NOT_RECOVERED",
    "originalFailureUnchanged": str(original_file),
    "approvedFieldsSource": str(approved_file),
    "expected": expected,
    "boundedTimestampSeconds": [second.decode() for second in seconds],
    "timestampCandidates": tested,
    "priorUnsuccessfulTimestampCandidates": 1_000_000,
    "onlyExactApprovedHashAccepted": True,
    "recovered": str(out / "fig-226.review.json") if found else None,
    "newReviewOrApproval": False,
    "nativeCalls": 0,
    "imagesOpened": 0,
    "databaseWrites": 0,
    "paidCalls": 0,
}
(out / "result.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report))
