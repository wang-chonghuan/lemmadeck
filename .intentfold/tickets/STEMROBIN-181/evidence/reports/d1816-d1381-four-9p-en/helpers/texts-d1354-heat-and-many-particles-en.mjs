export const heatAndParticlesConfigs = {
  'phy9-c1-s2-n22': {
    task: 'D1383', prepare: 'd1816-d1353-n22-first-missing-en', chapterFromSection: true,
    firstNativeFailure: 'd1354-n22-first-missing-en-author-native',
    firstInput: 'd1816-d1354-n22-first-missing-en/en.before-native.json',
    failureIndex: null,
    firstFailureCause: 'The first N22 translation moved the last calorie token before the cooling interval and the specific-heat symbol before its defining temperature interval.',
    repairScope: 'Only restore the original math-token order in prose rows 6 and 8; formulas, values, source identities and other prose unchanged.',
    boundaries: ['To measure heat', 'How can we measure', 'When several bodies'],
    texts: [
      String.raw`Doing work is not the only way to change a gas's state: heating can change it too (Figure $35$).
Seal the cylinder so that the amount of gas stays constant, and fix the piston so that the volume cannot change.
Heating raises the gas's temperature and pressure.

The piston does not move, so there is no work from a volume change, but energy can still enter by heat transfer.
Energy entering a system by heat transfer is called heat absorbed by the system.
Work and heat transfer are two different ways to change a system's energy.`,
      String.raw`The original textbook connects the history of the word "heat" with the caloric theory, referring back to its earlier history section (see section $2$).
That theory pictured heat transfer as a substance, called caloric, flowing into or out of a body.
It is a historical explanation, not the physical model used in this lesson.`,
      '',
      'Figure 35',
      `From the viewpoint of molecular motion, a rise in temperature usually goes with more energetic microscopic thermal motion.
For a classical ideal gas, temperature is related to the average kinetic energy of molecular motion through space; it does not give every molecule the same speed.
When bodies at different temperatures touch, microscopic interactions transfer energy overall toward the colder body until thermal equilibrium is reached.

Thermal equilibrium means that their temperatures have become equal and there is no overall heat transfer between them.
It does not make every molecule's kinetic energy equal.
When no large-scale mechanical work is done, this energy transfer is heat transfer.`,
      `The original textbook builds on the concept of heat introduced in seventh-grade physics.
We will review its measurement and distinguish temperature, heat, and internal energy stored in a body.`,
      String.raw`To measure heat, the textbook uses a water-based unit: the calorie.
In the definition used here, $1$ calorie is the heat needed to raise the temperature of $1$ gram of water by $1^\circ\mathrm{C}$.
With the same approximately constant specific heat, $1$ gram of water cooling by $1^\circ\mathrm{C}$ releases $1$ calorie.`,
      String.raw`Giving $1$ calorie to $1$ gram of another material generally does not raise its temperature by $1^\circ\mathrm{C}$.
The change depends on the material and its state.
Specific heat describes this difference.

This comparison assumes no phase change, such as melting or boiling, and no significant other energy changes.
We cannot apply water's temperature change to every material.`,
      String.raw`For a specified physical state and process, the heat needed to raise the temperature of $1$ kilogram of a material by $1^\circ\mathrm{C}$ is its specific heat ($c$).
This lesson expresses it in calories per kilogram per degree, where a degree means a Celsius temperature interval.
With the calorie definition and water approximation above, water's specific heat is $1000$ calories per kilogram per degree.

The textbook notes that many common materials have lower specific heats than water.
This comparison is not a law for all materials in all states.
In the following calculations, each material's given specific heat is treated as constant over the temperature range considered.`,
      String.raw`For the same process conditions, a body's heat capacity ($C$) is its mass multiplied by its specific heat:
$C=mc$.
Specific heat describes the heat needed per unit mass; heat capacity describes the whole body's response and depends on its mass.`,
      String.raw`Suppose there is no phase change, specific heat is approximately constant, and significant mechanical work and other energy changes can be neglected.
For a body of mass $m$ whose temperature changes from $t_1$ to $t_2$, the signed heat absorbed is:
$Q=cm(t_2-t_1)=cm\Delta t$.
(2-27)`,
      `Throughout this lesson, heat entering a body is positive.
During cooling, the final temperature is lower than the initial temperature, so equation (2-27) gives negative signed heat.
The everyday phrase "how much heat is released" usually means the magnitude of this negative value, not a negative energy magnitude.`,
      `How can we measure heat exchange and test equation (2-27)?
A calorimeter is a measuring device designed to keep heat exchange mainly within the chosen system.`,
      `The textbook describes how temperature and heat were not clearly distinguished before the middle of the eighteenth century, illustrating the role of measuring instruments in developing concepts.
A thermometer measures temperature; a calorimeter helps measure heat exchange.
Temperature describes a state, whereas heat is energy transferred during a process.

A calorimeter's insulation reduces heat exchange with the surroundings.
Its conditions are approximately adiabatic, meaning that outside heat transfer is small enough to neglect.
Real equipment does not completely prevent heat transfer.`,
      '',
      String.raw`The calorimeter shown has a thin-walled inner metal cup resting on cork blocks inside an outer container.
An air layer separates the containers, and both have lids (Figure $36$).
The cork supports, air layer, and lids reduce heat exchange with the surroundings; they do not make it exactly zero.`,
      'Figure 36',
      String.raw`Put water of mass $m_1$ and initial temperature $t_1$ in the calorimeter, and immerse a hotter iron piece of mass $m_2$ and initial temperature $t_2$.
The water absorbs heat and warms; the iron releases heat and cools.
After enough heat exchange, both reach a common equilibrium temperature $t$.

In a two-body model that neglects heat exchange with the surroundings, heat absorbed by the calorimeter, mechanical work, and phase changes:
$t_1<t<t_2$.`,
      `Experiments test the heat-balance relation.
Its basis is conservation of energy in the system, not a substance called heat stored in a body.
For the approximately insulated two-body system above, with no significant outside work and with the calorimeter's energy change neglected, equation (2-27) gives equal magnitudes of heat released by the iron and absorbed by the water.`,
      String.raw`Let the water's specific heat be $c_1$.
Its signed absorbed heat is:
$Q_1=c_1m_1(t-t_1)>0$.
(2-28)`,
      String.raw`When $Q<0$, a body releases heat overall.
For iron with specific heat $c_2$, the same sign convention gives:
$Q_2=c_2m_2(t-t_2)<0$.
(2-29)

In this two-body model, the water's heat gain and the iron's heat loss cancel:
$Q_1+Q_2=0$.
(2-30)`,
      `Equation (2-30) is called the heat-balance equation.
The heat terms must use the same sign convention.
We cannot add two positive magnitudes of heat and set their sum equal to zero.`,
      String.raw`When several bodies form an approximately insulated system, with no unaccounted mechanical work or other energy changes, the heat-balance equation is:
$Q_1+Q_2+Q_3+\cdots=0$.
(2-31)

Here $Q_1$, $Q_2$, $Q_3$, and so on are the signed heat amounts absorbed or released by the individual bodies.
If the calorimeter absorbs significant heat, include it as another body in the system.
If significant heat crosses the system's outer boundary, the selected bodies' heat sum cannot simply be set to zero.`,
      String.raw`A calorimeter can measure a material's specific heat if it does not react significantly with water, undergo a phase change, or violate the heat-exchange conditions above.
Let a hotter test body exchange heat with water of known specific heat $c_1$.
Equation (2-30) becomes:
$c_1m_1(t-t_1)+c_2m_2(t-t_2)=0$.

Rearranging gives the test material's specific heat:
$c_2=\frac{c_1m_1(t-t_1)}{m_2(t_2-t)}$.
(2-32)

The denominator uses the magnitude of the hot body's temperature drop.
Do not confuse this positive drop with its negative signed temperature change.`,
      String.raw`Measure the common final temperature $t$, both masses, and both initial temperatures.
Under the stated approximations, equation (2-32) then gives the test material's specific heat.
If heat absorbed by the calorimeter or heat leakage is significant, first correct the experimental model; uncorrected data do not belong in this two-body formula.`,
    ],
  },
  'phy9-c1-s2-n25': {
    task: 'D1361', prepare: 'd1816-d1360-n25-first-missing-en', chapterFromSection: true,
    boundaries: ['**The change', 'The first law can also', 'A system has'],
    texts: [
      `The first law of thermodynamics applies conservation of energy to thermal phenomena.`,
      `This chapter mainly studies systems whose overall mechanical energy stays unchanged.
Overall mechanical energy means energy from the motion and position of the system as a whole.
With this condition, a change in total energy appears as a change in internal energy.`,
      `An isolated system exchanges no energy with its surroundings.
If its overall mechanical energy stays unchanged, its total internal energy also stays constant, although processes can still occur inside it: a hot iron piece can warm cold water.
A system's total energy changes only when energy crosses its boundary, the division between the system and its surroundings.`,
      `For a closed system, no matter crosses the boundary.
In the systems discussed here, energy can cross it through work or heat transfer.
Positive work done on the system transfers energy into it; positive work done by the system transfers energy to the surroundings.

The magnitude of work measures the energy transferred in this way.`,
      String.raw`Even without work, heat transfer can change a system's internal energy.
Heat $Q$ denotes energy entering by heat transfer; heat released is negative.
Only when no work is done and overall mechanical energy stays unchanged is the internal-energy change determined entirely by heat.`,
      `In general, work can be done on a system while heat is also transferred to it.`,
      String.raw`**The change in a system's internal energy equals the work done on it plus the heat transferred to it**:
$\Delta U=A+Q.$
$(2-33)$

Here A is work done on the system, and Q is heat transferred to it.
Their signs indicate whether energy enters or leaves.
This expression applies to the closed system specified above, whose overall mechanical energy stays unchanged.`,
      String.raw`The first law can also be expressed using work done by the system.
Let $A$ be work done on the system and $A'$ work done by it.
The relationship is $A'=-A$; see section $21$.

Thus the first law $(2-33)$ can also be written:
$Q=\Delta U+A'.$
$(2-34)$`,
      `Heat supplied to the system changes its internal energy and provides energy for work done on surrounding bodies.`,
      `A system has a definite internal energy in a given state.
Heat and work describe energy transfers during a process, not energy stored inside the system.
We cannot say that a system stores a certain amount of heat or work.`,
      String.raw`The same decrease in internal energy can occur through different processes.
Fixing the piston allows hot gas to release heat to the surroundings without doing work (Figure $40$).
Alternatively, the gas can expand, push the piston, and do work while losing the same internal energy without transferring heat to the surroundings.

The second process requires approximately insulating cylinder walls and piston (Figure $41$).`,
      '',
      '',
      'Figure 40',
      'Figure 41',
      `**Energy is neither created nor destroyed; it is transferred or transformed**.
Different processes can transform energy between different forms.
When studying thermal phenomena, identify the system boundary, the mode of energy transfer, and the work sign convention.`,
    ],
  },
  'phy9-c1-s2-n26': {
    task: 'D1368', prepare: 'd1816-d1367-n26-first-missing-en', chapterFromSection: true,
    boundaries: ['**An adiabatic', 'Adiabatic approximations'],
    texts: [
      String.raw`This lesson considers a closed system, meaning that no matter enters or leaves it.
Assume that the kinetic and potential energies of the system as a whole are unchanged, or change negligibly, between the initial and final states.
Energy enters or leaves only by heat transfer and work; under these conditions, these transfers can change internal energy.

When work is zero, the internal-energy change comes only from heat exchange:
$\Delta U=Q.$
$(2-35)$

For example, heat gas in a sealed bottle that does not change shape, neglecting other forms of work.
If the gas absorbs heat $Q$, its internal energy increases by the same amount.
For the fixed amount of ideal gas used in this lesson, internal energy depends only on temperature, so its temperature rises.`,
      String.raw`Under the same system and energy conditions, another special case has no heat exchange with the surroundings.
Energy is then transferred only through work, and the internal-energy change equals work done on the system:
$\Delta U=A.$
$(2-36)$`,
      `**An adiabatic process** is a process with no heat exchange with the surroundings.
Insulation can help approach this condition.
Under suitable conditions, a sufficiently fast process can also leave too little time for heat transfer to affect the result significantly.

A perfectly insulating enclosure is an ideal model.
Speed alone does not make every process adiabatic.
Use the adiabatic approximation only when heat exchanged with the surroundings can be neglected.`,
      String.raw`According to $(2-36)$, positive work done on a gas, as in adiabatic compression, increases its internal energy.
For the fixed amount of ideal gas used here, this increase raises its temperature.
In adiabatic expansion that actually does work on the surroundings, the gas does positive work ($A'>0$), work on the gas is $A<0$, and its internal energy and temperature decrease.

Expansion without outside work does not imply cooling in this way.
For example, an ideal gas expanding freely into a vacuum inside an insulated rigid container does not cool merely because it expands.`,
      '',
      String.raw`The original textbook describes a demonstration with a transparent cylinder and a tightly fitting piston to show heating by rapid compression (Figure $42$).
In its historical account, cotton containing ether is placed at the bottom, and rapidly pressing the piston down makes ether vapor burn.
This demonstration involves flammable material, pressure, and flame; it is not a task for learners to perform on their own.

Do not build or attempt it alone.
A teaching demonstration requires a qualified teacher, suitable equipment, and appropriate safety precautions.`,
      'Figure 42',
      `Adiabatic approximations help explain some engineering and natural phenomena.`,
      String.raw`A Diesel internal-combustion engine uses the heating of air by rapid compression.
An internal-combustion engine burns fuel inside its working cylinder.
Typical gasoline engines use spark ignition, whereas the Diesel engine described here uses hot compressed air to ignite fuel without that spark device.

Air enters the cylinder, rather than a premixed fuel-air mixture.
Near the end of the compression stroke, a special nozzle injects liquid fuel (Figure $43$).
Under suitable conditions, the fuel burns in the hot air.`,
      '',
      'Figure 43',
      `Compression heats air significantly in high-power air compressors.
These devices often need dedicated cooling to control the temperature.
Whether the real compression process is approximately adiabatic depends on heat transfer and operating conditions.`,
      `An air parcel rising in the atmosphere encounters lower surrounding pressure as altitude increases, so it expands.
An air parcel is a small region of air considered together as a system.
If little heat is exchanged with its surroundings, the expansion can be approximately adiabatic and cool the parcel.

When this cooling brings water vapor to saturation, meaning the conditions at which vapor can begin to condense, droplets can form clouds.`,
    ],
  },
  'phy9-c1-s3-n29': {
    task: 'D1375', prepare: 'd1816-d1374-n29-first-missing-en', chapterFromSection: true,
    boundaries: ['The textbook uses'],
    texts: [
      `Kinetic theory connects the properties of matter with particle motion and interactions.
It can qualitatively explain differences between solids, liquids, and gases, and many features of thermal phenomena.
A qualitative explanation describes what happens and why, without calculating its numerical size.`,
      `A qualitative explanation answers "Why does this happen?"
A quantitative theory also answers "How much?"
Kinetic theory and statistical mechanics study how the motion of many microscopic particles produces measurable large-scale patterns.

Statistical mechanics relates individual particle behavior to distributions and averages for large groups.
We begin this quantitative study with gases.`,
      `Building a model requires a description of individual particle motion.
Newtonian mechanics successfully describes many large-scale bodies, but we cannot assume that it applies without conditions to every atomic or molecular process.
Some microscopic processes require quantum mechanics, a different description needed when classical mechanics is not adequate.`,
      `This chapter uses a classical model: for gas conditions suited to the classical approximation, Newtonian mechanics describes particle motion and collisions.
We must compare the model's results with experiments.
Agreement supports its use under those conditions, not its validity in every microscopic situation.`,
      `A material's properties depend on its particles' motion, interactions, and statistical distribution.
A distribution describes how properties such as speeds are spread among the particles.
Gas pressure is one example: collisions of many particles explain this large-scale quantity.`,
      String.raw`Put gas in a sealed container, and a pressure gauge gives a reading $p_0$.
Each molecule striking a wall transfers momentum to it during a short time and exerts a force.
Momentum is the mechanical quantity transferred in a collision that changes a body's motion.

Over a finite wall area and observation time, the combined force from many collisions still has small fluctuations, or variations.
Figure $45$ illustrates them qualitatively; it is not a calibrated set of measurements.
An ordinary large-scale gauge cannot resolve every molecular collision.

Instead, it responds to the average effect of many collisions during the instrument's response time.
Pressure is average force perpendicular to the wall divided by the area, not the force from a single molecule.
For the large-scale equilibrium gas considered here, $p_0$ is fairly stable: many particles make relative fluctuations small, not absent at every instant.`,
      '',
      'Figure 45',
      String.raw`The textbook uses sand grains striking a disk as a mechanical model of gas pressure (Figure $46$).
A small vertical disk is fixed to a thin rod that can turn with the disk about a vertical axis.
Sand grains run down an inclined chute toward the disk, representing molecular collisions with a wall.

Repeated collisions produce an average effect that turns the rod and bends a spring plate.
The modern figure identifies it as "Spring plate"; the faithful source layer retains the unresolved letter-shape record rather than claiming a certain original letter.
This model shows the accumulated effect of collisions, but a sand stream is not an equilibrium gas and does not directly give a numerical gas pressure.

This explains a historical demonstration; it does not ask learners to build the apparatus.`,
      '',
      'Figure 46',
      `Explaining the origin of pressure qualitatively is fairly intuitive.
Calculating its magnitude needs additional models and statistical methods.
A large-scale container holds so many molecules that measuring and tracking every trajectory, or path through space, is not practical.

This does not mean that particles have no laws of motion.
It means individual tracking is not a workable method for this large-scale calculation.`,
      `Systems with many particles can show stable overall patterns.
Kinetic theory and statistical mechanics describe these patterns by connecting individual motion with distributions and averages for the whole group.`,
      `To calculate a gas's large-scale properties, we do not need every molecule's exact trajectory.
What matters is the average result of many molecular motions, such as average force.
Models and statistical methods let us calculate these results and compare them with measurements.`,
      `Particle interactions also matter in liquids and solids, whose quantitative theories are usually more complicated.
This chapter therefore studies gases, particularly where the ideal-gas approximation applies.
It does not imply that liquids and solids lack molecular patterns that can be studied.`,
    ],
  },
};
