# STEMROBIN-184 Affected Formula Scroll-End Observation

Date: 2026-11-17. Observer: Session B. Bounded three-image observation complete; WAIT.

## Visible Result

All three specifically affected formula endings are visible in their supplied local scroll-end screenshots:

- n102 derivative: final f(x) and the following full stop.
- n103 velocity: final v_0+a(t-t_0), including the closing parenthesis; its semicolon remains visible on a separate following line.
- n103 coordinate: final quadratic term a/2 times (t-t_0)^2, including its exponent and the following full stop.

No overlap involving the three target formula tails, adjacent prose or displayed punctuation was observed. The velocity closing parenthesis is close to the right image edge but discernible.

This demonstrates the target end visibility in the existing scroll-end captures, not simultaneous full-formula fit at 390 pixels. The formula beginning can be outside the left edge once its own container is scrolled right. Neighboring containers in the same screenshot may remain at their initial position; their start-view truncation is not a new target finding.

The prior eight start screenshots and their observations remain historical and unchanged. Their observed start-view tail truncation is compatible with these new end-reachability views. No source, content, HTML or renderer change was made, and no browser/check was rerun by this observer.

## Report Read Before Loading

The full supplied report was read before any new image open:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c102-103/formula-scroll-affected/report.json`

SHA-256: `5b8207340479d814a3b8e042c9b8904882e59af18927ff52116b4ad85204465f`

Existing observation timestamp: 2026-11-17T03:17:11.493Z. Existing reported status: pass.

Its recorded scope is the three affected formula containers, unchanged HTML, 390 x 844 isolated headless read-only scroll reachability. Each recorded overflow-x is auto; scrollLeft equals maxScrollLeft:

| Target | Client Width | Scroll Width | scrollLeft / maxScrollLeft | Recorded Tail Right After | Recorded Container Right |
|---|---:|---:|---:|---:|---:|
| n102 derivative | 358 | 460 | 102 / 102 | 356.734375 | 374 |
| n103 velocity | 358 | 509 | 151 / 151 | 374.453125 | 374 |
| n103 coordinate | 358 | 515 | 157 / 157 | 356.9375 | 374 |

These are supplied report measurements, not measurements rerun here. The velocity tail bounding value is 0.453125 pixels beyond the recorded right boundary; the actual terminal parenthesis is visually discernible at the image's right edge. This observation does not claim perfect fractional bounding-box containment or invent a new tolerance.

Report-bound unchanged HTML SHA-256 values:

- n102: `0f7a6b312f0fdb0ad0aa83868b08de052706cd15c5be9181b9255551cedf4c37`
- n103: `85c2a67476719998dcc3de0150f18f56951f0863bcbfa68eb3b12f4c001b561c`

These HTML files were not reread, changed or rendered by this observer.

## Three Original Image Observations

### 1. n102 Derivative End

Path:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c102-103/formula-scroll-affected/n102-derivative-end.png`

Original dimensions: 358 x 137 pixels; 12873 bytes.
SHA-256: `4b648b121a173b8d06f45c4c1ae3c9742e9a91cc2cc48b63afdba8ca0112b77c`

Loaded once with functions.view_image detail=original, after its dimensions and matching SHA-256 were recorded.

The proof introduction, preceding shorter integral identity and the word "因此" remain visible above the scrolled target row. In the target row, the ending

```latex
=[F(x)-F(a)]'=F'(x)-[F(a)]'=f(x)
```

is visible through the full final f(x) and the following full stop. The opening derivative expression is outside the left edge at this scroll-end position, as expected. No target-tail clipping, punctuation clipping or overlap with the prose above was observed.

### 2. n103 Velocity End

Path:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c102-103/formula-scroll-affected/n103-velocity-end.png`

Original dimensions: 358 x 176 pixels; 17156 bytes.
SHA-256: `cf84f3b31c142be6a96f80de6b085b7f04ea62608bfad41456003f13981cc85a`

Loaded once with functions.view_image detail=original, after its dimensions and matching SHA-256 were recorded.

The worked velocity introduction is visible above the target row. The scrolled row includes the ending

```latex
=v_0+at-at_0=v_0+a(t-t_0)
```

with the final compact expression and its closing parenthesis discernible at the right edge. The semicolon is visible on its own following line, above the coordinate introduction. No overlap between the formula, semicolon or neighboring prose was observed.

The coordinate row below is still at its own start position and its right tail is not visible in this image; that row's end is observed separately in image 3. No claim is made that both full formulas fit simultaneously.

### 3. n103 Coordinate End

Path:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c102-103/formula-scroll-affected/n103-coordinate-end.png`

Original dimensions: 358 x 176 pixels; 17341 bytes.
SHA-256: `0590e744d07e127cf39edac238f6d6ebb55162f8730a5105f66006c4f1e69037`

Loaded once with functions.view_image detail=original, after its dimensions and matching SHA-256 were recorded.

The coordinate introduction is visible above its target row. The scrolled ending includes

```latex
=x_0+v_0(t-t_0)+\frac{a}{2}(t-t_0)^2
```

with the entire final fractional coefficient, parenthesized time difference, exponent 2 and following full stop visible. No target-tail clipping or overlap with adjacent prose was observed.

The velocity row above remains at its own initial position in this image and therefore does not show its own tail. Its end was observed separately in image 2. This confirms independent local container states, not a change to the formula content.

## Load Ledger and Scope Boundary

Load ledger:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c102-103/formula-scroll-affected/load-ledger.md`

The ledger was first written with original dimensions, SHA-256 bindings and zero new opens before loading, then additively updated after the three actual opens. The original PNG bytes were checked against the supplied report. No earlier screenshot was reopened, and no image was cropped, resized, composited, regenerated or otherwise changed.

Assignment image use: 3/3. Permanent lifetime use: 8 before, 11 after, limit 24, remaining 13. Text/path/hash only is returned to the parent; no image payloads.

Only the assigned new observation.md and load-ledger.md files were written. The existing report, PNGs, prior evidence and peer work were preserved. No browser/check rerun, DB, content, renderer, tests, Git or key operation was performed.

This is affected-only observation of already-produced isolated headless evidence, not actual product/OS behavior, an independent reachability run, simultaneous full-formula fit, a content/math review, a repair or approval.

WAIT.
