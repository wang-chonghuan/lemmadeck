# Physical239 Source Pixel Arbitration

STEMROBIN-182; book7a physical239 / printed233; offline finish=review.

## Verdict

**The source prints `sqrt(2.45) approximately 1.565`. Digits: 1, 5, 6, 5.**
The middle fractional digit is a legible 6, not 5. This independently substantiates
`R239-lookup` and contradicts the author note. Current `1.555` is a transcription
error, not a genuine source mathematical erratum.

## Pixels First

Source image: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0239/page.png`
SHA256: `7453e58f72dff78bad95ac2a10025f9c31b83b80cce8081af03d500aaa89a961`
Sole crop: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source239-arbitration/page0239-x180-1320-y285-390-nearest2x.png`
SHA256: `9fe41685a2a6bcb4711fcfc42945c8f6489bf72699441bc6bca51bd539242588`
Bounds [180,285,1320,390), source coordinates; 1140x105 enlarged to 2280x210
by nearest-neighbor, lossless PNG. Target formula y317-362 is inside those bounds.
**One crop display; zero full-page/grid/other-image displays; zero reopens. Budget exhausted.**
Frozen observation SHA256: `84c77c26802c2804e5ec393f4f8cdd5343a4b871ec5154f17b0f8dcd6e662f51`.
It was saved before current artifacts, conflicting reports, author note and calculation.

- integer digit: **1**. Tall straight vertical stem with a short upper entry and a bottom foot; no rounded bowls.
- first fractional digit: **5**. Flat top bar, short upper-left descending segment, and rounded lower bowl.
- middle fractional digit: **6**. Thin curved upper hook continues down the left into a lower loop. It lacks the flat top bar and upper-left step visible on both neighboring 5 glyphs. The thin/broken scan strokes do not change that distinction.
- last fractional digit: **5**. Flat top bar and upper-left segment above a rounded lower bowl, matching the first fractional 5.

## Comparison And Erratum Status

`page.md:46` and `page.json` p0239#1 currently contain `1.555`.
`page.md:23` and author report:29 claim that value is faithfully printed.
`p0239-math-1` is still registered in MD/JSON, with original `1.555`; audit counts one
erratum and passes 26/26 lines. Those mechanical facts do not prove printed fidelity.
**Registration remains unchanged but is unsupported: its printed-original premise is false.**
The existing review's `R239-lookup` reads 1.565 and identifies the middle 6, agreeing
with this fresh crop. The later current-text 1.565 was compared as text only, not reopened.

## Mathematics After Pixels

`sqrt(2.45) = 1.5652475842498527874864215681118933648084328517281`
at Decimal precision 50; four significant digits give `1.565`.
`1.565^2 = 2.449225`; root error about `0.00024758425`, below `0.0005`.
`1.555^2 = 2.418025`; root error about `0.01024758425`, above `0.0005`.
The erratum's arithmetic about 1.555 is correct, but arithmetic cannot make that
misread value a printed fact. The observed 1.565 is a valid approximation.

## Unapplied Corrective Action

- The source owner, after separate authorization, should transcribe p0239#1 as sqrt(2.45) approximately 1.565.
- Replace/remove the mistaken first note claiming the source prints 1.555.
- Remove p0239-math-1 rather than retaining it with original 1.565: the printed approximation is valid.
- Keep page.md, page.json and audit.json consistent through the authorized affected-only canonical workflow; no tool was rerun here.
- Treat the author assertion as superseded by this arbitration while preserving existing author/review evidence unchanged.
- Do not describe the transcription repair as a modern-edition mathematical correction or as approval for other findings.

No source/tool/index edits, production reruns, Git, network, DB, publication, app
use, dependency changes, or agent dispatch/messaging occurred. No other owner files
were edited. This arbitration approves no broader page, batch or downstream stage.
The first default Python lacked PIL; the existing lesson Python created the one crop.

## Current Input SHA256

| File | SHA256 |
| --- | --- |
| `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0239/page.png` | `7453e58f72dff78bad95ac2a10025f9c31b83b80cce8081af03d500aaa89a961` |
| `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source239-arbitration/page0239-x180-1320-y285-390-nearest2x.png` | `9fe41685a2a6bcb4711fcfc42945c8f6489bf72699441bc6bca51bd539242588` |
| `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source239-arbitration/pixel-observation.json` | `84c77c26802c2804e5ec393f4f8cdd5343a4b871ec5154f17b0f8dcd6e662f51` |
| `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source239-arbitration/create_crop.py` | `f6134afaa2a1a108a1c21dc5a71cb9ff82b9f270d229256fcdfb38ea6c9333c6` |
| `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source239-arbitration/crop-provenance.json` | `ccaefda9a63abdeab59f2e769f55276c422cfd5e3536cfd21fda90a94d17dd9e` |
| `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0239/page.md` | `9716c54daac7520a1a5ea196fa2efe9f377c613265793fd22d9f31a769f28de6` |
| `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0239/page.json` | `cce8b7c7c6f3930b44c3aaabfe8e79b1a6abbaace408357fc6ea3577d573313c` |
| `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0239/audit.json` | `5d7dddbf83571b93317ec6100da342641b11ba94694fc6ed624083500240802e` |
| `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source235-242-review/source235-242-review.json` | `de932016520e14c08037372da92a919f22cd3a99f4e927cae84d53d1d9ec1593` |
| `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source235-242-review/source235-242-review.md` | `72340f9d5747215cebc64c3776d03249c53ab386335e67f158d88555a99cfe94` |
| `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source235-242-review/source-observations.md` | `a3fa64d9a1466b8649e218da5529b48c1931c6b68cc881ed490f99bb56def88d` |
| `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source235-242-author/source235-242-author.json` | `2ae508613059a9c2601c3e2ab975282243c5a54ed928a8d6a940bd9024112fd3` |
| `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source235-242-author/source235-242-author.md` | `0de3fd9861dbf948f95d45aaafcde6214742f6003f72ee0950f4ca9039de58dd` |

The JSON report contains exact compared fields, source image binding, instruction
hashes, protocol order, and operation restrictions. All expected inputs were checked
before and after generation. `report-hashes.json` binds JSON, Markdown, and local
evidence files without copying source pages or returning image payloads.
