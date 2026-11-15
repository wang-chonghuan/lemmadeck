# Source-First Mathematics After Ownership Repair

Author role: STEMROBIN-182-Session-A-5m-n36-author. Model/usage: null.
Lesson identity was derived from book.json: math5-c1-s4-n36, title 图象.
The whitelist projects eleven originals 646--656. No previous answers,
choices, reviewer solutions, source figure specifications or services read.
The pre-repair source record is retained as source-math-before-ownership-resume.md.
Final prepared seed SHA256:
c42762cebc3db695f183216b8f1c4ecccb72d305daf5944501b98abf3f650983.
No draft or view constructed while recording these solutions; no structural or
canonical validation run at this source-first stage.

## Input Boundary and Resolved Ownership Hold

source-input-before-binding-repair.json is an observation snapshot, not a seed.
It preserves the original whitelist prose and projected figure fields.
Original 652 literally references 129图 and original 653 references 130图.
Before parent repair both projected figure_ids were empty. After the authorized
source-only parent promotion the existing prepare tool projects fig-129 for
652 and fig-130 for 653. Comparison confirms all eleven exercise texts are
unchanged, only these two references are filled, and all four actual figure
assets/hashes are unchanged. No original image was reclassified as concept
imagery or an authored new figure.

Before the parent's pause instruction arrived, all four actual SVGs were
rendered completely and opened. Those observations remain saved and reused.
After parent explicitly confirmed source freshness, 652/653 were independently
solved below before constructing any options. No durable file was written.
The prepared seed book trace is
803378cd3f123e03e999552d8b57cf8df4e44a369ae70595ada325abcd6f7056.

Candidate lesson prose contains worked Mia examples rather than a standalone
clean definition, so the planned selection is no-concepts. This is not a claim
that reading graphs requires no mathematics.

## Actual Figures Observed Before Alternatives

All four full white-background renders were opened at 1000 CSS px. Full viewport
dimensions were derived from SVG width/height so neither the right nor bottom
was cropped. The existing Chrome executable was retained with explicit
headless:true, fresh isolated context, PWDEBUG removed before import, automatic
HTML-report opening disabled, network aborted. Browser closed in finally.

Figure 127: horizontal Age (years), vertical Weight (kg), x points right and
y points up. All age marks through 10, weight marks through 35, both arrowheads
and bottom/right labels are intact. Three hollow outlined markers and guide
lines identify ages 6, 8.5, 10. Their weight levels are 19, 24, 31 kg.
The outlined markers are graph reading guides, not exclusion holes in the
weight curve. The first horizontal guide is one minor step below 20, the
second one below 25, the third one above 30; do not snap to labelled fives.

Figure 128: horizontal Time (hours), vertical Distance from home (km).
Every graph corner and the final return at t=9 are visible, along with the
top level 12 and bottom/right axis labels. Broken-line vertices are
(0,0),(2,9),(3.5,9),(4.5,12),(6.5,12),(9,0).
The half-hour corners sit midway between labelled integer hour ticks.
The graph is distance from home, not cumulative walked distance.

Figure 129: full time (minutes) versus water temperature (degrees C) curve.
The rightmost curve endpoint at 70 minutes and 70 degrees, the axis through
90 minutes and its arrow, and bottom unit label are intact. Curve starts at
(0,20), passes through (20,70), and reaches the 100-degree plateau at
28 minutes. Plateau ends at 40 minutes; descending curve crosses 90 degrees
at about 58 minutes. The rising 90-degree crossing is between 25 and 26
minutes. No switch-off, ambient-pressure or phase sensor annotation appears.

Figure 130: time (hours) versus distance (km). Full graph, rightmost (3,180),
all grids and axis/unit labels intact. The two plateaus at 60 and 120 km
run from 5/6 to 1 hour and from 11/6 to 13/6 hours. Adjacent rising pieces
reach cumulative distances 60,120,180. These are levels of cumulative route
distance, not three independently additive distances of those same magnitudes.

Actual source byte SHA256:

- fig-127.svg: b49bf108323d3ec3d1f6f3efd69e73f10fe9343c97afa771f6543c9f9689cb27.
- fig-128.svg: c1ddd57d2a720d5af0fe2d230ac7a34ea5cee7d41eedefba001fff903cc7e94d.
- fig-129.svg: ba8326cb23d9c275b33bc750ebafa684df8b911abbc307a48f29d76e5edee501.
- fig-130.svg: dfc6b2bd0534b073ef194aa5870d3fa75f974564e3f18e76ca29f29511047dbf.

Evidence: source-figure-render.json and figure-previews/.

## 646: All Three Weight Readings

Task: read weight at age 6, 8.5, 10 from the supplied actual curve.
Follow each age vertically to the marker/curve, then horizontally to weight.
The complete ordered readings are 19 kg, 24 kg, 31 kg.
The horizontal units are years and the vertical units kilograms. Reading
20,25,30 would round to labelled major ticks and discard the visible minor
grid/tick information. No interpolation formula outside the requested points
or biological growth assumption is needed.

## 647: Complete Fisherman Graph Task

The written timeline and actual vertices agree: walk 2 h, remain 1.5 h,
walk 1 h, remain 2 h, return during the remaining 9-6.5=2.5 h.
Let t be hours since leaving, 0<=t<=9, and d(t) distance from home in km.

d(t)=

- (9/2)t for 0<=t<=2.
- 9 for 2<=t<=7/2.
- 9+3(t-7/2)=3t-3/2 for 7/2<=t<=9/2.
- 12 for 9/2<=t<=13/2.
- 12-(24/5)(t-13/2)=(24/5)(9-t) for 13/2<=t<=9.

Every adjacent formula agrees at a shared endpoint. Walking speed magnitudes
on the nonhorizontal segments are 9/2,3,24/5 km/h; the last directed slope
of distance-from-home is negative, but walking speed is not negative.

1. At 30 minutes, t=1/2 and d=9/4=2.25 km.
   At 4 h 40 min, t=4+40/60=14/3, which lies on the second stop interval,
   so d=12 km. At t=5.5=11/2, the same interval gives d=12 km.
2. All occurrences of d=8:
   Outward first segment: (9/2)t=8 => t=16/9 h
   =1 h 46 min 40 s.
   Return segment: (24/5)(9-t)=8 => t=9-5/3=22/3 h
   =7 h 20 min.
   The first arrival is 16/9 h; a complete graph-level answer also records
   the later return crossing rather than silently losing it.
3. Distance increases on [0,2] and [3.5,4.5], is constant on
   [2,3.5] and [4.5,6.5], and decreases on [6.5,9].
   These closed interval descriptions express strict monotonicity between
   any two different interior or endpoint times within each interval.
   At a shared corner one does not assign a unique instantaneous slope.
4. Last three hours mean t in [6,9]. From 6 to 6.5 the fisherman remains
   at distance 12 km; from 6.5 to 9 the graph shows the 12 km return.
   Walked distance over that interval is 12 km, not 14.4 km obtained by
   extending the return speed into the half-hour stop.
5. First hour speed=9/2=4.5 km/h. Last hour [8,9] speed magnitude=24/5=4.8
   km/h, although distance-from-home slope is -4.8 km/h.
   From t=5 to 6 the graph is constant at 12 km, so walking speed=0.

The distances and speed interpretation use the written walk/stop/return
account with its given graph; they do not interpret d as total path length
accumulated since leaving. All five original questions are retained in this
source solution; no choice unit has yet been constructed.

## 648: Segment and Both Endpoint Perpendiculars

Task: draw |AB|=3.7 cm and one perpendicular to its supporting line through
each endpoint. A complete realization takes A=(0,0), B=(3.7,0) in cm.

Straightedge/compass construction:

1. Draw AB of length 3.7 cm and extend its supporting line both directions.
2. With centre A and radius AB, the circle meets that line at B and a point
   E on the opposite side of A, with AE=AB. Thus A is the midpoint of EB.
3. Choose equal-radius arcs centred at E and B with radius greater than
   |EB|/2. Join their two distinct intersections. This perpendicular
   bisector of EB passes through A and is perpendicular to AB.
4. With centre B and radius BA, mark F beyond B on the line so BF=BA.
   B is midpoint of AF. Construct its perpendicular bisector in the same
   equal-radius manner; that line passes through B and is perpendicular to AB.

Coordinate equations of the two completed perpendiculars are x=0 and x=3.7.
They are distinct parallel lines, each intersecting AB at the required
endpoint and forming a right angle. No choice of upward ray alone may replace
the requested full perpendicular lines. Free orientation of AB is legitimate;
the chosen horizontal coordinates are a complete realization, not unprinted
source coordinates. Producing the drawing with correct centimetre length and
tools remains different from selecting a construction record.

## 649: Price Equation and Temporal Referent

Let p be the initially common price in dollars per kg. After reductions,
apple price=p-0.20 and pear price=p-0.10. Positive post-reduction prices
require p>0.20. Equal totals give
6(p-0.20)=5(p-0.10)
=> 6p-1.20=5p-0.50 => p=0.70 dollars/kg.
The post-reduction prices are apple 0.50 and pear 0.60 dollars/kg.
Check: 6*0.50=3 dollars=5*0.60.

The prose finally asks "what is the apple price" without expressly saying
initial or post-reduction. All amounts can be determined, so retain the
complete timeline rather than silently selecting 0.70 or 0.50 as a unique
unspecified referent. It also uses per-kg quantities implicitly through the
mass-price comparison; a later view must make the unit explicit. This is a
source wording issue, not grounds to change its numeric data.

## 650: All Equal Initial Container Counts

Let x be the initially common egg count, x an integer and x>=10.
Basket after removal contains x-10; box after addition contains x+20.
14(x-10)=10(x+20)
=>14x-140=10x+200
=>4x=340 => x=85.

Each basket then has 75 eggs, each box 105 eggs. Totals are
14*75=1050 and 10*105=1050. The additions/removals apply to each container,
so the total changes are 140 and 200, not merely 10 and 20. Initially every
box and basket has 85 eggs, satisfying integer and nonnegative constraints.

## 651: Equal Original Silk Lengths

Let L be the common original length in metres, with L>40 so both remainders
are positive. After cutting, lengths are L-10 and L-40.
L-10=2(L-40) => L-10=2L-80 => L=70 m.
Remainders are 60 and 30 m; 60=2*30. The question asks each original length,
not the post-cut remainder; both original pieces measure 70 m.

## 652: All Four Temperature-Graph Tasks

Ownership is now supplied by the repaired original source. Reuse the previously
opened actual fig-129 at its unchanged hash. The horizontal coordinate is
elapsed minutes, the vertical coordinate temperature in degrees C.

1. At t=20 minutes the curve gives 70 degrees C.
2. Reading the depicted 100-degree horizontal segment as the boiling stage
   intended by this heating/cooling diagram, its start is t=28 minutes.
3. The same plateau ends at t=40 minutes, so depicted boiling duration
   is 40-28=12 minutes, not 40 minutes from initial switch-on.
4. The horizontal 90-degree level intersects both branches. On heating the
   crossing is about 25.5 minutes; on cooling it is about 58 minutes.
   The plotted rising cubic between 25 and 26 minutes intersects at about
   25.5051 minutes when evaluated from the actual SVG drawing coordinates.
   This is not a printed exact experimental time. Reporting to nearest
   half-minute gives 25.5 and 58.0 minutes.

Domain visible on the curve is 0<=t<=70 minutes. It increases up to t=28,
is constant on [28,40], then decreases to t=70. The vertical reading at
20 minutes does not depend on any pressure assumption; neither do plateau
start/end or the two intersections as geometric graph statements.

The source asks about boiling but does not expressly specify ambient pressure
or assert that every 100-degree plateau is a phase-change measurement.
Thus 28 minutes and 12 minutes are the task's depicted boiling interpretation,
conditional on identifying that platform with the stated boiling stage.
The graph alone cannot prove actual onset/duration of physical boiling under
all possible pressures/heater behaviours. A choice view may make that
interpretation explicit, but must retain this original physical-model limitation
and must not add an unprinted pressure as though it were source data.
Approximate crossing precision is also made visible, not silently exactified.

## 653: All Four Train-Graph Tasks

Repaired source now binds unchanged fig-130. Let t be hours from departure
and S(t) cumulative distance in km, with 0<=t<=3.
Actual vertices:
(0,0), (5/6,60), (1,60), (11/6,120), (13/6,120), (3,180).
All three moving legs have slope 60/(5/6)=72 km/h; both plateaus slope 0.

1. At t=2, the train is on the second plateau, so distance travelled during
   the first two hours is S(2)-S(0)=120 km.
2. First station: from 5/6 h to 1 h, stop 1/6 h=10 minutes.
   Second station: from 11/6 h to 13/6 h, stop 1/3 h=20 minutes.
3. Successive moving-leg increments are 60-0=60,120-60=60,180-120=60 km.
   The three consecutive interstation distances are each 60 km, not
   60,120,180 km. Departure and final station are included as the ends of
   this complete successive-leg record; no invisible additional station added.
4. Average over the full elapsed three-hour journey, including stops:
   180/3=60 km/h.
   Total moving time is 3-(1/6+1/3)=5/2 h, so 180/(5/2)=72 km/h is the
   average while moving, not the requested whole three-hour average.

The source's train graph is a monotonically accumulated route distance with
flat stops. No arbitrary unseen reversal, extra stopping time, or extrapolated
point beyond t=3 is introduced.

## 654: Both Equations and Original Substitution

1. -3.2k-4.8=-2(1.2k+2.4)
   =>-3.2k-4.8=-2.4k-4.8
   =>-0.8k=0 => k=0.
   Original substitution gives -4.8=-2*2.4=-4.8.
2. -5(0.8y-1.2)=-y+7.2
   =>-4y+6=-y+7.2
   =>-3y=1.2 => y=-0.4.
   Check left: -5(-0.32-1.2)=-5*(-1.52)=7.6.
   Right: -(-0.4)+7.2=7.6.

Both are unique real roots since final coefficients -0.8 and -3 are nonzero.
No restriction on variables or variable denominator occurs.

## 655: Both Shelf Counts Before and After

Let the second shelf initially have x books, the first 3x, x a nonnegative
integer and 3x>=8. After changes: first 3x-8, second x+5.
The second is now 17 less than the first:
(3x-8)-(x+5)=17 =>2x-13=17 =>x=15.
Initial first=45 and second=15 books.
Afterward first=37 and second=20, with 37-20=17.
The original reference to books on each shelf includes the initial unknowns;
keeping both time states prevents returning altered counts as original counts.

## 656: Green Area per Resident, Exact Units

Total city area=87500 ha. Green share=1/3, so green area=87500/3 ha.
1 ha=10000 square metres, hence green area=875000000/3 square metres.
Population=7000000 persons.
Per-resident area=(875000000/3)/7000000=125/3 square metres per person
=41 2/3 square metres per person.
No rounding precision is prescribed, so keep the exact fraction. The
one-third factor applies to city area before division by population; the
metric hectare conversion is necessary. This is a statistical mean, not a
claim each resident possesses a separate equal plot.
