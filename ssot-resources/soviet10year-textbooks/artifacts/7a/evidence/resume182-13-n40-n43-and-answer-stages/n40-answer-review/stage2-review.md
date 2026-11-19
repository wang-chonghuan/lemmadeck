# N40 Stage2 Independent Comparison

Result: **PASS comparison, with all 8 table-route HOLDs preserved.**
No actionable discrepancy was found in the disclosed binding author snapshot.
This is not a gate2 pass, finalized answer key, table-source approval or
full-lesson credit.

## Binding

Exact cwd: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Branch: `codex/STEMROBIN-182-textbooks`.
Lesson: `alg7-c4-s2-n40`, edition `modern-us-neutral`.

The following complete-file SHA256 hashes were verified:

| Input | SHA256 |
| --- | --- |
| Independent Stage1 solutions | `ac8692e9d5ed67608628effcb8a9fb475c0a0af9be528e11bea4c247a3c2697d` |
| Stage1 freeze receipt | `08ac08911ca7e3176bd0a70eb58926727758c312f00f1cb30a3ed5851ebfa424` |
| Original table HOLD inventory | `4479de319bb5fb05282862e37525dada1d4c1ebb80060f91852b48402b89872e` |
| Disclosed author frozen keys | `a3ff6ba29e58d7f7ff8ea875b0d39417c80afffa41672de6683a19a63e26d7e4` |
| Disclosed author binding | `11adf93ba35ff03d496abce1d7405eaad00de9101e3678e037888c8a2cde8a57` |

The author's bound exercise-input hash equals the Stage1 exercise-input hash:
`1aa9fc150fd1633b6699f3cc792731c4c0d24fe671cdb53f9f75355b9ea7343f`.
All Stage1 freeze-bound files are unchanged. All 14 author entries are
`source: "derived"`, `grading: "ungraded"`, `parts: []`.
The mutable author candidate and retained FIRST draft were not opened.

## Comparison

14 exercises and 67 tasks were compared against the existing frozen solve:
62 labeled subparts, the whole-exercise task 833, and 4 additional unlabeled tasks.

- **55 tasks PASS in 11 unaffected whole exercises:** 820-828, 832 and 833.
- **4 additional non-table tasks PASS:** 829's algebraic method preference;
  831's nonnegative inverse formula and the two scale changes.
- **8 mathematical components agree, but their required table lookups HOLD.**
- **0 actionable discrepancies; 59 fully passing non-table tasks in total.**

The ten comparison signs in 824, both increasing chains in 825, negative-variable
extractions in 826, set membership in 827, strict original domains in 828,
interval endpoints in 832, and 833's 34 integer outputs for real x all match.
Author decimal forms 40.5 and 1.5 in 824 equal the frozen rational forms.
Author European interval brackets in 832 are equivalent to the frozen
parentheses notation; they are not mathematical errors.

829's displayed root and product are separately rounded direct references;
the author binding retains their full-precision reference values. Agreement
does not certify a rounded table-root multiplication or table rounding order.
Both requested methods have one requested root lookup. Method 2 passes only
for its exact rewrite and avoided truncation/post-lookup multiplication;
actual table-specific convenience remains unapproved.

831's numerical references are interpreted within the explicitly approximate
input model, not as exact physical measurements or table readings.
The prior `p0243#9` modern-prose sign-review state is outside this answer-only
comparison and has not been reassessed or approved.

## Preserved Table HOLDs

| Route | Required mathematical target | Comparison | Lookup completion |
| --- | --- | --- | --- |
| 829-1 | `6*T(0.3333)`; algebraic alternative `(3/5)*T(33.33)` | PASS reference only | HOLD |
| 829-2 | `T(12)` | PASS exact rewrite/reference | HOLD |
| 830-a | `T(80)` | PASS exact rewrite/reference | HOLD |
| 830-b | `T(450)`; algebraic alternative `10*T(4.5)` | PASS exact rewrite/reference | HOLD |
| 830-c | `T(28)` | PASS exact rewrite/reference | HOLD |
| 830-d | `T(120)`; algebraic alternative `10*T(1.2)` | PASS exact rewrite/reference | HOLD |
| 831-a | Approximate-input root of `625/157`, in cm | PASS branch/reference | HOLD |
| 831-b | Approximate-input root of `412/157`, in cm | PASS branch/reference | HOLD |

`T` denotes an unverified source-table procedure, not an assumed direct entry.
Every exact preprocessing, table address/correction, actual value and
precision/rounding provenance HOLD from `table-holds.json` remains unchanged.
No table pages or images were opened and no new table values were obtained.

## Evidence And Stop

Local comparison-report checks passed: input/freeze hashes, author binding,
task coverage, all 52 unchanged exact answer tokens for 820-828, and 9 existing
reference displays at the author's eight-decimal precision. No unchanged
arithmetic was re-solved. The remaining domain, interval, inverse, scale and
integer-range comparisons use the frozen reasons and disclosed answer prose.

`stage2-review.json` SHA256:
`aa17fce80e49b9c4422441eae2a4a8c2a43e1b8bcafeb37d9dc160f916d78ae2`.
Its exact input paths, per-exercise findings and all 8 route records are in JSON.
This Markdown file's own SHA is returned separately to avoid a circular hash.

Only the two Stage2 reports were added. Stage1 evidence, author files and other
workers' files were preserved. No app, durable assets, database, network,
rendering, finalization, publishing or commits were used. Stop after this result.
