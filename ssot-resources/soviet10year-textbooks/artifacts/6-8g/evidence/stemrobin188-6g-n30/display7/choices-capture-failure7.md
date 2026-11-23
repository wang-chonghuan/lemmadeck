# Choices Capture Failure

Actual command: `node .intentfold/tickets/STEMROBIN-188/tmp/display-n30-7.mjs --choices-only`.
Execution cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Exit code: 1.

```text
page.screenshot: Clipped area is either empty or outside the resulting image
at display-n30-7.mjs:109:20
```

The first capture incorrectly omitted `fullPage` when passing a clip. Two partial
files, `choices-1440.png` and `choices-390-part1.png`, remain untouched; neither was
visually reviewed or accepted as display evidence. No `choices.json` was produced.
The failed script is preserved as `display-n30-before-clipping-repair7.mjs`.

Context7's official Playwright source confirms that `fullPage: true` bounds clips
against the document rather than the viewport. Recovery changes only this capture
option and uses new `-recovery1` filenames. Seed, draft, review, retained questions,
previous text/answer display evidence and image load counts remain unchanged.
