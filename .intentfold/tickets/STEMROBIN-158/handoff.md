# Handoff

## What changed

- Imported only the durable `7a` textbook artifacts from checkpoint
  `a9918cb897106d4d33950abeef1128560146e6bd`, without importing the checkpoint's older shared code.
- Restored physical page 12 to the printed `a+b+c` expression and registered source-bound errata
  that correct the modern lesson to `a+b-c`. Registered the page 13 printed denominator error and
  corrected the modern expression to `x^2-1`.
- Re-finalized `alg7-c1-s1-n1` and `alg7-c1-s1-n2` through the current adaptation, answer, and
  interaction contracts. The modern lessons contain 14/20 prose blocks, 11/15 exercises, zero
  figures, and semantic section anchors at `4,11` and `9,15,17`.
- Converted modern exercise-part markers from Cyrillic to Latin while preserving the faithful source
  text and recording the adaptation as `layout` plus `script`.
- Kept the existing published `math5-c1-s2-n16` lesson unchanged and used its deterministic
  `fig-67` only as the required isolated representative figure sample.

## AC results

1. **Source fidelity and modern errata: passed.**
   - Pages 7-16 and both target lessons passed page finalization, assembly, adaptation finalization,
     answer finalization, interaction finalization, and publication validation.
   - The faithful artifacts retain page 12's printed `a+b+c` and page 13's printed `x-1`; the modern
     lesson contains the two registered corrections `a+b-c` and `x^2-1`.
   - Stable lesson/exercise identities, counts, zero-figure status, and section anchors were retained.

2. **Course rendering and answer interaction: passed.**
   - Headed Chromium exercised six real MathLive inputs. All six expected values were accepted, all
     six paired wrong values were rejected, and every case completed in one attempt. Report:
     `.intentfold/tickets/STEMROBIN-158/tmp/mathlive-report.json`.
   - The focused numeric, expression, and exact-answer controls passed 34 tests.
   - The official lesson renderer passed both lessons at `1440x960` and `390x844`: no overflow,
     render errors, escaped blocks, figures, or answer metadata appeared. Report:
     `.intentfold/tickets/STEMROBIN-158/tmp/browser-7a/report.json`.
   - The live database read found no rows for either target lesson. Their localhost routes correctly
     remain in the pending-content state; no publication was performed.

3. **Isolated real figure sample: passed.**
   - Regenerating published `fig-67` from its current FigureSpec produced a byte-identical SVG with
     51 objects, 21 lines, and 25 labels; spec and isolated publication validation passed.
   - Desktop and mobile checks found no clipped labels or page overflow, a 28px isolated-render
     minimum label size, and semantic CSS colors. The real product kept the 640px figure scrollable
     with labels at least 19.5px high and a usable MathLive keyboard.
   - Evidence:
     `.intentfold/tickets/STEMROBIN-158/tmp/figure-sample/` and
     `.intentfold/tickets/STEMROBIN-158/tmp/product-detail/report.json`.

4. **Rebuildability and project checks: passed.**
   - Rebuilding the 20 affected core outputs from the saved source left all hashes unchanged;
     `.intentfold/tickets/STEMROBIN-158/tmp/rebuild.diff` is empty.
   - Mechanical defence passed:
     `python3 ssot-resources/audit.py`;
     `python3 ssot-resources/soviet10year-textbooks/validate.py`
     (16 PDFs, 17 catalog volumes, 510 lessons, 407 figure records);
     `cd app && npm run test && npm run build`
     (14 files and 106 tests passed, production build completed).

## Deviations

No scope deviation. Because publication was not authorized and the target database rows do not
exist, target-lesson visual evidence uses the official offline renderer; the real application
surface was verified with the existing published `math5-c1-s2-n16` sample. The figure result proves
only this deterministic JSXGraph class, not generated, hybrid, or other figure classes.

## Environment

- Local app: `http://localhost:52158`
- Environment keys added, changed, or removed: none
- Source checkpoint: `a9918cb897106d4d33950abeef1128560146e6bd`
- Verified elapsed time: 20m 18s, from `2026-09-22T14:59:20Z` through
  `2026-09-22T15:19:38Z`
- Token usage: unknown
- Paid/image generation calls: 0
- MathLive retries: 0; each positive and paired negative case passed on its first attempt
- No dependency, schema, production-data, learner-data, publication, deployment, merge, or
  environment-key change was performed.

## Residual

- Publish `alg7-c1-s1-n1` and `alg7-c1-s1-n2` only after separate human authorization, then verify
  their real `/card/...` product rows.
- Remaining `7a` lessons, other volumes, generated/hybrid image modes, and other diagram classes
  remain outside this delivery. This handoff does not establish ten-volume readiness.
