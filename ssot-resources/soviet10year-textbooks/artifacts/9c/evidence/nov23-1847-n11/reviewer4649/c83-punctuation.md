# STEMROBIN-184: C83-punct single-crop source observation

Date: 2026-11-23. Sole working directory:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
Scope: only the punctuation immediately after `比赛` in exercise 83 on
physical 0048 / printed 41.
Parent-supplied candidate location: `p0048#6`,
JSON pointer `/blocks/5/lines/0`.

## Source-supported reading

**RESOLVED / PASS: the source punctuation is comma `，`, not semicolon `；`.**

In the one local crop, the mark immediately following `赛` is a single
low-positioned ink mark with a short descending tail. There is no separate
upper dot above it: the area where a semicolon's upper point would be is blank.
The adjacent `赛` and `抽` establish the precise location of the punctuation.
This reading is based on the mark's visible shape, not on the preferred
punctuation of the sentence.

The local span is therefore `比赛，抽签`. The candidate comma reported in
the completed comparison matches these pixels. The initial source freeze's
semicolon reading was a reviewer transcription error.
This addendum resolves only C83-punct; the original freeze and completed
comparison remain unchanged and retain their original observations/HOLD.
No candidate was reopened or edited during this source-pixel task.

## Bound original and the single crop

Original:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n11-nov23-source4651/prepared/9c/pages/0048/page.png`

Original SHA-256:
`615a2e66ee1f30e7511a2ba6a70388413d897be05c25626f650306335005d0fd`.

New crop:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n11/reviewer4649/c83-crop1.png`

Crop SHA-256:
`a0f6cd6737a56e2cda430b7743e50e69438a3314f2aa0cb2850ad84f11aa2bc9`.

Precisely local rectangle in the original's top-left coordinate system:
x=675, y=1500, width=255, height=110 pixels.
The output was neither resized, sharpened, thresholded, nor annotated.
It was visually opened exactly once; no full-page or crop reopening occurred.

Successful command, executed from the sole working directory:

```sh
sips --cropToHeightWidth 110 255 --cropOffset 1500 675 .tmp/stemrobin-184-six/n11-nov23-source4651/prepared/9c/pages/0048/page.png --out ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n11/reviewer4649/c83-crop1.png
```

Exit status: 0. Output named the original and new crop paths above.
There was no helper execution failure in this task.

## Preservation

Before and after crop observation, the original hash and the following prior
reviewer hashes agreed. None of these files was edited:

| Prior file in this reviewer directory | SHA-256 |
| --- | --- |
| `source-first.md` | `3fa8125174a9aea6b084084675692362e4a87fdb9e155e7422e87bd6340ee6f1` |
| `source-math.md` | `b14c6f6a521efdd266eb90252d8a138f59a0cd1cbf6b5124e14dec850b7c29fc` |
| `u84-glyph.md` | `c0166792dcbf4be992676f987e23cbcdc3c9746e717d94c6d07e6934829112d5` |
| `source-comparison.md` | `aae210a50e96b0fdf36230b43dc574a3769fdebf86b5030e5c62555d8afefefa` |

Underline printed-versus-added provenance remains **UNKNOWN**.
This task does not inspect that mark, remove any attribution, edit notes/body,
or authorize an exclusion. All other previous findings and first failures
remain unchanged.

## Exact final image accounting and stop

- Initial original openings: 4, one each of 0046-0049.
- U84-only local opening: 1.
- Completed candidate comparison local openings: 2.
- This C83-only local opening: exactly 1.

**Actual cumulative total: exactly 8 images (4 + 1 + 2 + 1).**
No other image was loaded. The cumulative allowance is exhausted.

No full-page/crop reopen, source or mathematical solving, candidate/source edit,
finalizer/count replay, erratum registration, Git, DB, `.env`, app, dependency,
browser, external historical check, or other-agent operation occurred.
Only this new report and the single authorized crop were added.
Stop after this C83 observation.
