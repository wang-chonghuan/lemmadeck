# 10p n12 Independent Source Solutions

Status: source-solving stage complete; NOT written-adaptation, choice, key or package approval.
Recorded: 2026-11-15T17:03:45.002Z.
Blindness: no author choices, keys, solutions, Mencius author files or old choices/answers opened.
All five original exercises have no figure references. No source pixels or figures reopened.

## Bindings

- Original exercises: `/Users/yong/.codex/worktrees/00b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s2-n12/exercises.json`
  SHA-256: `098d1b143d7edfa2c5724b1acae09cbb26963d95b7a1227cbde1324fa03cde02`.
- Original lesson, already retained source context: `/Users/yong/.codex/worktrees/00b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s2-n12/lesson.json`
  SHA-256: `92b1bc1bcc57667dbd9f47463dc7104d3390a0a1964e798fd852c913c3fb50b4`.
- Previously passed modern prose, hash-only reuse in this stage: `/Users/yong/.codex/worktrees/00b1/lemmadeck/.tmp/ld-s10y-lesson/adapt/10p/modern-us-neutral/lessons/phy10-c1-s2-n12/lesson.template.json`
  SHA-256: `cab44aa5c4a93f8d923fe3297860c2be2142f1510880e0928eb6fc5c61333ed4`.

Read rules: `ld-s10y-choice/SKILL.md`, `references/review.md`, `references/contract.md`, and `ld-s10y-answer/references/gate-2-lesson-answers/gate.md`.
Solutions below are independent symbolic reasoning, not copied book answers.

## 1. Frequency Increase At Fixed Displacement Amplitude

Location: `/exercises/0`, number `1`, group `g1`, source `p0038#4`.
Task: frequency increases by one original frequency; displacement amplitude stays fixed.

For simple harmonic displacement $x=A\cos(\omega t+\phi)$, $v_{\mathrm{m}}=\omega A$ and $a_{\mathrm{m}}=\omega^2 A$, with $\omega=2\pi f$.
Thus doubling frequency gives $v_{\mathrm{m,new}}=2v_{\mathrm{m,old}}$ and $a_{\mathrm{m,new}}=4a_{\mathrm{m,old}}$.

Wording distinction: the final amplitudes are respectively **2 times** and **4 times** their originals. The increases themselves are **1 times** and **3 times** the original amplitudes. A later view/key must distinguish "becomes ... times" from "increases by ... times."
These are nonnegative amplitudes, not signed instantaneous velocity or acceleration. Fixed amplitude and simple harmonic motion are essential.

## 2. Decreasing Displacement

Location: `/exercises/1`, number `2`, group `g1`, source `p0038#5`.
Task: how velocity and acceleration change when displacement decreases.

For a fixed simple harmonic motion, $a=-\omega^2x$ and $v^2=\omega^2(A^2-x^2)$.
If "displacement decreases" means **distance from equilibrium decreases**, $|x|$ decreases: speed $|v|$ increases and acceleration magnitude $|a|$ decreases. This describes approach to equilibrium from either side.

If it means **signed coordinate $x$ decreases** along a monotone portion, $v<0$ and signed acceleration increases. Signed velocity is not globally increasing or decreasing:
- On the positive side moving toward equilibrium, $a<0$, signed velocity becomes more negative, speed increases, and acceleration magnitude decreases.
- On the negative side moving away from equilibrium, $a>0$, signed velocity becomes less negative, speed decreases, and acceleration magnitude increases.
- At the intervening equilibrium crossing, acceleration is zero and speed is maximal.

Ambiguity: the source does not distinguish signed displacement/velocity/acceleration from their magnitudes or identify the side/direction. There is no single unrestricted answer about both signed quantities. A later view must specify its interpretation; do not silently equate decreasing $x$ with decreasing $|x|$.

## 3. Pendulum Clock In Summer Or Winter

Location: `/exercises/2`, number `3`, group `g1`, source `p0038#6`.
Task: compare the rate of a pendulum clock between seasons.

Conditional model: the same uncompensated clock has an effective pendulum length that increases with temperature; gravity, amplitude regime, calibration and other timing effects remain unchanged.
Then $T\approx2\pi\sqrt{\ell/g}$: longer effective length gives longer period and slower clock rate. Cooler conditions shorten the pendulum and give a faster rate. Under these assumptions, **winter is faster than summer**.

For positive expansion coefficient $\alpha$, $\ell_{\mathrm{warm}}/\ell_{\mathrm{cool}}\approx1+\alpha\Delta\vartheta$, so $T_{\mathrm{warm}}/T_{\mathrm{cool}}\approx\sqrt{1+\alpha\Delta\vartheta}>1$. Here $\alpha\Delta\vartheta$ is dimensionless.
Season names alone do not establish temperatures, expansion behavior or lack of temperature compensation. No numeric clock error or universal claim about all clocks follows from the source.

## 4. Mass-Independent Spring Frequency Premise

Location: `/exercises/3`, number `4`, group `g1`, source `p0038#7`.
Task as retained: explain why the oscillation frequency of an object on a spring is independent of its mass.

**Confirmed mathematical premise defect:** for the earlier ideal mass-spring model with fixed stiffness $k$, $m\ddot{x}=-kx$, hence $\omega_0=\sqrt{k/m}$, $f_0=\sqrt{k/m}/(2\pi)$ and $T=2\pi\sqrt{m/k}$.
Frequency therefore depends on mass: quadrupling $m$ at fixed $k$ halves frequency and doubles period. Vertical gravitational loading shifts the equilibrium but does not remove this dependence.

There is no correct affirmative explanation of the retained premise under this model. Do not substitute the mathematical pendulum's mass-independent frequency or invent an intended source correction. Co-varying $k$ in proportion to $m$ could preserve frequency, but the source does not state that comparison.
Later modern wording/standards must explicitly handle the source error and retain the frequency-versus-system-properties task, rather than teach or key the false premise.

## 5. Equal-Radius Pendulum Bobs With Different Masses

Location: `/exercises/4`, number `5`, group `g1`, source `p0038#8`.
Task: compare damping of lighter and heavier equal-radius bobs on equal-length strings.

Conditional answer: **the lighter bob loses a larger fraction of its oscillation amplitude in the same time**, assuming the same effective pendulum length, comparable initial amplitudes, the same air/shape/surface conditions, equal drag at matched speeds, negligible unequal pivot losses, and an underdamped regime for both.

For small-angle motion with the same linear tangential drag coefficient $b>0$,
$m\ell^2\ddot{\theta}+b\ell^2\dot{\theta}+mg\ell\theta=0$.
The underdamped envelope is $A(t)=A(0)e^{-bt/(2m)}$, provided $b/(2m)<\sqrt{g/\ell}$. Thus smaller $m$ gives faster normalized envelope decay and shorter decay time $2m/b$.
At matched amplitude/speed, the larger mass stores more mechanical energy while comparable air resistance removes comparable mechanical work, explaining the different fractional decay.

Ambiguity/limits: equal radius alone does not establish equal effective damping coefficients or isolate air drag from support friction. Other mechanisms can change the comparison; for example, a frictional torque proportional to bob mass need not yield greater fractional decay for the lighter bob.
Do not generalize this answer to fastest settling for arbitrarily strong damping. In the overdamped linear model, the slow return rate approaches $mg/(b\ell)$, so stronger damping per mass can suppress oscillation yet slow return to equilibrium. No unconditional winner, exact decay constant, period or finite stopping time follows without the stated model.

## Next Review Stage

Receive the modern seed/frozen written adaptation and learner-visible views first. Review fidelity, redundancy, leakage, complete option truth sets and five-source coverage while still blind to internal draft/keys. Compare internal reasoning and read-only standards only after that blind review is recorded.
For open explanatory written responses, require meaningful display answers but do not invent automatic correctness judging; answer-gate runtime checks are outside this source-solving stage.
Only this note was written. No source/prose/figure review repeated, no author/content edits, and no pipeline, DB/network/API, model calls, tests or other-chat messages.
