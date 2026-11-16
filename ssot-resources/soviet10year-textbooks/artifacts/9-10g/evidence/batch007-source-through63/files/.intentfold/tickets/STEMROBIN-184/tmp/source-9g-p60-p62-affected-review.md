# STEMROBIN-184 / 9-10g physical60-62 / affected-only review

## Limited verdict

PASS - the frozen R1-R3 repair fields and their Markdown/JSON synchronization only.

The current60-62 artifacts close R1, R2 and both parts of R3 from the unchanged complete StageB:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p60-p62-independent-review-after-disclosure.md`

SHA256: `a11557d938fcec548ca638a1d9f4443ab1046686f0c26d3ec69c7cdbc10bef94`

Unchanged source observations, crop-retention findings, object ownership and optical UNKNOWN entries are reused from that review. This is its affected-only follow-up, not a new full gate, new source reading or source-word adjudication. Physical63 and completeness/publication of §17 remain outside approval.

## Evidence bindings

Parent repair evidence:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p60-p62-targeted-repair-evidence/`

| Evidence | Observed SHA256 |
| --- | --- |
| before.json | `f2fadd11220780b7ac197f99caf9cbd9227b622aaef08c309e6d826e44478801` |
| after.json | `3b93dc2f74f99c4955222a4b192e5e575bd2938b4b0fe0a937138fc21c6e435a` |

The nine raw before-snapshot digests match the previously reviewed candidate hashes. The nine raw after-snapshot digests match after.json and the current durable60-62 file digests. The six MD/JSON before-to-after diffs show only R1-R3 and the two directly related semantic-role notes; no other changed block field appears. Audits are byte-identical before/after.

No prepared page, crop, layout, template, book, modern draft or63 content was visually or semantically reread. Protected files were checked only by raw digest against the identical before.json/after.json protection lists.

## Affected comparisons

### R1 / PASS: existing headings now carry semantic unit-start roles

Physical60:

- The existing `§16. 空间的方向` heading changes from `<!-- h2 -->` to `<!-- h3 -->`.
- JSON `blocks[3].kind` changes from `h2` to `h3`.
- Its related note now states that the existing printed title is recorded as a semantic unit start, without inventing another printed heading.

Physical62:

- The existing `§17. 向量` heading changes from `<!-- h2 -->` to `<!-- h3 -->`.
- JSON `blocks[11].kind` changes from `h2` to `h3`.
- Its related note makes the same semantic-role distinction and continues to state that the introductory paragraph is open at 一.

Title text, positions, block sequence and all neighboring blocks remain unchanged. No duplicate title, new chapter, prose-item unit or completed §17 is introduced. This closes the specific routing deficiency recorded in R1; it is not an observed assembly result, since assembly was not run.

### R2 / PASS: frozen167 literal restored

Physical62 MD and JSON `blocks[10].lines[1]` now contain:

```text
$CD$的相关位置如何？
```

The diff changes only `相互` to the previously frozen `相关`. Given ray expressions, signs, compared objects, question punctuation and the following section boundary do not change. This accepts the targeted restoration against the existing freeze, without re-adjudicating the source glyph.

### R3a / PASS: missing clause comma restored

Physical60 MD and JSON `blocks[5].lines[3]` change the fragment:

```text
（图62，а）那么
```

to:

```text
（图62，а），那么
```

Only the previously missing comma is restored. The paragraph still ends open at 射, preserving its continuation into61.

### R3b / PASS: original clause linkage restored

Physical61 MD and JSON `blocks[1].lines[1]` change:

```text
（图63，а）. 如果
```

to:

```text
（图63，а），如果
```

The comma linkage is restored without altering the same/opposite-direction conditions or the paragraph boundary. The diff does not insert or remove source-text rows.

## Preserved scope

The affected diffs leave every continuation/open/samerow flag, exercise label, figure identifier/box, caption role, source/render/profile binding and unrelated text unchanged. Thus the existing reviewed161-163 prior-§15 ownership,164-167 §16 ownership, and outgoing open §17 paragraph are retained.

The complete StageB's optical UNKNOWN entries remain in force; no point-dot intention, stray mark, glyph encoding, circle-marker classification or damaged-contour interpretation is newly resolved. Literal C₁D,1°), the raised-circle positions, ray signs and source wording outside R2-R3 are unchanged.

The before/after protection lists are structurally equal, and every listed current protected file's raw digest matches them. This includes the unchanged accepted StageA, original author report/manifest, complete StageB, all four actual crops, prepared60-62 page pixels/grids/layouts/templates,59/63 MD/JSON/audits, book.json and the protected t14 modern DRAFT files. Hashing these bytes is not candidate reading, image inspection or approval of their contents.

No source, history, evidence snapshot, author report, gate, book, answer or other worker's file was edited by this reviewer.

## Current repaired bindings

Paths below are under:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/`

| File | Verified after/current SHA256 |
| --- | --- |
| 0060/page.md | `5bc48a7a830b4612eb06e652ff733e8d35e5e7fbfb058a0dc87eccbaf89c6b7e` |
| 0060/page.json | `b9fd3323828501ec47bcf35aacd047e2a5d6a93797d4e725164db7f65805c31d` |
| 0060/audit.json, unchanged | `59d21d8168df8b4dbd32c24c67a791864f5ed7b331fcb8138aff1f4260272350` |
| 0061/page.md | `e9275d6ccb9dfa2d0c6ee6fdba1c9b2736b1c2c70b66dd1d408057db36d9e9d5` |
| 0061/page.json | `6ae616e123cc72bae533e66db0ff7ea12c2b990da6daafc26c21ab588a998383` |
| 0061/audit.json, unchanged | `baa5c69b3aff92946ee3a16c9cded9a69e1284504087419263fda32bc1909b56` |
| 0062/page.md | `87eb7964c80b9d689042e905275fabb3e4050bd4e1f9cc2d3ff9a3de5e87e91f` |
| 0062/page.json | `4a94932cde6d111d489fb3b4120a0ae4daf9bbb2b0d52ece21e41cf07866777e` |
| 0062/audit.json, unchanged | `1619a15dff593b4727e2d027610114228f5672df062f0d3acb59e42c67afc87a` |

## Parent command evidence

Only existing parent command/stdout/stderr records were read and hashed. No repair helper or source command was executed by this reviewer.

| Parent record | Command JSON SHA256 | Existing recorded result |
| --- | --- | --- |
| 0060.command.json | `29201796cc4180a9655cf40c9d254e96c79f911a9eb719b8dff3af23b1c29eee` | finalize60, exit0, reported20/20, normalizations0 |
| 0061.command.json | `ead496dad8af4ad086f00c6f47ed2c0c07221f2863e8b633b3d55b655c5447ca` | finalize61, exit0, reported18/18, normalizations0 |
| 0062.command.json | `b94e54e5b12303e9ddfb64cdda080f24281ff8564f7e3890c87d78ab5929676d` | finalize62, exit0, reported24/24, normalizations0 |

These records have one targeted finalize entry per affected page, null signal/error and empty stderr. Recorded stdout digests are respectively `bad48e00f7af29abb4951521313e6e20b3b8a8dba690c54d60193548a9b24b0a`, `221e4c072abd20ef866d0807dbace5db05c4490933d0e44b87d1b39e782a1fbd`, and `e0d7ac73dff365be877d42b1b2e5e8c4d98988e7bc78d1b3698fc692b28a1fdd`. Each empty stderr has SHA256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

Those figures are historical output observations, not independently recomputed line counts. The affected verdict rests on the targeted diffs and sync, not on treating the reported counts as new source evidence.

## Visual budget and stop

New image loads0. Original reopens0. Crop reopens0. Existing hard batch remains8/8 and image context8/24. Prior crop findings are reused by unchanged byte binding; no ninth image is loaded.

Only this new scratch review file is written. R1-R3 are closed in the bound current60-62 fields. No full gate, source-word re-adjudication, optical-UNKNOWN clearance, physical63 approval, complete-§17 approval or publication is performed or authorized.
