# Physical27 Extra Row Diagnosis

2026-11-16, STEMROBIN-184. Read-only count diagnosis, not another source
review, a source correction, or an overall page PASS.

Reused Dalton's original-first frozen22 real rows and the retained initial
23/22 failure. Ran `10c-p27-count-diagnostic.py` once through current
production `ink_mask`, `counting_ink` and `line_bands` with current empty
figures/exclusions. No alternate counter, expected override, speculative
mask or second page count was used.

Actual command:

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .intentfold/tickets/STEMROBIN-184/tmp/10c-p27-count-diagnostic.py
```

Exit0 means the diagnostic reproduced the existing23 count and verified
unchanged inputs; it does NOT mean the original page passes its22-row
contract. Complete band/ink geometry and seven input hashes are retained
in `10c-p27-count-diagnostic/diagnostic.json`.

Machine rows1-22 match the22 frozen real rows. Row22 is the21 folio,
y2282-2311. Extra machine row23 is y2471-2491, original ink bounding
box[339,2471,1336,21],1052 ink pixels. No formula subrow or omitted text
is implicated by this location; real high fractions remain single bands.

Actually opened the newly retained direct original-pixel crop
`10c-p27-count-diagnostic/folio-bottom.png`, box[0,2220,1695,320],
SHA2560154cd44b33246b24f5bfef2b11c78598c8740dcc82b0bf11b43c68fc535bf95.
It shows the last exercise's lower edge, then the complete dot21dot folio,
a large blank gap, and the separate broken shallow bottom scan trace.
The extra band is nontext scanner/edge ink, not a third formula, footer or
teaching footnote.

All seven guarded source/failure/PNG/grid/layout/current counter files
were byte-identical before/after. No original input, page audit, body,
expected count or code was changed. The initial23/22 FAIL stays intact.

Candidate existing metadata path, only after sole source review and explicit
parent repair authorization: `scan-artifact`, box[0,2460,1695,40]. This is
inside the observed crop and bottom5% of the2580-high page; the real folio
ends159 pixels above it. It would affect the counting copy only.
No exclusion has yet been registered or applied; no repaired finalize or
review PASS is claimed.
