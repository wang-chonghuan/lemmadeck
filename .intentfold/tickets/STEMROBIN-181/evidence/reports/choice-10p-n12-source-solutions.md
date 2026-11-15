# 10p n12: Independent Original-Source Solutions

Status: independent source solutions ready; modern finalized lesson and prepare/seed authorization pending.

This is internal reasoning, not a choice seed, option draft, answer publication, or review. Only original written questions and relevant original lesson definitions were used. No previous choices, interaction/input configurations, answer files, author answers, history, or ticket outputs were consulted.

## Source Bindings

All paths below are relative to `/Users/yong/.codex/worktrees/00b1/lemmadeck`.

| Original file | SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s2-n12/exercises.json` | `098d1b143d7edfa2c5724b1acae09cbb26963d95b7a1227cbde1324fa03cde02` |
| `ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s2-n12/lesson.md` | `51e64a975f5eac306381ef4b4a66f958662b6f311df260098080e39f574fbfe9` |
| `ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s2-n9/lesson.md` | `dba3a2cd5a5c01b8ee76efaceee386f7b4c2af35b98a339522dbfcda01109162` |
| `ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s2-n10/lesson.md` | `61129c144adc70d69a705deb02f4de261ce4651104506f5ed86ca7b5db904874` |
| `ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s2-n6/lesson.md` | `5f097b2c72be9a9826c9e1fe0e7ba8801253b313534d6cefd7a2380d5c3c37cd` |

Definition basis, not solved examples:

- n6: frequency is reciprocal period; $\omega_0=2\pi\nu$.
- n9: signed velocity and acceleration are successive time derivatives; $v_{\mathrm{м}}=\omega_0x_{\mathrm{м}}$, $a_{\mathrm{м}}=\omega_0^2x_{\mathrm{м}}$, and $a_x=-\omega_0^2x$.
- n10: an ideal spring oscillator has $\omega_0=\sqrt{k/m}$ and $T=2\pi\sqrt{m/k}$; a small-angle simple pendulum has $T=2\pi\sqrt{l/g}$.
- n12: resistive forces do negative work, reducing mechanical energy and the displacement envelope. This qualitative definition does not specify a damping law or compare two systems' decay rates.

Internally write $A=x_{\mathrm{м}}>0$ and $v_x=\dot x$, reserving $|v_x|$ for speed. This shorthand does not edit original notation. Original exercise 1-5 all have empty figure references; no figure is needed for the deductions below.

## Source 1: Frequency Doubled, Displacement Amplitude Fixed

Original: "在振动频率增加 $1$ 倍时，速度和加速度的振幅各增加多少倍？假设位移振幅不变。"

Task: determine the joint scaling of the two amplitudes, not two unrelated numerical answers.

With $A$ held fixed and $\nu'=2\nu$, also $\omega_0'=2\omega_0$. The definitions give

$$
\frac{v_{\mathrm{м}}'}{v_{\mathrm{м}}}=2,\qquad
\frac{a_{\mathrm{м}}'}{a_{\mathrm{м}}}=4.
$$

Thus the amplitudes become twice and four times their previous values. Their increases, divided by their original values, are respectively $1$ and $3$. "增加多少倍" must not silently switch between these two ratios.

Conditions: ideal simple harmonic motion in each comparison; unchanged displacement amplitude. This concerns amplitudes, not signed instantaneous velocity or acceleration at an unspecified phase.

Response-unit intent: a native `single` judgment of one coherent pair of scaling relations, with the ratio convention explicit. Splitting it into two arithmetic clicks would lose the common frequency-dependence inference. No alternatives have been authored.

## Source 2: Signed Displacement Versus Distance From Equilibrium

Original: "简谐振动中当物体位移减少时，速度和加速度怎样变化？"

Task: relate instantaneous velocity and acceleration to motion through equilibrium, retaining the original ambiguity rather than guessing its intended convention.

From $x=A\cos(\omega_0t+\phi)$ and its derivatives,

$$
a_x=-\omega_0^2x,\qquad
v_x^2=\omega_0^2(A^2-x^2).
$$

These imply $|a_x|=\omega_0^2|x|$ and $|v_x|=\omega_0\sqrt{A^2-x^2}$.

If "位移减少" means the distance $|x|$ is decreasing toward equilibrium, speed increases and acceleration magnitude decreases. The acceleration points toward equilibrium. On the positive side, $v_x<0$ becomes more negative while $a_x<0$ rises toward zero. On the negative side, $v_x>0$ becomes more positive while $a_x>0$ falls toward zero. Thus speed increasing is not equivalent to signed velocity increasing.

If it means signed $x$ is decreasing, the body is moving in the negative direction away from turning instants. Signed $a_x$ increases as $x$ decreases, but signed velocity and speed do not have one monotonic trend over the entire leftward half-cycle:

- For $x>0$, $a_x<0$, so $v_x$ decreases and speed increases; $|a_x|$ decreases.
- At $x=0$, speed is maximal and acceleration is zero.
- For $x<0$, $a_x>0$, so $v_x$ increases toward zero and speed decreases; $|a_x|$ increases.

The velocity and acceleration amplitudes remain fixed throughout this ideal oscillation. Changing instantaneous displacement is not changing displacement amplitude.

Unresolved in the original wording: which displacement convention and whether "速度/加速度" refers to signed components or magnitudes. No unconditional pair of trends is justified.

Response-unit intent: native `multiple` is suitable for substantive, independently judged relations under an explicitly stated convention or branch. It must not become a succession of per-sign true/false clicks. The original ambiguous task cannot receive a unique key until the modern written seed states the convention; the analysis above solves both interpretations without choosing one silently.

## Source 3: Thermal Expansion and Pendulum Clock Rate

Original: "带摆的钟在夏天还是在冬天走得较快？"

Task: determine clock rate through the pendulum-length and period relationship.

For the ordinary intended model, the same uncompensated pendulum has positive thermal expansion, unchanged $g$, small swing angles, and the same gearing/calibration. Higher temperature increases its effective length. If $l_{\mathrm{summer}}>l_{\mathrm{winter}}$, then

$$
\frac{T_{\mathrm{summer}}}{T_{\mathrm{winter}}}
=\sqrt{\frac{l_{\mathrm{summer}}}{l_{\mathrm{winter}}}}>1.
$$

The summer pendulum completes fewer oscillations in the same real time, so the clock runs more slowly in summer and more quickly in winter.

Limit: seasons alone do not prove this for a compensated pendulum, temperature-controlled mechanism, or material with a different length-temperature response. Thermal expansion and lack of compensation are modeling assumptions, not facts supplied by the n12 damping definition. No numeric temperature, expansion coefficient, or clock error is inferable.

Response-unit intent: a native `single` judgment of the complete length -> period -> indicated-clock-rate explanation. A bare season label would omit the essential physical inference.

## Source 4: False Mass-Independence Premise

Original, retained as a quotation: "为什么弹簧上的物体振动频率与其质量无关？"

Task: critically assess the claimed independence against the original spring-oscillator definition; do not manufacture a justification for a false premise.

For the same ideal spring with fixed $k$,

$$
\omega_0=\sqrt{\frac{k}{m}},\qquad
\nu=\frac{1}{2\pi}\sqrt{\frac{k}{m}},\qquad
\frac{\nu_2}{\nu_1}=\sqrt{\frac{m_1}{m_2}}.
$$

Increasing attached mass therefore lowers frequency and lengthens period. The source question's asserted mass independence contradicts n10. The small-angle ideal pendulum's mass-independent period is a property of a different restoring-force model: both inertia and gravitational restoring force are proportional to its mass.

Limit: changing $k$ together with $m$ so that $k/m$ stays fixed can keep spring frequency unchanged, but that is a different experiment, not independence from mass at fixed spring stiffness. No source correction or modern wording was written here.

Response-unit intent: a native `single` explanatory critique of the quoted claim, including the fixed-$k$ relation and the spring/pendulum distinction. A "true/false" answer alone would discard the source's requested reasoning. Modern seed readiness must confirm that the false source premise is explicitly presented for critique, not asserted as a fact.

## Source 5: Same-Radius Pendulums With Different Masses

Original: "两个摆的球，半径相同而质量不同，悬挂在等长的绳子上。问其中哪一个摆的振动阻尼较快：是轻的还是重的？"

Task: compare decay of the oscillation envelope, separating damping from natural-frequency dependence and stating the model needed for the comparison.

The equal radii and equal string lengths give equal pendulum lengths in the ideal geometry. In the same $g$ and small-angle limit, their undamped $\omega_0=\sqrt{g/l}$ is the same. Different masses do not by themselves imply different undamped pendulum periods.

A concrete conditional model: identical spherical geometry and drag-relevant surface properties, the same air conditions, equal initial small displacement amplitudes, negligible other losses, and the same linear air-resistance law $F_d=-b v_x$ with the same $b>0$. Require both motions to be underdamped. The linearized pendulum equation is

$$
m\ddot x+b\dot x+\frac{mg}{l}x=0.
$$

Its displacement envelope decays with rate $\beta=b/(2m)$:

$$
A(t)=A(0)e^{-\beta t},\qquad
t_{\mathrm{fraction}\ r}=\frac{2m}{b}\ln\frac{1}{r},
\quad 0<r<1.
$$

The lighter pendulum has the larger fractional envelope-decay rate and reaches the same prescribed fraction of its initial amplitude sooner. The heavier pendulum decays more slowly. Equal $b$ is not equal damping rate: inertia enters through $b/m$.

The energy explanation is consistent. At the same small amplitude, stored mechanical energy is proportional to $m$. At a matched trajectory and speed, the same drag law removes the same energy, producing a larger fractional loss for the lighter pendulum. This matched-trajectory argument is a local/weak-damping comparison, not an assumption that unequal damped trajectories remain identical.

Limits: the original equal-radius condition does not specify air conditions, drag law, other dissipation, or the meaning of "较快". The linear model and common fractional-envelope criterion above are explicit added assumptions for the conditional solution, not recovered source facts. Equal radii alone do not establish a universal ordering when support friction, different drag properties, or other losses matter. A nonlinear drag law does not justify importing the displayed exponential law.

Response-unit intent: a native `single` judgment of the conditional lighter/heavier ordering together with its physical reason and common-air-damping assumptions. If the finalized modern seed supplies only a qualitative air-resistance comparison, retain its actual model and avoid adding an unsupported quantitative decay law to the visible choice item. Do not turn period independence and damping ordering into redundant yes/no items.

## Readiness and Remaining Gate

All five original tasks have independent reasoning, including the original source 2 ambiguity, source 4 contradiction, and source 5 conditional comparison. The response-unit notes are provisional mathematical design intentions, not a fixed question count or authored options. Independent written explanation remains a capacity that choice recognition cannot itself demonstrate.

No inspect, prepare, seed construction, option drafting, validation, figure authoring, or semantic choice review has run. Wait for the main agent's finalized modern n12 and explicit seed-go. Then inspect only that current whitelist projection, select actual relevant modern definitions, prepare the seed, and reconcile its explicit conventions against these independent solutions before constructing any options.
