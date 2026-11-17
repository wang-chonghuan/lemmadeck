# Authorized Harness Correction Before First Actual Browser Observation

This is the one corrected copy and one subsequent execution explicitly authorized by the user.
The original harness, original receipts and retained historical FAIL/UNKNOWN remain untouched.
The original parse failure launched no browser and consumed zero images; current batch0/8 and
lifetime0/24 continue without reset.

The inherited input-freeze.json is copied exactly, not regenerated:
14066 bytes, SHA256 c4a3105e5d9b26e1d2969aacf8a70373e6148b85e1afd3f4571690859ea9e8d4.
All six inputs are copied only from its already-frozen snapshot paths using COPYFILE_EXCL;
copy-bindings.json records inherited expected hashes and exact destination bytes/hashes.
No original lesson/HTML/source input is re-frozen, regenerated or edited.

The original browser-check.mjs is copied exactly before apply_patch:
14853 bytes, SHA256 2c951446f6d639106f7c6cadad4dc5d5778803e516144d61edcdc5b346230d38.
The actual /usr/bin/diff -u invocation and complete raw stdout/stderr are captured before
the browser command; diff exit1 means differences were found, not an acceptance failure.

Corrections derive from the user's diagnosis of the existing renderer contract:

1. Remove the duplicate const require declaration inside the same try block. Reuse its earlier
   declaration; keep the independent finally-block declaration. This repairs script syntax only.
2. The renderer intentionally constrains .nb to max-width100% with overflow-x:auto. Validate the
   containing wrapper inside the page and positive formula content, not an unscrollable inner
   KaTeX width. For every native overflowing .nb, capture start and saturated end, assert exact
   attained clamped end, record the integer client/scroll-width rounding difference, assert zero
   reset and no page overflow in all states. Visual acceptance still requires actual endpoint
   images; DOM reachability does not prove visible readability or absence of clipping/overlap.
3. Intrinsic KaTeX SVGs, such as underbrace/square-root shapes, are mathematical rendering, not
   invented instructional figures. Count figures/media/images/SVG only outside .katex and retain
   the intrinsic SVG count separately.
4. Keep all other zero-exercise/input/choice/figure, remote/script/error/font, paragraph count,
   section index/border, no-indent, positive geometry and vertical-order assertions.
5. Capture full-page native evidence plus native overflow endpoints in the same sole browser
   command. Choose at most eight native image projections after observing dimensions but before
   opening any image. Native pixel crops and contact sheets may combine the two empty exercise
   surfaces and formula endpoints without resizing. Return UNKNOWN if full usable coverage
   requires more than eight image loads. Count every crop/reopen actually loaded.

No additional library documentation, installations, content/text/source/math review, p2c,
prose_flow CLI, app/server, Git/backend/setup/refresh, DB/schema/Charter/publisher or answer
operations are authorized here. Any actual browser assertion failure is a stop: capture it,
close all browsers/contexts, and preserve the one result without correction or retry.
