# STEMROBIN-184 B: n13 Affected-Only Offline Follow-Up

Status: PASS for the authorized follow-up only. Native execution exited 0, once, with 11 passing checks and no verification reruns.

Workspace: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck`

Exclusive new write root: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n13-offline-followup/`

## Input And Repair Validation

PASS before browser checks: the retained first-review freeze and repair receipt chain match their expected hashes. All 12 original inputs were checked: the repaired text HTML matches the declared after hash; the other 11 inputs match the first-review hashes. Four additional evidence-chain files are recorded, giving 16 input manifest entries.

Only the two declared outer opening spans changed. Reversing those two replacements alone reproduces the exact original text HTML SHA-256. This establishes that the remaining bytes, including the formulas' inner HTML, MathML and annotations, are unchanged.

| Property | Verified Value |
|---|---|
| Before bytes | 472081 |
| After bytes | 472185 |
| Byte delta | +104 |
| Opening spans changed | 2 |
| Before SHA-256 | `8894feeed9eeb821e40581be39e21f5e439fccfd0a20647dc80c29d2f5d30a7c` |
| After SHA-256 | `c4bda9ebac846577bd1332857dcff7209e316f25213accabc6b66301abddf33b` |
| Retained first freeze SHA-256 | `cc5aa2d99cc87cc34d6286e9f7e9f18433062c742bd40c58fb9d3782504840fd` |

The exact opening replacement is `<span class="nb">` to `<span class="nb" style="padding-bottom: 0.25em; overflow-y: hidden;">`.

Affected zero-based KaTeX ordinals and literal annotations:

```tex
56: r>0.\underbrace{2399\cdots9}_{k\text{ 位}}
59: 0.24-0.\underbrace{2399\cdots9}_{k\text{ 位}}=10^{-k}
```

## Rendered Geometry And Pending Behavior

These are native headless rendered-geometry and interaction results, not a fresh screenshot review. Both viewport geometry premises passed before any previously UNKNOWN dependent check ran.

| Check | Desktop 1440x960 | Mobile 390x844 |
|---|---|---|
| Ordinal 56 actual font ink | PASS: 8 text leaves contained; minimum bottom clearance 2.903273582458496px | PASS: 8 text leaves contained; same minimum clearance |
| Ordinal 59 actual font ink | PASS: 13 text leaves contained; minimum bottom clearance 2.903273582458496px | PASS: 13 text leaves contained; same minimum clearance |
| Immediate neighboring paragraphs | PASS: both formulas contained by their paragraphs; all previous/next gaps 16.953125px | PASS: same containment and gaps |
| Previously UNKNOWN nested scroll ends | PASS: both overflowing hosts reached their 2px ends; final math boxes accessible; no uncontained hidden-X math | PASS: same two hosts and end results |
| Previously UNKNOWN text row reachability | PASS: all 23 paragraphs; 157 distinct text-fragment vertical bands reached | PASS: all 23 paragraphs; 194 distinct text-fragment vertical bands reached |
| Previously UNKNOWN forward navigation | PASS: visible, hit-testable native link clicked once; `exercises.html` returned HTTP 200 | PASS: same native navigation once, HTTP 200 |

Each repaired wrapper has computed bottom padding 4.24px and height 51.109375px. Actual glyph bounds were derived from DOM Range geometry and Canvas `measureText` actual bounding-box metrics using the computed font. Range/font-box heights agree within the check's 1px tolerance; every measured text leaf is vertically contained and horizontally reachable. No canvas bitmap was produced or exported.

The two overflowing hosts contain `a_0.a_1a_2` and ordinal 56. Their client/scroll widths are 57/59px and 126/128px respectively. At scroll end, each final math box is 2px inside its host's right boundary.

The forward link was reachable at document scroll Y=2267px desktop and Y=3268px mobile. Row counts denote deduplicated text-fragment vertical bands, including different math baselines, not a claim about typographic line count. Navigation verifies the destination response and URL only; exercise content was not reviewed again.

## Native Execution And Receipts

Working directory: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/app`

Acceptance command, already executed once:

```sh
node ../.tmp/stemrobin-184-resume/n13-offline-followup/ac-followup.mjs
```

Resolved executable: `/Users/yong/.local/opt/node-v24.16.0/bin/node`. The wrapper invoked the same scoped script with `--check` to retain its native stdout/stderr and actual exit code.

- Native interval: 2026-11-19T20:13:54.007Z through 2026-11-19T20:13:58.237Z.
- Exit: 0. Invocations: 1. Reruns: 0.
- Tool session: 5416. Initial stream: `25fa63`. Completion stream: `2ea759`, observing process exit 0.
- Stdout: 28728 bytes; SHA-256 `c62d980aee5be57499cf8ac9e360e5214d89e9c437e6762bc69501b18b4c078e`.
- Stderr: 0 bytes; SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- This follow-up had no native failure or checker repair. The parent's initial detached-wrapper serialization failure and the first review's clipping failures remain retained in their original evidence; they are not replaced by this PASS.

Manifest packaging command, with no browser or verification replay:

```sh
node ../.tmp/stemrobin-184-resume/n13-offline-followup/ac-followup.mjs --freeze
```

`freeze.json` records status, absolute file paths, byte counts and SHA-256 values for the report, script, results, validation and receipts/logs; it also records all 16 input entries, repair proof, image usage and closure. Its own hash is excluded to avoid self-reference.

## Isolation, Closure And Limits

PASS: existing `app/node_modules` Playwright, isolated Chromium with `headless:true`, in-memory allowlisted static server at `http://127.0.0.1:49704`, embedded data fonts and stable affected layout. No app runtime or database was started.

Outside access was denied by browser request routing and restrictive server CSP. The request ledger contains only five successful local GETs: three text requests (readiness plus two viewports) and two forward-navigation requests. No outside request was observed.

The owned contexts, browser and server closed in `finally`; recorded closure is `browser: closed`, `server: closed`.

Image usage: new images 0; screenshots 0; image loads 0; crops 0; reopens 0; image payloads 0. Fresh follow-up usage is 0; cumulative usage remains exhausted 6/6. Parent receives zero image payloads; its permanent 24/24 budget is unchanged.

No HTML/canonical writes, no passed exercise/choice/global/figure/math/font review replay, no original-source image opening, and no Git, setup, backend, DB, publisher, paid calls, deployment, messages or descendants. Other contributors' files and all prior evidence were left untouched.

The parent's first six-view evidence and repair-entry failure remain preserved. Earlier exercise/choice PASS results are retained, not re-executed here. Fresh full-page screenshot review was not performed because the image cap is exhausted.

Author review: pending. Independent key review: pending. Semantic option correctness: UNKNOWN and not inferred. This is not whole-lesson approval or ticket closure. Evidence is ready for parent intake without sending a message or image.
