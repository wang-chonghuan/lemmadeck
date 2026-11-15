# Figure8 Caption Edge Repair

Date: 2026-11-15. Ticket: STEMROBIN-184. Parent-owned tool evidence.

The independent source review found103 caption-ink pixels in the snapped
figure8 envelope. The actual source boundary crop shows that the complete
subfigure a) descender reaches below the top of the separate caption.
A rectangular bottom trim would discard source label pixels. The original
page and failed crop remain in `source-9-10g-p16-p19-initial/`.

## Minimal Tool Change

`figure_crop_exclusion` reuses the already selected component mask.
Only when the snapped envelope intersects foreign ink does it remove that
foreign component and a radius2 edge halo, protecting every owned ink
pixel. `p2c.py` combines this with its existing adjacent-figure exclusion
and records the existing snapped-component ownership fields. No selection
threshold, source box, expected page count or schema was changed.

Hashes at this repair:
- layout.py: `887b464fbf1bf8bef65d6a6070e29475dc01100fa154abf84d69dce82ad18fc7`.
- p2c.py: `691f50adcd8e3e8b72f035ef0f3521c943b03e30f6d57daa099d40d3b16725e1`.
- new test: `5fbe686bc5483cc376092bc0bf70afde2f49cbabfc4e882032613de47358edd1`.

## Executed Verification

Four new positive/negative cases and three current padding cases passed.
The related seven interleaved tests first passed five methods and failed
two methods (ten subcases): those expected copying original scan pixels
into the padding, a behavior replaced by the previously approved white
padding repair. Only their expected margin masks were updated; unchanged
core, original PNG, exclusion and neighbour-halo assertions remain.
Both affected methods then passed. The other five were not rerun.
This report preserves the failure rather than calling the initial suite green.

Actual p16 finalize passed15/15 with both figure boxes unchanged. Numeric
comparison against the failed crop found exactly309 changed raster pixels,
all matching the predicted foreign-caption/halo exclusion; all23601
owned ink pixels are unchanged. The foreign caption contributes103 ink
pixels. Figure9 and figure10 PNGs remain byte-identical.
Current figure8 SHA-256:
`af5d4d076448046993f46b942cdcd2d6ae97cb606cb811e7e9de2eb0df91be6e`.

The separate p17 undercount is already fixed by the documented10c compact-row
repair: the current diagnostic returns20, including the two distinct
footnote bands. No additional counter patch or repeated row test was added.
P17 actual finalize now passes20/20.

Source-profile period normalization changed only69 block-text U+FF0E
characters to ASCII periods across16-19 (11/14/21/23). After that exact
normalization, each complete page JSON is deeply equal to its original.
P18/19 finalize pass26/26 and25/25. Frontmatter, row structure, formulas,
figure boxes and source pixels are unchanged.

The independent reviewer is checking only these affected differences and
the changed figure8 image. This report does not claim that visual verdict,
resolve the source O/0 caveat, complete unit4, assemble or publish.
