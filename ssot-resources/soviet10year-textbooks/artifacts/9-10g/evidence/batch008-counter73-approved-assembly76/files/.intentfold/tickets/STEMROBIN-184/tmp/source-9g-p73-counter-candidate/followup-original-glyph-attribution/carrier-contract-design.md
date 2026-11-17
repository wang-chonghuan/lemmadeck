# Accepted Bar Carrier Attribution

The actual source carrier ID19 is not decoration in v4: its original x600-673
component retains a full30px body after the shaft geometry probe. The actual
source test at line_h38 and39 and a genuine bar touching a full glyph already
pass. This is not evidence of an observed source-body deletion.

The new negative attribution contract supplies a genuine accepted fraction
bar touching an independently supported full upper body, with lower body
glyphs elsewhere. A deliberately injected decoration false positive on only
that accepted original carrier makes v4 incorrectly return True, mirrored
and unmirrored. The unchanged real predicate returns False for this fixture.
Both initial injected-contract failures are retained verbatim.

Protect accepted bar-carrier original IDs at rule acceptance. Exclude those
IDs from the original-decoration attribution set even if the independent
decoration predicate misrecognizes them. This establishes explicit precedence
for the accepted genuine bar's residual body. Do not erase any new counting
pixels or change a fraction acceptance predicate, threshold or expected result.

The prior small23px vector-prose control still expects two rows. Its initial
two failures are retained. Baseline eb6, v3 and v4 all return the same four
bands because separate3px arrow shafts survive raw-band joining/filtering.
That pre-existing joining defect is outside this downstream attribution repair.
