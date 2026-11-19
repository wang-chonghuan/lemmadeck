# B88 n41 Bounded Metadata Review

Ticket: STEMROBIN-180. Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Outcome: the two-field metadata-only repair is independently verified. No discrepancy found within this bounded review. STOP before modern answer review.

## Scope

Reviewed the saved FIRST diagnostics, FIRST n41 templates versus the isolated current n41 templates, `edition.py` line 36, and the saved six-test result plus its targeted test definitions. The existing independent SOURCE solution freeze was reused unchanged, not revised or compared against modern answers.

No tests, scanner, content parser, normalization, or finalization were rerun. The restoration check operated on raw bytes in memory only, without JSON decoding or disk restoration. No unrelated pre-existing dirty `edition.py` changes were reviewed.

## Four FIRST Diagnostics

The saved adapt-finalize call returned exit 2 on November 19, 2026. Its stdout and the FIRST audit agree on exactly four diagnostics:

1. `lesson.prose[5]`: `want=['0.5','114','20','10']`, `got=['1','0.5','114','20','10']`. The source contains sentence-terminal `1.` and the modern text contains `1` followed by a Chinese full stop. The literal value is unchanged; the diagnostic is explained by the old scanner excluding a sentence-terminal ASCII period.
2. `lesson.prose[11]`: `want=[]`, `got=['0.04']`. The source ends the sentence with `0.04.` and the modern text with `0.04` followed by a Chinese full stop. Again, the value is unchanged; this is scanner punctuation handling, not a `numeric_changes` defect.
3. `exercises[0]`: unchanged text but nonempty `changes`. Both `text` and `source_text` are byte-identical. Removing the false `["layout"]` declaration is justified.
4. `exercises[2]`: unchanged text but nonempty `changes`. Both `text` and `source_text` are byte-identical. Removing the false `["layout"]` declaration is justified.

The FIRST audit remains a saved failure, not a newly passing finalization.

## Exact Repair Boundary

The only changes are `/exercises/0/changes` and `/exercises/2/changes`, each from `["layout"]` to `[]`.

- FIRST exercises: 9243 bytes; SHA-256 `5da3d2035680d759baaf2c731f1280817f12248fabef3e8fd0e35373c8567067`.
- Isolated modified exercises: 9195 bytes; SHA-256 `563353025c563f45d5fbc3bbc79853797f9e280ef2a46a4648d7ca81302a94bf`.
- Restoring only those two declarations in memory reproduces every original byte and the FIRST exercises hash exactly.
- FIRST and current lesson templates are byte-identical: 18730 bytes; SHA-256 `ca6d4ff8c3c7b41d4a4f89cfc7ca20fbf55c356e5b711111b142874bdfdd029d`.
- FIRST and current figure templates are byte-identical: 1428 bytes; SHA-256 `d591cb22a63405cb8ca1161765203b08c38b8dce72e2797783f5ce89df113577`.

The byte-level proof preserves all learner text, lines, formulas, digits, source text, embedded source data, source hashes/references, `numeric_changes`, and other metadata between FIRST and repaired templates. This is identity across the repair, not a claim that modern text equals raw source text generally. No figure assets or rendered output were inspected or reaccepted.

## Scanner Evidence

Current `edition.py` line 36 exactly reads:

```python
NUMBER = re.compile(r"(?<![\w.])-?\d+(?:\.\d+)?(?!\w|\.[\w.])", re.ASCII)
```

By inspection, its right boundary permits a terminal ASCII dot when that dot is not followed by an ASCII word character or another dot; a Chinese full stop also does not block the number. It retains protection against adjacent word tokens and partial dotted tokens. No scanner invocation was performed here.

The saved targeted-test call returned 0; stderr records `Ran 6 tests in 0.000s` and `OK`. The six saved test definitions cover terminal integer periods, terminal decimal periods, Chinese full-stop localization, rejection of partial decimal/word tokens, exclusion of math, and preservation of signed decimals. This is evidence of the parent's single recorded run, not an independent rerun or a whole-parser acceptance.

## Evidence And Stop

FIRST evidence directory: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b88-n41-metadata-repair`.
FIRST audit SHA-256: `060280c4ac75a6c22cad35dc5196b74815b038eca00b6aef4a23fe4344650f1a`.

Saved call/log directory: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-n65-raw-and-text`; reviewed only `b88-n41-adapt-finalize.*` and `b88-sentence-number-regression.*`.

Compared current templates only under `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b88-finalize/work/adapt/8p/modern-us-neutral/lessons/phy8-c2-s2-n41`.

Unchanged SOURCE freeze: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b88-n41-source-solve/invocation180-3-source-solutions.freeze.json`; SHA-256 `d834286dfee484bbd15ee15dd402e53be59402b140cf9c4799e0a995a8f651e6`.

Machine receipt: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b88-n41-source-solve/metadata-review-receipt.json`.

Only this report and its receipt were created. No candidate, canonical, SOURCE freeze, or template was modified; no images/paid calls, app/dependencies/database, Git, or other-chat operations were used. No scientific, source, or FIG acceptance is renewed. Modern answer comparison remains unassigned and unperformed.
