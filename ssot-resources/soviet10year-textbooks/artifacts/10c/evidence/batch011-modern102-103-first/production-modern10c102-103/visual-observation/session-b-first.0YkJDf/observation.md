# STEMROBIN-184 Session B Screenshot Observation

Date: 2026-11-17. Bounded first screenshot observation complete. WAIT.

## Actual Visible Findings

The eight original full-page PNGs were each opened exactly once with functions.view_image detail=original. Their dimensions and SHA-256 values were recorded before image loading, and all eight hashes matched the supplied offline report records.

This is not a clean no-clipping observation: three long formula right tails are not visible across the two 390-wide text screenshots. Both desktop text screenshots, both n102 empty exercise screenshots, and both n103 four-exercise screenshots have no observed text/formula clipping or overlap. All eight captures show their page end or, for the empty pages, the complete captured empty viewport.

The reports' status=pass is an already-recorded command result, not a replacement for these pixel observations. Their geometry reports docWidth=390, but the mobile formula right tails are still not visible. No claim is made about the cause or whether horizontal scrolling can expose those tails: no browser, scroll, check, crop or reopen was authorized or performed.

### M102-DERIVATIVE-RIGHT-TAIL

Screenshot:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/ana10-c7-s2-n102/text-390.png`

SHA-256: `ae1955469513a04e83b50d24df92f39dbb6bd8d6f5fa5639322314f2f28fd3d2`

In the proof, below the visible word "因此", the long derivative chain extends past the right edge of the 358-pixel content area. The chain's end, including the final f(x), is not visible in this static mobile capture. The corresponding desktop capture shows the whole chain:

```latex
\left(\int_a^x f(t)dt\right)'=[F(x)-F(a)]'=F'(x)-[F(a)]'=f(x)
```

Other n102 mobile prose and shorter formulas, the zero-value conclusion, the final initial-value expression and equation label (2), and the zero-exercise footer remain visible. No overlap was observed.

### M103-EXAMPLE-VELOCITY-RIGHT-TAIL

Screenshot:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/ana10-c7-s2-n103/text-390.png`

SHA-256: `55668743797177f9ce69ce0935122a608c90a3fbab47f8b2c2970650e0ce94f5`

In the worked example, the velocity derivation's right tail is outside the visible right edge. Its opening integral/equalities are visible, but the final compact expression is not. The semicolon appears on a separate following line. The desktop screenshot shows the full expression:

```latex
v(t)=v_0+\int_{t_0}^tadz
    =v_0+\left.az\right|_{t_0}^t
    =v_0+at-at_0
    =v_0+a(t-t_0)
```

The formula is transcribed here only to identify the visible clipped row using its desktop counterpart, not to solve or correct it.

### M103-EXAMPLE-COORDINATE-RIGHT-TAIL

Same screenshot and SHA-256 as the preceding finding.

Below "然后根据(2)式求坐标", the coordinate derivation also extends past the right edge. The final quadratic term and final punctuation are not visible in this mobile capture. The desktop counterpart shows:

```latex
x(t)=x_0+\int_{t_0}^t[v_0+a(z-t_0)]dz
    =x_0+v_0(t-t_0)+\frac{a}{2}(t-t_0)^2
```

The complete example prose, both formula introductions, and the four-exercise footer are visible. The finding is cropped visibility of the formula tail within the captured page, not an assertion that its underlying content is absent.

## Per-Screenshot Observation

### 1. n102 Text, Desktop

Path:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/ana10-c7-s2-n102/text-1440.png`

Original dimensions: 1440 x 1237 pixels; 132549 bytes.
SHA-256: `51d567639a224e618012c1598fbfd035a86a269a471e81d20a99b5e20bcdf791`

The complete title "102. 具有可变积分上限的积分" and printed page 114 are visible. The variable-name invariance identity, both Newton-Leibniz evaluation identities, variable-upper-limit definition, derivative statement and proof, zero-value identity, zero-valued antiderivative conclusion, and general initial-value expression all appear in sequence. The long proof equality is visible through its final f(x).

One horizontal section boundary is visible after the variable-name/evaluation discussion and before the variable-upper-limit discussion. No boundary splits the derivative statement from its proof. Equation labels (1) and (2) appear on their own lines in this recorded render; neither is clipped or overlapping. This is an observation of the current rendered layout, not the earlier template layout.

The final q plus integral expression, label (2), and "去做题 · 0 道" link are visible above the page bottom. No clipping or overlap observed.

### 2. n102 Text, Mobile

Path:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/ana10-c7-s2-n102/text-390.png`

Original dimensions: 390 x 1339 pixels; 110558 bytes.
SHA-256: `ae1955469513a04e83b50d24df92f39dbb6bd8d6f5fa5639322314f2f28fd3d2`

The title and printed page, all prose passages, single conceptual boundary, labels (1)/(2), and end-of-page link are visible. Prose wraps naturally within the narrow column. The first variable-name identity and the shorter evaluation/definition formulas are visible; ordinary prose wraps after the second evaluation identity.

The one long derivative proof row has the right-tail visibility defect M102-DERIVATIVE-RIGHT-TAIL above. The zero-value identity and final q plus integral expression remain fully visible. No other clipping or text/section/footer overlap observed.

### 3. n102 Exercises, Desktop

Path:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/ana10-c7-s2-n102/exercises-1440.png`

Original dimensions: 1440 x 960 pixels; 19543 bytes.
SHA-256: `8787fc4574212e867bfb92d4cd37b019507fea09c2fce26ad317bb6163f0d7eb`

The lesson title with exercise suffix, printed page 114, and "回课文" link are visible. The remaining page is empty. This is the legitimate zero-exercise screen specified for n102, not missing content. No exercise items, answer controls, overlap or clipping observed.

### 4. n102 Exercises, Mobile

Path:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/ana10-c7-s2-n102/exercises-390.png`

Original dimensions: 390 x 844 pixels; 14825 bytes.
SHA-256: `2dad15557a44cbe43d6983f421aba45718c1c0190b66b212024517e1f325f441`

The full title is visible with its exercise suffix wrapped onto a second line. Printed page 114 and the return link are visible, followed by the complete empty captured viewport. The empty exercise body is legitimate. No missing-content finding, overlap or clipping observed.

### 5. n103 Text, Desktop

Path:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/ana10-c7-s2-n103/text-1440.png`

Original dimensions: 1440 x 1425 pixels; 198862 bytes.
SHA-256: `bd1bd5a710ee8e5c2814026a36e2dc881df6541b3be518ace3d56aec13e66e49`

The complete title "103*. 根据已知速度求坐标和根据已知加速度求速度" and printed page 116 are visible. The introductory straight-line-motion prose, coordinate/time and velocity relationship, initial-coordinate definition, coordinate-recovery expression, reference to the preceding subsection, acceleration relationship, initial-velocity definition and velocity-recovery expression all appear in sequence.

The four recovery formulas and labels (1)-(4) are visible, with the labels at the formula ends and the full stops following the labels:

```latex
\int_{t_0}^t v(t)dt=x(t)-x(t_0) \quad (1)
x(t)=x_0+\int_{t_0}^t v(z)dz \quad (2)
\int_{t_0}^t a(z)dz=v(t)-v(t_0) \quad (3)
v(t)=v_0+\int_{t_0}^t a(z)dz \quad (4)
```

The first horizontal boundary appears after the coordinate discussion's preceding-subsection reference and before the acceleration discussion. The second appears after the general velocity/coordinate summary and before the constant-acceleration example.

The full worked example statement, velocity derivation and coordinate derivation are visible together after that second boundary. No section boundary splits the example statement from its worked calculation. Both complete long worked formulas, their ending punctuation, and "去做题 · 4 道" at the page end are visible. No clipping or overlap observed.

### 6. n103 Text, Mobile

Path:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/ana10-c7-s2-n103/text-390.png`

Original dimensions: 390 x 1731 pixels; 169214 bytes.
SHA-256: `55668743797177f9ce69ce0935122a608c90a3fbab47f8b2c2970650e0ce94f5`

The long title wraps to two lines, with printed page 116 below it and no overlap. Introductory prose wraps within the narrow column. The four recovery formulas, their labels and final punctuation are fully visible. Both conceptual boundaries appear at the same transitions described in the desktop observation.

The complete example prose and both formula introductions are visible, but the two long worked calculation rows have right-tail visibility defects M103-EXAMPLE-VELOCITY-RIGHT-TAIL and M103-EXAMPLE-COORDINATE-RIGHT-TAIL. The footer link is visible with whitespace below it at the captured page end. No prose, section or footer overlap observed.

### 7. n103 Exercises, Desktop

Path:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/ana10-c7-s2-n103/exercises-1440.png`

Original dimensions: 1440 x 960 pixels; 135005 bytes.
SHA-256: `6d9a272292164c0c74af8173b7a0891880e46fa034d03616e17c692d8cd11f9d`

The title with exercise suffix, printed page 116, and "习题*" group heading are visible. Four read-only exercise rows, 440, 441, 442 and 443, are visibly separated.

- 440: the stone-throwing stem and g approximately 9.8 are visible; subparts 1), 2), 3) appear in separate ordered rows, through the final ground-return question.
- 441: v=9.8t-0.003t^2, t=0 to t=5, the path-length request and the endpoint acceleration request are all visible.
- 442: v=Rt+a sqrt(t), t=0 to t=4, the path-length and endpoint acceleration requests are visible. This is observation of the displayed stem, not interpretation of its coefficients.
- 443: a) and b) are visible in separate passages; both polynomial formulas, constant horizontal projection speed v, the first request's x qualification, and the complete second request are visible.

The final b) request and return-to-text link appear above the page bottom. No answer input/control was observed, as expected for this read-only offline evidence. No clipping or overlap observed.

### 8. n103 Exercises, Mobile

Path:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/ana10-c7-s2-n103/exercises-390.png`

Original dimensions: 390 x 1189 pixels; 121974 bytes.
SHA-256: `7c762e73b012fc02987257c8421b68fcc0c2f7c14cb8ee6c77b2ff3d434303e7`

The complete wrapped title, printed page 116 and "习题*" group heading are visible. All four numbered exercise rows and the same displayed formulas/requests observed on desktop are visible in the narrow layout.

440's 1), 2), 3) remain separated and ordered, with long subpart prose wrapping without collision. 443's a), b) remain separated; the constant-speed v values and the first subpart's x qualification wrap as ordinary continuations. The last acceleration request is complete, and the return link is visible at the page end. No formula/text clipping, overlap or answer controls observed.

## Evidence Binding and Image Budget

The two supplied reports were read in full before image loading:

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/ana10-c7-s2-n102/report.json`
  SHA-256: `bdbfed2b43eaeb0a69ec23d5fb17c149fc5f2724e1c2a05cb0312f5354718078`
  Existing observation timestamp: 2026-11-17T03:10:02.772Z.
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/ana10-c7-s2-n103/report.json`
  SHA-256: `5268cfc74f2114c888c53523cf298d5c498e985bd734e2aa69c547821932eccd`
  Existing observation timestamp: 2026-11-17T03:10:17.158Z.

Report-bound HTML hashes, not reread or regenerated here:

| Recorded HTML Kind | SHA-256 |
|---|---|
| n102 text | 0f7a6b312f0fdb0ad0aa83868b08de052706cd15c5be9181b9255551cedf4c37 |
| n102 exercises | 51630ecf4f71f16002e1a634bd7abb2a1dff86c14f201b13be94662d6b275a2e |
| n103 text | 85c2a67476719998dcc3de0150f18f56951f0863bcbfa68eb3b12f4c001b561c |
| n103 exercises | 6a389b4670a16b5b109254d7e92fb34c7dd15f07b4e68f1c2e08fd42d0a58361 |

Original PNG dimensions were read from IHDR before loading; all original PNG bytes matched their recorded screenshot SHA-256. The recorded desktop viewport is 1440 x 960 and mobile viewport is 390 x 844; full-page PNG heights above correctly exceed those viewport heights where the page is longer.

Before-load metadata:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c102-103/visual-observation/session-b-first.0YkJDf/before-load-manifest.json`

Completed load ledger:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c102-103/visual-observation/session-b-first.0YkJDf/load-ledger.json`

Loaded in the manifest's exact ordinal order, 1 through 8, once per path. Assignment opens used: 8/8. Lifetime usage: 0 before, 8 after, permanent limit 24, remaining 16. No reopening, resize, montage, crop, source-image load, screenshot generation or image payload return to the parent. No further opens are authorized under this assignment.

## Scope Boundary

Only the supplied reports, original PNG metadata/bytes, and eight screenshot image loads were inspected. These captures are isolated headless offline read-only evidence, not actual product, headed/OS, quiz judging, navigation, paging or persistence evidence. No browser interaction or rerun, extra content/math review, content repair, approval, source edits, answers/choices, DB, test, publisher, Git, refresh or Charter operation was performed.

Only this exclusively created visual-observation evidence directory was written; existing peer files and earlier author evidence were preserved.

WAIT. Return text, paths and hashes only. No image payloads or further action.
