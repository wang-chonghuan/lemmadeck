"""Project this author's draft to learner views; no source or key fields."""

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PREFIX = "geo910-n15-choice-"
DRAFT = ROOT / f"{PREFIX}draft.json"
SEED = ROOT / f"{PREFIX}seed.json"


def canonical_digest(value):
    serialized = json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    )
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def write_exclusive(path, text):
    with path.open("x", encoding="utf-8") as stream:
        stream.write(text)


draft = json.loads(DRAFT.read_text(encoding="utf-8"))
seed = json.loads(SEED.read_text(encoding="utf-8"))
views = [question["view"] for question in draft["questions"]]
views_path = ROOT / f"{PREFIX}views.json"
write_exclusive(views_path, json.dumps(views, ensure_ascii=True, indent=2) + "\n")

assets = {
    figure["id"]: [
        str(Path(__file__).resolve().parents[4] / asset["path"])
        for asset in figure["assets"]
    ]
    for figure in seed["figures"]
}
lines = []
for ordinal, view in enumerate(views, 1):
    lines.extend(
        [
            f"## {ordinal}. {view['mode']}",
            "",
            view["stem"],
            "",
        ]
    )
    for figure_id in view["figure_ids"]:
        lines.extend(f"![{figure_id}]({path})" for path in assets[figure_id])
        lines.append("")
    for option in view["options"]:
        lines.extend([f"{option['id']}. {option['text']}", ""])
        for figure_id in option["figure_ids"]:
            lines.extend(f"![{figure_id}]({path})" for path in assets[figure_id])
            lines.append("")

markdown_path = ROOT / f"{PREFIX}views.md"
write_exclusive(markdown_path, "\n".join(lines))

report = {
    "status": "views_ready_semantic_review_pending",
    "seed_path": str(SEED),
    "seed_sha256": canonical_digest(seed),
    "draft_path": str(DRAFT),
    "draft_sha256": canonical_digest(draft),
    "learner_views_json_path": str(views_path),
    "learner_views_json_sha256": canonical_digest(views),
    "learner_views_markdown_path": str(markdown_path),
    "learner_views_markdown_bytes_sha256": hashlib.sha256(
        markdown_path.read_bytes()
    ).hexdigest(),
    "solve_checkpoint_path": str(ROOT / f"{PREFIX}solve-checkpoint.md"),
    "solve_checkpoint_bytes_sha256": hashlib.sha256(
        (ROOT / f"{PREFIX}solve-checkpoint.md").read_bytes()
    ).hexdigest(),
    "figure_render_path": str(ROOT / f"{PREFIX}figure-view/fig-61.svg.png"),
    "figure_render_bytes_sha256": hashlib.sha256(
        (ROOT / f"{PREFIX}figure-view/fig-61.svg.png").read_bytes()
    ).hexdigest(),
    "image_loads": 1,
    "new_figures": 0,
    "question_count": len(views),
    "option_count": sum(len(view["options"]) for view in views),
    "single_count": sum(view["mode"] == "single" for view in views),
    "multiple_count": sum(view["mode"] == "multiple" for view in views),
    "question_inventory": [
        {
            "question_id": question["id"],
            "mode": question["view"]["mode"],
            "option_count": len(question["view"]["options"]),
            "source_numbers": question["source_numbers"],
        }
        for question in draft["questions"]
    ],
    "coverage": draft["coverage"],
    "validation": {
        "runs": 1,
        "command": (
            "python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . "
            "--seed .intentfold/tickets/STEMROBIN-184/tmp/"
            "geo910-n15-choice-seed.json "
            "--draft .intentfold/tickets/STEMROBIN-184/tmp/"
            "geo910-n15-choice-draft.json"
        ),
        "exit_code": 0,
        "result": "mechanical checks passed; semantic review still required",
    },
    "review": None,
    "publication": "none; scratch-only author handoff",
}
report_path = ROOT / f"{PREFIX}handoff.json"
write_exclusive(report_path, json.dumps(report, ensure_ascii=True, indent=2) + "\n")
print(json.dumps(report, ensure_ascii=True, indent=2))
