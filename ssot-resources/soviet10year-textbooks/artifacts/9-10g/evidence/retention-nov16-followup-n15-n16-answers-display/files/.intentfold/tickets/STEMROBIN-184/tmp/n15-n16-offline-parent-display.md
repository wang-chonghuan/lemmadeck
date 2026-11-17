# n15/n16 Offline Display Closure

2026-11-16, STEMROBIN-184. This records actual inspection, not a new source or
figure-fidelity review.

n15's independent reviewer inspected eight first-pass images and found the
159 circle-prefix defect. Its complete report and first screenshots are
retained unchanged. n16's parent inspection used four first full desktop/mobile
text and exercise screenshots plus four existing mobile figure scroll-end
images. It observed the same prefix defect at164/165. No missing figure,
unreachable end, label collision, or other new layout defect was observed.

The generic prefix consumed the circle without the following period and placed
a baseline circle after the number-column period. The renderer's targeted
replacement recognizes an exact matching Unicode-circle prefix and renders
the number and circle together as mathematical superscript notation. Existing
ordinary/star/LaTeX prefix behavior is retained.

The12 focused fixtures passed. Both affected exercise-only desktop/mobile
checks passed; all four repaired full exercise screenshots were opened by the
parent. The source marker is now beside the number, not wrapped underneath,
and no period remains at the body's start. Text HTML hashes and all protected
lesson/exercises/figures/audit JSON hashes are unchanged. No source or formula
was edited. First-pass reports still say mechanical PASS but retain their
actual rejected visual state; the new report is prefix-repaired-report.json.

Current n15:14 rendered prose paragraphs,5 written exercises, two referenced
figures. Actual scroll media width640 and text28px; mobile start/end maxima
282 in prose and330 in exercise. Current n16:13 rendered prose paragraphs,
4 exercises,4 prose figures; media640 and text22px, mobile scroll maxima282.
Machine reports confirm no whole-page overflow, clipped labels, remote assets,
KaTeX errors, or answer-input controls.

This closes permitted offline read-only layout only, not product UI, judging,
persistence, headed/OS behavior, or formal ticket acceptance. Prior unauthorized
headed figure-only fragments are historical evidence, not approved acceptance.
No browser rerun beyond the affected exercise pages was made.

Parent image ledger this continuation: inherited7 plus8 n16 first-display
images plus4 repaired exercise images =19/24. This batch's8 n16 images and the
separate4-image affected inspection stay within the8-image limit. No images
from the n15 independent review were reopened wholesale.
