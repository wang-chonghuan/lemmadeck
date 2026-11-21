# Independent Stage 1 freeze

ROOT: /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck
Reviewer: this fresh session; no candidate, previous report, screenshot, or
author solution was read before this freeze. Source image views: exactly one.

## Bindings

- Scope SHA256: 3c0291fd5ca129687fe5f510a150c5e50ec00616126c81d1f1beaa01ce5c986b
- Original 10c/figures/fig-13.png: a30cdcdf8c7213a6d1544a427405f6e5ebd292cfc063383ae55345d79f22b989
- Approved n81 lesson.json: 08f28c1f3356435f58a8eba12c7691abb2bf01836cdb0e7380068c9accb65ce6
- Approved n81 exercises.json: 7a2b399482b34db36025d408b362ed9fa0506876cda74a52276d2de2771e6988

## Independent source inventory

1. A single shared Cartesian frame, horizontal x axis and vertical y axis,
   positive-direction arrowheads, x/y labels. No grid, point markers,
   measurements, auxiliary panels, or filled regions.
2. Two equal-height, equal-period sinusoidal curves. The thick solid curve is
   labelled y=sin(x-pi/3) by a pointer to its central positive arch. The dashed
   curve is labelled y=sin x by a pointer to its rising right-hand branch.
   Each displays three crests and two troughs within finite source crops.
3. Dashed sin x rises through the axes' crossing. The solid curve lies below
   the x axis there and rises through the first positive zero, whose x value
   is printed pi/3. Every corresponding solid crest/trough is to the right
   of the dashed crest/trough.
4. Vertical values 1 and -1 identify the common crest/trough heights. The
   origin has a round glyph adjacent to the crossing; its printed codepoint
   O versus 0 is UNKNOWN. Its geometric identity as (0,0) is not unknown.
5. The crop has unlabelled finite left/right ends. No exact x coordinates at
   those ends, and no extra endpoint data, can be recovered from this view.

## Independent mathematical expectations

Approved text defines g(x)=f(x+a); a=-pi/3 in figure 13 requires a rightward
translation by pi/3. For f(x)=sin x, g(x)=sin(x-pi/3). The curves must retain
amplitude 1 and period 2*pi, with their solid/dashed formula associations.
The base curve passes through (0,0); the shifted curve has g(0)=-sqrt(3)/2,
and passes through (pi/3,0). Corresponding extrema and zeros differ in x by
pi/3, not in y. These values are derived mathematical checks, not additional
source labels or exercise answers.

The edition's Ox/Oy nomenclature can justify an editorial name O for the
known origin, but cannot establish the scan's original codepoint. Such an
addition must be declared outside the printed-source object group, anchored
to the actual axis intersection, and clearly distinguishable from pi/3,
1, and -1. A question mark or fabricated coordinate is not acceptable.
No acceptance decision about a candidate has been made at Stage 1.

## Image ledger so far

1. Original 10c/figures/fig-13.png, full supplied PNG, one view.

Status: FROZEN before Stage 2; review remains OPEN.
