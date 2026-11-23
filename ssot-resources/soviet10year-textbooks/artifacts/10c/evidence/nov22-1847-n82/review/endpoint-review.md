# STEMROBIN-184-7 / n82: affected mobile formula endpoint completion

Date: 2026-11-23, Europe/Dublin.
Same independent review; continuation of the two local display HOLD items only.
Endpoint verdict: PASS for both formulas.
Combined required offline display verdict: PASS, reusing the earlier passed
surfaces and resolving only their two held mobile prose formula endpoints.
Review scope is complete; no further gate or repeat is requested.

Only workdir:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
Only new write: this file in the existing review directory.
No source/view/six-screenshot/isolated-figure reopen, rerender, content review,
mathematical review, figure review, browser launch, live product repeat, DB,
network, dependency, keyboard action, peer message or canonical modification.
Reviewer elapsed time: UNKNOWN. Reviewer model cost: UNKNOWN.
Report hidden raster costs: UNKNOWN. Parent browser is recorded closed.

## Preserved history

Original `display-review.md`, accepted SHA-256:
`d3e63f77c93b63a221a6ec318e6d83a2c53a34e6fd23e1a6202970ee92220188`.
That LOCAL HOLD record was not reopened or rewritten.
It correctly recorded that the then-supplied mobile capture did not establish
the two long formula right ends. This supplement supplies the missing evidence;
it does not recast the original evidence as a full PASS.
Unchanged source/figure/choice/proof reviews remain intact.

## Actual bindings

Evidence directory relative to the sole workdir:
`ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov22-1847-n82/display-endpoints/`

| File | Actual-byte SHA-256 |
| --- | --- |
| `report.json` | `473609edc5cbfd9b4bd4198ea45a018d749345082e7eed31742dbfff430b44a2` |
| `components-right-end.png` | `d45dc31573a582f177dbbf271dda3bd3aa7a71a13358ca5e0ee7279b0ff027d3` |
| `derivative-sum-right-end.png` | `3d305e5a7894e575540b7a1a38d2f128250fa2caa6a35c3f1d6188e027305717` |

Both actual screenshot hashes match the report.
The actual retained HTML file
`ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov22-1847-n82/display/text.html`
hashes to
`6f995e7bda8a70d53217f28446f4396bf732561e2b9434c37f01374c11f283f6`.
This matches both the endpoint report and the original complete-display HTML
binding. It was hashed only, not reopened as a rendered page or read for a new
content review.

The report's capture scope is exactly the two held endpoints at viewport
390 x 844, without HTML/CSS/content changes. Its status was
`PASS_VISUAL_ENDPOINT_REVIEW_PENDING`; `browserClosed` is true.
Reported TeX strings before and after scrolling are identical for each formula.

## Image ledger

Previous cumulative count: 10.
This batch: 2, each specified endpoint image actually opened ONCE.
Cumulative: 12/24; batch 2/8.
No other image or ROI loaded. No count reset through waiting or compression.

## components endpoint: PASS

Actually visible in `components-right-end.png`:
the second function's `f2(t) = A2*cos(omega*t + phi2)` reaches its final
phi2, closing parenthesis and punctuation. The glyphs are readable and
the right tail is inside the displayed formula frame.

The unchanged complete TeX reported for this scroll container is:

```tex
f_1(t)=A_1\cos(\omega t+\varphi_1),\ f_2(t)=A_2\cos(\omega t+\varphi_2)
```

Native wheel scrolling is recorded. Client width is 358, scroll width 406,
and the achieved scrollLeft 48 equals the measured end 48.
The report gives frameRight 374, formulaRight 357.4375, tailInside true.
Thus the previously missing phase/closing parenthesis is accessible on the
unchanged 390px native surface, not recovered by shrinking text or altering TeX.

## derivative-sum endpoint: PASS

Actually visible in `derivative-sum-right-end.png`:
the factorized `-k[f1(t)+f2(t)]` closes its bracket and is followed by the
final equality `=-k f(t)` with the closing parenthesis and punctuation.
The tail is readable, without overlap or right-edge truncation.

The unchanged complete TeX reported for this scroll container is:

```tex
f''(t)=f_1''(t)+f_2''(t)=-kf_1(t)-kf_2(t)=-k[f_1(t)+f_2(t)]=-kf(t)
```

Native wheel scrolling is recorded. Client width is 358, scroll width 585,
and achieved scrollLeft 227 equals the measured end 227.
The report gives frameRight 374, formulaRight 357.328125, tailInside true.
This supplies the specific right-end evidence missing from the original
left-position mobile prose capture.

## Scope and final disposition

The endpoint screenshots deliberately show right-scrolled formula containers,
so their leftmost portions are outside these particular slices. The earlier
display already established those left portions. Together with unchanged
HTML/TeX and measured native endpoint reachability, the evidence establishes
access to the complete formulas; no new HOLD is created for normal scrolling.

Both original LOCAL HOLD items are resolved. Earlier desktop, mobile written
task/proof, choice and fixed-width figure-scroll checks are reused, not rerun.
The single required affected complete offline display review is now PASS.
This is not a claim about live-product behavior, DB publication, keyboard or
grading, and no such repeat is required by this evidence-only assignment.
Original failure/history and frozen semantic reviews remain unmodified.
