# Deriving the Law of Refraction of Light

Geometrical optics uses a ray to show the direction in which light travels, not to describe a real, thin thread.
Experiments first revealed the rules for these directions: light travels in a straight line in a homogeneous medium and follows the laws of reflection and refraction at an interface.

Huygens (惠更斯) used a wave theory of light to explain the direction rules for reflection and refraction.
He proposed that light was an elastic wave traveling through an imagined medium called ether that filled space.
Ether belongs to this historical proposal, not to a medium that modern physics requires for light to travel, and light can travel through a vacuum.

The source textbook introduced Huygens's (惠更斯) principle in Chapter Four when discussing mechanical waves, although the principle was first formulated for light.
It treats points on an old wavefront as starting points for small waves and constructs the new wavefront from their common forward boundary.

Here we use a linear wavefront model in homogeneous, isotropic media: homogeneous means that a medium has the same properties everywhere, and isotropic means that a given wave travels at the same speed in every direction.
Linear means that small waves can add together without changing one another's propagation rules, and we keep the color fixed by considering light of one frequency.
Under these conditions, the simple wavefront construction helps us find ray directions, but this does not mean that every wave follows identical rules under all conditions.

Section $47$ used a wavefront construction to derive the law of reflection for mechanical waves.
Under the model conditions just stated, the same geometrical reasoning also applies to light waves, so the advance of a wavefront explains the law of reflection for light.

Now consider refraction as light enters a different medium across a stationary, flat interface, with Figure 195 representing a boundary such as the one between air and water.
The wavefront $AC$ of a plane wave is a flat surface, drawn as a straight line in the diagram's cross section, that joins points at the same stage of vibration.

The light rays $A_1A$ and $B_1B$ are perpendicular to this wavefront, and in this model each ray points in the direction in which the wavefront advances.
Points reached at different times on the interface send secondary waves into the second medium, and the common tangent surface to these waves at one instant is the refracted wavefront.

The wavefront traveling along ray $A_1A$ first reaches the interface $MN$ at A, while C on that same wavefront has not yet reached B.
Let the phase speed in the first medium be $v_1$, meaning the speed at which a given stage of vibration advances, while the wavefront traveling along ray $B_1B$ still has distance CB to cover from C to B on the interface $MN$.

Start the clock when the wavefront reaches A and stop it when it reaches B, so both sides of the construction use this same interval.
The time needed is the distance divided by the speed:
$\Delta t=\frac{|CB|}{v_1}$.

<!-- source figure fig-195; deferred, no image opened or generated -->

Figure 195

When the wavefront has just reached $B$ and the secondary wave at B is only beginning, the secondary wave from $A$ has already traveled for that same interval of time.
In the isotropic second medium, its wavefront is a sphere centered at A, drawn as a circular arc in this cross section, with radius:
$|AD|=v_2\cdot\Delta t$.

Here $v_2$ is the phase speed of light of this color in the second medium.
During the same time interval, a smaller speed gives a smaller secondary-wave radius, which is why the refracted direction can change.

Draw a line from $B$ tangent to the secondary-wave sphere centered at $A$ to obtain the refracted wavefront $DB$ in this cross section, where a tangent touches the circular arc without passing through it.
Secondary waves from points reached later on the interface have traveled for less time and have smaller radii, and they also touch this new wavefront at the same instant.

A normal is a line perpendicular to the interface, and the angle of incidence $\alpha$ is the angle between the incoming ray and this normal, not the interface.
It equals $\triangle ABC$'s angle $\angle CAB$ because the incoming ray is perpendicular to the old wavefront and the interface normal is perpendicular to AB, so turning both sides of an angle through a right angle preserves its size.

The triangle has a right angle at C, with AB as its hypotenuse and CB opposite this angle, and sine means the opposite side length divided by the hypotenuse length.
Together with distance being speed multiplied by time, this gives:
$|CB|=v_1\cdot\Delta t=|AB|\sin\alpha$ (7.1).

The angle of refraction $\beta$ is likewise measured between the refracted ray and the interface normal, and it equals $\triangle ABD$'s angle $\angle ABD$.
This follows because the refracted ray is perpendicular to the new wavefront and the interface normal is perpendicular to AB, while radius AD is perpendicular to tangent DB, giving a right angle at D.

This supplies the side-length relation for the second right triangle.
In this right triangle, AB is again the hypotenuse and AD is opposite the angle, so:
$|AD|=v_2\cdot\Delta t=|AB|\sin\beta$ (7.2).

First divide (7.2) by (7.1) to cancel the common hypotenuse length and the common time interval, and then take the reciprocal of each side to obtain the usual form of the law of refraction.
The ratio form below applies when the incident and refracted angles are nonzero, while light arriving along the normal does not bend and uses the relations before division, not zero divided by zero:
$\frac{\sin\alpha}{\sin\beta}=\frac{v_1}{v_2}=n$ (7.3).

Here $n$ is called the **relative refractive index**, the speed ratio for light passing from the first medium into the second.
In this model, keeping the media and the color fixed makes the ratio independent of the angle of incidence, but changing the media or the color does not let us assume the same constant.

It compares the phase speeds of light of the same color on opposite sides of the interface, not a value shared by all waves.
Huygens's (惠更斯) wavefront construction therefore gives both the law of refraction and the physical meaning of the relative refractive index:
$n=\frac{v_1}{v_2}$ (7.4).

If the angle of refraction $\beta$ is smaller than the angle of incidence $\alpha$, relation (7.3) shows that the phase speed in the second medium is smaller than in the first.
The refracted ray then lies closer to the normal because the slower side advances less during the same time interval, changing the direction of the new wavefront.
Measurements of light speed in water and other transparent media support this connection between speed and refraction, with the comparison still made for the corresponding color of light.

Using relation (7.4), we can also express the relative refractive index in terms of the **absolute refractive indices** $n_1$ and $n_2$ of the first and second media and the relative index $n$.
An absolute refractive index uses light speed in a vacuum as its reference, with c denoting that vacuum speed, so for light of the same color the definitions are $n_1=\frac{c}{v_1}$ and $n_2=\frac{c}{v_2}$.

Divide the absolute refractive index of the second medium by that of the first, and the common vacuum light speed cancels.
The relative index therefore compares the media in a specified direction, with the second medium's absolute index in the numerator and the first medium's in the denominator:
$n=\frac{v_1}{v_2}=\frac{n_2}{n_1}$ (7.5).
