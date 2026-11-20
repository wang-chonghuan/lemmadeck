# SAME188-6 / STEMROBIN-188: N44 Standard Answer Author

Offline author-only delivery. The candidate remains `draft`. No independent
semantic PASS is claimed, and the supplied ready adaptation/render prerequisites
are not answer approval.

- Scope: `9-10g / modern-us-neutral / geo910-c2-s1-n44`, original exercises 16-22.
- All writes are in this owned `n44-answer-author/` directory.
- Prepare ran once, exit 0. Its untouched original is read-only.
- Complete independent derivations and an independent arithmetic receipt were
  frozen before the candidate was written with `apply_patch`.
- The first candidate is read-only and retained; current candidate is identical.
- Seven answers are `derived`; the absent book `answers.json` was not read and
  no answer PDF was opened or crawled.
- Source numbers, `g1` group identity, the `习题` heading, exact modern prompt and
  original empty `figureEvidence` arrays are retained. A separate group-level
  prompt does not exist in these inputs; `groupPrompt` is explicitly `null`.
- Automatic: exercises 17, 18, 19, 20, with 10 graded parts (3 exact, 7 numeric).
- Ungraded: exercises 16, 21, 22; all five constructions, all three unordered
  parallelogram cases and the complete proof/angle computation have concrete
  `displayAnswer` content. Ungraded keys have no synthetic judge parts.
- Exercise 21 does not assume consecutive vertices. All three complete diagonal
  length pairs are displayed and associated with their opposite-vertex cases.
  Its unordered multi-case answer is not reliably compared by the current
  lexical exact judge, so it is not marked automatic.
- Exercise 22's vertex order and diagonal pairing are derived from coordinates.
  Both supplementary intersection angles are supplied with explicit ray labels.
- No essential source ambiguity remains after the finite case enumeration.
  Local HOLD count is zero. Parent semantic review may still request changes.
- Only figure 8 was needed for the construction. Two actual images were opened,
  in one batch: source PNG and a local raster of the currently approved modern
  SVG. No other figure, full earlier image batch or source page was opened.
- The local figure rasterizer used an existing headless Chromium in offline
  mode, a local SVG file and no MathLive element or keyboard transaction.
- Structure, KaTeX/numeric evaluation and the existing numeric/expression
  validator each ran once, exit 0. They are technical checks only.
- Three initial exploratory missing-path failures are preserved verbatim as
  local technical receipts. No author, arithmetic, candidate or validation stage
  failed; no content repair, image repair, source repair or paid call was used.
- One output preview was truncated by the tool display. The on-disk receipt
  contains complete stdout/stderr; that producer was not rerun.
- No production core `answer-keys.json` was read or written. No finalize,
  MathLive keyboard gate, interaction, choice, publication, DB, environment,
  install, network, paid, Git, backend, setup, freshness, Grill, deploy, closure
  or contact operation ran.

## Pending Parent Work

Independent semantic review, real MathLive keyboard serialization/normalization
gate and `lesson_answers.py finalize` are explicitly pending. This report does
not authorize or perform those stages. There is no independent semantic PASS,
answer gate-2 approval or publication approval.

## Candidate Bindings

Candidate: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44/answer-keys.template.json`

SHA-256: `079c1a2d9ce935ca02b0e10438eb24f9158787391deaa21459952f2173e77173`

Prepared original: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44/answer-keys.prepared-original.json`

Prepared SHA-256: `913cc457d4808ec64a2f79a6bcd64bc7ca08974be49109ffb8914cd1ea999ed5`

First candidate: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44/answer-keys.first-candidate.json`

First SHA-256: `079c1a2d9ce935ca02b0e10438eb24f9158787391deaa21459952f2173e77173`

Pre-candidate derivations SHA-256: `8b8ccf7c4a445be901ebe54651855c792b6f42f2062b43596a3846c43b859425`

## Coverage

| Exercise | Grading | Original Requests | Graded Parts | Source | Content Repairs |
|---|---|---:|---:|---|---:|
| 16 | ungraded | 5 | 0 | derived | 0 |
| 17 | auto | 2 | 2 | derived | 0 |
| 18 | auto | 1 | 1 | derived | 0 |
| 19 | auto | 1 | 1 | derived | 0 |
| 20 | auto | 3 | 6 | derived | 0 |
| 21 | ungraded | 1 | 0 | derived | 0 |
| 22 | ungraded | 2 | 0 | derived | 0 |

Total: 7 exercises; 4 auto / 3 ungraded; 10 graded parts (3 exact / 7 numeric / 0 expression). The 15 original requests include compound median and angle questions; exercise 20 expands to six separately labelled graded quantities. Exercise 21 has three exhaustive case branches. No ungraded request is silently omitted.

## Complete Part Keys

```json
[
  {
    "exercise": "16",
    "grading": "ungraded",
    "parts": []
  },
  {
    "exercise": "17",
    "grading": "auto",
    "parts": [
      {
        "label": "1) 向量 PQ 的完整坐标 (x,y,z)",
        "judge": "exact",
        "expected": [
          "\\left(-3,5,-3\\right)"
        ]
      },
      {
        "label": "2) 向量 PQ 的完整坐标 (x,y,z)",
        "judge": "exact",
        "expected": [
          "\\left(-\\frac{11}{10},\\frac{4}{3},-\\frac{1}{6}\\right)"
        ]
      }
    ]
  },
  {
    "exercise": "18",
    "grading": "auto",
    "parts": [
      {
        "label": "向量 OB 的长度",
        "judge": "numeric",
        "expected": [
          "\\sqrt{10}"
        ],
        "unit": "坐标长度单位"
      }
    ]
  },
  {
    "exercise": "19",
    "grading": "auto",
    "parts": [
      {
        "label": "所求点 M 的完整坐标 (x,y,z)",
        "judge": "exact",
        "expected": [
          "\\left(0,1,0\\right)"
        ]
      }
    ]
  },
  {
    "exercise": "20",
    "grading": "auto",
    "parts": [
      {
        "label": "1) 中线 AA_1 的长度",
        "judge": "numeric",
        "expected": [
          "\\frac{\\sqrt{62}}{2}"
        ],
        "unit": "坐标长度单位"
      },
      {
        "label": "1) 中线 BB_1 的长度",
        "judge": "numeric",
        "expected": [
          "\\frac{\\sqrt{53}}{2}"
        ],
        "unit": "坐标长度单位"
      },
      {
        "label": "2) 原点到重心 T 的距离 OT",
        "judge": "numeric",
        "expected": [
          "\\frac{\\sqrt{182}}{3}"
        ],
        "unit": "坐标长度单位"
      },
      {
        "label": "3) 顶点 A 的内角（度）",
        "judge": "numeric",
        "expected": [
          "\\frac{180}{\\pi}\\arccos\\left(\\frac{14}{15}\\right)"
        ],
        "unit": "°",
        "tolerance": 0.01
      },
      {
        "label": "3) 顶点 B 的内角（度）",
        "judge": "numeric",
        "expected": [
          "\\frac{180}{\\pi}\\arccos\\left(\\frac{11}{5\\sqrt{6}}\\right)"
        ],
        "unit": "°",
        "tolerance": 0.01
      },
      {
        "label": "3) 顶点 C 的内角（度）",
        "judge": "numeric",
        "expected": [
          "\\frac{180}{\\pi}\\arccos\\left(-\\frac{5}{3\\sqrt{6}}\\right)"
        ],
        "unit": "°",
        "tolerance": 0.01
      }
    ]
  },
  {
    "exercise": "21",
    "grading": "ungraded",
    "parts": []
  },
  {
    "exercise": "22",
    "grading": "ungraded",
    "parts": []
  }
]
```

## Technical Evidence

Structure exit 0; KaTeX rendered 148 math fragments; 7 numeric values compared to independent arithmetic, with negative controls; existing numeric/expression validator checked 7 values, exit 0. All three ran once. No MathLive keyboard transaction or semantic-review PASS is inferred.

## Actual Image Opens

```json
{
  "schema": "n44-answer-author/image-opens@1",
  "batch": 1,
  "imageCount": 2,
  "maxImagesPerBatch": 8,
  "maxImagesInContext": 24,
  "sourcePagesOpened": 0,
  "failedImageOpens": [],
  "opens": [
    {
      "role": "source figure PNG",
      "figure": "fig-g10-08",
      "exercise": "16",
      "tool": "functions.view_image",
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-g10-08.png",
      "sha256": "666ea84f2fd4ec869101beca6a0a632cee3e3d06b39d5ff18dd307b13100e904",
      "result": "actually opened; visible O-A-B-M construction, basis arrows and x/y/z labels",
      "specPath": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-08.spec.json",
      "specSha256": "4b6eb5968264b3dd90ae8cc506a06a14af4a5b0b0b9b518fc4c874dfa9e64b14"
    },
    {
      "role": "modern preview, locally rasterized current approved SVG",
      "figure": "fig-g10-08",
      "exercise": "16",
      "tool": "functions.view_image",
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/images/fig-g10-08-current-approved-svg.png",
      "sha256": "98afd82575c3919227460fd222ddc9437bde0e65f541d900c17853ce9449df45",
      "result": "actually opened; same symbolic construction and basis directions; not measured as coordinates",
      "svgPath": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-08.svg",
      "svgSha256": "2140980f296dd6b31e62d6a0a594f45618bc9092b7ec9562d1c03a38c550fb33",
      "specPath": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-08.spec.json",
      "specSha256": "4b6eb5968264b3dd90ae8cc506a06a14af4a5b0b0b9b518fc4c874dfa9e64b14",
      "approvedRenderReceiptSha256": "65a3ff5cc82a0ad99f7cc766bcc59ea14b7474b9710bdb2b9e38b70ae1610fc3",
      "approvedFigureReviewReceiptSha256": "7346947d52556eaea8f1e9c96792b8c350de609711d317091b0257749fa83bef",
      "rasterizeCommandReceipt": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/receipts/rasterize-current-fig08.json"
    }
  ],
  "notOpened": [
    {
      "figure": "fig-g10-06",
      "reason": "no exercise reference; definition already explicit in modern prose"
    },
    {
      "figure": "fig-g10-07",
      "reason": "no exercise reference; coordinate basis directions explicit in modern prose and needed figure 8"
    },
    {
      "figure": "fig-g10-09",
      "reason": "no exercise reference; point-difference formula explicit in modern prose"
    }
  ],
  "repairCounts": {
    "imageRepair": 0,
    "sourceRepair": 0,
    "modelImageCalls": 0,
    "paidCalls": 0
  },
  "mathLiveKeyboardGateRun": false
}
```

## Immutable Inputs

- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.claude/skills/ld-s10y-answer/SKILL.md`
  SHA-256 `a825db87672032d77aef61e5ae20098a2334ef6cfe7c12d2d1d90c110c955857` (13701 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md`
  SHA-256 `9f2c6e2b781b008af8141f9685c20fc7cefb2a2ef457d05ac689070c504274a9` (1769 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.claude/skills/ld-s10y-lesson/references/production-resume.md`
  SHA-256 `8d489fdcdd1a00866e951958009f6c8602e6b970108f8e7fc87368c3197b6a58` (4311 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.claude/skills/ld-s10y-answer/tools/lesson_answers.py`
  SHA-256 `30b7ba6be1397b2e005b8f9b3a682ca5ff9b680d6c77af9c1d06cedbef70d9e2` (21873 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs`
  SHA-256 `2b9e236faf57a5ff2860c5ea2961ad57dfb99b5fc3218eb5e12bcb5404f9a281` (1750 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/app/src/lib/answer-normalize.ts`
  SHA-256 `5c11b4304874b65ec5d99f92413b524cfc4f6683a60268a0ba04143534c7448c` (4909 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/app/src/lib/textbook-answer.ts`
  SHA-256 `bee990b6367f8111ab30a4409c28d5e9387a01068c0bf27376326dfe4fe8ff8f` (6871 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json`
  SHA-256 `310c4ee807e50d46a9b444a9aacc804de49362285e2f74fed5e1e1459f3b5890` (7660 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44/lesson.json`
  SHA-256 `6693c6bc9c22e1c5516eb73f5b1da64a4ee27a57049d356ebcba6d1b5039b63d` (19272 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44/exercises.json`
  SHA-256 `f87e027960fc85b996148ff450d3c6327c49cb59e0dc5baeb8054fadda32c6b7` (10859 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44/figures.json`
  SHA-256 `6cbad9e7ccd969a808f40cb9b3f1033ca47fbd082094c0ce7523f6d3b228422a` (2717 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44/adaptation.audit.json`
  SHA-256 `b4b791b4db1dee2201b505a338320f5ccb8cb019390453d17beabb41491ab9c2` (1945 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-g10-08.png`
  SHA-256 `666ea84f2fd4ec869101beca6a0a632cee3e3d06b39d5ff18dd307b13100e904` (5090 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-08.spec.json`
  SHA-256 `4b6eb5968264b3dd90ae8cc506a06a14af4a5b0b0b9b518fc4c874dfa9e64b14` (24535 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-08.svg`
  SHA-256 `2140980f296dd6b31e62d6a0a594f45618bc9092b7ec9562d1c03a38c550fb33` (59813 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-08.render.json`
  SHA-256 `65a3ff5cc82a0ad99f7cc766bcc59ea14b7474b9710bdb2b9e38b70ae1610fc3` (1181 bytes)
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-08.review.json`
  SHA-256 `7346947d52556eaea8f1e9c96792b8c350de609711d317091b0257749fa83bef` (1473 bytes)

## Actual Runtime Bindings

- `/Users/yong/.local/opt/node-v24.16.0/bin/node`
  SHA-256 `1ee75375e33b94fc34b3b19aede049e11dae90efb63b374dc96d6bdace70c4b8` (120573328 bytes)
- `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/node_modules/katex/dist/katex.js`
  SHA-256 `b6d127a59e590859c5a12e92f7eb5a4a21be58f3ffc1dff7616b0584c4d5f631` (618563 bytes)
- `/Users/yong/work/lemmadeck-ws/lemmadeck/app/node_modules/@cortex-js/compute-engine/dist/compute-engine.min.umd.cjs`
  SHA-256 `9fbe93c5c52dad18eece87e7223b4cb1761cca1eaa71d7deae42aa8ab9da5254` (1124747 bytes)
- `/Users/yong/work/lemmadeck-ws/lemmadeck/app/node_modules/playwright/index.js`
  SHA-256 `4e98f65f0a9d9bcab8cffc0c5cfdd87fd3f5b0be74fc494ff166a466b204cd44` (648 bytes)

Existing packages resolve through worktree symlinks to the shared local checkout. No installation or package modification; no DB-bearing runtime module imported.

## Full Command Receipts

All commands below ran in the exact workdir shown. Each original on-disk receipt is immutable and includes full stdout/stderr. Tool-preview truncation did not truncate the stored output or trigger a rerun.

### input-bindings

Receipt: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/receipts/input-bindings.json`

Receipt SHA-256: `45ac7f13ca293efdc163560ad21016ff071dc6e75f19fc68963b60a08b0dfade`

Workdir: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`

Command argv:
```json
[
  "node",
  ".intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/bind-inputs.mjs"
]
```
Exit: 0; signal: none; error: none

Full stdout:
```text
{
  "schema": "n44-answer-author/input-bindings@1",
  "cwd": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck",
  "capturedAt": "2026-11-20T02:14:41.892Z",
  "bindings": [
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.claude/skills/ld-s10y-answer/SKILL.md",
      "sha256": "a825db87672032d77aef61e5ae20098a2334ef6cfe7c12d2d1d90c110c955857",
      "bytes": 13701
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md",
      "sha256": "9f2c6e2b781b008af8141f9685c20fc7cefb2a2ef457d05ac689070c504274a9",
      "bytes": 1769
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.claude/skills/ld-s10y-lesson/references/production-resume.md",
      "sha256": "8d489fdcdd1a00866e951958009f6c8602e6b970108f8e7fc87368c3197b6a58",
      "bytes": 4311
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.claude/skills/ld-s10y-answer/tools/lesson_answers.py",
      "sha256": "30b7ba6be1397b2e005b8f9b3a682ca5ff9b680d6c77af9c1d06cedbef70d9e2",
      "bytes": 21873
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs",
      "sha256": "2b9e236faf57a5ff2860c5ea2961ad57dfb99b5fc3218eb5e12bcb5404f9a281",
      "bytes": 1750
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/app/src/lib/answer-normalize.ts",
      "sha256": "5c11b4304874b65ec5d99f92413b524cfc4f6683a60268a0ba04143534c7448c",
      "bytes": 4909
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/app/src/lib/textbook-answer.ts",
      "sha256": "bee990b6367f8111ab30a4409c28d5e9387a01068c0bf27376326dfe4fe8ff8f",
      "bytes": 6871
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json",
      "sha256": "310c4ee807e50d46a9b444a9aacc804de49362285e2f74fed5e1e1459f3b5890",
      "bytes": 7660
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44/lesson.json",
      "sha256": "6693c6bc9c22e1c5516eb73f5b1da64a4ee27a57049d356ebcba6d1b5039b63d",
      "bytes": 19272
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44/exercises.json",
      "sha256": "f87e027960fc85b996148ff450d3c6327c49cb59e0dc5baeb8054fadda32c6b7",
      "bytes": 10859
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44/figures.json",
      "sha256": "6cbad9e7ccd969a808f40cb9b3f1033ca47fbd082094c0ce7523f6d3b228422a",
      "bytes": 2717
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44/adaptation.audit.json",
      "sha256": "b4b791b4db1dee2201b505a338320f5ccb8cb019390453d17beabb41491ab9c2",
      "bytes": 1945
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-g10-08.png",
      "sha256": "666ea84f2fd4ec869101beca6a0a632cee3e3d06b39d5ff18dd307b13100e904",
      "bytes": 5090
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-08.spec.json",
      "sha256": "4b6eb5968264b3dd90ae8cc506a06a14af4a5b0b0b9b518fc4c874dfa9e64b14",
      "bytes": 24535
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-08.svg",
      "sha256": "2140980f296dd6b31e62d6a0a594f45618bc9092b7ec9562d1c03a38c550fb33",
      "bytes": 59813
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-08.render.json",
      "sha256": "65a3ff5cc82a0ad99f7cc766bcc59ea14b7474b9710bdb2b9e38b70ae1610fc3",
      "bytes": 1181
    },
    {
      "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-08.review.json",
      "sha256": "7346947d52556eaea8f1e9c96792b8c350de609711d317091b0257749fa83bef",
      "bytes": 1473
    }
  ],
  "bookAnswerEvidence": {
    "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/answers.json",
    "exists": false,
    "contentsRead": false,
    "pdfRead": false
  },
  "prerequisite": {
    "suppliedByHuman": "N44 adapt-finalize/render first exit 0; exercises 16-22 and four figures ready.",
    "observed": {
      "lesson": "ready",
      "exercises": "ready",
      "figures": "ready",
      "exerciseCount": 7,
      "figureCount": 4
    },
    "answerApproval": false,
    "rerun": false
  }
}
```

Full stderr:
```text
```

### prepare-once

Receipt: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/receipts/prepare-once.json`

Receipt SHA-256: `a04ca4207d2618d3fbb666c1425ec2b89b7f033b0c5c5efca0c493a3567c4a93`

Workdir: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`

Command argv:
```json
[
  "python3",
  "-B",
  ".claude/skills/ld-s10y-answer/tools/lesson_answers.py",
  "prepare",
  "--book",
  "9-10g",
  "--edition",
  "modern-us-neutral",
  "--lesson",
  "geo910-c2-s1-n44",
  "--work",
  ".intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/work"
]
```
Exit: 0; signal: none; error: none

Full stdout:
```text
[prepare] geo910-c2-s1-n44: 7 exercises -> .intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44/answer-keys.template.json
  完成后写入 ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44/answer-keys.json
```

Full stderr:
```text
```

### rasterize-current-fig08

Receipt: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/receipts/rasterize-current-fig08.json`

Receipt SHA-256: `481baf154b8a30ec934dc1efbe461f05a3bdabb2dc07ada5318037a53b405bb0`

Workdir: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`

Command argv:
```json
[
  "node",
  ".intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/rasterize-figure.mjs"
]
```
Exit: 0; signal: none; error: none

Full stdout:
```text
{
  "source": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-08.svg",
  "sourceSha256": "2140980f296dd6b31e62d6a0a594f45618bc9092b7ec9562d1c03a38c550fb33",
  "output": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/images/fig-g10-08-current-approved-svg.png",
  "sha256": "98afd82575c3919227460fd222ddc9437bde0e65f541d900c17853ce9449df45",
  "browser": "headless Chromium, offline context, local SVG only",
  "mathLive": false,
  "status": "rasterized-current-approved-svg"
}
```

Full stderr:
```text
```

### preserve-prepared-original

Receipt: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/receipts/preserve-prepared-original.json`

Receipt SHA-256: `1b506dc04d07f2996966d6cc5f96163aadf4e7527c289b08710643621bdca9c1`

Workdir: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`

Command argv:
```json
[
  "node",
  "-e",
  "const fs=require(\"node:fs\"),p=require(\"node:path\"),c=require(\"node:crypto\");const dir=\".intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44\";const source=p.join(dir,\"answer-keys.template.json\"),target=p.join(dir,\"answer-keys.prepared-original.json\");fs.copyFileSync(source,target,fs.constants.COPYFILE_EXCL);fs.chmodSync(target,0o444);console.log(JSON.stringify({source:p.resolve(source),target:p.resolve(target),sha256:c.createHash(\"sha256\").update(fs.readFileSync(target)).digest(\"hex\"),bytes:fs.statSync(target).size},null,2))"
]
```
Exit: 0; signal: none; error: none

Full stdout:
```text
{
  "source": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44/answer-keys.template.json",
  "target": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44/answer-keys.prepared-original.json",
  "sha256": "913cc457d4808ec64a2f79a6bcd64bc7ca08974be49109ffb8914cd1ea999ed5",
  "bytes": 2730
}
```

Full stderr:
```text
```

### independent-arithmetic-once

Receipt: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/receipts/independent-arithmetic-once.json`

Receipt SHA-256: `6bd21d33097ecca44e920344be49f3c1954569cdcb9f68eb56bc01ab46e97d0d`

Workdir: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`

Command argv:
```json
[
  "node",
  ".intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/verify-arithmetic.mjs"
]
```
Exit: 0; signal: none; error: none

Full stdout:
```text
{
  "status": "arithmetic-checks-completed",
  "independentOfCandidate": true,
  "results": {
    "16": [
      {
        "point": [
          2,
          3,
          1
        ],
        "path": [
          [
            0,
            0,
            0
          ],
          [
            2,
            0,
            0
          ],
          [
            2,
            3,
            0
          ],
          [
            2,
            3,
            1
          ]
        ]
      },
      {
        "point": [
          1,
          -1,
          2
        ],
        "path": [
          [
            0,
            0,
            0
          ],
          [
            1,
            0,
            0
          ],
          [
            1,
            -1,
            0
          ],
          [
            1,
            -1,
            2
          ]
        ]
      },
      {
        "point": [
          -3,
          0.5,
          -1
        ],
        "path": [
          [
            0,
            0,
            0
          ],
          [
            -3,
            0,
            0
          ],
          [
            -3,
            0.5,
            0
          ],
          [
            -3,
            0.5,
            -1
          ]
        ]
      },
      {
        "point": [
          0,
          2,
          -3
        ],
        "path": [
          [
            0,
            0,
            0
          ],
          [
            0,
            0,
            0
          ],
          [
            0,
            2,
            0
          ],
          [
            0,
            2,
            -3
          ]
        ]
      },
      {
        "point": [
          0,
          0,
          -1.5
        ],
        "path": [
          [
            0,
            0,
            0
          ],
          [
            0,
            0,
            0
          ],
          [
            0,
            0,
            0
          ],
          [
            0,
            0,
            -1.5
          ]
        ]
      }
    ],
    "17": {
      "vector1": [
        -3,
        5,
        -3
      ],
      "vector2Exact": [
        "-11/10",
        "4/3",
        "-1/6"
      ],
      "crossProducts": [
        [
          -11,
          10
        ],
        [
          4,
          3
        ],
        [
          -3,
          18
        ]
      ]
    },
    "18": {
      "projection": [
        0,
        -3,
        1
      ],
      "squaredLength": 10,
      "length": 3.1622776601683795
    },
    "19": {
      "point": [
        0,
        1,
        0
      ],
      "distanceA2": 9,
      "distanceB2": 9,
      "linearEquation": "4t=4"
    },
    "20": {
      "midpointBC": [
        3.5,
        0.5,
        4
      ],
      "midpointAC": [
        3.5,
        -1,
        2
      ],
      "medianSquaredLengths": [
        15.5,
        13.25
      ],
      "medianLengths": [
        3.9370039370059056,
        3.640054944640259
      ],
      "centroid": [
        3.333333333333333,
        -0.3333333333333333,
        3
      ],
      "centroidSquaredDistance": 20.22222222222222,
      "centroidDistance": 4.4969125210773475,
      "sideSquaredLengths": {
        "AB": 25,
        "AC": 9,
        "BC": 6
      },
      "cosines": [
        0.9333333333333333,
        0.8981462390204986,
        -0.6804138174397717
      ],
      "anglesDegrees": [
        21.039469781317237,
        26.084541552047035,
        132.87598866663575
      ],
      "angleSumDegrees": 180.00000000000003
    },
    "21": [
      {
        "oppositePair": "AC",
        "D": [
          0,
          -6,
          0
        ],
        "squaredLengths": [
          33,
          105
        ],
        "lengths": [
          5.744562646538029,
          10.246950765959598
        ]
      },
      {
        "oppositePair": "AB",
        "D": [
          2,
          0,
          0
        ],
        "squaredLengths": [
          59,
          27
        ],
        "lengths": [
          7.681145747868608,
          5.196152422706632
        ]
      },
      {
        "oppositePair": "BC",
        "D": [
          -6,
          8,
          2
        ],
        "squaredLengths": [
          10,
          174
        ],
        "lengths": [
          3.1622776601683795,
          13.19090595827292
        ]
      }
    ],
    "22": {
      "center": [
        0,
        2,
        0.5
      ],
      "u": [
        -4,
        -4,
        9
      ],
      "v": [
        -2,
        2,
        7
      ],
      "squaredLengths": [
        113,
        57
      ],
      "dotProduct": 63,
      "acuteDegrees": 38.28028412223281,
      "obtuseDegrees": 141.71971587776721
    }
  }
}
```

Full stderr:
```text
```

### freeze-pre-candidate-derivations

Receipt: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/receipts/freeze-pre-candidate-derivations.json`

Receipt SHA-256: `7079034de6db44800f2d93c22dfe7bf3689f1615dda65fb5a1cb2da8f6b94955`

Workdir: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`

Command argv:
```json
[
  "node",
  "-e",
  "const fs=require(\"node:fs\"),p=require(\"node:path\"),c=require(\"node:crypto\");const dir=\".intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author\";const source=p.join(dir,\"derivations.md\"),target=p.join(dir,\"derivations.pre-candidate.md\");fs.copyFileSync(source,target,fs.constants.COPYFILE_EXCL);fs.chmodSync(target,0o444);console.log(JSON.stringify({path:p.resolve(target),sha256:c.createHash(\"sha256\").update(fs.readFileSync(target)).digest(\"hex\"),independentArithmeticReceipt:p.resolve(p.join(dir,\"receipts/independent-arithmetic-once.json\")),candidateWritten:false},null,2))"
]
```
Exit: 0; signal: none; error: none

Full stdout:
```text
{
  "path": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/derivations.pre-candidate.md",
  "sha256": "8b8ccf7c4a445be901ebe54651855c792b6f42f2062b43596a3846c43b859425",
  "independentArithmeticReceipt": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/receipts/independent-arithmetic-once.json",
  "candidateWritten": false
}
```

Full stderr:
```text
```

### freeze-first-candidate

Receipt: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/receipts/freeze-first-candidate.json`

Receipt SHA-256: `fe96f01c108fec1237a7f4a78516593145a887249d8e3085c2ab5d04c95bb143`

Workdir: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`

Command argv:
```json
[
  "node",
  "-e",
  "const fs=require(\"node:fs\"),p=require(\"node:path\"),c=require(\"node:crypto\");const dir=\".intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44\";const source=p.join(dir,\"answer-keys.template.json\"),target=p.join(dir,\"answer-keys.first-candidate.json\");fs.copyFileSync(source,target,fs.constants.COPYFILE_EXCL);fs.chmodSync(target,0o444);console.log(JSON.stringify({candidatePath:p.resolve(source),firstCandidatePath:p.resolve(target),sha256:c.createHash(\"sha256\").update(fs.readFileSync(target)).digest(\"hex\"),bytes:fs.statSync(target).size,revision:0},null,2))"
]
```
Exit: 0; signal: none; error: none

Full stdout:
```text
{
  "candidatePath": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44/answer-keys.template.json",
  "firstCandidatePath": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44/answer-keys.first-candidate.json",
  "sha256": "079c1a2d9ce935ca02b0e10438eb24f9158787391deaa21459952f2173e77173",
  "bytes": 11784,
  "revision": 0
}
```

Full stderr:
```text
```

### structure-once

Receipt: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/receipts/structure-once.json`

Receipt SHA-256: `6c9d3f85e5df22c31cf30d1eba43b000c1ab27e68b4b1e3c26e0a19f4adcf8f8`

Workdir: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`

Command argv:
```json
[
  "python3",
  "-B",
  ".intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/check-structure.py"
]
```
Exit: 0; signal: none; error: none

Full stdout:
```text
{
  "status": "technical-structure-ok",
  "validator": "existing validate_lesson plus identity/coverage checks; no cmd_finalize",
  "candidate": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44/answer-keys.template.json",
  "summary": {
    "autoExercises": [
      "17",
      "18",
      "19",
      "20"
    ],
    "ungradedExercises": [
      "16",
      "21",
      "22"
    ],
    "gradedParts": 10,
    "exactParts": 3,
    "numericParts": 7,
    "expressionParts": 0
  },
  "failures": [],
  "semanticReview": "pending",
  "mathLive": "not run"
}
```

Full stderr:
```text
```

### katex-numeric-once

Receipt: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/receipts/katex-numeric-once.json`

Receipt SHA-256: `ecd1ac81832e5b7e7370b2d1e2004fd8ab3034582b182b96d169015b3cd5e17b`

Workdir: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`

Command argv:
```json
[
  "node",
  ".intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/check-katex-numeric.mjs"
]
```
Exit: 0; signal: none; error: none

Full stdout:
```text
{
  "status": "technical-katex-numeric-ok",
  "candidate": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44/answer-keys.template.json",
  "katexModule": "/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/node_modules/katex/dist/katex.js",
  "computeEngineModule": "/Users/yong/work/lemmadeck-ws/lemmadeck/app/node_modules/@cortex-js/compute-engine/dist/compute-engine.min.umd.cjs",
  "katexChecked": 148,
  "numericChecked": 7,
  "renderChecks": [
    {
      "label": "16.prompt[0]",
      "latex": "A(2,3,1)",
      "status": "rendered"
    },
    {
      "label": "16.prompt[1]",
      "latex": "B(1,-1,2)",
      "status": "rendered"
    },
    {
      "label": "16.prompt[2]",
      "latex": "D\\left(-3,\\frac12,-1\\right)",
      "status": "rendered"
    },
    {
      "label": "16.prompt[3]",
      "latex": "E(0,2,-3)",
      "status": "rendered"
    },
    {
      "label": "16.prompt[4]",
      "latex": "G\\left(0,0,-\\frac32\\right)",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[0]",
      "latex": "O",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[1]",
      "latex": "Ox,Oy,Oz",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[2]",
      "latex": "O(0,0,0)\\to(2,0,0)\\to(2,3,0)\\to A(2,3,1)",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[3]",
      "latex": "2\\vec i,3\\vec j,\\vec k",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[4]",
      "latex": "O(0,0,0)\\to(1,0,0)\\to(1,-1,0)\\to B(1,-1,2)",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[5]",
      "latex": "\\vec i,-\\vec j,2\\vec k",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[6]",
      "latex": "O(0,0,0)\\to(-3,0,0)\\to(-3,\\frac12,0)\\to D(-3,\\frac12,-1)",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[7]",
      "latex": "-3\\vec i,\\frac12\\vec j,-\\vec k",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[8]",
      "latex": "O(0,0,0)\\to(0,2,0)\\to E(0,2,-3)",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[9]",
      "latex": "2\\vec j,-3\\vec k",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[10]",
      "latex": "E",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[11]",
      "latex": "Oyz",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[12]",
      "latex": "O",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[13]",
      "latex": "\\vec k",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[14]",
      "latex": "\\frac32",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[15]",
      "latex": "G(0,0,-\\frac32)",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[16]",
      "latex": "G",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[17]",
      "latex": "Oz",
      "status": "rendered"
    },
    {
      "label": "16.displayAnswer[18]",
      "latex": "\\overrightarrow{OM}=x\\vec i+y\\vec j+z\\vec k",
      "status": "rendered"
    },
    {
      "label": "17.prompt[0]",
      "latex": "P",
      "status": "rendered"
    },
    {
      "label": "17.prompt[1]",
      "latex": "Q",
      "status": "rendered"
    },
    {
      "label": "17.prompt[2]",
      "latex": "\\overrightarrow{PQ}",
      "status": "rendered"
    },
    {
      "label": "17.prompt[3]",
      "latex": "P(2,-3,0)",
      "status": "rendered"
    },
    {
      "label": "17.prompt[4]",
      "latex": "Q(-1,2,-3)",
      "status": "rendered"
    },
    {
      "label": "17.prompt[5]",
      "latex": "P\\left(\\frac12,-\\frac43,\\frac56\\right)",
      "status": "rendered"
    },
    {
      "label": "17.prompt[6]",
      "latex": "Q\\left(-\\frac35,0,\\frac23\\right)",
      "status": "rendered"
    },
    {
      "label": "17.displayAnswer[0]",
      "latex": "\\overrightarrow{PQ}=Q-P",
      "status": "rendered"
    },
    {
      "label": "17.displayAnswer[1]",
      "latex": "(x,y,z)",
      "status": "rendered"
    },
    {
      "label": "17.displayAnswer[2]",
      "latex": "\\overrightarrow{PQ}=(-1-2,2-(-3),-3-0)=(-3,5,-3)",
      "status": "rendered"
    },
    {
      "label": "17.displayAnswer[3]",
      "latex": "\\overrightarrow{PQ}=\\left(-\\frac35-\\frac12,0-(-\\frac43),\\frac23-\\frac56\\right)=\\left(-\\frac{11}{10},\\frac43,-\\frac16\\right)",
      "status": "rendered"
    },
    {
      "label": "17.displayAnswer[4]",
      "latex": "P",
      "status": "rendered"
    },
    {
      "label": "17.displayAnswer[5]",
      "latex": "Q",
      "status": "rendered"
    },
    {
      "label": "17.parts[0].expected",
      "latex": "\\left(-3,5,-3\\right)",
      "status": "rendered"
    },
    {
      "label": "17.parts[1].expected",
      "latex": "\\left(-\\frac{11}{10},\\frac{4}{3},-\\frac{1}{6}\\right)",
      "status": "rendered"
    },
    {
      "label": "18.prompt[0]",
      "latex": "B",
      "status": "rendered"
    },
    {
      "label": "18.prompt[1]",
      "latex": "A(2,-3,1)",
      "status": "rendered"
    },
    {
      "label": "18.prompt[2]",
      "latex": "Oyz",
      "status": "rendered"
    },
    {
      "label": "18.prompt[3]",
      "latex": "|\\overrightarrow{OB}|",
      "status": "rendered"
    },
    {
      "label": "18.displayAnswer[0]",
      "latex": "Oyz",
      "status": "rendered"
    },
    {
      "label": "18.displayAnswer[1]",
      "latex": "x=0",
      "status": "rendered"
    },
    {
      "label": "18.displayAnswer[2]",
      "latex": "B=(0,-3,1)",
      "status": "rendered"
    },
    {
      "label": "18.displayAnswer[3]",
      "latex": "\\overrightarrow{OB}=(0,-3,1)",
      "status": "rendered"
    },
    {
      "label": "18.displayAnswer[4]",
      "latex": "|\\overrightarrow{OB}|=\\sqrt{0^2+(-3)^2+1^2}=\\sqrt{10}",
      "status": "rendered"
    },
    {
      "label": "18.parts[0].expected",
      "latex": "\\sqrt{10}",
      "status": "rendered"
    },
    {
      "label": "19.prompt[0]",
      "latex": "Oy",
      "status": "rendered"
    },
    {
      "label": "19.prompt[1]",
      "latex": "A(2,-1,1)",
      "status": "rendered"
    },
    {
      "label": "19.prompt[2]",
      "latex": "B(0,1,3)",
      "status": "rendered"
    },
    {
      "label": "19.displayAnswer[0]",
      "latex": "M(0,t,0)",
      "status": "rendered"
    },
    {
      "label": "19.displayAnswer[1]",
      "latex": "t\\in\\mathbb R",
      "status": "rendered"
    },
    {
      "label": "19.displayAnswer[2]",
      "latex": "MA^2=4+(t+1)^2+1=t^2+2t+6",
      "status": "rendered"
    },
    {
      "label": "19.displayAnswer[3]",
      "latex": "MB^2=(t-1)^2+9=t^2-2t+10",
      "status": "rendered"
    },
    {
      "label": "19.displayAnswer[4]",
      "latex": "MA=MB",
      "status": "rendered"
    },
    {
      "label": "19.displayAnswer[5]",
      "latex": "4t=4",
      "status": "rendered"
    },
    {
      "label": "19.displayAnswer[6]",
      "latex": "M(0,1,0)",
      "status": "rendered"
    },
    {
      "label": "19.displayAnswer[7]",
      "latex": "MA^2=MB^2=9",
      "status": "rendered"
    },
    {
      "label": "19.parts[0].expected",
      "latex": "\\left(0,1,0\\right)",
      "status": "rendered"
    },
    {
      "label": "20.prompt[0]",
      "latex": "A(3,-2,1)",
      "status": "rendered"
    },
    {
      "label": "20.prompt[1]",
      "latex": "B(3,1,5)",
      "status": "rendered"
    },
    {
      "label": "20.prompt[2]",
      "latex": "C(4,0,3)",
      "status": "rendered"
    },
    {
      "label": "20.prompt[3]",
      "latex": "AA_1",
      "status": "rendered"
    },
    {
      "label": "20.prompt[4]",
      "latex": "BB_1",
      "status": "rendered"
    },
    {
      "label": "20.prompt[5]",
      "latex": "ABC",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[0]",
      "latex": "A_1",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[1]",
      "latex": "BC",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[2]",
      "latex": "A_1=(\\frac72,\\frac12,4)",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[3]",
      "latex": "\\overrightarrow{AA_1}=(\\frac12,\\frac52,3)",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[4]",
      "latex": "AA_1=\\sqrt{\\frac14+\\frac{25}{4}+9}=\\frac{\\sqrt{62}}2",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[5]",
      "latex": "B_1",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[6]",
      "latex": "AC",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[7]",
      "latex": "B_1=(\\frac72,-1,2)",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[8]",
      "latex": "\\overrightarrow{BB_1}=(\\frac12,-2,-3)",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[9]",
      "latex": "BB_1=\\sqrt{\\frac14+4+9}=\\frac{\\sqrt{53}}2",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[10]",
      "latex": "T=\\frac13(A+B+C)=(\\frac{10}{3},-\\frac13,3)",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[11]",
      "latex": "OT=\\sqrt{\\frac{100}{9}+\\frac19+9}=\\frac{\\sqrt{182}}3",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[12]",
      "latex": "\\overrightarrow{AB}=(0,3,4)",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[13]",
      "latex": "\\overrightarrow{AC}=(1,2,2)",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[14]",
      "latex": "\\overrightarrow{BC}=(1,-1,-2)",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[15]",
      "latex": "AB=5",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[16]",
      "latex": "AC=3",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[17]",
      "latex": "BC=\\sqrt6",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[18]",
      "latex": "\\overrightarrow{AB}\\times\\overrightarrow{AC}=(-2,4,-3)\\ne(0,0,0)",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[19]",
      "latex": "\\cos\\angle A=\\frac{14}{15}",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[20]",
      "latex": "\\cos\\angle B=\\frac{11}{5\\sqrt6}",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[21]",
      "latex": "\\cos\\angle C=-\\frac{5}{3\\sqrt6}",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[22]",
      "latex": "\\angle A=\\arccos\\left(\\frac{14}{15}\\right)",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[23]",
      "latex": "\\angle B=\\arccos\\left(\\frac{11}{5\\sqrt6}\\right)",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[24]",
      "latex": "\\angle C=\\arccos\\left(-\\frac{5}{3\\sqrt6}\\right)",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[25]",
      "latex": "21.0395^\\circ",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[26]",
      "latex": "26.0845^\\circ",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[27]",
      "latex": "132.8760^\\circ",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[28]",
      "latex": "0",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[29]",
      "latex": "\\pi",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[30]",
      "latex": "180^\\circ",
      "status": "rendered"
    },
    {
      "label": "20.displayAnswer[31]",
      "latex": "\\frac{180}{\\pi}",
      "status": "rendered"
    },
    {
      "label": "20.parts[0].expected",
      "latex": "\\frac{\\sqrt{62}}{2}",
      "status": "rendered"
    },
    {
      "label": "20.parts[1].expected",
      "latex": "\\frac{\\sqrt{53}}{2}",
      "status": "rendered"
    },
    {
      "label": "20.parts[2].expected",
      "latex": "\\frac{\\sqrt{182}}{3}",
      "status": "rendered"
    },
    {
      "label": "20.parts[3].expected",
      "latex": "\\frac{180}{\\pi}\\arccos\\left(\\frac{14}{15}\\right)",
      "status": "rendered"
    },
    {
      "label": "20.parts[4].expected",
      "latex": "\\frac{180}{\\pi}\\arccos\\left(\\frac{11}{5\\sqrt{6}}\\right)",
      "status": "rendered"
    },
    {
      "label": "20.parts[5].expected",
      "latex": "\\frac{180}{\\pi}\\arccos\\left(-\\frac{5}{3\\sqrt{6}}\\right)",
      "status": "rendered"
    },
    {
      "label": "21.prompt[0]",
      "latex": "A(1,-3,0)",
      "status": "rendered"
    },
    {
      "label": "21.prompt[1]",
      "latex": "B(-2,4,1)",
      "status": "rendered"
    },
    {
      "label": "21.prompt[2]",
      "latex": "C(-3,1,1)",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[0]",
      "latex": "A,B,C",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[1]",
      "latex": "A,C",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[2]",
      "latex": "D=A+C-B=(0,-6,0)",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[3]",
      "latex": "\\overrightarrow{AC}=(-4,4,1)",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[4]",
      "latex": "\\overrightarrow{BD}=(2,-10,-1)",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[5]",
      "latex": "AC=\\sqrt{33}",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[6]",
      "latex": "BD=\\sqrt{105}",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[7]",
      "latex": "A,B",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[8]",
      "latex": "D=A+B-C=(2,0,0)",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[9]",
      "latex": "\\overrightarrow{AB}=(-3,7,1)",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[10]",
      "latex": "\\overrightarrow{CD}=(5,-1,-1)",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[11]",
      "latex": "AB=\\sqrt{59}",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[12]",
      "latex": "CD=\\sqrt{27}=3\\sqrt3",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[13]",
      "latex": "B,C",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[14]",
      "latex": "D=B+C-A=(-6,8,2)",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[15]",
      "latex": "\\overrightarrow{BC}=(-1,-3,0)",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[16]",
      "latex": "\\overrightarrow{AD}=(-7,11,2)",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[17]",
      "latex": "BC=\\sqrt{10}",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[18]",
      "latex": "AD=\\sqrt{174}",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[19]",
      "latex": "(B-A)\\times(C-A)=(3,-1,16)\\ne(0,0,0)",
      "status": "rendered"
    },
    {
      "label": "21.displayAnswer[20]",
      "latex": "\\left\\{\\left\\{\\sqrt{33},\\sqrt{105}\\right\\},\\left\\{\\sqrt{59},3\\sqrt3\\right\\},\\left\\{\\sqrt{10},\\sqrt{174}\\right\\}\\right\\}",
      "status": "rendered"
    },
    {
      "label": "22.prompt[0]",
      "latex": "A(2,4,-4)",
      "status": "rendered"
    },
    {
      "label": "22.prompt[1]",
      "latex": "B(1,1,-3)",
      "status": "rendered"
    },
    {
      "label": "22.prompt[2]",
      "latex": "C(-2,0,5)",
      "status": "rendered"
    },
    {
      "label": "22.prompt[3]",
      "latex": "D(-1,3,4)",
      "status": "rendered"
    },
    {
      "label": "22.displayAnswer[0]",
      "latex": "\\overrightarrow{AB}=(-1,-3,1)=\\overrightarrow{DC}",
      "status": "rendered"
    },
    {
      "label": "22.displayAnswer[1]",
      "latex": "\\overrightarrow{AD}=(-3,-1,8)=\\overrightarrow{BC}",
      "status": "rendered"
    },
    {
      "label": "22.displayAnswer[2]",
      "latex": "\\overrightarrow{AB}\\times\\overrightarrow{AD}=(-23,5,-8)\\ne(0,0,0)",
      "status": "rendered"
    },
    {
      "label": "22.displayAnswer[3]",
      "latex": "A,B,C,D",
      "status": "rendered"
    },
    {
      "label": "22.displayAnswer[4]",
      "latex": "AC,BD",
      "status": "rendered"
    },
    {
      "label": "22.displayAnswer[5]",
      "latex": "X=(0,2,\\frac12)",
      "status": "rendered"
    },
    {
      "label": "22.displayAnswer[6]",
      "latex": "\\overrightarrow{AC}=(-4,-4,9)",
      "status": "rendered"
    },
    {
      "label": "22.displayAnswer[7]",
      "latex": "\\overrightarrow{BD}=(-2,2,7)",
      "status": "rendered"
    },
    {
      "label": "22.displayAnswer[8]",
      "latex": "63",
      "status": "rendered"
    },
    {
      "label": "22.displayAnswer[9]",
      "latex": "113,57",
      "status": "rendered"
    },
    {
      "label": "22.displayAnswer[10]",
      "latex": "\\frac{63}{\\sqrt{113}\\sqrt{57}}=\\frac{63}{\\sqrt{6441}}",
      "status": "rendered"
    },
    {
      "label": "22.displayAnswer[11]",
      "latex": "\\angle AXB=\\angle CXD=\\theta=\\arccos\\left(\\frac{63}{\\sqrt{6441}}\\right)\\approx38.2803^\\circ",
      "status": "rendered"
    },
    {
      "label": "22.displayAnswer[12]",
      "latex": "\\angle BXC=\\angle DXA=\\pi-\\theta=\\arccos\\left(-\\frac{63}{\\sqrt{6441}}\\right)\\approx141.7197^\\circ",
      "status": "rendered"
    },
    {
      "label": "22.displayAnswer[13]",
      "latex": "38.2803^\\circ",
      "status": "rendered"
    },
    {
      "label": "22.displayAnswer[14]",
      "latex": "\\theta",
      "status": "rendered"
    }
  ],
  "numericChecks": [
    {
      "label": "18.parts[0]",
      "latex": "\\sqrt{10}",
      "unit": "坐标长度单位",
      "evaluated": 3.1622776601683795,
      "independentTarget": 3.1622776601683795,
      "delta": 0,
      "wrongValueRejected": true
    },
    {
      "label": "20.parts[0]",
      "latex": "\\frac{\\sqrt{62}}{2}",
      "unit": "坐标长度单位",
      "evaluated": 3.9370039370059056,
      "independentTarget": 3.9370039370059056,
      "delta": 0,
      "wrongValueRejected": true
    },
    {
      "label": "20.parts[1]",
      "latex": "\\frac{\\sqrt{53}}{2}",
      "unit": "坐标长度单位",
      "evaluated": 3.640054944640259,
      "independentTarget": 3.640054944640259,
      "delta": 0,
      "wrongValueRejected": true
    },
    {
      "label": "20.parts[2]",
      "latex": "\\frac{\\sqrt{182}}{3}",
      "unit": "坐标长度单位",
      "evaluated": 4.4969125210773475,
      "independentTarget": 4.4969125210773475,
      "delta": 0,
      "wrongValueRejected": true
    },
    {
      "label": "20.parts[3]",
      "latex": "\\frac{180}{\\pi}\\arccos\\left(\\frac{14}{15}\\right)",
      "unit": "°",
      "evaluated": 21.039469781317237,
      "independentTarget": 21.039469781317237,
      "delta": 0,
      "wrongValueRejected": true,
      "roundedDegreeValue": 21.0395,
      "roundedWithinTolerance": true,
      "cosineRejectedAsAngle": true
    },
    {
      "label": "20.parts[4]",
      "latex": "\\frac{180}{\\pi}\\arccos\\left(\\frac{11}{5\\sqrt{6}}\\right)",
      "unit": "°",
      "evaluated": 26.084541552047035,
      "independentTarget": 26.084541552047035,
      "delta": 0,
      "wrongValueRejected": true,
      "roundedDegreeValue": 26.0845,
      "roundedWithinTolerance": true,
      "cosineRejectedAsAngle": true
    },
    {
      "label": "20.parts[5]",
      "latex": "\\frac{180}{\\pi}\\arccos\\left(-\\frac{5}{3\\sqrt{6}}\\right)",
      "unit": "°",
      "evaluated": 132.87598866663572,
      "independentTarget": 132.87598866663575,
      "delta": 2.842170943040401e-14,
      "wrongValueRejected": true,
      "roundedDegreeValue": 132.876,
      "roundedWithinTolerance": true,
      "cosineRejectedAsAngle": true
    }
  ],
  "failures": [],
  "semanticReview": "pending",
  "mathLiveKeyboard": "not run"
}
```

Full stderr:
```text
```

### existing-math-expression-once

Receipt: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/receipts/existing-math-expression-once.json`

Receipt SHA-256: `3d3d3406b76443978bb6a0ed8846872ef7a1c2daf2ee3796ada8d264cb898022`

Workdir: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`

Command argv:
```json
[
  "node",
  ".claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs",
  ".intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44/answer-keys.template.json"
]
```
Exit: 0; signal: none; error: none

Full stdout:
```text
{
  "status": "pass",
  "checked": 7,
  "failures": []
}
```

Full stderr:
```text
```

## Retained First Technical Failures

```json
{
  "cwd": "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck",
  "classification": "exploratory path failures, not mathematical or content-review verdicts",
  "records": [
    {
      "command": [
        "rg",
        "--files",
        "-g",
        "*lessonproduction-resume*",
        "-g",
        "*lesson_answers*",
        "-g",
        "*check_math_expressions*",
        "-g",
        "*n44*",
        "-g",
        "*N44*",
        ".claude",
        ".intentfold",
        "ssot-resources",
        "scripts"
      ],
      "exitCode": 2,
      "stdout": ".claude/skills/ld-s10y-answer/tests/test_lesson_answers.py\n.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs\n.claude/skills/ld-s10y-answer/tools/lesson_answers.py\nssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/stemrobin188-g10-n42n43/n43-completion/files/n43-answer-finalize-01/check_math_expressions.mjs.json\n",
      "stderr": "rg: scripts: No such file or directory (os error 2)\n",
      "recovery": "Read the directly routed production-resume.md and current tooling. The unrelated search-result receipt was not opened."
    },
    {
      "command": [
        "ls",
        "-la",
        "ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44",
        ".intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author"
      ],
      "exitCode": 1,
      "stdout": "ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44:\ntotal 80\ndrwxr-xr-x@  6 yong  staff    192 Nov 20 02:10 .\ndrwxr-xr-x@ 20 yong  staff    640 Nov 20 02:10 ..\n-rw-r--r--@  1 yong  staff   1945 Nov 20 02:10 adaptation.audit.json\n-rw-r--r--@  1 yong  staff  10859 Nov 20 02:10 exercises.json\n-rw-r--r--@  1 yong  staff   2717 Nov 20 02:10 figures.json\n-rw-r--r--@  1 yong  staff  19272 Nov 20 02:10 lesson.json\n",
      "stderr": "ls: .intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author: No such file or directory\n",
      "recovery": "Created only the owned scratch directory with apply_patch."
    },
    {
      "command": [
        "rg",
        "--files",
        ".tmp/ld-s10y-image",
        ".intentfold/tickets/STEMROBIN-188/tmp/g10-n44",
        "-g",
        "*fig-g10-08*",
        "-g",
        "*preview*"
      ],
      "exitCode": 2,
      "stdout": ".intentfold/tickets/STEMROBIN-188/tmp/g10-n44/prose-flow-first/normalized-preview.json\n.intentfold/tickets/STEMROBIN-188/tmp/g10-n44/artifacts/9-10g/figures/fig-g10-08.svg\n.intentfold/tickets/STEMROBIN-188/tmp/g10-n44/artifacts/9-10g/figures/fig-g10-08.png\n.intentfold/tickets/STEMROBIN-188/tmp/g10-n44/work/9-10g/pages/0158/figures/fig-g10-08.svg\n.intentfold/tickets/STEMROBIN-188/tmp/g10-n44/work/9-10g/pages/0158/figures/fig-g10-08.png\n",
      "stderr": "rg: .tmp/ld-s10y-image: No such file or directory (os error 2)\n",
      "recovery": "No old preview/batch was opened. Render only the hash-bound current approved fig-g10-08 SVG locally into the owned image directory."
    }
  ]
}
```

## Image and Repair Counters

```json
{
  "prepareInvocations": 1,
  "independentArithmeticInvocations": 1,
  "boundedValidationBatches": 1,
  "structureInvocations": 1,
  "katexNumericInvocations": 1,
  "existingMathExpressionInvocations": 1,
  "imagesOpened": 2,
  "failedImageOpens": 0,
  "imageBatches": 1,
  "maximumImagesInBatch": 2,
  "contentRepairsTotal": 0,
  "contentRepairBudgetPerAffectedAnswerUnit": 1,
  "repairsByExercise": {
    "16": 0,
    "17": 0,
    "18": 0,
    "19": 0,
    "20": 0,
    "21": 0,
    "22": 0
  },
  "repairsByGradedPart": {
    "17:0:1) 向量 PQ 的完整坐标 (x,y,z)": 0,
    "17:1:2) 向量 PQ 的完整坐标 (x,y,z)": 0,
    "18:0:向量 OB 的长度": 0,
    "19:0:所求点 M 的完整坐标 (x,y,z)": 0,
    "20:0:1) 中线 AA_1 的长度": 0,
    "20:1:1) 中线 BB_1 的长度": 0,
    "20:2:2) 原点到重心 T 的距离 OT": 0,
    "20:3:3) 顶点 A 的内角（度）": 0,
    "20:4:3) 顶点 B 的内角（度）": 0,
    "20:5:3) 顶点 C 的内角（度）": 0
  },
  "imageRepairs": 0,
  "sourceRepairs": 0,
  "paidCalls": 0,
  "initialExploratoryTechnicalFailures": 3,
  "contentFailures": 0,
  "candidateValidationFailures": 0,
  "localHOLDS": 0
}
```

## Complete Pre-Candidate Derivations

# N44 Independent Standard-Answer Derivations

Scope: SAME188-6 / STEMROBIN-188, book `9-10g`, edition
`modern-us-neutral`, lesson `geo910-c2-s1-n44`, original exercises 16-22.
Written before the candidate. No parent, choice-author, reviewer answer, other
lesson key, answer PDF, source page or database was consulted. All seven sources
are `derived`; the book's `answers.json` is absent.

The current modern prose defines coordinates by
$\overrightarrow{OM}=x\vec i+y\vec j+z\vec k$ and vector differences by
$\overrightarrow{PQ}=Q-P$. All distance units below are the coordinate system's
length unit, not invented metres or centimetres.

## 16: Five Point Constructions

The exercise asks to **plot** points, not to repeat their supplied coordinates.
Use the lesson's concrete polygonal construction: start at $O$, move by
$x\vec i$, then $y\vec j$, then $z\vec k$. A negative component means the opposite
direction to that named basis vector; a zero component requires no movement.
Each segment is parallel to its corresponding axis, with length the absolute
value of that component in the coordinate scale.

1. $A$: $O(0,0,0)\to(2,0,0)\to(2,3,0)\to A(2,3,1)$.
   Movements are $+2\vec i,+3\vec j,+\vec k$.
2. $B$: $O(0,0,0)\to(1,0,0)\to(1,-1,0)\to B(1,-1,2)$.
   Movements are $+\vec i,-\vec j,+2\vec k$.
3. $D$: $O(0,0,0)\to(-3,0,0)\to(-3,\frac12,0)
   \to D(-3,\frac12,-1)$.
   Movements are $-3\vec i,+\frac12\vec j,-\vec k$.
4. $E$: the first segment collapses;
   $O(0,0,0)\to(0,2,0)\to E(0,2,-3)$.
   Thus $E$ lies in $Oyz$; movements are $+2\vec j,-3\vec k$.
5. $G$: both horizontal segments collapse;
   $O(0,0,0)\to G(0,0,-\frac32)$.
   Thus $G$ lies on the negative $Oz$ ray, $\frac32$ units from $O$.

The vector sum of each path is exactly the requested point's position vector,
so the construction gives every supplied coordinate, including both zero cases
and all negative and fractional components. No physical screen direction,
right-handed convention or perspective scale is imposed.

**Image observation, batch 1, two actual opens:** only `fig-g10-08` was needed.
The source PNG and locally rasterized, currently approved modern SVG both show
$O\to A\to B\to M$, basis directions $\vec i,\vec j,\vec k$, component labels
$x,y,z$, dashed $AB$, and interrupted $BM/OM$. The source and modern diagram are
symbolic schematics, not coordinate values to measure or limits on component
signs. The current FigureSpec was read. Source/spec/SVG/render/review and actual
raster paths are bound in the input and image receipts. Figures 6, 7 and 9 were
not opened: no exercise refers to them, and no further geometric data is needed.

Grading: `ungraded`, five construction subparts, `parts=[]`.

## 17: Two Directed Vectors

Subtract starting coordinates from ending coordinates; do not reverse $PQ$.

1. $Q-P=(-1-2,\,2-(-3),\,-3-0)=(-3,5,-3)$.
2. $Q-P=(-\frac35-\frac12,\,0-(-\frac43),\,\frac23-\frac56)
   =(-\frac{11}{10},\frac43,-\frac16)$.

Adding each resulting vector to its given $P$ recovers the given $Q$.
The tuple order is the explicitly supplied $(x,y,z)$ coordinate order.
Grading: `auto`, two `exact` parts, one entire ordered vector tuple per subpart.

## 18: Orthogonal Projection and Length

$Oyz$ has equation $x=0$. Orthogonal projection removes only the $x$ component:
$B=(0,-3,1)$, so $\overrightarrow{OB}=(0,-3,1)$ and
$|\overrightarrow{OB}|=\sqrt{0^2+(-3)^2+1^2}=\sqrt{10}$.

Grading: `auto`, one `numeric` part for the length; $B$ is an intermediate result.

## 19: Equidistant Point on the Entire Axis

Every point on $Oy$ is $M=(0,t,0)$ with $t\in\mathbb R$; restricting to the
positive ray would be unjustified.

$MA^2=(0-2)^2+(t+1)^2+(0-1)^2=t^2+2t+6$.

$MB^2=(0-0)^2+(t-1)^2+(0-3)^2=t^2-2t+10$.

Equality of distances is equivalent to equality of these nonnegative squares:
$4t=4$, hence $t=1$. The unique answer is $M=(0,1,0)$.
Substitution gives $MA^2=MB^2=9$.

Grading: `auto`, one `exact` part containing the entire ordered point tuple.

## 20: Two Medians, Centroid Distance, Three Interior Angles

All three vertices are fixed. Let $A_1$ be the midpoint of $BC$ and $B_1$ the
midpoint of $AC$.

### 20(1)

$A_1=(\frac72,\frac12,4)$,
$\overrightarrow{AA_1}=(\frac12,\frac52,3)$.
Thus $AA_1^2=\frac14+\frac{25}{4}+9=\frac{62}{4}$ and
$AA_1=\frac{\sqrt{62}}2$.

$B_1=(\frac72,-1,2)$,
$\overrightarrow{BB_1}=(\frac12,-2,-3)$.
Thus $BB_1^2=\frac14+4+9=\frac{53}{4}$ and
$BB_1=\frac{\sqrt{53}}2$.

### 20(2)

The medians intersect at the centroid
$T=\frac13(A+B+C)=(\frac{10}{3},-\frac13,3)$.
Therefore $OT^2=\frac{100}{9}+\frac19+9=\frac{182}{9}$ and
$OT=\frac{\sqrt{182}}3$.

### 20(3)

$\overrightarrow{AB}=(0,3,4)$, $AB=5$;
$\overrightarrow{AC}=(1,2,2)$, $AC=3$;
$\overrightarrow{BC}=(1,-1,-2)$, $BC=\sqrt6$.
The cross product $\overrightarrow{AB}\times\overrightarrow{AC}=(-2,4,-3)$
is nonzero, so the triangle is nondegenerate.

At $A$: $AB\cdot AC=14$, so
$\angle A=\arccos(\frac{14}{15})$.

At $B$: $BA\cdot BC=11$, so
$\angle B=\arccos(\frac{11}{5\sqrt6})$.

At $C$: $CA\cdot CB=-5$, so
$\angle C=\arccos(-\frac{5}{3\sqrt6})$.

These are **angles**, not just their cosines. Each inverse cosine uses its
unique interior-angle value in $(0,\pi)$; the negative third cosine makes $C$
obtuse. Exact expressions above use radian measure. For keys explicitly labelled
in degrees, multiply each inverse cosine by $\frac{180}{\pi}$.
The independent arithmetic receipt supplies degree approximations and verifies
their sum is $180^\circ$ using the law of cosines as a second computation.

Grading: `auto`, six `numeric` parts: two distinctly labelled median lengths,
one origin-to-centroid length, three distinctly labelled angles in degrees.
Angle tolerance is $0.01$ degree; it is explicit, not a change in the exact
standard answers.

## 21: All Three Source-Permitted Parallelograms

The prose says **three vertices**, not “three consecutive vertices” or
“parallelogram $ABCD$.” Among any three vertices of a parallelogram, exactly one
pair is opposite. Enumerate that pair as $AC$, $AB$ or $BC$. Equality of diagonal
midpoints forces the fourth vertex in each case, so the following is exhaustive.

### Opposite Pair AC

$D=A+C-B=(0,-6,0)$.
$\overrightarrow{AC}=(-4,4,1)$ and
$\overrightarrow{BD}=(2,-10,-1)$.
The two diagonal lengths are
$(AC,BD)=(\sqrt{33},\sqrt{105})$.

### Opposite Pair AB

$D=A+B-C=(2,0,0)$.
$\overrightarrow{AB}=(-3,7,1)$ and
$\overrightarrow{CD}=(5,-1,-1)$.
The two diagonal lengths are
$(AB,CD)=(\sqrt{59},3\sqrt3)$.

### Opposite Pair BC

$D=B+C-A=(-6,8,2)$.
$\overrightarrow{BC}=(-1,-3,0)$ and
$\overrightarrow{AD}=(-7,11,2)$.
The two diagonal lengths are
$(BC,AD)=(\sqrt{10},\sqrt{174})$.

The given points are noncollinear:
$(B-A)\times(C-A)=(3,-1,16)\ne0$.
All three resulting parallelograms are consequently nondegenerate.
As an unordered collection of unordered length pairs the full answer is
$\{\{\sqrt{33},\sqrt{105}\},\{\sqrt{59},3\sqrt3\},
\{\sqrt{10},\sqrt{174}\}\}$, not six independently interchangeable lengths.

Grading: `ungraded`, one prose task with three case branches, `parts=[]`.
The runtime exact judge is lexical and does not compare this unordered
case-associated collection semantically. No isolated length pair is accepted
as the entire answer, and no missing consecutive-vertex premise is added.
The finite ambiguity is resolved by complete enumeration; no local HOLD is needed.

## 22: Concrete Proof and Both Diagonal Intersection Angles

$\overrightarrow{AB}=(-1,-3,1)=\overrightarrow{DC}$ and
$\overrightarrow{AD}=(-3,-1,8)=\overrightarrow{BC}$.
Also
$\overrightarrow{AB}\times\overrightarrow{AD}=(-23,5,-8)\ne0$.
The two nonparallel pairs of opposite sides are equal and parallel, so the
four supplied points form a nondegenerate parallelogram with boundary order
$A,B,C,D$ **deduced**, not presumed.

Its diagonals $AC$ and $BD$ have the same midpoint
$X=(0,2,\frac12)$.
The other two pairings of the supplied points have unequal midpoints, so this
diagonal identification does not rely on alphabetical order.

$u=\overrightarrow{AC}=(-4,-4,9)$,
$v=\overrightarrow{BD}=(-2,2,7)$.
$u\cdot v=63$, $|u|^2=113$, $|v|^2=57$.
The acute angle is
$\theta=\arccos(\frac{63}{\sqrt{6441}})$.
The supplementary angle is
$\pi-\theta=\arccos(-\frac{63}{\sqrt{6441}})$.

More explicitly,
$\angle AXB=\angle CXD=\theta$ and
$\angle BXC=\angle DXA=\pi-\theta$.
Thus all four intersection angles are specified without an unstated acute-only
or oriented-vector convention. If “the angle between lines” means the smaller
angle, it is the first value; the second is the other actual intersection angle.
The independent arithmetic receipt gives both in degrees.

Grading: `ungraded`, the requested proof and angle calculation are both
completed in `displayAnswer`, `parts=[]`.

## Authoring Boundary

These are independent **author derivations**, not an independent semantic-review
PASS. The supplied ready adaptation/render prerequisite is not answer approval.
Structure/KaTeX/numeric-expression checks are bounded technical checks only.
Real MathLive keyboard serialization, semantic review and `lesson_answers.py
finalize` remain pending with the parent. No production `answer-keys.json`,
interaction specification, choice, source page, DB, environment, installation,
Git, backend, publication, deployment or closure is modified.

## Remaining Gates

Independent semantic review, real MathLive keyboard gate for the three exact parts, and lesson_answers.py finalize remain pending with the parent. No independent semantic PASS, gate-2 approval or production publication is claimed.
