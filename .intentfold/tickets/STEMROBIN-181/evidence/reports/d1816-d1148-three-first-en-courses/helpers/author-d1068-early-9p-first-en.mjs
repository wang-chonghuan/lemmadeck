import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';
import { expansionConfigs } from './texts-d1136-n56-n57.mjs';
import { oscillatorConfigs } from './texts-d1158-10p-n10.mjs';

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
  'phy9-c1-s3-n33': {
    task: 'D1105', prepare: 'd1816-d1104-n33-first-missing-en',
    boundaries: ['Relation $(3-14)$', 'Extrapolating the classical model'],
    texts: [
      `In the classical ideal-gas model, the absolute temperature of a gas in thermal equilibrium measures the mean translational kinetic energy of its molecules' random thermal motion.
This translational kinetic energy is calculated in a reference frame in which the gas as a whole is at rest.
It excludes the kinetic energy of bulk gas flow and is not the molecules' total energy.
We will derive this relationship from the basic kinetic-theory equation and the gas equation of state.`,
      String.raw`For this derivation, take $1$ mol of gas and denote its molar volume by $V_\mu$.
The Avogadro constant $N_A$ (see Section $6$) gives the number of molecules per mole.
The number of molecules in $1$ mol can therefore be found by multiplying the number density by the volume of that gas sample.`,
      String.raw`Multiply both sides of equation $(3-11)$ by $V_\mu$ and use $nV_\mu=N_A$ in the textbook's molar notation.
Number density multiplied by a chosen sample volume gives the number of molecules in that volume.
This gives:`,
      String.raw`$pV_\mu=\frac{2}{3}N_A\overline E.$
$(3-12)$`,
      String.raw`Formula $(3-12)$ connects the macroscopic pressure $p$ and volume $V$ with the molecules' mean translational kinetic energy.
Here the amount of gas is one mole, so the volume used is the molar volume.
Translational kinetic energy is the kinetic energy of the molecules' random center-of-mass motion.
It excludes rotation, internal vibration, and interaction potential energy.`,
      `The experimentally established equation of state for $1$ mol of ideal gas (see Section $17$) also uses absolute temperature.
Temperature must be expressed in kelvins, not substituted directly as a Celsius value.
The equation is:`,
      String.raw`$pV_\mu=RT.$
$(3-13)$`,
      `Equations $(3-13)$ and $(3-12)$ describe the same ideal gas in thermal equilibrium.
Their left-hand sides are equal, so their right-hand sides must also be equal.
This gives the relationship between mean molecular translational kinetic energy and absolute temperature:`,
      String.raw`$\overline E=\frac{3}{2}\frac{R}{N_A}T.$
$(3-14)$`,
      `For a classical ideal gas in thermal equilibrium, the mean translational kinetic energy of random molecular motion is proportional to absolute temperature.
For the same gas, a higher temperature means a greater mean square speed.
This is the statistical meaning of saying that the molecules "move faster."
It does not mean that every molecule moves at the same speed or that different gases at the same temperature have the same average speed.`,
      `Relation $(3-14)$ is first established for a classical dilute ideal gas.
The statement that particles "obey Newtonian mechanics" alone does not justify extending it to every state of matter.
In thermal equilibrium, where classical equipartition applies, each independent squared-velocity term in the kinetic energy has a temperature-dependent mean energy.
These are the conditions for extending the connection between temperature and mean kinetic energy to other substances.
Atoms in a crystal can vibrate near equilibrium lattice positions.
Particles in a liquid are not generally fixed at lattice sites.

When comparing liquids and solids, distinguish the particles' mean kinetic energy from their total energy, which includes interaction potential energy.
If a gas and its container walls have the same temperature, and the particle kinetic energies being compared have the same classical degrees of freedom and satisfy equipartition, their mean kinetic energies are equal.
This does not mean that all their microscopic energies are equal.

Extrapolating the classical model toward absolute zero makes the mean kinetic energy of molecular thermal motion approach zero.
At actual low temperatures, quantum effects must also be considered` + `\u2460.`,
      `\u2460 Near absolute zero, the approximations of classical mechanics and classical equipartition may fail, requiring a quantum-mechanical description.
In quantum mechanics, absolute zero corresponds to the system's lowest-energy state, not the complete cessation of all particle motion.
Bound quantum particles can still have zero-point motion.
The classical formula cannot be extrapolated to claim that every system's entire kinetic energy is zero.`,
    ],
  },
  'phy9-c1-s3-n36': {
    task: 'D1107', prepare: 'd1816-d1106-n36-first-missing-en',
    boundaries: ['More complex gas molecules', '**Worked examples**', '2. A balloon'],
    texts: [
      `Each particle in a monatomic gas consists of one atom.
Helium, neon, and argon are examples of noble gases used in this lesson.
We will discuss their internal energy under classical thermal-equilibrium conditions where the ideal-gas approximation applies.`,
      `The ideal-gas model neglects intermolecular interaction potential energy and takes that energy to be zero for separated particles.
This does not mean that real gases never interact or that an arbitrary choice of energy zero is an absolute fact.
For a monatomic ideal gas with no bulk flow, the internal energy considered here comes from the atoms' random translational motion.

This lesson excludes changes in internal energies such as electronic excitation.`,
      String.raw`To find the internal energy of a gas of mass $m$, multiply the mean energy of 1 atom in $(3-14)$ by the number of atoms.
That number is the amount of substance $\nu=\frac{m}{\mu}$ multiplied by the Avogadro constant $N_A$ (see formulas 1-2 and 1-6 in Section 6).
The mass of one molecule or atom must not be confused with the total mass of the gas sample.

Here the mass in the formula refers to the entire sample.
Dividing it by molar mass gives the amount of substance.`,
      String.raw`Multiply $(3-14)$ by the number of atoms, $\frac{m}{\mu}N_A$, to obtain the internal energy of a monatomic ideal gas:`,
      String.raw`$U=\frac{m}{\mu}\frac{3}{2}RT.$
$(3-20)$
Temperature must be absolute temperature in kelvins, not a Celsius value substituted directly.`,
      `**For a fixed amount of monatomic ideal gas, under this lesson's classical approximation and energy-zero convention, internal energy is proportional to absolute temperature.**`,
      `More complex gas molecules can also have internal motions such as rotation and vibration.
If the degrees of freedom available to store energy remain unchanged over a temperature range, $U$ and $T$ can also have an approximately fixed ratio, but with a different coefficient.
This relationship cannot be extended unconditionally to every polyatomic gas at every temperature.

This lesson first distinguishes the contributions from translation and rotation.`,
      `According to $(3-20)$, the internal energy of a fixed amount of ideal gas depends only on temperature, not separately on volume.
During isothermal ($T=$ constant) compression or expansion, internal energy therefore remains unchanged.
If only heat transfer and volume work are involved, the first law of thermodynamics $(2-34)$ gives the work done by the gas as $A'=Q$ (see Section 25).

During expansion, the gas can absorb heat and do work on its surroundings.
During compression, the surroundings do work on the gas, which can release heat.
This does not mean that no heat is transferred.
Heat transfer and volume work balance, leaving internal energy unchanged.`,
      String.raw`An adiabatic process has no heat exchange, so $\Delta U=A$ (see Section 26).
Here the textbook's symbol denotes work done on the gas by its surroundings.
During compression, the surroundings do positive work, increasing the gas's internal energy and temperature.

The changes are reversed when the gas expands adiabatically and does work on its surroundings.`,
      `**Worked examples**`,
      String.raw`1. The gas in an electric light bulb has density $\rho=0.9$ kg/m$^3$.
When the light is on, its pressure rises from $p_1=8\times10^4$ N/m$^2$ to $p_2=1.1\times10^5$ N/m$^2$.
Approximate the mass and volume of gas in the sealed bulb as unchanged.
Find the increase in molecular root-mean-square speed.

Solution: The mass $m$ of one molecule multiplied by the number of molecules per unit volume, $n$, gives the mass density $\rho=mn$.
The basic kinetic-theory equation $(3-10)$ can therefore be written as $p=\frac{1}{3}\rho\overline{v^2}$.
In this example, the textbook's barred-speed notation represents the square root of the mean square speed.

Here it is explicitly called root-mean-square speed, not arithmetic mean speed.
Thus, $\overline v_1=\sqrt{\frac{3p_1}{\rho}}$ and $\overline v_2=\sqrt{\frac{3p_2}{\rho}}$.
Subtracting gives:

$\overline v_2-\overline v_1=\sqrt{\frac{3}{\rho}}(\sqrt{p_2}-\sqrt{p_1});\ \overline v_2-\overline v_1\approx90$ m/s.`,
      String.raw`2. A balloon of volume $V=500$ m$^3$ is filled with helium at an initial pressure $p=10^5$ N/m$^2$.
Sunlight raises the gas temperature from $t_1=10^\circ\mathrm{C}$ to $t_2=25^\circ\mathrm{C}$.
How much heat does it absorb?
Following the textbook solution's idealized conditions, hold both the amount of gas and the balloon volume fixed and calculate heat absorbed by the gas alone.

This constant-volume solution cannot be used directly for a real flexible balloon that expands.`,
      String.raw`Solution: Under the constant-volume approximation above, volume work is $A=0$.
The first law of thermodynamics gives absorbed heat as the increase in internal energy:
$Q=\Delta U=U_2-U_1$.

Helium is monatomic.
Use formula $(3-20)$ and then the Mendeleev-Clapeyron equation for the initial state:`,
      String.raw`$\frac{m}{\mu}R=\frac{pV}{T_1}$ and $\frac{m}{\mu}RT_1=pV.$
Pressure and volume here are the initial-state values, and temperature is in kelvins.
A temperature difference has the same numerical value in kelvins and degrees Celsius.`,
      `This gives:`,
      String.raw`$Q=U_2-U_1=\frac{m}{\mu}\frac{3}{2}RT_2-\frac{m}{\mu}\frac{3}{2}RT_1$ $=\frac{3}{2}pV\frac{T_2}{T_1}-\frac{3}{2}pV.$`,
      `Therefore:`,
      String.raw`$Q=\frac{3}{2}pV\frac{T_2-T_1}{T_1}\approx4\times10^6$ joules.
This is an approximate result under the textbook's conditions.
It excludes energy used to heat the balloon material or do expansion work.`,
    ],
  },
  'phy9-c1-s4-n37': {
    task: 'D1109', prepare: 'd1816-d1108-n37-first-missing-en',
    boundaries: ['Turning a liquid', 'For a liquid of mass', 'Along liquid-vapor coexistence'],
    texts: [
      `The previous chapter discussed gas properties.
Interactions between particles in liquids are more complex.
This chapter begins with transformations between liquids and gases, without developing a complete quantitative theory of liquids.`,
      `A puddle gradually drying and water boiling in a kettle are examples of liquid turning into vapor` + `\u2460.
Vaporization includes evaporation at the surface and boiling, in which vapor also forms inside the liquid under suitable conditions.
In the molecular picture, surface molecules with enough energy to overcome the surrounding attraction can escape.

Evaporation does not mean that every molecule must move far faster than the average speed.`,
      `\u2460 The textbook calls the gaseous form of a substance that is normally liquid under ordinary conditions "vapor."
Vapor is a gas, not another state separate from the gaseous state.
How readily it condenses also depends on temperature, pressure, and the substance.`,
      `Cooling water vapor can condense into droplets, for example on a cold plate or as tiny liquid droplets in clouds.
Condensation is the change from gas to liquid.
Visible droplets are not the same as invisible gaseous water molecules.`,
      `Evaporation, boiling, and condensation were introduced in Grade Seven.
Here we review the principles for calculating phase-change heat and specify the temperatures and conditions involved.`,
      `Turning a liquid into vapor at the same temperature requires energy transfer.
At unchanged temperature, the molecules' mean thermal kinetic energy does not increase as it does during heating.
However, their average separation and interactions change, and the potential-energy part of internal energy can increase.
Vaporization increases volume and can also involve work against external pressure.

The required heat is not merely heat for a temperature rise or a change in instantaneous particle speeds.`,
      `**The heat required to turn 1 kilogram of liquid into vapor at the same temperature, under specified temperature and phase-change conditions, is called the specific latent heat of vaporization.**
The textbook abbreviates this as "heat of vaporization" and denotes it by $L$.
Its unit is J/kg, and cal/g is also used.

It is phase-change heat per unit mass, not the total heat needed for an arbitrary mass of liquid.
Specify the substance, temperature, and corresponding pressure conditions when using it.`,
      String.raw`The textbook gives water's specific latent heat of vaporization at $100^\circ\mathrm{C}$ as approximately $2.256\times10^6$ J/kg, or $539$ cal/g.
This is an approximate value at the corresponding boiling conditions.
The textbook also compares alcohol, ether, mercury, and gasoline as rough orders of magnitude, giving about $\frac{1}{3}\sim\frac{1}{10}$ of water's value.

This range does not hold exactly for every liquid at every temperature.
In particular, a mixture's phase-change properties cannot always be summarized by one fixed value.
Use the material-property value for the conditions specified in a problem.`,
      `For a liquid of mass $m$ that completely vaporizes under the specified conditions, the required heat is:`,
      String.raw`$Q_{\text{vap}}=mL.$
$(4-1)$
This accounts only for the phase change itself, not heat needed to bring the liquid to the phase-change temperature.`,
      `When the same mass of vapor condenses at the same temperature and corresponding conditions, it releases the same magnitude of heat as the reverse vaporization process` + `\u2460:`,
      `\u2460 Use the heat-sign convention in which absorbed heat is positive and released heat is negative.
The negative sign means energy leaves the substance being studied.
It does not mean that the specific latent heat of vaporization is negative.`,
      String.raw`$Q_{\text{cond}}=-mL.$
$(4-2)$
The subscripts simply name the vaporization and condensation processes.`,
      `Along liquid-vapor coexistence conditions, specific latent heat of vaporization usually decreases as temperature rises.
The textbook gives a qualitative molecular picture: thermal motion increases and liquid cohesion becomes harder to maintain.
This explains the trend without saying that attractive forces themselves are "cut off."

The exact phase-change heat also depends on the energy and volume differences between the two phases.`,
      String.raw`The textbook lists these approximate values for water at different temperatures and their corresponding liquid-vapor coexistence conditions:
At $0^\circ\mathrm{C}$, $2.59\times10^6$ J/kg.
At $50^\circ\mathrm{C}$, $2.38\times10^6$ J/kg.

At $100^\circ\mathrm{C}$, $2.26\times10^6$ J/kg.
At $200^\circ\mathrm{C}$, $1.96\times10^6$ J/kg.
The corresponding pressures differ.
These values do not imply liquid-vapor equilibrium at the same atmospheric pressure in every case.

The values at different temperatures illustrate the trend in specific latent heat of vaporization.`,
    ],
  },
  'phy9-c1-s5-n45': {
    task: 'D1125', prepare: 'd1816-d1124-n45-first-missing-en',
    boundaries: ['Under fixed temperature', 'Under the conditions above', 'For a pure substance'],
    texts: [
      `When spilled water spreads on the ground or a small bubble forms, the liquid's surface area increases.
Creating a new surface layer moves some molecules from the liquid interior to the region near the interface.
In the textbook's molecular-attraction model, surface molecules have fewer neighboring liquid molecules and interact differently from molecules in the interior.

Creating more interface requires work against molecular attraction.
In this simplified picture, molecular forces do negative work as interaction potential energy increases.
The surface layer has extra interaction potential energy relative to the interior.
The textbook describes this through an increase in average intermolecular separation.
This does not mean that every distance around every molecule must increase at the same time.`,
      `In that simplified molecular-attraction explanation, the surface layer has extra interaction potential energy relative to the liquid interior.
The energy associated with the interface is called **surface energy**.
This is a microscopic picture of the energy needed to create an interface, not a molecule-by-molecule comparison of every moving particle's instantaneous potential energy.`,
      `Macroscopically, an interface can contribute extra internal energy.
However, surface internal energy cannot generally be equated directly with the surface free energy that determines surface tension.
The simplified model below holds temperature, interface composition, and the adjoining media fixed.
It interprets the work needed to create an interface reversibly as surface free energy relative to a state without that interface.
In this sense, the lesson's surface energy is neither the liquid's general internal energy nor necessarily the interface's entire internal-energy contribution.

The textbook's statement that gases "do not have it" should mean only that a uniform gas does not maintain its own free liquid surface.
It does not imply that interfaces involving gases have no interfacial energy.`,
      `In the textbook's bubble example, a pressure difference does work to enlarge the bubble, and some of this work can increase interfacial energy.
For an approximately stationary bubble in air whose surface tension opposes expansion, its internal pressure must exceed the surrounding atmospheric pressure.
Actually blowing a bubble can involve other energy changes.

As water falls to the ground and spreads, gravitational work can supply energy for increased interface area.
Wetting of the ground, other interface energies, and energy dissipation also affect real spreading.
Not all gravitational work can be identified as an increase in surface energy.`,
      String.raw`Under fixed temperature, adjoining media, and interface composition, assume a uniform interface whose surface-tension coefficient does not change with area.
Neglect extra effects such as very small curvature.
Equal areas of interface then have equal surface free energy.
Following the textbook's quantities, denote this model's surface free energy relative to no interface by $U_{\text{surface}}$ and its area by $S$.

Under these conditions, the ratio of surface energy to area is constant, independent of the area $S$.
It is called the **surface-tension coefficient** and is denoted by $\sigma$.
The descriptive subscript means only "surface," not an added physical quantity or value.`,
      String.raw`$\sigma=\frac{U_{\text{surface}}}{S}$.
(5-1)`,
      `Thus, in the fixed-temperature model just specified, the surface-tension coefficient is surface free energy per unit area.
It also represents the work needed to increase interface area reversibly by one unit.
For a uniform liquid interface in equilibrium, the same coefficient corresponds to tangential tension per unit boundary length.
These equivalent statements do not mean dividing arbitrary interfacial internal energy by area under any conditions.`,
      `The surface-tension coefficient depends on the adjoining media and temperature, and can also change with interface composition.
In the energy description, its unit is joules per square meter (J/m$^2$), consistent with surface free energy.
In the mechanical description, this unit is equivalent to newtons per meter.
This does not make the coefficient identical at every temperature and in every interface state.`,
      `Under the conditions above, reducing interface area reduces surface free energy.
In the simplified molecular-potential-energy picture, molecular attraction can do positive work as molecules return to the liquid interior.
The textbook describes this through decreasing intermolecular distances.

This explains energy release during surface contraction, not a requirement that all molecular distances change in the same way.
For a fixed liquid volume with a uniform surface-tension coefficient, and with no gravity, external force, container constraint, or other interface interaction affecting shape, stable equilibrium can be found by minimizing surface free energy.
Minimum energy then corresponds to minimum area, so a free droplet's equilibrium shape is spherical.

When gravity, external forces, or solid contact matter, include their energies and constraints as well.
Not every liquid equilibrium state must have the smallest surface area.`,
      `For a pure substance's liquid and its saturated vapor, raising temperature along liquid-vapor equilibrium coexistence conditions toward the critical temperature makes the phases increasingly alike.
At the corresponding critical point, their distinction and the distinguishable liquid-vapor interface disappear.
Approaching the critical point from the coexistence region, the liquid-vapor surface-tension coefficient tends to zero.

This limiting value can be recorded as zero at the critical point, where no distinguishable liquid-vapor interface remains.
The statement concerns that coexistence interface approaching its critical point.
It is not a claim that every pair of adjoining media or every heating path has the same surface-tension trend.`,
    ],
  },
  'phy9-c1-s6-n54': {
    task: 'D1130', prepare: 'd1816-d1129-n54-first-missing-en',
    boundaries: ['As a crystal warms', '**At the melting temperature', 'The textbook compares',
      'For the solid and liquid phases', 'Under ordinary conditions, water expands',
      '**Worked examples**', '**2.**', '**3.**'],
    texts: [
      `A pure crystalline substance has a corresponding melting temperature at a specified pressure when its solid and liquid phases are approximately in equilibrium and no other phase or chemical change occurs.
Impurities, nucleation, and heating or cooling conditions also affect observations.
A "strictly determined" temperature does not mean one identical temperature for every sample and process.

At standard atmospheric pressure, the textbook gives these examples: ice melts at $0^\\circ\\text{C}$, mercury freezes at $-39^\\circ\\text{C}$, and tin melts at $232^\\circ\\text{C}$.
The approximate textbook values are retained.
Mercury is mentioned for comparison only, without handling it.`,
      `In the approximately equilibrium melting process at fixed pressure considered here, heat must be transferred to supply the phase-change energy.
If the solid-liquid system is already in equilibrium and its constraints remain fixed, with no net heat transfer or other energy exchange, the masses of its phases can remain unchanged.
Isolation alone does not ensure immediate equilibrium.

The system can still adjust if internal temperature differences remain or the phases are not yet in equilibrium.
When a liquid releases heat and conditions allow crystal formation, the reverse of melting can occur: **crystallization**.
For the same pure substance in solid-liquid equilibrium at the same pressure, crystallization and melting temperatures are equal.

Real cooling can involve supercooling.
Not every crystallization process remains at constant temperature throughout.`,
      `As a crystal warms, its constituent atoms, ions, or molecules change their thermal motion and interactions.
In a simple classical particle model, warming usually increases mean thermal kinetic energy.
Thermal expansion also involves changes in particle interactions.
No fixed division between kinetic- and potential-energy increases applies to all crystals.

During approximately equilibrium melting at fixed pressure, a substance can continue to absorb heat with approximately unchanged temperature.
Energy goes into the solid-liquid phase change rather than continued warming.
The textbook's explanation in terms of increasing particle potential energy is a simplified microscopic picture.
Unchanged temperature does not mean that each particle's kinetic energy or every internal degree of freedom is exactly unchanged.

At constant pressure, phase-change heat reflects the enthalpy difference between the phases.
This includes internal-energy change and work on the surroundings when volume changes.
Not all latent heat universally becomes potential energy alone.
Many substances expand on melting, but not all expand greatly, and substances such as ice contract.
Volume change alone does not determine latent heat or the microscopic potential-energy change.`,
      `**At the melting temperature for a specified pressure, the heat $\\lambda$ needed to turn 1 kilogram of crystalline substance completely into liquid at the same temperature is called the specific latent heat of fusion.**
This follows the textbook's term "heat of melting" and describes phase-change heat per unit mass.
Its usual unit is J/kg.

Its value depends on the substance, phases, pressure, and other conditions.
It accounts only for the phase change at unchanged temperature.
It excludes heat needed to warm a colder solid to its melting point or to heat the liquid further.`,
      `At the same pressure, if crystallization and melting have reversed initial and final states, crystallizing 1 kilogram releases the same magnitude of heat that melting absorbs, with the opposite sign.
This follows from the corresponding energy balance.
Arbitrary processes cannot be compared without considering their initial and final states and energy exchanges.
Liquid water freezing in clouds, or water vapor depositing directly as ice crystals, releases the corresponding latent heat and can affect the local heat budget.

Whether the ground warms also depends on air transport, radiation, and other conditions.
Snowfall therefore does not guarantee ground warming, and crystallization heat is not the only possible reason for warming during snowfall.
The textbook gives the approximate heat of fusion of ice as:
$3.4\\times10^5$ J/kg $=80$ cal/g.

The textbook's written equality is retained as a rounded approximate conversion, not an exact equality.
Melting needs heat, which affects the rate at which ice and snow melt.
The textbook imagines spring air just reaching $0^\\circ\\text{C}$ and ice and snow becoming water rapidly if no phase-change heat were needed.
This emphasizes the energy requirement, not a prediction of how much will melt in a few minutes or seconds.

Actual melting rate also depends on mass, initial temperature, and the heat that can enter.
Air reaching the melting temperature alone does not mean all the ice and snow have melted.`,
      `For a crystal of mass $m$ already at its melting temperature for the specified pressure, the heat needed to melt it completely into liquid at the same temperature is:
This accounts only for the phase change.
Include heating separately if the solid starts below its melting point or the liquid must warm further.`,
      String.raw`$Q_{\text{melt}}=\lambda m$.
(6-7)`,
      `Take heat entering the substance as positive.
Heat released during crystallization at unchanged temperature is negative in the following equation.
The magnitude of released heat remains positive.
This equation represents signed heat under that convention and excludes cooling before or after crystallization.`,
      String.raw`$Q_{\text{cryst}}=-\lambda m$.
(6-8)`,
      `The textbook compares heat of vaporization and heat of fusion far below the liquid-gas critical temperature.
For many substances under corresponding conditions, vaporization requires more heat per unit mass than melting.
This does not establish a universal ratio for all substances and conditions.
At standard atmospheric pressure, the textbook gives these approximate water values:
Heat of vaporization at $100^\\circ\\text{C}$ is $L=2.26\\times10^6$ J/kg, while heat of fusion at $0^\\circ\\text{C}$ is $\\lambda=3.4\\times10^5$ J/kg.

These compare two phase changes at different temperatures, not measurements at the same temperature.
The textbook's description of liquid as "closer to the crystalline state" illustrates that liquid particles remain close together and interact substantially.
It does not assign a crystal's long-range order to a liquid or use these two values as a quantitative measure of structural similarity.
Here critical temperature refers to the liquid-gas phase change, not a universal melting limit.

Near the liquid-gas critical point, the distinction between the phases and the latent heat of vaporization tend to disappear.
The comparison far from the critical point cannot be extrapolated directly to that limit.`,
      `For the solid and liquid phases usually considered, over a limited pressure range, many substances expand on melting.
Increasing pressure usually raises their equilibrium melting point.
Qualitatively, higher pressure favors the phase with smaller volume.
The pressure response of melting depends on the phases' volume difference and phase-change heat.

It cannot be attributed solely to compression preventing particle separation and therefore always increasing potential energy.
The same trend cannot be extended to every high-pressure phase.
Pressure effects on boiling concern liquid-gas equilibrium.
In the corresponding coexistence range, increasing pressure usually raises the boiling point, but this is a different phase-equilibrium problem.`,
      `The textbook gives ordinary ice and bismuth as examples whose volume decreases on melting in the solid-liquid phases being discussed.
The liquid therefore has a higher density for the same mass.
Ordinary ice floats in liquid water because its density is lower under the relevant conditions.
This is not a guarantee about every high-pressure phase of ice.

Within those phases' coexistence range, increasing pressure usually lowers the equilibrium melting point.
This trend need not hold at every pressure.
Ordinary ice has a relatively open crystal structure, and structural change on melting can reduce volume.
Order or disorder alone does not universally determine which phase is denser.

Melting these substances still requires heat under the corresponding conditions.
Volume contraction does not make latent heat negative.
It does not by itself determine whether microscopic potential energy rises or falls.`,
      `Under ordinary conditions, water expands when it freezes.
If a container constrains that change without enough expansion space, a large load can develop and cause rupture.
The textbook illustrates this with a thick-walled iron sphere and a glass bottle.
Here the effect is analyzed conceptually, without providing or requesting an experiment that seals, freezes, and bursts a water-filled container.

Rupture can send fragments flying and cause injury.
Do not attempt it yourself.
Whether rupture occurs also depends on the container's structure, remaining space, freezing process, and pressure.
Not every container with freezing water must rupture.`,
      `Under suitable conditions, water freezing in rock cracks can exert forces on the crack walls and widen them.
Repeated freezing and thawing can contribute to frost weathering.
The effect depends on water content, crack structure, and temperature changes.
Severe cold therefore does not make every rock fracture in this way.`,
      `**Worked examples**`,
      String.raw`**1.** A brass wire of diameter $D=0.8$ mm has an unloaded length $L=3.6$ m.
An axial tensile force $F=25$ N extends it by $\Delta l=2$ mm.
Treat it as a uniform specimen with constant cross section in the small-strain linear-elastic range.
Neglect extra deformation from clamping and similar effects.
Find the specimen's Young's modulus.`,
      String.raw`**Solution:** In this example's axial linear-elastic model, Hooke's law $\sigma=E\cdot|\varepsilon|$ gives $E=\frac{\sigma}{|\varepsilon|}$.
The textbook's formula notation is retained below.
The length symbol in the problem and the initial-length symbol in the following formulas denote the same unloaded length.`,
      String.raw`For uniform axial stress and the initial gauge length, take $\sigma=\frac{F}{S}$ and $|\varepsilon|=\frac{|\Delta l|}{l_0}$.
Use the unloaded cross-sectional area, neglecting its change at small strain.`,
      String.raw`$E=\frac{Fl_0}{S\cdot|\Delta l|}$.`,
      String.raw`The circular cross-sectional area is $S=\frac{\pi D^2}{4}$, so $E=\frac{4Fl_0}{\pi D^2\cdot|\Delta l|}$.
Use consistent length units when substituting.`,
      String.raw`Using the textbook's approximations gives $E=9\times10^{10}$ N/m $^2$.
This is an approximate result from the specimen data in this linear-elastic model.
It is not one universal constant for all brass under every condition and temperature.`,
      String.raw`**2.** In an ideal heat-balance model, ice of mass $m_2=0.4$ kg at $t_2=0^\circ\text{C}$ is placed in a large aluminum container at $t_1=75^\circ\text{C}$.
Thermal equilibrium is reached at $t_3=50^\circ\text{C}$.
What is the container's mass $m_1$?
Take aluminum's specific heat as $c_1=880$ J/(kg degree), as specified in the problem.

**Neglect water evaporation.**
Also neglect heat exchange with the surroundings and any heat capacity from water or other objects initially in the container.
Consider the ice-water phase change at ordinary pressure and use constant specific heats over the relevant temperature ranges.

This is a calculation within the stated model, not a request to handle a hot container.`,
      `**Solution:** Take heat entering each part as positive.
As the container cools, it releases heat, represented by the signed amount:`,
      String.raw`$Q_1=c_1m_1(t_3-t_1)$,`,
      `Since $t_3<t_1$, the heat above is negative.
This means the container releases heat to the ice and water, not that the magnitude of released heat is negative.`,
      `The specified final temperature exceeds the ordinary ice-water equilibrium temperature, so all the ice has melted in this model.
The heat needed for melting at unchanged temperature is:`,
      String.raw`$Q_2=\lambda m_2$,`,
      `The heat needed to warm the melted water from $0^\\circ\\text{C}$ to $t_3$ is given below.
Use an approximately constant water specific heat over the relevant range.`,
      String.raw`$Q_3=c_2m_2(t_3-t_2)$.`,
      `In the problem's model, neglecting external energy exchange and other energy changes, heat released by the container equals heat absorbed in melting the ice and warming the water.
Adding the signed heat amounts gives the heat-balance equation:`,
      String.raw`$Q_1+Q_2+Q_3=0$,`,
      `Expanding the heat terms gives:`,
      String.raw`$c_1m_1(t_3-t_1)+\lambda m_2+c_2m_2(t_3-t_2)=0$.`,
      `Using the specified temperature relationships, solve for the container's mass:`,
      String.raw`$m_1=m_2\frac{\lambda+c_2(t_3-t_2)}{c_1(t_1-t_3)}$;`,
      `Using its approximate material-property values, the textbook gives $m_1=10$ kg.
Water's specific heat in the formula must match the problem's conditions.
If the material-property data are not supplied, identify the missing data rather than determining numerical mass from temperatures alone.

This retains the textbook's approximate result, not a conclusion for every container or real heat-transfer process.`,
      `**3.** A calorimeter contains 0.4 kg of water at $10^\\circ\\text{C}$.
Add 0.6 kg of ice at $-40^\\circ\\text{C}$.
The calorimeter's heat capacity is very small and is approximately neglected.
Also neglect external heat exchange.
Analyze thermal equilibrium of pure water and ordinary ice at ordinary pressure, using the textbook's approximate specific heats and other material-property values.

Find the final equilibrium temperature.`,
      `**Solution:** With the textbook's approximate specific heats, water cooling to $0^\\circ\\text{C}$ releases $16.8\\times10^3$ joules.
Warming the original ice to $0^\\circ\\text{C}$ needs $50.4\\times10^3$ joules.
Without external heating, water cooling alone cannot supply enough heat.
Some water must freeze and release latent heat.

The heat deficit is $33.6\\times10^3$ joules.
The textbook therefore approximates the mass that freezes from the original 0.4 kg of water as 0.1 kg.
With these rounded values, the final mixture contains 0.3 kg of water and 0.7 kg of ice.
The two phases reach equilibrium at ordinary pressure at $0^\\circ\\text{C}$.

The frozen mass and final phase masses are the textbook's rounded approximations, not exact results from the rounded heat of fusion.
The heat balance compares initial and final states.
The actual parts need not complete the imagined steps in that sequence.`,
    ],
  },
};
Object.assign(configs, expansionConfigs);
Object.assign(configs, oscillatorConfigs);
const card = process.argv[2], config = configs[card];
assert(config);
const preparedPath = `${ticket}/tmp/${config.prepare}/prepared.json`;
const prepared = read(preparedPath);
assert.equal(bind(prepared.approvedZh.path).sha256, prepared.approvedZh.sha256);
const lesson = read(prepared.approvedZh.path);
const tocPath = `${repo}/ssot-resources/soviet10year-textbooks/toc/${prepared.book || '9p'}/en.json`;
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
  '\u963f\u4f0f\u52a0\u5fb7\u7f57': 'Avogadro', '\u963f\u4f0f\u4f3d\u5fb7\u7f57': 'Avogadro',
  '\u725b\u987f': 'Newton', '\u8377\u5170': 'Dutch', '\u60e0\u66f4\u65af': 'Huygens',
  '\u83ab\u65af\u79d1': 'Moscow', '\u83ab\u65af\u79d1\u5927\u5b66': 'Moscow University',
  '\u82cf\u8054': 'Soviet', '\u82cf\u8054\u79d1\u5b66\u9662': 'Soviet Academy of Sciences',
  'A. A. \u7c73\u54c8\u4f9d\u6d1b\u592b': 'A. A. Mikhailov', '\u5e93\u5c14\u65af\u514b': 'Kursk',
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
  ...(config.firstNativeFailure ? {
    firstNativeReceipt: bind(`${ticket}/tmp/d1816-recovery/native/${config.firstNativeFailure}/receipt.json`),
    originalFailedInput: bind(`${ticket}/tmp/${config.firstInput}`),
    firstFailureAffectedProseIndex: config.failureIndex ?? 23,
    firstFailureCause: config.firstFailureCause ||
      'Existing force and elastic-extension math tokens were translated in reversed order.',
    repairScope: config.repairScope ||
      'Only the force/elastic-extension sentence order changed before retrying the failed author-native stage.',
    passedAuthorStageReplayed: false,
  } : {}),
  originalTasks: 0, originalFigures: prepared.originalFigures, flowParagraphs: output.flow.paragraphs.length,
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
