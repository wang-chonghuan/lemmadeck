export const expansionConfigs = {
  'phy10-c1-s2-n5': {
    task: 'D1152', prepare: 'd1816-d1150-n5-first-missing-en',
    firstNativeFailure: 'd1151-n5-first-missing-en-author-native',
    firstInput: 'd1816-d1151-n5-first-missing-en/en.before-native.json',
    failureIndex: 0,
    firstFailureCause: 'A repeated angle token was omitted at prose0; diagnosis also found reversed arc-name and arc-length math token order at prose4.',
    repairScope: 'Only those two sentence fragments restore the approved math-token occurrences and order before retrying the failed author-native stage.',
    boundaries: ['The preceding sine relation', 'This approximate equation'],
    texts: [
      String.raw`Continue with the simple-pendulum model: the suspension point is fixed, the string is inextensible and has negligible mass, the bob is treated as a point mass, and the string stays taut during motion.
The pendulum length $l$ is the distance from the suspension point to the bob's center of mass.
In this model, it is the string length.
The bob moves along a circular arc in a vertical plane.
Its position can be described by the angle $\alpha$ through which the string departs from the vertical.

Take $\alpha$ as positive to the right.
To the left, as in Figure $6$, take $\alpha$ as negative.
With negligible resistance and an approximately uniform gravitational field, the tangential component of gravity $\vec{G}_{\tau}$ determines the change in speed.
Tangential acceleration describes how quickly speed changes.
Section $3$ already distinguished it from radial acceleration.`,
      String.raw`When the string departs from the vertical by angle $\alpha$, take the rightward direction along the arc as tangentially positive.
The tangential projection of gravity $G_{\tau}$ is:
$G_{\tau}=-G\sin\alpha=-mg\sin\alpha$ (1.5)
Within the usual range of back-and-forth swinging, $G_{\tau}$ and $\alpha$ have opposite signs.
The "$-$" sign represents the restoring action.

By Newton's second law, tangential motion satisfies:
$ma_{\tau}=G_{\tau}$
That is:
$ma_{\tau}=-mg\sin\alpha$ (1.6)

Here $a_{\tau}$ is the tangential projection of acceleration, not the entire acceleration vector.`,
      String.raw`Dividing both sides by mass $m$ gives:
$a_{\tau}=-g\sin\alpha$ (1.7)
Under the stated ideal simple-pendulum conditions, mass cancels from the equation.`,
      String.raw`The preceding sine relation has not yet used the small-angle approximation.
It still requires the simple-pendulum model, especially a taut string.
Now suppose the angular displacement remains small throughout the swing and angles are expressed in radians:
$\sin\alpha\approx\alpha$

Tangential acceleration can then be written approximately as:
$a_{\tau}=-g\alpha$ (1.8)
This step is an approximation.
At larger swing angles, the angle itself cannot replace its sine.`,
      String.raw`The bob's displacement from equilibrium along circular arc $OA$ can also be described by signed arc length $s$, as in Figure $6$.
From equilibrium position $O$, take arc length to the right as "$+$" and to the left as "$-$".

With the angle expressed in radians, arc length and angle satisfy:
$s=\alpha l$ (1.9)
This is distance measured along the arc, not the straight-line distance between its endpoints.`,
      String.raw`In the small-angle equation, replacing $\alpha$ with $s/l$ gives:
$a_{\tau}=-\frac{g}{l}s$ (1.10)
Tangential acceleration points toward equilibrium.
Its magnitude is proportional to the displacement distance measured along the arc.`,
      String.raw`This approximate equation has the same form as equation (1.4) for the spring oscillator.
The acceleration projection $a_x$ is replaced by the tangential acceleration projection $a_{\tau}$.
Straight-line displacement $x$ is replaced by signed arc length $s$.
For the pendulum, the proportionality coefficient depends on local gravitational acceleration and pendulum length.

Both models have acceleration proportional to distance from equilibrium and directed oppositely to the displacement.`,
      `The spring oscillator's restoring force comes from the spring.
The pendulum's tangential restoring force comes from a component of gravity, so the forces have different origins.
When the spring obeys Hooke's law, the pendulum swings through small angles, and resistance is negligible in both, their equations of motion have the same form.
Their displacement follows the same type of time dependence.
This does not mean the two devices must have the same period, amplitude, or initial state.`,
      `Equations (1.4) and (1.10) relate acceleration to displacement.
To find how position changes with time, we must also solve the equation of motion and know the initial position and velocity.`,
      `In uniformly accelerated motion, acceleration remains constant.
The oscillation considered here is different: the restoring force changes with position, and acceleration keeps changing as the object moves.
Uniform-acceleration formulas cannot be applied directly to the whole oscillation.`,
    ],
  },
  'phy9-c1-s7-n56': {
    task: 'D1136', prepare: 'd1816-d1135-n56-first-missing-en',
    boundaries: ['The proportionality coefficient', 'Many common solids'],
    texts: [
      String.raw`Experiments show that a solid's length in a specified direction can change approximately in proportion to its temperature change, as Figure 99 illustrates.
This approximation applies when there is no appreciable external constraint, temperature is approximately uniform, no phase change occurs, and both the temperature change and relative length change are small.

For the same temperature change, extension or contraction also depends on the original length.
We therefore describe relative change.
The length change is $\Delta l=l-l_0$, with the original length $l_0$ as the reference.

The relative change $\frac{\Delta l}{l_0}$ is approximately proportional to the temperature change $\Delta t=t-t_0$.
Use the appropriate sign of the temperature difference for warming or cooling.`,
      '',
      'Figure 99',
      String.raw`Using the original length as the reference, the approximate relation for linear expansion is:
$\frac{\Delta l}{l_0}=\beta\Delta t$.
(7-1)`,
      String.raw`The proportionality coefficient $\beta$ is called the **coefficient of linear expansion**.
In this approximate model, it describes the increase in length as a fraction of the original length for a temperature increase of 1 degree Celsius.
It depends on the material, temperature, and direction considered.
An anisotropic material can have different coefficients in different directions.

Over a limited temperature range, we can neglect the variation of $\beta$ with temperature and treat it as approximately constant.
Here the degree is a unit of temperature difference, not an absolute-temperature value.`,
      String.raw`From formula (7-1), under the stated conditions of free expansion and approximately constant coefficient, the relation between length and temperature change is:`,
      String.raw`$l=l_0(1+\beta\Delta t)$.
(7-2)`,
      String.raw`Many common solids have small linear expansion.
The textbook gives a typical order of magnitude for $\beta$ of $10^{-5}\sim10^{-6}$ degree$^{-1}$.
This is not a fixed range valid for every material and temperature.
The tables at the end of the book list linear-expansion coefficients for some materials.
Use them with attention to the specified material and temperature conditions.`,
      `Invar has a particularly small coefficient of linear expansion within its applicable temperature range.
It can therefore be used in precision instruments that require stable dimensions.
An instrument made from it is less sensitive in size to small temperature changes.
It does not have absolutely no thermal expansion, and this property cannot be extended to every temperature range.`,
    ],
  },
  'phy9-c1-s7-n57': {
    task: 'D1139', prepare: 'd1816-d1137-n57-first-missing-en',
    firstNativeFailure: 'd1138-n57-first-missing-en-author-native',
    firstInput: 'd1816-d1138-n57-first-missing-en/en.before-native.json',
    boundaries: ['Liquids also undergo', 'Water is a common', '**Worked examples**'],
    texts: [
      `For a freely expanding solid with positive linear expansion in every direction, warming increases its dimensions in each direction and also increases its volume.
This is not a rule that every material must obey.
As with length change, for a fixed quantity of substance it is convenient to describe volume change relative to the initial volume:`,
      String.raw`$\frac{\Delta V}{V_0}=\frac{V-V_0}{V_0}$.`,
      `Measurements show that relative volume change can be treated as approximately proportional to temperature difference under certain conditions.
Temperature must be approximately uniform, pressure conditions must stay the same, no phase change may occur, and the temperature range must be limited:`,
      String.raw`$\frac{\Delta V}{V_0}=\alpha\Delta t=\alpha(t-t_0)$.
(7-3)`,
      String.raw`The **coefficient of volume expansion** $\alpha$ describes the volume change as a fraction of the original volume for a temperature increase of 1 degree Celsius in this approximate model.
It depends on the material and temperature.
Over a limited temperature interval, it can be treated as approximately constant.
The textbook gives $10^{-5}\sim10^{-4}$ degree$^{-1}$ as the order of magnitude for many common solids.
This is not a universal range for all substances.`,
      String.raw`If $V_0$ is the initial volume at temperature $t_0$, formula (7-3) gives the volume $V$ after the change:`,
      String.raw`$V=V_0(1+\alpha\Delta t)$.
(7-4)`,
      String.raw`The coefficient of linear expansion $\beta$ is related to the coefficient of volume expansion $\alpha$.
Consider an isotropic cube expanding freely, with the same linear-expansion coefficient in every direction.
For very small expansion, neglecting higher-order changes gives $\alpha\approx3\beta$.
This approximation cannot be applied directly to every anisotropic material.
It is not an exact relation over a large temperature range.`,
      `Liquids also undergo volume expansion.
A liquid does not keep a fixed shape of its own.
Unlike a solid, it does not have a fixed-direction length defined independently of its container.
We therefore usually discuss its volume expansion rather than linear expansion in the same sense as for a solid.`,
      String.raw`When a liquid is heated in a container, changes in the liquid level can reveal volume changes.
The container's capacity may also change, so interpreting a rising or falling level requires distinguishing these two effects.
Many common liquids have larger volume-expansion coefficients than common solids, with an order of magnitude that can reach $10^{-3}$ degree$^{-1}$.
Comparisons still require the corresponding material, pressure, and temperature conditions.
The liquid level need not rise in every heating process.`,
      `Water is a common liquid on Earth and has unusual thermal-expansion properties.
Near ordinary atmospheric pressure, a fixed mass of liquid water decreases in volume when warmed from 0 to 4 degrees Celsius.
On warming further from 4 degrees Celsius, its volume begins to increase.

Its volume is therefore smallest and its density greatest near 4 degrees Celsius, as Figure 100 illustrates.
These are the textbook's approximate temperatures.
They are not fixed features of every pressure or every aqueous solution.`,
      '',
      'Figure 100',
      `This property affects heat exchange in a reservoir.
When relatively warm surface water cools, its density increases and it may sink, producing convection.
After reaching about 4 degrees Celsius, further cooling instead lowers its density.
Colder water may therefore remain near the surface.

In a sufficiently deep reservoir with little mixing disturbance, where this layering can develop, deep water can remain at about 4 degrees Celsius even when the air is very cold.
Shallow water, strong mixing, or other conditions do not guarantee this result.`,
      `**Worked examples**
The textbook's two worked examples below are theoretical calculations using approximate models.`,
      String.raw`**1.** Heating alcohol increases its volume by $\Delta V=5.5$ cm$^3$.
The problem gives alcohol's density as $\rho=800$ kg/m$^3$, volume-expansion coefficient as $\alpha=1.1\times10^{-3}$ degree$^{-1}$, and specific heat as $c=2.4\times10^3$ J/(kg degree).
Find the heat transferred to the alcohol.

Treat these properties as approximate values over this limited temperature interval.
Use an approximately constant-pressure process with no phase change and unchanged alcohol mass.
Count only the heat absorbed by the alcohol, not heat absorbed by the container or apparatus losses.`,
      String.raw`**Solution:** Let $V_0$ be the initial volume.
After heating, the volume is approximately $V=V_0(1+\alpha\Delta t)$, so the volume change is:`,
      String.raw`$\Delta V=V-V_0=V_0\alpha\Delta t$.`,
      String.raw`When the stated specific heat applies to the process and is approximately constant, the heat absorbed by the alcohol is $Q=cm\Delta t$.
Here $m=\rho V_0$ is the alcohol's mass, with density evaluated at its initial state.`,
      String.raw`The textbook assumes that density changes little during heating.
Here the volume-expansion coefficient and specific heat are also treated as approximately constant over the temperature interval.
Dividing the expressions for $\Delta V$ and $Q$ eliminates the initial volume and temperature difference, giving:`,
      String.raw`$\frac{\Delta V}{Q}=\frac{\alpha}{\rho c}$.`,
      `We can now find the heat absorbed by the alcohol.
Before substitution, convert the volume increase from cubic centimeters to cubic meters and use consistent units for the other quantities:`,
      String.raw`$Q=\Delta V\frac{\rho c}{\alpha}$;
$Q=9600$ J.
This result uses the problem's approximate material properties.
It is not the total energy that the heating apparatus must supply.`,
      String.raw`**2.** A steel string of length $l=3$ m is stretched vertically between the floor and ceiling.
How much does its tension change when it cools by $\Delta t=30$ degrees Celsius?
Under force $F$, the elastic extension $\Delta l$ is proportional to that force, with $F=k\Delta l$.
The stiffness is $k=7\times10^4$ N/m, and the coefficient of linear expansion is $\beta=1.1\times10^{-5}$ degree$^{-1}$.

The fixed points do not move, temperature is approximately uniform, and the change stays in the elastic range.
Treat the stated stiffness and coefficient as approximately constant.
The original elastic extension is very small relative to the string length.
This example uses a positive value for the magnitude of cooling.
It asks for the tension change, not the unknown initial tension or total tension.`,
      String.raw`**Solution:** First consider the thermal shortening without end constraints, using the original string length as an approximate free reference length.
After cooling, the free reference length would be $l_1=l(1-\beta\Delta t)$.
The magnitude of shortening is $|\Delta l|=|l_1-l|=l\beta\Delta t$.
With unchanged distance between the ends, additional elastic extension must compensate for this thermal shortening.
The additional force is $F=k|\Delta l|$.

Here $F$ is the increase in end force required to prevent thermal shortening.
It is not the total force including the previous tension.
The analysis does not mean that the actual fixed string is removed and installed again.`,
      String.raw`Substituting the value of $|\Delta l|$ into the expression for $F$ gives the increase in tension:`,
      String.raw`$F=k|\Delta l|=kl\beta\Delta t$,
$F\approx70$ N.
The textbook's approximate values and rounding are retained.
Under these conditions, cooling increases tension.`,
    ],
  },
};
