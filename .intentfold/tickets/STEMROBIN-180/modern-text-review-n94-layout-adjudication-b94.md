# STEMROBIN-180 n94 Narrow Layout Adjudication

Date: 2026-11-19. Verdict: **TEXT REVISE retained**.

Previously compared semantic content: **PASS, reused from FIRST TEXT**. This is not another 14-object/eight-task review. Finalization and final display approval remain unperformed and unclaimed. Images: **0**. Content-repair attempts consumed by this adjudication: **0**.

## Stage and Ownership Correction

The parent is correct that the skill assigns deterministic final layout to the tools, not to an `adapt-prepare` template's presentation alone. The first report's prescription to manually format the author template before finalization was premature as an ownership conclusion. That immutable report remains intact; this addendum clarifies the distinction without charging an author content-repair attempt.

However, the requested production-code experiment does **not** support treating these two findings as automatically resolved by the missing finalization stage. Both survive the exact current production normalizer.

## Production Call Chain

In `.claude/skills/ld-s10y-lesson/tools/edition.py`:

- `cmd_finalize`, line 1952, passes the work templates to `validate_lesson` at line 1962.
- `validate_lesson`, line 1581, loads the candidate lesson and calls `normalize_lesson_layout(lesson)` at line 1597, before the remaining validation.
- `normalize_lesson_layout`, line 777, calls `normalize_prose_layout` for every `kind: "p"` object.
- On successful validation, `cmd_finalize` sets the returned documents' status to `ready` at line 1988 and dumps them at line 1989. This is not a separate sentence/formula layout algorithm.

The contract at lesson `SKILL.md` lines 80-83 and 356-364 still requires complete sentence lines, short paragraphs, and separately introduced formulas, with deterministic finalization responsible for applying them. No full `adapt-finalize`, figure validation, rendering, publication, or database operation was invoked here.

## Isolated Experiment

Input: the same frozen `current-freeze/lesson.template.json`, SHA-256 `3b1bb262950d15908e185d5f00d185d6f915c60efda2ecdec964169ae02be7d3`.

A writable clone was created only in `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-TEXT-layout-adjudication/`. The exact, unmodified AST definitions of production `MATH`, `masked_math`, `nesting_depths`, `normalize_prose_layout`, and `normalize_lesson_layout` were compiled and executed there. Extracting those definitions avoided unrelated module imports and their side effects; no substitute normalizer was authored.

The production call visited all ten `p` objects. Changed prose indices: **none**. Additional changed `p` objects requiring inspection: **0**. Only affected indices **0, 2, and 13** were inspected. The normalized document value is unchanged; serialization alone accounts for the isolated JSON clone's different file hash.

The normalized clone was then passed to the same `htmlfrag.js` `proseOutline`, `sectionBreakIndices`, and `proseFlow` functions used by `prose_flow.mjs`. Only the three affected paragraph texts were returned for inspection. The empty section-break list still resolves to zero breaks.

## Actual Counterexamples

| Finding | Object | After production normalization and authoritative flow |
| --- | --- | --- |
| `TEXT-N94-1` | `prose[0]`, `p0246#4` | Text unchanged; six complete sentences remain one paragraph and one line, with zero newline characters. |
| `TEXT-N94-1` | `prose[2]`, `p0246#6` | Text unchanged; six complete sentences remain one paragraph and one line, with zero newline characters. |
| `TEXT-N94-2` | `prose[13]`, `p0248#2` | Text unchanged; the introduction, `Q=qm`, and `q` definition remain one line. No standalone formula line is produced. |

The exact normalized `prose[13]` counterexample is:

```text
**为了计算任意质量$m$的燃料在完全燃烧时所放出的热量$Q$.需将被燃烧的燃料的质量乘以该种燃料的燃烧值：**$Q=qm$，式中$q$——燃料的燃烧值.
```

The full unchanged normalized texts for indices 0 and 2, and their equal before/after text hashes, are retained in `normalization.json` and the affected authoritative paragraphs in `flow.json`.

The relevant production behavior explains these results: line 595 recognizes `。！？；;`, not a plain ASCII sentence-ending period. These inputs use ASCII periods outside math. At lines 597-599 the colon rule requires the remaining text to start immediately with `$` after whitespace removal; the actual suffix is `**$Q=qm$`, so closing bold delimiters prevent that formula break. The short-paragraph grouping at line 668 cannot split a long single line when no sentence boundaries were created.

## Narrow Conclusion

Both automatic-settlement results are **false**. Retain **TEXT REVISE** for these two output-layout counterexamples; do not replace it with “expected pending normalization.” The already-established 14-object/eight-task semantic fidelity remains **PASS** without a repeat review. Actual n94 finalization and final display approval remain pending, but that pending state is not evidence that the present normalizer will resolve the demonstrated issues.

This is an identified production-layout gap, not a new science, number, unit, question, SOURCE, or figure defect. No source, frozen input, original review, canonical file, production code, or author candidate was repaired. No repair budget was consumed. Any eventual authorized layout remediation needs only affected-output verification, not another blanket semantic review.

Reused counts: **14 prose objects, 8 exercises, 2 figure identities**. Narrow inspected objects: **3**. Normalized changed prose objects: **0**. Additional changed prose inspected: **0**. Images: **0**.

## Immutable Evidence

- FIRST TEXT manifest: SHA-256 `c8318881ceeb548e7235297ed15b363603239f39ca4be0d67f00a2167059fb0d`; its original 105 hash-binding entries are retained.
- FIRST TEXT report: SHA-256 `c18929538b387c0fa4b2f3a001b033dbe029ded4b18ea903b12facc6fa962ecb`, unchanged.
- `normalization.json`: SHA-256 `4b655762a5628c2358e0696281a1fe8a1d25a08ea6804611c3b35c48b2bd7a0e`.
- `flow.json`: SHA-256 `79123bda35fdbdb3b8deba2119e81f0b6ec85376662c386c921477139f7d0aa4`.
- `lesson.normalized-isolated.json`: SHA-256 `e243fa1b4b49ebb63f488ee1a23c9d46c44be62f00987168bcee140c240b632d`; experiment only, not a finalized edition.

The separate `n94-TEXT-layout-adjudication/manifest.json` binds the reused review evidence, exact input and production code, this durable report and its `report.md` copy, scripts, isolated outputs, and completed recorder receipts. Reports, manifest, and experiment evidence are sealed `0444`. Its final seal receipt is an external envelope, not a recursive manifest entry. All commands used the authorized explicit workdir and existing recorder.
