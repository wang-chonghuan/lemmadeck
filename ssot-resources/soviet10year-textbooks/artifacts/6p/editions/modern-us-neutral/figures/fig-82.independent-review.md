# Independent Figure Review: fig-82

2026-11-15. STEMROBIN-180. Independent cap4 reviewer, not this figure's author.

**PASS on the sole repaired frozen candidate. Affected repair units: none.** The first author FAIL remains preserved; repair budget is already1/1. No further repair, renderer rerun or promotion was performed.

## Actual Complete Source Inventory

Reopened and actually viewed the complete original:

[Source PNG](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-82.png)

The source has three vertically arranged pairs, two molecular outlines per row (six total), progressively smaller pair separation downward, and a vertical dashed center guide. Each molecule has two opposed horizontal arrows, one inward toward its partner and one outward: four per row, twelve total. The bottom outward arrows are conspicuously longer. No numerical scale, distance axis, force value, row letters or force legend is printed.

The upper/middle/lower attraction-versus-repulsion interpretation comes from the complete frozen prose together with these pixels. Coarse arrow endpoints are not calibrated measurements; exact middle equality is prose authority, not a claim of precision pixel metrology.

Independent inventory agrees with `source-top-pair`, `source-middle-pair`, `source-bottom-pair` and `source-whole-composition`. Each row maps both centers/circles and all four arrows. Its pair displacement covers both mapped points wholly within that group; every arrow has `connects` plus signed horizontal-vector assertions. Six-circle/twelve-arrow counts confirm completeness but do not replace the row relationships.

## Unchanged Full Context and Added Geometry

Read complete `spec.source.authoritativeText`: s28 title, full modern prose/captions and all four exercise prompts. Independently confirmed exact derivation from the unchanged frozen templates:

| Context file | Actual byte SHA-256 |
| --- | --- |
| s28 `lesson.template.json` | `2b9207e7a552d55178c18e97c4ae812cf2908d6d889e0645c19b4be67808bc7d` |
| s28 `exercises.template.json` | `15ba255ebfed40560adb940416f546b8f609e9ebd94422e10fc92e35c51fb5dd` |

Their root remains `.tmp/ld-s10y-lesson/text-author-c3-s27-s28/adapt/6p/modern-us-neutral/lessons/phy6-c3-s28/`. No text or source-answer re-review was undertaken.

Actually viewed the complete final [SVG output](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-82/fig-82.svg) through its bound `author-native.png`, individual native306 screenshot and all complete640 theme screenshots. All three pairs, six circles, twelve arrowheads and dashed guide are visible in one shared composition. Every arrow starts at its own molecule's center; inward arrows point toward the partner and outward arrows away. Neither force class disappears at the balanced middle state.

| Row | Pair separation in authored coordinates | Inward/outward authored lengths | Required qualitative meaning actually visible |
| --- | --- | --- | --- |
| a / upper | 400 | 56 /32 | Attraction greater; repulsion smaller but present. |
| b / middle | 260 | 72 /72 | Both forces larger than upper, equal and opposite; not both zero. |
| c / lower | 180 | 84 /140 | Both larger again; repulsion exceeds attraction, with long outward arrows. |

These values are expressly modern illustrative coordinates, not source-given distances, Newton values, measured ratios or a calibrated force law. Repulsion's growth is faster in the chosen illustration; pairwise equality and the middle balance agree with the prose. No number from this table is visible in the image.

Exact circles, small center anchors, a/b/c identifiers, semantic color distinction and English inward/outward legend are declared additions. They identify existing source/prose force roles, not a newly derived exercise answer, net-force value, distance scale or solved cable explanation. The image does not reduce the two force classes to an unlabeled resultant.

## Sole Repair and Preserved First FAIL

Read-only structured comparison of preserved initial and current specs found exactly one delta:

`/objects/28/at/1`: attraction-legend y-coordinate `75` -> `95`.

All molecular geometry, arrow coordinates, labels, font sizes, context and mathematical assertions remain unchanged by that repair. The first failing render is not overwritten:

| Preserved evidence | Actual byte SHA-256 |
| --- | --- |
| `failure-01-label-collision/spec.json` | `23253736ed8a1e626a30abf16befed6b027139307c26b57bfb8d8792a92d7f3b` |
| `failure-01-label-collision/fig-82.render.json` | `d885196edc48de861ffe3fa770101a56f743521224f4a059956bac0dc8b34162` |

`render-call-01.json` and the failure archive remain the first failed execution; `render-call-02.json` is the sole repaired one. The current render is pass with30 objects/five labels and no collisions. This review observes the repaired candidate once; it does not fabricate an independent PASS for the old failed version or authorize a third attempt.

## Actual306/640 Themes, Bottom and Right Edges

Actually viewed `author-preview-01/width-theme-sheet.png` with all four unresampled306 surfaces, individual `neutral-306.png`, and all individual full640 neutral/mixed/dark/print screenshots. The existing preview script uses explicit isolated headless project Playwright with deviceScaleFactor1, no PWDEBUG, no automatic HTML opening or user-profile/CDP attachment. No browser was rerun.

All eight screenshots are bound to the current SVG/spec, with matching actual PNG dimensions and screenshot hashes:

| Actual media width/height | Actual screen-transformed minimum text |
| --- | --- |
| 306 x430 px | `16.244444444444444` px in every theme |
| 640 x900 px | `34` px in every theme |

The render report's ideal-scale306 minimum is16.25625 px; actual native-height rounding gives the slightly lower value above. Both pass>=16; the actual transformed value is retained without hiding it behind nominal canvas size.

All twelve arrowheads remain distinguishable at306. The far-right outward arrow, far-left tags, entire bottom pair and both bottom legend lines are inside the image. The repaired legend lines have visible separation in all themes. At306 their recorded label rectangles have a gap of about10.67 px; the final lower legend reaches about420.68 of430 px, leaving about9.32 px bottom margin. At640 the lower legend ends at880.8125 of900 px. No bottom/right crop or overlap is visible.

Print removes color distinctions but preserves inward/outward directions, relative lengths, circles, tags, guide and readable separated legends. Mixed/dark recoloring is semantic CSS, not hardcoded theme colors. Visible text is Latin English only; no Chinese/Cyrillic, cultural symbol, handwritten/old-book texture or additional answer annotation. Inline sizing fits both declared media widths; horizontal scroll is not required or claimed.

## Current Bound Snapshot

| File | Actual byte SHA-256 |
| --- | --- |
| Original PNG | `fbe9c9f2fd387b248f07193563541bd10e61ddc7246eb3067a5f0b34039e1131` |
| `spec.json` | `3adebc633856db59e88f07950dd2e717c4a2f197d8a85409a3e1734956378920` |
| `fig-82.svg` | `5c3174c037f0130849846e07ce67815f29c09562104696156efb6c8840d30e24` |
| `fig-82.render.json` | `46ee5cceb46fd308a041a12fb58bd1f14951a43b23e7057abf5eef7980fec53e` |
| `author-preview-01/preview.json` | `dc2b082995331382c51d80161250d69d88fcd269aab8d6101e68b705709b8211` |
| `source.inventory.json` | `2a0107944d1dc223762d3c509ea56f7c86237bcdec6871862413b80d9f9e4eff` |
| `context.json` | `20a47d73e2d9097c225120f9415ccbaacb79493d814be2c86e5478e3b446b980` |
| `author-handoff.json` | `5933438e70d8c7a1564c1e1d146440f26c490d1cbcb1fe2d0deb7c7efb594e70` |

Every handoff-listed file, source and frozen-template hash matched actual bytes. Existing current render and previews hash the actual final output, not a stale or rejected image. Record canonical `review.json` with `record_review.py --spec spec.json --render fig-82.render.json --status pass`.

No essential defect remains in this current snapshot; no affected repair request is needed. Source/spec/SVG/text and author/FAIL evidence remain intact. Only independent review artifacts are written. No generation, renderer rerun, source-page or answer re-review, fig79/80 action, promotion, DB/Git/app/charter/dependency/service action. Main owns integration and subsequent whole-lesson/product acceptance.
