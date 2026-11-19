# B94 Prose Layout Repair

2026-11-19. Offline STEMROBIN-180 scope only; no app, dependencies, DB, publishing or deployment.

The independent n94 TEXT reviewer correctly identified two production normalizer
gaps. ASCII sentence periods did not produce sentence boundaries. Closing bold
delimiters after an introduction colon hid the following formula from both the
colon and trailing-comma rules. The original TEXT REVISE and narrow adjudication
remain immutable. Their semantic comparison of all 14 objects and eight tasks is
reused; no scientific, numerical or exercise revision is involved.

The narrow patch adds ASCII period boundaries outside protected math and
parentheses, excluding decimal points and ellipsis runs. The introduction and
formula-leading checks recognize an intervening emphasis marker. No source text,
mathematical expression, unit, numeric value or emphasis marker is substituted.
Existing recovered changes in `edition.py` remain intact.

Focused verification is recorded in `tmp/resume-180-4/commands/`:

- `b94-prose-layout-focused-1`: technical import failure, wrong Python lacked PIL.
- `b94-prose-layout-focused-2`: six passing cases and two genuine formula-layout
  and idempotence failures, preserved before the final narrow correction.
- `b94-prose-layout-focused-3`: all eight contract cases pass in the existing
  lesson virtual environment; no dependency installation.

Actual affected candidates cover n92 five, n93 six and n94 six prose objects.
Every changed object retains the same non-whitespace tokens, math signature,
number signature and source identity. Normalization is idempotent on all changed
objects, and authoritative prose-flow/section-break parsing passes. These are
candidate layout facts, not independent approval or final DISPLAY evidence.
The new bounded independent review is pending.

The previous production code is frozen once under
`tmp/resume-180-4/prose-layout-fix/edition.py.baseline`. The narrow patch and exact
before/normalized lesson snapshots are bound by `affected-manifest.json`,
SHA-256 `1aa1bc756e34c1b184fc2fab4ba4dbf4d8cf7841ad7ebb18abf876b4ad7bb8b7`.
Only these three affected lessons are being normalized. Their canonical lesson
files and existing choice snapshots have not yet been replaced.

The original counter and printed-page table tests remain reused, not rerun.
No new parent images or paid calls. Full-project checks stay at formal handoff.
