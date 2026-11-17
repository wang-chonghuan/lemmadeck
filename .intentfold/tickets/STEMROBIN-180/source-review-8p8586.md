# STEMROBIN-180/C: Offline SOURCE FIRST, Physical 8p 85/86

**Decision: SOURCEBLOCKED on both pages.** Sole fresh independent FIRST is
complete; no SOURCE PASS, repair, replacement review, promotion or full-course
approval. Page 85 has two independently confirmed punctuation roots plus four
reviewer-confidence HOLDs. Page 86 has no independently confirmed candidate,
crop or author-inventory defect, but two reviewer-confidence HOLDs remain.

## Independence And Frozen Evidence

Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Only newly owned `tmp/source-first-8p8586/` and this report were written.
No existing report, author artifact, candidate or shared metadata was modified.

Read order was:

1. Required lesson skill and image-batch rules, with local project guidance.
2. Each specified original page once, then five original-only details.
3. Complete independent printed-row, math, typography, identity, group,
   boundary, footer, figure-object/label/relation and caption enumeration.
4. Inventory SHA256 freeze, before candidate or clean-input details.
5. Authorized clean-review-input/current metadata, then candidate MD/JSON/audits.
6. Actual final Figure 52 PNG once.
7. Candidate comparison recorded, then both author inventories read last.

Frozen inventory:
`tmp/source-first-8p8586/independent-source-inventory.md`.
SHA256: `16044e978602e7c87e7be5ce390a6ae5d0ff28f0ae362fabcc75331b8473d502`.
Freeze observation: `2026-11-17T00:07:41Z`, recorded in
`tmp/source-first-8p8586/source-freeze.json`. Frozen file was not amended after
candidate reading.

Two authorized original SHA256 measurements at the freeze:

- Physical 85, printed 73:
  `d55b415cc57b43a566ae525cbf51961c010ae9b1e63ff9fc56ad1762aa7d7020`.
- Physical 86, printed 74:
  `39436da34af3f15b858b8233da879b2c40b74bcc2ac449427220589e03f203fc`.

The 17 clean input leaves already had 43 Main bindings; their supplied
bytes/SHA256 metadata was reused. No candidate or author input tree rehash was
performed. These metadata bindings do not themselves prove source fidelity.
No grids, prior review reports, neighboring source images or neighboring
prose/formula payloads were opened.

## Confirmed Defects

| Root | Source Evidence | Candidate Defect | Author-Inventory Defect |
| --- | --- | --- | --- |
| R85-09 | 85-r09: `速度，式中` | `p0085#3`, third body row: `速度. 式中` in both page.md and page.json | `rows[8].reading` repeats the period substitution |
| R85-21 | 85-r21: `投影的符号，以及初始` | `p0085#7`, first body row: `投影的符号以及初始` in both page.md and page.json | `rows[20].reading` repeats the missing comma |

Both original glyphs were inventoried before seeing candidate text. These are
two distinct source punctuation roots. Each repeats in candidate MD, candidate
JSON and author inventory: six artifact occurrences, not six roots.

Category counts: candidate defects 2; author-inventory defects 2; crop defects 0.
All confirmed defects are on page 85. Combined deduplicated root count is 2.
No independent Chinese word insertion/deletion, math substitution, missing row,
wrong printed identity or local bold-heading defect was established.

## Reviewer-Confidence HOLDs

| ID | Page | Independent Confidence Limit | Disposition |
| --- | --- | --- | --- |
| H-S85-QUOTE-PUNCT | 85 | Tiny mark after “线索”: frozen transcription selected a comma, candidate/author select a period; insufficient dot/tail confidence | HOLD, not a third confirmed defect |
| H-S85-PUNCT | 85 | Dot/hooked terminal mark after 即加速度: colon versus semicolon not independently resolved | HOLD, candidate semicolon not declared wrong |
| H-S85-FOOT | 85 | Sloped dark footer 73: intentional italic/bold versus native face/scan not established | HOLD, no fabricated missing-style defect |
| H-S85-QUOTE-WEIGHT | 85 | Uniform Kai-like summary face does not establish a selected bold span in the opening quotation | HOLD, no automatic emphasis rejection |
| H-S86-MARK | 86 | Visible short oblique ink near the lower curve position: exact arrowhead/semantic identity not established | HOLD even though crop retains the ink |
| H-S86-FOOT | 86 | Sloped dark footer 74: intentional italic/bold versus native face/scan not established | HOLD, no fabricated missing-style defect |

The frozen first-row comma selection is explicitly downgraded in the
post-freeze comparison; its file/hash remains unchanged. The two clear defects
do not depend on that uncertain first-row glyph.

Six independent confidence records: 85 has four; 86 has two. They are not six
confirmed errors, and are not an automatic adoption of the author's 2/5
unknown counts. Boundary/catalog scope exclusions below are not added to this
local HOLD count.

Author HOLD comparison, performed last:

- 85-U1/U2 overlap the independently observed footer/quoted-weight limits;
  neither is treated as an independently confirmed error.
- 86-U1/U2 overlap the independent oblique-mark/footer limits.
- 86-U3: the original visibly distinguishes the large thin chapter face from
  the two heavy Hei-style headings. No generic italic/bold mapping is uniquely
  required for that native chapter face; no defect is established.
- 86-U4: uppercase X/Y versus lowercase coordinate x/y is independently
  distinguishable in the original-only figure detail and retained in the crop.
  The author's uncertainty does not force an independent case HOLD.
- 86-U5: the first section-title separator is independently read as the
  enumeration comma `、`, and candidate uses it. No defect or local separator
  HOLD remains.
- No additional independently confirmed author-inventory relationship claim,
  figure-label substitution, false ownership claim or row omission was found
  within this inspected pair. The source-only incoming context is not approved
  full assembly.

## Rows, Mathematics And Figure

Independent row enumeration: page 85 has 24 content baselines plus footer = 25;
page 86 has 21 non-footer baselines plus footer = 22 distinct rows, or 23 literal
text rows when its same-row caption is counted separately. Existing audits
report 25/25 and 22/22; those are context, not semantic proof. Incoming
mechanical FIRST0 each is unchanged. No checker or validator was run.

All six displayed page 85 formulas were individually inventoried and compared:
vector acceleration fraction, scalar velocity equation, coordinate equation,
displacement projection equation, absolute speed radical, and coordinate
equation with velocity-squares fraction. Vector accents versus scalars, three
vector enumerations, subscripts, superscripts, signs, fractions, absolute-value
bars and radical coverage have no independently confirmed mismatch. Formula
agreement does not erase the two prose-punctuation defects.

Page 86 preserves chapter III, bold 引言, bold printed section 17, inline x/y,
the figure reference breaking at 图 / 52, and the last literal row ending at
跟. No unseen next-page word was supplied.

Actual inspected crop:
`.tmp/ld-s10y-lesson/source-author-8p-8586/work/8p/pages/0086/figures/fig-52.png`.
Supplied binding: 4111 bytes, SHA256
`89e44f556dafd058013ce0ce1329546e173b36bec4e490f47392b3beab0427f5`.
The declared final box is [928,1225,427,373]; the actual PNG, not merely that
box or a component count, was opened.

The crop retains two solid axes, positive-end arrowheads and small negative
extensions; all six labels X/Y/x0/x/y0/y with case/subscripts; the solid rising,
flattening, slightly down-turning trajectory; two filled position marks; all
four dashed coordinate projections; and the extra short oblique ink. It has no
independently confirmed clipped instructional object, missing relation, added
label, caption inclusion or neighboring-prose contamination. 图 52 is retained
as a separate caption sharing prose row 86-r15. It is not omitted merely
because the actual crop excludes it.

## Unapproved Scope

Page 85's `cont` and its source-only inherited predecessor reference remain
unapproved beyond local page shape. No predecessor prose was read. Page 86's
around-figure open/cont pair is locally supported, but its final section
opening has no inspected successor. All unseen chapter/section/group/catalog
ownership and naming, cross-gap assembly, gN identity and numbering policy
remain unapproved. No full lesson/course or next-page approval follows from
this source-only review.

## Budgets And Completion

| Metric | 85 | 86 | Pair |
| --- | --- | --- | --- |
| Independent SOURCE FIRST performed | 1 | 1 | Sole paired first review |
| SOURCE PASS | 0 | 0 | 0 |
| Confirmed candidate defects | 2 | 0 | 2 |
| Confirmed author-inventory defects | 2 | 0 | 2 |
| Confirmed crop defects | 0 | 0 | 0 |
| Deduplicated confirmed roots | 2 | 0 | 2 |
| Independent local confidence HOLDs | 4 | 2 | 6 |
| Repair limit / used / unused | 1 / 0 / 1 | 1 / 0 / 1 | Unchanged |
| FIRST debit | 0 | 0 | 0 |
| Content/source repair actual | 0 | 0 | 0 |
| Pipeline reruns | 0 | 0 | 0 |

Image ledger is in the frozen inventory: originals 2, original-only details 5,
actual final crop 1, reopens 0 = 8 loaded images. One batch used 8/8, context
used 8/24, remaining context allowance 16 but no further batch image allowance.
Parent image opens 0. No delegated worker or background job was started.
All commands ended; in-flight work 0.

Unchanged baseline: approved 7p/8p = 68/14; raw pages/entries/tasks = 54/21/85;
modernAdded = 0; committed 7p modern courses = 9; 8p entries/modern = 0/0;
8p numbering = UNSET. No DB/app/backend/Git/publish/automation/merge/deploy/
handoff/full-project operation or user-window takeover occurred. No prepare,
finalize, checker, validator, vectorize, assembly, promotion, installation,
candidate repair or new review attempt occurred.

## Owned Manifest

`tmp/source-first-8p8586/manifest.json` is generated as a flat JSON object with
exact top-level keys `workspace` and `files`; each leaf has exactly `path`,
`bytes`, `sha256`. It lists only current new owned leaves plus this report,
excluding the manifest itself. It contains no input files or recursively
hashed input tree. Actual manifest byte count, SHA256 and leaf count are
reported after generation in the completion message, avoiding a circular
report/manifest hash dependency.
