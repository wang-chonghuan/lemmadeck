# D906 FIRST Independent Review

STEMROBIN-181 successor181-3. Sole workdir:
`/Users/yong/.codex/worktrees/00b1/lemmadeck`.

SOURCE239 PASS. RAW208 PASS. SVG208 PASS. Boundary PASS.
No candidate content HOLD findings. Full-card remains HOLD.
This is page/figure source-fidelity review only, not full-card approval,
modern-edition approval, promotion, or permission for another production stage.

## Independence And Source

Original SOURCE239 and native RAW208 pixels were inspected first. The independent
25-row/object/figure inventory was frozen before semantic author files were read:
`frozen-source-inventory.md`
SHA256 `851e3536006077cb5a718520a9eb63b9d870945fa5e143ca273f2f8522806779`.

One reviewer observation correction is preserved separately: frozen row 02 ended
in a period, but closer original-source pixels show a comma after `波动性`.
The candidate's comma is correct. The existing top observation is an exact pixel
crop of SOURCE239 at `[180,175,1200,670]`; its SHA256 is
`d8c1df8c358d7ac011598760a07123e23413ef97dee8062ca69a5369050bd66d`.
The frozen inventory has not been rewritten or silently substituted.

The source has one heading, five paragraphs of 2/6/4/3/8 rows, one figure,
one same-row caption, and footer 229: 25 distinct printed rows. No exercise,
formula, or extra figure is omitted. Heading `横振性` and prose `横向性` remain
distinct. FIRST author and finalized bodies differ only in native figure
geometry and the inserted image link. Finalized MD, JSON, and audit agree.

## RAW And SVG

RAW208 is pixel-identical to original SOURCE239's `[801,1571,498,243]` region.
Both RAW and existing SVG preview retain the oblique plate and thickness edges,
incoming/outgoing rightward beam arrows, full curved rotation indication, and
the far-right eye. Caption, adjacent prose, and footer are absent from the
figure. SVG smoothing does not remove or change any semantic object.

The existing SVG preview was located from `receipts/svg-preview.0001.json`;
its input SVG and output PNG hashes were verified before visual inspection.
Native finalize 25/25 and vector mismatch 0.128% were reused, not rerun.
The mismatch threshold was not used as semantic approval.

## Boundary

SOURCE238 was not read. Its closed-paragraph/no-open incoming fact comes only
from the human instruction. SOURCE239 starts a new `h3`.
Block 6's seven-row `p open` connects internally across figure/caption to
block 9's one-row `p cont`, with `open: false`.

The last content block, independently verified from original pixels, is:

```markdown
<!-- p cont -->
任何其他情况. 但事实并非如此. 光波获得了新的性质！
```

Block 10 is footer `· 229 ·`. No outgoing open. SOURCE240 was not read.
Nothing here establishes whole-unit or full-card completeness.

## Frozen Evidence

All 40 FIRST-manifest entries and the native receipt bindings match their
recorded sizes and SHA256 values. Five snapshot/current output pairs match.
FIRST files and their historical SOURCE/FULLCARD HOLD fields remain untouched.
No failure was overwritten, no candidate was edited, and no native stage
was replayed. Exact evidence hashes and usage are in `review.json`.

FIRST-manifest SHA256:
`09276a7b7cafe330145b2958f38b5674e7c732164ef2d5d1be6aaf2625e2b32d`

SOURCE239 SHA256:
`8bd6943f2ddaffebff87ac8445feeccdadc1b69677446f21097f8e586e014e80`

RAW208 SHA256:
`281febda9ca5414fec7118cc50fcb7e99cefd395e47cbdfa36db7424a57b39d1`

SVG208 SHA256:
`1f796b3dad7a740bd8bc6b051236b7f5c7e341dd5ba2b133d5eb51e4b220bf5e`

Existing SVG preview SHA256:
`bfd1bf0caba6792159eba5bfada6b0ebdb745c413e1c33847403ba2e6ab0ae33`

## Usage And Stop

D906: 4 images in one batch/context, including the existing native crop and
existing source crop; 0 reopens; 0 new crops. Limits 8/batch and 24/context.
D898's prior 7-image usage remains unchanged; known author-plus-review usage
is 11 image loads in separate contexts, not a reset.

Author/content revisions, prepare/finalize/vector/raster reruns, paid/API,
Git/DB/publish/promote/index/assemble/meter/other-chat operations: all zero
for D906. Writes are confined to this review directory. Token usage was not
available and was not inferred. Stop here.
