# KaTeX Stdin UTF-8 Repair

2026-11-16. During the first through200 assembly, old p0184#9 produced two
unknownSymbol warnings for U+FFFD, while the through194 assembly of the same
source produced none. Both source page JSON and assembled c5-s1 lesson JSON
are byte-identical across canonical/through194/through200, with no U+FFFD:

- p0184 page.json: `33e2b188a256994b0f607b759c43e9d2953c0361b68e2794ee0901bc14ab6bc2`.
- c5-s1 raw lesson.json: `36f529870a3644bfb9cad4f1b1d9db3c46b69cac652d6c841a849d50765f1588`.

The input reader in `katex_check.js` coerced each Buffer chunk separately to
a string. A multibyte Chinese character split between chunks became replacement
glyphs. The only production change sets stdin's existing stream encoding to
UTF-8 before its data handler, letting the stream decoder preserve split bytes.
It changes no formula, source, warning policy, KaTeX settings or dependency.

Focused command, once, exit0:

```text
node --test .claude/skills/ld-s10y-lesson/tests/katex-stdin.test.mjs
4 tests passed, 0 failed
```

Tests use the actual script and installed KaTeX with a real PassThrough stream:
byte-sized UTF-8 chunks preserve the exact formula without warnings; whole-buffer
input preserves the result contract; malformed JSON stays fatal; and removal
of the one-line fix deterministically reproduces U+FFFD and unknownSymbol.
The negative reproduction's console metric warnings are expected evidence,
not warnings produced by the corrected reader.

The existing Python mathcheck API was then invoked once for only p0184#9's
one affected formula. Actual result: ok=true, warnings=[], exit0. No full
assembly, source review, modern text review or display check was repeated.
The through200 audit retains its original four warnings as invocation facts:
two decoder artifacts plus the two genuine existing textcircled mode warnings
from p0196. The latter are outside this repair and remain disclosed.

Authors currently running isolated TEXT/source work were told the main tool
epoch changed. Captured historical hashes remain facts of their calls; nobody
was asked to rerun a gate to make an old hash equal the current tool.
