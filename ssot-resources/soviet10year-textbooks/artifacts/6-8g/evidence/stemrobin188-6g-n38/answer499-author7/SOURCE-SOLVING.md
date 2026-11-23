# Exercise 499: independent source solving

Scope: STEMROBIN-188, offline, author only, finish=review.
Sole checkout: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188.
This solution was completed before creating candidate-answer-keys.json.
No prior answer, standard, choice or reviewer file was consulted.

## Authoritative problem and bindings

Book: 6-8g. Lesson: geo68-c3-s2-n38. Edition: modern-us-neutral.
Exercise: 499, source reference p0177#11, figure fig-238.
Given: $(MN)\parallel(KL)$.
Prove: $\widehat{ABC}=\widehat{NAB}+\widehat{BCL}$.
There are no numerical angle, length, perpendicularity or equality givens.

All paths below are relative to the sole checkout.

- Modern exercises: .tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n38/exercises.template.json
  SHA256: ebb0a3a864771163705b9c6f441deedbab5d1e611992e63439da11c328784f60
- Exact modern 499 text, UTF-8 SHA256: 19ddfa75866beacec52dd341404cf9c14763266c7e50d720e7e8b9aba3117bdb
- Modern lesson prose: .tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n38/lesson.template.json
  SHA256: 9f61dabc64e3545533685aa2026402ccc7431ca42e78d791532b7c264bae5d9b
- Original exercises: ssot-resources/soviet10year-textbooks/artifacts/6-8g/lessons/geo68-c3-s2-n38/exercises.json
  SHA256: 72f5ec00aeac44328f9988db53e0db0720278075edb71699f20f3db3fe42086e
- Original 499 text, UTF-8 SHA256: 2aaa2afc35675bd24d844efe2a2c2d14e0bcb0a98d183ddd7200a3f6ae0eca22
- Original lesson: ssot-resources/soviet10year-textbooks/artifacts/6-8g/lessons/geo68-c3-s2-n38/lesson.json
  SHA256: 85d228b7863c10e57a14d03bc8dc27e3bc6130f6b917745bc398a184d73d75b1
- Original figure: ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-238.png
  SHA256: 5144e3c7d6b7db54d0ea08d95963e67eb890c310a3b2a342878406ecf5013bfc
- Candidate spec: ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38/fig236238-author7/fig-238.spec.json
  SHA256: 5f05c845a32b6dd7a985cac0613ec807bfe4b334afeb14d1bd4b6cecce8948ff
- Actual complete preview: ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38/fig236238-author7/fig-238.complete-preview.png
  SHA256: 11c3826798d6efc7b82d8b789acd3ec1e416ca54741589adfc8e5a442d101e9e

The original source hashes agree with both templates' embedded source bindings.
Relevant modern prose was read at p0174#6, p0174#10/p0174#12,
p0174#13, p0174#14, p0174#15/p0175#1, p0175#4 and p0175#7:
triangle angle sum, construction of a parallel through a vertex, equality of
angles from paired ray directions, angle addition and the exterior-angle proof.

## Actual incidence, directions and uncertainty

The original PNG and actual complete preview were each successfully viewed once.
Their shared geometry has upper order M-A-N and lower order K-C-L.
A lies on MN, C lies on KL, and B lies strictly between the two lines and to
the right of both junctions. AB runs down-right; CB runs up-right.
Thus AN and CL run rightward; BA runs up-left and BC runs down-left.
The angle ABC in this problem is the non-reflex angle opening to the left.
The source contains no auxiliary parallel through B or solved angle values.

M, N, A, B, C, K and L are the modern prompt's Latin role labels, not a
claim to have identified the original printed alphabet or character encoding.
Original glyph alphabet/code/Unicode identity and fine-mark/blackbar identity
remain UNKNOWN. No old Unicode glyph or extra mathematical given is inferred.
Spec coordinates were used only to check the pictured ray orientation; they
are layout data, not measurements or givens of the exercise.

## Complete independent proof

Through B construct a line parallel to MN (hence also parallel to KL).
Choose a new point D on its leftward ray, so BD points in the same direction
as AM and CK, not as AN and CL. D is a proof construction, not a source label.
Since BA goes up-left and BC goes down-left, this leftward ray BD lies
strictly inside the non-reflex angle ABC. Therefore

$$\widehat{ABC}=\widehat{ABD}+\widehat{DBC}.$$

With AB as transversal of MN and BD, angles NAB and ABD are alternate
interior angles, so $\widehat{ABD}=\widehat{NAB}$. In ray terms, BA is
opposite AB and BD is opposite AN; reversing both rays preserves the angle.

With BC as transversal of BD and KL, angles DBC and BCL are alternate
interior angles, so $\widehat{DBC}=\widehat{BCL}$. Here BC is opposite CB
and BD is opposite CL, again reversing both sides rather than just one.

Substitute both equalities into the angle-addition equation:

$$\widehat{ABC}=\widehat{NAB}+\widehat{BCL}.$$

This proves the specific assertion for the actual source configuration.
Choosing the rightward ray through B would not split this angle and would
give supplementary angles; it is not the construction used in this proof.

## Handoff boundary

Derived proof; grading=ungraded; parts=[]; read-only author draft.
No bookRaw is asserted: this assignment explicitly identifies a missing answer.
No other exercise was solved. The first template dump inadvertently printed
embedded source entries for adjacent exercises; these were not used or solved,
and the narrowed extraction was then used for 499 and relevant prose only.

The supplied bare complete-preview.png path did not exist. Discovery was
limited to the designated figure-author directory, and its actual
fig-238.complete-preview.png matched the supplied hash. Nothing was rendered.

Native figure PASS is caller-reported; independent image approval is pending.
This is not independent answer review, a full-lesson coverage gate, native
finalization, promotion or publication. Final native binding and independent
review remain with the parent. Seal this file to mode 0444 before candidate
creation.
