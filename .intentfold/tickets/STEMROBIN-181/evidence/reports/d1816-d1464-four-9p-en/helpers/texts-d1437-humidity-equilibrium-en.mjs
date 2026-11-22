export const humidityEquilibriumConfigs = {
  'phy9-c1-s4-n40': {
    task: 'D1437', prepare: 'd1816-d1436-n40-first-missing-en', chapterFromSection: true,
    boundaries: ['Connect the right endpoints', "Within this diagram's fluid-state"],
    texts: [
      String.raw`Return to the real-gas isotherms in Figure 55.
Compare equilibrium states of the same pure substance with a fixed total mass.
For temperatures below the critical temperature, connect the left endpoints of the horizontal coexistence segments.
These endpoints mark the completion of condensation and the beginning of liquid compression.

The resulting smooth curve ends at the critical point $K$.
It is drawn as a dashed boundary in Figure $57$.
The textbook identifies the region between this boundary and segment $CK$ of the critical isotherm as the liquid region.
Horizontal thin lines mark that region in Figure $57$.

The diagram concerns the fluid states involved in liquid-vapor transitions.
It is not a diagram of every state of matter, including solids.
An equilibrium state has corresponding pressure $P$, total volume $V$, and temperature $T$, with temperature identified by its isotherm.
These quantities are related; they cannot all be chosen independently.`,
      '',
      'Figure 57',
      String.raw`Connect the right endpoints of the horizontal coexistence segments.
These mark the beginning of vapor condensation.
The resulting smooth dashed curve also ends at $K$.
The two dashed curves $AK$ and $BK$ enclose the liquid-vapor coexistence region, shown with vertical thin lines in Figure $57$.

Inside this region, liquid and saturated vapor coexist in equilibrium.
At its boundaries, one phase is just appearing or disappearing.
At the critical endpoint, the distinction between the two phases vanishes.

The total mass is fixed, but the mass and volume of each phase can change from one equilibrium state to another.
The diagram's total volume includes both phases.
Do not treat the whole coexistence region as a single gas phase with a fixed vapor mass.`,
      String.raw`Within this diagram's fluid-state range, the textbook describes the regions outside the liquid and coexistence regions as gaseous states.
Below the critical isotherm and to the right of the coexistence region, unsaturated vapor can begin condensing when compressed at constant temperature to the corresponding coexistence conditions.
Further compression can complete condensation into liquid.
Oblique thin lines mark the unsaturated-vapor region in Figure $57$.

A single-phase fluid above the critical temperature is not this kind of unsaturated vapor that can undergo two-phase condensation by isothermal compression.
For $T>T_{\text{临}}$, the ideal-gas approximation additionally requires a sufficiently low density and sufficiently small effects from molecular interactions.
Being above the critical temperature does not by itself guarantee ideal-gas behavior.
The original subscript in the formula denotes the critical value.

In the fluid states considered here, isothermal compression above the critical temperature does not produce a transition with separate coexisting liquid and vapor phases.
Density and other properties can still change continuously.`,
    ],
  },
  'phy9-c1-s4-n42': {
    task: 'D1483', prepare: 'd1816-d1443-n42-first-missing-en', chapterFromSection: true,
    firstNativeFailure: 'd1444-n42-first-missing-en-author-native',
    firstInput: 'd1816-d1444-n42-first-missing-en/en.before-native.json',
    failureIndex: 14,
    firstFailureCause: 'Temporary author helper omitted the approved apparatus-label notation_changes argument.',
    repairScope: 'Validator argument passthrough only; complete English input remains unchanged.',
    boundaries: ['**Water vapor pressure**', 'Knowing water vapor pressure alone',
      'Along the path in Figure', '**Humidity-measuring instruments**',
      '**The wet- and dry-bulb instrument**', '**Why humidity matters**',
      '**Worked examples**', '2. In the textbook'],
    texts: [
      `**Water vapor in the atmosphere** Evaporation from bodies of water is one source of atmospheric water vapor.
Although oceans, seas, lakes, and rivers have large water surfaces, the water vapor in air is often unsaturated.
This does not mean that it is unsaturated at every place and time.

Solar radiation and the movement of air make evaporation and condensation vary with location and time.
Sometimes evaporation exceeds condensation; sometimes condensation dominates.`,
      `Air humidity describes the water vapor present in the air.
Different quantities describe different aspects of humidity.`,
      String.raw`**Water vapor pressure** The atmosphere is a mixture of gases and water vapor.
Each component contributes to the total pressure.
In this lesson's dilute-gas mixture approximation, imagine removing the other gases while keeping the same temperature and volume.
The pressure produced by the remaining water vapor is its **partial pressure**, called water vapor pressure here.`,
      `Water vapor pressure is one indicator of humidity and is expressed in pressure units.
The textbook uses newtons per square meter or millimeters of mercury.
The former unit is the pascal; the latter is the textbook's retained pressure unit.`,
      `Knowing water vapor pressure alone does not show how close the vapor is to saturation.
Temperature must also be known.
Evaporation, condensation, and water loss from living organisms depend on the degree of saturation and on conditions such as temperature and air movement.

Relative humidity compares the actual water vapor pressure with saturated water vapor pressure at the same temperature.`,
      String.raw`At a given temperature, the ratio of water vapor pressure $p$ in air to saturated water vapor pressure $p_0$ at the same temperature is called the **relative humidity** $\gamma$.
It is usually expressed as a percentage:`,
      String.raw`$\gamma=\frac{p}{p_0}\cdot100\%.$
$(4-4)$`,
      String.raw`Along the path in Figure $63$, unsaturated water vapor cools at constant water vapor pressure until it reaches the saturation-pressure curve.
The pressure held constant here is the water vapor's partial pressure.
Not every cooling process follows this same path.

For air with unchanged composition before condensation begins, approximately constant total pressure gives a useful model of this path to the dew point.`,
      String.raw`Suppose the water vapor pressure at temperature $t_1$ is $p_1$, with the state represented by point $A$.
Along the textbook's path with $p_1=$ constant, cooling to $t_p$ brings the vapor to saturation at point $B$.
The temperature at which it first becomes saturated under these cooling conditions is called the **dew point**.`,
      '',
      'Figure 63',
      `When air cools to its dew point and conditions allow condensation, fog or dew can begin to form.
Fog consists of suspended small droplets; dew forms as droplets on a surface.
Reaching the dew point does not guarantee that both appear together everywhere.`,
      String.raw`The dew point can characterize humidity when saturation-pressure data are used with the appropriate temperature, pressure, and state conditions.
From a known dew point, a table of saturated water vapor pressures gives $p_1$, the water vapor pressure in the original air.
At the air temperature $t_1$, use a table for the same substance to find the saturation pressure $p_0$.

With $p_1$ and $p_0$ known, calculate relative humidity using:
$\gamma=\frac{p_1}{p_0}\cdot100\%$.
The table's temperature and pressure units must match the data used.`,
      `**Humidity-measuring instruments** Hygrometers and wet- and dry-bulb instruments measure humidity.
Different instruments rely on different physical effects and need appropriate calibration or tables.`,
      String.raw`The textbook's dew-point instrument observes the dew point directly.
It has a metal box $K$ with a polished front surface (Figure $64$), ether inside, and a thermometer.
The modern figure labels the air bulb $G$.

The historical description uses increased ether evaporation to cool the metal box.
This lesson describes the instrument's structure and principle, not instructions for ether evaporation, pumping, or pressurization.
The textbook takes the temperature when dew first appears on the polished surface as the observed dew point.

The thermometer reading must correspond appropriately to the surface temperature.
An arbitrary thermometer reading is not a dew-point measurement.
With the air temperature also known, saturation-pressure tables give water vapor pressure and relative humidity.`,
      '',
      'Figure 64',
      '',
      'Figure 65',
      `The textbook also describes a hair hygrometer.
It uses the lengthening of degreased hair as relative humidity increases.
Calibration converts the length change into a humidity reading.`,
      String.raw`**The wet- and dry-bulb instrument** This instrument has two thermometers (Figure $65$).
The dry bulb indicates air temperature.
The wet bulb is wrapped in gauze whose lower end dips into water, keeping the bulb wet.
Net evaporation removes energy and cools the wet bulb.

Air movement, pressure, and instrument conditions must be appropriate for the comparison.
An arbitrary wet-bulb reading alone does not determine humidity.
With other conditions unchanged, higher relative humidity means less evaporative cooling, so the wet-bulb temperature is closer to the dry-bulb temperature.

At relative humidity $100\%$, with the water surface and air in the corresponding same-temperature equilibrium, there is no net evaporative cooling and the bulb readings agree.
Water molecules do not stop exchanging across the liquid surface.
Use the temperature difference with a table appropriate to the instrument, pressure, and ventilation conditions to determine humidity.

The textbook compares this method with ordinary hygrometers.
Accuracy also depends on calibration and measurement conditions; a wet- and dry-bulb instrument is not automatically more accurate in every situation.`,
      String.raw`**Why humidity matters** Evaporation from the skin depends in part on air humidity.
It removes energy and contributes to body-temperature regulation.
In its historical spacecraft example, the textbook specifies relative humidity $60\sim70\%$ while air temperature and pressure are controlled.

That is the textbook's description of a particular setting, not a universal health recommendation for every person, environment, or modern device.`,
      `The textbook lists textile mills, confectionery workshops, tobacco factories, and other workplaces to illustrate humidity control in production.
Storing manufactured products and books can also require controlled humidity.
This is why the textbook mentions wet- and dry-bulb instruments on exhibition-room walls.

These examples do not imply a single suitable humidity for every material, process, and place.`,
      '**Worked examples**',
      String.raw`1. In the textbook's worked example, a steam-and-droplet mixture at $t_1=100^\circ\mathrm{C}$ contains $90\%$ of its mass as small water droplets.
It is mixed with an equal mass of cold water at $t_2=10^\circ\mathrm{C}$.
What is the final water temperature $t$?

Use the textbook's heat-balance model: neglect heat absorbed by the container and lost to the surroundings, assume a common final temperature and complete vapor condensation, and use the textbook's approximate water specific heat and latent heat.`,
      String.raw`**Solution:** Let the cold-water mass be $m$.
The equal-mass steam-and-droplet mixture contains vapor mass $0.1m$ and droplet mass $0.9m$.
Take absorbed heat as positive and released heat as negative.
In the following expressions, L is the latent heat released per unit mass on condensation, and c is water's specific heat capacity, the energy per unit mass for a unit temperature rise.
The heat exchanged as the vapor condenses and the resulting water cools is:`,
      String.raw`$Q_1=-0.1mL+0.1cm(t-t_1).$`,
      `The original small droplets also cool.
Their released heat is negative under the same sign convention:`,
      String.raw`$Q_2=0.9cm(t-t_1),$`,
      String.raw`The example's final temperature satisfies $t<t_1$.
The cold water absorbs heat $Q_3=cm(t-t_2)$.
Neglecting energy exchange with the container and surroundings, write the heat-balance equation with the same sign convention:`,
      String.raw`$Q_1+Q_2+Q_3=0;$`,
      String.raw`$-0.1mL+0.1cm(t-t_1)+0.9cm(t-t_1)$ $+cm(t-t_2)=0.$`,
      String.raw`The heat-balance equation gives:
$t=\frac{0.1L+c(t_1+t_2)}{2c},$`,
      String.raw`Using the textbook's approximate water specific heat and latent heat gives:
$t\approx82^\circ\mathrm{C}.$
This result belongs to the stated heat-balance model, not every real mixing process involving waste steam.`,
      String.raw`2. In the textbook's worked example, a sealed container with volume $V_1=0.5$ m$^3$ contains water of mass $m=0.5$ kg and is heated to $t=147^\circ\mathrm{C}$.
What volume change $\Delta V$ is needed for the contents to be saturated vapor only?
At temperature $t=147^\circ\mathrm{C}$, use the corrected approximate saturation pressure $p_0=$ $4.4\times10^5$ N/m$^2$.

Sealed means that the total mass does not escape.
The specified temperature must also stay constant while the volume changes.`,
      String.raw`**Solution:** The textbook approximates the vapor as an ideal gas.
At saturation pressure $p_0$, it estimates the volume occupied if the whole mass is vapor:`,
      String.raw`$V=\frac{mRT}{p_0\mu},$`,
      String.raw`Here $\mu=0.018$ kg/mol is the textbook's water molar mass.
Use thermodynamic temperature in kelvins, with units consistent with pressure, volume, and the gas constant.
In the volume equation, R is the gas constant and T is thermodynamic temperature.
From $V_1>V$, the textbook concludes that the initial vapor is unsaturated and that its volume must decrease to reach saturation.

This is an ideal-gas approximation for water vapor, not an exact state relation for real vapor at every density.`,
      String.raw`$\Delta V=V-V_1=\frac{mRT}{p_0\mu}-V_1;$`,
      String.raw`Substitute the corrected saturation pressure and estimate using the textbook's ideal-gas model:
$\Delta V\approx-0.3$ m$^3$.
This is the result rounded to the textbook's precision within that model, not an exact volume change for real vapor under every condition.`,
      String.raw`The negative sign means the volume decreases by $0.3$ m$^3$.
This conclusion assumes constant temperature, no loss of total mass, and the stated ideal-gas approximation for the vapor.`,
    ],
  },
};
