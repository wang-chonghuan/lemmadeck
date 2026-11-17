# STEMROBIN-184 n15: Unique Affected Repair Review Addendum

Date: 2026-11-16.
Scope: parent's authorized unique affected review of Q1/Q2 definition and dependent intent, Q3 inverse provenance, source-159 coverage, and any resulting package effect. No unchanged source, option, or image was re-solved or reopened. No author artifact was patched by this reviewer.

## Binding and History

- Current seed canonical SHA-256: `2c596f209e0dd6a1bd07c074f2b0dd9703be5cb506994d6bbc3b48d252916c70`.
- Current draft canonical SHA-256: `0e1db13722819b5ed8fd532fd298339125970a963b5d085e772dd556ff8e2ba6`.
- Current draft byte SHA-256: `9f61e1d6f719824b543f8a670f697153753de2547675e316f69319e1865616a1`.
- Current learner-view projection canonical SHA-256: `b2b8112856190f9b9b5cd4fec09026124494e5ac533f1f5743b1ab3d11df3dd1`.
- Prior rejected review byte SHA-256: `226ecd0d87605588e58dc2207f473a38a566a0b559768be89d93a3add714070d`.
- Prior source-first freeze byte SHA-256: `7b5cab1757d90eab76407653412602f54e1b490c8327a92e8feda508e50f0d6d`.
- Prior view-only freeze byte SHA-256: `ee3d2a187fffe8b4cc0baccc065f1a73b1ee05e56c60ae693529851a957c8f87`.
- Retained original draft in `geo910-n15-choice-book-trace-before/` has byte SHA-256 `bdc8f4e9b34c6e495ad43c89f15219087351e9326a6eeb62ee3d3bc7ec9b64b1`, exactly the rejected draft's bytes, and canonical SHA-256 `8d6c42658eda5930563d253fd2d90d82cba9deac7b759922b685634a5c6f0bfa`.

The parent's book-trace report documents the intermediate mechanical rebind, whose draft canonical SHA-256 was `a2ee00583b4973213e19f123f183e027e76434ffb511dd7e79a1e7a0be38270c`. This is the pre-semantic-patch snapshot, not the current repaired draft. A structural old/current seed comparison independently confirmed only `/trace/0/sha256` changed; all exercise, concept, figure/asset data and the other trace entries are unchanged. This comparison is not a new source solve or an image open.

The original author checkpoint remains historical. The authorized `geo910-n15-choice-repair-addendum.md` and current Q1 source solution explicitly identify its bijective definition as rejected and superseded. No success was written back into either old reviewer freeze or the rejected review.

## Exact Semantic Change Inventory

Apart from `/seed_sha256`, old/current draft comparison found only:

- `/questions/0/view/stem`.
- `/questions/0/intent/task`.
- `/questions/0/intent/source_solution`.
- `/questions/0/intent/unit_reason`.
- `/questions/0/intent/limitations/0`.
- `/questions/1/view/stem`.
- `/questions/1/intent/task`.
- `/questions/1/intent/source_solution`.
- `/questions/2/intent/source_solution`.
- `/coverage/0/omitted_tasks/0`.
- `/coverage/0/reason`.

All 36 option objects and all 7 key/rationale objects are structurally identical to the retained rejected draft. Q4-Q7's whole question objects are identical. Source-160 through source-163 coverage, figure registration, IDs, ordering, modes, source mappings, and image hashes are unchanged.

## Affected Findings

Q1 now uses the source injective definition and identifies the zero-distance argument as the complete literal-159 judgment. Its retained inverse/onto/isometry classification is expressly an additional Euclidean application, not a strengthened definition or two extra source tasks. Its production limitations separately identify the original argument and added proofs. This resolves both definition drift and source-demand inflation without altering the valid prior {D} truth set.

Q2 now states the injective definition and shows injectivity directly by applying the self-inverse map to equal images. Onto is explicitly additional for this map. The paired transformation/movement classification, perpendicular exception, and prior {C} remain unaffected. Existing reversibility wording refers to this proved involution, not to all injective transformations; the unchanged B misconception remains the previously accepted overstrong non-isometry error, not a new definition.

Q3 now explicitly derives the full-domain inverse from the orthogonal-isometry theorem and rejects the definition-based provenance. Its visible view and reverse application are unchanged. The author repair addendum supersedes the same wrong attribution in the preserved checkpoint.

Affected package check: Q1's corrected definition does not invalidate its separately justified inverse theorem, so Q3's inverse-direction reasoning remains valid. Q2 no longer teaches a competing definition. R1 theorem-to-center reuse and R2 inverse-rule reuse retain the actual recognition/limitation rationale approved in the rejected review; no new answer leakage or essential coverage loss was introduced.

## Review Assembly and Reuse

Output: `geo910-n15-choice-independent-review-repaired.json`, bound to the current digests above.

Only six prior rejected verdict records are replaced: source coverage for 159, 160, 161 and task fidelity for Q1, Q2, Q3. They now pass with the affected evidence. The aggregate changes from revise to pass.

All prior PASS records are copied verbatim: every independent source solution, source-162/source-163 coverage, all 7 mathematics records including all 36 option checks, all 7 redundancy records, all 7 leakage records, Q4-Q7 task-fidelity records, and the actual figure check. No new figure reviews are needed because the registration is unchanged and empty.

Some copied mathematics evidence contains historical cautions about the previously rejected source definition or attribution. These are provenance of the inherited PASS records, not assertions that the current repaired definition is still wrong; the six new fidelity/coverage records resolve that historical defect explicitly. The earlier source solutions already incorporate the authoritative n14 correction and remain valid.

The reviewer-owned JSON is assembled by a structured mechanical merge of those unchanged prior records with the six newly authored affected records. No author file, option truth, prior evidence text, source pipeline, application, dependency, database, environment, browser, Git, or history is changed.

## Validation

The parent authorized one official validation invocation on current seed, current draft, and this new review. Exactly one invocation was executed after assembling the complete review:

```bash
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-choice-seed.json --draft .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-choice-draft.json --review .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-choice-independent-review-repaired.json
```

Observed exit code: `0`.

Observed output:

```text
mechanical checks passed; declared semantic review: pass (not automatically proved)
```

No retry or second official invocation was made. The reviewed repaired snapshot passes the declared independent semantic review and the tool's mechanical checks; this is not a claim of automatic mathematical proof, publication, or application integration.
