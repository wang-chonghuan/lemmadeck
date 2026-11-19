"""Mechanically package manually authored alternatives, not generate mathematics."""

import json
from datetime import datetime, timezone
from collections import Counter
from stage import OWN, ROOT, REL, read, sha, digest, write


def normalization(value):
    return value.replace(",", ".").rstrip(".")


def source_table(records):
    table = records[0]["table"]
    title = "Squares" if table == "III" else "Square roots"
    pages = ", ".join(str(p) for p in sorted({
        int(record["printed_page"]) for record in records
    }))
    lines = [
        f"\n\nTable {table} ({title}), literal excerpt from V. M. Bradis, "
        f"*Four-figure Mathematical Tables*, Drofa, Moscow, 2010, "
        f"13th stereotype edition, printed pages {pages}. Decimal commas "
        "are shown as decimal points.",
    ]
    if table == "IV":
        lines += [
            "For a row below 10, main column $c$ refers to $N+0.01c$; "
            "for a row at least 10, it refers to $N+0.1c$. A correction "
            "column refers to the fourth significant argument digit, and "
            "its integer is in units of $0.001$ of the root.",
        ]
    else:
        lines += [
            "Main column $c$ refers to $N+0.01c$. Square an input's "
            "power-of-ten scale as well as its normalized coefficient.",
        ]
    lines += [
        "",
        "| Row N | Main column : entry | Correction column : integer | Next main column : entry |",
        "| --- | --- | --- | --- |",
    ]
    grouped = {}
    for record in records:
        row = normalization(record["row"])
        cells = grouped.setdefault(row, {"main": {}, "corrections": {}, "next": {}})
        main = record["main"]
        cells["main"][main["column"]] = normalization(main["printed"])
        for correction in record["corrections"]:
            cells["corrections"][correction["column"]] = correction["printed"]
        if record["next_main"]:
            next_main = record["next_main"]
            cells["next"][next_main["column"]] = normalization(next_main["printed"])
    for row, cells in grouped.items():
        parts = []
        for key in ("main", "corrections", "next"):
            parts.append("; ".join(
                f"{column} : {entry}" for column, entry in sorted(
                    cells[key].items(), key=lambda pair: int(pair[0])
                )
            ) or "-")
        lines.append(f"| {row} | {' | '.join(parts)} |")
    return "\n".join(lines)


def main():
    frozen = read(OWN / "solve-freeze.json")
    for file in frozen["files"]:
        assert sha(ROOT / file["path"]) == file["sha256"], file["path"]
    seed = read(OWN / "seed.json")
    assert digest(seed) == frozen["seed_sha256"]
    solves = read(OWN / "source-solutions.json")["sources"]
    by_number = {source["source_number"]: source for source in solves}
    cells = read(OWN / "source-cells.json")["cells"]
    by_id = {cell["id"]: cell for cell in cells}
    assert len(by_id) == len(cells)
    items = read(OWN / "author-items.json")
    figures = read(OWN / "image-observations.json")
    questions = []
    provenance = []
    task_map = []
    for item in items:
        records = [by_id[cell_id] for cell_id in item["table_ids"]]
        table_text = ""
        for table in ("III", "IV"):
            selected = [record for record in records if record["table"] == table]
            if selected:
                table_text += source_table(selected)
        figure_ids = item.get("figure_ids", [])
        view = {
            "mode": item["mode"], "stem": item["stem"] + table_text,
            "figure_ids": figure_ids,
            "options": [{"id": o["id"], "text": o["text"], "figure_ids": []}
                        for o in item["options"]],
        }
        questions.append({
            "id": item["id"], "source_numbers": [item["source_number"]],
            "view": view,
            "intent": {
                "task": item["stem"],
                "source_solution": by_number[item["source_number"]]["solution"],
                "unit_reason": item["unit_reason"],
                "concept_blocks": item["concepts"],
                "limitations": item["losses"],
                "figure_observations": [
                    {"figure_id": figure_id, "observation": figures["question_observation"]}
                    for figure_id in figure_ids
                ],
            },
            "key": {
                "correct": [o["id"] for o in item["options"] if o["truth"] == "correct"],
                "rationales": [
                    {"option_id": o["id"], "truth": o["truth"],
                     "derivation": o["derivation"], "misconception": o["misconception"]}
                    for o in item["options"]
                ],
            },
        })
        provenance.append({
            "question_id": item["id"], "source_number": item["source_number"],
            "context_is_only_in_view_and_separate_provenance": True,
            "table_records": [
                {"id": record["id"], "table": record["table"],
                 "row": record["row"], "main_column": record["main"]["column"],
                 "correction_columns": [c["column"] for c in record["corrections"]],
                 "path": str(REL.parent / "bradis-cell-review" /
                             f"capture-{record['pdf_image']}.json"),
                 "printed_page": record["printed_page"],
                 "input_sha256": next(
                     h["sha256"] for h in read(OWN / "input-hashes.json")["inputs"]
                     if h["path"] == str(REL.parent / "bradis-cell-review" /
                                        f"capture-{record['pdf_image']}.json")),
                } for record in records
            ],
        })
        task_map.append({
            "question_id": item["id"], "source_number": item["source_number"],
            "source_task_ids": item["task_ids"], "assessment": "recognition",
            "losses": item["losses"],
        })
    coverage = []
    for source in solves:
        matched = [item for item in items if item["source_number"] == source["source_number"]]
        covered = [task for item in matched for task in item["task_ids"]]
        assert Counter(covered) == Counter(source["task_ids"]), source["source_number"]
        coverage.append({
            "source_number": source["source_number"],
            "question_ids": [item["id"] for item in matched],
            "omitted_tasks": list(dict.fromkeys(
                loss for item in matched for loss in item["losses"]
            )),
            "reason": "All source mathematical response tasks are represented in the "
                      "named coherent recognition units, conditionally where an "
                      "explicit supplemental method is needed. Independent written "
                      "production and the precise losses below are not claimed. " +
                      " ".join(item["unit_reason"] for item in matched),
        })
    draft = {
        "schema": "s10y-choice-draft-v1", "seed_sha256": digest(seed),
        "new_figures": [], "questions": questions, "coverage": coverage,
    }
    write("draft.json", draft)
    write("coverage.json", coverage)
    write("reviewer-views.json", [
        {"id": question["id"], "view": question["view"]} for question in questions
    ])
    write("task-coverage.json", {
        "source_originals": len(solves),
        "source_tasks": sum(s["source_task_count"] for s in solves),
        "choice_questions": len(questions),
        "mode_counts": dict(Counter(q["view"]["mode"] for q in questions)),
        "mapping": task_map,
        "conditional_tasks": {
            "806.d1-d3": "four-significant-figure input preprocessing explicitly selected",
            "811.a-b": "table-first operations with explicit final reporting",
            "813.b": "selected corrected table number plus half-up; unconditional true-root 0.01 accuracy not established",
            "816.a-b": "explicit full reserve-digit staging, not historical uniqueness",
            "819": "actual named roots/turns with approximate numerical readings, not exact invented coordinates",
        },
        "uncovered_mathematical_task_ids": [],
        "production_or_original_precision_losses": coverage,
    })
    write("source-provenance.json", {
        "seed_sha256": digest(seed), "seed_trace": seed["trace"],
        "source_solution_freeze": frozen,
        "table_identity": read(OWN / "method-assumptions.json")["table_identity"],
        "historical_equivalence": "not established or claimed",
        "table_context": provenance,
        "method_assumptions_path": str(REL / "method-assumptions.json"),
        "method_assumptions_sha256": sha(OWN / "method-assumptions.json"),
        "policy": "Only literal source cells and selected mathematical rules inform context. "
                  "No answer-author/review output supplies a key. Actual source files and "
                  "the prepare-generated seed were not edited; no synthetic source repo.",
    })
    write("author-package.json", {
        "packaged_at": datetime.now(timezone.utc).isoformat(),
        "status": "author_draft_semantic_review_pending",
        "draft_sha256": digest(draft),
        "solve_freeze_sha256": sha(OWN / "solve-freeze.json"),
        "manually_authored_alternatives_path": str(REL / "author-items.json"),
        "source_originals": len(solves), "source_tasks": 76,
        "questions": len(questions),
        "new_figures": 0, "new_renders": 0,
        "self_review": False, "integration": False,
    })
    print(f"Packaged {len(questions)} manually authored questions; 76 conditional/full "
          "recognition tasks; semantic review pending.")


if __name__ == "__main__":
    main()
