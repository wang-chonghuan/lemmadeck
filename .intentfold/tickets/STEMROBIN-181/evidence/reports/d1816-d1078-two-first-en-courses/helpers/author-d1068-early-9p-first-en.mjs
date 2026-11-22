import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const configs = {
  'phy9-c1-s1-n6': {
    task: 'D1068', prepare: 'd1816-d1067-n6-first-missing-en',
    boundaries: ['A single molecule', '**Amount of substance**', '**Molar mass**'],
    texts: [
      String.raw`**The mass of a water molecule** The mass of an individual molecule or atom is very small.
We will estimate the mass of a water molecule.
In $1$ gram of water, there are $3\times10^{22}$ molecules.

Therefore, the mass of $1$ molecule is $m_{0\text{water}}=\frac{1}{3\times10^{22}}$ grams $\approx3\times10^{-23}$ grams.`,
      `This estimate gives the order of magnitude of the masses of common small molecules, not a single mass shared by all molecules.
Large organic molecules containing thousands of atoms can have much greater masses.`,
      String.raw`A single molecule has a very small mass, so relative masses can be useful when comparing particles.
The reference is $\frac{1}{12}$ of the mass of a specified reference carbon-twelve atom, not this fraction of the mass of any carbon isotope or of the average atomic mass of natural carbon` + `\u2460` + String.raw`.
Take the mass $m_0$ of a molecule or atom and the mass $m_{0\text{carbon}}$ of that same reference carbon-twelve atom.
The ratio of the former to $\frac{1}{12}$ of the latter is called the relative molecular or atomic mass $M_r$:
$M_r=\frac{m_0}{\frac{1}{12}m_{0\text{carbon}}}$.
(1-1)`,
      `\u2460 ` + String.raw`The original textbook explains the comparison with $\frac{1}{12}$ of a carbon atom's mass as a convenient way to obtain relative masses close to integers.
This is a historical textbook explanation, not a definition requiring relative masses to be integers.`,
      `$M_r$ has no unit.`,
      String.raw`**Amount of substance** The original textbook introduces this quantity using the number of atoms in $0.012$ kg of reference carbon.
The carbon comparisons and measurements of the constant below belong to that historical measurement convention.
Before counting, specify the entities: they may be atoms, molecules, ions, electrons, or clearly specified groups of particles.
In this lesson, water is counted in molecules.

Let $N$ denote the total number of specified entities in a sample` + `\u2460` + String.raw`.
It is a count with no unit.
The textbook compares it with the atoms in $0.012$ kg of reference carbon, but in the modern relation, $N_A$ is the constant that converts amount of substance into number of entities.
Its unit is per mole; it is not the total number of entities in a particular sample.

Amount of substance is denoted by $\nu$:
$\nu=\frac{N}{N_A}$.
(1-2)

This ratio has the unit mole.
The current SI assigns the Avogadro constant an exact fixed value.
The calculations later in this lesson use the textbook's rounded value, not the exact value in the current definition.`,
      `\u2460 If a substance consists of monatomic particles, the textbook's "number of molecules" here should be understood as the number of atoms.`,
      `The unit of amount of substance is the mole.
$1$ mol contains the same number of specified entities; state whether atoms, molecules, or another entity are being counted.
Relating this count to the atoms in $0.012$ kg of reference carbon is the textbook's historical convention, not the current definition of the mole.`,
      String.raw`The kilomole is also used:
$1$ kmol $=10^3$ mol.`,
      `If the amount of substance is $2.5$ mol, compare its specified entities with the atoms in $0.012$ kg of reference carbon using the textbook's historical convention.
The number of specified entities is $2.5$ times that reference atom count.
Modern conversion still multiplies amount of substance by the Avogadro constant, but uses the fixed value of the current definition instead of redefining it through this carbon sample.`,
      `**The Avogadro constant** $1$ mol contains the same number of specified entities.
The number of molecules and the number of their constituent atoms cannot be interchanged without distinguishing them.
The Avogadro constant relates amount of substance to number of specified entities; its name is not evidence that the scientist it names personally measured its value.

The original textbook explained the value using the number of atoms in $1$ mol of reference carbon, whose mass is approximately $0.012$ kg.
$0.012$ kg is the approximate mass of $1$ mol of the reference carbon.
Mass has the unit kg, whereas molar mass has the unit kg/mol.
They are different quantities.`,
      String.raw`In the textbook's historical estimate, the constant can be estimated by dividing the molar mass of reference carbon by the mass of $1$ atom of that same carbon.
The mass of $1$ carbon atom can be roughly estimated in a way similar to the water-molecule estimate above.
Atomic masses can also be measured using methods such as the deflection of ion beams in electromagnetic fields.

The textbook uses the rounded mass of $1$ reference carbon atom, $m_{0\text{carbon}}=1.995\times10^{-26}$ kg.
It then makes this classroom estimate:
$N_A=\frac{0.012}{1.995\times10^{-26}}\frac{1}{\text{mol}}$ $=6.02\times10^{23}$ mol$^{-1}$.
(1-3)

This calculation uses the textbook's approximate data; it is neither the current exact definition of the constant nor a new measurement of an exact value.
Using a different kind of atom also requires its corresponding molar mass; the denominator's atomic mass cannot be replaced on its own.`,
      String.raw`The unit mol$^{-1}$ belongs to $N_A$.
Multiplying amount of substance by $N_A$ gives the total number of entities, a count with no unit.
The number of specified entities in $1$ mol is not the same physical quantity as this constant with a unit.

Using the textbook's approximate value, $1$ kmol contains approximately $6.02\times10^{26}$ specified entities.`,
      String.raw`Historically, other experimental methods could also estimate the Avogadro constant.
Results must be compared within their respective uncertainties; not all measured digits are identical.
The current definition fixes its numerical value, so the textbook's account of measurements is not the current definition.
The Avogadro constant relates amount of substance to number of specified entities.

Knowing the amount of substance lets us find the total number of the same specified entities.
For $\nu=2.5$ mol, using the textbook's rounded constant gives $N=\nu N_A=15.05\times10^{23}$.
This lesson retains the original calculation without treating its final digit as a guarantee of experimental precision.`,
      String.raw`**Molar mass** Unlike relative molecular mass, which has no unit, molar mass $\mu$ gives the mass per mole of specified entities.
Dividing the mass of a $1$ mol sample by its amount of substance gives molar mass in kg/mol.
For the same kind of specified entity, it equals the mass of one entity multiplied by the Avogadro constant:
$\mu=m_0N_A$.
(1-4)

The mass of one entity, the entity count, and amount of substance must refer to the same counting entity.
When using an average mass, the averaging convention must also remain consistent.`,
      String.raw`Molar mass $\mu$ can be expressed using relative mass.
Following the textbook's historical carbon reference, substitute $m_0$ from (1-1) and $N_A$ from (1-3) into (1-4).
The original calculation gives $\mu=M_r\frac{m_{0\text{carbon}}}{12}\cdot\frac{0.012}{m_{0\text{carbon}}}=10^{-3}M_r$ kg/mol.
(1-5)

This lesson uses the relation as an approximate conversion, not an equality of unlimited precision guaranteed by the current SI.
More generally, molar mass equals relative mass multiplied by the molar mass constant.
Classroom calculations use the approximate coefficient above; high-precision measurements require authoritative constants and their uncertainties.`,
      String.raw`For example, this lesson counts carbon dioxide molecules $\mathrm{CO}_2$, uses the approximate molar mass $0.044$ kg/mol, and takes the relative molecular mass as $44$.
These are classroom rounded values, not exactly identical masses for samples of every isotopic composition.`,
      String.raw`Molar mass is also commonly expressed in g/mol.
With this lesson's approximate coefficient, $\mu'=M_r$ g/mol.
The primed symbol and the earlier symbol represent the same molar mass, expressed using different mass units.`,
      String.raw`For the same kind of specified entity, amount of substance $\nu$ corresponds to mass $m$:
$m=m_0N=m_0\nu N_A=\nu\mu$.
(1-6)

Mass, particle count, and amount of substance must always refer to the same kind of entity.
A mixture cannot automatically be treated using the mass of one particle of a single pure substance.`,
    ],
  },
  'phy9-c1-s2-n13': {
    task: 'D1073', prepare: 'd1816-d1072-n13-first-missing-en',
    boundaries: ['When gas molecules', "**Boyle's law is exact"],
    texts: [
      `Why do different gases approximately obey Boyle's law when the ideal-gas approximation is suitable, while liquids and solids do not share the same general inverse relation between volume and pressure?`,
      `In a relatively dilute gas, the average distance between molecules is much greater than their size.
The ideal-gas model neglects the molecules' own size and their interactions outside collisions, while retaining molecular motion and collisions.
Where this approximation applies, different gases share pressure, volume, and temperature relations.
This does not mean that intermolecular forces have no effect under all conditions.`,
      String.raw`When gas molecules strike the container walls, they transfer momentum.
Many collisions produce an average pressure.
Pressure depends both on how frequently collisions occur and on the momentum transferred in each collision.
For the same gas, keeping temperature, total particle count, and wall conditions unchanged, the number of collisions per unit wall area per unit time is proportional to the number of molecules per unit volume, $n$, called the number density.

Compressing the gas under these conditions increases its number density:
$n\propto\frac{1}{V}$.
In the ideal-gas approximation, pressure is therefore proportional to number density, so $p\propto\frac{1}{V}$, in agreement with Boyle's law.`,
      `For the same gas in thermal equilibrium at a fixed temperature, the average molecular speed stays unchanged.
This does not mean that every molecule has a constant velocity.
Under the conditions above, the average momentum transferred per collision does not change merely because the volume changes.
More frequent collisions per unit wall area per unit time then produce greater average pressure.

Thus, at fixed temperature and total particle count, an ideal gas has a constant product $pV$: if its volume decreases by a given factor, its pressure increases by that factor.`,
      `**Boyle's law is exact for the ideal-gas model**, but is only an approximation with conditions of applicability for real gases.
Real gases are usually closer to ideal behavior at lower densities and away from liquefaction or other phase changes.
Under strong compression, molecular volume and intermolecular interactions may no longer be negligible, so the gas can deviate from law (2-2).

The original textbook describes a case in which volume decreases more slowly than the ideal-gas prediction.
The size and direction of the deviation also depend on the gas and temperature; this direction is not a universal rule for all real gases in every state.`,
    ],
  },
  'phy9-c1-s2-n27': {
    task: 'D1082', prepare: 'd1816-d1081-n27-first-missing-en',
    boundaries: ['Over one complete cycle'],
    texts: [
      `The textbook describes the internal energy stored on Earth as "practically unlimited" to emphasize its enormous amount, not to claim that energy resources can never run out.
Having stored energy is not enough: some of it must be converted into mechanical work.
Lathes, vehicles, tractors and other agricultural machines, and electrical generators need such power.

An engine is a device that can do work on its surroundings.`,
      `The original textbook introduces heat engines as widely used and dominant engines in its era.
That historical overview is not a statistical claim about all power systems today.
This lesson considers fuel-driven heat engines, which convert part of the fuel's chemical internal energy into mechanical energy through heating and work.`,
      `In the fuel-driven heat engines discussed by the textbook, combustion raises the working substance's temperature above that of its surroundings.
The temperature difference in the textbook's examples can be hundreds or thousands of degrees.
Steam engines and internal-combustion engines often use gas or vapor as their working substance, but not all heat engines are restricted to gases.

Heating can increase gas pressure.
As the gas expands, it can push a piston or turbine blades, transfer energy to the surroundings, and do work.
Whether its internal energy decreases also depends on heat absorbed during the process.
The textbook's summary does not mean that every process involving heating and work necessarily reduces internal energy.`,
      `A heat engine that receives energy only as heat, repeatedly completes cycles, and delivers net work requires a temperature difference.
If its working substance and surroundings have the same temperature and there is no other energy input, it cannot keep producing net work in repeated cycles.
This does not rule out temporary work powered by another existing energy store.

**Over a complete cycle, a heat engine absorbs heat from a hotter source, releases heat to a colder sink, and converts the remaining part of that energy into work on the surroundings**.
The source must be hotter than the sink.`,
      `Steam engines, steam turbines, and internal-combustion engines obtain energy from burning fuel.
Actual devices also release energy to surrounding objects or the atmosphere.
The textbook also lists rocket engines, which are open-flow devices.
The energy account for a closed working substance undergoing a cycle cannot be applied to them without explanation.

The model below is a cyclic heat engine with a hot source at temperature $T_1$ and a colder sink at $T_2$.
It accounts for heat absorbed from the hotter side, heat released to the colder side, and work output.
It does not reduce every real engine's flow processes to the same closed cycle.`,
      `A steam boiler supplies heat to the working substance and can represent the hotter side.
Exhaust steam cools and condenses in a condenser, transferring heat to the cooling medium.
The condenser and its cooling environment form the colder side; the atmosphere can be the ultimate heat-rejection environment.

Fuel burns inside an internal-combustion engine, producing hot gases that provide energy for work.
Exhaust passes through a muffler into the atmosphere, and the muffler reduces exhaust noise.
Normal combustion is not always an explosion.

The textbook uses hot combustion products and the surrounding atmosphere to illustrate the hotter and colder sides.
Energy transfer in a real device must still be analyzed through its heat-transfer and flow processes.`,
      `Over one complete cycle, the working substance absorbs heat $Q_1$ from the source, delivers net work $A$, and releases heat $Q_2<Q_1$ to the sink.
Here both absorbed and released heat are positive magnitudes.
The positive sign for released heat does not mean that the working substance absorbs it at that step.

Distinguish these magnitudes from the previous lesson's signed-heat convention, in which absorbed heat is positive and released heat is negative.`,
      `**Heat-engine efficiency** depends on the energy account for a complete cycle.
The same working substance returns to its initial state, so its internal energy also returns to its initial value.
The model excludes additional energy input and output channels.

Conservation of energy therefore gives the net work output per cycle:
$A=Q_1-Q_2,$ $(2-37)$
This is not just the work done during one expansion.
It is the net output after subtracting work consumed during other parts of the cycle.`,
      String.raw`The ratio of net work output $A$ per cycle to heat $Q_1$ absorbed from the source is the heat engine's **efficiency**:
$\eta=\frac{A}{Q_1}=\frac{Q_1-Q_2}{Q_1}=1-\frac{Q_2}{Q_1}.$
$(2-38)$

In this lesson's cyclic heat-engine model, operating between two reservoirs at finite positive absolute temperatures, heat $Q_2$ must be released to the sink, so $\eta<1.$
This restriction is not caused only by friction.
Even without friction or other irreversible losses, all the heat received from the source cannot be converted into net work over a cycle.`,
    ],
  },
  'phy9-c1-s2-n28': {
    task: 'D1084', prepare: 'd1816-d1083-n28-first-missing-en',
    boundaries: ['The original textbook uses', '**Worked examples**'],
    texts: [
      `The French engineer and scientist Carnot was born in 1796.
In 1824, he published Reflections on the Motive Power of Fire, which examined the conditions under which heat engines are most efficient.
He died in 1832; his birth and death years are retained from the textbook.

The textbook gave an incorrect publication year, corrected here using the first edition's title page.
The work's central subject is the theoretical limit of heat-engine efficiency.`,
      String.raw`The original textbook uses an ideal gas as the working substance to introduce Carnot's ideal heat engine.
It completes cycles between a hot source at temperature $T_1$ and a cold sink at $T_2$.
Each process in the ideal cycle must be reversible, and each reservoir maintains a constant temperature.
The source is hotter than the sink, and both temperatures are absolute temperatures in kelvins.
Modern absolute-temperature notation expresses the reversible-cycle efficiency limit as:
$\eta_{\text{max}}=\frac{T_1-T_2}{T_1}.$
$(2-39)$

Treating the working substance as an ideal gas alone does not guarantee reversible processes or attainment of this limit.`,
      `Carnot's theorem states that **a cyclic heat engine operating between the same two constant-temperature reservoirs, absorbing heat from a source at $T_1$ and releasing heat to a sink at $T_2$, cannot be more efficient than a reversible heat engine**.
The comparison concerns net work over a complete cycle at the same reservoir temperatures, not the work done in a single step.

Reversible heat engines have the same efficiency limit, independent of the working substance.
Irreversible processes in actual engines reduce efficiency below that limit.`,
      `Formula $(2-39)$ gives a theoretical upper limit, not the efficiency already attained by every engine.
At a fixed sink temperature, increasing source temperature raises the limit.
At a fixed source temperature, lowering sink temperature also raises the limit.

Only formally setting the sink temperature to absolute zero gives $\\eta=1.$
Absolute zero is not an attainable operating temperature for a real sink.
This is a formal limit, not a design for a fully efficient cyclic engine.
The temperature ratio requires absolute temperatures, not Celsius temperature values.`,
      `Real heat sinks often use air or cooling water.
How cold they can become depends on the environment and cooling method.
The textbook's statement that a sink cannot be colder than the surrounding air is not a universal law.
Refrigeration can maintain a colder sink, but it requires work that must be included when comparing the whole system.

Increasing source temperature is limited by materials' heat resistance and strength at high temperatures.
A material's heat capacity does not directly determine its maximum permissible working temperature.
Heating may reduce strength or elasticity, and excessive temperature can cause melting.`,
      String.raw`Reducing friction and losses from incomplete fuel combustion can improve actual efficiency, but does not raise the Carnot limit for the same two constant-temperature reservoirs.
For a steam-turbine example, the textbook uses initial and final steam temperatures $T_1=800\ K$ and $T_2=300K.$
Treating them as idealized hotter-side and colder-side temperatures gives the textbook's upper-limit estimate:
$\eta_{\text{max}}=\frac{T_1-T_2}{T_1}\times100\%\approx62\%.$

The textbook's percentage approximation is retained.
Steam temperatures that change along its path cannot automatically be treated as two constant-temperature reservoirs.`,
      String.raw`For that steam-turbine example, the textbook gives the actual efficiency as $\eta\approx40\%.$
Its lower value reflects irreversible processes and other losses in that example.
It is not a fixed efficiency shared by all steam turbines or current equipment.`,
      `Improving heat-engine efficiency to approach the theoretical limit under the same operating conditions is an important engineering task for energy use and production equipment.`,
      '**Worked examples**',
      String.raw`1. A calorimeter initially contains water of mass $m_1=0.2$ kg at $t_1=20^\circ\mathrm{C}$.
Water of mass $m_2=0.3$ kg at $t_2=80^\circ\mathrm{C}$ is added, and the final equilibrium temperature is $t=50^\circ\mathrm{C}$.
Find the calorimeter's heat capacity.` + `\u2460` + `

Following the model in the solution below, the calorimeter initially has the same temperature as the first water sample.
Heat exchange with the surroundings is approximately neglected.`,
      `\u2460 In the calorimeter experiment in Section $22$, the textbook neglected the calorimeter's own heat capacity.
This example includes it in the heat balance.`,
      `Solution: Treat both water samples and the calorimeter as an approximately thermally isolated system.
Neglect heat exchange with the surroundings, and approximate the specific heat of water as constant over the temperature range.
The hot water at $t_2$ releases heat, with signed heat $cm_2(t-t_2)$.
This is negative; it does not mean that the magnitude of heat released is negative.

The cold water at $t_1$ absorbs heat $cm_1(t-t_1)$, and the calorimeter absorbs heat $C(t-t_1)$ because its initial temperature is also $t_1$.
With absorbed heat positive and released heat negative, the sum of the heat exchanged by the objects is zero:`,
      '$cm_2(t-t_2)+cm_1(t-t_1)+C(t-t_1)=0.$',
      `Solve the heat-balance equation for the calorimeter's heat capacity, retaining the textbook's algebraic expression:`,
      String.raw`The heat-balance equation gives:
$C=\frac{cm_1(t_1-t)+cm_2(t_2-t)}{t-t_1}$.
Substituting the given data and the specific heat of water gives:
$C\approx420$ joules per degree.

This heat capacity gives the heat required to raise the calorimeter's temperature by one degree.
Temperature differences have the same numerical value in Celsius degrees and kelvins.
The textbook's approximate numerical answer contained a printing error, corrected through a registered erratum using this example's data.
The algebraic expression and faithful record of the original remain unchanged.`,
      String.raw`2. A cylinder contains carbon dioxide gas of mass $m=0.2$ kg beneath a piston.
Its molar mass is $\mu=0.044$ kg/mol, and its temperature increases by $\Delta T=88$ kelvins.
Find the work done by the gas on its surroundings.
Approximate the gas as ideal, assume slow expansion against constant external pressure, and neglect piston friction.`,
      String.raw`Solution: The atmosphere and piston weight together provide a constant external pressure.
Neglect friction and let expansion be slow enough that gas pressure $p$ approximately equals that external pressure.
The gas then does work $A'=p(V_2-V_1)$, where $V_1$ and $V_2$ are its initial and final volumes.

Use the ideal-gas equation of state $(2-19)$ to express the pressure-volume products in terms of temperatures:
$pV_2-pV_1=\frac{m}{\mu}RT_2-\frac{m}{\mu}RT_1.$
Therefore:
$A'=p(V_2-V_1)=\frac{m}{\mu}R(T_2-T_1)=\frac{m}{\mu}R\Delta T$.
$A'=3324$ joules.

This value retains the textbook's gas constant and numerical precision and represents work done on the surroundings during this constant-pressure expansion.
Neither the total heat absorbed nor the change in internal energy can automatically be taken as the work requested here.`,
    ],
  },
  'phy9-c1-s3-n30': {
    task: 'D1086', prepare: 'd1816-d1085-n30-first-missing-en',
    boundaries: ['A real gas'],
    texts: [
      `**In kinetic theory, an ideal gas is a simplified model in which intermolecular interactions can be neglected except during brief collisions**.
The kinetic energy of thermal molecular motion dominates, and interaction potential energy has little effect on the gas's properties.

Taking interaction potential energy to be zero when molecules are far apart, the textbook summarizes this condition by saying that average kinetic energy is much greater than the magnitude of interaction potential energy.
This approximate comparison uses a specified potential-energy zero; it does not mean that molecules never collide.`,
      `In a thermodynamic description, a gas obeying the Mendeleev-Clapeyron equation $(2-19)$ is called an ideal gas.
The idealized kinetic model leads to the equation of state $(2-19)$, connecting the microscopic model and macroscopic equation.
These are two descriptions of the same ideal model, not a claim that real gases obey it exactly in every state.`,
      `A real gas can be approximated as ideal when it is sufficiently dilute and its temperature and other conditions make intermolecular interactions small.
Dilute means the average distance between molecules is much greater than their size, and their own volume occupies only a small fraction of the gas's volume.
In this approximation, molecules move approximately freely between collisions, and intermolecular attraction is neglected.

When molecules approach closely during brief collisions, short-range repulsion describes the collision.
This is a simplified model, not a claim that real intermolecular forces appear from nowhere at one instant.`,
      `Comparing molecules with tiny steel balls that have mass gives a simple mechanical picture of motion and collisions.
It does not mean that molecules are actually made of steel.
This model cannot explain every phenomenon in a dilute gas.
Real molecules can differ in mass and have their own internal structures, which must be considered for some processes.`,
      `This lesson limits the problem to calculating gas pressure using kinetic theory.
Where intermolecular effects are negligible and collisions are approximately elastic, the simple model can give pressure relations consistent with experiment.
Success for this problem does not mean that every molecular process can be described by the same model.`,
    ],
  },
  'phy9-c1-s3-n31': {
    task: 'D1088', prepare: 'd1816-d1087-n31-first-missing-en',
    boundaries: ['To study average', 'In the isotropic'],
    texts: [
      `A gas contains an enormous number of molecules, which continually collide.
Tracking every molecule's motion individually is very difficult.
This lesson instead uses statistical averages to study how collective molecular motion affects macroscopic properties.`,
      `The experiments discussed in the first chapter help us understand the collective motion of gas molecules.
**Molecules undergo irregular, disordered thermal motion**.

Individual molecules can have different speeds, and collisions can change both speed and direction.
They do not all move with the same velocity in one direction.`,
      `Irregular motion of individual molecules does not mean that their collective motion has no statistical laws.
Averaging over many molecules can give stable macroscopic relations.`,
      `We consider a gas in thermal equilibrium with isotropic thermal motion, using a reference frame in which the gas as a whole is at rest.
In this model, no direction of motion is preferred.
On average, the number of molecules moving in a given direction equals the number moving in the opposite direction.

This is a comparison of statistical averages, not a requirement for exactly equal counts in every instantaneous finite sample.
It cannot be applied directly to a velocity distribution with directed flow.`,
      `The textbook uses pedestrians on a street as an analogy.
If the pedestrian flow has no directional bias and is observed for a sufficiently long time, average numbers moving in each direction can be compared.
Organized, directed flow, such as a parade, is outside this analogy's conditions.
The example illustrates statistical averaging; a city street does not itself guarantee equal numbers in every direction.`,
      `Individual molecular speeds differ, but a definite average speed can be calculated for a given group of molecules.
In thermal equilibrium, statistical averages over many molecules are relatively stable.
This does not mean that every instantaneous finite-sample average is identical.
Similarly, students in a class have different ages but can have an average age.

Adding their ages and dividing by the number of students gives that average.
The average age need not equal every student's age.`,
      `To study average translational kinetic energy, we square each molecular speed first and then average these squares.
The average of squared speeds generally differs from the square of average speed.
They must not be interchanged.`,
      String.raw`Let $v_1$, $v_2$, $v_3$, ..., $v_n$ be the molecules' speeds relative to the gas as a whole, meaning the magnitudes of their velocity vectors.
The mean square speed is:
$\overline{v^2}=\frac{v_1^2+v_2^2+v_3^2+\cdots+v_n^2}{n}.$
$(3-1)$`,
      `Here $n$ is the total number of gas molecules included in the average.
In this formula it is a molecule count, not the number of molecules per unit volume.`,
      String.raw`For mutually perpendicular axes $Ox$, $Oy$, $Oz$, the squared magnitude of a velocity vector equals the sum of its squared components` + `\u2460` + String.raw`:
$v^2=v_x^2+v_y^2+v_z^2.$
$(3-2)$

Velocity components may be positive or negative, but their squares do not distinguish opposite signs.`,
      `\u2460 For any vector expressed using mutually perpendicular axes, the sum of its squared components equals the square of its magnitude.
This follows from the Pythagorean theorem.`,
      String.raw`The averages $\overline{v_x^2}$, $\overline{v_y^2}$, and $\overline{v_z^2}$ can be calculated similarly to $(3-1)$.
The average $\overline{v^2}$ is related to the component-square averages by averaging $(3-2)$:
$\overline{v^2}=\overline{v_x^2}+\overline{v_y^2}+\overline{v_z^2}.$
$(3-3)$

This step only averages the identity for each molecule.
It does not yet require motion in every direction to be equivalent.`,
      `In the isotropic thermal-motion model specified above, directions $Ox$, $Oy$, and $Oz$ are equivalent.
Their component-square averages are therefore equal:`,
      String.raw`$\overline{v_x^2}=\overline{v_y^2}=\overline{v_z^2}.$
$(3-4)$`,
      String.raw`Using the isotropic relation $(3-4)$, take $\overline{v_x^2}$ as the common value of $\overline{v_y^2}$ and $\overline{v_z^2}$ and substitute it into $(3-3)$ to obtain one component-square average:`,
      String.raw`$\overline{v_x^2}=\frac{1}{3}\overline{v^2},$ $(3-5)$`,
      `Thus, in the isotropic thermal-motion model, the mean square of one velocity component is $1/3$ of the mean square speed.
The factor $1/3$ follows from equal distribution among three mutually perpendicular directions, not merely from having three projections.
With directional bias, the component-square sum relation still holds, but the component-square averages need not be equal.`,
    ],
  },
};
const card = process.argv[2], config = configs[card];
assert(config);
const preparedPath = `${ticket}/tmp/${config.prepare}/prepared.json`;
const prepared = read(preparedPath);
assert.equal(bind(prepared.approvedZh.path).sha256, prepared.approvedZh.sha256);
const lesson = read(prepared.approvedZh.path);
const tocPath = `${repo}/ssot-resources/soviet10year-textbooks/toc/9p/en.json`;
const matches = read(tocPath).contents.flatMap(chapter => (chapter.lessons || []).flatMap(section =>
  (section.topics || []).filter(topic => topic.id === card).map(topic => ({ chapter, topic }))));
assert.equal(matches.length, 1);
const { chapter, topic } = matches[0];
Object.assign(lesson, {
  edition: 'modern-us-neutral-en', locale: 'en', status: 'draft',
  title: topic.title, chapter: chapter.title, printed_title: `${topic.printedNumber}. ${topic.title}`,
});
assert.equal(config.texts.length, lesson.prose.length);
for (let i = 0; i < config.texts.length; i++) lesson.prose[i].text = config.texts[i];
const localizedNames = {
  '\u6cd5\u56fd': 'French', '\u5361\u8bfa': 'Carnot',
  '\u95e8\u6377\u5217\u592b': 'Mendeleev', '\u514b\u62c9\u73c0\u9f99': 'Clapeyron',
  '\u6bd5\u8fbe\u54e5\u62c9\u65af': 'Pythagorean',
};
for (const block of lesson.prose)
  block.historical_entities = (block.historical_entities || []).map(entity => {
    assert(localizedNames[entity.term], `No source-bound English name for ${entity.term}`);
    return { ...entity, term: localizedNames[entity.term], source_term: entity.source_term || entity.term };
  });
if (card === 'phy9-c1-s1-n6') {
  lesson.errata[0].corrected = '$0.012$ kg is the approximate mass of $1$ mol of the reference carbon.';
  lesson.errata[1].corrected = String.raw`$1$ kmol contains approximately $6.02\times10^{26}$ specified entities.`;
}
const out = `${ticket}/tmp/d1816-${config.task.toLowerCase()}-${card.split('-').at(-1)}-first-missing-en`;
const input = `${out}/en.before-native.json`;
save(input, lesson);
const receipt = run(`${config.task.toLowerCase()}-${card.split('-').at(-1)}-first-missing-en-author-native`, [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c',
  `import sys,json
from pathlib import Path
sys.path.insert(0,${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(input)}))
prepared=edition.load(Path(${JSON.stringify(preparedPath)}))
raw=edition.load(Path(prepared["source"]["path"]))
zh=edition.load(Path(prepared["approvedZh"]["path"]))
book=Path(prepared["source"]["path"]).parents[2]
raw_ex=edition.load(book/"lessons"/lesson["id"]/"exercises.json")
edition.normalize_lesson_layout(lesson)
flow,errors=edition.prose_flow_contract(lesson["prose"],[])
boundaries=[]
for prefix in ${JSON.stringify(config.boundaries)}:
    indices=[i for i,p in enumerate(flow["paragraphs"]) if p["text"].startswith(prefix)]
    assert len(indices)==1 and indices[0]>0,(prefix,indices)
    i=indices[0]
    boundaries.append({"before":flow["paragraphs"][i-1]["text"],"after":flow["paragraphs"][i]["text"]})
lesson["section_breaks"]=boundaries
flow,flow_errors=edition.prose_flow_contract(lesson["prose"],boundaries)
errors.extend(flow_errors)
errors.extend(edition.validate_lesson_identity(raw,lesson))
corrections,errata_errors=edition.validate_errata(book,raw,raw_ex,lesson,{"exercises":[]})
errors.extend(errata_errors)
profile=edition.load(Path(${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json`)}))
for i,(modern,approved,source) in enumerate(zip(lesson["prose"],zh["prose"],raw["prose"])):
    modern["changes"]=[] if modern["text"]==source["text"] else list(dict.fromkeys(modern["changes"]+["translation"]))
    assert edition.math_signature(modern["text"])==edition.math_signature(approved["text"]),(i,"math signature")
    errors.extend(edition.validate_identity_fields(source,modern,["kind","id","printed_page","source_refs"],f"en.prose[{i}]"))
    errors.extend(edition.validate_text(source["text"],modern["text"],modern["changes"],modern["numeric_changes"],f"en.prose[{i}]",profile["forbidden_terms"]+profile["forbidden_person_names"],modern.get("historical_entities"),corrections.get(f"lesson.prose[{i}]")))
print(json.dumps({"lesson":lesson,"flow":flow,"errors":errors},ensure_ascii=False))
assert not errors,errors`,
]);
const output = JSON.parse(fs.readFileSync(read(receipt.path).streams.stdout.path, 'utf8'));
save(`${out}/en.lesson.draft.json`, output.lesson);
save(`${out}/en.prose-flow.json`, output.flow);
save(`${out}/authored.json`, {
  task: config.task, card, status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS',
  prepared: bind(preparedPath), source: prepared.source, approvedZh: prepared.approvedZh,
  historicalZhNative: prepared.completeChineseHistoricalNative,
  historicalZhScience: prepared.historicalZhScience,
  historicalZhScienceBinding: prepared.historicalZhScienceBinding,
  englishToc: bind(tocPath), englishBeforeNative: bind(input),
  englishDraft: bind(`${out}/en.lesson.draft.json`), englishFlow: bind(`${out}/en.prose-flow.json`),
  nativeReceipt: receipt, errors: output.errors, originalObjects: config.texts.length,
  originalTasks: 0, originalFigures: 0, flowParagraphs: output.flow.paragraphs.length,
  derivedConceptBoundaries: config.boundaries.length,
  registeredErrataSourceOriginalReasonAndTargetsUnchanged: true,
  onlyErrataCorrectedProseLocalizedWhenRequired: card === 'phy9-c1-s1-n6',
  originalSourceZhAndFigureReviewReplayed: false,
  alreadyCountedInHistoricalBatch: prepared.alreadyDeliveredAndCountedInHistoricalBatch,
  independentEnglishReviewAndFullNativeFinalize: 'pending',
  fullCourseApproval: false, parentNewImages: 0, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ author: bind(`${out}/authored.json`),
  draft: bind(`${out}/en.lesson.draft.json`), paragraphs: output.flow.paragraphs.length }));
