# Source-Through42 Wrapper Failure

2026-11-16, STEMROBIN-184. The first actual vectorize42 passed both
source images(0.000% and0.125%). The first official isolated assemble
passed exit0:36 pages,11 source units,118 exercises,23 numbered figures,
two additional tables, errors empty. Its only open tail is p0042#11.

The parent wrapper then failed exit1 before any source promotion or
modern prepare because it incorrectly expected p0042#10. The source
JSON array position is10, whereas assemble.read_pages explicitly uses
one-based reference i+1. This is a local evidence-wrapper expectation
bug, not a source/assembly failure or toolkit defect.

The first scripts, streams, exit records and successful isolated
assembly result remain untouched. The separate promotion-resume script
derives the correct affected reference from the authoritative source
block and the existing one-based reference contract, promotes those
already successful immutable outputs, then performs the previously
unattempted adapt-prepare once. It does not rerun vectorize or assemble,
change source text, change the toolkit, or suppress the first failure.
