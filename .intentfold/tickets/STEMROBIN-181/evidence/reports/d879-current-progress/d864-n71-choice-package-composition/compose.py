"""One bounded exact-package composition; no question or option authoring."""

import copy
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import subprocess
import sys

R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = R / ".intentfold/tickets/STEMROBIN-181"
OUT = T / "tmp/d864-n71-choice-package-composition"
RECOVERY = T / "tmp/d846-n71-native-recovery"
CHOICE = R / ".agents/skills/ld-s10y-choice/scripts"
sys.dont_write_bytecode = True
sys.path.insert(0, str(CHOICE))
from prepare import digest, file_hash, load_json, prepare_seed

D850 = T / "tmp/d850-n71-choice-binding-affected-review/report.json"
D850_SHA = "0dc94d317f8d56da4b2ea5401a023a1d2a7d0cf79c60f3db3930de9337b721b5"
HISTORIES = {
    "q12": T / "evidence/reports/d490-current-progress/d474-n71-q12-first-independent-choice-review",
    "q3": T / "evidence/reports/d490-current-progress/d471-n71-q3-first-independent-choice-review",
}
ORDER = [
    "reflection-law", "principal-focus",
    "ray-correspondences", "available-ray-construction",
]
BLOCKS = [6, 9, 10, 11, 12]
inputs = {}
calls = {"existing_parser_calls": 0, "existing_digest_calls": 0, "prepare_seed_direct_calls": 0}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def canonical(value):
    calls["existing_digest_calls"] += 1
    return digest(value)


def binding(path, value=None):
    path = Path(path)
    result = {"path": str(path), "sha256": file_hash(path), "bytes": path.stat().st_size}
    if value is not None:
        result["canonicalSha256"] = canonical(value)
    return result


def read(path):
    path = Path(path)
    calls["existing_parser_calls"] += 1
    value = load_json(path)
    inputs[str(path)] = binding(path, value)
    return value


def write(path, value):
    path = Path(path)
    require(path.is_relative_to(OUT) and not path.exists(), f"refuse overwrite/outside write: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=True)
        stream.write("\n")


def differences(before, after, pointer=""):
    if type(before) is not type(after):
        return [{"pointer": pointer, "before": before, "after": after}]
    if isinstance(before, dict):
        result = []
        for key in sorted(set(before) | set(after)):
            part = key.replace("~", "~0").replace("/", "~1")
            if key not in before or key not in after:
                result.append({"pointer": f"{pointer}/{part}",
                               "before": before.get(key), "after": after.get(key),
                               "beforePresent": key in before, "afterPresent": key in after})
            else:
                result += differences(before[key], after[key], f"{pointer}/{part}")
        return result
    if isinstance(before, list):
        result = []
        for index in range(max(len(before), len(after))):
            if index >= len(before) or index >= len(after):
                result.append({"pointer": f"{pointer}/{index}",
                               "before": before[index] if index < len(before) else None,
                               "after": after[index] if index < len(after) else None,
                               "beforePresent": index < len(before), "afterPresent": index < len(after)})
            else:
                result += differences(before[index], after[index], f"{pointer}/{index}")
        return result
    return [] if before == after else [{"pointer": pointer, "before": before, "after": after}]


PAIR_FINDINGS = [
    {
        "pair": ["reflection-law", "ray-correspondences"],
        "verdict": "pass",
        "evidence": "The law unit states no center-of-curvature or pole geometry. Its normal-incidence "
                    "and equal-angle alternatives cannot be transferred to curved-mirror ray classes "
                    "without identifying the local normal. The ray unit offers competing unmarked "
                    "relations, not the complete plane/side/angle-definition set of the law unit. "
                    "Shared prerequisite reasoning is not an exposed answer or a duplicate response task.",
    },
    {
        "pair": ["reflection-law", "available-ray-construction"],
        "verdict": "pass",
        "evidence": "Neither law stem nor options state how many independent reflected paths locate an "
                    "image or how a central hole changes path availability. The construction stem "
                    "does not give coplanarity, angle definitions or the law's complete true set. "
                    "General reflection and the available-path sufficiency task remain separate.",
    },
    {
        "pair": ["principal-focus", "ray-correspondences"],
        "verdict": "pass",
        "evidence": "Parallel-to-focus language recurs as an unmarked candidate relation, not an "
                    "endorsed conclusion. Every focus alternative already shares the parallel-input "
                    "setup; selecting its complete concave/convex actual-ray/backward-extension scheme "
                    "still requires distinctions absent from the concave-only ray unit. Conversely "
                    "the focus unit supplies no curvature-center or pole rule and cannot settle the "
                    "ray unit's complete multiple set. The overlap does not eliminate either task.",
    },
    {
        "pair": ["principal-focus", "available-ray-construction"],
        "verdict": "pass",
        "evidence": "The construction stem's concave real-image situation is an image of an off-axis "
                    "object, not a declared principal-focus definition for a parallel bundle. It "
                    "provides no convex virtual-focus classification. The focus alternatives state "
                    "neither the sufficient number of usable paths nor the exclusion of hole "
                    "reflection; no new complete-plan answer is supplied across these units.",
    },
]
DOMAIN = (
    "The general local reflection law is not restricted to paraxial rays. The focus comparison "
    "explicitly uses the paraxial concave/convex domain; both construction units explicitly use a "
    "paraxial concave off-axis model. Actual reflecting-surface conditions and the real-image, "
    "pairwise-noncoincident construction premise stay local to their stems. No union operation "
    "asserts wide-beam exact focus, actual convex convergence behind a mirror, or reflection at a "
    "hole. Internal seed definitions are not added to learner-facing view fields."
)
COVERAGE = (
    "New d864 composition only: source 1 maps to reflection-law; source 2 to principal-focus; "
    "source 3 to ray-correspondences and available-ray-construction. All three source tasks now "
    "occur in this four-unit union. Old Q1/Q2-missing and pending statements describe the original "
    "isolated package/author-time scope, not this union. Recognition/unaided-writing and drawing "
    "losses remain inherited; task coverage is not full lesson/card, figure or display approval."
)
IDENTITY = (
    "Codex d864 independent composition reviewer of the exact d473/d458-authored choice packages; "
    "not either original question author. Assembly is exact copying, not semantic authoring. "
    "d474 q12 and d471 q3 independent individual reviews are inherited, with d850 affected "
    "current-source binding SHA " + D850_SHA + ". New review covers composition only; no new "
    "independent source solution, option truth review, full lesson or full-card approval."
)


def compose():
    require(not (OUT / "composition-PASS-before-validation.json").exists(), "composition round already exists")
    require(file_hash(D850) == D850_SHA, "d850 report hash mismatch")
    affected = read(D850)
    require(affected["status"] == "PASS", "d850 is not PASS")
    inherited_native = read(RECOVERY / "report.json")
    require(binding(RECOVERY / "report.json")["sha256"] ==
            affected["scopedInheritedApprovals"]["d846"]["sha256"], "d846 report drift")
    for path in [CHOICE / "prepare.py", CHOICE / "validate.py",
                 R / ".claude/skills/ld-s10y-lesson/tools/retain_choices.py",
                 R / ".claude/skills/ld-s10y-lesson/tools/publish_choices.mjs", Path(__file__)]:
        inputs[str(path)] = binding(path)
    histories = {package: read(directory / "report.json") for package, directory in HISTORIES.items()}
    locales = []
    for locale in ["zh", "en"]:
        packages = []
        for package in ["q12", "q3"]:
            declared = next(row for row in affected["packages"]
                            if row["locale"] == locale and row["package"] == package)
            current = {}
            original = {}
            for name in ["seed", "draft", "review"]:
                for scope, target in [("current", current), ("original", original)]:
                    path = RECOVERY / locale / f"{scope}-choice-set" / package / f"{name}.json"
                    target[name] = read(path)
                    require(binding(path, target[name]) == declared[scope][name],
                            f"d850 {scope} {locale}/{package}/{name} binding drift")
            require(current["draft"]["questions"] == original["draft"]["questions"],
                    "original question field changed")
            require(current["draft"]["coverage"] == original["draft"]["coverage"],
                    "original coverage field changed")
            old_review = read(HISTORIES[package] / f"{locale}.review.json")
            require(old_review == original["review"], "historical individual review not exact")
            require(current["review"]["outcome"] == "pass", "inherited review not pass")
            rebound = {**original["review"],
                       "seed_sha256": current["review"]["seed_sha256"],
                       "draft_sha256": current["review"]["draft_sha256"]}
            require(rebound == current["review"], "current individual substantive review changed")
            require(current["draft"]["seed_sha256"] == canonical(current["seed"]) ==
                    current["review"]["seed_sha256"], "current seed digest mismatch")
            require(current["review"]["draft_sha256"] == canonical(current["draft"]),
                    "current draft digest mismatch")
            packages.append({"package": package, "current": current, "original": original,
                             "d850": declared,
                             "historicalReview": binding(HISTORIES[package] / f"{locale}.review.json", old_review)})
        q12, q3 = [row["current"] for row in packages]
        require(q12["seed"]["source"] == q3["seed"]["source"], "source identity differs")
        require(q12["seed"]["trace"] == q3["seed"]["trace"], "source trace differs")
        require(not q12["seed"]["figures"] and not q3["seed"]["figures"] and
                not q12["draft"]["new_figures"] and not q3["draft"]["new_figures"], "image max0 violation")
        source_repo = RECOVERY / locale / "current-choice-source"
        for trace in q12["seed"]["trace"]:
            path = source_repo / trace["path"]
            read(path)
            require(file_hash(path) == trace["sha256"], "source trace stale")
        lesson_dir = source_repo / "ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/lessons/phy10-c2-s2-n71"
        source_exercises = read(lesson_dir / "exercises.json")["exercises"]
        contracts = [
            {"sourceNumber": row["number"], "group_id": row["group_id"],
             "pages": row["pages"], "figure_refs": row.get("figure_refs", [])}
            for row in source_exercises if row["number"] in ["1", "2", "3"]
        ]
        expected = histories["q12"]["source_bindings"] + [histories["q3"]["source_binding"]]
        require(contracts == expected, "original source/group/page contract changed")
        calls["prepare_seed_direct_calls"] += 1
        seed = prepare_seed(source_repo, "10p", "phy10-c2-s2-n71", ["1", "2", "3"], BLOCKS, [])
        require(seed["exercises"] == q12["seed"]["exercises"] + q3["seed"]["exercises"],
                "union prose not exact")
        require(seed["concepts"] == q3["seed"]["concepts"] and not q12["seed"]["concepts"],
                "concept union not exact")
        require(seed["trace"] == q12["seed"]["trace"] and not seed["figures"], "union source/figure drift")
        seed_digest = canonical(seed)
        questions = copy.deepcopy(q12["draft"]["questions"] + q3["draft"]["questions"])
        require([row["id"] for row in questions] == ORDER and len(set(ORDER)) == 4, "ID/order contract")
        original_coverage = copy.deepcopy(q12["draft"]["coverage"] + q3["draft"]["coverage"])
        draft = {"schema": "s10y-choice-draft-v1", "seed_sha256": seed_digest, "new_figures": [],
                 "questions": questions, "coverage": copy.deepcopy(original_coverage)}
        for index, row in enumerate(draft["coverage"]):
            package = "q12" if index < 2 else "q3"
            row["reason"] = (
                f"Inherited {package}-only author-time reason (quoted historical scope, not current "
                f"native/figure status): {row['reason']} [End inherited reason.] {COVERAGE}"
            )
        baseline_review = {
            "schema": "s10y-choice-review-v1", "seed_sha256": seed_digest,
            "draft_sha256": canonical(draft), "reviewer": copy.deepcopy(q12["review"]["reviewer"]),
            "source_reviews": copy.deepcopy(q12["review"]["source_reviews"] + q3["review"]["source_reviews"]),
            "figure_checks": [], "new_figure_reviews": [],
            "question_reviews": copy.deepcopy(q12["review"]["question_reviews"] + q3["review"]["question_reviews"]),
            "outcome": "pass",
        }
        review = copy.deepcopy(baseline_review)
        review["reviewer"] = {"kind": "independent_agent", "identity": IDENTITY}
        for index, row in enumerate(review["source_reviews"]):
            package = "q12" if index < 2 else "q3"
            label = "d474" if package == "q12" else "d471"
            provenance = (
                f"Inherited {label} individual review, original SHA "
                f"{packages[0 if package == 'q12' else 1]['historicalReview']['sha256']}; "
                f"current binding qualified by d850 SHA {D850_SHA}; no d864 re-solution. "
            )
            row["independent_solution"] = provenance + row["independent_solution"]
            row["coverage"]["evidence"] = (
                provenance + f"Original {package}-only evidence (historical scope): "
                + row["coverage"]["evidence"] + " [End inherited evidence.] " + COVERAGE
            )
        for index, row in enumerate(review["question_reviews"]):
            package = "q12" if index < 2 else "q3"
            label = "d474" if package == "q12" else "d471"
            provenance = (
                f"Inherited {label} {package}-only individual review with d850 affected binding; "
                "original evidence below is not a new full d864 individual review. "
            )
            related = [item["evidence"] for item in PAIR_FINDINGS if row["question_id"] in item["pair"]]
            for category in ["task_fidelity", "redundancy", "answer_leakage"]:
                addition = (
                    "New d864 composition: this exact question object, source mapping, mode, "
                    "options, intent and key are unchanged; " + DOMAIN
                    if category == "task_fidelity" else
                    "New d864 composition relationships: " + " ".join(related)
                )
                row[category]["evidence"] = (
                    provenance + row[category]["evidence"] + " [End inherited evidence.] " + addition
                )
            row["mathematics"]["independent_solution"] = (
                provenance + "Inherited independent solution (not solved again): "
                + row["mathematics"]["independent_solution"]
            )
            for option in row["mathematics"]["option_checks"]:
                option["evidence"] = provenance + "Inherited option truth evidence: " + option["evidence"]
        directory = OUT / locale / "choice-set"
        for name, value in [("seed", seed), ("draft", draft), ("review", review)]:
            write(directory / f"{name}.json", value)
        question_diffs = [
            {"question_id": row["id"], "originalPackage": "q12" if index < 2 else "q3",
             "unionPointer": f"/questions/{index}", "differences": differences(
                 (q12 if index < 2 else q3)["draft"]["questions"][index if index < 2 else index - 2], row)}
            for index, row in enumerate(questions)
        ]
        require(all(not row["differences"] for row in question_diffs), "non-exact question concatenation")
        locale_manifest = {
            "locale": locale, "sourceRepo": str(source_repo), "status": "COMPOSITION_PASS",
            "outputs": {name: binding(directory / f"{name}.json", value)
                        for name, value in [("seed", seed), ("draft", draft), ("review", review)]},
            "originalAndCurrentPackages": [
                {"package": row["package"], "original": row["d850"]["original"],
                 "current": row["d850"]["current"], "originalToCurrentFieldDiffs": row["d850"]["differences"],
                 "historicalIndividualReview": row["historicalReview"]}
                for row in packages
            ],
            "sourceGroupContracts": contracts,
            "unionSelection": {"numbers": ["1", "2", "3"], "concepts": BLOCKS,
                               "sourceFigures": [], "newFigures": [], "questionIds": ORDER},
            "exactQuestionFieldDiffs": question_diffs,
            "assemblyToFinalFieldDiffs": {
                "draft": differences({**draft, "coverage": original_coverage}, draft),
                "review": differences(baseline_review, review),
            },
            "seedPerPackageFieldDiffs": {
                "q12": differences(q12["seed"], seed), "q3": differences(q3["seed"], seed)},
            "qualification": "Only snapshot bindings, aggregate selection/coverage and scoped evidence change. "
                             "Every original question field and inherited verdict/correct set/option truth is retained.",
        }
        write(OUT / locale / "provenance-manifest.json", locale_manifest)
        locales.append(locale_manifest)
    assessment = {
        "ticket": "STEMROBIN-181", "successor": "181-3", "round": "d864", "date": "2026-11-19",
        "status": "PASS", "reviewer": {"kind": "independent_agent", "identity": IDENTITY},
        "scope": "Independent composition only; original individual mathematics/task fidelity inherited.",
        "d850": binding(D850, affected),
        "inheritedD846NativeLesson": binding(RECOVERY / "report.json", inherited_native),
        "inheritedIndividualReports": {
            package: binding(HISTORIES[package] / "report.json", value)
            for package, value in histories.items()},
        "coverageEvidence": COVERAGE, "domainEvidence": DOMAIN,
        "newCrossPackagePairReviews": PAIR_FINDINGS,
        "existingWithinPackageRelationships": "q12 internal pair inherited d474; q3 internal pair inherited "
                                              "d471 plus d850 affected relationship PASS. Neither is re-reviewed.",
        "locales": locales, "inputBindings": list(inputs.values()), "directCallsAtFreeze": dict(calls),
        "frozenAt": datetime.now(timezone.utc).isoformat(),
        "qualification": "PASS is substantive composition evidence written before native validation. "
                         "Host inference usage unknown. No new individual source or question solution.",
    }
    write(OUT / "composition-PASS-before-validation.json", assessment)
    print("Composition PASS frozen: zh/en, 3 source tasks, 4 exact question units each; validation not yet run.")


def validate_and_freeze():
    assessment = read(OUT / "composition-PASS-before-validation.json")
    require(assessment["status"] == "PASS", "composition not PASS; HOLD without semantic edits")
    require(not (OUT / "report.json").exists() and not list(OUT.glob("*/validate-FIRST.receipt.json")),
            "validation round already started; no repeat")
    require(all(file_hash(Path(row["path"])) == row["sha256"] for row in assessment["inputBindings"]),
            "input changed after composition freeze")
    receipts = []
    for locale in assessment["locales"]:
        output = locale["outputs"]
        require(all(file_hash(Path(row["path"])) == row["sha256"] for row in output.values()),
                "union changed after composition freeze")
        args = ["python3", "-B", str(CHOICE / "validate.py"), "--repo", locale["sourceRepo"],
                "--seed", output["seed"]["path"], "--draft", output["draft"]["path"],
                "--review", output["review"]["path"]]
        started = datetime.now(timezone.utc).isoformat()
        result = subprocess.run(args, cwd=R, capture_output=True, text=True,
                                env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"})
        receipt = {"locale": locale["locale"], "cwd": str(R), "args": args,
                   "startedAt": started, "endedAt": datetime.now(timezone.utc).isoformat(),
                   "exit": result.returncode, "stdout": result.stdout, "stderr": result.stderr,
                   "inputs": output, "compositionPASS": binding(OUT / "composition-PASS-before-validation.json")}
        path = OUT / locale["locale"] / "validate-FIRST.receipt.json"
        write(path, receipt)
        receipts.append({**binding(path, receipt), "locale": locale["locale"], "exit": result.returncode,
                         "stdout": result.stdout, "stderr": result.stderr, "args": args, "cwd": str(R)})
        if result.returncode:
            break
    integrity = all(file_hash(Path(row["path"])) == row["sha256"] for row in assessment["inputBindings"])
    status = "PASS" if len(receipts) == 2 and all(row["exit"] == 0 for row in receipts) and integrity else "HOLD"
    manifests = {
        row["locale"]: binding(OUT / row["locale"] / "provenance-manifest.json")
        for row in assessment["locales"]}
    provenance = {
        "ticket": "STEMROBIN-181", "round": "d864", "status": status,
        "compositionAssessment": binding(OUT / "composition-PASS-before-validation.json", assessment),
        "inputBindings": assessment["inputBindings"], "localeManifests": manifests,
        "unionOutputs": {row["locale"]: row["outputs"] for row in assessment["locales"]},
        "nativeValidationReceipts": receipts, "allBoundInputsUnchanged": integrity,
        "selfHash": "Not embedded; bound by report.json and hashes.json.",
    }
    write(OUT / "provenance-manifest.json", provenance)
    report = {
        "ticket": "STEMROBIN-181", "successor": "181-3", "round": "d864", "date": "2026-11-19",
        "status": status, "root": str(R), "writeRoot": str(OUT),
        "scope": assessment["scope"], "reviewer": assessment["reviewer"],
        "compositionPASSBeforeNativeValidation": provenance["compositionAssessment"],
        "provenanceManifest": binding(OUT / "provenance-manifest.json", provenance),
        "locales": assessment["locales"], "nativeValidateReviewReceipts": receipts,
        "originalPackagesAndSourcesUnchanged": integrity,
        "accounting": {
            "compositionRounds": 1, "newIndividualReviewRounds": 0, "newSourceSolutions": 0,
            "newQuestionOptionsAuthored": 0, "prepareSeedDirectCalls": 2,
            "nativeValidateReviewCalls": len(receipts), "nativeValidateReviewRetries": 0,
            "prepareSeedRefreshesInsideNativeValidate": len(receipts), "structuralOnlyValidateCalls": 0,
            "existingParserAndDigestCallsInCompositionRunner": assessment["directCallsAtFreeze"],
            "originalPackageWrites": 0, "sourceWrites": 0, "canonicalWrites": 0,
            "coreSchemaOrToolWrites": 0, "retentionCalls": 0, "publisherCalls": 0,
            "imagesOpened": 0, "imagesGenerated": 0, "paidCalls": 0, "externalModelCalls": 0,
            "databaseOperations": 0, "deploys": 0, "gitOperations": 0, "chatOperations": 0,
            "sharedIndexOrMeterWrites": 0, "fullTests": 0, "builds": 0,
            "preparationShellCommands": 32, "runnerInvocations": 2,
            "planeReadOnlyHelperInvocations": 2, "planeHttpGETs": 3, "planeWrites": 0,
            "hostTokens": None, "hostCostUsd": None,
            "qualification": "Only explicitly recorded local calls count as zero-cost tooling. "
                             "Host inference cost/tokens are not exposed and are unknown, not zero. "
                             "Final read-only output inspections are outside the frozen runner counts.",
        },
        "fullCard": False, "newFullIndependentSolutionClaim": False,
        "nativeMeaning": "Mechanical consistency and declared semantic review PASS, not automatic "
                         "scientific proof or a new individual review.",
        "stop": "Stopped after one composition round and once-per-locale native validate --review. "
                "No retention, new canonical artifacts, DB, publisher, deployment or follow-up work.",
        "frozenAt": datetime.now(timezone.utc).isoformat(),
    }
    write(OUT / "report.json", report)
    hash_paths = sorted(path for path in OUT.rglob("*") if path.is_file())
    hashes = {"status": status, "algorithm": "SHA-256 exact file bytes",
              "files": [binding(path) for path in hash_paths],
              "selfHash": "Not embedded; compute SHA-256 of this file externally."}
    write(OUT / "hashes.json", hashes)
    for path in sorted(OUT.rglob("*")):
        if path.is_file():
            path.chmod(0o444)
    print(json.dumps({"status": status, "report": binding(OUT / "report.json"),
                      "provenance": binding(OUT / "provenance-manifest.json"),
                      "hashes": binding(OUT / "hashes.json"),
                      "nativeCalls": len(receipts), "inputsUnchanged": integrity,
                      "unionOutputs": provenance["unionOutputs"]}, indent=2))


if __name__ == "__main__":
    require(Path.cwd() == R, "sole explicit shell workdir must be R")
    require(len(sys.argv) == 2 and sys.argv[1] in ["compose", "validate-freeze"], "select bounded phase")
    if sys.argv[1] == "compose":
        compose()
    else:
        validate_and_freeze()
