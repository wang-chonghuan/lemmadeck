import copy
import hashlib
import json
import stat
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
OWN_REL = Path(".intentfold/tickets/STEMROBIN-188/tmp/n35-choice-independent7")
OWN = ROOT / OWN_REL
SEED_REL = Path(".intentfold/tickets/STEMROBIN-188/tmp/n35-choices-layout7/seed.json")
DRAFT_REL = Path(".intentfold/tickets/STEMROBIN-188/tmp/n35-choices-layout7/draft.json")
VIEW_REL = Path("ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n35/resume7/choice-views-first7.json")
RECOVERY_REL = Path("ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n35/layout-repair7/choice-binding-recovery7.json")
SEALS = {
    "SOURCE-FIRST.md": "da457315b2b8ab3e492291190a6cd706ee73e2b53100a6f235e735821cf3f7d9",
    "source-review.json": "1ad4b93563cfe1400d50b68c837d04e4fa1f0bc5d7dc4c73f74c420db8b05163",
    "VIEWS-FIRST.md": "1dc3b404fcdea94263085a3e34aebd7666f74490cf8ad7ec378ac8e6b8820745",
    "views-review.json": "d9a7e37b44349902a693e045b05c78b05e11d40f03988b4036232f50db850b2e",
}


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def digest(value):
    return sha256(json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode("utf-8"))


def load(relative):
    return json.loads((ROOT / relative).read_bytes())


def write_json(path, value):
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=True, indent=2)
        stream.write("\n")


def verify_seals():
    for name, expected in SEALS.items():
        path = OWN / name
        assert sha256(path.read_bytes()) == expected, name
        assert stat.S_IMODE(path.stat().st_mode) == 0o444, name


assert Path.cwd() == ROOT
verify_seals()
for name in ["review.json", "final-review7.md", "native-validation7.json",
             "native-validation7.stdout.txt", "native-validation7.stderr.txt"]:
    assert not (OWN / name).exists(), name

source = load(OWN_REL / "source-review.json")
sealed = load(OWN_REL / "views-review.json")
old_seed = load(Path(".intentfold/tickets/STEMROBIN-188/tmp/n35-choices7/seed.json"))
seed = load(SEED_REL)
draft = load(DRAFT_REL)
visible = load(VIEW_REL)
assert digest(old_seed) == "029294324997c6b097f467ae580c8d06323565798041adb236bce6c4ab524058"
assert digest(seed) == "c7406fb6a2c456510dac7847f734961a7b8011b1fd809006532f41dd4eed5eed"
assert digest(draft) == "62681f500f1fb2f25a06e7f15bc77db6d0b9239be7002fb096f0583011ce7cbf"
assert sha256((ROOT / DRAFT_REL).read_bytes()) == "4799352bbf7cd4c54d0577ed3a64dab20461a24272dfad92181cdb7d9e5cabb8"
assert sha256((ROOT / VIEW_REL).read_bytes()) == "a7eb10191e97724966f588078eed312e8ae4209a197316a4b47a5e195e60db73"
assert sha256((ROOT / RECOVERY_REL).read_bytes()) == "9f21b7abee571218213fbcca6919437f474440b59b9719e38f2fd015f1ab6e85"
assert [{"id": q["id"], "view": q["view"]} for q in draft["questions"]] == visible["questions"]
assert draft["new_figures"] == visible["new_figures"] == []
assert draft["seed_sha256"] == digest(seed)

# Recover only the established source-format binding, without resolving mathematics again.
expected_seed = copy.deepcopy(old_seed)
prefix_changes = []
for before, after in zip(expected_seed["exercises"], seed["exercises"]):
    assert before["number"] == after["number"]
    if before["text"] != after["text"]:
        number = before["number"]
        assert number in {"454", "456", "459"}
        marker = "*" if number == "459" else "\\bullet"
        old_prefix = "$" + number + "^{" + marker + "}.$"
        new_prefix = "$" + number + "^{" + marker + "}$."
        assert before["text"].count(old_prefix) == 1
        assert before["text"].replace(old_prefix, new_prefix, 1) == after["text"]
        assert after["text"].startswith("\u95ee\u9898\u548c\u4e60\u9898\n")
        before["text"] = after["text"]
        prefix_changes.append({"number": number, "old": old_prefix, "new": new_prefix})
assert {c["number"] for c in prefix_changes} == {"454", "456", "459"}
trace_changes = []
for before, after in zip(expected_seed["trace"], seed["trace"]):
    assert before["path"] == after["path"]
    if before["sha256"] != after["sha256"]:
        assert before["path"].endswith("/lessons/geo68-c3-s2-n35/exercises.json")
        trace_changes.append({"path": before["path"], "old": before["sha256"], "new": after["sha256"]})
        before["sha256"] = after["sha256"]
assert len(trace_changes) == 1 and expected_seed == seed

# These are the completed human/agent comparison judgments, not inferred keys.
audit = {
    "ray-groups": {
        "A": "Author derivation agrees with the sealed right/left classification and properly distinguishes containment on one support from the half-plane test on distinct supports; correct rationale has no misconception.",
        "B": "Author derivation identifies both mixed diagonal groups. Treating PQ and QP as interchangeable and placing the remaining names in the complement reproduces the two claimed mixed groups; the option is false.",
        "C": "Author truth and derivation agree, but the misconception needs revision. Using the two supporting lines as half-plane boundaries cannot produce the claimed right-upper/left-lower classification: rays on each own support lie on that boundary, and relative to the other support their side does not depend on left/right orientation. The output is asserted without a mistaken orientation rule that generates it.",
        "D": "Author key is correct, but its derivation needs revision: 'same-group rays mutually contain one another' is false for these distinct rays. P belongs to [PQ) but not [QE), so [QE) does not contain [PQ); only the reverse containment holds. The required condition is that one contains the other, not both contain each other.",
        "E": "Author derivation correctly excludes opposite direction on nonparallel supports. Treating all different direction classes as opposite generates exactly this false cross-group claim.",
    },
    "origin-counts": {
        "A": "Author derivation is correct. Counting infinitely many second naming points as different fixed-origin rays generates the two infinite entries; the arbitrary-origin entry is independently infinite.",
        "B": "Author derivation agrees with fixed-origin uniqueness and arbitrary-origin infinity, including M=A. No misconception is assigned to the true option.",
        "C": "Author's [0,infinity)/[1,infinity) example correctly separates rays from their direction class. Replacing the entire class by one ray generates the erroneous third count.",
        "D": "Author false truth and the actual count one are correct, but the misconception is not valid over the stated domain. A no-common-origin rule forbids an opposite ray only when M=A. For A=(0,0), B=(1,0), M=(0,1), the westward ray from M has a different origin and is allowed even by that wrong rule, so it yields one, not zero. The explanation silently needs M=A or an additional mistaken rule.",
    },
    "construction-record": {
        "A": "Author computation KB=(-3,0) agrees with the sealed check. Replacing the same-side requirement about the M-K vertical line by opposite sides puts B left of K, as this record does.",
        "B": "Author computation D-K=(1,0) is correct. Taking K+(1,0) rather than K-(1,0) generates D=(4,0) and the false same-direction second pair.",
        "C": "All four author vectors, support positions and symbols agree with the sealed complete record. Shared coordinates between other labels do not degenerate any ray.",
        "D": "Author derivation and the stated interchange of the two double-arrow meanings reproduce exactly the two reversed symbols with unchanged correct coordinates.",
    },
    "ray-set-table": {
        "A": "Author counterexample a=0,b=2 is correct. Swapping union/intersection roles in the same-direction containment case generates the reversed min/max entries while leaving the separately learned opposite cases alone.",
        "B": "Author membership derivation agrees on every row, including same-ray equality, opposite singleton, closed segment and outward missing gap.",
        "C": "Author proof that a belongs to both rays is correct. Discarding a zero-length boundary as a set element generates the claimed empty intersection at equality.",
        "D": "Author missing-midpoint counterexample is correct. Assuming two oppositely unbounded rays cover the line without checking their origin order generates the false full-line union.",
    },
    "direction-quantifiers": {
        "A": "The author correctly diagnoses undirected support counting: all lines, used lines or every line then give n, ranges 1..n, and n, exactly the displayed undercounts.",
        "B": "The author's explicit mistaken replacement of selections by the whole permitted ray pool gives method 1's maxima in all three methods, reproducing B. Completing only actually used supports would not suffice; the stated 'once a line is allowed' pool interpretation is what produces this option.",
        "C": "The author correctly identifies the importation of method 3's every-support premise into method 2; it copies precisely the lower bounds n instead of one.",
        "D": "Author class counts and representative construction agree with all sealed ranges. Nonempty, per-support coverage and whole-line extension are explicit conditions, not retroactive source claims.",
    },
    "opposition-properties": {
        "A": "The author's distinct-origin right/left/right witness on three parallel supports is valid and agrees with the sealed failure of reflexivity/transitivity and success of symmetry.",
        "B": "Checking only a coincident/parallel support and ignoring orientation produces the false self-relation entry, while the other property entries remain correct.",
        "C": "Keeping an 'opposite' label through two reversals, or borrowing same-direction transitivity, reproduces the false transitivity entry; the right/left/right counterexample refutes it.",
        "D": "Copying all same-direction equivalence properties without testing the opposite relation gives exactly the three yes entries and equivalence yes. Author derivation correctly rejects it.",
    },
    "chosen-centers": {
        "A": "Reflecting only O and using M'=O'+(2,0) gives (4,0),(4,4),(2,0), exactly A's wrong throughpoints; the author's midpoint counterexamples agree.",
        "B": "Using the reflected horizontal coordinates but image height P_y instead of 2P_y-y changes only P2 to y=2; the author correctly computes the resulting midpoint height one.",
        "C": "All author midpoint equations, image directions and support flags match the sealed three-center computation, including P3=O.",
        "D": "The author's distinction between parallel and coincident supports is correct. Mistaking the off-line parallel y=4 for the original y=0 support generates the one wrong flag.",
    },
    "ray-symmetry-laws": {
        "A": "Author endpoint correspondence 2P-A=B and whole-ray map are correct, including equal origins; no overlap condition or positive separation is needed.",
        "B": "Author disjoint-ray counterexample [2,infinity),(-infinity,0] with center one is correct. Requiring a common point before permitting a center generates the option's false intersection restriction.",
        "C": "Author's different valid counterexample uses rays [0,infinity),(-infinity,4], points 1 and 4, midpoint 2.5; it maps the first ray to (-infinity,5], not the second. Mistaking any selected pair for a corresponding pair generates the false universal claim.",
        "D": "Author pointwise formula negates every nonzero direction for every center, agreeing with the sealed universal proof.",
        "E": "Author off-line example about (0,1) is correct. Treating the changed parallel support as a translation without reflecting both named points generates the false same-direction conclusion.",
    },
    "polygon-possibilities": {
        "A": "Author's convex zero-pair quadrilateral and chamfered rectangle examples are valid. Unstated regularization gives the regular counts 2,0,3 and then wrongly universalizes them, reproducing the option.",
        "B": "Author bound is correct; the required attainment of all ten count cases is independently supported by the sealed source witnesses, without reading the author's referenced source-solving history.",
        "C": "Author correctly forbids shared-edge parallel pairing in a strict convex boundary. Rounding n/2 upward or reusing the fifth side gives maxima 2,3,3, exactly C's erroneous pentagon excess.",
        "D": "Author noncentral quadrilateral and six-vertex counterexample are valid. In the latter the opposite midpoints are (3,4),(3,4),(3.5,5); repeated slopes are zero and two only, hence two parallel pairs. Reversing necessary evenness into sufficient evenness generates D.",
        "E": "Author genuine-corner pairing proof is correct for simple polygons without straight-angle vertices, including concave cases. It does not rely on the center being interior in a concave polygon.",
    },
}
assert sum(len(items) for items in audit.values()) == 39
failed_questions = {"ray-groups", "origin-counts"}
sealed_questions = {q["question_id"]: q for q in sealed["question_reviews"]}
author_questions = {q["id"]: q for q in draft["questions"]}
coverage = {c["source_number"]: c for c in draft["coverage"]}
sealed_coverage = {c["source_number"]: c for c in sealed["source_coverage"]}

source_reviews = []
for item in source["source_reviews"]:
    number = item["source_number"]
    prior = sealed_coverage[number]
    declared = coverage[number]
    assert declared["question_ids"] == prior["inferred_question_ids"]
    assert declared["omitted_tasks"] and declared["reason"]
    source_reviews.append({
        "source_number": number,
        "independent_solution": item["independent_solution"],
        "coverage": {
            "verdict": "pass",
            "evidence": prior["evidence"] + " Author coverage and limitations explicitly record the independently identified production losses rather than claim actual learner drawing, notation writing or proof production. Inferred source association agrees with the declared question IDs. The period-only source binding repair does not change the mathematics.",
        },
    })

question_reviews = []
truth_matches = 0
for author in draft["questions"]:
    qid = author["id"]
    prior = sealed_questions[qid]
    assert author["source_numbers"] == prior["inferred_source_numbers"]
    assert author["key"]["correct"] == prior["mathematics"]["true_options"]
    author_rationales = {r["option_id"]: r for r in author["key"]["rationales"]}
    assert len(author_rationales) == len(prior["mathematics"]["option_checks"])
    checks = []
    for option in prior["mathematics"]["option_checks"]:
        oid = option["option_id"]
        truth = "correct" if option["truth"] == "true" else "incorrect"
        rationale = author_rationales[oid]
        assert rationale["truth"] == truth
        assert (rationale["misconception"] is None) == (truth == "correct")
        checks.append({
            "option_id": oid,
            "truth": truth,
            "evidence": option["proof"] + " Author comparison: " + audit[qid][oid],
        })
        truth_matches += 1
    task = copy.deepcopy(prior["task_fidelity"])
    task["evidence"] += " The disclosed intent and coverage acknowledge the recorded recognition/production limits. No visible wording has changed since the blind views seal."
    question_reviews.append({
        "question_id": qid,
        "task_fidelity": task,
        "redundancy": copy.deepcopy(prior["redundancy"]),
        "answer_leakage": copy.deepcopy(prior["answer_leakage"]),
        "mathematics": {
            "verdict": "revise" if qid in failed_questions else "pass",
            "independent_solution": prior["mathematics"]["independent_solution"] + " Reused unchanged from the pre-key views seal. The entire independently enumerated true set and every option truth agree with the author; a revise verdict here concerns the specifically documented rationale/misconception defects, not an altered key.",
            "correct": prior["mathematics"]["true_options"],
            "option_checks": checks,
        },
    })
assert truth_matches == 39
assert len(source_reviews) == 10 and len(question_reviews) == 9
figure = source["figure_checks"][0]
assert seed["figures"] == old_seed["figures"] and len(seed["figures"]) == 1
review = {
    "schema": "s10y-choice-review-v1",
    "seed_sha256": digest(seed),
    "draft_sha256": digest(draft),
    "reviewer": {
        "kind": "independent_agent",
        "identity": "N35 independent reviewer 7; source-first and views-first evidence sealed before author disclosure; actual prior fig-218 pixel inspection reused; final author comparison on format-rebound snapshot",
    },
    "source_reviews": source_reviews,
    "figure_checks": [{
        "figure_id": figure["figure_id"],
        "asset_path": figure["asset_path"],
        "asset_sha256": figure["asset_sha256"],
        "observation": figure["observation"] + " This is my prior actual headed/offline full screenshot observation, retained at .intentfold/tickets/STEMROBIN-188/tmp/n35-choice-independent7/fig-218-headed-offline.png with SHA-256 4123d3a26b8e7eff5796584d04dbc80873ab8066d1ab5911f085c0b529b9c511. Modern SVG hash is unchanged in both seeds. No images were reopened for views or final comparison; original glyph/printing roles remain unknown.",
    }],
    "new_figure_reviews": [],
    "question_reviews": question_reviews,
    "outcome": "revise",
}
write_json(OWN / "review.json", review)
(OWN / "review.json").chmod(0o444)

argv = [
    "python3", ".agents/skills/ld-s10y-choice/scripts/validate.py",
    "--repo", ".",
    "--seed", str(SEED_REL),
    "--draft", str(DRAFT_REL),
    "--review", str(OWN_REL / "review.json"),
]
started_at = datetime.now(timezone.utc).isoformat()
started = time.monotonic()
result = subprocess.run(argv, cwd=ROOT, capture_output=True, check=False)
stdout_path = OWN / "native-validation7.stdout.txt"
stderr_path = OWN / "native-validation7.stderr.txt"
with stdout_path.open("xb") as stream:
    stream.write(result.stdout)
with stderr_path.open("xb") as stream:
    stream.write(result.stderr)
receipt = {
    "argv": argv,
    "cwd": str(ROOT),
    "exitCode": result.returncode,
    "started_at": started_at,
    "elapsed_seconds": round(time.monotonic() - started, 6),
    "native_validator_invocations": 1,
    "review_outcome": review["outcome"],
    "seed_canonical_sha256": digest(seed),
    "seed_bytes_sha256": sha256((ROOT / SEED_REL).read_bytes()),
    "draft_canonical_sha256": digest(draft),
    "draft_bytes_sha256": sha256((ROOT / DRAFT_REL).read_bytes()),
    "review_canonical_sha256": digest(review),
    "review_bytes_sha256": sha256((OWN / "review.json").read_bytes()),
    "stdout": {"path": str(stdout_path), "sha256": sha256(result.stdout), "bytes": len(result.stdout)},
    "stderr": {"path": str(stderr_path), "sha256": sha256(result.stderr), "bytes": len(result.stderr)},
    "source_binding_recovery": {
        "prefix_changes": prefix_changes,
        "trace_changes": trace_changes,
        "all_other_seed_content_identical": True,
        "views_identical_to_sealed_snapshot": True,
        "recovery_report_path": str(ROOT / RECOVERY_REL),
        "recovery_report_sha256": sha256((ROOT / RECOVERY_REL).read_bytes()),
        "native_prepare_reruns_by_reviewer": 0,
        "native_prepare_not_rerun_after_parent_helper_repair": "direct human instruction and supplied recovery report; not independently rerun",
        "old_draft_history_read": False,
    },
    "author_comparison": {
        "question_keys_compared": 9,
        "keys_matching_sealed_sets": 9,
        "option_truths_compared_and_matching": 39,
        "rationale_derivations_compared": 39,
        "incorrect_option_misconceptions_compared": 27,
        "derivations_needing_revision": 1,
        "misconceptions_needing_revision": 2,
        "source_coverage_records_compared": 10,
        "intents_and_limitations_compared": 9,
        "findings": [
            {"question_id": "ray-groups", "option_id": "C", "field": "misconception", "draft_line": 89},
            {"question_id": "ray-groups", "option_id": "D", "field": "derivation", "draft_line": 94},
            {"question_id": "origin-counts", "option_id": "D", "field": "misconception", "draft_line": 180},
        ],
    },
    "cumulative_counters": {
        "source_exercises_independently_solved": 10,
        "visible_questions_independently_solved": 9,
        "options_independently_checked": 39,
        "true_options": 12,
        "false_options": 27,
        "author_question_keys_compared": 9,
        "author_rationale_derivations_compared": 39,
        "author_incorrect_option_misconceptions_compared": 27,
        "image_batches": 1,
        "actual_image_opens_in_batch": 1,
        "batch_limit": 8,
        "actual_image_opens_against_context_limit": 1,
        "context_limit": 24,
        "image_crops": 0,
        "image_reopens": 0,
        "additional_images_in_final_stage": 0,
        "new_figures": 0,
        "headed_browser_launches": 2,
        "failed_capture_attempts": 1,
        "screenshots_produced": 1,
        "owned_browsers_remaining": 0,
        "sole_cwd_boundary_deviations": 1,
        "new_cwd_boundary_deviations": 0,
        "native_semantic_validator_invocations": 1,
        "native_prepare_reruns_by_reviewer": 0,
        "authoring_edits": 0,
        "db_env_install_app_git_worktree_chat_peer_actions": 0,
        "prior_seals_and_failures_preserved": True,
    },
}
verify_seals()
write_json(OWN / "native-validation7.json", receipt)
for path in [stdout_path, stderr_path, OWN / "native-validation7.json"]:
    path.chmod(0o444)

command = " ".join(argv)
summary = f"""# N35 Final Independent Review

Verdict: **revise**. All 9 keys and all 39 option truth labels agree with the
pre-key seals. Three internal rationale defects require correction; no authoring
edits were made. Visible questions, coverage associations and recorded production
losses remain as independently reviewed.

## Concrete Findings

- `ray-groups`, C, `draft.json:89`: the supporting-line-boundary misconception
  cannot generate its mixed orientation grouping. A ray lies on its own
  supporting boundary; relative to the other parallel support, sidedness does
  not depend on left/right orientation. State an actual mistaken orientation
  assignment instead of asserting the resulting group.
- `ray-groups`, D, `draft.json:94`: same-direction distinct rays are nested,
  not mutually inclusive. P belongs to [PQ) but not [QE), so [QE) does not
  contain [PQ). The correct condition is one contains the other.
- `origin-counts`, D, `draft.json:180`: prohibiting common origins yields zero
  only if M=A. With A=(0,0), B=(1,0), M=(0,1), the opposite westward ray has
  a different origin and survives that mistaken rule. The explanation does
  not generate the displayed zero for the arbitrary-M domain.

## Binding And Reuse

Verified old/new seed difference: only periods moved outside math in the
454/456/459 prefixes, after the unchanged group heading, plus the exercise
trace hash. Figures, concepts and all other seed content are identical.
All nine disclosed views and no-new-figures list exactly match the views seal.
No source mathematics, original glyph roles or images were resolved again.
All ten coverage records and all nine intent/limitation records were compared.
The losses of free construction, symbol production, witness generation and
proof writing are explicit; recognition is not actual learner production.

New seed canonical SHA-256: `{digest(seed)}`.
Draft canonical SHA-256: `{digest(draft)}`.
Review byte SHA-256: `{receipt["review_bytes_sha256"]}`.
Recovery report SHA-256: `{sha256((ROOT / RECOVERY_REL).read_bytes())}`.
The four original source/views seals remain unchanged at 0444.
Exact native review: `review.json`; actual execution: `native-validation7.json`.

## Native Command

```text
{command}
```

Actual cwd: `{ROOT}`.
Actual exit: **{result.returncode}**. Runs: **1**. Review outcome: **revise**.
Stdout: `native-validation7.stdout.txt`, SHA-256 `{sha256(result.stdout)}`.
Stderr: `native-validation7.stderr.txt`, SHA-256 `{sha256(result.stderr)}`.
Exit 3, if returned, is the declared non-passing semantic review, not approval
and not a reason to rerun preparation. The native tool checks structure and
binding; the substantive rationale findings above are reviewer judgments.

## Cumulative Counters

Sources 10; visible questions 9; options 39 (12 true, 27 false); author keys 9;
rationales 39; wrong-option misconceptions 27; findings 3.
Image opens 1/8 batch and 1/24 context, new final-stage opens 0; crops/reopens 0;
browser launches 2, prior failed capture 1, successful screenshot 1, browsers 0.
Prior cwd deviation 1 preserved; new deviations 0. Native validator runs 1;
reviewer prepare reruns 0. Authoring/DB/env/install/app/Git/worktree/chat/peer
actions 0. Prior seals, source failures, structural/ltgt recovery and supplied
metadata-binding recovery remain preserved; no failed stage was erased.
"""
with (OWN / "final-review7.md").open("x", encoding="utf-8") as stream:
    stream.write(summary)
(OWN / "final-review7.md").chmod(0o444)
verify_seals()
print(json.dumps({
    "verdict": review["outcome"],
    "native_exit_code": result.returncode,
    "argv": argv,
    "cwd": str(ROOT),
    "stdout": result.stdout.decode("utf-8", errors="replace"),
    "stderr": result.stderr.decode("utf-8", errors="replace"),
    "files": [
        {"path": str(OWN / name), "sha256": sha256((OWN / name).read_bytes()),
         "mode": format(stat.S_IMODE((OWN / name).stat().st_mode), "04o")}
        for name in ["review.json", "final-review7.md", "native-validation7.json",
                     "native-validation7.stdout.txt", "native-validation7.stderr.txt"]
    ],
    "counters": receipt["cumulative_counters"],
}, indent=2))
