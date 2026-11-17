# Count-Mask Review

STEMROBIN-184; 2026-11-16. Single bounded, independent count-only source classification after the reported first line-count failure. No transcription or full-page review.

Method: existing `.claude/skills/ld-s10y-lesson/.venv/bin/python` with Pillow; each supplied source PNG is RGB, 1695 x 2580. Exact native rectangular crop `[x,y,width,height] = [0,2200,1695,380]`, Pillow box `(0,2200,1695,2580)`. No resizing, annotation, cleanup or compositing. Candidate `[0,2470,1695,40]` is fully visible at crop-local `[0,270,1695,40]`; intervals are half-open.

Visual budget: exactly three crop opens, one image per call, each once at original resolution; no original full-page display or other image opens. Conclusions derive from visible morphology, not reported counts, band coordinates or source-author conclusions. All hashes below are SHA-256.

## 10c / 0082: PASS for NONCONTENT Mask

Visible candidate: sparse dots and short broken horizontal ink traces, most conspicuous toward the lower right; irregular, very shallow marks without character-shaped strokes, a readable baseline, mathematical structure or figure geometry. No instructional text, formula, figure or folio is visible anywhere inside the candidate. The readable folio `76` and its flanking dots are well above the candidate, separated by blank margin.

Classification: isolated peripheral trace/scan ink only. Physical origin: UNKNOWN. The candidate does not intersect a visible source content object; acceptable for count exclusion only.

Source render: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c82-85/10c/pages/0082/page.png`
Source SHA-256: `2d0d812237b5cefc7702ba6af5116c8b9c63aab053b114e959bd2a4b17c15037`

Crop: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c82-83-86-count/0082-bottom-x0-y2200-w1695-h380.png`
Crop SHA-256: `2868d14d8368e920459b30191e38cef8f703c31c6a7a3c71df86bed29b74d7d1`

## 10c / 0083: PASS for NONCONTENT Mask

Visible candidate: a long, nearly full-width black peripheral streak, slightly sloped, with ragged edges, uneven thickness and fragmented extremities. It is isolated in the lower blank margin, without labels, glyphs, organized figure structure or attachment to the body content; it does not read as an instructional rule or diagram. No instructional text, formula, figure or folio is visible inside the candidate. The body-text fragment at the crop's top and the readable folio `77` with flanking dots remain well above it.

Classification: isolated peripheral trace/scan ink only. Physical origin: UNKNOWN; no claim about scanner boundary, binding or printing cause. The candidate does not intersect a visible source content object; acceptable for count exclusion only.

Source render: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c82-85/10c/pages/0083/page.png`
Source SHA-256: `e5c85c21c403e46f71619e6a972348712b3ad78af6e47c26de23ab40d3e534fa`

Crop: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c82-83-86-count/0083-bottom-x0-y2200-w1695-h380.png`
Crop SHA-256: `6c58acd870a6c13d4233b9755874f75307904492ac32b44bc477ac29bf45ce86`

## 10c / 0086: PASS for NONCONTENT Mask

Visible candidate: tiny separated dots and narrow broken streaks across the middle/right lower margin, including a shallow trace near the lower right. Marks have no readable glyph shapes, mathematical arrangement, labels or connected figure structure. No instructional text, formula, figure or folio is visible anywhere inside the candidate. The readable folio `80` and its flanking dots remain far above it; larger isolated margin flecks higher in the crop are outside the candidate.

Classification: isolated peripheral trace/scan ink only. Physical origin: UNKNOWN. The candidate does not intersect a visible source content object; acceptable for count exclusion only.

Source render: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c86-89/10c/pages/0086/page.png`
Source SHA-256: `8679c62f708b2090bf2ffafbb24fb865026c7d6743fa2a939c628634ab7fb2e3`

Crop: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c82-83-86-count/0086-bottom-x0-y2200-w1695-h380.png`
Crop SHA-256: `9a8990f65f8987ea50a29af1f05f8e0695578d50fa0c7e6cd1f7dda294c7d05c`

Scope closure: three separate PASS decisions concern this exact candidate rectangle on these hash-bound renders only. Any rectangle containing a source content object must be rejected. No mask applied, counts recomputed, source/code changed, finalization, assembly, rendering/browser, DB/git operation, binder, skill-host/grill or archive created. Only the three requested crops and this report were written inside the owned directory; other work was preserved.
