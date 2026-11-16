# fig30/31 final immutable author handoff

Frozen after the parent-authorized preview-count diagnostic on 2026-11-16. Author evidence only: parent has NOT yet performed or granted its unique independent semantic/full-visual approval. No review@1, promotion or manifest change exists from this author.

## Exact outcome and cause

- Both existing deterministic renderer reports remain `status: pass`, actual exit0. Each figure had one failed pre-browser draft-validation call followed by the sole objectCount-field repair and one actual browser render. Repair1 is used; no further figure repair occurred.
- Both first width-specific preview FAIL reports remain unchanged, including their exact error arrays and all screenshot measurements. The original preview script execution really exited2; that result is not rewritten as a successful full run.
- Root cause is **numeric `render.labels` incorrectly read as `render.labels.length`**, giving undefined. The actual render JSON fields are numbers10 and7, not label arrays.
- `labelMeasurements` is ABSENT in both actual renderer reports. This is not anonymous/empty measurement records inflating a count.
- Actual SVG text records: fig30=10, fig31=7; empty records=0 for each; anonymous nonempty labels=0 for each. Source-authored nonempty expected labels, actual SVG labels and both retained measured screenshot label lists match exactly by stable ID and text.
- Therefore no missing-label BLOCKED finding exists. This diagnostic result does not approve the figures' mathematical interpretation or visual fidelity.

## Sole script repair and preservation

Changed ONLY `.tmp/s10y-image/9-10g/fig-30/author-previews.mjs` label-count derivation/checks:

- Derive expected nonempty labels from the actual authored object label/text fields.
- Reject an empty expected set, duplicate IDs, or nonpositive/noninteger numeric renderer count.
- Filter actual measured SVG text to real nonempty text, reject empty measured sets and anonymous nonempty labels.
- Compare measured count to numeric `render.labels`, and compare complete stable ID/text sequences to the authored nonempty sequence.
- Existing width/font/clipping checks, screenshot generation, SVG loading, renderer, and all figure specs were unchanged.

Full old script retained at `fig-30/preview-check-initial/author-previews.mjs`.
Full old FAIL reports retained both at their original locations and at each figure's `preview-check-initial/author-preview-report.json`. Original screenshots and earlier author-handoff files remain unchanged.

Old script SHA-256: `f90bede3edaf63eaaff27bfbdfd59a6b89516a53074b77f9da641892c09f6596`.
Patched script SHA-256: `b4d091f4c5db838a599b6afcc896da54e802ae2436eadee64714adaf49cc615a`.

## Checks actually performed for this diagnostic

1. Actual renderer JSON field inspection: confirmed numeric10/7 and absent labelMeasurements.
2. `node --check .../fig-30/author-previews.mjs`: exit0, syntax-only; no script execution/browser.
3. Affected-only offline JSON/XML/byte-hash check: exit0. Derived the true nonempty expected labels, verified every stable ID/text against the existing exact SVG and both measured screenshot records, enforced nonempty/unique/nonanonymous/count guards, and confirmed the preserved FAIL bytes.
4. Same-SVG provenance check: current spec hash equals render.spec and the original preview report's bound spec hash; current SVG hash equals render.output.svg and the original preview report's bound SVG hash; each existing screenshot hash equals the retained original generation hash. Native screenshot hashes also remain equal to the original report. No screenshot was regenerated or reopened.

The patched browser-generating script was **not rerun**. No actual renderer, source-image observation, spec/mathematics check, geometry repair, or browser task was repeated. Existing whole-canvas/native240-neutral/346-print observations, font/clipping and nonblank evidence are reused from the earlier immutable author handoffs. Reported font minima remain44px/16.5px/23.7875px at640/240/346.

## Current immutable fig30 package

Root: `.tmp/s10y-image/9-10g/fig-30/`.

| File | SHA-256 |
| --- | --- |
| spec.json | `4a5ac5b02e4f1d57641fb32a553090cd9b55164e7b6866c19cafb5ea44a354df` |
| fig-30.svg | `610f84c105a971cf8782baeb98d90e5864d7cc4ca5f21b39e6f1c74a97e2d0c5` |
| fig-30.render.json | `88cb2f141088d2a9e0c47ff6a17ba6743e84bbdff53269d3da62243493cdf18f` |
| preview-native.png | `86addf1b05ba1881049981244b45335e2eccfbbae360b27e086df09ceb537a24` |
| preview-240-neutral.png | `a95ca901512c0bd19864ff913f2029d7548598cff7845dd57b46d736703eecbf` |
| preview-346-print.png | `c26d3b361f3c917d20ee7fcc1a1cb31375e632d8131670adf88427ed393844ad` |
| author-preview-report.json, retained FAIL | `593ffd4fc06a9786ac9ec578974d654e9a8346b54059c88279e1cf3960ba08cb` |
| author-handoff.md, unchanged original | `b6c5f840cca6b6a91477c3009f0769663609c551e16150bf586ee31e056c2f44` |

True labels in retained order: B1-label B₁; B-label B; M-label M; beta-name-label β; alpha-name-label α; a1-name-label a₁; b1-name-label b₁; a-name-label a; b-name-label b; c-name-label c.

## Current immutable fig31 package

Root: `.tmp/s10y-image/9-10g/fig-31/`.

| File | SHA-256 |
| --- | --- |
| spec.json | `f428ca5bbd92408d35b5f1c78e7e49e5672e9e23d0afc1cd12b1c5a5fdf3ba09` |
| fig-31.svg | `bd98da921a4c293f89e6fda60c5398812f01aa00dc8aac9559ca3d6d40934b44` |
| fig-31.render.json | `16c12782b0dc471f56fa4d9d51fb149d8dc3b3d79a6d73de178e0cffbca786d1` |
| preview-native.png | `94311f7c0705dd5f9984381c361e902dde902fd858daa0c5bf85be390b299b7b` |
| preview-240-neutral.png | `41561d937f55bc333e9b5bc9ddd51b7a707104e203308ad0ebe850ab4c64a991` |
| preview-346-print.png | `8435dbc68deb6f208d4be89c349d5e5ac4189b14488659766191ce483fa194cd` |
| author-preview-report.json, retained FAIL | `d87c18d4f195a9c9555cdfcc9ea85a72470fb095df8f0b837600c0490645d7f9` |
| author-handoff.md, unchanged original | `efeea7eaa39be8d482f4e05e2dbf2a5dcbb90901c9ce9a988760243ef78d2991` |

True labels in retained order: B1-label B₁; B-label B; shared-plane-name-label α=β; a1-name-label a₁; b1-name-label b₁; a-name-label a; b-name-label b.

## Browser and stop state

Both renderer browser instances and the initial preview browser were closed with awaited `browser.close()` in their finally paths. All exec sessions completed. This diagnostic launched NO browser and used no user window/profile/CDP/OS interaction.

Spec, SVG, renderer reports and screenshots are unchanged; no source, tool, index, answers, choices, DB, service, promotion or additional figure work occurred. No blocked21/26/27/29 or other old figure was touched. Parent's unique independent fig30/31 semantic and full visual gate remains pending. Author stopped.
