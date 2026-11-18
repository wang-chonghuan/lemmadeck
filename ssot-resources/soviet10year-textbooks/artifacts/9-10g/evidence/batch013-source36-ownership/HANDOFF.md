# Source122 ownership repair candidate

Invocation: same184-3. Date: 2026-11-18.
Workspace: /Users/yong/.codex/worktrees/a07e/lemmadeck.
This is an author-side deterministic repair, not independent approval.
The parent arranges the separate affected-ownership gate.

## Exact changes

- `.claude/skills/ld-s10y-lesson/tools/layout.py`: add
  `figure_component_ownership`, applying explicitly authored, render-bound
  whole-component transfers to the existing `figure_ink` masks. Reject stale
  sources, partial/changed components, duplicate assignments, unknown/self
  owners, own-only/foreign transfers, shared strokes extending outside the
  receiver's original selection, clipped receiver crops, and lost ink.
- `.claude/skills/ld-s10y-lesson/tools/p2c.py`: use those masks before the
  unchanged duplicate-component gate; record exact transfers and resulting
  component counts in audit provenance. Invalid metadata exits 2 before
  writing crops or page outputs. Existing crop exclusion remains the owner.
- `.claude/skills/ld-s10y-lesson/tests/test_figure_component_ownership.py`:
  10 focused positive/negative contract tests.
- `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0122/page.md`:
  add only `figure_component_ownership` frontmatter: transfer the whole
  A component [916,938,22,31], 288 pixels, from133 to134; transfer the whole
  D component [929,795,24,30], 291 pixels, from134 to133.
- Same page's `page.json` and `audit.json`: produced by the single successful
  finalize; ownership-only changes. Text blocks, count, figure geometry,
  original roughboxes, source hashes and figure132 crop are unchanged.
- Only new scratch is under this sidecar. The original work122 crops remain
  untouched; corrected candidate crops are below `candidate-work/`.

## Evidence

`before/` preserves the existing failed audit/crops and first-failure receipts,
plus the two production code files. `changed/` preserves the code and changed
page.md immediately before the real finalize. No first failure was overwritten.
`preflight.json`, `postflight.json`, `finalize-result.json`, `finalize.stdout`,
`finalize.stderr`, and `files.sha256.json` hold command and ownership evidence.

Focused command:
`.claude/skills/ld-s10y-lesson/.venv/bin/python -m unittest discover -s .claude/skills/ld-s10y-lesson/tests -p test_figure_component_ownership.py -v`
Actual exit 0; 10 tests passed. Synthetic refinalization is byte-stable for
page.md, page.json, audit.json and both crops. The unresolved duplicate still
exits 1; bad component metadata exits 2 without output mutation.

One actual source122 finalize, using `--work` pointing at this sidecar:
exit 0; 13 blocks; printed19/MD19; 3 figures; 0 normalizations; 0 errors.
No repeated actual finalize or other pipeline stage was run.

Source assertions: exact independently selected own-component sets retained;
the complete original selected-ink union retained; zero double ownership;
every retained raw ink pixel value unchanged; figure133 11659 pixels /
10 components, figure134 8672 pixels / 8 components. Exact geometry and
roughbox reuse are stable. The two disjoint diagram cores are never modified.

## Candidates

- `candidate/source122/{page.md,page.json,audit.json}`
- `candidate-work/9-10g/pages/0122/figures/fig-133.png`
- `candidate-work/9-10g/pages/0122/figures/fig-134.png`

The manifest records full SHA-256 values for these candidates.

## Usage And Boundary

Images: 3/6 (one native source ROI, then one view of each corrected crop).
No reopens/contact sheets. Paid API calls: 0. No installs, web, environment,
database, Git, chats, descendants, messages, text retranscription, source
preparation, vectorization, assembly, adaptation, full review or review retry.
No answer/choice output was read. No assigned32-35 output was changed.
Every exec and the finalize subprocess used the explicit authorized workspace.
The two label assignments are model-authored source facts, not automatic
semantic inference; independent affected-ownership acceptance is still needed.
