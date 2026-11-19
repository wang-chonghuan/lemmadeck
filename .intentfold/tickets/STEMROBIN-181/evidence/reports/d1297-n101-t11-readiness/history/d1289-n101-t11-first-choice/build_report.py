import hashlib
import json
import re
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1289-n101-t11-first-choice"


def canonical_sha(value):
    return hashlib.sha256(
        json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()


def binding(path):
    raw = path.read_bytes()
    value = json.loads(raw)
    return {
        "path": str(path),
        "file_sha256": hashlib.sha256(raw).hexdigest(),
        "canonical_sha256": canonical_sha(value),
    }, value


def math_fragments(view):
    return {
        "stem": sorted(re.findall(r"\$([^$]+)\$", view["stem"])),
        "options": [
            {"id": option["id"], "math": re.findall(r"\$([^$]+)\$", option["text"])}
            for option in view["options"]
        ],
    }


freeze_binding, freeze = binding(OUT / "receipts/source-solutions-FIRST-freeze.json")
solutions_binding, solutions = binding(OUT / "source-solutions-FIRST.json")
assert solutions_binding["file_sha256"] == freeze["file_sha256"]
assert solutions_binding["canonical_sha256"] == freeze["canonical_sha256"]
assert freeze["all_four_drafts_absent_at_freeze"]
supplementary_binding, supplementary = binding(OUT / "supplementary-definitions.json")
assert supplementary_binding["canonical_sha256"] == solutions["supplementary_definitions"]["canonical_sha256"]
native_binding, native = binding(OUT / "native-wording-provenance.json")

for authority in supplementary["authorities"]:
    raw = Path(authority["path"]).read_bytes()
    assert hashlib.sha256(raw).hexdigest() == authority["file_sha256"]
    current = json.loads(raw)
    assert canonical_sha(current) == authority["canonical_sha256"]
    for block in authority["blocks"]:
        text = current["prose"][block["block"]]["text"]
        assert text == block["text"]
        assert hashlib.sha256(text.encode("utf-8")).hexdigest() == block["text_utf8_sha256"]
for authority in native["files"]:
    assert hashlib.sha256(Path(authority["path"]).read_bytes()).hexdigest() == authority["file_sha256"]

cards = []
source_bindings = {}
all_questions = []
for card in ("n101", "t11"):
    seed_binding, seed = binding(OUT / card / "seed.json")
    expected_seed = next(item for item in solutions["seeds"] if item["card"] == card)
    assert seed_binding["canonical_sha256"] == expected_seed["canonical_sha256"]
    assert [item["number"] for item in seed["exercises"]] == expected_seed["selected_sources"]
    assert [item["block"] for item in seed["concepts"]] == expected_seed["selected_definition_blocks"]
    assert seed["figures"] == []
    for trace in seed["trace"]:
        path = ROOT / trace["path"]
        current_binding, _ = binding(path)
        assert current_binding["file_sha256"] == trace["sha256"]
        source_bindings[str(path)] = current_binding
    drafts = {}
    card_questions = {}
    receipts = {}
    for language in ("zh", "en"):
        draft_binding, draft = binding(OUT / card / language / "draft.json")
        assert draft["seed_sha256"] == seed_binding["canonical_sha256"]
        assert draft["new_figures"] == []
        drafts[language] = draft_binding
        card_questions[language] = draft
        receipt_binding, receipt = binding(OUT / "receipts" / (card + "-" + language + "-validate-first.json"))
        assert receipt["exit_code"] == 0
        assert "--review" not in receipt["argv"]
        receipts[language] = {**receipt_binding, "exit_code": receipt["exit_code"], "stdout": receipt["stdout"], "stderr": receipt["stderr"], "argv": receipt["argv"]}
        all_questions.extend(draft["questions"])
    zh = card_questions["zh"]
    en = card_questions["en"]
    assert zh["coverage"] == en["coverage"]
    assert len(zh["questions"]) == len(en["questions"])
    agreement = []
    for left, right in zip(zh["questions"], en["questions"]):
        assert {key: value for key, value in left.items() if key != "view"} == {
            key: value for key, value in right.items() if key != "view"
        }
        assert left["view"]["mode"] == right["view"]["mode"]
        assert left["view"]["figure_ids"] == right["view"]["figure_ids"] == []
        assert [item["id"] for item in left["view"]["options"]] == [item["id"] for item in right["view"]["options"]]
        assert math_fragments(left["view"]) == math_fragments(right["view"])
        agreement.append(
            {
                "question_id": left["id"],
                "source_numbers": left["source_numbers"],
                "mode": left["view"]["mode"],
                "option_ids": [item["id"] for item in left["view"]["options"]],
                "correct": left["key"]["correct"],
                "exact_internal_intent_and_key_agreement": True,
                "same_stem_math_fragment_multiset": True,
                "exact_option_math_fragment_agreement": True,
                "english_authoring": "Manually authored natural English using permitted current native prompt/prose wording.",
            }
        )
    cards.append(
        {
            "card": card,
            "seed": seed_binding,
            "selected_source_numbers": expected_seed["selected_sources"],
            "selected_definition_blocks": expected_seed["selected_definition_blocks"],
            "drafts": drafts,
            "counts_per_language": {
                "sources": len(seed["exercises"]),
                "questions": len(zh["questions"]),
                "options": sum(len(question["view"]["options"]) for question in zh["questions"]),
                "single": sum(question["view"]["mode"] == "single" for question in zh["questions"]),
                "multiple": sum(question["view"]["mode"] == "multiple" for question in zh["questions"]),
                "keyed_options": sum(len(question["key"]["correct"]) for question in zh["questions"]),
            },
            "coverage": zh["coverage"],
            "bilingual_agreement": agreement,
            "validation_first_attempt": receipts,
        }
    )

receipt_bindings = [binding(path)[0] for path in sorted((OUT / "receipts").glob("*.json"))]
report = {
    "schema": "s10y-choice-first-bilingual-author-report-v1",
    "ticket": "STEMROBIN-181",
    "status": "Offline author handoff; first structural validations passed; independent semantic review pending",
    "authorization": {
        "cwd": str(ROOT),
        "owned_output_directory": str(OUT),
        "same_ticket": True,
        "canonical_edits": 0,
        "other_authors_edits": "Preserved; no writes outside the sole owned output directory",
        "seed_creation": "One prepare.py-generated Chinese-authority seed per card, shared unchanged by both languages",
        "draft_creation": "All four drafts manually authored via apply_patch after the FIRST freeze",
        "self_approval": False,
        "review_file_created": False,
        "review": "Separate reviewer assigned by parent; no semantic review performed by this author",
    },
    "independent_solutions_FIRST": {
        **solutions_binding,
        "source_count": len(solutions["solutions"]),
        "frozen_before_all_options": True,
        "freeze_receipt": freeze_binding,
        "unchanged_since_freeze": True,
        "read_only_mode_set_at_freeze": True,
    },
    "cards": cards,
    "counts": {
        "cards": 2,
        "seeds": 2,
        "drafts": 4,
        "source_exercises": 7,
        "source_exercises_with_questions": 7,
        "unique_bilingual_question_pairs": 7,
        "questions_per_language": 7,
        "questions_across_drafts": len(all_questions),
        "options_per_language": 22,
        "options_across_drafts": sum(len(question["view"]["options"]) for question in all_questions),
        "single_per_language": 6,
        "multiple_per_language": 1,
        "structural_validation_runs": 4,
        "first_validation_passes": 4,
        "first_validation_failures": 0,
        "image_opens": 0,
        "new_figures": 0,
    },
    "canonical_source_file_bindings": list(source_bindings.values()),
    "supplementary_definitions": {
        **supplementary_binding,
        "policy": "Explicit selected exact text UTF-8 SHA-256 values retained outside seeds and linked from FIRST source solutions",
        "authorities": supplementary["authorities"],
        "uses": supplementary["uses"],
        "not_answer_authority": True,
        "t11_seed_concepts_remain_empty": True,
        "all_bound_source_texts_unchanged_at_handoff": True,
    },
    "native_english_wording_authority": {
        **native_binding,
        "files": [
            {key: value for key, value in file.items() if key != "projection"}
            for file in native["files"]
        ],
        "allowed_fields": "Only current English exercise number/text and lesson prose text were used for wording",
        "not_solution_authority": True,
        "all_bound_files_unchanged_at_handoff": True,
    },
    "bilingual_agreement": {
        "same_seed_per_card": True,
        "same_question_ids": True,
        "same_source_numbers": True,
        "same_modes": True,
        "same_option_ids_and_order": True,
        "same_exact_keys_and_rationales": True,
        "same_exact_internal_intents": True,
        "same_coverage": True,
        "same_stem_math_fragment_multisets": True,
        "same_exact_option_math_fragments": True,
        "natural_language_semantic_approval": "Not claimed; pending independent reviewer",
    },
    "physical_conventions_and_capacity": {
        "mass": "Historical relativistic mass is speed-dependent; invariant rest mass does not change from overall speed alone. Retained internal energy can increase an entire resting system's invariant mass.",
        "train": "Same train local-clock event time, not simultaneous flash reception; ground event order independently derived.",
        "gamma40000": "Exact v/c=sqrt(1-1/40000^2), with stable fractional gap gamma^-2/(1+sqrt(1-gamma^-2)); no cancellation-based conclusion v=c.",
        "water": {
            "general_expression": "Delta m0=(1 kg)*cbar_w*(50 K)/c^2",
            "cbar_w": "Unspecified interval-mean specific heat capacity, equivalent to the FIRST integral divided by 50 K; not an invented constant or a constant-heat-capacity assumption",
            "added_visible_conditions": ["No matter loss", "No phase change", "At rest before and after", "All supplied heat retained", "Negligible mechanical work"],
            "not_added": ["Numerical water heat capacity", "Numerical light-speed approximation", "Initial absolute temperature"],
            "numeric_source_limit": "Unique mass gain in kg remains unavailable because heat capacity is unspecified",
            "derivation_notation": "T0 and c_w(T) in the frozen general derivation are replaced by the exactly defined interval mean in the visible draft; no initial temperature is fabricated.",
        },
        "recognition_loss": "All seven sources retain their mathematical distinctions through choice recognition, not a claim of unaided writing, derivation, or calculation.",
        "quotas": "None; the four definitions/explanations and three independent applied problems each justify a distinct response unit.",
    },
    "receipts": receipt_bindings,
    "execution_failures_preserved": [
        {
            "receipt": str(OUT / "receipts/authority-projection-first-failure.json"),
            "phase": "Authority projection before options",
            "failure": "Python SyntaxError in an assignment expression inside a comprehension iterable",
            "recovery": "Local projection rewritten as an explicit loop; no substantive content revision",
        },
        {
            "receipt": str(OUT / "receipts/report-builder-first-failure.json"),
            "phase": "Mechanical handoff bookkeeping",
            "failure": "Ordered stem-symbol comparison rejected natural Chinese/English symbol ordering in t11-electron-speed",
            "recovery": "Compare stem symbol multisets while retaining exact ordered option-math comparison; no draft, key, or solution changes",
        },
    ],
    "usage": {
        "author_round": 1,
        "substantive_revisions": 0,
        "image_opens": 0,
        "new_figures": 0,
        "paid_calls": 0,
        "network_calls": 0,
        "model_service_calls": 0,
        "database_calls": 0,
        "environment_reads": 0,
        "git_calls": 0,
        "previous_choice_review_test_or_author_output_reads": 0,
        "supplementary_exception": "Only authorized current definition blocks and current native English prompt/prose files",
        "tokens": "unknown",
    },
}
with (OUT / "report.json").open("x", encoding="utf-8") as stream:
    stream.write(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
report_binding, _ = binding(OUT / "report.json")
with (OUT / "receipts/report-digest.json").open("x", encoding="utf-8") as stream:
    stream.write(json.dumps(report_binding, indent=2) + "\n")
for card in cards:
    print(json.dumps({"card": card["card"], "seed": card["seed"], "drafts": card["drafts"], "counts_per_language": card["counts_per_language"]}, indent=2))
print(json.dumps({"report": report_binding, "counts": report["counts"], "source_solutions_FIRST": solutions_binding}, indent=2))
