# N37 Independent SOURCE-FIRST

Phase: independent source solving completed; awaiting ONLY learner views.
This is not a semantic approval, a native review, or a validation result.
No draft, view, author intent, option, key, standard answer, old choice,
keyboard, test, other reviewer's FIRST, or author-inflight output was read.

## Exact Input Binding

- Sole command cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
- Sole output root: that cwd plus
  `.intentfold/tickets/STEMROBIN-188/tmp/n37-choices-independent7`.
- Only mathematical seed: that cwd plus
  `.intentfold/tickets/STEMROBIN-188/tmp/n37-choices7/seed.json`.
- Canonical seed SHA-256:
  `50d4be02cf0dba4e990514fddadc3c9f7268e54d39e174a86e86ef1ff9d5b02d`.
- Raw seed file SHA-256:
  `3ced96036405ee84da7bb022e3f000f118588285a8374b9bff15b707870dd675`.
- Book `6-8g`; lesson `geo68-c3-s2-n37`; all nine written tasks
  479--487; definition blocks 0, 3, 4, 5; concept figure fig-229.
- Exact figure paths, bytes, seed trace bindings, rule hashes and capture
  receipt are recorded in `source-review.json`. The trace files themselves
  were not opened: their bindings are supplied by the authorized seed.

## Definitions and Derived Relations

The angle between two directions is a magnitude, not a diagram. Translate
rays to any common starting point and take the convex, non-reflex angle.
Changing the common starting point changes neither directions nor magnitude.
Identical directions give 0 degrees; opposite directions give 180 degrees.
Do not substitute the acute angle between supporting lines for this magnitude.

Block 0 supplies the direction-preserving translation of both sides from O
to O_1. Block 3 defines the common-origin direction angle and explicitly
permits 0 degrees. Block 4 concludes congruence for corresponding sides with
the same directions. Block 5 selects the convex angle rather than the reflex
angle and separates angle magnitude from the particular drawn figure.

For a convex magnitude theta, reversing both side directions preserves theta:
a half-turn is an isometry. Reversing just one side gives 180 - theta:
the translated rays form a linear pair. Merely being parallel does not say
which of these direction relationships holds. Rotating both directions by
the same quarter-turn also preserves theta. With perpendicular corresponding
sides, independent choices of perpendicular ray directions can instead give
180 - theta; the same-type hypothesis in 487 is essential.

## Actual Figure Observations

Each current seed SVG was navigated once and captured once in one isolated
headless Chromium session; the session was closed before any image was
opened here. Each own screenshot was then viewed once, without crops or
reopens. All three screenshots show the complete figure, including rightmost
and bottommost labels and ray/line ends. These are direct captures of the
seed SVGs, not choice-candidate diagrams or original-page images.

- fig-229: SVG SHA-256
  `fbb24f5c3655702d5f5a59bf6aa38faad5db857834ba7591353fe31e61f2b971`.
  The complete 480 x 480 image contains O, O_1, A, A_1, B, B_1.
  OA and O_1A_1 point up-right; OB and O_1B_1 point down-right.
  Both marked convex sectors are the wedges between these paired directions.
  The connector from O toward O_1 depicts the change of vertex, not a third
  side defining either angle. Rightmost B and bottommost OB are visible.
  Own preview `fig-229.png`, SHA-256
  `aed27c6a730fd5acb479297935541797d7b1b9bd80e96667760e1cd3e1eaa3d0`.
- fig-230: SVG SHA-256
  `a06e50e1f3d6b60b70f8f5bfb62b972c600a0c352fad35674fba73e5d72ec72a`.
  The complete 480 x 400 image has the upper horizontal A--P--B and
  lower horizontal C--Q--D. The rising transversal has order M--Q--P--N.
  At P the four outgoing directions are PA left, PB right, PN up-right,
  PM down-left; at Q they are QC left, QD right, QN up-right, QM down-left.
  Both right ends B/D and the bottom M/transversal end are visible.
  Own preview `fig-230.png`, SHA-256
  `c513d97f7ebc232fcae90c15a473699c3bec53e01f24e5162fe094dfd99760ae`.
- fig-231: SVG SHA-256
  `f5bf96cbcdb8482be898f80194e90bbdaac212cedd599a1fdfba7383f9294b8c`.
  The complete 480 x 400 image has A--B--C on the upper horizontal,
  F--D--E on the lower horizontal, and R--B--D--P on the descending
  transversal. The marked alpha is the lower-right sector at B, between
  BC and BD (also BP). At D, DR/DB point up-left and DP points down-right.
  C/E at the right and P with its ray end at the bottom are visible.
  No numeric alpha is given; no angle was measured from pixels.
  Own preview `fig-231.png`, SHA-256
  `9093e447a35c99cb39ebee7e9f5ed90643e8ef5985aeb80e15a3f63af1cdbbc5`.

Existing unchanged source-fidelity/math/visual figure PASS is reused under
the user's explicit authorization. No new figure gate, original PNG review,
spec reading, inventory reading, or geometry rendering was performed.
The observations above independently support the current mathematical tasks.

## Independent Solutions

### 479

Use ray direction, not just supporting-line parallelism. The four pairs of
ordinary sectors with both corresponding sides in the same directions are:

| At P | At Q | Matched directions |
| --- | --- | --- |
| angle APN | angle CQN | left; up-right |
| angle NPB | angle NQD | up-right; right |
| angle BPM | angle DQM | right; down-left |
| angle MPA | angle MQC | down-left; left |

These exhaust the four sectors at each crossing. Endpoint order in an angle
name may be reversed without changing its magnitude. At P, PQ and PM are
the same ray; at Q, QP and QN are the same ray, so such names are aliases,
not extra sectors. If straight direction-pairs are included, APB/CQD and
NPM/NQM each represent 180 degrees; they add no ordinary crossing sector.
Vertical-sector partners also have equal magnitudes but have both directions
reversed, so they do not answer the requested same-direction relation.

### 480

Keep case 2 literally "M is not on one side of angle AOB." Do not replace
this with "M lies on neither side." No choice of the unnamed side, no
off-both-sides requirement, and no new exclusion is needed.

Let u = A - O and v = B - O. At the prescribed point M:

1. Case 1, same directions: X = M + u, Y = M + v. Rays MX and MY have
   respectively the OA and OB directions even when M lies on one side.
2. Case 1, opposite directions: X = M - u, Y = M - v. Both directions
   are reversed, so the convex angle still has the original magnitude.
3. Case 2, same directions: the identical construction M + u, M + v
   works without strengthening the literal location wording.
4. Case 2, opposite directions: the identical construction M - u, M - v
   also works under that literal wording.

In geometric construction terms, draw the two supporting lines through M,
parallel to or coincident with the old supporting lines, and orient the rays
as required. Case 1 works on either OA or OB; if M = O, use the original
rays or their opposite rays. It also works if M lies beyond A or B:
MA or MB need not then point in the required direction. Under the literal
case 2, M on the other side, M on a backwards extension, and M off both
sides all require the same general construction; they are examples, not
extra premises. Connecting M to A and B does not generally translate the
two directions. A coincident support must not be rejected merely because
strict distinct-line parallelism would be inapplicable.

### 481

Since B lies between A and C, write A = 0, B = b, C = c with 0 < b < c
along their line. AB and BC both point in the positive direction, so case
1 is 0 degrees. CB points in the negative direction, so AB versus CB in
case 2 is 180 degrees. Different ray origins do not change direction angle.

### 482

For the drawn rays AB and CD, set u = B - A and v = D - C. Through the
specified M draw MX with direction u and MY with direction v. The convex
angle XMY is the required angle between the two given directions by blocks
0, 3 and 5. Through-M supports may coincide with existing supports.

This construction works for arbitrary ray origins and relative positions.
Equal directions give 0 degrees, opposite directions give 180 degrees,
and perpendicular directions give 90 degrees. No specific numerical angle
is supplied. Reversing both constructed rays is another valid equal-angle
construction; reversing only one generally gives the supplement and fails
unless the required magnitude is 90 degrees. MA and MC are not generally
parallel in the required senses to AB and CD.

### 483

Translate the first convex angle's vertex to the second vertex without
changing either side direction. A half-turn about that common vertex then
reverses both side directions, mapping the first angle onto the second
angle. Translation and half-turn preserve magnitude, proving congruence.
Equivalently, the resulting opposite sectors are vertical angles. Both
reversed directions preserve theta, not 180 - theta.

### 484

Translate to a common vertex and identify the pair of sides with the same
direction. The other two sides are opposite rays on one line. The two
convex angles are a linear pair, so theta + phi = 180 degrees and
phi = 180 - theta. This proof applies whichever correspondence is chosen
for the same-direction pair. They are not generally congruent: 60 and 120
degrees satisfy this relation; congruence occurs in the 90/90 special case.

### 485

1. South and west: 90 degrees, one quarter-turn.
2. South and north: 180 degrees, opposite directions.
3. East and southeast: 45 degrees, half of the east-to-south right angle.

Take the non-reflex magnitude. East to southeast is not the 315-degree
reflex turn. The usual southeast compass direction bisects east and south.

### 486

Read the actual fig-231 sectors, together with the given AC parallel FE.
At B, BC points right and BD/BP down-right; at D, DE points right and
DP down-right. BA/DF point left and BR/DR/DB point up-left.

1. There are four geometric sectors equal to alpha, including the marked
   sector: angle CBD (alias CBP), angle ABR, angle EDP, and angle FDR
   (alias FDB). CBD and ABR are vertical angles at B. EDP corresponds
   by same directions to CBD; FDR corresponds by same directions to ABR
   and is vertical to EDP. If "the angles" means angles other than the
   marked one, the three other sectors are ABR, EDP and FDR. Reversing
   endpoint order or using B instead of R on ray DB creates only aliases.
   The remaining four sectors CBR, ABD, RDE and FDP are 180 - alpha.
2. a) BC versus DE: 0 degrees, because both point right.
3. b) BC versus DF: 180 degrees, because right and left are opposite.
4. c) BA versus DR: alpha, the same direction pair as DF versus DR,
   hence the sector FDR.
5. d) BR versus DE: 180 - alpha, since BR has the DR direction and
   DE is opposite to DF. It is the obtuse sector RDE, not alpha.

Do not infer a number for alpha from the drawing or use letter order to
replace actual incidence and direction observations.

### 487

The literal hypothesis is two acute angles OR two obtuse angles: both
angles must have the same type. It does not mean one acute and one obtuse.
Let theta be the first convex angle magnitude and let J denote a
counterclockwise quarter-turn. Corresponding perpendicular side directions
have the form s1 Ju and s2 Jv, with each sign independently +1 or -1.

If the signs agree, both sides underwent the same quarter-turn (or the same
opposite quarter-turn), so the second magnitude is theta. If the signs
disagree, one side is reversed after a common quarter-turn, so the second
magnitude is 180 - theta.

1. Both acute: 0 < theta < 90. Its supplement is obtuse, which is ruled
   out by the second angle also being acute. Thus the second magnitude
   must be theta.
2. Both obtuse: 90 < theta < 180. Its supplement is acute, which is ruled
   out by the second angle also being obtuse. Thus again the second
   magnitude must be theta.

This proves both branches. Swapping the side correspondence changes no
unoriented convex angle magnitude. For a concrete counterexample to omitting
the same-type hypothesis, use first directions 0 and 30 degrees and second
directions 90 and 300 degrees. Corresponding supports are perpendicular,
but the convex magnitudes are 30 and 150 degrees, not congruent.

## UNKNOWN and Execution Accounting

- Literal star in `487*`: role UNKNOWN; not a difficulty or mathematical
  condition inferred by this reviewer.
- C-speck/microscopic mark role: UNKNOWN; no new point, incidence,
  measurement or source condition is inferred. No crop was opened.
- Alphabet/letter-order role: UNKNOWN; letter names alone imply no order,
  adjacency or answer clue. Geometric order above comes from the actual
  rendered lines and intersections.
- Case-480 wording is not strengthened. The construction is independent
  of the potentially unnamed side and requires no added interpretation.
- These nonmathematical UNKNOWNs do not prevent the stated source solutions.

Source tasks solved: 9/9. Explicit requested case units: 20/20
(479: 1; 480: 4; 481: 2; 482: 1; 483: 1; 484: 1; 485: 3;
486: 5; 487: 2). This count does not assess any future draft's coverage.

Images in the initial and only batch/context: 3. Per-batch maximum: 8;
per-context maximum: 24. Actual SVG navigation/capture counts: 1 each;
actual screenshot view counts: 1 each. Direct SVG image-open attempts: 0;
failed image/capture attempts: 0; crops: 0; reopens: 0; original PNGs: 0;
external approved previews: 0. No need to open the subsequently mentioned
approved previews; all existing observations were preserved.

Execution recoveries, retained without resetting counters:

1. Initial raw-file SHA was mistaken for the contract's canonical JSON
   digest. The successful native digest-only command confirmed the exact
   authorized canonical digest. This was not seed drift or content failure.
2. Reading `.agents/skills/playwright-cli/SKILL.md` failed with ENOENT.
   The installed skill at
   `.agents/skills/node_modules/playwright-core/lib/tools/cli-client/skill/SKILL.md`
   was then read successfully, from the same authorized cwd.
3. Resolving installed `playwright` failed with MODULE_NOT_FOUND.
   The existing `playwright-core` runtime resolved successfully and was used
   without installing, updating or changing any dependency.

Failed shell invocations: 2. Failed image attempts: 0. Browser sessions:
1 opened, 1 closed; network requests: 0. Paid/model calls: 0. New geometry
renderers/specs: 0. Figure gates: 0. Native validator runs: 0.
No product/DB/.env/git/shared/canonical writes, peer messages, replacement
chat or worktree, or draft-author searches were made.

Next permitted phase: receive ONLY views first, then judge task fidelity,
redundancy and leakage and independently solve every visible option before
any author intent/key disclosure. Remain waiting; no semantic approval yet.
