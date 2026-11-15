# STEMROBIN-180: Footnote Encoding And Caption Continuation Diagnosis

2026-11-15. Diagnosis only; no implementation or test execution.

## Conclusions

- **135 is an author-encoding problem, not evidence that a new block kind is needed.** The contract defines `foot` as the disposable page number. Approved 120 already preserves an instructional footnote as an ordinary `p`, logically immediately after its referenced definition, with the physical placement documented.
- **Caption continuation is a confirmed tooling defect.** `merge_across_pages` unconditionally appends every `cap` before examining `cont`. Consequently the explicit, adjacent `cap open` / `cap cont` pairs at `p0119#13/#14` and `p0123#7/#8` remain separate and leave a false open tail.
- The smallest change for the merging defect is a caption-specific continuation path inside the existing merger, not a new source kind, content classifier, page-specific rule, source rewrite or renderer change. Approved source pages must retain their bytes.
- **A separate loss occurs at exercise-figure ownership.** Current assembled c4-s1 / c4-s3 omit the full fig99 / fig102 instructional captions from both prose and exercise figure records. Merger repair alone does not fix that loss. Subsequent implementation authorization covers only the merger and focused tests; caption propagation remains diagnosis only.

This report is based on current production code, page MD/JSON/audit reads, and the existing approved review. It is **not** a new pixel review, source approval, repair PASS, assembly approval or downstream completeness claim. No answer artifacts, old choices or test bodies were consulted.

## Binding Requirements

[Engineering charter](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/charter/engineering.md) and the [lesson skill](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/SKILL.md:193) govern the diagnosis:

- One source block line represents one printed line. `foot` means page number; `cap` is searchable printed caption text.
- `open` / `cont` explicitly identify continuation of an object, including interruption by figures. Assembly concatenates; it does not infer meaning or rewrite words.
- `fig` / `cap` / `foot` remain transparent when pairing interrupted prose or exercises.
- Multi-line `cap samerow` means every line is shared with an adjacent printed row. This differs from a one-line same-row fragment followed by ordinary caption rows.
- Source provenance, figure/task identity, complete text and declared modern transformations must remain bound. Modern layout uses final `proseFlow` paragraph anchors, not source block counts.

See [cap2 rules](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/SKILL.md:265) and [edition contract](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/references/edition-text-contract.md). Behavioral test expectations below come from these requirements and approved source facts, not old tests or a proposed implementation's output.

## 135: Use The Established Encoding

[135 MD](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0135/page.md:62) contains:

- `p0135#3`: the definition paragraph, including `**流体静力学佯谬**①`.
- `p0135#4`: `p open`, ending `但它们的底面`.
- `p0135#7`: `foot`, containing the complete instructional definition `① “佯谬”一词用来称谓那种出人预料的、与通常观念不符的现象.`
- `p0135#8`: the actual page-number `foot`, `· 124 ·`.

[blocks.py:14](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/blocks.py:14) explicitly defines `foot` as page number. [cut_lessons:103](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/assemble.py:103) dropping that kind is consistent with the contract. A note admitting instructional text was encoded as `foot` does not change the kind's meaning.

The [approved 116-120 review, footnote paragraph](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-review-116-120.md:57) explicitly approves:

- Both original circled-1 markers encoded as `$\text{\textcircled{1}}$`.
- The complete one-row instructional footnote preserved as `p`, immediately after its referenced definition.
- Physical location below the figure and above the page number documented, without claiming that logical ordering was the physical layout.
- The subsequent unfinished prose remaining uninterrupted and `open`.

Current [120 MD:90](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0120/page.md:90) and its notes implement this pattern. It works through existing prose, edition and render contracts; no equivalent special footnote API is needed for this case.

**Recommendation for a separately authorized 135 author repair:** use the same explicit `p` representation directly after the referenced definition and before the unfinished paragraph, retain all wording and both equivalent circled markers, and document the physical relocation. Keep only the printed page number as `foot`. Merely changing the physically late footnote to `p` after the unfinished paragraph would interrupt the current prose continuation candidate; location therefore matters. This approved authoring precedent is not permission to reorder approved captions to evade a merger defect.

The [current 135 audit](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0135/audit.json) also reports two occurrences of whitelist-excluded `①(U+2460)`, in `p#3` and `foot#7`, with zero normalizations. Existing equivalent LaTeX encoding addresses the marker representation without a whitelist waiver. Its recorded 18/18 count is not source PASS. This diagnosis neither repairs nor releases 135; its existing first failure remains untouched.

## Confirmed Caption Defect

At [merge_across_pages:56](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/assemble.py:56), `TRANSPARENT = ("foot", "fig", "cap")`. Lines 60-62 append a transparent block and `continue`; the continuation checks at lines 63-74 are therefore unreachable for captions. This is established by static control flow, not by running assembly.

The page producers correctly express the distinction between one shared row and the ordinary remaining rows:

| Source pair | Head | Continuation | Expected assembled object |
| --- | --- | --- | --- |
| [119 MD:100](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0119/page.md:100), `p0119#13/#14` | `cap 图 99 open samerow`, one line | `cap 图 99 cont`, one line | One `cap`, label `图 99`, two exact lines, `open=false`, spans `["p0119#13","p0119#14"]` |
| [123 MD:81](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0123/page.md:81), `p0123#7/#8` | `cap 图 102 open samerow`, one line | `cap 图 102 cont`, three lines | One `cap`, label `图 102`, four exact lines, `open=false`, spans `["p0123#7","p0123#8"]` |

MD and JSON agree on the labels, flags and line arrays. Each page records 20 printed lines. Both pairs are adjacent **on the same physical page**; the function's name must not become an artificial next-page-only restriction.

Literal expected joined text, retaining the existing source spelling, full-width space and punctuation:

```text
图 99　瓶子的制做：1—管子；2—玻璃；3—模子，
图 102　液压千斤顶构造示意图：1—被举升的物体；2—小活塞；3—阀门；4—下放重物用的阀门；5—大活塞.
```

The current defect fragments the caption object and leaves its head `open`; it does not by itself demonstrate that the fragment characters are absent from the stream. [Assembly audit:561](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/assemble.py:561) reports the remaining open flags from the merged stream. Closing these complete caption objects must not blanket-close genuine unfinished prose or exercises, including 123's final `ex 2 open`.

## Minimal Proposed Merger Change

No code change is made here. Proposed bounded behavior:

1. Handle `cap cont` **before** the transparent fast path. Keep the existing prose/exercise predecessor search excluding `foot`, `fig` and `cap`; do not use the prose predecessor as the caption predecessor.
2. Maintain a separate nearest-caption candidate in source-stream order. A new caption replaces that candidate; never search past an incompatible or closed caption for an older matching one. `foot` and `fig` can pass through without becoming prose or caption heads. Headings, `exhead`, prose and exercise input blocks end the caption candidate domain, including when a prose/exercise continuation is merged rather than appended. This covers the actual adjacent fixtures, a caption interrupted by a figure, and a cross-page caption separated by a page-number footer without introducing distant content matching.
3. Join only an explicitly `open` candidate with an explicit `cont` of the same exact `label` and equal `owner_lesson` / `owner_exercise` values, treating absent optional ownership as `None`. Do not regex-normalize the label, infer a figure number from text, or infer missing ownership. Equally absent labels do not require inventing one.
4. Concatenate raw `lines` in order with no added or removed characters. Retain the head's label, reference, first page/printed page and explicit ownership. Accumulate ordered `spans` for every participating source fragment; use existing spans if supplied rather than discarding their provenance. Set `open` from the last continuation so a `cont open` chain can continue and a final `cont` closes it.
5. Keep the object at the head's output position. Remove only the successfully consumed continuation fragment from the object stream; keep all intervening figure/footer objects and all unrelated objects in their relative order. Approved page blocks themselves stay unchanged.
6. Orphan, closed-head, mismatched-label/owner or boundary-crossing `cap cont` must remain in the stream with an explicit merge warning, not be silently discarded or attached elsewhere. Retain unresolved `open` for the existing incomplete-tail warning; the skill expressly allows a genuinely incomplete extraction tail.
7. Own the output line/span lists. Current `dict(b)` is shallow, and the existing `prev["lines"] += ...` can mutate the loaded input list in memory; it does not prove a disk write. Do not extend that aliasing into captions. Local list copies at the merger boundary can protect both paths without changing prose/exercise matching behavior, normalization or any source file.

This is a local two-predecessor distinction, not a new annotation framework. It intentionally does not define arbitrary caption continuation across intervening prose/exercise objects. Such a layout would need an explicit faithful-content case before widening the pairing domain.

### Printed-Line Boundary

[printed_lines:116](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/blocks.py:116) subtracts **all** lines of a `cap samerow`. Thus combining 123's fragments while carrying the first fragment's `samerow=true` does not mean all four resulting lines shared printed rows.

The actual page-count producer, [p2c.py:349](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/p2c.py:349), counts raw page blocks before assembly. Preserve that separation: raw MD/JSON, per-fragment flags, audits and 20-line totals stay authoritative. Do not run page counting on the merged object stream, clear the source flags, combine the source blocks, or change the counter to make the assembled object look like a page. `source_refs` retain access to the original fragment layout.

## Producer And Consumer Contracts

| Producer / Consumer | Required impact |
| --- | --- |
| [blocks.py parser/dumper](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/blocks.py:49), [page producer](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/p2c.py:341), lesson cap1 rules | Existing `page@3` kinds, labels, ownership and flags already express the source. No source/schema/profile change needed for the caption fix. The footnote correction belongs to separately authorized author encoding. |
| [assemble load/merge/cut/split](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/assemble.py:39) | Only the merger needs the new caption path. `foot` still disappears in cutting; instructional `p` stays. Prose/exercise joining, numbering, grouping and ordering stay unchanged. |
| [figure ownership](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/assemble.py:271) | Combined captions remain `cap` with the original label/owner. Exercise-only captions are removed from prose, but only figure ID/label currently reach the owning exercise. The separate propagation diagnosis below identifies this real omission; the authorized merger patch will not add caption fields. |
| [lesson serialization](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/assemble.py:747), [snapshot reuse](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/assemble.py:185) | Retained caption text becomes one MD/JSON object with complete ordered `source_refs`. A changed caption count/text is not merely additive optional provenance and must not reuse the old lesson bytes as equivalent. Caption-only merging must not change exercise identities, text or figure allocation. |
| [edition source reconstruction](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/edition.py:116), [source validation](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/edition.py:1284), [prose identity validation](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/edition.py:1499) | Reconstruction calls the same merger. After authorized rebuilding of affected raw lessons, modern snapshots/hashes and changed caption identities/counts must be rebound and independently reviewed; existing `source_text`, kinds, labels and provenance remain strict. No modern-only concatenation workaround. |
| [htmlfrag proseFlow](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js:60) | Non-`p` objects pass through without incrementing paragraph indices. Caption-only merging must leave final prose paragraphs and `section_breaks` anchors unchanged. An instructional footnote encoded as `p` is genuine paragraph content, not a caption. |
| [offline renderer](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/render_lesson.js:242), [publisher projection](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/publish.mjs:168) | Both already accept `cap` and render/project its full text. A retained merged caption should appear once, including every marker and clause. No renderer or publisher implementation change proposed, and neither command was run. |
| [app ProseBlock type](/Users/yong/.codex/worktrees/0f12/lemmadeck/app/src/lib/lessons.ts:10), [caption/group display](/Users/yong/.codex/worktrees/0f12/lemmadeck/app/src/routes/_app/card.$id.tsx:113) | The existing `p/cap/fig` contract is sufficient. Compact figure grouping consumes caption objects positionally; splitting one caption into several objects can affect grouping. This is a downstream consequence, not an independently observed live-app failure. No app change requested. |
| [image context projection](/Users/yong/.codex/worktrees/0f12/lemmadeck/.agents/skills/ld-s10y-image/scripts/build_context.py:49) | Nearby context includes `p/cap`; retained captions now provide the complete joined text. A changed frozen text snapshot/context hash needs explicit rebinding, not artwork regeneration merely for a hash change. No figure outputs were read or changed here. |
| [choice concept projection](/Users/yong/.codex/worktrees/0f12/lemmadeck/.agents/skills/ld-s10y-choice/scripts/prepare.py:105) | Concepts are explicitly selected `p` blocks. The approved footnote representation remains available; a new footnote kind would unnecessarily add omission/type work. Caption-count changes may shift later block indices, so future selections must inspect the current finalized lesson rather than reuse an old index. No choice artifacts were read. |
| [exercise identity reconstruction helper](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-answer/tools/lesson_answers.py:114) | Calls the same merge/cut/split/claim pipeline; exercise identities and original source spans must remain identical for a caption-only repair. Only this production helper was read, not any answers. |

Important current limitation: [source_errata:203](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/edition.py:203) returns early when no page has registered errata. It is not an unconditional page-to-lesson reconstruction proof. Changing the merger alone must not be described as automatically refreshing or invalidating every existing edition. Once affected raw lesson files actually change, the ordinary snapshot/hash checks reject stale bound editions; authorized regeneration/review is a separate step.

Existing broad content-presence checks do not establish full caption or definition retention. The required proof is exact expected content/provenance, not a green nonempty-content result.

## Separate Exercise-Caption Loss: Diagnosed, Not Authorized For Repair

### Existing Affected Inventory

A read-only structured inventory joined explicit caption labels from current durable page JSON to all current assembled raw exercise figure records, then checked the corresponding raw prose. No assembly, generation, content classifier or new source approval was performed. It found exactly **two affected labelled instructional caption objects** in this inventory:

| Current raw owner | Actual record / prose | Missing source information |
| --- | --- | --- |
| [c4-s1 exercises](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c4-s1/exercises.json), exercise `g2-3`, source question 3, `练习 20` | `figures=[{"id":"fig-99","label":"图 99"}]`; no corresponding caption in [lesson prose](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c4-s1/lesson.json) | Full bottle-manufacture caption, including `1—管子；2—玻璃；3—模子，`, from `p0119#13/#14` |
| [c4-s3 exercises](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c4-s3/exercises.json), exercise `2`, `练习 22` | `figures=[{"id":"fig-102","label":"图 102"}]`; no corresponding caption in [lesson prose](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c4-s3/lesson.json) | Full hydraulic-jack caption, including `1—被举升的物体；2—小活塞；3—阀门；4—下放重物用的阀门；5—大活塞.`, from `p0123#7/#8` |

These are **two source figures, two owning exercises, two lessons, four source caption fragments, six printed caption rows and eight numbered callout definitions**. The source pages are already approved; their exact wording is retained in raw pages but omitted in the inspected assembled delivery objects. This is not a claim about unlabelled captions, future/unassembled units, source pixel quality, modern artwork, or a live DB/app inventory. Current `book.json` reports 119 extracted pages and 56 assembled items; its audit still includes the two caption open tails plus the independently unresolved `p0107#7`.

### Producer And Downstream Failure

[claim_figures:341](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/assemble.py:341) and [claim_figures:367](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/assemble.py:367) attach only `{id,label}` to the figure's owning exercise. [The prose filter:369](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/assemble.py:369) then removes exercise-only `cap` objects. No transfer of their instructional text or caption source refs occurs first.

- [modern_exercises:307](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/edition.py:307) deep-copies the exercise record, so it cannot recover absent caption text. [Validation:1551](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/edition.py:1551) treats the full nested `figures` list as source identity, while text validation covers the question's `text`, not an independent caption field.
- [Offline exercise rendering:265](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/render_lesson.js:265) passes only figure ID/label to its media helper. [That helper:131](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/render_lesson.js:131) uses label for `aria-label` / image `alt`; it does not display a caption.
- [Publisher exercise projection:185](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/publish.mjs:185) emits ID/label/assets only. [CardFigure and its delivery mapping](/Users/yong/.codex/worktrees/0f12/lemmadeck/app/src/lib/lessons.ts:24) have no caption property. [Exercise display:245](/Users/yong/.codex/worktrees/0f12/lemmadeck/app/src/routes/_app/card.$id.tsx:245) renders media and an accessible label, with no visible `figcaption`.
- [Image exercise context](/Users/yong/.codex/worktrees/0f12/lemmadeck/.agents/skills/ld-s10y-image/scripts/build_context.py:81) projects question text only. [Choice exercise projection](/Users/yong/.codex/worktrees/0f12/lemmadeck/.agents/skills/ld-s10y-choice/scripts/prepare.py:93) projects question text and figure IDs only. Neither currently preserves independent caption definitions; future consumers must not claim those definitions are seed/context data unless actually projected.

**Existing-label-display-string route: not valid end to end under current contracts.** Enlarging an exercise figure's `label` could transit through raw-to-edition copies if raw source identity also changed, but it would still reach only accessibility labels in the inspected offline/app renderers. It neither makes the definitions visibly readable nor preserves the current printed-label field unchanged. Do not put caption prose into `id`, overwrite the printed label, append it to the question text, or call alt/ARIA-only retention adequate instructional display.

### Smallest Faithful Propagation Proposal, Awaiting Main Instruction

After the independent merger repair, bind the complete caption to its unique actual figure using exact source label and compatible explicit ownership, then transfer it to that figure's **existing display-owning exercise before removing it from prose**. Do not guess a new caption owner from distance/content or duplicate it on every referencing exercise. Keep stable figure ID, printed label, exercise text/number/group/source spans and all source bytes unchanged.

If main authorizes an additive delivery contract, a separate optional caption value containing exact text and caption `source_refs` is smaller and more faithful than repurposing an identity/accessible-label field. Existing edition deep-copy and nested identity equality can retain an unchanged source caption; explicit source-target mapping and caption text/KaTeX validation still need to cover the new surface. A visible offline caption and publisher/app projection must also consume it, with missing optional data preserving old behavior. This is a proposal, **not authorization to add fields or edit schema/app/renderers now**.

Prepare any future candidates in an isolated root and materialize only the explicitly authorized c4-s1 / c4-s3 outputs after review. Do not run the current durable whole-book assembler, which rewrites the lesson directory; do not bulk-backfill approved old lessons, weaken snapshot equality to hide omitted caption content, regenerate artwork merely for provenance, or silently approve stale modern snapshots. Additional affected units require explicit scope rather than migration by default.

The eventual single focused propagation proof should assert both complete literal captions and all eight definitions retained once at their existing owners, exact provenance, unchanged question/figure identities and sharing, visible offline/published consumer output, and failure on ambiguous binding or stale snapshots. No such test or propagation implementation was run here.

## Focused Behavioral Tests Proposed, Not Run

1. **119 literal fixture:** from the two current approved fragment arrays, produce one caption with exactly two lines, label `图 99`, ordered two-source spans and `open=false`. Expected text is the literal above, including `制做`, full-width space and final comma. Source bytes/arrays/flags remain unchanged; raw count remains 20.
2. **123 literal fixture:** likewise produce one four-line caption with both source refs and final `open=false`. Preserve `小活` + `塞` across the exact original line break and all five numbered objects. Raw count remains 20; final exercise remains genuinely `open`.
3. **Independent transparent pairing:** both `p open` and numbered `ex open` can continue through `fig`, a `cap open` / `cap cont` pair, and `foot`. Assert exact prose/exercise text, original spans/number/owner, unchanged figure order and an independently closed caption. No caption is appended into body/exercise text.
4. **Caption chain/page boundary:** adjacent `cap open` -> `cap cont open` -> final `cap cont` retains all lines/spans and closes only on the last fragment; a page-number footer and an intervening figure do not themselves become a caption head. Same-page and cross-page explicit continuations obey the same object rule.
5. **Negative identity/boundaries:** no head, closed head, different exact label, conflicting explicit owners, an intervening different caption, or a heading/column/prose/exercise boundary cannot cause attachment to an older caption. Preserve fragments and warnings. A truly unfinished final caption remains an open-tail warning, not fabricated completeness.
6. **Input ownership/repeatability:** compare the input stream against an independent deep copy before/after merging, including the transparent body/exercise fixture; repeat the operation on unchanged input without accumulated text/spans. No page dictionary/list may be mutated. This also guards the existing shallow-copy hazard during a local merger change.
7. **Serialization/binding:** retained merged captions serialize once with complete text and both source refs. Changed content/count cannot pass optional-provenance snapshot reuse. After changing a fixture raw lesson, an old edition snapshot/hash is rejected; a correctly rebound source identity is accepted. Exercise count/group IDs/spans and figure ownership stay unchanged.
8. **Offline text projection:** the retained four-line caption produces one complete caption HTML fragment, all numbered clauses occur once, and surrounding `proseFlow` paragraphs/anchors are unchanged. Use pure fragment/projection tests; no DB, publishing or app/browser execution is needed for this focused tooling proof.
9. **Established footnote representation:** an approved-120-style definition -> instructional `p` -> unfinished `p open` -> figure/caption/footer -> next-page `p cont` retains the definition and footnote once, drops only the page number, and joins only the unfinished paragraph. Carry both equivalent circled markers through raw/edition/HTML checks without widening the character profile.

Suitable test homes are the lesson skill's existing blocks/assembly snapshot/edition/HTML-fragment/render test areas, or one focused caption-continuation test module alongside them. No old test assertions were used to define these expectations; no test file or fixture was created in this diagnosis.

## Hash-Bound Read Snapshot

SHA256 values are read evidence, not evidence of an executed repair. Tool/contract links above identify the full files; page JSON/audit hashes bind the durable companions of each linked MD.

| Input | SHA256 |
| --- | --- |
| Lesson `SKILL.md` | `b3666f4ea4a094c269a2d628a455cbb00598e770d93903fd810597e6f8a9b405` |
| Edition text contract | `8deecbc68434e57b30ed8717dc22170a1988a0856af200a1875da58a3334bf90` |
| Engineering charter | `d4b38ea7ed61f21c70da56d600500f113f9eab8987b9267be6baf905c924977c` |
| `blocks.py` | `b21f0af41a8f623cfb11e29014e6d7174aafb206a0fc1463678c3496fc8f9d82` |
| `assemble.py` | `eecd6b9e314200805f3672681c897556e459cff273012b0f9da4674f9dcddb8f` |
| `p2c.py` | `483ebed7d79146af36e547a3d8c88ac4fdca06944fb46c759f83e2cb14a6b06b` |
| `edition.py` | `b48f7beedb54635876f426526d8541925c956c0f84e298f77c3fe34c229f4b2c` |
| `htmlfrag.js` | `c2f0301c5ba7811336a5268a404f795ace7873b75eb93c42c10186f3d9c3f9f6` |
| `render_lesson.js` | `c9336bd4326bfed223a107d8386bac8613560558edc058438f57dc72a583f4f1` |
| `publish.mjs` | `c5f16f67eea168143f79647b5b4acce169aafaf203e8a1ecad32ed95f7f373e4` |
| 0119 `page.md` | `09fe866f221a3fdffc26cc76256e1d81945c97b126b279502a1f17aed2fce633` |
| 0119 `page.json` | `819ac3f71f4e67079406e6fa5f86553a220c9efdb09b57e857041d95c64270d5` |
| 0119 `audit.json` | `7ecb5699ae79d1b0f1d3a6a59716e9cd708fc78f902a5ebb0c09765582819480` |
| 0120 `page.md` | `cf216da184b8948d205afd1c21306298afbb8eef49635db42d0b88f9e2cc4d5c` |
| 0120 `page.json` | `ee72d34da3056326939bfbf2f36e4d575a5d3aa16156ae9ea196e2323133a8c5` |
| 0120 `audit.json` | `c247012baee44d44906347e0a962216dccd870dcae994cc129a8828214c03661` |
| 0123 `page.md` | `318b51ce77b5498cd88e9de60a4946c9888043c94cee2dad27411146952c508b` |
| 0123 `page.json` | `8c0d3fd42c5d2df8b43f7762c50391dd28ac1427f146ee2b0458b03c324382b3` |
| 0123 `audit.json` | `123b56e03bb125f075496b70ac900364a163a4a8439199db7f005973d629c09b` |
| 0135 `page.md` | `91029e2b050584db51c9da56829a2e64cf32dcd19f05351fba5849c78b585e5c` |
| 0135 `page.json` | `8db1064f9079f5b321d1b1c96e735036239143762e3a23e0a80e4122a187eb46` |
| 0135 `audit.json` | `9f917a4d249bd723089a6f79f57efc54b78b69deca0bf5328bb63575e7b7515e` |
| Approved `source-review-116-120.md` | `f66c4d82ed35b189e1e0af88280b9b37334e61498dd9967f8821205f8f1ec877` |
| c4-s1 raw `lesson.json` | `9e89ce7a39972080c10f58fa59cc1c80f853cf225dd7eba3818eb8f835403429` |
| c4-s1 raw `exercises.json` | `62c50a2f80934db605c6e639c8daa6dc24c2e5749c385da8f1d2cce783af799b` |
| c4-s3 raw `lesson.json` | `aeaab52bfcad1d3d6ada3009d05f4cd3316d568f753a6fe56cd0e0b4d3d81470` |
| c4-s3 raw `exercises.json` | `f4abe2e93026154a74c48412a1eab9e1a3b3d5bbca34c8301e7a5b74d38404f1` |
| App `lessons.ts` | `832c38ed4c0644a12ef4c66e2e6eb570ce6a11772e336e6ebafe505cf4c7d7e9` |
| App card route | `030715c0abd74534193b960deda4741bdf4dd8f8c1adbdaab4b1ebb985642310` |
| Image context projector | `01ed06f2b69baa254bcdeb3477208725c1f4df0802da13c90a804276a66336cd` |
| Choice seed preparer | `48002b2cd2d50e002c62ac25c70d8b9183f300198b70769c425d8238fa00abd5` |

## Diagnosis Boundary

Only this diagnosis report was written during the diagnosis, with `apply_patch`; the inventory used read-only JSON inspection. No source/tool/schema/renderer/app/charter/dependency/figure/lesson/index change or execution was used as diagnosis evidence. No first-failure overwrite, finalize, assemble, DB, network, browser, Git or external model service. Shared-workspace edits were not reverted. Subsequent authorization permits only caption-merger implementation and focused tests, to be recorded separately; exercise-caption propagation remains unresolved and unimplemented.
