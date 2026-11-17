# 10c physical 90–93 Source Draft

STEMROBIN-184; same checkout and `codex/STEMROBIN-184-textbooks`.
Status: AUTHOR SOURCE-FIRST DRAFT FROZEN, NOT SOURCE PASS.
Independent source-first review is a separate pending step. No finalize/assembly,
vectorization, edition work, publishing, DB, app, Git mutation or global tests ran.

## Scope And Source

Only this scratch directory and the NEW `10c/pages/0090..0093/page.md` were written.
Targets were absent before authoring; existing unrelated changes were not reverted.
Existing p2c/venv ran prepare once per page with `--work` set to this directory.
PDF: `10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf`.
PDF SHA256: `47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40`.
No other author's transcription/report, durable89, answers or choices were read.

| Physical / Printed | Actual Source Objects |
| --- | --- |
| 90 / 84 | Incoming n93 example-2 paragraph tail; example 3; formulas (5)/(6); figure/caption 44; periodic answer; folio. |
| 91 / 85 | Starred example 4; formulas (7)/(8); figure/caption 45; periodic answer; 习题 / 解不等式：; exercises 294–297 in two paired rows; folio. |
| 92 / 86 | Exercises 298–309; actual heading `94. 解三角方程举例`; two introductory paragraphs; example 1 equation (1), substitution, quadratic; outgoing paragraph fragment; folio. |
| 93 / 87 | Incoming example-1 paragraph and both root cases; examples 2/3/4 with all printed transformations; actual quadratic line wrap; folio. |

No tables or additional figures occur in these four source pages.
Exercises 304/305/306/308/309 have stars; paired rows use `samerow`.
Source print lines, formula numbering, closed/open inequalities and tg/ctg notation
are retained; no inferred solutions or exercise owners were added.

## Boundaries And Source Details

- 90 incoming ownership uses ONLY the authorized89 text tail. It closes that paragraph;
  it does not reconstruct or replace the preceding page's math.
- 92 ends `因而 sin x` (`p open`); 93 starts `=1/2 或 sin x=1/3。...` (`p cont`).
- 93 final quadratic wraps after `+2`, represented by `↵` within the complete formula.
  Final complete sentence: `它的解是 y=2 和 y=1。` No94 source was opened; example4
  completion beyond this boundary remains outside this draft.
- 297 visibly prints `cos ≥ 0.7900` with no visible x; targeted crop confirms the
  source omission. No variable was supplied and no corrected equation was claimed.
- Figure44: three rising solid curves; four long vertical dashed lines plus the
  short π/4 projection; x/y axes, y=1 horizontal line, central thick x-axis segment;
  labels x, y, 0, 1, y=tgx, π/4, π/2. Both marked endpoints have visible hollow
  centers, including π/4 despite the text's non-strict lower bound. Preserve pixels.
- Figure45: three falling solid curves; three long vertical dashed lines plus the
  short π/4 projection; x/y axes, y=1 horizontal line, central thick x-axis segment;
  labels x, y, 0, 1, y=ctgx, π/4, π; small dark π/4 endpoint and hollow π endpoint.
  Figure44/45 coarse boxes exclude their separately transcribed caption lines.
- Z is identifiable; `\mathbf{Z}` records it without asserting exact historical
  font-family reproduction. This is not a blanket semantic HOLD.
- Example3 on93 prints `方程` without 解 and its equation line has no visible terminal
  punctuation. Both details were retained.

## Image Ledger

This author context loaded 8/8 batch images, 8/24 context images. No grids/reopens.
Four initial full originals were followed by four genuinely targeted crops:

| # | Path Under This Directory | Detail |
| --- | --- | --- |
| 1–4 | `10c/pages/0090..0093/page.png` | One original at a time, each opened once. |
| 5 | `crop-p0091-ex297.png` | Original crop box (800,2150,1250,2255). |
| 6 | `crop-p0090-fig44.png` | Original crop box (320,1170,1210,1745). |
| 7 | `crop-p0091-fig45.png` | Original crop box (435,905,1315,1475). |
| 8 | `crop-p0090-fig44-endpoints-4x.png` | Box (790,1440,900,1545), nearest-neighbor 4x; both hollow centers. |

Generated grids/templates/layouts remain scratch and were not image-opened.
`hashes.sha256` freezes four durable drafts, the eight opened image files, and this
handoff, relative to the repository root. Checks are byte/scope checks only, not
source-fidelity approval. Parent return is text/path/hash ONLY; no image payloads.
