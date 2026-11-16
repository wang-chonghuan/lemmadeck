# STEMROBIN-180/C: Batch 24 n99 FIRST DISPLAY Review

**Frozen decision: FAIL.** Sole fresh FIRST reviewer; authorized offline DISPLAY ONLY for `phy7-c1-s2-n99`, modern-us-neutral, book 7p. No repair applied.

## Finding

**DISPLAY-01 / P2: Unrendered title emphasis, all six screenshots.** The title visibly contains `用*物质*的分子结构学说解释熔解和凝固`: literal asterisks remain around `物质` on the text, exercises and choices pages at both widths. This fails the proper-emphasis display criterion. Body bold emphasis renders visibly and wraps correctly.

**Smallest affected repair proposal:** repair only the title display path to safely render the approved inline emphasis without exposing its delimiters. Preserve the approved wording, prose, written tasks, choice views and private answers. This is a proposal, not an implemented change; the renderer cause was not investigated.

## Visible Results

| Criterion | FIRST Result |
| --- | --- |
| All 11 prose blocks fit and are readable, both widths | PASS |
| Both written tasks fit and are readable, both widths | PASS |
| Both choice stems and all eight options fit and are readable, both widths | PASS |
| Body bold emphasis | PASS |
| Title emphasis | FAIL: DISPLAY-01 |
| Formula display | Not applicable: no mathematical formula visible |
| Mobile/desktop clipping or collisions | PASS: none observed |
| Incoherent overlap | PASS: none observed |
| Last content fully visible | PASS: last prose paragraph/navigation, written task/return control, final choice option |
| Internal answer-key or runtime-error markers | PASS: none observed; exposed title-formatting delimiters tracked separately |
| Figures | Zero; no figure review applicable |

Mobile titles wrap to two complete lines. Written-task numbering stays separate from wrapped task text. Radio circles and checkbox squares stay separate from option labels; continuation lines retain indentation. No correctness, fidelity, answer or CHOICE rereview was performed.

## Image Accounting

Exactly six full-page screenshots were opened once each through six `functions.view_image` calls, `detail: original`. Batch 1: desktop text, exercises, choices. Batch 2: mobile text, exercises, choices. Three images per batch, six in this context; no reopens, crops, new screenshots or image-bearing handoff.

Batch 1 was frozen in `tmp/display-review-batch24-n99/batch1-first-findings.json` before opening batch 2. Batch 2 is frozen in `tmp/display-review-batch24-n99/batch2-first-findings.json`. In-flight operations: 0. Token usage and fees: unknown.

## Reused Evidence

The sole existing offline `report.json` reports `pass` for six pages, with no media. Its mechanical result does not override this FIRST visual FAIL. Both existing receipts were read, not rerun: `batch24-n99-official-render.call.json` exit 0, and `batch24-n99-offline-display.call.json` exit 0. The official-render stdout records 11 prose blocks, two written tasks and two choice questions.

Byte/SHA-256 binding was captured before and after image inspection. All 20 bindings were unchanged, including the retained choice-view projection. The three current HTML hashes match the existing offline report. Exact absolute paths and PNG pixel dimensions are recorded in `tmp/display-review-batch24-n99/bindings-after.json`.

| Screenshot | Bytes | SHA-256 |
| --- | ---: | --- |
| phy7-c1-s2-n99-text-1440.png | 310117 | `9a27c7467d389fbd86b29a722eedbcf0a27f98abcd38bca94404c46cc2fca510` |
| phy7-c1-s2-n99-exercises-1440.png | 41898 | `60a16a3a6ae1ef5622fc33e000eb00d808dd288733e453acca77866fddf9a460` |
| phy7-c1-s2-n99-choices-1440.png | 171940 | `590606dfcdf5cf05c5ae831d16de01f6796fbbc1469fd40cf5ddeeec0035b17b` |
| phy7-c1-s2-n99-text-390.png | 279280 | `54f387af1d8be3f72f7cdbfb6bac1bb56b509adfbbab0b16b6f68debae1cd2ae` |
| phy7-c1-s2-n99-exercises-390.png | 35634 | `18a5d0df6c1d186fbabe7d8ac4b51801936d224fe9bd59969ccbaf8f80c10bce` |
| phy7-c1-s2-n99-choices-390.png | 166116 | `15151a20c7d06fa2c979c0baf171c2196c618b88d68bea13a1e4f2be83051a86` |

| Other Bound Input | Bytes | SHA-256 |
| --- | ---: | --- |
| text.html | 374445 | `cb99e0272ddc24d73004245fbfb31a6b652e6e9bec62cec1a8b4f556ee782081` |
| exercises.html | 371899 | `7ee95d462a90ad1dcf201736cce9edeb78f55679d2adb6acebcbf89d0c6d84eb` |
| choices.html | 373976 | `e07c821c3ed052beba8f867ff8f93eadcc55ac281dcc0ce4e1ec386adaf9037c` |
| Existing offline report.json | 2558 | `7a394b531831e64e1e01823493fbedc3a44c835dbe88d94a88dfe7b49e142624` |
| Modern lesson.json | 10507 | `05ceb7ef0f243b81a183b008fdc9841107d0ab6cd57d4008822bf40ddd7cc847` |
| Modern exercises.json | 2452 | `6a4043657af8c98e8b2e00565b5151d8b0233f4d91204d7281587048a16ae4dc` |
| Modern figures.json | 153 | `dbdcbc02c9f98c023a9b05bc04bbf9a2134f69cd2614b9e06deeb496c80366c8` |
| Choice-view projection | 2644 | `c5b3c78b714152fd95998f4c852cc19a242aae8048285632a1d5640cf71510d5` |
| Official-render receipt | 901 | `c172b58f40deeb56ea972bafe6c22b13edeca52b8c04158b71508f324a090678` |
| Offline-display receipt | 735 | `6db7a1346a2858df989ee857210902fdbf6eaf91d1a2ae87c56be25098ce14ef` |

Choice draft was projected only to `questions[].{id,view}`; no keys or author fields were exposed, retained or hashed as a whole draft. Modern lesson/exercises/figures were byte-bound, not substantively rereviewed. Rawbook/source material was not read or bound because it was unnecessary for DISPLAY; no whole-book hash was taken. Any future rawbook binding must use only the selected lesson entry.

## Boundary And Handoff

No browser, app start, rerender, semantic/structural validator, env, database, publication, Git, chat coordination, full checks or IntentFold capability was used. No source scans, answer files, author internals or private files were opened. Only the authorized review directory and this Markdown report were written; no other changes were reverted or modified.

Machine-readable decision: `tmp/display-review-batch24-n99/report.json`. Exact textual handoff and byte/hash seal: `tmp/display-review-batch24-n99/handoff.json`. Return text, paths and hashes only. This remains the frozen FIRST FAIL, not a repair or re-review.
