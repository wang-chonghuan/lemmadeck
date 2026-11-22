export const thermalIntroductionConfigs = {
  'phy9-c1-s1-n1': {
    task: 'D1297', prepare: 'd1816-d1274-n1-first-missing-en', chapterFromSection: true,
    firstNativeFailure: 'd1275-n1-first-missing-en-author-native',
    firstInput: 'd1816-d1275-n1-first-missing-en/en.before-native.json', failureIndex: null,
    firstFailureCause: 'The broad Thermal phenomena prefix matched three actual paragraphs.',
    repairScope: 'Only the boundary selector changed to a unique complete opening; all prose unchanged.',
    boundaries: ['Thermal phenomena include changes', 'Temperature changes'],
    figureLabels: { 'tbl-p0011-01': 'Lakeside in summer', 'tbl-p0011-02': 'Lakeside in winter' },
    texts: [
      `Newton's laws describe many motions of large bodies and their parts very accurately when classical mechanics applies.
To calculate a motion, we need the body's mass, its initial position and velocity, and the forces acting on it.
These laws are not a universal description of every tiny particle or every possible motion.

At atomic scales or at speeds approaching the speed of light, other physical theories may be needed.`,
      `Knowing the laws of motion alone does not explain every property of matter.
Why does deforming a body produce an elastic force?
Why can matter occur as a gas, a liquid, or a solid?

To answer such questions, we also need to understand the structure of matter and the interactions within it.
Gas, liquid, and solid are the three states considered here, not a list of every possible state.`,
      `The textbook illustrates the limits of knowledge with a reflection attributed to Newton.
It compares a scientist to a child finding smooth stones or attractive shells on a seashore while an unexplored ocean of truth lies ahead.
This is the textbook's historical account, not a statement that Newton's laws explain all of nature.`,
      `Thermal phenomena include changes connected with temperature and changes of state.
For example, liquid water can become a gas.
Such changes may not look like the movement of a large object, but they are connected with energy and the microscopic behavior of matter.

The original course introduced thermal phenomena in an earlier school year.
Here we will build on these familiar observations.`,
      '',
      String.raw`Thermal phenomena are important in human life and in the lives of animals and plants.
The textbook describes seasonal air-temperature changes of $20\sim30^{\circ}\mathrm{C}$ as an example, not a fixed change in every climate.
In its seasonal comparison, spring brings leaves and green grass, while winter brings snow and reduced activity in many plants and insects.

The summer and winter lakeside pictures illustrate this comparison.
They are illustrations, not temperature measurements.
The textbook also uses a body-temperature change of $1$ degree to illustrate sensitivity to temperature; this is not a universal threshold for discomfort.

These everyday effects help explain why people have studied heat since ancient times.`,
      '',
      `Life on Earth depends on environmental conditions, including temperature.
Learning to obtain and maintain fire gave people more control over warmth and other parts of their surroundings.
The textbook presents this as an important development in early human life, not complete independence from the environment.`,
      String.raw`Temperature changes can affect dimensions, volume, elasticity, and other properties of a material.
Many solids expand and many liquids increase in volume when heated, although thermal expansion is not identical for all substances or temperature ranges.
The textbook contrasts a flexible rubber tube with the same kind of material cooled below $-100^{\circ}\mathrm{C}$.

In that example, severe cooling makes the rubber brittle enough to break under a light blow.
The quoted temperature is an example for the material being described, not a universal brittleness threshold for every rubber.
Warming an unbroken piece can restore flexibility; warming does not rejoin a tube that has already broken.`,
      `Thermal phenomena follow physical laws.
Their descriptions differ from the laws used to calculate the motion of a large body, but the descriptions are connected.
Understanding thermal behavior helps us use it in engineering.

Heat engines, compressed-gas equipment, and refrigeration devices are examples of technologies designed using these laws.`,
    ],
  },
  'phy9-c1-s1-n2': {
    task: 'D1298', prepare: 'd1816-d1281-n2-first-missing-en', chapterFromSection: true,
    firstNativeFailure: 'd1282-n2-first-missing-en-author-native',
    firstInput: 'd1816-d1282-n2-first-missing-en/en.before-native.json', failureIndex: null,
    firstFailureCause: 'The broad In the textbook prefix matched two actual paragraphs.',
    repairScope: 'Only the boundary selector changed to a unique complete opening; all prose unchanged.',
    boundaries: ['Experiments with thermometers', "In the textbook's account, Lomonosov",
      'By the late eighteenth'],
    figureLabels: { 'tbl-p0013-01': 'Portrait of Lomonosov' },
    texts: [
      `Understanding familiar thermal phenomena took centuries of investigation.
The textbook presents the history of thermal theory as a path involving competing ideas, experiments, and revisions.
An explanation that seems convincing at one stage can later prove inadequate.`,
      `Some ancient philosophers treated fire and heat as one of four elements, alongside earth, water, and air.
Others tried to connect heat with motion.
Collisions and rubbing can warm objects, providing an observation that such an explanation had to account for.

The four-element view is a historical belief, not the modern description of matter.`,
      `The textbook places an important development in the early seventeenth century: instruments for comparing temperature.
Thermometers made quantitative investigation of thermal processes possible.
The text describes them as powerful tools for distinguishing sound explanations from mistaken ones.`,
      `Experiments with thermometers sharpened the question: what is heat?
One historical answer was the caloric theory.
It treated heat as a weightless fluid, called caloric, that could pass from one body to another.

According to that theory, a greater amount of caloric in a body meant a higher temperature.
This describes the old theory, not a fluid recognized in modern physics.`,
      `A competing view connected thermal behavior with the internal motion of particles.
In this historical picture, faster particle motion was associated with higher temperature.
Modern kinetic theory makes this connection quantitatively under specified conditions, rather than assigning temperature to the speed of one particle.

Heat itself is energy transferred because of a temperature difference; it is not the name for all microscopic motion stored in a body.`,
      `The particle view was connected with earlier ideas about the atomic structure of matter.
It was first called a corpuscular theory.
The textbook names Newton, Hooke, Boyle, and Bernoulli among its supporters.`,
      '',
      `The textbook's biographical note describes Lomonosov, who lived from 1711 to 1765.
It presents him as a Russian scholar, poet, public figure, and founder of Moscow University.
It attributes to Pushkin the description of him as the first Russian university.

The note discusses work in physics, chemistry, mining, and metallurgy, as well as writing about Russian history and grammar.
It also credits his writings with anticipating ideas associated with conservation of mass and energy.
These are retained as the textbook's historical account, not a claim that the fully developed modern laws were already established in those writings.`,
      `In the textbook's account, Lomonosov made important contributions to the particle theory of heat.
He associated heat with the rotational motion of particles and used his theory to discuss melting, evaporation, and thermal conduction.
He also proposed a greatest possible degree of cold, associated in that theory with the stopping of particle motion.

This is a historical model, not the modern assertion that all microscopic motion simply stops at absolute zero.
The textbook says his influence reduced support for caloric theory among Russian scholars.`,
      `In the textbook's mid-eighteenth-century account, caloric theory temporarily became more successful.
Heat-exchange experiments suggested a balance between the amounts of heat lost and gained in the systems being studied.
Supporters interpreted that balance as conservation of caloric.

They introduced the concept of heat capacity and developed a quantitative theory of thermal conduction.
Some terminology survived even though the fluid interpretation was later abandoned.
Heat-exchange balance does not establish that heat is a conserved material substance in every process.`,
      `The early particle theory had difficulty producing useful quantitative relations.
In particular, it did not yet explain the relation between temperature, particle motion, and the observed heat-exchange balance.
The modern concept of energy was not yet part of that account.

This helps explain why the simpler caloric picture could be more effective for some calculations at that stage.`,
      `By the late eighteenth century, difficulties with caloric theory were growing.
The textbook describes its rejection by the middle of the nineteenth century.
Experiments showed that frictional work could continue to warm a system as mechanical energy was supplied.

The amount of heating was not limited by a fixed store of caloric fluid.
The textbook also points to steam cooling as it does work in an engine, rather than necessarily passing heat to another body.
Neither example creates energy from nothing or eliminates the need to account for energy transfers.`,
      `The nineteenth-century development described here connected mechanical work with thermal energy transfer.
Heat and work are two ways of transferring energy, not substances contained in an object.
Supplying heat can increase a body's internal energy; it does not add a weightless fluid.

Energy conservation replaced the supposed conservation of caloric.
The textbook's phrase that heat is a form of energy is understood here as energy transferred thermally, not a separate stored material.`,
    ],
  },
  'phy9-c1-s1-n3': {
    task: 'D1289', prepare: 'd1816-d1288-n3-first-missing-en', chapterFromSection: true,
    boundaries: ['Thermal processes', 'Kinetic theory did not'],
    figureLabels: { 'fig-01': 'Figure 1' },
    texts: [
      `The textbook connects the development of a quantitative theory of thermal processes in the second half of the nineteenth century with the law of energy conservation.
That theory is thermodynamics.`,
      `Thermodynamics describes thermal behavior through measurable properties of a system without following each molecule separately.
It is called a phenomenological theory because it relates observable behavior without requiring a detailed microscopic model.
This does not mean that its descriptions are unreliable or that microscopic structure is unimportant.`,
      String.raw`Thermodynamics uses quantities measured with instruments such as thermometers and pressure gauges.
It describes macroscopic systems rather than the path of each individual molecule.
A macroscopic body contains many particles and can be described by large-scale properties.

Gas in a bottle, water in a glass, a grain of sand, a stone, a steel rod, and Earth are the examples associated with Figure $1$.
The objects in the illustration are not drawn to a common physical scale.
Ordinary bulk thermodynamics also requires suitable conditions, such as sufficiently well-defined system properties.`,
      '',
      'Figure 1',
      `Thermal processes often involve energy transfer and conversion.
The first law of thermodynamics expresses energy conservation for a system, including heat and work.
Energy is accounted for in the system and its exchanges with its surroundings.`,
      `The development of energy conservation also helped the particle theory of heat, now called kinetic theory.
Kinetic theory connects macroscopic behavior with the motion and interactions of atoms or molecules.
The classical version uses Newtonian mechanics where that approximation applies.

It is not a complete description of every microscopic process under every possible condition.`,
      `By the end of the nineteenth century, theories describing the collective behavior of many atoms and molecules had developed.
The textbook connects kinetic theory with statistical mechanics.
Experimental evidence supports these theories within their ranges of applicability.

Statistical mechanics uses the behavior of many particles to explain large-scale properties; it is not simply a second name for every particular kinetic model.`,
      `Kinetic theory did not make thermodynamics unnecessary.
Thermodynamic laws remain useful for understanding phenomena and calculating the behavior of technical equipment.
They can apply to different materials without first specifying each material's microscopic structure.

This broad usefulness does not remove the conditions required for a particular thermodynamic model or calculation.`,
      `A thermodynamic calculation often needs material properties such as heat capacity.
Those properties may be measured experimentally.
The thermodynamic laws alone do not give every material's heat capacity.`,
      `Statistical mechanics can connect such properties with information about microscopic structure and interactions.
Quantitative models of solids and liquids can be complicated.
For many purposes, a simpler thermodynamic calculation using suitable measured properties is therefore valuable.`,
      `Thermodynamics and statistical mechanics are complementary.
Thermodynamics relates macroscopic quantities, while statistical mechanics can explain their microscopic basis under the assumptions of its model.
Neither approach eliminates every limitation or every need for experimental evidence.

Statistical mechanics can also provide a theoretical explanation of thermodynamic laws within the appropriate regime.`,
      `We will begin with the basic ideas of kinetic theory.
The original course treats these ideas as a review of material introduced in earlier school years.`,
    ],
  },
};
