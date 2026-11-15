# Independent Source Solutions: phy6-c3-s3

Reviewer: Sagan, independent reviewer, not the choice author. Stage: seed-only source solving; all eight written tasks solved before disclosure of any view or key.

Read only this group's `seed.json` and the current choice skill, `references/review.md` and `references/contract.md`. Seed concepts are blocks 1, 2, 9, 19 and 20. All eight exercises have empty `figure_ids`; the seed's `figures` and concept-figure selectors are empty. No figure inspection or prior figure approval substitutes for this source solution. No draft, view, author solution, answer key, previous choice or interaction was read.

Input: `.intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s3/seed.json`.
Actual file-byte SHA256: `dbcba0f5b1a6140d3f4b81c311cc817c6fdc4aa64a4dd1cdc7c55cab5217f116`. This is not a claimed canonical snapshot digest or a source-freshness validation.

## 1. Comparing Pedestrian, Car and Aircraft

Their uniform motions can differ in speed, meaning distance traveled per unit time. In equal positive time intervals, the object traveling farther has the larger speed; for the same positive distance, the shorter travel time means greater speed. This follows from concept 1 and the definition in concept 2.

The previously read modern lesson's opening uses aircraft faster than car, and car faster than pedestrian, as its particular comparison. Vehicle category alone is not a universal speed law, and this seed supplies no individual numerical speeds. A later choice must preserve the distance/time comparison, not reduce the task to recognizing vehicle names.

Open-response loss to record later: producing the comparison and explaining the common-time or common-distance condition in the learner's own words.

## 2. Meaning of Uniform-Motion Speed

Its numerical value is the distance traveled in one unit of time. For example, a value expressed in metres per second tells how many metres are traveled per second under the uniform-motion condition. A number without its length/time unit is incomplete.

Concept 2 concerns the magnitude defined using traveled distance. Concept 20 separately requires direction to characterize velocity. Do not silently replace the course's distance-based magnitude with signed displacement divided by time, or identify speed with total distance irrespective of elapsed time.

Open-response loss: independently explaining the physical meaning of the quantity and its unit, rather than merely recognizing a definition.

## 3. Computing Speed from Distance and Time

For the uniform motion addressed by concept 9, `v = s/t`, where `s` is the distance traveled during the same interval whose duration is `t`, and `t > 0`. Express distance and duration in units consistent with the requested length/time unit. This yields the same speed for any such interval of uniform motion.

If motion is not uniform, the same quotient gives the interval's average speed; it does not determine instantaneous speed. Do not add a requirement that the path be straight merely to compute the distance-based magnitude. Direction remains a separate property.

Open-response loss: constructing the quotient, matching its numerator and denominator to the same interval, and writing the unit without provided alternatives.

## 4. Expressing a Given Speed in km/h and m/s

Both conversion directions are required, not just one example. Since `1 km = 1000 m` and `1 h = 3600 s`,

`1 km/h = (1000/3600) m/s = (5/18) m/s`.

Thus a numerical value in km/h is divided by `3.6` to obtain its value in m/s. Conversely, a value in m/s is multiplied by `3.6` to obtain its value in km/h. Convert both the length unit and the time unit; the physical motion and its direction do not change when units change, although the numerical value does (concept 19).

The written task supplies no particular numerical speed. Do not invent one as a source datum or conflate this general conversion task with one of the numerical exercises below.

Open-response loss: deriving the unit ratio, choosing the correct direction of conversion, and independently producing both equivalent representations.

## 5. Property Needed Besides the Numerical Value

Direction is also needed to characterize the object's velocity (concept 20). Directions must be understood relative to a stated or shared reference, such as an axis or named orientation; a bare positive/negative sign without that convention is not a complete direction specification. The magnitude's unit must also be understood, but a unit alone does not answer the requested additional property.

No image, destination, route or particular compass direction is given here. The answer is the need for direction, not a guessed direction of one of the vehicles.

Open-response loss: independently naming and explaining the directional property rather than selecting its wording.

## g2-1. Raft: 900 m in 20 Minutes

`t = 20 * 60 = 1200 s`.

`v = 900 m / 1200 s = 3/4 m/s = 0.75 m/s`.

The numerator and denominator describe the same reported motion interval. The original wording does not explicitly state uniform motion. The supplied data determine the interval's average speed; they do not prove that the raft travels `0.75 m` in every individual second or that its instantaneous speed is constant. If uniform motion is assumed in the course model, this is also that constant speed. Neither river-current speed nor speed relative to the water can be inferred from these data alone.

Open-response loss: producing the minute-to-second conversion and distance/time computation, and distinguishing the supported interval value from an unsupported constant-motion assertion.

## g2-2. Uniform Cyclist: 9 km in 30 Minutes

`s = 9 * 1000 = 9000 m`; `t = 30 * 60 = 1800 s`.

`v = 9000 m / 1800 s = 5 m/s`.

Uniform motion is explicitly given, so the quotient gives the constant distance-based speed for this motion as well as the interval average. No direction is supplied or needed for this requested numerical magnitude. Both distance and duration must be converted consistently; no extra route or vehicle assumptions are necessary.

Open-response loss: independently organizing two unit conversions, constructing the quotient and presenting the result with its requested unit.

## g2-3. Type 23 Electric Locomotive: 90 km/h

`90 km/h = (90 * 1000 / 3600) m/s = 25 m/s`.

This is a conversion of an already given speed, not an inference of a new speed from an unspecified journey. No acceleration, route, elapsed travel time or uniform-motion assumption is needed to re-express the same quantity. `23` is the contextual model designation, not a distance, time, speed, year or extra calculation input; do not restore a historical name absent from this seed.

Open-response loss: independently deriving and applying the length/time conversion rather than recognizing the final value.

## Handoff Boundary

All eight source tasks are independently solvable with the stated qualifications. Necessary distinctions to retain in later review: conditional fast/slow comparison; distance per unit time; matching `s` and `t`; both unit-conversion directions; numerical value versus physical quantity; direction; all three separate numerical exercises; and the raft's unstated uniformity.

No choice fidelity, redundancy, leakage, option truth set or package-coverage approval is possible before the authorized view is disclosed. Production losses above are obligations to inspect, not a predetermined rejection of recognition tasks. No `review.json` or validation was generated in this source-only stage.

Only this report was written. Exact reviewer model/version, configured reasoning effort and observable token counts are unknown. Stopped awaiting explicit authorization to read the no-key view.
