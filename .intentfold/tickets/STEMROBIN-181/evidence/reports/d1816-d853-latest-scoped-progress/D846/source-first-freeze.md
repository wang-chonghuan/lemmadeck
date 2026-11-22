# D846 N49 Independent Source-First Solution Freeze

Phase: independent source solving, before creation of choice draft files.
Authority: only D845 whitelist exercise prose and selected unsolved definition
paragraphs. No answer keys, prior choices, interaction specifications, judging,
peer solutions, source pages or image bytes were consulted.

Repository and every execution cwd:
`/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck`

D845 report binding:
`80c4c58ba44225824761a76e25e211878ac09ba6b5f1063087f6c0315a675383`.

## Exact Input Selection

For each locale `zh` and `en`, the input root is
`.tmp/STEMROBIN-181/d1816-d845/<locale>/`.
The four allowed JSON files are `book.json` and
`editions/modern-us-neutral/lessons/phy10-c1-s5-n49/`
`lesson.json`, `exercises.json`, `figures.json`, below
`ssot-resources/soviet10year-textbooks/artifacts/10p/`.

Select original exercise numbers 1 through 8, in their original order.
Every selected exercise has empty `figure_refs` and `figures`.
The original source137 task14 is excluded.
Figures96-98 are inventory-only and remain unapproved; no image is selected.

Select zero-based lesson prose blocks 0, 5 and 12 only:

- Block0 describes obstacle-size versus wavelength, without requiring an image.
- Block5 defines diffraction and identifies it as a wave phenomenon.
- Block12 describes wavefront points as secondary sources, the geometric
  envelope, and the interference of secondary waves. It is unsolved concept
  prose, not a worked exercise; its historical attribution is not new task data.

Blocks1, 6 and 11 refer to specific figures and are not selected. Other
paragraphs are not necessary definition inputs.
No local definition of coherence, extrema, or standing waves is supplied by
these selected paragraphs. Their elementary physical reasoning is stated
explicitly below rather than attributed to nonexistent definition paragraphs.

## Independent Solutions

### Source1: 什么波叫做相干波？

Task: state the defining temporal relationship of coherent waves.
For the sustained harmonic-wave model of this course, coherent waves have the
same frequency and a constant relative phase. Write the phases at a fixed
observation point as `omega1*t + alpha1` and `omega2*t + alpha2`. Their
difference is `(omega1-omega2)*t + alpha1-alpha2`; constancy requires equal
angular frequencies and a stable phase offset. Equal amplitudes, equal speeds,
or coincident crests at just one instant do not establish coherence.
The phase offset need not be zero: nonzero constant offsets are coherent.
No polarization equality is claimed to be part of the coherence definition;
observable interference additionally depends on compatible oscillation
components and overlap.

### Source2: 什么叫做干涉？

Task: define interference, distinguishing persistent enhancement and
suppression from diffraction, reflection and dissipation.
In a linear medium, the disturbance is the sum of overlapping wave
disturbances. For two compatible harmonic components with amplitudes `A1`,
`A2` and relative phase `phi`, the resultant amplitude satisfies
`A^2=A1^2+A2^2+2*A1*A2*cos(phi)`. When the phase relationship is stable, fixed
locations can show persistent enhancement or suppression relative to the
separate wave contributions. This spatially stable superposition pattern is
the sustained interference discussed in this course.
Superposition itself is more general: incoherent waves can have transient
cross terms, but a varying phase washes out the stable interference pattern
under averaging. It is incorrect to define every overlap as a stable pattern,
or to define interference as permanent destruction of the individual waves.

### Source3: 说出干涉图形的最大值与最小值的条件。

Task: state BOTH maxima and minima conditions, not one condition only.
For overlapping compatible harmonic waves of the same frequency, with
positive amplitudes held fixed during the phase comparison, the amplitude
relation above is greatest at `cos(phi)=1` and least at `cos(phi)=-1`.
Consequently:

- Maximum: `phi=2*pi*m`, resultant amplitude `A1+A2`.
- Minimum: `phi=(2*m+1)*pi`, resultant amplitude `abs(A1-A2)`.
- Complete cancellation at that minimum additionally requires `A1=A2`.

Here `m` is an integer. If the two sources start in phase and the waves share
the same wavelength in the propagation model, `phi` is the phase acquired
from the path difference (its sign does not alter the extrema). Then maxima
have `Delta r=m*lambda`; minima have
`Delta r=(m+1/2)*lambda`. For a nonzero source phase offset, it must be included
in the arrival phase; the same path-difference rules cannot be asserted
unconditionally. Unequal amplitudes have a nonzero minimum, not necessarily
a zero minimum. A choice response must retain the general phase rule, the
conditional path rule, and this amplitude distinction.

### Source4: 干涉图形最小值处的波的相互抵消是否表示波的能量转变为其它形式的能？

Task: decide whether cancellation demonstrates energy conversion, and explain
the energy-accounting distinction.
No: destructive superposition alone does not establish dissipation or
conversion to another form of energy. In an ideal linear nondissipative
interference arrangement, interference redistributes the wave field and
energy flow in space rather than serving as an absorption mechanism.
The total field's energy and flux include cross terms; adding independent
wave energies as if the fields had not superposed gives wrong local
accounting. A zero disturbance at a particular location also need not mean
zero total instantaneous mechanical energy there: a standing-wave node can
have elastic energy. Real absorptive media may convert energy to heat, but
that is an additional dissipative mechanism, not a consequence established
merely by an interference minimum.

### Source5: 惠更斯原理如何表述？

Task: give the wavefront construction principle, including both secondary
sources and the next wavefront.
Treat every point on a known wavefront as a source of secondary wavelets.
In the usual homogeneous isotropic illustration, the wavelets advance at
the medium's wave speed. At a later time, their forward envelope supplies
the new wavefront. The principle does not restrict secondary sources to
the original emitter, nor replace the envelope with intersections of
wavelets, nor require physical oscillators to be installed everywhere.
Selected definition block12 also explains that a geometrical envelope alone
does not determine the full amplitude pattern; secondary-wave interference
is needed for the fuller Huygens-Fresnel account. That extension is not
silently substituted for the requested basic principle.

### Source6: 什么叫做驻波？它和传播着的行波有什么区别？

Task: define a standing wave AND compare it with a traveling wave.
For the ideal harmonic model, two waves of equal amplitude and frequency,
with the same wavelength traveling in opposite directions, yield
`A*cos(k*x-omega*t)+A*cos(k*x+omega*t)
 = 2*A*cos(k*x)*cos(omega*t)` after a suitable choice of origins.
A fixed phase offset moves the stationary pattern but does not make it
travel. Its oscillation amplitude depends on position: nodes have zero
disturbance at all times, and antinodes have maximum oscillation amplitude.
The nodes and antinodes do not travel through the medium.
A single traveling wave has a phase pattern that advances with propagation
and carries energy in its propagation direction. For the ideal standing
wave formed from equal counterpropagating waves, opposing energy fluxes
cancel on time averaging: there is no net average energy transport along
the standing-wave direction. This does not say that no energy exists or
that instantaneous local energy transfer is impossible.
Unequal counterpropagating waves generally leave a traveling contribution;
they should not be called this ideal pure standing wave.

### Source7: 驻波相邻波节间的距离比波长小几倍？

Task: determine adjacent-node separation AND the requested factor, with units.
Nodes of `cos(k*x)` occur at `k*x=pi/2+n*pi`; neighboring nodes differ by
`Delta x=pi/k`. Since `k=2*pi/lambda`, their separation is `lambda/2`.
Thus the wavelength is twice the neighboring-node separation: the requested
factor is 2. The wavelength and separation are lengths; their ratio is
dimensionless. `lambda/4` is a node-to-adjacent-antinode spacing, not a
node-to-node spacing. A full wavelength spans two adjacent-node intervals.
No numerical wavelength value is present in the original task.

### Source8: 在什么条件下波的衍射表现得特别明显？

Task: give the wavelength-versus-size conditions, for obstacles and openings.
Diffraction is especially conspicuous when the relevant obstacle size or
opening width is comparable to the wavelength or smaller. Then bending
around the obstacle or angular spreading after the opening significantly
departs from a straight-ray picture.
For a much larger opening or obstacle, a geometrical straight-ray description
is often a useful approximation away from edges; diffraction does not become
exactly absent. For fixed geometry, reducing the wavelength generally makes
relative bending or angular spreading less pronounced, not more pronounced.
This is a condition for conspicuous relative spreading, not a claim that
every observer must detect a strong signal for every illumination and
observation distance. Selected definition blocks0 and5 supply the relevant
size comparison and definition without requiring a concept image.

## Authoring Boundary

No option sets or choice drafts exist at this freeze step.
The next stage may turn these independently established source tasks into
meaningful recognition/judgment units, with explicit conditions in stems
where the source's short question leaves a model implicit.
It must retain both halves of comparison/multi-condition tasks and disclose
loss of free formulation, independent written derivation and construction.
This freeze is an author's independent solution, NOT an independent semantic
review of a future choice draft.

Images opened/generated at D846: 0. Context images: permanently24; budget0.
Source figures96-98 remain inventory-only and unapproved.
