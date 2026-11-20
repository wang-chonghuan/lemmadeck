# STEMROBIN-180 b97: independent n129 TEXT review

**Verdict: PASS.** No actionable scientific, prose-fidelity, task-identity, or section-anchor defect was found in the frozen n129 candidate. No content revision is requested. This is an independent TEXT decision only, not an answer-source, CHOICE, image, display, finalization, publication, or whole-ticket completion decision.

Review completed locally on 2026-11-19. Workspace and every executed review command used:

`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`

## Frozen decision target

- Lesson/card: `phy7-c2-s2-n129`, printed unit 129, title `电流的方向`, book `7p`.
- Author manifest: `/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n129-text-author/manifest.json`
- Manifest SHA-256: `e72eb28517708e21664b5451f99eadab165d3d49637349ba91fff96bdbfd69b6`; all 11 entries match their recorded SHA-256 and byte counts. The manifest and three candidate templates are mode `0444`.
- Lesson candidate SHA-256: `6a5c4e71590a82aabcd353bc00392962464616ac9e5ba22188a68ff44d68c7a9`.
- Exercise candidate SHA-256: `90bb28a83f82e1e444fe5e6ba43b39ca55b65d5327739c427e76a4e53581a394`.
- Figure manifest SHA-256: `143abbd7ed4fa0ecbed9aec3f426e408adfbe652eafb9bc2bd50fbcfd051518f`.
- Reviewed the frozen templates, not the mutable author `currentPath` aliases. Used the actual raw lesson/exercise files and source snapshots, not the author's verdict as approval.

The lesson's `source.data` equals the actual raw lesson JSON; the exercises' `source.data` equals the actual raw exercises JSON. Their `source.sha256` values match the files read. The independently approved SOURCE325/326 stages were inherited, not replayed: only existing file hashes and relevant closed-block identity/text bindings were checked. No scans, page images, figures, source inventory, or source-review conclusions were reopened or rejudged.

## Scientific and fidelity findings

| Target and approved source binding | Independent assessment |
| --- | --- |
| Prose 0, `p0325#9` | Preserves the section-127 copper-sulfate observation and the electrode connected to the negative terminal. `该实验` explicitly limits the deposition statement to this experiment; it does not assert that every electrode chemistry or electrolyte deposits copper. `析出` is a suitable modern description of the retained observation. |
| Prose 1, `p0325#10` | Retains swapping the two source-terminal connections, deposition at the electrode now connected to the negative terminal, and the conditional opposite galvanometer deflection. The experiment and comparative direction are preserved; no unsupported absolute meter-pointer direction is introduced. Original figure 273 remains a prose-only cross-course reference. |
| Prose 2, `p0325#11` | Preserves directional current and the important qualification that only *some* effects depend on direction. The emphasized conclusion remains intact. |
| Prose 3, `p0325#12` | Correctly distinguishes negative electron carriers in metals from positive/negative ionic carriers in electrolytes. Opposite directed ionic movement is qualified by the electric field; `有序`/`定向` is not confused with random thermal movement. No claim of freely mobile positive carriers in an ordinary metal is added. |
| Prose 4, `p0325#13` | Preserves the question of which charge-motion direction defines current. In its immediately preceding electrolyte context, the contrast between positive and negative charge motion is coherent, not a new universal assertion about carrier mobility in every conductor. |
| Prose 5, `p0325#14` | Retains the source's electron-direction alternative but explicitly presents it as hypothetical, not today's current convention. The negative-to-positive external-metal direction belongs to electron motion in the supplying-circuit context established by the experiment and clarified in the final paragraph. It does not overwrite the positive-charge definition of conventional current. |
| Prose 6, `p0326#1` | Preserves the source's historical order and old explanation as a historical report, while warning against treating universal positive/negative carrier mobility as present scientific fact. The final paragraph clearly defines conventional current by positive-charge motion or possible motion, limits the terminal-direction statement to a source normally supplying its external circuit, and states the opposite electron drift in the same external metal wire. |

The distinction is scientifically sound: conventional current direction is a definition, while electron drift is a physical carrier direction. The final positive-to-negative statement is explicitly about the *externally supplied circuit*, not an unrestricted statement about the inside of a source, charging operation, or every part of every circuit. The metal restriction is retained where electron transport is discussed. These conditions clarify the source's implicit experiment scope rather than change its learning objective.

No unfamiliar scientific fact required external verification. Review used established elementary carrier/current reasoning and the approved faithful source text; external sources and network calls: **0**. The historical explanation is retained as source-authored history, not presented as a separately researched historical discovery claim; no dates or named discoverers were added.

## Three written tasks

| Task | Source identity | Finding |
| --- | --- | --- |
| 1 | `number=source_number="1"`, `问题`, `g1`, `p0326#3` | Text is exactly the raw source question. Its requested observational basis is supplied by the retained prose; it needs no embedded figure or other lesson's task. |
| 2 | `number=source_number="2"`, `问题`, `g1`, `p0326#4` | Text is exactly the raw source question. The final definition supports it, including possible positive-charge motion; the question does not require asserting mobile positive carriers in metals. |
| 3 | `number=source_number="3"`, `问题`, `g1`, `p0326#5` | Adds only the normally supplying, external-metal-circuit condition and `定向`. It still asks for the same terminal-to-terminal electron direction. It does not disclose that direction, add a subquestion, ask a new quantity, or change the exercise identity. `changes=["wording","conditions"]` accurately declares the clarification. |

All three retain their source bindings, group identities, order, and empty figure dependencies. Their `lines` equal their modern text split on newlines; the print-wrapped lines of tasks 1 and 2 are not treated as separate tasks. No answers, answer keys, acceptance sets, or CHOICE material were read or authored.

## Identity and excluded material

- TOC identity matches unit 129 at printed page 314; source metadata binds physical pages 325/326 to printed pages 314/315 and the retained `6-7p` source-PDF identity.
- Exact prose targets: `p0325#9` through `p0325#14`, then `p0326#1`. Every `source_text` equals both the raw lesson text and the corresponding approved closed block's joined lines.
- Exact task targets: `p0326#3`, `p0326#4`, `p0326#5`. The heading at `p0325#8` matches the lesson; the next heading at `p0326#6` is unit 130.
- The preceding unit-128 question prefix is excluded despite its overlapping printed task numbers. Incomplete unit 130 is excluded; no page-327 input or gap-bridging assumption is used.
- Seven prose objects, three tasks, zero figure slots, zero task figure references. The literal section 127 and figure 273 numbers are unchanged. Figure 273 is not interpreted as missing local media.
- No formulas, mathematical corrections, numeric substitutions, named historical entities, prohibited profile terms, or Cyrillic characters were introduced. `errata=[]` agrees with the bound page metadata.

## Actual parser and boundary evidence

Executed the existing `prose_flow.mjs` against the frozen candidate, and independently called the same `htmlfrag.js` helpers used by the publisher and offline renderer. Also invoked the existing edition normalization/text-validation functions on deep copies in memory, without running assemble, prepare, finalize, render, or publish.

**Result: 7 prose objects become 8 final paragraphs, with 2 uniquely resolved anchors at zero-based indices `[3,7]`.** This is actual shared-parser output, not a count of source objects or single newlines.

1. Index 3 separates the directional-effects conclusion (`prose[2]`) from carrier types (`prose[3]`). Both full `before`/`after` texts match exactly one adjacent final-paragraph pair.
2. Index 7 separates the first paragraph of `prose[6]` (source-authored historical explanation) from its second paragraph (present convention and supplied-external-circuit applicability). This boundary is inside one source-bound object; it is not incorrectly placed before the entire historical/convention object.

`proseParagraphs` splits on two or more newlines; single newlines remain within a paragraph and render as `<br>`. Both `sectionBreak` flags are on the following paragraphs, exactly as the publisher and offline renderer consume them. Existing normalization leaves the frozen lesson and exercise objects unchanged, so neither anchor becomes stale under that normalization.

The independently exercised parser rejects nonadjacent anchors, reversed boundary order, and duplicate boundaries with the actual recorded error messages. Shared inline rendering retains the two emphasized conclusions and marks ordinary numeric references 127/273; it produces no image tags. These are TEXT/parser assertions, **not browser-display approval**.

## Evidence and reproducibility

All actual read-input hashes, executed/imported project-script hashes, output hashes, runtime versions, and scope counters are bound in:

`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n129-TEXT-review/manifest.json`

Evidence files in that same owned directory:

- `checks.json`: input identity, source/TOC bindings, counts, unchanged-input verification, and preserved prior TEXT error.
- `parser-check.json`: actual CLI outline, exact full anchors, resolved indices, flag positions, and negative controls.
- `layout-check.json`: existing normalization results, text-validation failures (none), formula/number signatures, and actually imported repository module paths.
- `command-receipts.json`: absolute cwd, executable/arguments, times, exit codes, stdout/stderr, and stdin hashes for the parser and in-memory edition checks.
- `review-local.mjs` and `inspect-layout.py`: the exact local reviewer scripts, also SHA-bound by the manifest. Importing `edition.py` imports its existing assembly-related modules; **no assembly function or assembly command was called**.

Executed from the absolute workspace above:

```text
node .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n129-TEXT-review/review-local.mjs
node .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n129-TEXT-review/review-local.mjs --seal
```

The first invocation runs the checks once. `--seal` only rechecks input bytes and binds this completed report and existing evidence outputs; it does not repeat content review or production stages. Evidence uses referenced original files, not copied PDFs, runtimes, source-review packages, or editable candidate clones. The manifest excludes its own self-hash.

## Recovery and authorization limits

The original receipt remains unchanged at:

`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n129-new-review-rate-limit.json`

Its exact prior TEXT message is: `rate limit exceeded: Your requests to gpt-6.1-sol for gpt-6.1-sol in swedencentral have exceeded token rate limit.` No HTTP status or retry-after value is exposed by that receipt. The direct human staggered-recovery instruction resumed this same review; it did not authorize a content repair, replacement reviewer, credential/model change, or cloud permission. No new rate error occurred in this local review.

Writes are confined to the owned `n129-TEXT-review` directory and this durable report. Content edits, SOURCE replays, author replays, assembly/preparation/finalization calls, image opens, paid probes, network/DB/environment/service probes, Git operations, publication/deployment, handoff, and messages to other chats: **0**. Existing edits and evidence outside reviewer ownership were left untouched.

**Remaining limits:** answers, answer sources, CHOICE, and actual product display have not been approved here. PASS is byte-bound to this frozen TEXT candidate and its read inputs; changed text, tasks, bindings, or parser behavior require affected-only review, not reuse of this verdict for different bytes.
