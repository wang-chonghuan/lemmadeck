# N18 affected raw-source review

Status: PASS for the explicitly affected raw page-71 changes and applicability of the existing source review. Not a modern-content, display, publication or complete-N19 approval.
Date: 2026-11-23.
Ticket / target: STEMROBIN-184 / ana9-c3-s1-n18.
Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Scope and actual evidence

This was a text-only continuation. I read the affected triple:

```text
.tmp/stemrobin-184-six/n18-nov23-source71/raw/9c/pages/0071/page.md
.tmp/stemrobin-184-six/n18-nov23-source71/raw/9c/pages/0071/page.json
.tmp/stemrobin-184-six/n18-nov23-source71/raw/9c/pages/0071/audit.json
```

I compared its changes with the preserved first-native triple and the already-frozen source observations/comparison. The checks used a textual diff, structured JSON comparison, Markdown-frontmatter comparison and SHA-256 hashing. No source command was rerun and no image, crop, reopen or reset occurred.

Additional images this stage: **0**. Cumulative images remain **5/8 batch and 5/24 context**.

The parent reports one actual affected `p2c finalize` with exit 0. Independently reading the resulting saved audit confirms `lines_printed: 23`, `lines_md: 23`, empty `errors`, empty `figures`, empty `normalizations`, empty `unknown_chars`, empty `katex_warnings` and zero errata. The command exit code is the parent's observed execution evidence, not a command executed by this reviewer.

## Exact changed surface

The affected Markdown block body is exactly the first-native Markdown block body with its seven Chinese full stops replaced by ASCII periods. No additional body-byte difference was found.

| Frozen source row | Native block / row | Verified punctuation-only change |
|---|---|---|
| A02 | 1 / 2 | `然数。德国` becomes `然数.德国` |
| A04 | 1 / 4 | Final stop after `$x$` becomes `.` |
| A06 | 2 / 2 | `了解。当` becomes `了解.当` |
| A08 | 2 / 4 | Final stop after `兴致` becomes `.` |
| B03 | 5 / 3 | Final stop after the geometric sequence becomes `.` |
| B04 | 6 / 1 | `例子。和` becomes `例子.和` |
| B11 | 9 / 2 | Final stop after the excess-approximation sequence becomes `.` |

These are the period-like-stop locations already identified in the source comparison. The change closes that specific literal-stop caveat; it is not a new mathematical correction.

The JSON block list is equal to the preserved list after applying only those same seven replacements. All dollar-delimited mathematical spans, including spans crossing printed rows, are unchanged. Block fields, ownership, headings, p cont/p open flags and row structure are unchanged.

The eleven blocks retain row lengths `[4,4,1,1,3,3,1,2,2,1,1]`. No wrap, duplicate row, blank body row, parallel-layout declaration, question, figure or footer text was added.

Outside the body, the only metadata differences from the first-native page are `notes` and `count_exclusions`. Source, render, profile, printed-page identity, errata and other metadata remain equal. The affected Markdown frontmatter is structurally equal to the affected page JSON's `meta`.

## Exclusion implementation and applicability

Exactly the two reviewed kind/box proposals occur in the Markdown metadata, page JSON and saved audit:

```json
[
  {"kind": "scan-artifact", "box": [1550, 825, 80, 65]},
  {"kind": "scan-artifact", "box": [0, 2300, 1695, 81]}
]
```

The saved audit exclusions are structurally identical to the page metadata exclusions, including their reasons. The reasons retain the reviewed identities: isolated outer-right blot and extreme-bottom scan-edge line/specks. No other exclusion was added.

The source-image binding in the affected Markdown/JSON remains the original 1695 x 2381 image SHA-256 `4b95e479cc416ad7ee6ec88bcb889fc6d810c4580f9f979778faef4988926cfb`. The parent states the original PNG is unchanged; this stage checked the unchanged textual binding, without reopening or reexamining pixels.

The prior pixel review therefore applies to these exact boxes:

- `[1550,825,80,65]` is the previously inspected far-right blot enclosure, outside every typeset body, heading and footer object.
- `[0,2300,1695,81]` is the previously inspected extreme-bottom ROI, below the body and the footer band ending at 2154.

No changed source geometry, math or content invalidates those nonintersection findings. There is no basis to repeat the image review.

The actual saved 23/23 result is consistent with removing the two independently identified non-content bands from the count copy. It is not a manual target, inferred PASS or authority to mask other marginal marks. Original pixels and text are not exclusion targets.

## Preserved source conclusions

- G01/G02 remain the pixel-resolved `a_n` and `10^n`. No mathematical expression changed and no n/m erratum was introduced.
- N18 still begins on this page with `应关系表明`, continuing page 70's `一一对`, and closes after `广泛兴致.` before the §6 heading.
- §6 and N19 ownership remain unchanged. N19's numbered entries remain explanatory prose, and its final sentence remains p open at `在这个对应关系`.
- The printed-page footer remains text `64`. Its decorative side marks remain honestly described in notes, not claimed as an ink-for-ink footer reproduction and not excluded.
- Existing colon encoding and decorative-footer qualifications are not silently upgraded into a facsimile-glyph claim. They are outside the seven affected stop changes.
- No confirmed instructional figure or N18 exercise has appeared.
- Raw page 70 is outside this affected review and remains untouched. The modern density/nondegeneracy clarification has not been read or approved.

The updated notes distinguish the initial original-page transcription from the later independent bound-crop review and the affected count-copy exclusions. They also preserve the footer qualification and the original first failure rather than implying that the first run passed.

## Hash-bound affected triple

The PASS above applies to these exact reviewed bytes:

| Affected file | SHA-256 |
|---|---|
| raw/9c/pages/0071/page.md | `1aa88272be958f44f8c88b4ab2ba7bacab63abdbc6fbee8a3eddc7b7d4ce71fe` |
| raw/9c/pages/0071/page.json | `4173f05830429e750eab4bb7a94ae0daaa592dd946115b7d77dfdf4aa6ee6ca3` |
| raw/9c/pages/0071/audit.json | `d04c0f7f4e330f9d164ac2bc38c0d0de0aa502b3e78a6ee30bb28c493fa2dd6e` |

## Preservation checks

The following SHA-256 values were checked and remain identical to the previous comparison. The first-native audit still retains the original 25/23 failure; it was not replaced by the affected audit.

| Preserved file | SHA-256 |
|---|---|
| first-native-0071/page.md | `00dc744783c9dba418017cb087df2c2e84087f3bcf9523ce32bea7e54491b23f` |
| first-native-0071/page.json | `f39c5a5e6936090731a1adfda8f1b6a3a770b705d1e8b6d5037d04b6ab25d198` |
| first-native-0071/audit.json | `750371d12629940d71c43627c959083aee5a4c848b16958bb7a8716f02b6a081` |
| reviewer/source-first.md | `d6d74feea5ae1eceb01a44722500f38533a63d30e64a9112aa133ad436304708` |
| reviewer/source-math.md | `300da9633ced0b7997953a103b79678e17006e18cd4686a7cb94919ddccfc329` |
| reviewer/source-comparison.md | `1213d9db5e2f4fc775e19a21c50d30148de19a5c4e203ea0dcb77f937aafa70d` |

Only this owned `reviewer/affected-source.md` was created. No source/exclusion/code edit, finalize rerun, modern approval, image action, Git, database, environment, app, dependency, network or other-agent action occurred.

Affected raw review ends here. The existing review remains available for the next explicitly supplied N18 modern text-only review.
