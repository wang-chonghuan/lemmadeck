export const zh = [
  String.raw`几何光学用光线表示光前进的方向，并不把光线当成一根真实的细线。
实验先告诉了人们这些方向怎样变化：光在均匀媒质里沿直线传播，遇到界面时遵守反射定律和折射定律。`,
  String.raw`惠更斯用光的波动说，从理论上解释了反射和折射的方向规律。
他当时设想，光是在充满宇宙空间的“以太”中传播的弹性波。
以太是这段科学史中的假想媒质，不是现代物理认为光传播所必需的东西，光也能在真空中传播。`,
  String.raw`原书第四章讨论机械波时介绍过惠更斯原理，而这个原理最初是用来描述光波的。
它把旧波面上的各点看作发出小波的起点，再用这些小波共同向前推进的边界构造新波面。`,
  String.raw`这里采用的是均匀、各向同性媒质中的线性波面模型：均匀表示媒质各处性质相同，各向同性表示同一种波沿各个方向的传播速度相同。
线性表示小波可以叠加而不改变彼此的传播规律，我们还把颜色固定，只研究同一种频率的光。
在这些条件下，简单的波面作图能帮助我们确定光线方向，但不能由此说任何波在任何条件下都遵守完全相同的规律。`,
  String.raw`第 $47$ 节用波面作图推导过机械波的反射定律。
在刚才说明的模型条件下，同样的几何推理也适用于光波，因此能从波面怎样前进解释光的反射定律。`,
  String.raw`现在研究光在静止平直的界面上从一种媒质进入另一种媒质时的折射，图 195 用空气和水这样的界面表示这一过程。
平面波的波面 $AC$ 是一片平面，在图示截面中画成直线，它连接处在同一振动阶段的点。
光射线 $A_1A$ 和 $B_1B$ 都垂直于这个波面，在这里的模型中，光线方向就是波面前进的方向。
界面上先后受到光波影响的点会向第二种媒质发出次波，所有这些次波在同一时刻的共同切面就是折射后的波面。
沿光线 $A_1A$ 前进的波面先在 A 点碰到界面 $MN$，此时同一波面的 C 点还没有走到 B 点。
设第一种媒质中的相速度为 $v_1$，相速度就是同一振动阶段前进的速度，而沿光线 $B_1B$ 从 C 到界面 $MN$ 上的 B 点还要走完距离 CB。
从波面到达 A 点时开始计时，到它到达 B 点时停止计时，界面两侧的作图使用同一段时间。
这段路所需的时间用距离除以速度得到：
$\Delta t=\frac{|CB|}{v_1}$。`,
  "",
  "图 195",
  String.raw`当波面刚到 $B$ 点、B 点的次波才开始发出时，从 $A$ 点发出的次波已经传播了同一段时间。
在各向同性的第二种媒质中，这个次波的波面是以 A 为球心的球面，图示截面把它画成圆弧，其半径为：
$|AD|=v_2\cdot\Delta t$。`,
  String.raw`其中 $v_2$ 是这一颜色的光在第二种媒质中的相速度。
同一段时间内，传播速度越小，次波展开的半径就越小，这正是折射方向会改变的原因。`,
  String.raw`从 $B$ 点作与 $A$ 点次波球面相切的直线，就得到图示截面中的折射波面 $DB$，切线只接触圆弧而不穿过它。
较晚到达界面的点发出的次波传播时间较短，因而半径较小，它们在同一时刻也与这个新波面相切。
法线是垂直于界面的直线，入射角 $\alpha$ 表示入射光线与法线的夹角，而不是与界面的夹角。
这个角等于 $\triangle ABC$ 中的 $\angle CAB$，因为入射光线垂直于旧波面，界面法线又垂直于 AB，把两条边都转过直角不会改变夹角大小。
三角形在 C 点是直角，AB 是斜边，CB 是这个角的对边，正弦就是对边长度与斜边长度的比。
结合距离等于速度乘时间，得到：
$|CB|=v_1\cdot\Delta t=|AB|\sin\alpha$ （7.1）。`,
  String.raw`折射角 $\beta$ 同样是折射光线与界面法线的夹角，它等于 $\triangle ABD$ 中的 $\angle ABD$。
这是因为折射光线垂直于新波面，界面法线垂直于 AB，而半径 AD 垂直于切线 DB，使 D 点成为直角顶点。
在这个直角三角形中，AB 仍是斜边，AD 是这个角的对边，所以：
$|AD|=v_2\cdot\Delta t=|AB|\sin\beta$ （7.2）。`,
  String.raw`先用（7.2）除（7.1），相同的斜边长度和相同的时间就会约去，再把所得等式两边取倒数，便得到通常写法的折射定律。
下面这个比值式用于入射角和折射角都不为零的情形，沿法线入射时不发生偏折，应用未相除的关系而不把零除以零：
$\frac{\sin\alpha}{\sin\beta}=\frac{v_1}{v_2}=n$ （7.3）。`,
  String.raw`其中 $n$ 叫作**相对折射率**，它表示从第一种媒质进入第二种媒质时的速度比。
在本课模型中，媒质保持不变、光的颜色也保持不变时，这个比值不随入射角改变，但换一种媒质或换一种颜色时不能直接把它当成同一个常量。
惠更斯原理的波面作图因此不仅给出折射定律，也揭示了相对折射率的物理意义：
$n=\frac{v_1}{v_2}$ （7.4）。`,
  String.raw`如果折射角 $\beta$ 小于入射角 $\alpha$，根据（7.3），第二种媒质中的相速度就小于第一种媒质中的相速度。
这时折射光线更靠近法线，因为较慢的一侧在同一段时间内前进得较少，新波面随之改变方向。
光在水和其他透明媒质中传播速度的测量实验支持这一速度与折射方向的关系，这里仍须比较相应颜色的光。`,
  String.raw`利用公式（7.4），还能用第一种和第二种媒质的**绝对折射率** $n_1$ 和 $n_2$ 表示相对折射率 $n$。
绝对折射率是用真空中的光速作比较基准，符号 c 表示真空光速，对同一种颜色的光，两个定义分别为 $n_1=\frac{c}{v_1}$ 和 $n_2=\frac{c}{v_2}$。`,
  String.raw`把第二种媒质的绝对折射率除以第一种媒质的绝对折射率，共同的真空光速会约去。
所以这里的相对折射率表示有方向的媒质比较，第二种媒质的绝对折射率在分子、第一种媒质的在分母：
$n=\frac{v_1}{v_2}=\frac{n_2}{n_1}$ （7.5）。`,
];

export const en = [
  String.raw`Geometrical optics uses a ray to show the direction in which light travels, not to describe a real, thin thread.
Experiments first revealed the rules for these directions: light travels in a straight line in a homogeneous medium and follows the laws of reflection and refraction at an interface.`,
  String.raw`Huygens (惠更斯) used a wave theory of light to explain the direction rules for reflection and refraction.
He proposed that light was an elastic wave traveling through an imagined medium called ether that filled space.
Ether belongs to this historical proposal, not to a medium that modern physics requires for light to travel, and light can travel through a vacuum.`,
  String.raw`The source textbook introduced Huygens's (惠更斯) principle in Chapter Four when discussing mechanical waves, although the principle was first formulated for light.
It treats points on an old wavefront as starting points for small waves and constructs the new wavefront from their common forward boundary.`,
  String.raw`Here we use a linear wavefront model in homogeneous, isotropic media: homogeneous means that a medium has the same properties everywhere, and isotropic means that a given wave travels at the same speed in every direction.
Linear means that small waves can add together without changing one another's propagation rules, and we keep the color fixed by considering light of one frequency.
Under these conditions, the simple wavefront construction helps us find ray directions, but this does not mean that every wave follows identical rules under all conditions.`,
  String.raw`Section $47$ used a wavefront construction to derive the law of reflection for mechanical waves.
Under the model conditions just stated, the same geometrical reasoning also applies to light waves, so the advance of a wavefront explains the law of reflection for light.`,
  String.raw`Now consider refraction as light enters a different medium across a stationary, flat interface, with Figure 195 representing a boundary such as the one between air and water.
The wavefront $AC$ of a plane wave is a flat surface, drawn as a straight line in the diagram's cross section, that joins points at the same stage of vibration.
The light rays $A_1A$ and $B_1B$ are perpendicular to this wavefront, and in this model each ray points in the direction in which the wavefront advances.
Points reached at different times on the interface send secondary waves into the second medium, and the common tangent surface to these waves at one instant is the refracted wavefront.
The wavefront traveling along ray $A_1A$ first reaches the interface $MN$ at A, while C on that same wavefront has not yet reached B.
Let the phase speed in the first medium be $v_1$, meaning the speed at which a given stage of vibration advances, while the wavefront traveling along ray $B_1B$ still has distance CB to cover from C to B on the interface $MN$.
Start the clock when the wavefront reaches A and stop it when it reaches B, so both sides of the construction use this same interval.
The time needed is the distance divided by the speed:
$\Delta t=\frac{|CB|}{v_1}$.`,
  "",
  "Figure 195",
  String.raw`When the wavefront has just reached $B$ and the secondary wave at B is only beginning, the secondary wave from $A$ has already traveled for that same interval of time.
In the isotropic second medium, its wavefront is a sphere centered at A, drawn as a circular arc in this cross section, with radius:
$|AD|=v_2\cdot\Delta t$.`,
  String.raw`Here $v_2$ is the phase speed of light of this color in the second medium.
During the same time interval, a smaller speed gives a smaller secondary-wave radius, which is why the refracted direction can change.`,
  String.raw`Draw a line from $B$ tangent to the secondary-wave sphere centered at $A$ to obtain the refracted wavefront $DB$ in this cross section, where a tangent touches the circular arc without passing through it.
Secondary waves from points reached later on the interface have traveled for less time and have smaller radii, and they also touch this new wavefront at the same instant.
A normal is a line perpendicular to the interface, and the angle of incidence $\alpha$ is the angle between the incoming ray and this normal, not the interface.
It equals $\triangle ABC$'s angle $\angle CAB$ because the incoming ray is perpendicular to the old wavefront and the interface normal is perpendicular to AB, so turning both sides of an angle through a right angle preserves its size.
The triangle has a right angle at C, with AB as its hypotenuse and CB opposite this angle, and sine means the opposite side length divided by the hypotenuse length.
Together with distance being speed multiplied by time, this gives:
$|CB|=v_1\cdot\Delta t=|AB|\sin\alpha$ (7.1).`,
  String.raw`The angle of refraction $\beta$ is likewise measured between the refracted ray and the interface normal, and it equals $\triangle ABD$'s angle $\angle ABD$.
This follows because the refracted ray is perpendicular to the new wavefront and the interface normal is perpendicular to AB, while radius AD is perpendicular to tangent DB, giving a right angle at D.
This supplies the side-length relation for the second right triangle.
In this right triangle, AB is again the hypotenuse and AD is opposite the angle, so:
$|AD|=v_2\cdot\Delta t=|AB|\sin\beta$ (7.2).`,
  String.raw`First divide (7.2) by (7.1) to cancel the common hypotenuse length and the common time interval, and then take the reciprocal of each side to obtain the usual form of the law of refraction.
The ratio form below applies when the incident and refracted angles are nonzero, while light arriving along the normal does not bend and uses the relations before division, not zero divided by zero:
$\frac{\sin\alpha}{\sin\beta}=\frac{v_1}{v_2}=n$ (7.3).`,
  String.raw`Here $n$ is called the **relative refractive index**, the speed ratio for light passing from the first medium into the second.
In this model, keeping the media and the color fixed makes the ratio independent of the angle of incidence, but changing the media or the color does not let us assume the same constant.
It compares the phase speeds of light of the same color on opposite sides of the interface, not a value shared by all waves.
Huygens's (惠更斯) wavefront construction therefore gives both the law of refraction and the physical meaning of the relative refractive index:
$n=\frac{v_1}{v_2}$ (7.4).`,
  String.raw`If the angle of refraction $\beta$ is smaller than the angle of incidence $\alpha$, relation (7.3) shows that the phase speed in the second medium is smaller than in the first.
The refracted ray then lies closer to the normal because the slower side advances less during the same time interval, changing the direction of the new wavefront.
Measurements of light speed in water and other transparent media support this connection between speed and refraction, with the comparison still made for the corresponding color of light.`,
  String.raw`Using relation (7.4), we can also express the relative refractive index in terms of the **absolute refractive indices** $n_1$ and $n_2$ of the first and second media and the relative index $n$.
An absolute refractive index uses light speed in a vacuum as its reference, with c denoting that vacuum speed, so for light of the same color the definitions are $n_1=\frac{c}{v_1}$ and $n_2=\frac{c}{v_2}$.`,
  String.raw`Divide the absolute refractive index of the second medium by that of the first, and the common vacuum light speed cancels.
The relative index therefore compares the media in a specified direction, with the second medium's absolute index in the numerator and the first medium's in the denominator:
$n=\frac{v_1}{v_2}=\frac{n_2}{n_1}$ (7.5).`,
];
