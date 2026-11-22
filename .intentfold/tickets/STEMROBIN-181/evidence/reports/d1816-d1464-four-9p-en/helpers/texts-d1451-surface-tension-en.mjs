export const surfaceTensionConfigs = {
  'phy9-c1-s5-n43': {
    task: 'D1451', prepare: 'd1816-d1450-n43-first-missing-en', chapterFromSection: true,
    boundaries: [
      'Watching water drip slowly',
      'A soap bubble can also look',
      'For a freely suspended droplet',
      'The textbook compares surface contraction',
      'Liquid surface tension',
    ],
    texts: [
      `Alongside gravity, elastic forces, and friction, we can observe the effects of surface tension at a liquid's surface.
It affects the liquid's shape and what happens where the liquid meets its surroundings or a solid surface.
These effects are often especially noticeable at small scales, so surface tension should not always be described as a small force.

Everyday activities such as pouring water into a cup involve surface phenomena.
But surface tension does not explain all liquid behavior, and its absence would not make every activity involving liquids impossible.`,
      `Surface phenomena are common in nature and everyday life.
A soap bubble is an easily noticed example.
The textbook also discusses writing with ink: a dip pen takes ink from an inkwell, and a fountain pen stores ink in a sac.

Whether ink clings to the pen or flows out depends on surface tension, the pen's material and structure, and wetting: how the liquid spreads over and adheres to a material.
Rubbing soap onto the hands, forming and maintaining foam, and whether fine drizzle quickly soaks a fabric also involve liquid interfaces, where the liquid meets another material.
Wetting and the materials involved affect these processes.

The textbook also mentions rainbows and the supply of water from soil to plants.
Surface tension affects droplet shapes and water in tiny pores, but rainbows also require suitable optical conditions, and plants' water supply depends on more than surface tension alone.
These examples show the importance of surface phenomena without implying that changing surface tension alone must cause every consequence listed in the original.`,
      String.raw`Watching water drip slowly from a tap that is not fully closed or needs repair illustrates surface tension.
A droplet grows and hangs downward; the narrow neck joining it to the outlet thins until the droplet separates and falls (Figure $67$).
Gravity, surface tension, and liquid flow all affect its formation and separation.

As a temporary analogy, we can compare the water's surface to a stretched elastic film.
The droplet is not inside a real elastic bag, and its surface is not a shell made of another substance.
The neck's separation is not the tearing of a material skin.`,
      '',
      'Figure 67',
      `A soap bubble can also look as though it has the thin rubber skin of an inflated ball.
But its wall is a liquid film, whose properties should not be equated with those of solid rubber.
The textbook describes a bubble gradually shrinking as air escapes after a straw is taken from the mouth.

This assumes that the bubble remains connected to the straw and air can leave through it.
Under those conditions, surface tension can drive contraction.
The same conclusion cannot be applied directly to a sealed bubble from which air cannot escape.`,
      `The textbook describes a needle resting on water: the surface curves beside it, and under suitable conditions the needle does not sink.
Support depends on the vertical component of surface tension, buoyancy, and wetting.
This does not guarantee that any needle will stay afloat on any water surface.

Small, light water striders also move using support near the water's surface.
The textbook compares them to skaters, but the water surface is not real ice or a solid film.`,
      `The textbook describes water gently poured into a fine-mesh sieve: the curved liquid surface can temporarily keep water from passing through the holes.
This requires suitable hole sizes, wetting, and pressure conditions.
Not every sieve can hold water.

Woven fabrics also have pores between their threads.
Surface phenomena can delay water passing through some fabrics, but the result depends on the fibers, pore sizes, wetting, and water pressure.
It is not a general rule that all fabrics prevent immediate leakage.`,
      `For a freely suspended droplet of fixed volume, surface tension favors a nearly spherical shape when deformation by gravity, external flow, and contact with solid surfaces can be neglected.
For the same liquid under comparable conditions, surface effects usually become more important relative to gravitational deformation as droplets get smaller.
Small dewdrops can be nearly spherical, although wetting of the surface they touch still affects their shape.

Free fall does not remove every other influence on a raindrop: air resistance also affects its shape.
Smaller raindrops can be nearly spherical, while larger ones may be noticeably deformed.
We should not treat every raindrop as a perfect sphere.

Rainbows involve refraction, internal reflection, and dispersion of sunlight in water droplets: light bends, reflects inside the drops, and separates into colors.
Nearly spherical droplets help produce the familiar rainbow.
But a particular droplet's departure from a sphere does not prove that a rainbow is impossible under every condition.`,
      `In a spacecraft's near-weightless, or microgravity, environment, freely suspended liquid away from container surfaces can form nearly spherical droplets or larger blobs when flow disturbances are small.
This still requires surface effects to dominate the shape.
Liquid touching a container wall or strongly disturbed by flow does not necessarily become spherical.`,
      `The textbook compares surface contraction to a group of mutually attracting individuals gathering into a cluster.
The analogy suggests how the surface can become smaller and the shape approach a sphere.
It does not mean that molecules intentionally seek the interior, or that boundaries and external forces can be ignored.`,
      `Liquid molecules interact, and molecules near an interface experience a different environment from those in the liquid's interior.
From an energy viewpoint, creating more interface requires energy under the relevant conditions.
This does not mean that every surface molecule at every interface experiences the same net force in a single direction.

Liquids can flow because molecules keep moving and rearranging rather than staying at permanently fixed sites.
When temperature, composition, and the adjoining medium remain suitably stable, surface effects favor a smaller interface area if other forces and constraints can be neglected.
For a given volume, a sphere has the smallest surface area, explaining why a free droplet tends toward a spherical shape.

This equilibrium picture does not mean that every surface molecule moves inward forever.
Molecules continue their thermal motion.`,
      `Liquid surface tension has a different origin from the elastic force in stretched rubber.
Within the relevant elastic range, rubber's pull can decrease as it contracts and its stretch decreases.
For the same liquid and adjoining medium, when temperature, composition, and interface conditions remain nearly unchanged, the surface tension coefficient does not change with shrinking surface area in the way rubber's pull changes with stretch.

Here, the coefficient describes force per unit boundary length, not a total force that must stay constant along every possible boundary.
The textbook uses approximate incompressibility to explain why the average molecular spacing changes little.
This does not mean that liquid density remains unchanged at every temperature, pressure, or interface condition.`,
    ],
  },
  'phy9-c1-s5-n46': {
    task: 'D1458', prepare: 'd1816-d1457-n46-first-missing-en', chapterFromSection: true,
    boundaries: [
      'When the wire moves downward',
      'In this model',
      'This gives the relation',
      'Surface tension acts',
    ],
    texts: [
      String.raw`To study the magnitude and direction of surface tension, the textbook uses a rectangular metal frame with a movable side of length $l$, labeled $AB$, that can move in a vertical plane with little friction (Figure 69).
Once a soap film forms in the frame, wire $AB$ tends to move as the film tends to reduce its surface area.
The film's force on wire $AB$ lies in the film's plane and is perpendicular to the wire.

A resultant force $\vec F_1$ opposing the film's pull keeps the wire in equilibrium, allowing surface tension to be studied through the balance of forces.
To provide $\vec F_1$, the textbook attaches a soft spring fixed to a stand to the wire (Figure 69).
Here, $\vec F_1$ is the combined force of the spring and the wire's weight, not necessarily the spring force alone.

When wire $AB$ is in equilibrium, the textbook's vector convention gives:
$\vec F_1=-2\vec F$.
The minus sign indicates opposite directions, and the factor comes from the film's two surfaces.
It does not mean that the tension of a single interface automatically doubles.`,
      '',
      '',
      'Figure 69',
      'Figure 70',
      String.raw`Here, $\vec F$ is the force exerted on the wire by one of the film's two surfaces (Figure 70).
When conditions at the two interfaces, where the film meets its surroundings, are the same, their forces have equal magnitudes and point in the same direction in the illustrated geometry, so they add.
The two-interface factor for this soap film cannot be applied unconditionally to a single interface.`,
      String.raw`When the wire moves downward through a distance $h$, suppose the motion is approximately quasistatic: slow enough to remain close to equilibrium.
The magnitude of the balancing external resultant is $F_1=2F$, and its work is:
$A=F_1h=2Fh.$
(5-2)

This work is done by the combined spring force and weight.
The gravitational work for the same displacement must not be added again.
During downward extension, the external resultant and displacement point in the same direction, so this work is positive; the film's opposing pull does negative work.

The work expression also assumes negligible friction and viscous losses, meaning energy dissipated by the liquid's resistance to flow.
Interface conditions must remain stable and the force approximately constant.`,
      String.raw`In this model, the external work increases the film's surface-energy contribution.
The textbook calls this "surface energy".
More precisely, for a reversible process at constant temperature, the surface work corresponds to an increase in surface free energy, the energy measure relevant to reversible work under these conditions.

It should not be equated unconditionally with the change in the whole system's internal energy.
Initially, the area of one surface is $S_1$, and the textbook writes the film's surface energy as $U_{\text{surface}1}=2\sigma S_1$ because the film has two surfaces of equal area.
It writes the final surface energy as $U_{\text{surface}2}=2\sigma S_2$.

These expressions assume an approximately constant surface tension coefficient, with temperature and composition stable and the surrounding medium unchanged.
Thus:`,
      String.raw`$A=U_{\text{surface}2}-U_{\text{surface}1}=2\sigma S_2-2\sigma S_1=2\sigma(S_2-S_1).$`,
      String.raw`As the wire moves downward, taking its displacement as positive, the increase in one surface's area is the wire's length multiplied by its displacement.
Using the initial and final area notation above:
$S_2-S_1=lh$.

Substituting this into the surface-work expression gives:`,
      String.raw`$A=2\sigma lh.$
(5-3)`,
      `Comparing the right-hand sides of the textbook's work expressions (5-2) and (5-3) gives:`,
      String.raw`$2Fh=2\sigma lh.$`,
      String.raw`This gives the relation between force and boundary length.
For the uniform, flat interface considered here, the magnitude of the force exerted by one surface on a boundary of length $l$ is:`,
      String.raw`$F=\sigma l.$
(5-4)`,
      String.raw`Surface tension acts tangentially to the liquid surface and perpendicular to the chosen surface boundary.
In Figures 69 and 70, this means within the film's plane and perpendicular to wire $AB$.
For a curved surface, use the local tangent plane and the boundary's direction at each point.

Forces along different boundary segments cannot simply be added without considering their directions.
The boundary length here is the length of contact between one surface and the movable wire, not the entire frame's perimeter.
Under the same interface conditions, the force magnitude is proportional to this boundary length, with surface tension coefficient $\sigma$ as the proportionality constant.

The force-to-boundary-length relation in formula (5-4) gives units of newtons per meter.
These are equivalent to joules per square meter from the surface-energy viewpoint, since J/m$^2=$N m/m$^2$ $=$N/m.`,
      `The textbook's appendix lists surface tension coefficients for several liquids at their interfaces with air.
Using these values requires retaining the corresponding liquid, interface, and measurement conditions.
A value for a liquid-air interface cannot be transferred unconditionally to that liquid's interface with another medium.

The original appendix is the source for these values; none are specified in this passage.`,
    ],
  },
};
