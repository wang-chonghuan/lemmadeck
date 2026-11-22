export const kineticsConfigs = {
  'phy9-c1-s1-n7': {
    task: 'D1247', prepare: 'd1816-d1246-n7-first-missing-en',
    boundaries: ['Kinetic theory explains Brownian motion', 'In $1905$', 'The irregular motion of molecules'],
    texts: [
      `Diffusion is the gradual mixing of different substances and can be explained by the irregular motion of molecules.
Another way to observe the effects of molecular motion is to use a microscope to watch small particles suspended in water that do not dissolve in it.
The microscope shows these particles, not individual water molecules.

Many surrounding water molecules continually strike the particles at random, making them move irregularly.
This irregular motion of suspended particles is called Brownian motion and provides evidence of molecular thermal motion.
In $1827$, the British botanist Brown recorded this motion in tiny particles within plant pollen in water.

This account does not call him the first person to make every related observation.
Small particles that do not dissolve in water, such as gamboge particles, can also be used to observe Brownian motion.
Freely suspended particles remain affected by thermal motion.
This does not mean they can still move freely after they are fixed in place, settle, or their surrounding medium solidifies.

When comparing similar particles under comparable conditions in the surrounding medium, a higher temperature usually makes Brownian motion more pronounced.
The medium's resistance due to viscosity also affects the motion.`,
      `Kinetic theory explains Brownian motion at the microscopic level.
Over a short time, the impulses delivered to a particle by molecular collisions from different directions usually do not cancel completely, so the particle's motion keeps changing.
Figure $4$ shows a Brownian particle and nearby molecules schematically.
It is not a measured diagram with a scale of actual sizes or speeds.

Molecular motion is irregular, and the impulses delivered from the left and right over a short time need not be equal.
Here we compare only the random impulses produced by thermal motion in a uniform medium with no macroscopic flow and equivalent conditions in every direction.
Having no fixed directional bias on average does not mean that every set of impulses cancels exactly.
Nor does it rule out an overall drift of the particle caused by external forces or settling.

Under similar conditions, relative pressure fluctuations are more noticeable over a smaller area on which forces act.
If the area is only a few molecular diameters across, the effects of individual collisions become especially noticeable.
The textbook describes the collision force as jumping from zero to a certain value.
This is a simplified picture of a collision, not a claim that actual forces in a liquid always take only these two values.`,
      '',
      'Figure 4',
      `In $1905$, Einstein developed an important quantitative theory of Brownian motion.
Measurements of the motion of suspended particles can test kinetic theory and provide evidence that matter consists of molecules.
The irregular motion of a Brownian particle results from the thermal motion of the surrounding liquid or gas molecules.
The suspended particle itself must not be mistaken for a single molecule.`,
      `The irregular motion of molecules is called thermal motion.
Temperature is related to the intensity of this motion.
It differs from macroscopic mechanical motion, which describes the change in position of an entire body as a whole.

A body can move as a whole while thermal motion continues inside it.
It is therefore incorrect to say that every part of a body must move regularly whenever the body undergoes mechanical motion.`,
    ],
  },
  'phy9-c1-s6-n49': {
    task: 'D1249', prepare: 'd1816-d1248-n49-first-missing-en',
    boundaries: ['A uniform amorphous material', 'Under an external force', 'When the temperature is low'],
    texts: [
      `Besides crystals, there are amorphous solids.
Neighboring atoms in an amorphous solid may still have some short-range order, but the solid lacks the long-range periodic order found in ordinary crystals.
In other words, local structures are related, but the same structural units do not repeat periodically over large distances by shifts along a crystal lattice.`,
      String.raw`A substance with the same chemical composition can form a crystalline or an amorphous state, depending on the conditions under which it forms.
The textbook uses silica ($\mathrm{SiO_2}$) as an example.
Quartz is crystalline silica; amorphous silica lacks quartz's long-range periodic structure.
Figure 81 a represents the crystalline state with a regular network of hexagons.

The irregular network in Figure 81 b includes pentagons and heptagons as well as hexagons.
These two diagrams are simplified illustrations for comparing local connections with long-range arrangements.
They are not measurements of silica's complete three-dimensional crystal structure.`,
      '',
      'Figure 81',
      `A uniform amorphous material whose structure has no statistical preference for any direction usually behaves isotropically on the macroscopic scale when there is no macroscopic alignment, externally applied directional field, or directional stress.
This means that the corresponding physical properties do not change with the direction of measurement.
"Amorphous" means that long-range periodic order is absent.
That alone does not guarantee that every sample is isotropic under every condition.
Glass that has not crystallized is an example of an amorphous material.

The original textbook also lists asphalt, most plastics, rosin, and rock sugar.
These names cannot replace an examination of structure.
Plastics may be amorphous or may contain crystalline regions.
Ordinary rock sugar is usually crystalline and must not be classified as amorphous without qualification.`,
      `Under an external force, some amorphous materials can show elasticity as well as viscous deformation that develops over time.
This combined response is called viscoelasticity.
The response depends on the material, temperature, loading conditions, and how the duration of the load compares with the time needed for the structure to relax.
During a short loading time, the structure may not have enough time to rearrange fully, and the material can respond elastically like a solid.

A brittle sample may also break under a strong impact, but this is not a common outcome for every amorphous material.
At suitable temperatures and under a sustained load, some materials show noticeable creep or flow over longer times.
The textbook gives the example of asphalt slowly flowing along a solid surface.
This does not imply that all amorphous solids flow noticeably over ordinary observation times, or that glass shows observable flow at room temperature.

The textbook calls the time that atoms or molecules spend near a local position their "residence" time.
They continue vibrating nearby during that time.
Compared with an easily flowing liquid, a material in the glassy state can rearrange its structure much more slowly over the timescale being considered.
This is a simplified picture of the relationship between a material and the observation time.
It does not mean that every atom has the same fixed residence time.

When structural rearrangement is very limited, the material behaves approximately like a solid, but its internal structure still lacks a crystal's periodic arrangement.`,
      `When the temperature is low relative to a material's softening or glass-transition range and the observation time is limited, many amorphous materials show almost no observable flow and behave mechanically much like solids.
Heating usually speeds up structural relaxation and local rearrangement.
If the material does not decompose and conditions are suitable, it can gradually soften and show viscous deformation more readily over longer times.

In a glassy material, the glass transition occurs over a temperature range and depends on the heating rate and observation time.
It must not be equated with the equilibrium melting of a pure crystal at a specified pressure.
When the textbook says that amorphous solids have no definite "melting temperature," it means that this gradual softening has no single fixed melting point like that of a pure crystal.
It does not mean that every amorphous material softens in the same way, or rule out other changes such as crystallization or decomposition during heating.`,
    ],
  },
};
