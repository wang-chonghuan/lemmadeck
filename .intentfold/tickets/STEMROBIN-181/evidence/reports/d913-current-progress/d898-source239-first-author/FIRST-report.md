# d898 SOURCE239 FIRST Author

Ticket: STEMROBIN-181. Successor: successor181-3.
Sole explicit execution workdir:
/Users/yong/.codex/worktrees/00b1/lemmadeck

Sole new-write root:
/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d898-source239-first-author

Original-source offline FIRST production only. SOURCE and FULLCARD gates are
HOLD pending independent approval. Successful native checks below are not
source-fidelity approval or permission to proceed to a full card.

## Preparation And Source

Reused all six existing d892 preparation files byte-exact in root/work/10p/pages/0239.
Each local copy was verified writable. No preparation rerun or source render.
The existing originals were not changed.

Source page.png SHA-256:
8bd6943f2ddaffebff87ac8445feeccdadc1b69677446f21097f8e586e014e80

Independent original-pixel inventory was recorded before page.md authoring:
source-inventory.md
SHA-256: 465f2e50a99dc09e811fffe03b3f91ab3109d3be7dcda364fce1df35dcc469e4

Printed page 229, physical page 239. Heading:
90. 光波的横振性  光的偏振

Original count: 25 horizontal text rows, including heading and footer.
Prose paragraphs: 2 + 6 + 4 + 3 + 8 rows. Caption shares prose row 23.
No formulas, exercises, exercise groups, or exercise-owned figures.
Figure 208 is owned by this section's prose, through its explicit body reference.

Only the supplied incoming238 textual fact was used: last paragraph closes,
no outgoing open. No SOURCE238 image/whole report and no SOURCE240 content
were read. No prior SOURCE239 author candidate was used.

## FIRST Native Production

Author page.md was created via apply_patch once. The pre-finalize author
snapshot is retained separately from normalized/native output:
first/author/page.md
SHA-256: 08cb761fd05969384210771175e972e044c8bf908d2cc9481dbf58b6f2a0b915

Native finalize ran ONCE with the existing p2c.py, book 10p, page 239,
--root set to this root and --work set to root/work, cwd set to the sole R.
Exit code 0: 10 blocks, 25/25 rows, one figure, zero normalization,
zero unknown characters, zero KaTeX warnings, zero errata, zero errors.

Snapped figure geometry: [801, 1571, 498, 243], 18 components.
The FIRST input specified zero crop padding based on the original
slab/caption proximity. No text/figure exclusion or counting override.
The produced crop retains slab face/thickness, incoming and outgoing
rightward ray arrows, curved rotation arrow, and eye, without the caption.

Full receipt, stdout, stderr and audit were saved and FIRST output
snapshots made before vectorization:
receipts/finalize.0001.started.json
receipts/finalize.0001.json
receipts/finalize.0001.stdout
receipts/finalize.0001.stderr
first/finalize/{page.md,page.json,audit.json,fig-208.png}

Finalize receipt SHA-256:
d2b68b23102e1a79b1dd8367b16a4b863fbc8d1841b0c2d586da580ca84a3300

Native vectorize ran ONCE, scoped to book 10p / page 239 and the one
actually owned fig-208 crop. Exit code 0: one pass, zero failures,
native reported mismatch 0.128%. No vectorization replay or figure repair.
The SVG was rasterized once for offline observation, not a pipeline rerun.
Author inspection retained all source diagram objects; this is not an
independent image or source review.

Vectorize evidence:
receipts/vectorize.0001.started.json
receipts/vectorize.0001.json
receipts/vectorize.0001.stdout
receipts/vectorize.0001.stderr
first/vectorize/fig-208.svg
observations/fig-208-first-svg-raster.png
receipts/svg-preview.0001.{started.json,json,stdout,stderr}

Vectorize receipt SHA-256:
5f5cdd1fcfb1702dc03ae46a34c17fb62b0bc9d95cfaea67503ba9e143baf22e

## Candidate Output Hashes

10p/pages/0239/page.md
e6db35dd8d64758bef8bf9dcc7508cc68688a84b343e68754f7d9e5848c46d4c

10p/pages/0239/page.json
9707999f0489d10f4b0a26600a81488e757efa29d7cd6ba7a031c8000671e8c5

10p/pages/0239/audit.json
86084010d4a8d82cab1f4251a862847cea0d3dc96d16146301c3da47b9a8fec5

work/10p/pages/0239/figures/fig-208.png
281febda9ca5414fec7118cc50fcb7e99cefd395e47cbdfa36db7424a57b39d1

work/10p/pages/0239/figures/fig-208.svg
1f796b3dad7a740bd8bc6b051236b7f5c7e341dd5ba2b133d5eb51e4b220bf5e

## Exact Right Boundary

The fifth paragraph's open/cont pair is wholly internal to this page.
It closes here. There is no outgoing open block and no inferred next-page
fact. The last content block is block 9, exactly:

```markdown
<!-- p cont -->
任何其他情况. 但事实并非如此. 光波获得了新的性质！
```

The absolute last block is block 10, exactly:

```markdown
<!-- foot -->
· 229 ·
```

## Usage And Freeze

One author revision. Zero content repairs. Prepare 0, finalize 1,
vectorize 1, source-SVG observation raster 1. Seven images loaded into
one batch and this context; every source crop and the unusable crop
attempt is counted. No reopens. Limits: batch 8, context 24.

The unusable source239-figure-context.png observation was preserved and
not used as source evidence. The four valid original-page observations
and two FIRST figure observations supplied the source/author findings.

Paid/API, Git, DB, publish, assemble, index, meter, canonical writes,
and other-chat operations: all zero. No edits to native tools or other
workers' directories. Temporary native runtime output was confined to
root/runtime-tmp; Python bytecode writes were disabled.

FIRST-usage.json records only this local invocation, not production-meter.
FIRST-manifest.json binds every retained file by path, size and SHA-256.
FIRST snapshots, candidate outputs, receipts and usage are frozen read-only;
the six byte-exact root/work preparation copies remain writable.

Stop here. SOURCE gate HOLD. FULLCARD gate HOLD. Independent approval required.
