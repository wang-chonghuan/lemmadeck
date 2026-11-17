# 134. Basic Properties of Ferromagnetic Materials

Relatively few kinds of material in nature are ferromagnetic, but they have important practical uses.

At a temperature below the material's Curie temperature, inserting a suitable iron or steel core can greatly strengthen the field inside a coil while its current and winding geometry remain the same.

The extra field comes from the magnetized material, not from an increase in coil current;
the enhancement also depends on the material, its shape, and its magnetic state.

Under suitable magnetizing conditions, a ferromagnetic material can become magnetized along the applied field, and its relative permeability $\mu$ can be much greater than 1.

After magnetization, some ferromagnetic specimens retain a net magnetization when the applied magnetizing field is removed;
this is remanence.

Remanence is not evidence that current is still flowing in the coil, nor does it mean that every unmagnetized piece is already a permanent magnet.

The permeability of a ferromagnetic material is not a fixed material constant.

Even at the same temperature and with the same specimen shape, it depends on the present field strength and on the specimen's previous magnetizing history.

Knowing only the present applied field is therefore often insufficient to determine the magnetic state;
iron cannot be assigned a single enhancement factor valid in every situation.

Heating a ferromagnetic material above its particular Curie temperature removes its ferromagnetic spontaneous magnetization, not every possible response to a magnetic field.

The temperature is named after the French scientist Curie (居里);

an iron needle heated sufficiently above this temperature loses the conspicuous ability to attract iron that came from its remanent magnetization.

The original textbook lists iron at $753^\circ\mathrm{C}$, nickel at $365^\circ\mathrm{C}$, and cobalt at $1000^\circ\mathrm{C}$;

some ferromagnetic alloys have Curie temperatures below $100^\circ\mathrm{C}$.
These numbers are retained as the textbook's reported values, not as modern precision measurements;

a particular material's transition temperature must be established from its composition and measurement data.

To describe the material's magnetic state, this textbook introduces a quantity called **magnetization**.

Consider a long, uniform iron rod inside a sufficiently long solenoid, using a model in which the central fields are approximately uniform and aligned and end-related demagnetizing effects are negligible;

at a specified nonzero applied field and magnetic history, write the internal flux density as $B=\mu B_0$.

Here $B$ is the total internal magnetic flux density with the material present, while $B_0$ is the flux density produced by the same coil current without the material;

their difference measures the material's magnetic contribution.

The textbook denotes this difference by $I$, so it has units of magnetic flux density, not electric current and not the amperes-per-metre units commonly used for modern magnetization;

conversion between the magnetic quantities involves the permeability of free space.

The relative permeability here describes a ratio at the specified state, not a constant valid for all fields and histories.

$I=B-B_0$
(13-2)

Substituting equation (13-1), within the model above and at the specified nonzero applied-field state, also gives:

$I=(\mu-1)B_0$.
(13-3)

The relation between $I$ and $B_0$ is complex because a ferromagnet's $\mu$ itself depends on $B_0$, as well as on magnetic history.

For a specified temperature, specimen shape, and magnetizing procedure, the curve showing $I$ against $B_0$ is called a **magnetization curve**.

It can be obtained experimentally using the measurement approach in §133;
different procedures need not produce the same curve.

Start with a demagnetized iron specimen whose net magnetization is approximately zero, keep its temperature fixed below the Curie temperature, and increase the applied field slowly;

initially, its magnetization $I$ rises approximately linearly with $B_0$, as shown in Figure 301 (the initial magnetization curve).

The specimen then approaches saturation: although $B_0$ continues to increase, the material's magnetic contribution becomes nearly constant, but the total internal field need not stop increasing.

The textbook explains this using the orientation of tiny loop currents: at saturation, their magnetic moments are nearly aligned with the field, so further increases in $B_0$ cannot substantially increase their contribution.

This is a qualitative magnetic-moment model, not a picture of electron spin as a mechanically rotating ball;

in domain language, existing spontaneously magnetized regions change their sizes and orientations, increasing the net magnetization until it approaches aligned saturation.

Figure 301

Each ferromagnetic material has its own magnetizing characteristics;
one material's curve cannot stand in for every material.

A comparison must also specify the temperature, specimen shape, initial magnetic state, and the procedure used to apply the field.

The actual relation between $I$ and $B_0$ is more complex than the initial curve in Figure 301: the same present field can correspond to different magnetic states.

Magnetization depends on whether the specimen was magnetized before, how strong the previous field was, and how it increased or decreased;

Figure 301 describes only increasing the field from a demagnetized state.

At the same temperature and specimen geometry, with a slowly changing field, reducing the magnetizing field from saturation does not make the magnetization $I$ retrace the increasing-field curve;

it usually retains a larger magnetization.
This dependence on magnetic history is **hysteresis**;

domain-wall motion and magnetic-moment reorientation can be impeded, so removing the applied field need not restore the initial state.

Figure 302 shows a full magnetizing sequence relating $I$ and $B_0$;

keep temperature and specimen shape fixed, neglect background fields, and change the applied magnetizing field slowly.

Starting from a demagnetized state, increase the field along $oa$, as on the initial magnetization curve in Figure 301, and reach approximate saturation at $a$.

Then reduce $B_0$ to 0, following $ab$;
when $B_0=0$, the magnetization is still nonzero, and $I=ob$ represents **remanence**.

With the applied magnetizing field removed, the specimen still produces its own field and behaves as a permanent magnet;

this comes from retained material magnetization, not continuing coil current, and it does not mean the total internal field is zero.

A finite, constant permeability multiplied by a zero applied field cannot be used here to rule out remanence.

Next, increase the applied magnetic flux density $B_0$ in the reverse direction until the net magnetization reaches zero at the textbook's $B_{0k}=oc$;

the plotted distance expresses the magnitude of the reverse field, not a claim that its direction is positive.

The textbook calls $B_{0k}$ the **coercive field**, expressing the reverse magnetizing-field scale needed to reduce this specimen's net magnetization to zero;

it is not a mechanical force or the total internal magnetic flux density, and conversion is needed to the field-strength units commonly used today.

Continue to reverse saturation at $a'$, reduce the field to zero, then increase it in the original direction until the curve returns to $a$.

In an ideal model with fixed temperature, no magnetic bias, and equivalent forward and reverse procedures, this closed curve is symmetric about $o$ and is called a **hysteresis loop**.

Figure 302

The original textbook credits the Russian physicist A. G. Stoletov (斯托列托夫, 1839-1896) as the first to study the magnetizing characteristics of ferromagnetic materials carefully.

A. G. Stoletov used a magnetizing method in which wire was wound around a closed iron ring and current was passed through the wire to magnetize the ring.

A closed magnetic path helps reduce the end-related demagnetizing effects of an open rod;

the coil's magnetizing field establishes the material's magnetization, which must not be mistaken for electric current in the wire.

Different ferromagnetic materials can have differently shaped hysteresis loops, an important basis for comparing their magnetic properties.

Such comparisons require specified temperatures, specimen shapes, magnetic histories, and field-changing conditions;
a loop is not a fixed shape independent of the experiment.

Ferromagnetic materials may be classified as **magnetically soft** or **magnetically hard** according to how easily they are magnetized and demagnetized;

this is not mechanical hardness.

With the same axis scales and comparable magnetizing conditions, Figure 303a illustrates a narrower, smaller-area soft-material loop, with smaller remanence and coercivity in this particular drawing.

Iron, certain steels, and permalloy, an iron-nickel alloy, can be magnetically soft;

these materials readily reverse their magnetization, but a small loop area alone does not establish small remanence for every soft material.

Figure 303b illustrates a wider, larger-area hard-material loop, with larger remanence and coercivity in this drawing.

Stable remanence and greater resistance to demagnetization make such materials suitable for permanent magnets;

comparisons must still specify temperature, magnetizing amplitude, and specimen conditions.

Magnetically soft materials can serve as cores in transformers, generators, and electric motors.

Under operating conditions that require alternating magnetic fields, the core is repeatedly magnetized and demagnetized, requiring external work;

some energy becomes heat during each hysteresis cycle.

For a complete, sufficiently slow cycle at fixed temperature and specimen conditions, the enclosed loop area, converted using the correct physical axes and units, represents hysteresis energy loss per unit material volume per cycle;

because this textbook expresses magnetization as a flux-density contribution, conversion involving the permeability of free space is needed, and the whole core's loss also depends on its volume.

An area measured on the page is not directly the work done on the entire core.

At the same magnetizing amplitude and under comparable conditions, a narrower-loop soft material usually has less hysteresis loss than a wider-loop hard material;

actual devices also have losses such as eddy-current loss, so loop area alone does not determine their total loss.

Figure 303
