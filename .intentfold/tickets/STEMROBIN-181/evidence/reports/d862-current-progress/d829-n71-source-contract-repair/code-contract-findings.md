# n71 Source Contract Findings

Scope: offline preparation only for STEMROBIN-181/181-3. No production code,
validator, source, canonical resource, index or meter is changed.

## Text and Source Identity

- `.claude/skills/ld-s10y-lesson/tools/edition.py:430` returns an ordered
  `math_signature` list, not a multiset. At line 828 `validate_text` compares
  that list directly after numbered-subpart normalization. The proposed repair
  preserves order as well as multiplicity; no erratum, notation alias or
  validator exception is introduced.
- Source signatures for affected blocks are: prose 1 `[AC, D, CD]`,
  prose 4 `[O, D, D]`, prose 6 `[AOC, COA]`,
  prose 12 `[A, A_1, A_1, A_1]`.
- `edition.py:457` separates non-formula quantities from numbered references.
  Figure references recognize both Chinese figure labels and English
  `Figure N` / `Figures N`; line 839 requires reference-set equality.
  Prose 4 restores reference 144 in both locales.
- `edition.py:1385` requires the bound source path, SHA-256 and full source JSON
  snapshot, with a narrow additive legacy-source-reference allowance. This
  packet preserves the exact existing source objects, `source_text`, source
  references and raw-source bytes. It does not invoke that allowance.
- `edition.py:1652` preserves prose count/order and identity fields; line 1695
  requires exercise `number`, `source_number`, `group`, `group_id`, `figure_refs`
  and `figures` to equal their authoritative source values. All three groups
  in each locale are restored byte-for-byte, including source Markdown bold
  delimiters. Exercise prose, numbering, pages and figure ownership are untouched.

## Locale Versus Group Display

- `edition.py:743` uses `locale`, not `language`, for the English title exception.
  `same_figure_label` at line 763 accepts `Figure N` for source Chinese labels
  only in locale `en`. The inherited d822 metadata candidates are retained
  exactly and remain separately review-pending; no new metadata translation
  is authored.
- `.claude/skills/ld-s10y-lesson/tools/render_lesson.js:222` selects the locale.
  At line 247 it renders a **nonempty group directly** via `inline(group)`.
  Locale-dependent `Exercises` / the Chinese fallback is used only for an empty
  group. A populated Chinese source group is not mapped to English.
- `.claude/skills/ld-s10y-lesson/tools/publish.mjs:181` carries `e.group` and
  `group_id` directly. `app/src/lib/lessons.ts:176` also passes them through.
  `app/src/routes/_app/card.$id.tsx:232` groups by that value and at line 235
  displays a nonempty heading directly; only an empty heading uses
  `t(locale, 'card.practice')`.
- `app/src/lib/i18n.ts` supplies localized practice/choice labels, but the
  inspected path has no populated-group display translation field or mapper.
  Its established `t` function at line 392 maps stable keys to locale strings;
  `localizeSubject` / `localizeQuestionType` at lines 420/423 map stable Chinese
  labels to English display text without changing their stored identity.
  That display-only pattern is available for separately authorized integration,
  but is not currently wired to exercise group headings.
  `group_id` remains available as a stable identifier; inventing a new
  `localized_group` field here would not be an established working mechanism.
  Restoring the source group fixes identity only. English group-display
  localization remains an explicit separate integration concern, not a reason
  to edit source identity or weaken validation. Nothing was rendered to verify it.

## Figure 144 and Review Boundaries

- `edition.py:1507` checks attached/displayed figure IDs and exercise
  `figure_refs`; `validate_shared_prose_figures` at line 1555 separately checks
  explicitly attached shared figures. Restoring the text reference alone does
  not attach, regenerate, display or approve figure 144.
- d433 explicitly approved its original four text snapshots and recorded
  that reference 144 had been replaced by explanatory text. This proposal
  changes that decision's bound bytes. Four changed prose blocks per locale,
  the six group fields, and inherited d822 English metadata require separate
  affected review. Unchanged text, answer, choice and d814 figure passes retain
  their original hashes and scope; none is replayed or expanded.
- The packet's token/reference and identity inventory is not `adapt-finalize`,
  a native validator result, a semantic review, a render check or first-display
  acceptance. All of those remain unrun.

## Seed Evidence

`.agents/skills/ld-s10y-choice/references/contract.md` distinguishes raw file
SHA-256 from the canonical JSON digest used by drafts/reviews.
`choice-seed-lookup.json` reports both independently. Preparation manifests,
source snapshots and remembered digests are not the missing seed bytes. No
source projection, merged package or regenerated seed substitutes for them.

## Concurrent Shared Metadata

The first offline freeze check observed concurrent byte changes in the shared
index and meter. `first-preparation-check-failure.json` preserves that failure;
the final inventory keeps their baseline/observed hashes separately. All 102
content/code/review bindings remain strict and unchanged, and the four exact
seed index entries and eight absent paths are rechecked without replaying seed
preparation or source/semantic/native stages. No concurrent edits are reverted,
and this packet makes no claim that the shared index/meter stayed byte-identical.
