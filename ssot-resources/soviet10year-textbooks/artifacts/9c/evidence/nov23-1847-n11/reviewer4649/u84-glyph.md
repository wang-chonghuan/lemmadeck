# STEMROBIN-184: U84-total targeted source observation

Date: 2026-11-23. Sole working directory:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
This is an additive resolution of U84-total only. The initial
`source-first.md` and `source-math.md` are retained unchanged.

## Bound source and local crop

Source:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n11-nov23-source4651/prepared/9c/pages/0048/page.png`

- Source dimensions: 1695 x 2381 pixels.
- Source SHA-256:
  `615a2e66ee1f30e7511a2ba6a70388413d897be05c25626f650306335005d0fd`.
- No full-page visual reopening occurred.

Crop:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n11/reviewer4649/u84-crop1.png`

- Precisely local source rectangle, top-left origin: x=490, y=1660,
  width=300, height=105 pixels.
- Output dimensions: 300 x 105 pixels; no resize, rotation, sharpening,
  threshold, or glyph reconstruction was applied.
- Crop SHA-256:
  `aad939ec38c82c275b199b702d74892854723843285f86e464856dcf8006b4aa`.
- This crops the exercise 84 span around `有 r 件，其中`; adjacent characters
  identify the location without providing an expected mathematical answer.
- Visually opened exactly once.

The successful crop command, from the sole working directory, was:

```sh
sips --cropToHeightWidth 105 300 --cropOffset 1660 490 .tmp/stemrobin-184-six/n11-nov23-source4651/prepared/9c/pages/0048/page.png --out ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n11/reviewer4649/u84-crop1.png
```

Exit status: 0. Output named the source and crop paths above.
The installed `sips --man` states that crop offsets are from the top-left
corner. Metadata queries confirmed the source and output dimensions.

## Shape-supported conclusion

**RESOLVED: the printed total-count letter is lowercase italic `r`, not `n`.**

In the local crop, the glyph between `有` and `件` has one slanted stem
and a short upper-right shoulder/terminal. It does not have an arch ending
in a second descending right stem, which would distinguish italic `n`.
The small right shoulder is now visible separately from the stem at the
crop's natural resolution; the neighbouring Chinese characters do not
overlap it.

This direct local shape is diagnostic. No second crop or separate same-page
letter comparator was needed or opened. No author candidate, mathematical
formula, answer, or desired hypergeometric result was consulted to select
the glyph.

Only the initial uncertainty U84-total is superseded by this observation:
the source span can be read `一批产品有r件`. This is an observation addendum,
not a rewrite of the initial freeze or a canonical source edit.

## Preserved helper execution failure

Before choosing the installed crop tool, the availability probe
`command -v magick` returned exit status **1**, with empty stdout and no
reported stderr. ImageMagick was unavailable; no ImageMagick crop was
attempted. The failure is retained here rather than represented as a
successful image operation. No dependency was installed or changed.
The subsequent `sips` crop succeeded as recorded above.

## Preservation and actual image accounting

Hash checks before cropping and after observation agree:

- `source-first.md`:
  `3fa8125174a9aea6b084084675692362e4a87fdb9e155e7422e87bd6340ee6f1`.
- `source-math.md`:
  `b14c6f6a521efdd266eb90252d8a138f59a0cd1cbf6b5124e14dec850b7c29fc`.
- Prepared 0048 original: source hash recorded above.

Initial image opens: **4** (0046-0049, each exactly once).
This targeted continuation: **1** local crop open.
**Actual cumulative image total: 5.** The allowed second crop was unused.
No full pages, other images, author candidates, or external historical material
were visually opened or read for this observation.

No source edits, finalization, recount, erratum registration, Git, DB, `.env`,
app, dependency, browser, network, or other-agent operation was performed.
M46-decimal and all other initial observations remain unchanged.

U84-only observation ends here. A separately authorized comparison must follow
this completed record, not be used retroactively to justify its glyph reading.
