# Independent Source Solution

Ticket: STEMROBIN-180/180-7
Lesson: 8p / modern-us-neutral / phy8-c1-s1-n7
Recorded: 2026-11-23T03:37:21Z
Stage: CHOICE source solving; no answer-book, answer-key, or raw-source review consulted.
Seed digest: 617beaa595a6ab856abc874398df4cb215211f9abfadd879ae4d026228acaa50

The tool selected all three actual written exercises, numbered 1, 2, 3.
Only definition paragraphs 0 (coordinate-time axes) and 9 (coordinate
change per unit time determines velocity) were selected. Worked-example
paragraphs and velocity-time-graph paragraphs were not selected as definitions.

## Actual Figure Reading

Figure 28 source PNG: horizontal axis is time in seconds, labelled -30,
-20, -10, 0, 10, 20, 30; vertical axis is coordinate x in metres,
labelled 1 through 5. A is at (t,x)=(0,3). The solid straight line
rises for positive time; its dashed continuation reaches (-30,0).
The line passes (10,4) and (20,5). The dashed portion is a continuation
to earlier times, not a negative velocity.

The current full browser-rendered modern SVG preserves these readings:
x (m), t (s), A=(0,3), the increasing solid line, the straight dashed
extension to (-30,0), and the 10-second/1-metre tick scales. The right
arrow, positive-time endpoint, bottom time labels, and both unit labels
are visible. No crop or thumbnail was used.

Figure 29 source PNG: vertical axis is coordinate x in metres;
horizontal axis is time t in seconds. All four numbered straight lines
and the unnumbered horizontal dashed line meet at (0,3). Lines 1, 2,
3 have positive slopes, annotated respectively 3, 1.5, 0.5 m/s.
Line 4 has negative slope, annotated -1 m/s, crosses x=0 at t=3,
and reaches approximately (5,-2). The dashed line remains at x=3.
The source graph continues its horizontal dashed line to approximately
t=8; it is not the earlier-time extension in figure 28.

The current full browser-rendered modern SVG preserves the common
(0,3) position, numbered rising lines 1-3, falling line 4, its zero
crossing at t=3, the unnumbered x=3 horizontal dashed line, all four
velocity annotations, and the bottom negative-coordinate ticks.
The right time arrow and the entire bottom annotation band are visible.

## Exercise 1

Task: identify the motion represented by the horizontal dashed
coordinate-time graph in figure 29.

For any two distinct times t_a and t_b on that line,
x(t_a)=x(t_b)=3 m. Hence the displacement is
Delta x=3-3=0 m, and v_x=Delta x/(t_b-t_a)=0 m/s.
The object is at rest at x=3 m throughout the displayed interval.
There is no direction of motion when its velocity is zero.
The nonzero height of the line is a coordinate, not a speed.

Conceptual distinction: a horizontal coordinate-time graph means
constant position, whereas a horizontal velocity-time graph need not
mean rest. The axes here are explicitly x and t.

## Exercise 2

Task: determine the distance between objects 2 and 4 at t=3 s
using figure 29.

Both objects initially have x_0=3 m. The straight lines give constant
signed velocities v_2=+1.5 m/s and v_4=-1 m/s. Therefore:

- x_2(t)=3 m+(1.5 m/s)t; x_2(3 s)=7.5 m.
- x_4(t)=3 m-(1 m/s)t; x_4(3 s)=0 m.
- d=|x_2(3 s)-x_4(3 s)|=|7.5-0| m=7.5 m.

Independent cross-check from the same initial point: object 2 moves
4.5 m in the positive direction while object 4 moves 3 m in the
negative direction, so their separation is 4.5+3=7.5 m.
Equivalently, the relative signed velocity is 1.5-(-1)=2.5 m/s,
so d=(2.5 m/s)(3 s)=7.5 m. Taking the difference of speed
magnitudes would be incorrect because the directions are opposite.

Conceptual distinction: separation is the absolute difference of
simultaneous coordinates; a common nonzero initial coordinate cancels.

## Exercise 3

Task: determine the magnitude and direction of the velocity from
figure 28, with correct axis scales and a nonzero initial position.

Read two labelled-coordinate points on the straight graph:
(t_a,x_a)=(0 s,3 m) and (t_b,x_b)=(20 s,5 m).
Then v_x=(5-3) m/(20-0) s=2/20 m/s=+0.1 m/s.
The straight graph has a constant slope, so the velocity is constant.
Its magnitude is 0.1 m/s, and its direction is the positive X direction.

Cross-check: the graph also joins (-30 s,0 m) to (0 s,3 m).
Its slope is (3-0)/(0-(-30))=3/30=+0.1 m/s.
The position-time law is x(t)=3 m+(0.1 m/s)t.
Using x/t without subtracting the initial coordinate is invalid;
using the geometric angle on the printed page ignores the axis scales.

Conceptual distinction: signed velocity is Delta x/Delta t, not
absolute coordinate divided by elapsed time and not its reciprocal.

## Image Budget And Execution Diagnosis

Images opened in order:

1. artifacts/8p/figures/fig-28.png, original source.
2. artifacts/8p/figures/fig-29.png, original source.
3. .tmp/180-7-n7-choice/fig-28.modern.full.png, first Resvg rendering.
4. .tmp/180-7-n7-choice/fig-29.modern.full.png, first Resvg rendering.
5. .tmp/180-7-n7-choice/fig-28.modern.browser.full.png, complete Chromium rendering.
6. .tmp/180-7-n7-choice/fig-29.modern.browser.full.png, complete Chromium rendering.

Image count: 6; no reopens, crops, or other image views.
The first Resvg outputs were 960x1000 and 960x1280 and returned exit 0
with ok=true, but their lines were absent. They are preserved unchanged.
The SVGs use CSS custom-property stroke colours with fallbacks.
Chromium resolved visible strokes to rgb(21,32,31), or rgb(76,90,88)
for dashed lines, and displayed the geometry. This isolates a Resvg
rendering-compatibility issue; no SVG, spec, or source was changed.
The existing local Playwright/Chromium dependency captured the entire
actual SVG at native 480x500 and 480x640 with device scale factor 2.
The browser was closed in a finally block.

Two earlier directory inventories exited 2: scratch did not yet exist,
and fig-28/fig-29 were initially queried as directories rather than flat
edition figure filenames. The prepare tool created the scratch directory;
the projected manifest supplied the actual filenames. These were path
discovery errors, not content failures, and required no content repair.

## Author Boundary

All three selected written tasks are independently solved here.
No unresolved numerical, unit, direction, or axis convention was found.
This is author reasoning, not independent semantic review evidence.
Choices will be drafted only after this source-solution snapshot exists.
No new figure, answer key, final choice set, publication, or finalization
belongs to this stage.
