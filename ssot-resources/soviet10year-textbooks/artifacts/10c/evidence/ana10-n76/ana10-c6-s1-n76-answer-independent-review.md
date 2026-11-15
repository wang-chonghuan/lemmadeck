# n76 Independent Gate2 Comparison

2026-11-15. Parent reviewer, not the Ptolemy answer author.
Independent solutions were frozen before receiving the author draft in
`ana10-c6-s1-n76-answer-source-first.md`. The whole draft was inspected
against those solutions before the continuation checkpoint; this record
completes that comparison, without solving or reviewing the same unit again.

## Result: PASS

All17 source exercises15-31 and all20 requested quantities are present
exactly once, in order. The modern prompt and inherited source identity
match the reviewed source/modern exercises. No exercise references a figure;
the body sine example is not an input to any of these exercises.

| Exercise | Concrete independent comparison |
| --- | --- |
|15|Negative cosine derivative and factor1.3 agree: `-1.3 sin x`.|
|16|Both the outer3 and inner2.3 are applied: `-6.9 sin(2.3x-10pi)`. The displayed periodic equivalent is correct.|
|17|The constant2pi vanishes and the nested negative signs yield `-0.5 sin x`.|
|18|Polynomial term `4x` and chain term `+150 sin(5x+6)` both agree.|
|19|`2 sin(x-pi)+4 cos(2x)` and the displayed `-2 sin x+4 cos(2x)` are equivalent.|
|20|The constant tangent term vanishes; `10/cos^2(2x+3)` agrees. Excluded points are `pi/4-3/2+k*pi/2`.|
|21|`6/cos^2(2x+1)` and exclusions `pi/4-1/2+k*pi/2` agree.|
|22|The original quotient simplifies only on its original domain; `18/cos^2(6x+3)` and exclusions `pi/12-1/2+k*pi/6` agree.|
|23|Addition formula gives `sin(3u)`; derivative `3 cos(3u)` uses the correct variable u.|
|24|The constant angle coefficients reduce to1 and0; derivative `-3 sin(3t)` agrees.|
|25|Cotangent derivative includes its negative sign and inner2: `-8/sin^2(2t+3)`. Exclusions `-3/2+k*pi/2` agree.|
|26|`-14/sin^2(2x-2pi)` agrees, with exclusions `k*pi/2` retained after periodic simplification.|
|27|The two given angles sum to3x, so `3 cos(3x)` agrees.|
|28|The difference is x-5x, not5x-x; `-4 cos(4x)` agrees.|
|29a/b|Points `(-pi,0)` and `(pi/2,1)`, slopes-1 and0, and full lines `y=-x-pi` and `y=1` agree.|
|30a/b|Points `(-pi/2,0)` and `(2pi,1)`, slopes1 and0, and full lines `y=x+pi/2` and `y=1` agree.|
|31a/b|Points `(0,0)` and `(pi/4,1)`, slopes1 and2, and full lines `y=x` and `y=2x+1-pi/2` agree. Both input points are in the original tangent domain.|

Every tangent exercise has two separately labelled parts. The `a) y =`
and `b) y =` labels explicitly request right-hand-side expressions;
`expected` contains just that expression, not an implicit equation or prose.
`displayAnswer` supplies the full equations, point values, slopes and
construction by the tangent formula. Derivative solutions include their
calculation and domain, not merely an answer string. No excluded pole is
silently restored by simplification.

All17 `source: derived` declarations are honest: no book-answer file was
supplied or consulted. There is no `bookRaw` to accept without checking.
All20 parts use `expression`; the requested outputs are deterministic
derivatives or tangent right-hand sides, not proofs or open drawings.
Automatic grading covers the final expression only, not the explanation or
domain prose. This limitation is explicit and does not omit the complete
standard solution. No `exact` part exists and no MathLive/browser-input
proof is claimed. Author CE20/20 parsing evidence is reused as parsing
evidence only; it did not decide this independent mathematical result.

## Binding and Promotion Boundary

- Reviewed answer draft SHA-256:
  `6fb16ac8189de3590f2b6c162adbc5aa0ee7deacb1574434597b168581d3a7ef`.
- Reviewed modern exercises SHA-256:
  `5d27dc8feae4917f33bf52dbf648a274f8983e8c0ed598c6eb08d2fe7da461cd`.
- Reviewed modern lesson SHA-256:
  `9c55c8f125f074fa6b8d82e8b2850e0391f6264eee25791a3b1a215da86e907c`.
- The pending modern figure/finalize may change layout/status but must
  preserve all ordered task functions, common headings and abscissae.
  Promotion is permitted only after that equality is recorded.

No draft repair was required. Approved answer bytes may be promoted after
modern finalization, then finalized once by the existing answer tool.
This report is not a claim of publication, DB judging or completed choices.

## Finalization and Punctuation-Only Display Repair

Modern finalize passed; all17 exercise objects were strictly equal to the
reviewed template before any display repair. Answer draft bytes were then
promoted and finalized once: auto17/ungraded0.

Actual desktop/mobile screenshots exposed duplicated exercise numbers:
the source prefix's U+FF0E was not recognized by the existing offline
renderer, which also displays the stable exercise number. The only repair
changes that leading period to ASCII dot in all17 exercise texts/matching
lines, and in the17 answer `prompt` metadata strings. Restoring only those
periods makes the complete structured documents deeply equal to the
approved originals; every expected/displayAnswer/domain/label/key remains
identical. Initial files/reports/screenshots are preserved under
`ana10-n76-prefix-initial/`. Modern finalize and the answer tool's current
metadata binding passed; no mathematics was solved or reviewed again.

Only affected exercise display was rerun, at1440x960 and390x844, PASS.
Both new full screenshots were actually opened: no duplicate prefixes,
missing task or overlapping/blank content. Prior body display is unchanged
and reused. The long complete formulas in existing scroll containers were
separately checked for actual end reachability: three mobile body formulas
reach202/118/152px scroll ends, and exercise27 reaches92px. Both mobile
tail screenshots were actually opened; all terminal expressions are visible.
No formula was split, shortened or corrected to conceal overflow.

The current offline media is640px on desktop and358px on mobile; figure
labels are44px and24.6125px, respectively, not the nominal viewport width.
These current lesson observations complete the pending figure display gate.
Standard answers are finalized, but n76 choices remain independently
authored/reviewed separately; this is not a completed lesson count yet.
