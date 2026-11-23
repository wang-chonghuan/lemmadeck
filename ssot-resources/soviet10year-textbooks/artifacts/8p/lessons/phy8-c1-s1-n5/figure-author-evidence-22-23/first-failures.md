# Preserved first failures

No review or promotion verdict is recorded here.

## Figure 23: first render failure

The first draft validator exited 0. The first JSXGraph render exited 2:
`vector-text-label`, text `a` with a combining vector accent, CENTER placement,
stroke-collision score 10000. All three display-size checks passed.

The first spec, SVG, generated but never loaded preview, report and log remain:
`fig-23.first.spec.json`, `fig-23.first.svg`, `fig-23.first.preview.png`,
`fig-23.first.render.json`, `fig-23.render.first.log`.

Minimal repair 1 moved only the vector text anchor from [373,403] to [345,405].
Validation and render then exited 0. Its bytes remain in
`fig-23.repair1.spec.json`, `fig-23.repair1.svg`,
`fig-23.repair1.preview.png`, `fig-23.repair1.render.json`, and its logs.
The repair1 report originally named the mutable fig-23.spec.json; its exact
spec hash dc39abb05fc7c6e5bddb953c6f347f369a2a192807b185adab91bab424eba207
is now retained unchanged as fig-23.repair1.spec.json.
Neither of these previews was loaded.

## Figure 22: first actual preview failure

The first validator and renderer exited 0, with no reported label collisions.
That mechanical result did not establish visual usability.

Image load 3/4 opened only fig-22.first.preview.png. It actually showed
missing-glyph boxes instead of combining vector accents in all vector labels.
It also showed interference between the corrected upward outlined c head and
the nearby downward -b head in panel (a). This is a genuine author-observed
first-preview failure, not an independent review.

First-preview PNG SHA-256:
2685a027751d5d0d42a01e53608566b5c87bd15890ae3f82540e7e6128e89611.
The first spec, SVG, preview, mechanically passing report and log are retained
without rewriting their results.

Minimal local repair: use bold-vector letter notation in the fixed existing
renderer font instead of unsupported combining accents. Source vector
identities/equations remain. Move only the already right-offset -b copy and
its label 20 canvas pixels farther right in panel (a), with the corresponding
two offset assertions updated. Vector displacements, all givens, the c arrow,
panel (b), and raw pixels are unchanged. This is declared display spacing,
not a source-coordinate given or another mathematical correction.

The same known unsupported accent is removed from figure 23's vector label
before its sole preview load, without changing geometry.

## Current authority rebind

The parent updated the template during this batch. Earlier template SHA-256
71e7685ee56dc56a9a1314ce085959c647120ea6dbe3b0105e8ae4d7b62343b1
is historical, not the final authority binding.

Current template SHA-256:
0d64d52579593024087aec5f033d4a429e63075c1297bcf1913fc967788f6ef5.
Its lesson.prose[29] and official p0031-fig22a-arrow.corrected text now
equal the complete paragraph already carried in figure 22's first spec.
The final description binds the current template, official target, source
block and source page JSON. No source image is reopened and no image budget
is reset. The affected rerenders are justified by real glyph/spacing changes,
not by redoing unchanged geometry for metadata alone.

The parent reports the p31 counter recovery is now 15/15 with no raw prose/crop
change. This author does not run or approve page finalize or modern publication.
