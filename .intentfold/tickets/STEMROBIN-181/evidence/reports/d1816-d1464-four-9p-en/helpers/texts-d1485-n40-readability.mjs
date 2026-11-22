export const n40ReadabilityRepair = {
  task: 'D1485', author: 'd1816-d1437-n40-first-missing-en',
  review: 'd1816-d1438-n40-first-en-review',
  reviewHash: 'e94b26161fd53ea231f3287b3fbeb3cba48f0ca84404d34334b3b5d9e7f3e543',
  boundaryPrefixes: ['Connect the right endpoints', "Within this diagram's fluid-state"],
  updates: {
    0: String.raw`Return to the real-gas isotherms in Figure 55.
An isotherm is a line of states at the same unchanged temperature.
We compare one pure substance with a fixed total mass: no substance is added or removed.

An equilibrium state has steady overall conditions, although its tiny particles keep moving.
Vapor is the gaseous form of the substance.
Condensation changes vapor into liquid.

Below the critical temperature, each isotherm has a horizontal, or flat, part where liquid and vapor are present together.
The critical temperature is the temperature at which the distinction between separate liquid and vapor phases disappears.
Connect the left endpoints of these flat parts, where condensation finishes and liquid compression begins.

The resulting smooth curve ends at the critical point $K$.
This left-endpoint boundary is called AK and is dashed in Figure $57$.
The liquid region lies to its left, between the dashed boundary and the critical isotherm's segment $CK$.
That segment runs from C to K on the line at the critical temperature.
Horizontal thin lines mark the liquid region in Figure $57$.

This diagram concerns fluid states: the liquid and gas states involved in liquid-vapor changes.
It does not include every state of matter, such as solids.
Each equilibrium state has a corresponding pressure $P$, total volume $V$, and temperature $T$.
Volume is the space occupied by the substance, and the isotherm identifies its temperature.
These quantities are related, so they cannot all be chosen independently.`,
    3: String.raw`Connect the right endpoints of the horizontal coexistence segments.
These are the flat parts where liquid and vapor occur together.
At each right endpoint, vapor begins condensing.

This right-endpoint boundary is called BK and is also a smooth dashed curve ending at $K$.
The left boundary $AK$ and right boundary $BK$ enclose the liquid-vapor coexistence region.
Vertical thin lines mark this region in Figure $57$.

Here, the two phases mean the liquid part and vapor part.
The vapor is saturated: it is in balance with liquid at the same temperature.
Molecules can evaporate from the liquid and condense from the vapor, but neither process has an overall advantage in equilibrium.

At an ordinary boundary of this region, one part is just appearing or disappearing.
At the critical endpoint, the distinction between the liquid and vapor parts vanishes.
This special endpoint differs from the ordinary boundaries.

The total mass stays fixed, but the mass and space occupied by each part can change between equilibrium states.
The total volume includes both parts.
It is not the volume of a single gas part whose own mass remains fixed.`,
    4: String.raw`Within this diagram's fluid-state range, the regions outside the liquid and coexistence regions are described as gaseous states.
Below the critical isotherm and to the right of the coexistence region, the vapor is unsaturated.
It has not yet reached the boundary where condensation starts.

Squeeze this vapor while keeping its temperature unchanged.
This is called isothermal compression.
On reaching the coexistence boundary, it begins condensing.
Further compression can complete the change into liquid.
Diagonal thin lines mark the unsaturated-vapor region in Figure $57$.

Above the critical temperature, isothermal compression does not produce separate liquid and vapor parts.
For $T>T_{\text{临}}$, T is the temperature and the symbol on the right is the critical temperature.
The inequality means that the temperature is above the critical temperature.

An ideal gas is a simplifying model that neglects molecular size and the effects of attraction between molecules when these effects are small.
Being above the critical temperature does not, on its own, make this model suitable.
The density must also be sufficiently low, and molecular interactions must have sufficiently small effects.

Density means mass in a given amount of space.
Low density gives the molecules plenty of space, but the effects of their interactions must still be checked.
The ideal-gas description remains an approximation, not an exact rule for every dilute gas.

In the fluid states considered here, squeezing above the critical temperature does not create separate coexisting liquid and vapor phases.
Density and other properties can still change continuously as the volume decreases.`,
  },
};
