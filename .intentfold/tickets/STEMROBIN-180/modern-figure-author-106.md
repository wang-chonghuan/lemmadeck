# Figure106 Draft Author Handoff

Status: **FROZEN AUTHOR DRAFT, PENDING INDEPENDENT REVIEW**. Render/author checks PASS; no self-approval, review.json, promotion or durable writes.

## Scope And Authority

Own scratch: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-106-author/`.
Only figure106 for `phy6-c4-s3-t1`; Bacon's104/105 and approved109 untouched.

- Original independently opened in full, alone: `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-106.png`; SHA256 `4c0567e85d871b6ab9bc0afe6ef5c95ea2f75ff028105785cc2d3fd9220e311d`.
- Full frozen16-block lesson: `.tmp/ld-s10y-lesson/text-author-c4-s3t1-s4/adapt/6p/modern-us-neutral/lessons/phy6-c4-s3-t1/lesson.template.json`; SHA256 `f4862ac35bf3e9d862de4946fab6a13275686ab3657f320115c7187882159659`.
- Zero-task `exercises.template.json` at the same location; SHA256 `bfa36060b343d17685111bc483d2e6d3da36ff189e2c7aa66dfde91f9320cffa`.
- Exact frozen copies and all16 blocks retained in `frozen-text/` and `context.json`; `source.authoritativeText` contains all nonempty modern prose/captions plus title/chapter,14 records. Empty figure blocks are not lost from the complete context.

## Inventory And Routing

Pixel-first `source-inventory.md`, followed by `source-inventory.json` / `spec.source.inventory`, accounts for the full main airline1, complete human/vent control, valve2 with both stems, reservoir3/left-side connection, cylinder4/direct right-side connection, piston/return spring/rod, upright pivot/linkage, curved brake block5 and full wheel6/rims/hub/two fasteners/surface arcs.

One original unbraked state retained. The shoe is visibly clear of the rim. Opening the source control vents the main airline and lowers the right-side pressure, while valve2 retains left-side/reservoir air; this relationship is explained from the full frozen prose, without a second drawn state, invented gauge, pressure reading, motion/flow arrow or universal modern-train claim.

Least-generative route: **deterministic structural schematic** with complete simplified clothed operator pictogram, not portrait/natural artwork. Modern additions are English legend/control name and concise text-bound explanation. Clean proportions, spring turns, wheel accents and canvas clearance are graphical regularization, never source measurements or stiffness. All gas spaces are ungraded; colors do not claim different initial pressures.

Actual Azure/model/generation calls **0**, generation retries **0**. No external service/network/browser navigation.

## Actual Commands And Results

Working directory `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

```sh
env -u PWDEBUG PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-106-author/author.py
env -u PWDEBUG PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/s10y-image/6p/fig-106-author/spec.json --stage draft --json
env -u PWDEBUG PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-106-author/check-functional.py
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never PYTHONDONTWRITEBYTECODE=1 PYTHON=/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec .tmp/s10y-image/6p/fig-106-author/spec.json --svg .tmp/s10y-image/6p/fig-106-author/fig-106.svg --png .tmp/s10y-image/6p/fig-106-author/author-canvas.png --report .tmp/s10y-image/6p/fig-106-author/fig-106.render.json
env -u PWDEBUG PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-106-author/repair-01.py
# The identical renderer command above was then executed once more.
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never node .tmp/s10y-image/6p/fig-106-author/preview.mjs
env -u PWDEBUG PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-106-author/freeze.py
```

- Generator exit0:98 objects,92 standard assertions,14 complete nonempty text records.
- Explicit skill validator exit0/PASS.
- Functional helper exit0/PASS:33 checks. Includes twelve connected wall junctions, eight open-throat checks (detect closing straight walls), open reservoir/valve contours, left/right feeds separated by the piston, one rod, full brake-polygon clearance including stroke thickness, six identities and human hand/control connection. Minimum visible rim clearance about7.4 canvas px /3.5px at306; not a physical quantity.
- First render **exit2/FAIL**: `vent-process-two-label` padding collided with previous text line; min font checks already PASS. Rejected spec `a32be18e42ff0e62f23247c74491d60827ce306897648cfd45d786fa6756c1ee`; SVG `83ec97b88ebfcacbc11a8148656213917a48d228fcbd2be416e219580d060eac`.
- Before repair, all first spec/SVG/PNG/render/context/frozen text/inventories/helpers/functional evidence copied byte-for-byte to `failure-01-process-label/`; rejection is not overwritten.
- **Sole repair1/1:** only `vent-process-one.at` screenY964 to953 (11px upward). No text, gas-path/actor/apparatus geometry, assertions or input changes. Original33 geometry checks reused with explicit hash rebind, not falsely reported as rerun.
- Second render **exit0/PASS**: no collisions; minimum text16.25625px at306 and34px at640. Repair used1, remaining0.
- Preview helper **exit0/PASS**: six actual306/640 neutral/accent/print PNGs, plus both three-theme sheets. DOM actual widths exactly306/640; all16 labels inside canvas and >=16px; canvas pixels nonblank. Both complete sheets actually opened. Human grip/feet, all gas-path openings, spring/rod/linkage, full rims, brake gap and English labels remain visible in all three themes. Author observations only.

Standalone validation calls1; renderer calls2 with internal validations2; functional calls1; repair1; preview1. All launches isolated headless using the existing project dependency, no GUI/OS input/profile/CDP/PWDEBUG/Inspector/automatic HTML report. Task-owned contexts/browser closed.

## Final Hash-Bound Outputs

- `spec.json`: `3348b364962759d1c8e734cd5bc2d7195407a08447bf1d6444600fb2e4695737`
- `fig-106.svg`: `d63ace131d3f2e108a3f9b54db056c77e6a899dbaa963f46f143c7fef5a6de91`
- `fig-106.render.json`: `05a989d764c712cfea73930aff7781b9d668ad4870ef019759717a69227393c4`
- `author-functional-checks.json`: `722ba7ffc88e66e30e5a74b668efb56f85371c92221758169382aabcfe5ffe4e`
- `author-preview.json`: `18bc2f8b51459ecf8a188f34e4aac19a3523a7c37bb3cea1fc5f65025f2a18c0`
- `preview-306-three-theme.png`: `59eb10ce691f6116fab6fda41f8b5553a9b98bc6118af54b299c2d52c1487c8c`
- `preview-640-three-theme.png`: `558288579af9678f514dfcc674109ae1809926c69ac12a662151aee60a93f767`
- Renderer SHA256 `a5558857b3918d8c667080751dc53b0c9ba6471556a2adf0e855bf617126373a`; validator SHA256 `09710764de37027add910c734832a953f77b909cc50080807765b8aa20299668`.

`author-handoff.json` freezes all file hashes (including the first failure), inputs, tool hashes and real call/repair ledger. SVG is the deterministic candidate; PNGs are evidence only. Scratch is not a durable promotion contract. No source/modern text/renderer/approved figures/lesson/index/DB/app/schema/dependency/Git/Charter changes; independent reviewer/main owns next action. Caption propagation remains entirely deferred.
