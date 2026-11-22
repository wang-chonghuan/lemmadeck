export const oscillatorConfigs = {
  'phy10-c1-s2-n10': {
    task: 'D1158', prepare: 'd1816-d1157-n10-first-missing-en',
    boundaries: ['The small-angle motion', 'The relation between pendulum period', 'The period of an ideal'],
    texts: [
      String.raw`Section $6$ of the original textbook discussed the ideal spring oscillator.
Here we continue to assume a spring obeying Hooke's law with constant stiffness, an object of constant mass, and negligible spring mass and resistance.
In equation $(1.4)$, acceleration points opposite to displacement from equilibrium.
The magnitude of the proportionality coefficient, $k/m$, is the square of the natural angular frequency.

Angular frequency describes how quickly phase changes, not the number of oscillations completed each second.`,
      String.raw`In this model, the natural angular frequency of the object's free oscillation on the spring is:
$\omega_0=\sqrt{\frac{k}{m}}$ $(1.23)$
Here k is the spring stiffness and m is the mass of the oscillating object.

With stiffness measured in newtons per meter and mass in kilograms, angular frequency is commonly expressed in radians per second.`,
      String.raw`At fixed mass, a stiffer spring gives a greater natural angular frequency.
At fixed stiffness, a greater mass gives a smaller natural angular frequency.
At the same displacement, the stiffer spring produces a greater restoring force and acceleration.

Under the same force, the more massive object has a smaller acceleration.
The corresponding oscillation period is:
$T=2\pi\sqrt{\frac{m}{k}}$ $(1.24)$

Using the SI units stated above, the period is expressed in seconds.`,
      String.raw`Experiments using springs of different stiffness and objects of different mass can test formulas $(1.23)$ and $(1.24)$, which describe the relations of $\omega_0$ and $T$ to $k$ and $m$.
Control mass or stiffness separately and keep the spring deformation within the range where Hooke's law applies.
Avoid mixing resistance and other effects into the comparison of these parameters.`,
      String.raw`The small-angle motion of a simple pendulum can be described approximately by equation $(1.10)$.
The ideal pendulum here consists of a bob treated as a point mass and a light, inextensible, taut string.
Its suspension point is fixed, motion occurs in a vertical plane, and air resistance and suspension friction are negligible.
The angle must stay small enough that tangential restoring acceleration is approximately proportional to displacement from equilibrium and points oppositely to it.
The magnitude of this proportionality coefficient is the square of the natural angular frequency.

Pendulum length l is the distance from the suspension point to the bob's center of mass, not just the string's length.
The local gravitational acceleration g is approximately constant over the region of motion.
Under these conditions, the natural angular frequency is approximately:
$\omega_0=\sqrt{\frac{g}{l}}$ $(1.25)$

The oscillation period is approximately:
$T=2\pi\sqrt{\frac{l}{g}}$ $(1.26)$
With length in meters and gravitational acceleration in meters per second squared, angular frequency is in radians per second and period is in seconds.

These two expressions are small-angle approximations, not exact formulas for arbitrary swing angles or arbitrary rigid pendulums.`,
      `The original textbook records the history of this period formula.
It attributes the first proposal to the Dutch scientist Huygens, a contemporary of Newton, and reports experimental confirmation.
This is the textbook's historical account.`,
      String.raw`In the small-angle simple-pendulum model, a longer pendulum has a longer period.
For the same length and other conditions, period is independent of the bob's mass.
With smaller gravitational acceleration $g$, the same pendulum has a longer period.

If other timing factors remain unchanged, a clock whose timing is controlled by that pendulum also runs more slowly.
The original textbook gives a historical approximate example: moving a rod-and-weight pendulum clock from the ground floor to the top floor of Moscow University raises it by $200$ meters, and the clock then loses nearly $3$ seconds per day.
The textbook explains the difference by the decrease in gravitational acceleration with altitude.

This is the textbook's approximate example at that location, not an exact prediction for any building or pendulum clock.
An actual rod-and-weight clock is not the same as an ideal point mass suspended on a light string.
Its timing also depends on its construction and operating conditions.`,
      String.raw`The relation between pendulum period and $g$ can be used to measure gravity.
Measuring the period and calibrating the pendulum length can determine the local gravitational acceleration $g$.
Precision also depends on timing, length calibration, and control of finite-angle, resistance, and other effects.

The original textbook introduced the variation of gravitational acceleration $g$ with latitude in its eighth-grade volume.
It may also differ between locations at the same latitude.
The density distribution of underground material affects local gravity.

The textbook uses buried hard ore as an example of a location where $g$ may be slightly greater.
The relevant property is the ore body's density contrast with surrounding rock, not its hardness.
Gravity anomalies can provide clues for mineral exploration, but pendulum period alone cannot uniquely determine the mineral type or burial location.`,
      `The original textbook uses iron ore as an example of high-density ore and describes a historical exploration effort.
Under the direction of A. A. Mikhailov, a member of the Soviet Academy of Sciences, measurements of gravitational acceleration near Kursk further clarified the iron-ore locations previously indicated by magnetic measurements.
This illustrates how different measurement methods can complement one another.
It does not mean that gravity measurements alone identify iron ore without conditions.`,
      `The period of an ideal linear spring oscillator is independent of amplitude.
A simple pendulum has this property only within the small-angle approximation.
The conclusion cannot be used for a spring outside the range of Hooke's law or for a pendulum whose swing angle is no longer small.

The textbook explains this by scaling the motion.
Within the same linear model, compare two motions with the same initial phase and with initial displacement and velocity scaled by the same factor.
When amplitude doubles, restoring force and acceleration toward equilibrium also double at corresponding times, as does velocity.
The object therefore travels twice the distance in the same time while the time for one oscillation remains unchanged.

This is a scaling property of the linear equation of motion.
It is not a general rule that greater acceleration must increase velocity by the same factor under arbitrary initial conditions.
For the pendulum, the explanation remains limited to the small-angle approximation.`,
    ],
  },
};
