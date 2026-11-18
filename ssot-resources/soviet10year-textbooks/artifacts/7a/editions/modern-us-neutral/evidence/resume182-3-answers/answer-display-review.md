# Independent Answer DISPLAY Observation

Verdict: **FAIL_DISPLAY** for the captured read-only answer previews.
Three of eight inspected images visibly truncate mathematical text at the
mobile right boundary. This is not a verdict on mathematical correctness.

## Scope and Evidence

- Reviewer is not the answer author. Only current standard-answer files,
  `answer-display.json`, and its eight listed PNGs were used.
- Actual inspection: **8 new images, once each**, with no crops or reopens.
  Context total: previous 4 + new 8 = **12/24**; this batch **8/8**.
  Previously reviewed fig-74/75 were not reopened.
- Before image inspection, SHA-256 of all **16 unique files** matched the
  manifest: 4 answer JSONs, 4 HTMLs, and 8 PNGs.
- Manifest SHA-256:
  `b829ebbeb4259747486406e363e85d909d392301fdd6f1f5cdd5c6627917a59b`.
- Shell cwd was always
  `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-3`.
- No render/gate, Git, network, DB, publication, or chat operations.
  No source evidence was overwritten; only this report was written.

## Eight Actual Pixel Observations

The manifest's 1440x960 / 390x844 values are capture viewports, not PNG
dimensions. These are full-page screenshots, actually 1425 / 375 pixels wide.
The 15px width difference is not itself a failure.

| Lesson / PNG suffix | Actual PNG | Observation |
| --- | --- | --- |
| alg7-c1-s2-n5 / 1440 | 1425x3227 | LIMITED_PASS: visible title, Chinese and KaTeX are rendered; numbered blocks 67-82 are separated and their visible answer content is associated correctly. No obvious vertical overlap or boundary truncation observed. |
| alg7-c1-s2-n6 / 1440 | 1425x1728 | LIMITED_PASS: blocks 83-89 remain distinct; visible ordered pairs, intervals, and fraction chain are rendered. The 85(a/b/d) sequence matches the standard answer, not an apparent missing display row. No obvious overlap or clipping observed. |
| alg7-c1-s2-n7 / 1440 | 1425x1203 | LIMITED_PASS: blocks 90-95 are distinct; visible fractions, equations, root sets and concluding comparison remain associated with their numbers. No obvious overlap or clipping observed. |
| alg7-c1-s3-n8 / 1440 | 1425x2678 | LIMITED_PASS: blocks 96-108 and visible Chinese/KaTeX are separated. The visible 104 identities and 108 branches fit this desktop capture. No obvious overlap or clipping observed. |
| alg7-c1-s2-n5 / 390 | 375x5402 | FAIL_DISPLAY: right-edge cuts occur in 70(d)'s A/B/C/D coordinate string, 71(a)'s implication equation, 78(b)'s equivalence equation, and the introductory point lists of 79/80. These lines visibly terminate at the image boundary before the standard-answer text is complete. Other visible Chinese wraps and answer-number grouping remain legible; no obvious vertical overlap observed. |
| alg7-c1-s2-n6 / 390 | 375x2710 | FAIL_DISPLAY: 83(d)'s ordered-pair set runs into the right edge; later pairs and its closing brace are not visible. Other visible blocks, including the 89 fraction chain, are rendered without an obvious vertical collision. |
| alg7-c1-s2-n7 / 390 | 375x1936 | LIMITED_PASS: visible Chinese, fractions, root sets, and blocks 90-95 remain readable and associated correctly; title wraps. No obvious right-edge truncation or vertical overlap observed in this image. |
| alg7-c1-s3-n8 / 390 | 375x4316 | FAIL_DISPLAY: the long identities in 104(a) and 104(b) are visibly cut on the right before their final terms. Other visible Chinese wraps, answer numbers, and shorter formulas remain distinct; no obvious vertical overlap observed. |

## Limits

- This is a single full-page observation per PNG, not a native-viewport
  reading sweep. Small fraction digits, superscripts and every Chinese
  character were not exhaustively certified. LIMITED_PASS means no obvious
  defect in the observed pixels, not approval of every answer or every glyph.
- Visible title/number/content association was compared with standard-answer
  display text only. Original lesson prose, choice questions, figures,
  original mathematics and independent writing ability were not reverified.
- The manifest's `pass`, loaded-font flag, adjacent entry rectangles and
  body scroll/client widths are supporting geometry evidence only. They do
  not override the visible mobile truncation.
- A static screenshot cannot establish whether horizontal scrolling can
  recover the hidden text. No scrolling or other interaction was tested.
- No APP, product runtime, production database, whole-answer, whole-lesson,
  or publication approval is granted.

## Current SHA-256 Bindings

All paths below are under the worktree root; PNG/HTML files are in this
report's directory. Answer files are the manifest's corresponding
`ssot-resources/.../7a/editions/modern-us-neutral/lessons/<lesson>/answer-keys.json`.

| Lesson | Answer JSON | HTML |
| --- | --- | --- |
| alg7-c1-s2-n5 | `3071ace637561035c8ae2fc2557e976bc42cdf3d6c134535169f07d39e9722c3` | `3898d5f7c284d3e482d39959b1bc213bfb9d7fedcd3b37a52d4915054d3acf55` |
| alg7-c1-s2-n6 | `b795c2edaf6551f1b8f4752504d1f8a77aa8d2a8819a8afbbcb88313ccdf42f8` | `5a1428bdd3bd19d291762209eb31f8be298a8efca25af694c31be00f0bac4330` |
| alg7-c1-s2-n7 | `9ec31f00aeabeb111f59da9d19bbf1532a4639e20b65b11f79f7a6319b300ad5` | `901e0d93af3779d1ae7cc843f709639fdcea6ef1238dce2522651a63c0b405e3` |
| alg7-c1-s3-n8 | `e3fc85cc5bde1314cf2e974efed4cbfd342a682c8839b78904d121abb471591e` | `1ad0f22aee3d667f2cbee1e24f1d79c8c7e8232a79aa708d7e7242440cab40f4` |

| Inspected PNG | SHA-256 |
| --- | --- |
| alg7-c1-s2-n5-answers-1440.png | `7adebbea936ef353ab447ae548faee64ec5ada8bc610a50b59ff4bfd947a48e4` |
| alg7-c1-s2-n6-answers-1440.png | `a54e2e4a879d2b6b74a5eaf869a6c6e76c8fa9683dfef6aa821e8dceeeda3a36` |
| alg7-c1-s2-n7-answers-1440.png | `cd610297dec4b973577906668d423df6f91f2a2cd4ed5c0645a1b817d0fbdad3` |
| alg7-c1-s3-n8-answers-1440.png | `106e2af4860249650911c15560dd2c295f3a32a953cbd56f377916137e04a3d9` |
| alg7-c1-s2-n5-answers-390.png | `2eee88511d85b871c801b40d36b02bf36a9a6b0e585b96b427a85e43d364e057` |
| alg7-c1-s2-n6-answers-390.png | `aa4184ef4a36a045b60c5cd260fdb4eb3a45c0f17ebee925b3be07648c950100` |
| alg7-c1-s2-n7-answers-390.png | `516d222c4c107ceabe0ae79b75921c633e60d07b8983dfbc350f18f0e2ec24cd` |
| alg7-c1-s3-n8-answers-390.png | `32bb621fa6aef090af5d0b1313ab2436d65439803b7fe908c519571aab0bd58a` |
