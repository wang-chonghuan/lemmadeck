# Source-Bound Affected Invariants

Scope: STEMROBIN-181 D036, sole finding F221-01. Derived after opening the original fig-221.png as image 1, before reading any current candidate, repair script, render report, or evaluator implementation.

Original image: ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-221.png.

The source's two panels depict the same ground frame at two times. In the first panel the ground and body origins coincide. In the second panel the body's origin moves to the right of ground O; the motion arrow is horizontal. There is no depicted transverse motion of the body or its clocks.

Required affected invariants:

1. Compare positions relative to each panel's ground O, not by raw page coordinates. Panel layout translation is not physical motion.
2. Each clock A and B keeps its own transverse coordinate relative to ground O across the panels. Its horizontal coordinate advances with the body. Both clocks remain at the same transverse level within each panel.
3. The emission event stays vertically above the same ground station C. Its horizontal and transverse offsets relative to ground O are unchanged between panels. The later depiction must not silently move the emission point with the rocket.
4. Ground O and station C in both panels use the same panel-layout translation. The ground OC displacement is unchanged. The moving origin O1 remains on the corresponding ground x-axis.
5. The rocket's later body outline and attached clock/location labels follow the same panel-layout transverse translation as the ground frame. There is no additional vertical translation of the body relative to that frame.
6. Light-path endpoints and segments dependent on changed point references must follow the repaired geometry; no detached endpoint or inconsistent path/label placement may be introduced.

The source does not supply the candidate's numerical design scale. Numerical offsets will be checked later against these independently derived relationships and the frozen FIRST inventory, not inferred from evaluator PASS output.

Only affected frame/body placement was inspected. FIG220 and unrelated FIG221 source content were not re-reviewed. No whole-page source investigation was performed.
