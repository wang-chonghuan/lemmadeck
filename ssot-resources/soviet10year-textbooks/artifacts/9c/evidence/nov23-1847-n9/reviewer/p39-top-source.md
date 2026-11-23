# p39 top-band independent source inspection

## Frozen verdict

INDETERMINATE: annotation versus scan artifact. No positively identifiable
printed instructional content is visible in the inspected upper margin.
The pixels do not establish that the entire detected band is scan noise.
In particular, the hooked mark described below could be an ink/annotation
fragment or a scan remnant; its origin cannot be determined from this raster.
This report does not authorize excluding the band as an artifact.

## Source binding and scope

- Ticket: STEMROBIN-184; inspection date: 2026-11-23.
- Sole working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
- Original source: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n9-nov23-source3842/9c/pages/0039/page.png`.
- Source SHA-256: `085cb7726695bcee5b28e830e6feb5af349e6435e5b2e18fe5a9f8ed4750717f`.
- Source dimensions: 1695 x 2381 pixels; RGB8 PNG.
- Target: detected top band `[50,57]`, interpreted as inclusive source y coordinates.
- Coordinates below are zero-based source pixels; bounding boxes are half-open
  `(left, top, right, bottom)`.
- Image-batch rules in `.agents/skills/ld-s10y-image/SKILL.md` were read before
  either image was opened.
- Image opens into this context: **2**, original once and native crop once;
  no reopens or other images.
- No candidate raw pages, audit counts, keys, or prior source observations were
  opened before freezing this verdict, or afterward. No body-text or mathematics
  review was performed.

## Native crop

- Crop: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n9-nov23-source3842/p39-top-native-source.png`.
- Bounds: `(0, 0, 1695, 160)`; dimensions: 1695 x 160 pixels.
- Crop SHA-256: `ee3e5b56b7b3c78e3958b294f17cf55b3888422f47048721a7ed18d846c9219f`.
- Native upper-margin crop was necessary to inspect the small marks. No scaling,
  enhancement, thresholding, rotation, or color conversion was applied.
- Generated using Python standard-library PNG chunk handling: original RGB8
  filtered scanlines for y=0..159 were retained byte-for-byte after decompression
  and recompressed with a shortened height. The retained scanline bytes were
  checked for equality. An earlier unavailable-Pillow attempt created no file.

## Exact pixel observations

The entire crop contains only RGB `(0,0,0)` and `(255,255,255)`. The original and
native crop show sparse black marks on a white upper margin, without a legible
text line or discernible instructional diagram. Source-byte decoding establishes
these 8-connected black-mark bounds intersecting y=50..57:

| Source bounds | Native shape observation |
| --- | --- |
| `(227,55,229,58)` | Tiny 2 x 3 pixel speck: one pixel at y=55, two at y=56 and y=57. |
| `(318,48,326,57)` | Compact irregular 8 x 9 pixel blob; full-width black rows at y=51..53, tapering to one pixel at `(322,56)`. |
| `(619,39,629,59)` | Narrow 10 x 20 pixel hooked/stepped mark. Upper stroke starts at `(626,39)`; bars occupy x=620..627 at y=45..47, and x=619..628 at y=55..56. It continues below the target band through y=58. |

All black pixels inside the target band are at the following x positions;
every other pixel in those rows is white:

| Source y | Black source x positions, inclusive ranges |
| --- | --- |
| 50 | 320..325; 625..627 |
| 51 | 318..325; 625..627 |
| 52 | 318..325; 624..626 |
| 53 | 318..325; 624..626 |
| 54 | 320..324; 620..625 |
| 55 | 227; 321..323; 619..628 |
| 56 | 227..228; 322; 619..628 |
| 57 | 227..228; 620..628 |

The spatially isolated specks look artifact-like, but appearance alone does not
prove their physical origin. The longer hooked feature has stroke structure
that prevents a confident all-artifact classification. No readable annotation
can be transcribed, and no instructional meaning can be established.

## Limits

This is only source top-band classification, not a total-count decision or
publication approval. Missing candidate text and any desired count were not
used as evidence. Only the permitted crop and this report were created; no
database, environment, Git, network, dependency, or other content changes were
made.
