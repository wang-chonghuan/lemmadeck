export const kineticPhaseConfigs = {
  'phy9-c1-s4-n38': {
    task: 'D1423', prepare: 'd1816-d1407-n38-first-missing-en', chapterFromSection: true,
    firstNativeFailure: 'd1408-n38-first-missing-en-author-native',
    firstInput: 'd1816-d1408-n38-first-missing-en/en.before-native.json', failureIndex: 7,
    firstFailureCause: 'The first English candidate put T after P and V instead of retaining the source formula-token order.',
    repairScope: 'Only the temperature/pressure/volume introduction was reordered; first failed input and native receipt are preserved.',
    boundaries: ['At constant temperature $T$', '**Vapor in equilibrium'],
    texts: [
      `Observing evaporation or boiling alone is not enough to understand how a gas becomes a liquid and how a liquid becomes a gas again.
We also need to study how a real gas's pressure and volume change at different temperatures.`,
      String.raw`The textbook illustrates this process by slowly compressing carbon dioxide under a piston in a cylinder (Figure $54$).
The closed cylinder contains a fixed total mass of a pure substance.
Choose a temperature below its critical temperature, at which liquid and vapor can exist together in equilibrium.

During compression, the surroundings transfer energy to the substance by doing work on it.
Its actual change in internal energy also depends on heat exchanged at the same time.
We cannot say that compression at constant temperature always increases internal energy.

To keep temperature $T$ constant, the cylinder must exchange enough heat with its surroundings.
In the textbook's apparatus, the cylinder is placed in a large container of liquid maintained at a constant temperature.
Compression is slow enough for heat released during compression and condensation to pass to the surroundings.`,
      `At a constant temperature, when the gas occupies a large volume and is relatively dilute, reducing its volume raises its pressure approximately according to the Boyle-Mariotte law.
Further compression makes the real gas depart from this approximation.
Once condensation starts, further reduction in volume leaves the pressure constant if temperature and liquid-vapor equilibrium are maintained.

The textbook describes seeing transparent liquid appear through an observation window in the cylinder.
Some of the gaseous substance has condensed into liquid.`,
      '',
      'Figure 54',
      `Continue slowly compressing the substance at constant temperature while liquid and vapor coexist.
The liquid's mass increases, and the vapor's mass decreases by the same amount.
The closed system's total mass does not change.

The pressure gauge's reading stays constant until all the vapor has condensed and the substance beneath the piston is entirely liquid.
The masses and volumes of the two phases change.
Matter does not appear from nowhere or disappear.`,
      `After condensation is complete, even a small further decrease in the liquid's volume causes a large increase in pressure.
A liquid is difficult to compress, but it is not absolutely incompressible.`,
      String.raw`At constant temperature $T$, a curve showing the relation between pressure $P$ and volume $V$ is called an **isotherm** (Figure 54).
Here, volume means the total volume of the fixed mass of substance in the cylinder.
When liquid and vapor coexist, it includes the volumes occupied by both phases.

Condensation begins at volume $V_2$ and ends at volume $V_1$.
In the illustrated compression at constant temperature, $V\geq V_2$ corresponds to the vapor state.
At equality, the substance is at the saturated-vapor boundary where condensation is just beginning.
For $V<V_1$, it is liquid.

Between the two endpoints, liquid and vapor coexist.
Do not mistake the total volume in this interval for the volume of a fixed mass of vapor alone.`,
      `The textbook explains that other substances can have similar isotherms when the temperature is not too high.
This means temperatures below each substance's critical temperature, with states that allow liquid and vapor to coexist in equilibrium.
It does not include every temperature or every state of matter.`,
      String.raw`On the coexistence part of compression at constant temperature, total volume decreases from $V_2$ to $V_1$.
Pressure stays constant as vapor gradually becomes liquid.
Points on the straight segment $B-A$ of the isotherm correspond to liquid-vapor equilibrium.
The endpoints mark where one phase first appears or finally disappears.

At one equilibrium state with fixed temperature and total volume, the masses of the two phases do not change with time.
At a different equilibrium point, their mass proportions can be different.
Microscopically, molecules keep leaving the liquid surface and returning to the liquid.

At equilibrium, the average numbers leaving and returning in the same time are equal.
The net effects of evaporation and condensation balance.
Equilibrium does not mean that molecules stop moving.`,
      `**Vapor in equilibrium with its liquid is called saturated vapor.**
At a given temperature and vapor-phase volume, the equilibrium vapor has the corresponding saturation mass.
Adding vapor leads to net condensation as the substance approaches a new equilibrium.

The textbook's statement that there cannot be more vapor describes liquid-vapor equilibrium.
It is not an absolute restriction on a short-lived state that is not in equilibrium.`,
      String.raw`The vapor pressure $p_0$ when a liquid and its vapor are in equilibrium is called the **saturated vapor pressure**.
For this lesson's pure substance, at fixed temperature and while both phases still coexist, it does not change when the total volume changes.
This conclusion cannot be used without those conditions once coexistence ends or the temperature changes.`,
      `Saturated vapor pressure can stay constant because compression causes some vapor to condense.
The same mass occupies much less volume as liquid than as vapor.
Compressing the vapor above the liquid temporarily disturbs equilibrium, slightly increasing vapor density and pressure.
More molecules then return to the liquid than escape from it.

Net condensation follows until equilibrium is restored.
As long as temperature is unchanged and both liquid and vapor remain, the equilibrium vapor density and pressure return to their previous values.
This requires the vapor's mass to decrease through condensation.
It does not mean that compressing a fixed mass of vapor also leaves its pressure unchanged.`,
      String.raw`Now consider an isotherm for the same mass of carbon dioxide at a higher constant temperature that is still below the critical temperature (Figure 55).
At large volume, where the gas is dilute, it still approximately follows an ideal-gas isotherm.
The horizontal liquid-vapor coexistence segment begins at volume $V_2'<V_2$.

Further compression to $V_1'>V_1$ completes condensation.
The isotherm then becomes steep.
At volume $V_1'$, all the substance in the cylinder is liquid.
The endpoint subscripts follow the definitions used earlier.`,
      '',
      'Figure 55',
    ],
  },
  'phy9-c1-s4-n39': {
    task: 'D1424', prepare: 'd1816-d1414-n39-first-missing-en', chapterFromSection: true,
    firstNativeFailure: 'd1415-n39-first-missing-en-author-native',
    firstInput: 'd1816-d1415-n39-first-missing-en/en.before-native.json', failureIndex: 9,
    firstFailureCause: 'The first English candidate omitted the original cover-location digit 2.',
    repairScope: 'Only the original inside-front-cover location reference is restored; no data or physics changed.',
    boundaries: ['The textbook illustrates observations', 'At a constant temperature above'],
    texts: [
      `Compare experimentally obtained isotherms for a real gas (Figure 55) to see how the liquid-vapor coexistence segment changes near the critical point.
We compare the same pure substance and the same total mass at different constant temperatures.
We are not assuming that all substances at all temperatures follow one curve.

As temperature rises, the vapor volume at the start of condensation decreases, and the vapor density increases.
The liquid volume at the end of condensation increases, and the liquid density decreases.
The textbook gives a qualitative explanation: stronger molecular motion means that a higher vapor density is needed for liquid to form.

This does not mean that molecules line up one by one in a motionless queue.
That picture alone cannot calculate the conditions for the phase change.
Liquid expansion and the approaching densities of the two phases make the horizontal coexistence segment shorter.

At each temperature, the equilibrium liquid and vapor have the same pressure.
As temperature rises along the coexistence conditions, their densities approach one another.
The equilibrium pressure also changes between temperatures.
Do not interpret this comparison as a heating process at constant pressure.`,
      String.raw`As temperature approaches a particular value, the horizontal coexistence segment becomes shorter and finally shrinks to one point.
This temperature is called the **critical temperature**.
Each substance that has such a liquid-vapor critical point has its own critical temperature.

The textbook gives approximate values: for carbon dioxide ($\mathrm{CO}_2$), $t_{\text{临}}\sim31^\circ\mathrm{C}$; for water, $t_{\text{临}}\sim374^\circ\mathrm{C}$.
As the critical point is approached along liquid-vapor coexistence conditions, the difference between the phases disappears and the specific latent heat of vaporization tends to zero.
This latent heat is the energy per unit mass associated with the phase change.

When the textbook says that vaporization heat is zero at the critical temperature, it means this limiting value of phase-change latent heat.
It does not mean that heating matter near the critical point needs no energy.
Nor does it mean that vaporization heat is zero at every temperature.`,
      String.raw`On the isotherm $T=T_{\text{临}}$, the point to which the former horizontal coexistence segment shrinks is called the **critical state**, or **critical point**.
The pressure at that point is called the **critical pressure**.
Reaching the critical temperature alone does not establish that the substance is at its critical point.

The textbook gives carbon dioxide's critical pressure as approximately $7.4\times10^6$ N/m$^2$ (73 atmospheres).
For water, its approximate value is $p_{\text{临}}=22.0\times10^6$ N/m$^2$ (218 atmospheres).
A given mass of substance has a corresponding critical volume.
This total volume depends on the total mass.

The textbook's statements about a maximum liquid volume and maximum saturated vapor pressure refer to endpoints of the coexistence curves discussed here.
They mean the endpoint approached by a fixed mass of saturated liquid and the critical endpoint of the saturated vapor pressure curve.
They do not mean that every liquid has a condition-independent maximum volume, or that a substance's pressure cannot exceed its critical pressure.`,
      `Keep a fixed mass of substance at the critical temperature and compress it slowly.
Its density gradually increases, reaching the critical density at the critical point.
There, the density difference between the formerly coexisting liquid and vapor disappears.
They can no longer be distinguished as two separate phases.

Further compression produces a denser single-phase fluid with liquid-like properties.
We should not unconditionally call it a cylinder full of ordinary liquid.
This path has no finite interval of liquid-vapor coexistence like the one below the critical temperature.

There is no interface separating two phases.
The continuous transition here concerns phase state and density.
It does not mean that physical properties near the critical point show no marked changes.`,
      `The textbook illustrates observations near the critical point using a substance in a transparent sealed container (Figure 56a).
The total mass is fixed, and the container's volume is chosen to be the critical volume for that mass.
Initially, liquid and vapor coexist.

Under these specific conditions, slow heating makes the liquid-vapor interface unclear and unstable near the critical temperature (Figure 56b).
At the critical point, the interface disappears (Figure 56c).
These are schematic descriptions of the textbook's experiment.
Not every sealed container necessarily reaches the critical point merely by being heated to the critical temperature.`,
      `The textbook describes the reverse cooling process: thick mist appears in the container as many small liquid droplets form (Figure 56d).
As the substance returns to liquid-vapor coexistence, the droplets gradually join.
Under ordinary gravity, an interface reappears with liquid below and vapor above (Figure 56e).

The visible mist droplets are liquid.
They are not individual vapor molecules made visible.
This describes the textbook's particular experimental path.`,
      '',
      'Figure 56',
      String.raw`The textbook lists ether as a historical experimental material for observing these phenomena because its critical pressure is relatively low.
It gives approximate values of about 36 atmospheres and a critical temperature of $194^\circ\mathrm{C}$.
We retain these descriptions and data for reading.

The phrase recommending ether in the original is not advice for a child to conduct the experiment.
This lesson provides no instructions for heating or pressurizing a sealed container.`,
      `The table on the original textbook's cover 2, its inside front cover, lists experimentally measured critical temperatures for several substances.
This is a reference to that table's location.
It does not mean that this lesson has measured or independently calibrated those values again.`,
      `At a constant temperature above the critical temperature, compression starting from a large volume generally raises pressure.
The ideal-gas equation can be used approximately only when the gas is dilute enough and interactions have little effect.
A high temperature or supercritical state alone does not guarantee ideal-gas behavior.

Within the fluid states discussed here, such compression at constant temperature cannot produce condensation into separate liquid and vapor phases.
If pressure is held constant while temperature is lowered below the critical temperature, the result also depends on that pressure and the path through the states.
At a pressure below the critical pressure, a cooling path that crosses liquid-vapor coexistence can cause condensation and an interface to appear.

At a pressure above the critical pressure, cooling along a single-phase path can continuously make the fluid denser and more liquid-like.
No two-phase interface suddenly appears along that path.
The textbook's statement that liquid formation cannot be seen refers to this latter kind of continuous path.
It should not be generalized to all cooling at constant pressure.`,
      String.raw`The textbook compares chlorine and oxygen.
At room temperature, chlorine can be liquefied by suitable compression at constant temperature.
For compression to produce a liquid-vapor transition in oxygen, it must first be cooled below $-118^\circ\mathrm{C}$.

This retains the textbook's approximate temperature.
Being below the critical temperature is necessary for this kind of liquefaction, but suitable pressure is also required.
Cooling below that temperature does not automatically turn all the gas into liquid.
These examples illustrate differences between substances, not procedures for pressurizing or refrigerating gases.`,
    ],
  },
  'phy9-c1-s3-n35': {
    task: 'D1401', prepare: 'd1816-d1400-n35-first-missing-en', chapterFromSection: true,
    boundaries: ['Molecular-beam speed measurements', 'Equation $(3-18)$ also'],
    texts: [
      String.raw`Equation $(3-15)$ can be used to calculate a statistical measure of molecular speed for a classical ideal gas in thermal equilibrium.
Substituting $\overline E=\frac{m\overline{v^2}}{2}$ gives the average of the squared speeds, called the mean square speed.
Here, the mass is that of one molecule, speeds are measured in a frame where the gas as a whole is at rest, and temperature must be the absolute temperature in kelvins:`,
      String.raw`$\overline{v^2}=\frac{3kT}{m}.$
$(3-17)$`,
      String.raw`Since $k=\frac{R}{N_A}$ and $\mu=mN_A$, formula $(3-17)$ can be written as $\overline{v^2}=\frac{3RT}{\mu}$.
Taking the square root of the average squared speed gives the **root mean square speed**.
This means: square the speeds, take their average, then take its square root.

Below, the bar over the speed symbol follows the textbook's notation for this root mean square speed.
It does not mean adding the speeds and dividing by the number of molecules.
It is also not the average of velocity vectors, which include direction:`,
      String.raw`$\overline v=\sqrt{\frac{3RT}{\mu}}=\sqrt{\frac{3kT}{m}}.$
$(3-18)$`,
      String.raw`Formula $(3-18)$ gives the root mean square speed of nitrogen molecules at $t=0^\circ\mathrm{C}$.
Using the textbook's precision, this is $\overline v=500$ m/s, since $\mu=0.028$ kg/mol.
At the same temperature, hydrogen molecules have a root mean square speed of $\overline v=1800$ m/s.

The calculation must use the corresponding absolute temperature, not the Celsius number directly.
These values describe a group of molecules; not every nitrogen or hydrogen molecule moves at that speed.`,
      `The textbook describes how the calculated molecular speeds surprised some physicists in the second half of the nineteenth century.
It compares them with artillery-shell speeds, explaining why this led to questions about kinetic theory.
Its contrasting example is a smell taking roughly a few tens of seconds to travel from one corner of a room to another.

That time is the textbook's estimate for its example, not a fixed time for every room.
The speed of molecular thermal motion is not the speed at which a smell spreads across a room.
Air currents also affect the spreading.`,
      String.raw`In the collision model for a dilute gas, molecules repeatedly change direction, so a path can be drawn as a complicated zigzag (Figure $51$).
A molecule can travel quickly between collisions, but the different directions mean its total distance traveled is not its net displacement.
Even after a few minutes, its typical net displacement can be much smaller than its total path length.

This does not mean that each molecule moves slowly in one direction.
For a molecule traveling from point $A$ to point $B$, the zigzag path is usually much longer than the straight-line distance $AB$.`,
      '',
      'Figure 51',
      String.raw`Molecular-beam speed measurements provide an experimental test of the kinetic theory behind formula $(3-18)$.
The textbook describes an experiment performed by Stern in 1920.
The measured result must be interpreted using the distribution of speeds and how the instrument selects atoms.
Not every measured average is the root mean square speed.`,
      String.raw`The apparatus has two concentric cylinders, $A$ and $B$, rigidly connected so that they rotate together (Figure $52$).
A thin platinum wire $C$, coated with silver, lies along the inner cylinder's axis.
An electric current heats the wire, and a narrow slit $O$ is cut in the inner cylinder's wall.

Air is pumped out to reduce collisions between flying atoms and remaining gas.
The outer cylinder $B$ stays at room temperature so that silver atoms can deposit on its inner wall.`,
      '',
      'Figure 52',
      String.raw`First keep the apparatus stationary and heat the wire electrically to evaporate silver, producing silver atoms.
Some atoms pass through slit $O$ and deposit on cylinder $B$'s inner wall.
They form a narrow silver band $D$ opposite the slit (Figure $52$, b).
Next rotate the cylinders at angular speed $\omega$.

In the textbook's approximation, atoms fly radially in straight lines at constant speed.
The time to travel the difference in the cylinder radii, $R_B-R_A$, is $t$.
During this time, the cylinder turns through angle $\varphi$.
The atom is approximately collision-free while the outer cylinder keeps turning.

The deposit is therefore shifted from the endpoint of the radius corresponding to slit $O$.
The shift along the outer cylinder's inner wall is an arc length $s$ (Figure $53$).
Here, $s$ is a wall shift caused by rotation, not the atom's flight-path length.
Under the textbook's model:
$s=\omega R_Bt.$
$(3-19)$`,
      '',
      String.raw`Figure 53a: the cylinders' position when an atom passes through the slit.
b: their position after time $t$, when that atom reaches the outer cylinder.`,
      String.raw`In the radial-flight approximation above, the atom's speed from the inner slit to the outer cylinder is $v=\frac{R_B-R_A}{t}.$`,
      String.raw`Use equation $(3-19)$ to express $t$, then substitute it into the speed formula:
$v=\frac{\omega R_B(R_B-R_A)}{s}.$`,
      String.raw`If $\omega$, $R_A$, and $R_B$ are known, measuring the rotation-induced band shift $S$ lets us estimate the silver atoms' flight speed under this model.
The capital letter here follows the textbook and denotes the same wall shift as the lowercase letter in the preceding formula.

Atoms with different speeds have different flight times and shifts.
The silver band represents atoms selected by the instrument, so its position and width must be interpreted using the speed distribution.
The textbook describes agreement with theory as support for formulas $(3-18)$ and $(3-15)$.
This does not make one arbitrary band position, or an arithmetic average speed, equal to the root mean square speed.`,
      String.raw`Equation $(3-18)$ also expresses a temperature-and-mass relation useful for discussing the thermal kinetic energy of Brownian particles.
If a Brownian particle is in classical thermal equilibrium with the surrounding liquid, and energy is shared according to the equipartition model for motion through space, its average kinetic energy is described by formula $(3-15)$.
The corresponding estimate of root mean square speed is:
$\overline v=\sqrt{\frac{3kT}{M}}$.

Here, $M$ is the Brownian particle's mass` + '\u2460' + `.
The bar still means root mean square speed.
Keeping the other conditions fixed, this speed scale increases with temperature and decreases with mass.

The textbook uses this to explain why heavier particles' thermal motion can be hard to notice.
The estimate is not the speed obtained directly from a displacement seen over a finite time under a microscope.
Observed Brownian displacement also depends on liquid resistance, particle size, and observation time.
Mass alone does not determine whether motion exists or can be observed.`,
      '\u2460' + ` The textbook points out that Brownian motion is very irregular.
An observed zigzag path should not be treated as a directly measured instantaneous velocity.
Displacement over a finite time can give an average motion on that time scale, but not the thermal-equilibrium root mean square speed above.

In the ideal Brownian diffusion model that neglects inertia, a path has no ordinary instantaneous velocity.
Real particles have finite mass, and a more complete account of their dynamics is needed on sufficiently short time scales when inertia matters.
Thus, "cannot be measured" is not an absolute restriction on every experiment or every time scale.`,
    ],
  },
  'phy9-c1-s3-n34': {
    task: 'D1394', prepare: 'd1816-d1393-n34-first-missing-en', chapterFromSection: true,
    boundaries: ['Substituting', 'The textbook traces'],
    texts: [
      String.raw`In equation $(3-14)$, the ratio of the universal gas constant $R$ to Avogadro's constant $N_A$ does not depend on the substance.
This ratio is called **Boltzmann's constant**, named after the Austrian physicist Boltzmann, one of the founders of kinetic theory.
The constant is universal, but the earlier classical formula for average kinetic energy still has conditions: it cannot be applied without limits to every state of matter.`,
      `Using the rounded values given in the textbook, Boltzmann's constant is:`,
      String.raw`$k=\frac{R}{N_A}=\frac{8.31\frac{\text{J}}{\text{K}\cdot\text{mol}}}{6.02\times10^{23}\frac{1}{\text{mol}}}$ $=1.38\times10^{-23}$ J/K.`,
      String.raw`Using Boltzmann's constant, equation $(3-14)$ takes the following form.
We are considering a classical ideal gas in thermal equilibrium, with absolute temperature measured in kelvins.
Here, average kinetic energy means the molecules' irregular motion through space.
It does not include the energy of the gas flowing as a whole, or energy from molecular rotation or internal vibration.`,
      String.raw`$\overline E=\frac{3}{2}kT.$
$(3-15)$`,
      '',
      String.raw`$L.$ Boltzmann ($1844\sim1906$) was an Austrian physicist and one of the founders of kinetic theory.
The textbook emphasizes his papers' contribution to developing kinetic theory into a systematic account.`,
      `The textbook also describes Boltzmann's work in developing and spreading Maxwell's theory of the electromagnetic field.`,
      `According to the textbook, he argued that molecular motion and collisions explain thermal phenomena.
He took part in the scientific debate about whether molecules exist.`,
      String.raw`Substituting equation $(3.15)$ into formula $(3.11)$ gives a relation between gas pressure, molecular number density, and absolute temperature.
Molecular number density means the number of molecules in each unit of volume, not the total number in the whole sample.
This relation still uses the classical ideal-gas model in thermal equilibrium:`,
      String.raw`$p=nkT.$
$(3-16)$`,
      String.raw`This gives Avogadro's law for ideal gases: at the same pressure and absolute temperature, different gases have the same molecular number density.
Equal volumes therefore contain equal numbers of molecules (see section $16$).
Real gases obey this conclusion approximately only where the ideal-gas approximation applies.`,
      String.raw`At the textbook's standard state ($p=101325$ N/m$^2$ and $T=273K$), the ideal-gas model gives the number of molecules in $1$ cubic centimeter of gas from the number density below.
The temperature and constants use the textbook's stated precision:`,
      String.raw`$n=\frac{p}{kT}=\frac{101325\frac{\text{N}}{\text{m}^2}}{1.38\times10^{-23}\frac{\text{J}}{\text{K}}}\cdot\frac{1}{273\ \text{K}}$ $=2.69\times10^{19}$ cm$^{-3}$.`,
      `The textbook calls this number density at its standard state the **Loschmidt number**.
It is a number per unit volume, not the total number of molecules in any chosen sample.
To obtain the total number, multiply the number density by the sample's volume, using matching volume units.`,
      String.raw`The textbook traces the historical sequence: scientists first established a temperature scale, then explained temperature's microscopic meaning (see section $11$).
In the classical model of thermal equilibrium used here, average kinetic energy from motion through space can be measured in joules or ergs.
The quantity $T^*$ uses that energy to describe the same thermal state as the absolute temperature $T$ measured in kelvins.

This expresses temperature on an energy scale; it does not make the kelvin an energy unit.
In the next formula, the mass is the mass of one molecule, and speeds are measured in a reference frame where the gas as a whole is at rest:`,
      String.raw`$T^*=\frac{m\overline{v^2}}{2}.$`,
      `This energy quantity, defined as the average kinetic energy from molecular motion through space, is related to the absolute temperature measured in kelvins by:`,
      String.raw`$T^*=\frac{3}{2}kT.$`,
      `Boltzmann's constant connects absolute temperature with a microscopic energy scale.
Under the textbook's definition, the complete factor for this average kinetic energy also includes three halves.
It is not defined as only the constant multiplied by temperature.

Temperature is usually expressed in temperature units; this lesson's formulas use kelvins.
An energy-scale variable depends on the specified model and scaling, so its definition and conditions must be stated.`,
    ],
  },
};
