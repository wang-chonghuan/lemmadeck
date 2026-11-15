# 9c Physical26--28 Independent Source Review

2026-11-15. Parent reviewer, not source author Aristotle. Delegated under
the existing STEMROBIN-184 authority; no new human instruction claimed.
The complete original PNGs26,27,28 were separately opened, each followed
by its persistent MD, before this continuation. Those observations are
reused, not repeated. Actual table and focused source crops were then
opened to finish this same review.

## Source Fidelity

- P26: PASS25 real rows including folio. Exercise42 continuation retains
  not beginning5, beginning54 and not beginning543. Heading5 and the
  ordered two-element examples retain their order distinction; all12
  printed four-letter pairs are present. The final "可" remains open.
  No correction required.
- P27: PASS26 real rows including folio. Initial "以" closes the prior
  "可" into "可以"; the general question and35-student selection example
  retain35/1190/39270. Equations(1),(2) and1<=m<n, recurrence factor
  n-m and the complete placement proof match the scan. The proof closes
  on this page. No correction required.
- P28: faithful prose/formulas PASS18 outside-table rows including
  folio. Equations(3),(4), the34б reference, m=0/empty arrangement
  convention and0<=m<=n are retained. The actual formula5 crop visibly
  contains lowercase p_n. No normalization to uppercase is authorized.
  No source content correction required; initial mechanical count
  FAIL21/18 remains recorded.

## Actual Table Observation

Opened `.tmp/ld-s10y-lesson/9c/pages/0028/figures/tbl-p0028-01.png`.
SHA256 `0b34204139b6d55244cc648681351dbc07d7c3301ebefe319bb99e42aace94af`.
All outer/diagonal rules, m columns0..5 and n rows0..5 are visible.
The actual nonblank rows are1;1,1;1,2,2;1,3,6,6;1,4,12,24,24;
1,5,20,60,120,120. Empty upper-right cells remain empty. No nearby
prose/caption is included. Exact box[202,1446,1243,508] is unchanged.
This is an unnumbered body table, not an exercise-owned or numbered figure.

## Independently Confirmed Counting Noise

Opened the unchanged source crops under
`tmp/source-author-9c-p26-p28-crops/`:

- `p28-left-noise.png`: isolated irregular blobs/specks, no glyphs or
  table rules. Evidence crop width202 includes the blank separation;
  the narrower exclusion[0,1590,165,270] ends before the tablex202.
  It covers only the two noise bands1634..1673 and1807..1839.
  Crop SHA256 `8fe0b2445a99c52f66a4230721141f0e633a8925b801a220eb47c0287649cb34`.
- `p28-bottom-noise.png`: scan-edge line/specks only, after a blank gap
  below the folio; exclusion[0,2290,1695,91] does not touch content.
  Crop SHA256 `1a96ff3cdf08ba1e297646e4b9f673f0a5e8b979746fcf7d1470048aa3033ac8`.
- `p28-formula5.png`: lowercase p_n confirmed, no erratum inferred.
  Crop SHA256 `11e71bed4ffca38756ff1255c080d1348625473448cf5fbf36dc5793b5aeb44c`.

The two count-only exclusions are independently justified scan-artifact
metadata. They do not delete body/formulas, add expected-count overrides
or change source/table pixels. Initial MD/JSON/audit preserved at
`tmp/source-9c-p28-initial/`. Next action is one finalize for this
metadata-only change; p26/p27 successful checks are reused.

The first metadata finalize rejected the165px left box under the
existing5% left-margin guard, exit1 with count21/18. That snapshot is
preserved at `tmp/source-9c-p28-exclusion-rejected/`. No tool change.
The same actually viewed crop supports a narrower84px box containing
the isolated blobs, with no source ink; rightward specks are left intact.
Only that width/reason is corrected for the next finalize. This is not
a second source review or a mathematical content change.

## Reviewed Initial Snapshot

P26 MD `5702e2eb6a2371cc8bc9cbff65fdbc5f03743830a14e325f094d5ebd236f76f8`.
P27 MD `df30fba555adb15a8c84d56580fea464af783c36fc8c3558209dfbee570d4605`.
P28 initial MD `075ab50721eb8f6fed80ebeddc8b95ea973e03d5c848d74480463ac8dbfc84b8`.
No assemble, adaptation, model service, browser, DB or publisher executed.

## Changed Metadata Result

Narrow84px exclusion plus unchanged bottom exclusion: finalize exit0,
18/18, no errors/normalizations. Structured assertions confirmed that
all blocks, render metadata and table geometry equal the initial JSON.
The assertion command then used an incorrect durable crop path and
exited1 (ENOENT); the actual scratch crop was separately hashed, with
the identical approved SHA256 above. No content assertion failed.

Current p28 MD:
`91aab35f8802917df47f65d51f6bfbee4441c520bbedd6c4ed1c4e199d3ca2b6`.
Current p28 JSON:
`12a4860f51a450a41b98ca79cc150ba762494c0ae119e125072dbab2253a045c`.
Current p28 audit:
`03344bd32be9a338ade01b1103998f332a9cd3156c2ee7576bb1737e49289a78`.
Source fidelity and changed-only metadata confirmation PASS; no
assembly of these newer source pages yet.
