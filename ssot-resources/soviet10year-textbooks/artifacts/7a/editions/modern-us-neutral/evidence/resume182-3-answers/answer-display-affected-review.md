# Independent Affected-Only Answer DISPLAY Observation

Verdict: **FAIL_DISPLAY (affected-only)**.

The eight identifiable long formulas have visible terminal text in the supplied
right-state pixels. This is a **LIMITED_STATIC_ENDPOINT_PASS**, not an overall
DISPLAY pass: I cannot discern a formula scrollbar track or thumb in these six
captures. The CSS/computed `thin` assertion cannot replace visible scrollbar
evidence. The ninth manifest row also lacks an unambiguous formula identity.
The original `answer-display-review.md` FAIL remains unchanged.

## Scope and Image Budget

- Reviewer is not the candidate author. This is an independent static observation
  of the affected answer-display previews only.
- Sole root: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`. Every shell call used
  that exact explicit workdir. Branch `codex/STEMROBIN-182-textbooks` is the
  human-specified context; it was not independently queried through Git.
- Read the `ld-s10y-image` image limits and `production-resume.md` first, then
  the specified affected manifest and old report as text. Subsequent input reads
  were limited to their affected source/HTML/PNG bindings.
- Actual images loaded: **6**, each exactly once with original detail; batch
  **6/8**, this fresh context **6/24**. No original eight images, crops,
  reopens, transformed images, or parent image payloads were loaded.
- No browser, render, gate, checker, mathematical re-solution, network, DB, Git,
  other agent, user-chat, publication, or candidate modification was performed.
  Read-only hashing, byte comparison, PNG metadata, and static HTML text
  extraction were used. Only this new report was written.

## Exact Byte Comparison

All 15 affected source/HTML/PNG files match their manifest SHA-256 values.
The old failure report also matches its manifest binding.

Manifest SHA-256:
`1f0cc47f8814ff26c7aabd9de4b6e85fcfdb9c84419ebabe48ca7d3ec5a22112`.

Old failure report SHA-256:
`8be50feb8c2b98b5a811c7043400fd5032378302459ca904115a3f97f01ba070`.

| Lesson | Old HTML bytes | Current HTML bytes | Exact comparison |
| --- | ---: | ---: | --- |
| alg7-c1-s2-n5 | 507973 | 508188 | Entire old file is the current prefix; only 215 bytes appended |
| alg7-c1-s2-n6 | 435853 | 436068 | Entire old file is the current prefix; only 215 bytes appended |
| alg7-c1-s3-n8 | 526183 | 526398 | Entire old file is the current prefix; only 215 bytes appended |

Removing this identical suffix from each current HTML reproduces its old HTML
byte for byte, with zero removed or replaced bytes:

```html
<style>@media(max-width:640px){.nb{scrollbar-width:thin;scrollbar-color:#888 #eee}.nb::-webkit-scrollbar{height:6px}.nb::-webkit-scrollbar-thumb{background:#888}.nb::-webkit-scrollbar-track{background:#eee}}</style>
```

Thus the three HTML bodies, embedded mathematics, previous styles, and existing
renderer output bytes are unchanged before that suffix. The three answer source
hashes also equal the old report's bindings. This establishes unchanged supplied
content, not an independent execution-history audit of renderer/finalization.
The other five desktop/mobile observations are inherited from the old textual
report and the manifest, not reopened or newly approved.

## Six Actual PNG Observations

The manifest states a 390x844 capture viewport. PNG headers show different
left/right full-page sizes:

| Lesson | Left PNG | Right PNG |
| --- | --- | --- |
| alg7-c1-s2-n5 | 375x5457 | 390x5169 |
| alg7-c1-s2-n6 | 375x2759 | 390x2609 |
| alg7-c1-s3-n8 | 375x4334 | 390x4059 |

The 15px width difference is recorded, not explained away or itself called a
defect. These are not pixel-identical, same-dimension viewport comparisons.
No independent client-width or capture-timing measurements were made.

Both states show rendered Chinese, lesson titles, and distinct numbered answer
blocks. The affected prose and formulas stay associated with 70/71/78/79/80,
83, and 104 and their visible subpart labels. No obvious vertical collision
between the inspected formulas, adjoining prose, or next answer blocks was
observed. Formula starts are intentionally absent in some supplied right states;
the left states supply those starts. This does not certify every Chinese glyph,
fraction digit, superscript, or complete answer.

**Scrollbar observation:** no discernible horizontal track/thumb was observed
under the inspected formula regions in either state. Thin separators between
answer blocks are not evidence of a formula scrollbar. At the left states,
long text still meets/crosses the mobile right boundary without a visible
scrolling affordance. Right states expose the listed endings inside the supplied
PNG boundary, but this alone does not establish discoverable mobile scrolling.

## Nine Manifest Rows and Visible Endpoints

All `before` values below are 0. The `after / maximum` values are quoted from
the manifest, not produced or independently remeasured by this reviewer.

| Row | Region | Recorded after / maximum | Independent left/right pixel observation |
| --- | --- | --- | --- |
| 1 | n5, 70(d), A/B/C/D list | 115.5 / 116 | Left shows `A=(0,2)`, `B=(-1,0)`, and `C=(0,-1)` before the right boundary. Right shows the C/D tail ending `D=(1,0)` and its closing parenthesis and sentence stop. LIMITED_STATIC_ENDPOINT_PASS; no discernible scrollbar. |
| 2 | n5, second `answer-70` row | 2 / 2 | Owner alone does not identify a subpart, `.nb` index, selector, or formula. Static HTML contains several other math spans under 70; the tiny shift is not uniquely identifiable in the pixels. UNBOUND_REGION: no independent nine-of-nine formula claim and no discernible scrollbar. |
| 3 | n5, 71(a), implication | 14.5 / 15 | Left shows `3x-1=0` and the implication/product through the right edge. Right clearly shows `(3x-1)(x-6)=0` and its sentence stop, including both factor-closing parentheses. LIMITED_STATIC_ENDPOINT_PASS; no discernible scrollbar. |
| 4 | n5, 78(b), equivalence | 39.5 / 40 | Left shows `x^2-2x+1=100` and the equivalence before clipping the right-hand ending. Right shows `(x-1)^2=100` and the sentence stop. LIMITED_STATIC_ENDPOINT_PASS; no discernible scrollbar. |
| 5 | n5, 79 introductory point list | 39 / 39 | Left shows `(0,0)` and the earlier plus/minus coordinate pairs. Right exposes the last pair `(\pm4,16)`, its closing parenthesis and following comma. LIMITED_STATIC_ENDPOINT_PASS; no discernible scrollbar. |
| 6 | n5, 80 introductory point list | 123 / 123 | Left shows `(0,0)`, `(\pm1,-0.5)`, `(\pm2,-2)` and the start of the later pair. Right exposes `(\pm3,-4.5),(\pm4,-8)`, final parenthesis and comma. LIMITED_STATIC_ENDPOINT_PASS; no discernible scrollbar. |
| 7 | n6, 83(d), ordered-pair set | 273 / 273 | Left shows the opening brace and first negative-first-coordinate pairs. Right shows `(1,-6),(2,-3),(3,-2),(6,-1)`, final parenthesis, closing brace and sentence stop. LIMITED_STATIC_ENDPOINT_PASS; no discernible scrollbar. |
| 8 | n8, 104(a), numerator identity | 175 / 175 | Left shows `x(x-5)-0.5x(2x-10)` and the first equality. Right shows `(x^2-5x)-(x^2-5x)=0` and following comma, with the final parenthesized term complete. LIMITED_STATIC_ENDPOINT_PASS; no discernible scrollbar. |
| 9 | n8, 104(b), numerator identity | 44.5 / 44 | Left shows `(a+1)^2-(a-1)^2-4a` and the following equality chain at the right edge. Right shows `4a-4a=0` and following comma, with the preceding factor parentheses visible. LIMITED_STATIC_ENDPOINT_PASS; no discernible scrollbar. |

The manifest says these are programmatic DOM maximum-scroll states, explicitly
not user gestures. Several reported `after` values differ from the reported
integer `maximum` by 0.5px, including 104(b) above its integer maximum. No
explanation or exact-maximum measurement is inferred from these static files.
The pixels support displaced formula text and exposed terminal text, not
independent proof of an exact DOM maximum, real touch/swipe interaction, or
scrollbar visibility.

## Current SHA-256 Bindings

Paths are relative to the sole root above. All preview files are under
`.intentfold/tickets/STEMROBIN-182/tmp/resume182-3/`.
Sources are under
`ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/<lesson>/answer-keys.json`.

| Lesson | Source | Old HTML | Current HTML |
| --- | --- | --- | --- |
| alg7-c1-s2-n5 | `3071ace637561035c8ae2fc2557e976bc42cdf3d6c134535169f07d39e9722c3` | `3898d5f7c284d3e482d39959b1bc213bfb9d7fedcd3b37a52d4915054d3acf55` | `bdf6f632a68b944bf0496ff78050574dec0976971aeb4a118931c12263e84181` |
| alg7-c1-s2-n6 | `b795c2edaf6551f1b8f4752504d1f8a77aa8d2a8819a8afbbcb88313ccdf42f8` | `5a1428bdd3bd19d291762209eb31f8be298a8efca25af694c31be00f0bac4330` | `44cdd0a37724bbf7633b369e7c27b4eab52cc206afe22d646be074f0aadafb12` |
| alg7-c1-s3-n8 | `e3fc85cc5bde1314cf2e974efed4cbfd342a682c8839b78904d121abb471591e` | `1ad0f22aee3d667f2cbee1e24f1d79c8c7e8232a79aa708d7e7242440cab40f4` | `740efb11bbef7a7fe2374f90530111c1209d1e4aaa77a5293c2c67b0dd3e5dec` |

Old HTML basename: `<lesson>-answers.html`.
Current HTML basename: `<lesson>-answers-scroll.html`.

| Inspected PNG basename | SHA-256 |
| --- | --- |
| alg7-c1-s2-n5-answers-scroll-left-390.png | `f06d7722e2120435b80f176f3f6a1a4f2add8716f2bec98f809467c232a4b82d` |
| alg7-c1-s2-n5-answers-scroll-right-390.png | `0c0e679a00e992570beb4d0405e01c27935250321351cd5c75c758d3f8d83e05` |
| alg7-c1-s2-n6-answers-scroll-left-390.png | `70a1fb3c67b70ce3592e030ec6ed82ea7314ad433b75c0b0418cbcbc471254c8` |
| alg7-c1-s2-n6-answers-scroll-right-390.png | `9b3a45a261fa28d8e7bc6a6a1fe6d46c8c5d0a5def27c93123fd058949ef7979` |
| alg7-c1-s3-n8-answers-scroll-left-390.png | `3378eeab730a16a7a7086f573cb7ee927cc3dec9c80f78ce21814bcfb53a08f9` |
| alg7-c1-s3-n8-answers-scroll-right-390.png | `e9a5579ab54e89f9a64f0008b354ad19462fe0c23fa20535b6917bbcb6d9e597` |

## Approval Boundary

This is a finite, full-page, static left/right joint observation. It does not
certify all characters or all intermediate scroll positions. No native-viewport
reading sweep or live interaction was performed. Eight visible terminal recoveries
do not approve the unbound ninth region or the absent scrollbar evidence.

No whole-answer, mathematical-correctness, APP/runtime, independent-writing,
original-image, whole-lesson, 881-corpus, DB, or publication approval is granted.
The old FAIL is preserved; this report does not edit or replace the candidate,
manifest, or original review.
