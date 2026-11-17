# D029 n39 Independent Raw Solutions

Ticket: STEMROBIN-181. Lesson: phy10-c1-s5-n39. Book: 10p.
This document was manually persisted BEFORE reading the answer author's result,
working solutions, templates, or either frozen answer key. No choice answers or
choice author evidence were opened. This is a fresh independent solution, not an
author-answer paraphrase. The six original questions have source refs p0112#4-9,
group g1, source numbers 1-6, unchanged across the current native EN/ZH editions.

## Inputs Read Before Author Answers

All paths below are relative to
/Users/yong/.codex/worktrees/00b1/lemmadeck/.

- EN n39 tasks: .intentfold/tickets/STEMROBIN-181/tmp/d046-n39-native/en/display-root/10p/editions/modern-us-neutral/lessons/phy10-c1-s5-n39/exercises.json
  SHA256: 0723888c5a925d5d2f367d765af13411e76077a3c1774bd1edbba8745a7ae8dd
- ZH n39 tasks: .intentfold/tickets/STEMROBIN-181/tmp/d046-n39-native/zh/root/10p/editions/modern-us-neutral/lessons/phy10-c1-s5-n39/exercises.json
  SHA256: e87bae50bfe64d842477932a6624873512b323cc6f1e82ce3736315fcca5e014
- EN n39 prose: .intentfold/tickets/STEMROBIN-181/tmp/d046-n39-native/en/display-root/10p/editions/modern-us-neutral/lessons/phy10-c1-s5-n39/lesson.json
  SHA256: f7128aea1fa1c0d3539cc2c20d16be9c23b9783549f6b4ce34028826102ecf75
- ZH n39 prose: .intentfold/tickets/STEMROBIN-181/tmp/d046-n39-native/zh/root/10p/editions/modern-us-neutral/lessons/phy10-c1-s5-n39/lesson.json
  SHA256: 1417f77a60e07acbca91b31bbfde089c53ba6be507201bb1a2723e5f770e4358
- EN n38 definitions/context: .intentfold/tickets/STEMROBIN-181/tmp/d046-n38-native/en/display-root/10p/editions/modern-us-neutral/lessons/phy10-c1-s5-n38/lesson.json
  SHA256: 8075f60240cd7b8c247129847f73a2b8a89e1b1172061bf85cee434762f36090
- ZH n38 definitions/context: .intentfold/tickets/STEMROBIN-181/tmp/d046-n38-native/zh/root/10p/editions/modern-us-neutral/lessons/phy10-c1-s5-n38/lesson.json
  SHA256: fe5248ccc95d9c2d7eb87d82a23677c4631a76d84bb1356dfa905da2a4dbf91c
- Both current n39 FigureSpec copies: figures/fig-70.spec.json under their respective edition roots.
  SHA256: dcdf95bb6d3e4b47e184400c369efc376947e9eed77432423cd4c5f0bb4f1e36
- Both approved modern SVG copies: figures/fig-70.svg under their respective edition roots.
  SHA256: 4bae69e25800526c2b16adca5af0d6c71bb013159e240e6d4474e72cd15fba9f
- Canonical original-book answers.json was parsed only for this lesson's entries.
  It has 39 book entries overall, zero entries for n39; no bookRaw is justified.

## Actual Image Opens

Exactly 2 image opens so far, both BEFORE author answers:

1. Canonical original fig70 PNG, opened at original resolution:
   ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-70.png
   SHA256: 8cf1965d548aad41c46aa2a6c77017789a078b1aab470306ce9ecdd96bb75d65
2. Approved modern fig70 native PNG, opened at original resolution:
   .intentfold/tickets/STEMROBIN-181/tmp/d045-10p-fig70-author/attempts/initial/fig-70.native.png
   SHA256: b42d574f61180bd4045f2a449c4ca56a4907973315c39ac70c8e292950d3d902

The modern PNG is an existing native-render artifact, not a newly generated or
annotated answer image. Its command receipt is
.intentfold/tickets/STEMROBIN-181/tmp/d045-10p-fig70-author/commands/initial-native-render.json
(SHA256 22f1c771c52dfb6cd9081369562ecdc65844bf33070e5a538933dda5f09090a5),
which records a successful render with --png fig-70.native.png. The associated
attempt SVG is byte-identical to the current approved EN/ZH SVG.
Current figure review and render reports both say pass and bind that exact SVG/spec.

Visual observations: six snapshots a-f, times 0, T/4, T/2, 3T/4, T, 5T/4;
18 numbered balls per row. Row e marks a wavelength between 1 and 13.
Row f marks wavelengths between 2 and 14, and between 3 and 15.
Each span contains 12 adjacent equilibrium-position intervals, not 13 intervals.
Row e balls 1 and 13 are at equilibrium with matching transverse velocity arrows;
ball 7 has opposite velocity. Row f balls 1 and 13 share an extremum;
2/14 and 3/15 share both displacement and velocity direction.
The right tail is initially unreached: its stillness is not an established
oscillation phase and must not be treated as an in-phase wave train.

## 1. What Is a Wave?

Independent EN display standard:
A wave is a disturbance that propagates from one place to another. In the
mechanical waves studied here, elastic coupling passes the disturbance between
neighboring particles of a medium; each particle moves locally near equilibrium
while the disturbance travels through the medium.

Independent ZH display standard:
波是从一处向另一处传播的扰动。这里研究的机械波通过介质中相邻质点之间的弹性联系逐步传递；
各质点在自己的平衡位置附近作局部运动，而扰动在介质中传播。

Reasoning: the n38 elastic cord/ball-chain model separates local motion, inertia,
and coupling from propagation. Do not claim all waves require a material medium.

## 2. Transverse and Longitudinal Waves, With Examples

Independent EN display standard:
In a transverse wave, the particles oscillate perpendicular to the direction of
wave propagation; an example is a transverse wave on a stretched string or elastic
cord. In a longitudinal wave, the particles oscillate parallel to the direction of
propagation; examples are sound in air and compressions and rarefactions traveling
along a spring or the longitudinal ball-chain model.

Independent ZH display standard:
横波中，质点振动方向与波的传播方向垂直，例如张紧细绳或橡皮绳上的横波。
纵波中，质点振动方向与波的传播方向平行，例如空气中的声波，以及沿弹簧或纵向球链传播的
密集和稀疏区域。

Completeness: both definitions AND at least one concrete, correct example for
each type are mandatory. A water-surface-wave example would need qualification
because its particle motion is generally not purely transverse; none is needed here.

## 3. Basic Characteristic of Wave Motion

Independent EN display standard:
For the ideal mechanical traveling waves considered here, a disturbance and
energy propagate through the medium, but there is no net transport of the medium
with the wave. Particles oscillate locally about equilibrium and transfer energy
to neighboring particles. This does not mean particles are motionless, nor does
it deny mean flows or drift in other, nonideal wave situations.

Independent ZH display standard:
在这里考虑的理想机械行波中，扰动和能量在介质中传播，但介质并不随波整体产生净输运。
质点在各自平衡位置附近往复运动，并把能量传给相邻质点。
这并不是说质点不运动，也不是说其他非理想波动中绝不可能有平均流动或漂移。

Reasoning: spring work transfers energy along the chain while the balls remain
near their own equilibrium positions. Restrict the no-net-mass statement to the
ideal model, not all imaginable wave systems or standing-wave energy transport.

## 4. Wavelength

Independent EN display standard:
The wavelength, lambda, is the distance along the direction of propagation between
the nearest distinct points oscillating in the same phase. In Figure 70, balls
1 and 13 (also 2/14 and 3/15 once reached) are separated by one wavelength.
Equivalently, the traveling pattern advances one wavelength in one period T.

Independent ZH display standard:
波长 lambda 是沿传播方向相距最近、振动相位相同的两个不同质点之间的距离。
图70中，第1与第13球之间的距离为一个波长；波传到相应各球后，第2与第14球、
第3与第15球之间也相隔一个波长。行进的波形在一个周期 T 内前进一个波长。

Reasoning: a separation of 2 lambda also gives equal phase but is not the nearest
spacing; equal instantaneous displacement alone does not establish equal phase.
For the model use longitudinal equilibrium spacing, not the curved connector length.

## 5. Actual Wave-Speed Relations

Independent EN display standard:
The wave travels one wavelength in one period, so v = lambda/T = lambda nu,
where T is the vibration period and nu = 1/T is the frequency. Equivalently,
lambda = vT = v/nu. At fixed frequency, v is proportional to lambda.
These relations apply to transverse and longitudinal waves; v is the propagation
speed, not a particle's instantaneous oscillation speed.

Independent ZH display standard:
波在一个周期内传播一个波长，因此 v = lambda/T = lambda nu，
其中 T 为振动周期，nu = 1/T 为频率；也可写成 lambda = vT = v/nu。
频率不变时，波速与波长成正比。这些关系对横波和纵波都适用；
v 是波的传播速度，不是质点振动时的瞬时速度。

Reasoning: distance/time and reciprocal period directly derive the formulas.
No unconditional proportionality when the frequency also changes.

## 6. Concrete Adjacent-Ball Phase Difference

Independent EN display standard:
In Figure 70, balls 1 and 13 span one wavelength with 12 equal adjacent intervals,
so adjacent balls have equilibrium spacing lambda/12. Their phase-difference
magnitude is 2 pi (lambda/12)/lambda = pi/6 rad = 30 degrees.
Along propagation from ball 1 toward the higher-numbered balls, each next ball
lags its predecessor by T/12. With phase convention
y_i(t) = A sin(omega t + phi_i), omega = 2 pi/T, and
Delta phi = phi_(i+1) - phi_i, this is Delta phi = -pi/6 modulo 2 pi.
Reversing the subtraction gives +pi/6; the magnitude remains pi/6.
This describes balls in the propagating oscillating region, not the unreached
stationary tail.

Independent ZH display standard:
图70中，第1至第13球之间为一个波长，包含12个等距的相邻间隔，
所以相邻球的平衡位置间距为 lambda/12。相位差的大小为
2 pi (lambda/12)/lambda = pi/6 弧度，即30度。
沿第1球向编号增大的方向传播时，后一球比前一球滞后 T/12。
若采用 y_i(t) = A sin(omega t + phi_i)、omega = 2 pi/T，
并定义 Delta phi = phi_(i+1) - phi_i，则 Delta phi = -pi/6（模2 pi）；
交换相减次序得到 +pi/6，但大小仍为 pi/6。
这个相位关系针对已参与行波振动的区域，不给尚未被波传到的静止尾部赋予振动相位。

Independent arithmetic: 13 - 1 = 12; spec x13 - x1 = 782 - 110 = 672;
adjacent equilibrium dx = 56; 672/56 = 12. Alternative spans
x14 - x2 = 838 - 166 = 672 and x15 - x3 = 894 - 222 = 672 confirm it.
The source and modern arrows distinguish phase from displacement and confirm
the downstream delay stated in n38.

## Expected Answer-Key Contract

Exactly six original written-task answers per locale, keyed to g1/source 1-6.
Every answer: grading = ungraded, source = derived, parts = [].
All answers must contain a concrete displayAnswer; no automatic judging,
interaction fields/files, bookRaw, or imported choice answers are authorized.
No finalize or publication is part of this independent semantic review.
