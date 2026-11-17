# FIRST Independent CHOICE Review: Distance/Time Batch 52

Date: 2026-11-17. Reviewer: independent-agent-b52-distance-time-first.
Outcome: PASS for ONLY the six selected `6p / phy6-c3-s5` choice candidates.
Zero author repairs; author's no-repair 0/1 snapshot preserved.

## Exact Inputs

Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Ticket: `STEMROBIN-180`.
Artifact root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s5`.

- Seed: `seed-b52.json`; canonical SHA-256 `9401583320a0d79b8d2ee3d1f5b326758947f7bb2d944d2009bdaad38f20854f`.
- Draft: `draft-b52.json`; canonical SHA-256 `6db7477a4dc26dae6c62b85f4eaf22549d9e4349e5b6bf37883c0e065ef0687c`.
- Review: `review-b52.json`; canonical SHA-256 `4b3e126a81ec738b7fb5c78072b2364ee35afdca7625b83a12944724dbff0662`.
- Contract: `s10y-choice-review-v1`, canonical UTF-8 SHA-256 of `json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))`.
- Selected seeds exactly `1,2,g2-2,4,5,6`; selected definition blocks exactly `1,2,3,7,8,9`.

## Staged Independence

Source-first: read only the exact seed and three actual hashed source figures, solve all six selected original tasks, then freeze `source-solutions-frozen-b52.md`.

Pure-view: only then output `question.id` and `question.view` from a machine JSON projection. Inspect every stem and all 24 alternatives, fix every truth and intended set, and freeze `pure-view-frozen-b52.md`. No intent, source solution, key, rationale, coverage or author report was exposed during this stage.

Author-key comparison: a disclosure command checked that both freezes existed before outputting the exact draft's internal fields. Compare every authored source solution, key, option derivation, misconception, response-unit explanation, figure observation, limitation and coverage note. The author's separate solution/report files and screenshots were not opened.

Frozen file byte SHA-256 values:

- Source freeze: `9d5fbc55afe9f099c1c5eebefeb2b0978a0e0f157ae4aff1a770b91c5cb83287`.
- Pure-view freeze: `0e1937a4d548cd2c70e61b75d6ad3cb39faaca3e97c3fd6d130257c14267595a`.

Both freeze hashes remained unchanged after author comparison and reviewed validation.

## Candidates

| Source | Candidate | Mode | Independently frozen set | Author set | Verdict |
| --- | --- | --- | --- | --- | --- |
| 1 | b52-uniform-methods | single | C | C | PASS |
| 2 | b52-average-interval | multiple | A,C | A,C | PASS |
| g2-2 | b52-flight-distance | single | B | B | PASS |
| 4 | b52-distance-graph-estimate | single | D | D | PASS |
| 5 | b52-shared-graph-comparison | single | C | C | PASS |
| 6 | b52-velocity-graph-distance | single | B | B | PASS |

All 24 per-option truths agree. Concrete calculations and counterexamples appear in the two freezes and canonical review; key agreement alone was not the semantic test.

Graph32 independently reads approximately 417 km at 10 h and approximately 41.7 km/h, consistent with author's rough 420/42. The correct wide bands, 350-450 km and 35-45 km/h, accommodate supported coarse reading. They also admit the rougher 400/40 estimate, so exact-value or fine-interpolation capacity is not certified. Wrong endpoint assignment, missing time division and tenfold-small readings are still distinguished.

Graph33 retains I's greater slope with a common-time distance reason; Graph34 retains horizontal nonzero speed 10 m/s and `10*5=50 m`. The average-speed task retains full-interval forward/inverse relations and rejects an asserted fixed first-half distance: speeds 12 and 24 km/h for 15 min each give total 9 km but first-half distance 3 km, not 4.5 km.

## Images

Actual asset paths all lie under `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/figures/`.

| Asset | Byte SHA-256 | Observed content |
| --- | --- | --- |
| fig-32.svg | 85ca6483cc6291fb055f7ec4e9b632b8802397e0581faf5a015bbe4b15d4043b | Full s(km)/t(h) axes; line from origin to about 12 h,500 km; 10 h height slightly above 400 km. |
| fig-33.svg | 3ff448cb7986aee13345302b90e3a6bc918f3e3a944f1a5d5385b822b5ffcee3 | Full shared axes, I/II and endpoints; I steeper, approximately (5 s,10 m) versus (6 s,6 m). |
| fig-34.svg | 7a9c9963001dbbdc8dc05c0db7c20b79068394c1b8eb44700a15405f920626ff | Full v(m/s)/t(s) axes; horizontal 10 m/s line covers 0 through 5 s and beyond 7 s. |

Local Quick Look PNGs in `reviewer-b52/` were each opened once. Entire rightmost/bottommost relevant content was visible; no crops, reopens or forwarded source images. Image count 3/8 task, 3/24 fresh context. Preview hashes and detailed observations are in `reviewer-b52/comparison-b52.md`. `new_figures=[]`; no new-figure review was necessary.

## Scope and Capacity

Six choice items: five single, one multiple. Source 2 uses explicitly added numeric migration conditions; its inverse is recognition with a known duration, not independently producing a general formula or solving an unknown time. All items lose proof of independently written solutions, explanations or calculations; the author's limitations and omission notes accurately disclose this. No selected source's essential forward/inverse, interval, units, graph/calculation or comparison/reason relationship is silently omitted.

`g2-1` and `3` remain explicitly deferred table-dependent conversions. No table was added or read, and no other-course or answer data bypassed the whitelist. All eight original written tasks remain retained and untouched outside this review. PASS does not mean six independent written-task productions, all-eight choice coverage, a whole-batch approval, integration or publication.

## Verification

The reviewer ran the following ONCE, only after the semantic PASS review was written:

```bash
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s5/seed-b52.json --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s5/draft-b52.json --review .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s5/review-b52.json
```

Exit code `0`: `mechanical checks passed; declared semantic review: pass (not automatically proved)`.

No structural-only rerun, FIG/native gate, broad test, new review machinery, author repair, seed/draft edit, Git operation, DB access, application operation/edit, dependency change, model service, publication, history, prior choices, interaction artifacts or original/legacy answer keys were used. The exact draft's internal key was read only in the authorized post-freeze comparison. Only the requested review files and reviewer-local previews were written. The authoritative semantic evidence is the staged independent reasoning, not automatic proof from the checker.
