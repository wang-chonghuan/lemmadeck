# N45 Written-Answer Comparison

Verdict: **MATCH/PASS**.
Issue units: **0**. Affected originals: **0**. Affected tasks: **0**.

The actual frozen `n45-answer-author/FINAL/answer-keys.json` was read after
the independent Stage 1 source-math freeze. All 19 author answers are
mathematically equivalent to that freeze, preserve the original mathematical
tasks and requested quantities, and provide complete standard answers.
MATCH means mathematical and task-level agreement, not byte-identical wording.

## Checked Snapshots

- Stage 1 `n45-answer-review/freeze-manifest.json`:
  `d0160ff80f1e1879d099b19a18fd59d59d59a1b438a80966ca0a06099a85b6c2`.
- Stage 1 `source-solutions.md`:
  `28ce53e6960286936d72520d5c078975c1606bfe4116afde1f479910a6e06396`.
- Author `FINAL/answer-keys.json`:
  `a5a9a5064f7085587086e8fe2311c54d166208cdd239e131364286edb492a592`.
- Author `FINAL/report.md`:
  `e0ce7dd5681bc9c17c34dd74f1b35f58214106669d7e1713f6a6a1bad3741a87`.
- Author `FINAL/manifest.json`:
  `151bdbbe450b1358c0e44de9a4e62c94800109a07454e166ed97f7e559e8e7f7`.

`checked-inputs.json` gives all nine exact absolute paths, actual byte hashes,
sizes and verified 0444 modes. The Stage 1 manifest's five output hashes and
the author manifest's answer/report hashes agree with the actual bytes.
The historical source/image hashes are reused through the frozen
`n45-answer-review/input-hashes.json`; their original files were not reopened
or rechecked in this comparison.

## Coverage And Reuse

Compared: 19 author answers; all 44 lettered subparts, plus the 13 mathematical
tasks within 889--891, for **57/57 MATCH/PASS** task units.
The author's report counts 47 top-level records (44 lettered plus three
unlettered originals); that is compatible with the Stage 1 expanded 57-task
ledger and does not omit any of the graph or placement requests.

Reused: one independent source-math freeze, all 19 original solutions, all
57 task solutions, and the existing four-image observation batch for figures
60 and 61. New independent solves: **0**. New image views/reopens: **0**.
No source lesson/exercise/figure files or choices were reopened.

## All-Original Comparison

| Original | Tasks | Concrete Match And Task-Fidelity Evidence |
|---|---:|---|
| 873 | 2 | (a) 11 and 17 with non-natural root rejected; (b) both 10*12 and (-12)*(-10), without importing (a)'s natural-number restriction. |
| 874 | 2 | (a) perimeter 32 cm, not area or side length; (b) both 10 m and 21 m sides. Positive-length domains and cm/m units preserved. |
| 875 | 2 | Consecutive natural pairs 11,12 and 7,8; negative candidates rejected. Product-minus-sum and squared-sum-minus-squares directions preserved. |
| 876 | 2 | Area 9.6 m^2 from legs 3.2 m and 6 m; perimeter 90 cm from sides 15,36,39 cm. Ratios, requested quantities, positive scales and squared units preserved. |
| 877 | 6 | All root sets match in order: {-1,3}, {-1,12}, {-4,-2}, {-2,12}, {-4,5}, {-2,12/5}. Constant-denominator domain and original multiplication scopes preserved. |
| 878 | 10 | All root sets and forbidden-denominator conditions match, including discarded 2 in (a/e), no roots in (i), and discarded 3 in (j). Detailed per-subpart evidence is in comparison.json. |
| 879 | 2 | y=-11 and a=6 with forbidden values 5 and -2 discarded; sum/product and ordered first-minus-second difference are preserved. |
| 880 | 2 | Both convention-qualified fraction tasks match, including the signed original -5/-6 in (a) and zero original 0/4 in (b). Neither is called extraneous or unconditionally rejected. |
| 881 | 2 | Last-27-km time 3/2 h, and both return speeds 12 and 50 km/h. Six minutes remains 1/10 h; no unstated upper-speed bound. |
| 882 | 2 | Original train speed 80 km/h; slow/fast travel times 3 h and 11/5 h. Worker order and 48 min = 4/5 h preserved. |
| 883 | 2 | Lake speed 27 km/h in (a); both 5 and 6 km/h in (b), with v>2 and lake time one hour longer than upstream time. |
| 884 | 2 | Upstream speed 11 km/h, not still-water 13; current magnitude 2 km/h with 0<=c<20. Downstream/upstream difference is twice the current. |
| 885 | 2 | First/second machine solo times 24/16 h; first/remaining second typist solo times 14/3 and 35/6 h. Staggered work durations and minute conversions match. |
| 886 | 2 | Full standard proofs, not bare 22/18 assertions: conjugate denominator products 1, numerators 22/18 and nonzero denominators all supplied. |
| 887 | 2 | Values 1/10 and 7/2 with nonzero original denominators and the frozen conjugate identities. |
| 888 | 2 | x=t-7 and x=2t^2-1, both for every real t, with substitution reasoning. |
| 889 | 3 | {0,4}, [-1.5,0) union (4,6], (0,4). -1.5 equals frozen -3/2; closed domain endpoints and strict crossing exclusions preserved. |
| 890 | 2 | Every one of the 20 positive-domain point pairs matches; optional (0,0) gives 21 under the zero-inclusive convention. Isolated-point construction and unique-remainder function reasoning both supplied. |
| 891 | 8 | Both frozen complete orders, all four placements per panel, reflection for -x and rejection of pixel-derived numerical x supplied. Approximate placement is the task; the freeze's optional exact construction is not required. |

## Conditional Conventions

880(a) explicitly conditions 4/3 on positive integer components and separately
retains the signed original -5/-6, applying modifications to that representation.
880(b) explicitly conditions 11/15 on strictly positive original numerator and
retains 0/4 when zero is allowed. These match the prior Stage 1 mathematics;
there is no unconditional uniqueness claim and no omitted literal branch.

890 explicitly gives both natural-number conventions. The actual point list
matches the frozen list for 1..20, and (0,0) is expressly added when appropriate.
The unconditional assertion that the relation is a function is valid in both
conventions, exactly as the freeze records.

The author's suggestion to settle a *desired single-convention presentation*
does not create a blocker: the present conditional presentation is complete and
passes. This comparison requires no further convention decision or new barrier.

## Artifact And Scope Findings

The actual key has exactly one answer for each original 873--891, all
`source: derived`, all `grading: ungraded`, and all 19 `parts` arrays empty.
The complete student-facing reasoning lives in `displayAnswer`; no grading
slots were added. The artifact correctly remains `status: draft`.

No defects, omissions, unsolved tasks, or remaining comparison gaps found.
This is written-answer semantic acceptance of the checked frozen bytes, not
finalization, publication, a new figure review, or overall ticket completion.

Only new `n45-answer-comparison/` files were written. Original evidence and
other workers' changes were preserved. No mathematical re-solve, image/source
reopen, choices, finalizer, promotion, DB, network, app, dependency, git or
progress writes occurred. No author checker or normal finalizer was rerun.
The parent retains binding/promotion and the one normal answer-finalizer run;
the stated n44-push dependency is unchanged.
