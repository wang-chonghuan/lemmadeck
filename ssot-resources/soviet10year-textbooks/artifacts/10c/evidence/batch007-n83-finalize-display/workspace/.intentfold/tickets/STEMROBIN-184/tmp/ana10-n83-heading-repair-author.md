# n83 Heading Repair: Affected Mechanical Handoff

## Scope And Result

STEMROBIN-184; same display gate, only verification of the parent's one-line group-heading repair plus the previously untested mobile long-formula tails. **Affected render exited0; one isolated-headless browser cycle exited0 and closed.** These are mechanical results, not independent visual/semantic approval or whole-lesson completion. The parent will first open the repaired heading and nine new tail screenshots.

The parent applied the existing-function change in `render_lesson.js`: `esc(group || "练习")` to `proseInline(group || "练习")`. This agent did not edit that tool or any data, style, formula, source, app, schema, or dependency. The current repaired line is238; its full tool snapshot and declared one-line diff are preserved before this render.

All72 files from the original first-run manifest were hash-compared after the affected operation and remain unchanged, including initial first HTML, four full-page/eight table screenshots, the original REVISE report/manifest and STOP records. Initial evidence was not overwritten. No bind, finalize, full offline helper, table check or source/math/text gate was repeated.

## Preserved Evidence

Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`. `T` is root `.intentfold/tickets/STEMROBIN-184/tmp`; `E` is `T/n83-finalize-display/`; affected evidence is `E/heading-repair/`.

Before the affected render, current native HTML was copied into `heading-repair/before/native-current/`. The repaired tool was copied into `before/render_lesson.heading-repaired.js`, SHA `45c38b879ac336e409cc67f12a394996ede24f963c419128d132f4b84c38a90d`; `before/current-tool-diff.json`, SHA `0abbdc4e7b4adbdab9015cf6d66193fda5641a33cb0f75d0961a73337e8e7386`, records the disclosed old/current line without Git/history access.

`before-bindings.json` records19 current hashes: source/edition book indexes, faithful n83 lesson/exercises, all durable n83 JSON/audit, three templates, and both approved table spec/SVG/render/review contracts. Every one remains byte-identical after this operation. Sourcebook still has SHA `93d6d63d1572316e8ecda7b296911b593279a6a425be0261939d619e924f1565`.

## Single Affected Render

```text
cwd: /Users/yong/.codex/worktrees/a07e/lemmadeck
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never \
  .claude/skills/ld-s10y-lesson/.venv/bin/python -B \
  .claude/skills/ld-s10y-lesson/tools/p2c.py render \
  --book 10c --edition modern-us-neutral --lesson ana10-c6-s3-n83
exit0; signal:null; stderr:empty; output ok:true,48 exercises,35 rendered flow objects
```

Full argv, stdout, stderr and actual status are saved as `heading-repair/render-heading-repair.*`. New native HTML is preserved separately at `E/native-render-heading-repair/`, and is also the current renderer output under `.tmp/ld-s10y-lesson/render/10c/modern-us-neutral/ana10-c6-s3-n83/`.

Strict affected comparison:

- `text.html` is byte-identical to first output, SHA `6cf894d3a2c6dfeab1d4b1b431c996ada63808382fbe8c855e0189e95dad4a47`.
- The first `g2` exgroup is the only changed exercise-HTML span. Replacing precisely that old span with the new span reproduces the entire new HTML; both the prefix and suffix are byte-identical.
- All other six group HTML spans and all48 `<li class="ex">` task spans remain byte-identical, with unchanged ordering and counts.
- Exercise HTML initial SHA `be9c637465764145a459551c447dc90e39ab58be44a3a5eb42e2fe6b89b21b49`; affected SHA `7589cf69964aa1ddc0823fa8c402dc385f3981284c96c3afb2c4cb618f5daaa8`.

Exact old/new exgroup strings, offsets and all comparisons are retained in `heading-repair/strict-html-and-data-diff.json`, SHA `77f1732a02ee21da6da31d93c19d767c42335afec6680b3f3aebad7f226fe4e0`.

## Single Browser Cycle

The scoped scratch check uses the app-installed official Playwright, explicitly `chromium.launch({headless:true})`, no persistent profile/CDP, isolated contexts at1440x960 and390x844, blocked HTTP(S), cleared `PWDEBUG`, and `PLAYWRIGHT_HTML_OPEN=never`. Contexts and the task-owned browser closed; one launch only. Full check source/argv/stdout/stderr/actual exit are retained in `heading-repair/check-heading-and-first-mobile-tails.mjs` and `affected-browser-once.*`.

For both viewports, the first group has exactly one real KaTeX expression, exact annotation `45^{\circ}`, rendered visible math `45∘`, no visible raw `$` or TeX, no `.err`/`.katex-error` and no page errors. Document widths1440/390 match viewports. Only heading+first-task screenshots were captured: `heading-1440.png` and `heading-390.png`.

The DOM `innerText` includes the parallel KaTeX accessibility/render layers, so it may list45/degree twice; `katexCount:1` and `.katex-html` text are the actual rendered-expression checks. This is not a claim of two visible expressions.

## First Mobile Long-Math Tail Evidence

In the same390px context, the check first derived actual horizontal-overflow owners with mathematical children and scrollable overflow, excluding figures. It found8正文 and1 exercise containers. No approved table was scrolled or recaptured.

| Page/container | Client width | Scroll width | Actual/max scrollLeft | Rightmost math glyph | Complete glyph in owner |
| --- | --- | --- | --- | --- | --- |
| text0 | 358 | 569 | 211/211 | α | true |
| text1 | 358 | 587 | 229/229 | α | true |
| text2 | 358 | 448 | 90/90 | α | true |
| text3 | 358 | 469 | 111/111 | α | true |
| text4 | 358 | 472 | 114/114 | α | true |
| text5 | 358 | 568 | 210/210 | α | true |
| text6 | 358 | 569 | 211/211 | degree glyph | true |
| text7 | 358 | 568 | 210/210 | 0 | true |
| exercise112 | 310 | 379 | 69/69 | ) | true |

Each owner was scrolled immediately to its actual maximum; a native DOM Range measured every nonblank rendered KaTeX HTML glyph, selecting the rightmost mathematical glyph. Each full glyph box falls inside its owner's horizontal and vertical bounds. Actual glyph rectangles, CSS font sizes/transform matrices, container boxes, annotations and scroll metrics are retained. SVG CTM is not applicable to these HTML glyphs; real screen-space Range measurements are recorded rather than an invented SVG matrix.

Nine first-tail screenshots are retained as `math-tail-text-0.png` through `math-tail-text-7.png` and `math-tail-exercises-0.png`. Page widths remained390 during each tail operation, with no page errors. All nine mathematical tails are reachable; no new display defect was mechanically observed in this scoped cycle.

No screenshot was opened with an image-view tool in this affected run, per the parent's explicit division of visual review. This author does not claim to have independently visually approved the heading/tails. The parent's disclosed node:test result4pass/0fail/0skip (three focused cases plus parent test) is recorded only as supplied evidence; no test was rerun here.

Browser/geometry report SHA: `1cf00b7c44802a4216924eaadab6b0a547e6fa4b39203d1e6c7ade19c6b66bff` at `heading-repair/heading-and-first-mobile-tails.json`. Consolidated binding/disposition SHA: `fe95f7a9629e3c3096a4531cd7aff31bd58d0177c44a713c01ef7b844bdac4e6` at `heading-repair/affected-handoff-bindings.json`.

## Freeze And Limits

N83-DISPLAY-01 is mechanically resolved only in the changed group heading; the initial REVISE remains preserved as historical first-run evidence. Original101 is still literal `101. $\sin2\frac{1}{7}\pi$.`, semanticUNKNOWN unselected. No source glyph, task, answer/choice, JSON/math signature, table spec/SVG, index, app/style/tool repair, DB/Git/network service or extra figure gate was changed/run.

Affected totals: one render, one browser cycle; zero bind/finalize/full offline/table repetitions; zero extra mathematical or author repair. The companion `T/ana10-n83-heading-repair-author.manifest.json` binds this report, all affected first-run artifacts, new native HTML and preserved evidence references. Raw hashes are taken externally after freezing, then writes stop for the parent's first affected screenshot reading.
