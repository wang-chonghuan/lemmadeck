export const nextThermalConfigs = {
  'phy9-c1-s2-n10': {
    task: 'D1309', prepare: 'd1816-d1308-n10-first-missing-en', chapterFromSection: true,
    boundaries: [], numberedFigureLabels: true,
    texts: [
      `The same gas can be in different states.
Even when its mass stays unchanged, its volume and pressure can differ between thermal-equilibrium states.
For example, changing the space available to the gas, or changing how it exchanges energy with its surroundings, can change its state.

When comparing states, say which conditions stay unchanged.`,
      `Volume and pressure describe a gas on a macroscopic scale: the scale of the whole sample.
Temperature $t$ also describes its state.
Knowing only a body's overall position, velocity, and forces does not tell us its internal thermal state; studying thermal phenomena also requires quantities such as temperature.`,
      `We can study matter as a macroscopic system without following each molecule's motion.
Quantities such as $V$, $p$, and $t$ describe its state.
They are called thermodynamic parameters.
This lesson considers a simple gas system of fixed composition and amount, in thermal equilibrium.

The parameters may be related; they cannot all be changed independently in arbitrary ways.`,
      `For the uniform, macroscopic gas considered here, changing only the shape of a sealed container does not produce a different thermodynamic state if the gas species, amount, and state parameters remain the same.
We neglect small effects such as interactions between the gas and the container surface.
Figures $15$ and $16$ show differently shaped containers.
The original textbook uses the oxygen inside them to make this comparison: equal gas amounts, volumes, pressures, and temperatures are the conditions for the same state, not merely similar container outlines.

The figures are schematic, with thermometers and pressure-measuring apparatus.
They provide no precise readings or container dimensions, so drawn sizes or liquid-column lengths cannot determine measured values.
To compare the gas's heat capacity, we must also specify the same process conditions.
Under these matching conditions, container shape itself is not a parameter that determines the gas's heat capacity.

The heat capacity of the gas is different from the total heat capacity measured for the gas together with its container.`,
      '', '', 'Figure 15', 'Figure 16',
      `Thermodynamic parameters are not limited to $p$, $V$, and $t$.
For example, describing a solid may also require its deformation: its change of shape.
The choice of parameters depends on the system and question.

A simple-gas description is not a complete description of every state of matter.`,
    ],
  },
  'phy9-c1-s2-n15': {
    task: 'D1316', prepare: 'd1816-d1315-n15-first-missing-en', chapterFromSection: true,
    boundaries: [], numberedFigureLabels: true,
    texts: [
      `Bodies can reach very high temperatures` + '\u2460' + `.
For a fixed amount of ideal gas at constant pressure, raising the temperature increases the volume; lowering the temperature decreases it.

The straight-line relation in Gay-Lussac's law (2-5) cannot be extended arbitrarily to negative volumes.
Extending this relation toward lower temperatures identifies a temperature zero point.
This uses the ideal-gas model; it does not mean a real gas always stays gaseous while cooling to that point.`,
      '\u2460 ' + `The original textbook uses temperatures of billions of degrees as examples of very high temperatures and mentions that some stars may be hotter inside.
These examples do not establish that a particular process has reached the highest temperature in nature.`,
      `At constant pressure, extending the ideal gas's volume-temperature relation to zero volume gives the zero point called absolute zero.
A real gas may first become a liquid or solid as it cools; matter does not become volumeless at absolute zero.
Zero volume on this extrapolated graph is a result of the model, not a real-gas cooling experiment that can be carried out directly.`,
      `In suitable temperature and pressure ranges, a dilute gas can behave approximately like an ideal gas.
Measurements on increasingly dilute gases, compared through their volume-temperature relations, can identify the limiting zero point of the ideal-gas temperature scale.
Being dilute and approaching low temperature are not the same condition.

If the same real gas keeps cooling, it can depart from ideal-gas behavior; it need not remain gaseous and actually shrink to zero volume.`,
      String.raw`Using the textbook's integer approximation, set the ideal-gas volume $V$ in equation (2-5) equal to zero and use the approximate expansion coefficient $\alpha=\frac{1}{273}$ degree$^{-1}$:
$0=V_0\left(1+\frac{1}{273}t\right)$.
This finds a zero point from a linear relation; it does not measure a real gas's volume as zero.`,
      String.raw`This gives the approximate Celsius temperature of absolute zero, $t=-273^\circ\mathrm{C}$` + '\u2460' + `.
Absolute zero is the lower limit of the ordinary thermal-equilibrium temperature scale.
The textbook quotes Lomonosov's phrase "the final degree of cold" to describe this limit.

The integer value here is approximate.`,
      '\u2460 ' + String.raw`The Celsius temperature of absolute zero is $-273.15^\circ\mathrm{C}$.`,
      `The British scholar Kelvin established an absolute temperature scale.
Its zero point is absolute zero, and the size of a temperature interval is the same as on the Celsius scale.
The kelvin's unit symbol is K, with no degree sign.

Below, $T$ is the numerical value of temperature in K, and $t$ is its numerical value in degrees Celsius.
With this lesson's integer approximation:
$T=t+273$.
(2-6)

This equation converts numerical values between scales; a Celsius temperature value cannot simply be used as a kelvin value.
Use the zero-point value in the footnote for the exact conversion.`,
      `Figure $22$ compares the zero points and corresponding marks on the two scales.
It uses the same integer approximation as the text.
Marks at the same height represent the same temperature, not equal numerical values on the two scales.`,
      '',
      `In classical kinetic theory, absolute temperature is related to the average kinetic energy of the gas particles' irregular motion.
As $T=0$ is approached as a limit, the average thermal kinetic energy in this classical model approaches zero.
This does not justify saying, without qualification, that all microscopic motion in every material stops completely.

The third chapter discusses temperature and microscopic motion further.`,
      String.raw`With the kelvin scale, the constant-pressure relation for a fixed amount of ideal gas has a simpler form.
In the following numerical equations, the expansion-coefficient symbol represents the coefficient's numerical value in per kelvin, or per degree of Celsius temperature difference.
Its inverse-temperature unit is not inserted into these numerical equations.
Using the same integer approximation:
$1+\alpha t=1+\frac{1}{273}(T-273)=\alpha T$.

Therefore:
$V=V_0\alpha T$.
(2-7)

These equations use the temperature and coefficient values just specified.
For a fixed amount of gas at fixed pressure, volume is proportional to absolute temperature.`,
      'Figure 22',
      String.raw`Thus, for a fixed amount of ideal gas in two states at the same pressure, the volume ratio equals the absolute-temperature ratio:
$\frac{V_1}{V_2}=\frac{T_1}{T_2}$.
(2-8)

Both temperatures must use the same kelvin scale, and the denominator temperature must be positive.
Do not substitute Celsius numerical values directly into this ratio.`,
    ],
  },
  'phy9-c1-s2-n18': {
    task: 'D1323', prepare: 'd1816-d1322-n18-first-missing-en', chapterFromSection: true,
    boundaries: ['A process in which', 'With gas mass'], numberedFigureLabels: true,
    texts: [
      `For a fixed amount of ideal gas of unchanged composition, keeping its volume fixed lets the equation of state relate pressure to absolute temperature.
The French physicist Charles experimentally studied gas-temperature relations in $1787$` + '\u2460' + `.
Below we derive the constant-volume relation from the equation of state.

A theoretical derivation does not replace experiments on real gases and measuring apparatus.`,
      '\u2460 ' + `In $1787$, before Gay-Lussac's work, Charles established the relation between volume and temperature at constant pressure, but did not publish it then.
This historical account concerns the constant-pressure volume relation; distinguish it from the constant-volume pressure relation discussed in this lesson.`,
      String.raw`Solving the ideal-gas equation of state (2-19) for pressure gives (2-20):
$p=\frac{mR}{\mu V}T$.
When gas mass, composition, and volume are fixed, the coefficient multiplying temperature stays constant.`,
      `For an ideal gas of fixed mass and unchanged composition at fixed volume, absolute pressure is proportional to absolute temperature.
This lesson follows the original textbook in calling this relation Charles's law.
Temperature must be on the kelvin scale; Celsius numerical values cannot be used directly in this proportionality.`,
      String.raw`By Charles's law as used here, the same ideal-gas sample in two equilibrium states of equal volume has an absolute-pressure ratio equal to its absolute-temperature ratio, equation (2-21):
$\frac{p_1}{p_2}=\frac{T_1}{T_2}$.
These pressures are absolute pressures, not gauge pressures measured relative to the surrounding atmosphere.`,
      '',
      `A process in which volume stays constant while temperature and pressure change is called an isochoric process.
For an ideal gas, a graph with absolute temperature on the horizontal axis and absolute pressure on the vertical axis shows the fixed-volume states as a straight line: an isochore (Figure $25$).
The same gas sample has different isochores for different fixed volumes.

At the same absolute temperature, a larger volume gives a lower pressure for this same sample.
Thus, the isochore for volume $V_2$ lies below that for volume $V_1<V_2$.
The gas mass and composition must be the same when making this comparison.`,
      'Figure 25',
      `Extrapolating these straight isochores takes them through the origin $O$.
This is an ideal-gas model extrapolation: at fixed volume, pressure approaches zero as absolute temperature approaches absolute zero, while that fixed volume does not also become zero.
Holding a nonzero pressure fixed would be a different, constant-pressure extrapolation, in which volume approaches zero with absolute temperature.

A real gas can liquefy at low temperature; the extrapolated origin is not a state that a real gas necessarily approaches continuously.`,
      `With gas mass, composition, and volume unchanged, prove that Charles's law as used here can also be written as (2-22):
$p=p_0\\gamma T$.`,
      String.raw`Here $p_0$ is the reference pressure of the same gas sample at the same volume at $T=273\mathrm{K}$, and $\gamma$ is called the gas pressure-temperature coefficient.
With this integer approximation for the reference temperature, it equals the corresponding volume-expansion coefficient:`,
      String.raw`$\gamma\approx\frac{1}{273}$ kelvin$^{-1}=\alpha$.
The unit means the reciprocal of a temperature interval, not the reciprocal of a Celsius numerical temperature.`,
      `The coefficient $\\gamma$ is the pressure increase for a $1$-degree rise at fixed volume, divided by the reference pressure specified above.
Here a degree means a temperature interval: kelvin and Celsius intervals have the same size.
Do not replace the denominator with the pressure at an arbitrary starting temperature.`,
      `Starting from the Mendeleev-Clapeyron equation (2-19), keep gas amount and composition unchanged.
Hold temperature fixed to derive the Boyle-Mariotte law (2-2), and separately hold pressure fixed to derive Gay-Lussac's law (2-7).`,
    ],
  },
  'phy9-c1-s2-n20': {
    task: 'D1339', prepare: 'd1816-d1329-n20-first-missing-en', chapterFromSection: true,
    firstAuthorFailure: {
      stage: 'd1330', directory: 'd1816-d1330-n20-first-missing-en',
      receipt: 'd1330-n20-first-missing-en-author-native', changedPointer: '/prose/25/text',
    },
    boundaries: ['**Gases as a working substance**', '**Rarefied gases and vacuum**', '**Worked examples**',
      '2. A fixed amount', '3. At the textbook'],
    numberedFigureLabels: true,
    texts: [
      `Gases have many engineering uses.
This lesson examines tire cushioning, work done by gases, and vacuum technology to show how gas properties are used in equipment.`,
      `**Gases for cushioning**
Gases are compressible, have relatively little mass, and have adjustable pressure, so they are often used as elastic media in cushioning devices.
The effect still depends on the tire or device, its load, and operating conditions.
Gas is not a perfect cushion for every situation.`,
      '',
      `Inflated car and bicycle tires use this elastic behavior.
When a wheel passes over a bump, the tire deforms locally and compresses the air inside, helping reduce the impact and vibration passed to the axle (Figure $27$).
In a comparison that ignores other cushioning structures, a rigid wheel cannot compress locally in this way, so the bump more directly raises its axle.`,
      'Figure 27',
      `**Gases as a working substance**
Gas volume changes readily, and pressure and volume respond to temperature changes.
These properties make gases useful for transferring energy and moving parts in many engines and heat machines.`,
      `Compressed air can push a pneumatic device's piston.
When a large air reservoir, supply system, or pressure regulator keeps operating-pressure changes small, part of the process can be approximated as expansion at constant pressure.
Compressibility alone does not guarantee constant pressure.

Compressed air can operate bus, subway, and electric-train doors, and push pistons in train and truck air brakes.
Pneumatic hammers and other air-powered tools also use compressed air to move working parts.`,
      `Some spacecraft use small jets of compressed nitrogen to help change their orientation.
As gas is expelled, a reaction force acts on the spacecraft.
This does not rely on surrounding air pushing it, so the device can work in vacuum.`,
      `Many internal-combustion or jet engines in cars, tractors, and aircraft use hot gas to do work.
Depending on the engine, the gas can drive a piston or turbine, or produce thrust by flowing outward.`,
      '',
      `In the piston device shown in Figure $28$, a mixture of fuel and air, such as gasoline vapor and air, burns in the cylinder.
This raises the gas temperature and pressure.
During the power stroke, expanding gas pushes the piston and transfers some energy to mechanical parts; pressure need not stay constant throughout the stroke.`,
      `Gas is a convenient working substance for the device just described, where expansion on heating pushes a piston.
Liquids and solids that stay in the same phase usually change volume less on heating, making a long piston stroke difficult by this same method.
This compares that particular method; it does not mean every engine must use gas.`,
      `The original textbook also uses firearms and artillery to illustrate work done by expanding hot gas.
Gas produced by burning propellant exerts a force on the projectile and does work as it moves along the barrel, transferring some energy to the projectile's kinetic energy.
The textbook mentions bullet and shell speeds of hundreds of meters per second.

This is only an explanation of energy transfer, not operating instructions.`,
      'Figure 28',
      `**Rarefied gases and vacuum**
Some equipment needs fewer gas collisions or less gas-mediated heat transfer, so most of the gas is removed from its container.
An engineering vacuum usually means a gas pressure below atmospheric pressure, not the complete absence of molecules.

Collisions between molecules become much less frequent than collisions with walls only when the gas is sufficiently rarefied and the mean free path is long compared with the container size.
This is not a definition that applies to every vacuum state.`,
      `Vacuum tubes and some other electronic instruments need high vacuum to reduce interference from residual gas.
Particle accelerators also need large evacuated regions to reduce collisions between the particle beam and residual gas.`,
      `Vacuum can also be used in some metal-refining processes and thermal-insulation devices.
Removing gas reduces heat transfer by gas conduction and convection, but does not by itself eliminate radiation or conduction through solid connections.
It therefore does not provide perfect thermal insulation.`,
      `The textbook describes limits on ordinary piston vacuum pumps, including leakage between the piston and cylinder wall.
It uses one tenth of a millimeter of mercury as the pressure limit for the equipment then discussed, not a universal limit for every vacuum pump.
Lower pressures require equipment suited to the target vacuum range and control of leaks and sources of residual gas.`,
      String.raw`The textbook gives a low-pressure order of magnitude of $10^{-10}$ N/m$^2$ ($10^{-12}$ millimeters of mercury).
These original values and units are retained as a source account, not an exact unit conversion or a claim about the limit of present-day vacuum technology.`,
      '**Worked examples**',
      String.raw`1. One vessel contains $V_1=0.02$ m$^3$ of air at $p_1=4\times10^5$ N/m$^2$.
It is connected to an evacuated second vessel of volume $V_2=0.06$ m$^3$.
Treat both as rigid, sealed vessels, neglect connecting-tube volume and residual gas in the second vessel, and use the ideal-gas approximation.
At constant temperature, find the pressure after equilibrium is reached.`,
      `Solution: After connection, the air originally in the first vessel occupies the total volume $V_1+V_2$.
Gas amount is unchanged, and final temperature equals initial temperature.
By the Boyle-Mariotte law,`,
      String.raw`$\frac{p}{p_1}=\frac{V_1}{V_1+V_2}$.`,
      'Therefore, the equilibrium pressure is',
      String.raw`$p=\frac{p_1V_1}{V_1+V_2}$;
$p=10^5$ N/m$^2$.`,
      String.raw`2. A fixed amount of gas at constant pressure starts at $t=27^\circ\mathrm{C}$ and warms by $1^\circ\mathrm{C}$.
Using the ideal-gas approximation, find the increase in volume as a fraction of the original volume.`,
      String.raw`Solution: In the sum below, the Celsius-temperature term represents the temperature interval above Celsius zero, expressed in kelvin.
Represent the initial state by $V_1$ and $T_1=273\mathrm{K}+t=300\mathrm{K}$, and the final state by $V_2$ and $T_2=T_1+1\mathrm{K}$.
This uses the textbook's approximate Celsius-to-thermodynamic temperature conversion.
Temperature differences have the same numerical size on both scales.`,
      String.raw`With gas amount and pressure fixed, Gay-Lussac's law gives $\frac{V_2}{V_1}=\frac{T_2}{T_1}$.`,
      String.raw`Thus $\frac{V_2-V_1}{V_1}=\frac{T_2-T_1}{T_1}$;
substitution gives $\frac{V_2-V_1}{V_1}=\frac{1}{300}$.`,
      String.raw`The increase in volume is $\frac{1}{300}$ of the original volume.`,
      String.raw`3. At the textbook's standard state, air density is $\rho=1.29$ kg/m$^3$.
Using the ideal-gas approximation, find air's average molar mass $\mu$.`,
      String.raw`Solution: Density is $\rho=\frac{m}{V}$.
Substituting this into the Mendeleev-Clapeyron equation expresses the average molar mass as`,
      String.raw`$\mu=\frac{mRT_0}{Vp_0}=\frac{\rho T_0}{p_0}R=\frac{\rho T_0}{p_0}\cdot\frac{p_0V_{0\mu}}{T_0}$`,
      'Use the molar volume at the textbook\'s standard state, as defined in \u00a7 $17$.\nTherefore,',
      String.raw`$\mu=\rho V_{0\mu}$;
$\mu\approx0.029$ kg/mol.`,
    ],
  },
};
