# STEMROBIN-188 N37 - two diagram-answer comparisons

Date: 2026-11-23. Status: pass.
Scope: actual candidates 479/486, selected canonical/native prompts, their
current specs, and two retained modern previews. FIRST is reused, not replaced;
no source solve, original-image reopen, seven-standard rereview or choice read.

## Exact bindings

Every command cwd is
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188` (W).
Owned root remains
`W/.intentfold/tickets/STEMROBIN-188/tmp/n37-content-independent7`.
Let B be `W/ssot-resources/soviet10year-textbooks/artifacts/6-8g`,
N be `B/evidence/stemrobin188-6g-n37`, and
E be `B/editions/modern-us-neutral`.

Actual inputs, SHA-256:

- `N/answer479486-author7/candidate-answer-keys.json`
  `51ec61e256de0d0f66ce8065194c4bb0ebce72512053ffad176974d0c3f86430`
- `N/answer479486-author7/modern-view-recovery7.json`
  `a2c17eae6b0910545307d0e3767415ec98f2a48c74c00f9dc7e0ac0bc8f96f69`
- `E/lessons/geo68-c3-s2-n37/exercises.json` (selected 479/486 only)
  `ad5b62e04d1f9d14825d32255127af2101cbec2955f403a361534ee82ae354b2`
- `W/.tmp/ld-s10y-answer/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n37/answer-keys.template.json`
  (selected prompt/evidence only)
  `cdecea8b9148684f512147240a5bfdac82fef8a48758ff5fdeae586b7af8482d`
- `E/figures/fig-230.spec.json`
  `8dcb640d0cbb3132983c7970c56cbb655a01b20ee29682e5ad010c564370bfb2`
- `E/figures/fig-231.spec.json`
  `e4d86df3e3718724828c281720367db68921529b07db85e2282a9e9519a70220`
- `E/figures/fig-230.svg` (hash only, no direct image view)
  `a06e50e1f3d6b60b70f8f5bfb62b972c600a0c352fad35674fba73e5d72ec72a`
- `E/figures/fig-231.svg` (hash only, no direct image view)
  `f5bf96cbcdb8482be898f80194e90bbdaac212cedd599a1fdfba7383f9294b8c`
- `N/fig229231-author7/fig-230.preview.png`, 480 by 400, opened once
  `e20573c7c8b491d510d860c610d1ea57a83c738f54364648964424d9b40f914e`
- `N/fig229231-author7/fig-231.preview.png`, 480 by 400, opened once
  `359c65735aea123532ed53caba03eef6993d533edec23f13ca800fd1adaff07a`

The disclosed candidate and supplement digests match the human-supplied
digests. Each candidate prompt exactly equals the selected canonical text,
native prompt, and spec authoritativeText. Its figureEvidence exactly equals
the selected native evidence. Spec source PNG hashes match FIRST without
opening those original PNGs.

The actual preview, SVG and current spec digests match the supplied supplement.
The preview/SVG relationship is explicitly supplied by the caller and retained
evidence; hash equality alone is not treated as visual approval. The reviewer
actually opened both PNG previews. No SVG conversion, browser or native tool
was used, and no unsupported direct SVG viewing was attempted.

The supplement is author-only technical recovery, not independent answer
approval. Its separate author image-attempt counts are not this reviewer's
counts. Its original failure/history files and author source seal were not read.

## Actual modern observations and candidate comparison

**479 / fig-230 - pass.**
The actual modern preview has two clean horizontal rows, upper A-P-B and
lower C-Q-D, crossed by a rising-right diagonal ordered M-Q-P-N.
All eight labels are readable. No angle numbers, solution sectors or right-angle
marks are present. These positions agree with FIRST's retained source observations
and the spec's relationships; coordinates are modern layout, not source lengths.

All four candidate pairs match the frozen solutions:

1. APN/CQN: left and up-right corresponding sides.
2. NPB/NQD: up-right and right corresponding sides.
3. BPM/DQM: right and down-left corresponding sides. At P, PM is the same
   ray as PQ, so BPM is FIRST's BPQ sector.
4. MPA/MQC: down-left and left corresponding sides. MPA is FIRST's QPA
   sector because PM and PQ coincide.

The explanation supplies both side correspondences for all four sectors and
uses the common-vertex translation conclusion correctly. Equality alone or
opposite-direction equal angles are not substituted for the requested property.

**486 / fig-231 - pass.**
The actual modern preview has upper A-B-C, lower F-D-E, and descending-right
diagonal R-B-D-P. D is a visible dark crossing. The sole arc and readable
modern alpha occupy the sector between BC and BD, right/below B.
C is plain, with no extra prime or point. No numeric angle, additional angle
arc, perpendicular condition or solution annotation appears.

Part 1 matches all four FIRST sectors: CBD, ABR, EDP and FDR.
The candidate correctly gives CBP and FDB as aliases of CBD and FDR rather
than extra sectors: BD/BP coincide at B and DR/DB coincide at D.
Its vertical/corresponding-angle explanation is valid for the actual drawing.
The frozen special-case boundary remains: if alpha=90 degrees the
supplementary sectors also have that magnitude; no numeric/right-angle
premise is inferred from the drawing or spec.

Part 2 matches FIRST's complete ordered result:
BC/DE = 0 degrees; BC/DF = 180 degrees; BA/DR = alpha;
BR/DE = 180 degrees - alpha.
The candidate's translated second rays become BC, BA, BR, BC respectively,
so all four explanations and origins agree. Alpha remains symbolic.

Both actual keys are source=derived, grading=ungraded, parts=[], in a 0444
read-only candidate file. Their status remains draft. This is content comparison,
not answer finalization, keyboard/interaction work or runtime authorization.

## Nonblocking FIRST auxiliary-alias correction

The existing frozen FIRST contains an isolated countercheck spelling error:
it says DB reverses DR. The actual diagram, current spec, and candidate
correctly identify DB and DR as the same up-left ray from D.
The opposite ray is BD from B, when comparing directions; reversing DR at D
also gives the down-right direction of DP.

This affects only FIRST's auxiliary countercheck sentence, not its four alpha
sectors or ordered results 0,180,alpha,180-alpha. Replacing DR by DB does not
swap alpha and its supplement; replacing it by the opposite direction would.
The candidate needs no edit. This companion report records the correction;
SOURCE-FIRST.md and source-review.json are preserved byte-for-byte, not
rewritten or silently treated as correct on that auxiliary alias.
No original source or original image was reopened to make this comparison.

## Reuse, boundaries and counts

FIRST MD/JSON hashes remain:
`b31993fa620fb84a02f4d68df86e23af16c67ce95537724760014fdfed4e4914` /
`b3233e5dcb08d590a0289bf51192faac4e4a6c64097ee82bbd6ccd166dd4be0f`.
The prior seven-standard PASS and native-text-affected pass are reused, not
re-reviewed. All six earlier sealed review files remain unchanged.

Original glyph/alphabet identity, the original alpha-like glyph identity,
and C-speck role remain UNKNOWN. Modern Latin labels and modern alpha do not
retroactively resolve source pixels. No point, numeric alpha or condition
is invented. The original 487-star UNKNOWN is also retained.

Images: three originals inherited from FIRST, plus two modern previews in
this answer comparison = 5/8 batch and 5/24 context at that subphase.
The separate authorized TEXT display sidecar adds two full screenshots;
combined counts at sealing are 7/8 and 7/24. Each of the four new images
was opened once; all reopens and original reopens are zero. No counter reset.

Source/math re-solves, old seven-key/choice reads, native reruns, renders,
app/shared-code/env/DB/Git/worktree/browser/chat/peer/paid calls: zero.
No candidate, canonical asset, prior seal or recovery record was edited.
Only this MD and answer479486-review7.json are authored and sealed 0444.

Both disclosed answer candidates pass this bounded comparison. The separate
TEXT display result does not review exercise/answer presentation.
No new full figure gate or whole-lesson approval is issued.
