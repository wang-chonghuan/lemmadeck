# Figure2 Independent Output Review: PASS

2026-11-15. Parent non-author review. Source PNG was opened first and
its inventory frozen in `10c-fig02-independent-source.md`, before reading
the author spec or output. The three full-media previews below were
actually opened and visually inspected before the continuation checkpoint.
Those observations are reused, not replaced by the author report.

## Source and Visual Comparison

The current diagram retains one shared x/y frame, the0 label below/right
of the crossing, the negative trough, rising origin crossing, positive
crest and descending positive right end. Exactly two straight strokes are
visible: the origin diagonal and the crest horizontal. They intersect to
the left of the crest. The source's third prose-only tangent has not been
added. There are no extra point dots, ticks, pi values, numerical endpoints,
equation labels, construction guides or separate frames.

At640,346 and240 media widths, all three labels remain clear and wholly
inside the image; none of the axes, curve or tangent strokes disappear or
clip. The curve/tangent contacts and both lobes remain distinguishable.
The clean background/strokes are nonblank and no source Chinese caption,
Cyrillic, handwriting, old-book texture or cultural decoration survives.
The labels x/y/0 are the exact permitted mathematical labels. The example's
tangents are instructional body content, not added exercise-answer data.

The inline media maximum640 and equal coordinate scales match the current
offline media CSS. Render measurements are44/23.7875/16.5px for the three
widths; the author current-CSS display observation is also PASS. Its first
display assertion incorrectly required floating matrix equality; the
preserved first failure was repaired only in the diagnostic comparison,
without changing spec or SVG. No second geometry render was performed.

## Independent Curve Mathematics

`check-10c-fig02-independent.py` independently parses the current serialized
path, without using the author's `author-math.mjs` calculations.
All47 Bezier intervals have linear x parameter, sine endpoint values and
cosine endpoint slopes. Exact knots at `-pi/2,0,pi/2` have values `-1,0,1`
and both one-sided slopes `0,1,0`. Therefore the origin diagonal is exactly
tangent with slope1 and the crest horizontal is exactly tangent with
slope0. The segments lie on `y=x` and `y=1`; the hidden contact objects
remain invisible. They do not add source-visible points.

Cubic Hermite's remainder bound is `h^4/384` because the fourth sine
derivative has absolute value at most1. The largest h is0.12083669756410131,
giving coordinate error at most5.55218803739257e-7 and640px error at most
0.000052255887410753605px. This is not a merely similar-looking interpolation.
The SVG contains that identical path under equal positive scales
94.11764705882352, preserving exact tangency and aspect. Crop endpoints
[-2.7,2.9] are declared modern layout, not inferred source numerical data.

The independent check initially assumed a six-value SVG matrix; the actual
structured XML uses equivalent two-value `scale`. That failed diagnostic
script is retained separately. Only the diagnostic was corrected, not the
figure; its substantive endpoint/slope checks had already passed.

## Current Hashes

- Original:
  `1bf66c3d6aa81cc25d8ea816ce1b538a1e988057d13e3ccaed0415dc3927b8e6`.
- Spec:
  `a3855bd9e1aa5497ea62579ccca773844575243e857e89e4b7eeebf5817cf17e`.
- SVG:
  `c369a96747b906d217d713f529b88c6b181341ba0c87f8a2ab80a404353aba4f`.
- Render:
  `d412aed56c6e3cd2ff8b38a54370bf93880f9e7b5f25d6ae92906d17d5472f29`.
- Current-CSS display:
  `de1ef3c000c879b6b648904bcd3f8676bcf33b94bf12f79c816758a88dfc5778`.
- Opened640 preview:
  `be19764b62bd4dc7765bf4f212115bc2d8c7cb6d4548e532b621713ec22ac8ce`.
- Opened346 preview:
  `6ed0117312ad657b3f2f25052f34e09e2a02fdc5b8c8d51320bb21b113206ee3`.
- Opened240 preview:
  `51497993f2d15e1ee62f80e8ab8137a575ef53b9860b886b237e52e3301b817c`.

Source/current spec/output comparison and mathematical/cultural/readability
review PASS. Approve byte-identical spec/SVG promotion and path-only
render/review rebinding. The final n76 offline lesson display remains to
be checked once after adapt-finalize. No product UI, headed/OS behavior,
answer input, database, publishing or completed lesson claim is made here.
