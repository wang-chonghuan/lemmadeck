export const laterOscillatorConfigs = {
  'phy10-c1-s2-n9': {
    task: 'D1179', prepare: 'd1816-d1176-n9-first-missing-en',
    boundaries: ['The acceleration component along'],
    texts: [
      String.raw`When a body undergoes simple harmonic oscillation, its velocity and acceleration components along the direction of oscillation also vary harmonically with time.
The velocity component along the $OX$ axis is the first derivative of displacement $x$ with respect to time.
This component can be positive or negative; its sign indicates the direction of motion.

Speed is the magnitude of this component and has no direction sign.
If $x=x_{\mathrm{m}}\cos\omega_0t$, then:
$v_x=x'=-\omega_0x_{\mathrm{m}}\sin\omega_0t=\omega_0x_{\mathrm{m}}\cos\left(\omega_0t+\frac{\pi}{2}\right)$ $(1.21)$`,
      String.raw`The quantity that varies harmonically here is the signed velocity component, not the always nonnegative speed.
The preceding cosine expression shows that the phase of the velocity component leads that of displacement by $\pi/2$.`,
      String.raw`When the body passes through equilibrium, its displacement is zero and its speed is greatest.
The magnitude of the velocity component is then greatest, but the component is at its positive maximum when motion is in the positive direction and at its negative minimum when motion is in the negative direction.
Not every passage through equilibrium gives the maximum signed velocity.

At either turning point, the magnitude of displacement is greatest, and both velocity and speed are zero (Figure $15$a, b).
The positive turning point gives the positive maximum displacement; the negative turning point gives its negative minimum.
The velocity amplitude $v_{\mathrm{m}}$ is the greatest absolute value of the velocity component, or the maximum speed.
Its relation to displacement amplitude is:
$v_{\mathrm{m}}=\omega_0x_{\mathrm{m}}$.`,
      String.raw`The acceleration component along the $OX$ axis is the first derivative of the velocity component with respect to time.
From the preceding velocity expression:
$a_x=v'_x=-\omega_0^2x_{\mathrm{m}}\cos\omega_0t$,

or $a_x=\omega_0^2x_{\mathrm{m}}\cos(\omega_0t+\pi)$.
$(1.22)$`,
      String.raw`**The acceleration component of simple harmonic oscillation also varies harmonically with time, with amplitude** $a_{\mathrm{m}}=\omega_0^2x_{\mathrm{m}}$.
**The phase difference between the acceleration component and displacement is** $\pi$.
Their magnitudes reach their greatest values at the same times, but their signed maxima do not.

At the positive maximum displacement, acceleration is at its negative minimum.
At the negative minimum displacement, acceleration is at its positive maximum.
Away from equilibrium, acceleration and displacement have opposite signs, and acceleration always points toward equilibrium.

At equilibrium, both are zero.
This phase relationship is called opposition of phase (Figure $15$a, c).`,
      '',
      'Figure 15',
      String.raw`The phase of the acceleration component leads that of the velocity component by $\pi/2$.
The relation between their amplitudes is:
$a_{\mathrm{m}}=v_{\mathrm{m}}\omega_0$.`,
    ],
  },
  'phy10-c1-s2-n15': {
    task: 'D1180', prepare: 'd1816-d1178-n15-first-missing-en',
    boundaries: ['To reduce harmful resonance', 'Resonance can also be useful', 'The textbook describes a vibrating-reed'],
    texts: [
      `When a periodic external force acts on an oscillating system, a pronounced resonant response may occur if the force effectively excites a mode of oscillation and the driving frequency is close to that mode's natural frequency.
Here resonance means a marked increase in the forced response over a range of frequencies.
It does not mean that any periodic external force must produce unlimited amplitude.

The actual amplitude also depends on the driving-force magnitude, damping, duration of the drive, and the system's own limits.
Resonance can be useful or harmful; it is not the same thing as destruction.`,
      `Elastic structures such as bridges, machine bases and shafts, and ship hulls can be studied as oscillating systems.
Real structures often have several natural modes of oscillation and corresponding natural frequencies.
Reciprocating parts, such as engine pistons, and rotating parts, such as misaligned or unbalanced shafts, can produce periodic forces.

The response may grow markedly when these forces excite a structural mode and their frequency is close to its natural frequency.
Repeated varying loads may cause fatigue damage even when the stress under a static load does not exceed the material's strength limit.
Damage or cracks in iron, steel, and other materials can develop gradually and eventually lead to fracture.

These statements describe conditions of risk, not inevitable machine damage whenever resonance occurs.
Nor does every varying load make a material lose strength immediately.`,
      `To reduce harmful resonance, suitable damping can be increased so that more mechanical energy is dissipated in each oscillation.
The system or driving conditions can also be changed to keep the main driving frequency away from the range of strongly enhanced response.
Increasing friction is only one way to increase dissipation; it is not appropriate to simply increase friction in every structure.

Merely making the two frequencies unequal does not establish that the risk has disappeared.
The original textbook gives an example of reducing a ship's vibration by changing its heading.
Changing operating conditions may change the frequency or coupling of periodic forces, and the effect depends on the particular situation.

The textbook also describes troops crossing a bridge without marching in step.
Avoiding a common rhythm of force from many people can reduce periodic excitation of the bridge.
If footsteps effectively excite a bridge mode, they may increase vibration and damage risk, but close frequencies do not mean that the bridge must be destroyed.`,
      `Resonance can also be useful; rocking a cradle is the textbook's example.
Repeated gentle pushes along the direction of motion, timed to suitable stages, can transfer energy to the rocking system.
With a driving rhythm close to the system's corresponding natural rhythm and little damping, relatively small periodic pushes can produce a noticeable response.

The driving strength and amplitude must still be controlled.
"Useful" does not mean that a greater amplitude is always better.`,
      String.raw`The textbook describes a vibrating-reed frequency meter that uses resonance to measure the frequency of alternating current.
It contains a set of spring reeds with weighted tips, attached to a common narrow strip (Figure $20$).
Each reed has a natural frequency that depends on properties such as its elasticity, length, and mass.

These frequencies must first be calibrated under specified operating conditions before the stronger response of a reed can be used to interpret the instrument's indication.
The drawing explains the structure; its proportions are not new measurements of mass, length, or elasticity.`,
      '',
      'Figure 20',
      String.raw`The electromagnet converts changes in the alternating current being measured into a periodic drive of the narrow strip.
The reeds undergo forced oscillation with their support.
Under the specified driving and damping conditions, reeds whose natural frequencies are close to the support's main driving frequency generally have a larger response.

Neighboring reeds may also oscillate; it is not true that only one can move.
The calibrated indication can be used to determine the frequency of the alternating current (Figure $21$).
The frequency of current variation and that of the mechanical driving force must not be assumed equal without checking.

Their relationship is determined by the instrument's electromagnetic structure and calibration.
Resonance makes the response sensitive to frequency differences, but the reading is still limited by damping, operating conditions, and scale calibration.
The drawing's proportions are not new measurement data, and no unprovided measurement accuracy can be inferred.`,
      `Resonance has important uses in other fields, which will be discussed later.
These uses must be understood in terms of the system's natural properties, driving method, and damping.
The occurrence of resonance alone does not decide whether its effects are useful or harmful.`,
      '',
      'Figure 21',
    ],
  },
};
