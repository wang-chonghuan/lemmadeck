# Source-first independent solution (frozen)

Reviewer: Codex independent agent, GPT-5-based coding assistant, current chat.
Date: 2026-11-23. Freeze follows source-image viewing at 2026-11-23T00:07:15Z.
Only the four specified page.png images have been opened, in one parallel batch.
No seed, draft, answer, parent source-solution-first.md, or other reviewer output
has been read before this freeze. No claim is made about a prior delegate's actions.

Root for every path below:
/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180

## Image evidence and boundary

- .tmp/ld-s10y-lesson/8p/pages/0156/page.png
  SHA256 5c4b9a4ad8c7e2c9d7940350a3c5d9e572d961fa87a88a207dab3fe50e7bd98f
  Used only for G = 6.67e-11 N m^2 / kg^2, needed by n36 exercise 5.
  No other preceding lesson content or figure is approved.
- .tmp/ld-s10y-lesson/8p/pages/0157/page.png
  SHA256 723f53c1a56a5ae1906e205f261cccb6f5071616372a595f3f44880bb86138dc
  n36 starts at "36. 重力"; preceding exercise-22 tail is excluded.
- .tmp/ld-s10y-lesson/8p/pages/0158/page.png
  SHA256 f9a23b05878086191be10b9d56b51341625f87fe6b54a7ad4f316511b921af8e
  n36 continued: force, acceleration, latitude, rotation/shape approximations.
- .tmp/ld-s10y-lesson/8p/pages/0159/page.png
  SHA256 7ecd16a2efe05710338e56267045153156407a6a61766d25588446dc696aaf52
  n36 concludes with exercise 23, questions 1-5. The n37 heading and text
  are excluded from approval.

## Source physics and qualifications

Gravity here is Earth's attraction on a body, a manifestation of universal
gravitation, directed toward Earth's center. Near the surface,
|F| = GMm/R^2, |g| = |F|/m = GM/R^2, and vector F = m vector g.
At height h, |g| = GM/(R+h)^2. The source explicitly distinguishes measured
latitude-dependent g from the simple spherical, nonrotating approximation;
poles 9.83, equator 9.78, latitude 45 degrees 9.81 m/s^2. It also discusses
local density variation and near-surface uniform-acceleration approximation.
The bold statement is that gravity equals mass times free-fall acceleration.
The source's "cannot apply Newton's second law" in noninertial frames means
the unmodified inertial-frame equation, not a ban on inertial-force methods.
No condition is altered to obtain a desired answer.

## Independent solutions: exercise 23

1. "什么叫做重力?"
   Earth's gravitational attraction on a body; one manifestation of universal
   gravitation. Its direction is toward Earth's center in the source model.
   F = mg describes this force, but it is not the body's force on a support.

2. Difference between equatorial and polar measured free-fall acceleration.
   g_pole - g_equator = 9.83 - 9.78 = 0.05 m/s^2. The equatorial value is smaller.
   Optional relative difference is 0.05/9.83 = 0.005086... (about 0.51%);
   percentage is not required by the original wording.

3. Acceleration at a height equal to three Earth radii.
   Height h = 3R is measured above the surface, not from Earth's center.
   r = R+h = 4R, so g(h) = g0/16.
   Using g0 = 9.83 gives 0.614375 m/s^2; using conventional rough 9.8 gives
   0.6125 m/s^2. About 0.61 m/s^2 is the justified precision.
   The unqualified original does not fix a latitude-specific g0; the ratio
   1/16 is definitive within its spherical approximation.

4. Height above Earth at which gravity halves.
   For the same body, GMm/(R+h)^2 = (GMm/R^2)/2.
   R+h = sqrt(2) R, hence h = (sqrt(2)-1) R = 0.41421356... R.
   sqrt(2) R is the center distance, not the requested height.
   No numerical Earth radius is provided in this n36 exercise; a kilometer
   answer would require explicitly stated R rather than a silently imported value.

5. Mars surface free-fall acceleration.
   Given M = 6e23 kg and radius 3300 km = 3.3e6 m, use the preceding G.
   g = 6.67e-11 * 6e23 / (3.3e6)^2 = 3.674931129... m/s^2.
   Approximately 3.7 m/s^2 (3.67 with extra displayed digits) toward Mars's
   center. The source requests acceleration, not force or an Earth-g ratio.

Independent numerical arithmetic was checked with a local Node expression
containing only the source numbers. No outside source, browser, image crop,
tool-source reading, answer lookup, or product write was used.

Image counts at freeze: 4 unique source images, 4 image view calls, one batch
of four; 0 modern/new images. This file will not be revised after later reads.
