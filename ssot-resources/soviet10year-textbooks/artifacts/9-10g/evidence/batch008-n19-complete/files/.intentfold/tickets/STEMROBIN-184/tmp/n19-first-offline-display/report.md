# STEMROBIN-184 n19 first offline display

## Outcome

**STOP_DISPLAY_FAILURE.** The prescribed check ran exactly once and exited 0.
The first actual screenshot opened, `text-1440.png`, exposes a detached Figure75
caption: the Figure75 drawing is followed by a section divider and the first
two paragraphs of numbered section2 before the centered caption "图75" appears.
The caption consequently interrupts section2 rather than immediately labeling
its drawing. This is a display-order finding, not a source-content or
mathematical judgment.

Per the first-failure STOP instruction, no other screenshot was opened, no
repair was attempted, and no command/browser/render was rerun. **Only 1/4
screenshots was actually observed.** The requested four-image observation and
visual inspection of all six written tasks186..191 remain incomplete; the
existing command's pass must not be substituted for that observation.

## Execution

- Cwd: `/Users/yong/.codex/worktrees/a07e/lemmadeck/app`.
- Executable: `/Users/yong/.local/opt/node-v24.16.0/bin/node`.
- Exact argv: `["../.intentfold/tickets/STEMROBIN-184/tmp/offline-check.mjs","9-10g","geo910-c1-s2-n19"]`.
- Started UTC: `2026-11-16T20:04:14.115Z`.
- Finished UTC: `2026-11-16T20:04:15.015Z`; elapsed899.991625ms.
- Exit0; signalnull; stderr0bytes.
- `PWDEBUG` unset; `PLAYWRIGHT_HTML_OPEN=never`;
  `PLAYWRIGHT_HTML_REPORT_OPEN=never`. `OFFLINE_KINDS` and `OFFLINE_REPORT`
  unset, preserving script defaults `text,exercises` and `report.json`.
- The output and observer directories were absent before this invocation.
  The wrapper protects against a second invocation and nonempty prior output.
- Existing app Playwright; fresh isolated headless Chromium contexts;
  file URLs only, script aborts HTTP(S) routes. No user profile/CDP/native UI,
  server/model/DB/network operation or new dependency installation.
- All11 tracked script/helper/package/modern-input/render files had unchanged
  SHA256 before/after execution. Full paths, sizes and mtimes are in
  `execution.json`; this wrapper did not edit those files.
- Raw stdout9547bytes SHA256:
  `65a40d7c33206a2fe5fa23651ce4bda7ea475347214b3d47631a100f10b48fd4`.
- Raw stderr0bytes SHA256:
  `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- The existing script's report has the same SHA256 as stdout. Its status is
  mechanical `pass`, **not** observer or semantic approval.

## Observation Ledger

1. Opened the actual complete `text-1440.png` once with `view_image`,
   detail`original`, at its1440x2233 full-page raster dimensions; viewport was
   1440x960. No crop, reopen, source-page image or additional browser was used.
   This occurred after execution ended and before the STOP checkpoint recorded
   at `2026-11-16T20:04:48.921Z`; the image tool does not provide its own timestamp.
2. Visible heading: section19, opposite vectors/vector subtraction. Vector
   overhead arrows, minus signs, zero vector, equal signs and parentheses in
   the visible text are rendered rather than raw TeX. In particular the initial
   AB+BA=AA=0 chain, a+(-a)=0, and BA=-AB have readable vector notation.
   This observes glyph presentation only, not formula truth or source fidelity.
3. Figure75 visibly includes both diagonal shafts, both arrowheads, a and -a
   labels and both overhead arrow symbols. The upper right shaft end and the
   lower/right arrowhead are not cut off. Labels and shafts have visible
   separation. Figure76 in this same complete image has A/B/O labels, three
   shafts and their arrowheads; the rightmost O label and bottom O vertex are
   visible. No additional image was opened to inspect either figure.
4. First display failure: Figure75 caption placement. Approximate screenshot
   coordinates, not new DOM measurements: drawing around y500..780, section
   rule around y816, section2 prose around y850..950, caption around y986.
   The caption is visibly separated from its graphic by numbered instructional
   prose and a section boundary. Stop was latched at this finding.
5. `exercises-1440.png`, `text-390.png`, `exercises-390.png`: created and hashed,
   **not opened** after the first failure. No visual pass for mobile, written
   task identity/completeness, their formulas, or their overlap/legibility.

The already-completed script reports10 paragraphs, two section boundaries and
six exercise rows at each viewport; zero `.err,.katex-error,input,textarea`,
no horizontal page overflow and no remote asset references were asserted.
It reports Figure75 media480x300 and Figure76 media480x480 on desktop,
both358px wide on mobile. Desktop figure labels25.5px, overhead arrows24px;
mobile labels19.01875px, overhead arrows17.9px, all label boxes fit.
These are script measurements, not claims that unobserved images were seen.
The script does not assert task labels186..191 or caption adjacency.

## Screenshot Manifest

All paths below are within
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n19/`.

| File | Viewport | Full Raster | Bytes | Actually Opened | SHA256 |
| --- | --- | --- | --- | --- | --- |
| text-1440.png | 1440x960 | 1440x2233 | 174465 | once | `5a4216773c1ca8dd221e68bf8cbfb6f70209e8fd222b0dd1cdcf02a6e1a8703f` |
| exercises-1440.png | 1440x960 | 1440x1008 | 103032 | no, STOP | `d8fabf2ad769454a6f1b483f582cd1dfcdfa378aca34f94c8cb5d0381ad33a05` |
| text-390.png | 390x844 | 390x2235 | 143288 | no, STOP | `e9373d6b327b620780717b8118b27beef96078e22889211fb0032e8438129a9a` |
| exercises-390.png | 390x844 | 390x1272 | 93477 | no, STOP | `f43d4617087b88b79bcf92aa2cdc147fab2e076666711d28b00be30fdba4cf8a` |

Four screenshots were generated; zero unexpected scrollshots. One image was
loaded into this fresh observer context, zero reopens/crops/source images.
Under the max8-image observation allowance, seven loads remain unused, including
at least the specifically reserved four for a later unique choice display
**only if the parent authorizes it**. No choice display was performed here.

## Bound Inputs

These are byte hashes only; no source-scan viewing or mathematical gate occurred.

| Input | SHA256 |
| --- | --- |
| Existing offline-check.mjs | `08aada5d0ec8847c6d32972e8b33a24187f2549ea382f435c91b45c07a6b1847` |
| Existing htmlfrag.js helper | `c2f0301c5ba7811336a5268a404f795ace7873b75eb93c42c10186f3d9c3f9f6` |
| Modern lesson.json | `eaa8d90a2955e5e9d3fef5eaca3e18cb7fcd764d5a2193a8ab61b3c898011771` |
| Modern exercises.json | `bec17cf252503bc992d97686c25f8540e7cc78dd60659346418272221576eae7` |
| Modern figures.json | `a645039c4b8e1ab800c03cd9f0f5bbe3d52cfebf311afa125f35775fd3879bef` |
| Existing adaptation.audit.json | `4603a0a8e5e1e4444eb1f5e99f0d47a445ab1f33829086a3b867379e86dd3bf3` |
| Existing text.html | `1c5634e626d1965aafedd1f9f42b9e8505f0020997f58a7d5c1f5d5d0f9553c5` |
| Existing exercises.html | `f681c69ad420c2b7b67c5aa013278406536416e40fd16d8c32259c527dae8959` |

## Boundaries

Writes are confined to the owned observer directory and the prescribed first
offline output directory. No Git operation, SkillHost, grill, prepare, finalize,
assembly, publish, source/answer/choice/math gate, full tests or build ran.
No other worker's work was edited or reverted. No self semantic approval,
complete-lesson claim, product UI/persistence claim or repair authorization.
Disposition: return STOP evidence to the parent; do not repair or rerun.
