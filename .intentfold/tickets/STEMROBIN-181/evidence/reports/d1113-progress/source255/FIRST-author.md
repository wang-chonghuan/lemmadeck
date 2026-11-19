# SOURCE255 FIRST Author

STEMROBIN-181 D036. FIRST candidate, native mechanical pass only; SOURCE approval, consumption and assembly remain parent pending.

All writes are below `.intentfold/tickets/STEMROBIN-181/tmp/d1092-source255-first-author/`. Sole command cwd: `/Users/yong/.codex/worktrees/00b1/lemmadeck`; verified branch: `codex/STEMROBIN-181-textbooks`. Existing invocation reused, with no IntentFold setup/update or ticket-backend calls.

## Actual Three Files

| Native file under `root/10p/pages/0255/` | File lines | SHA-256 |
| --- | ---: | --- |
| `page.md` | 106 | `1439e6045451e46d94061546f28184f0cebe942cd3ea23584828d276e47eb168` |
| `page.json` | 188 | `c0b9a412a5cb1c4c4891af56fb2cfd7a31cd439706f1f437a0f016c42eaa2055` |
| `audit.json` | 47 | `de15e4dcf07721312ec03e80da5069199015c94d2ba1506836667d7c00d29967` |

Frozen pre-finalize FIRST: `first/10p/pages/0255/page.md`, read-only, 77 file lines, SHA-256 `6ca6336444347d1c8fade7b610d5dd9bc3a73444b4307941e5641a17d18ad5df`. Native differences are added provenance/figure metadata, snapped boxes and generated figure references; no authored text changes or content-revision rounds.

`inventory.json` inventories every other owned file, with absolute path, bytes, SHA-256 and file newline count (PNG line counts are not applicable). It also records hashes for the four reused preparation inputs, three incoming textual candidate inputs and native tools. `receipts/native-tools.sha256` retains the ten tool/profile hashes. Inventory does not hash itself.

## Lines And Boundaries

Physical page 255, printed page 245. Prepared unmasked layout has 24 bands. Official masked printed lines = Markdown effective lines = 21; 8 blocks, 0 normalizations, 0 unknown characters, 0 KaTeX warnings, 0 errata, 0 errors.

| Source block | Kind | Body lines | Effective printed lines | Boundary |
| --- | --- | ---: | ---: | --- |
| `p0255#1` | `p cont` | 7 | 7 | Incoming `p0254#7` open; closes at `相同，则两表同步.` |
| `p0255#2` | `fig 图 220` | 0 | 0 | Entire numbered figure |
| `p0255#3` | `cap 图 220 samerow` | 1 | 0 | Same row as block 1 line 7 |
| `p0255#4` | `fig 图 221` | 0 | 0 | Entire pair of subfigures а, б |
| `p0255#5` | `cap 图 221` | 1 | 1 | Independent caption row |
| `p0255#6` | `p` | 7 | 7 | New paragraph; closes at `此，表 A 和表 B 就走得不一样了.` |
| `p0255#7` | `p open` | 5 | 5 | Open tail `同时性的相对性的`, no guessed continuation |
| `p0255#8` | `foot` | 1 | 1 | Two dots and bold italic 245 |

Textual body lines total 22, less one shared caption row = 21. Prose 19, standalone caption 1, footer 1. No headings, exercises, exercise headers, footnotes or standalone formulas.

Incoming SOURCE254 is only the unapproved textual candidate at `d1083-source254-first-author/root/10p/pages/0254/{page.md,page.json,audit.json}`. Its open ending is `让我们较仔细地观察不需任何计算而使表同步的简单方`; this page starts `法.` without inserted punctuation or repeated incoming text. No predecessor approval is claimed.

Unit95 `同时的相对性` continues through the whole page; no heading boundary appears. Only the final-line assertion `由空间隔开的各事件的同时性是相对的.` is bold; the following open tail is regular. Inline mathematical names retain printed italic styling; the footer retains bold italic styling. All prose is source-faithful, with no scientific correction or guessed tail. The prose figure reference retains Cyrillic а (U+0430) and б (U+0431).

## Figure Inventory

Both figures belong to this page's Unit95 prose, not exercises. Block 1 references figure 220; block 6 references figure 221а, б. Page-level figure IDs and separate caption blocks are authored facts; final lesson ownership/assembly is still parent pending. All source ink, labels and arrows are preserved by native crops, not recreated or relabelled.

Figure 220: one right-pointing spacecraft with upper/lower rear fins, two round clock faces (B at the rear, A near the nose), one central flash, and wavy signals extending left and right. The sole frame is labelled K_1, with origin O_1, right X_1 arrow, upward Y_1 arrow and down-left Z_1 arrow; C is marked beneath the flash on the horizontal axis. Separate source caption `图 220` is not baked into the crop.

Figure 221а: one spacecraft, two clock faces, central flash, and A at the front clock; the rear clock has no printed B label in this subfigure. Frames K and K_1 are shown together; Y,Y_1 share the vertical arrow, X,X_1 the rightward arrow, and Z,Z_1 the down-left arrow, with O and O_1 beside the origins and C on the horizontal axis. No wavy signal or velocity arrow is added. The printed а label is included.

Figure 221б: one spacecraft, rear clock B, front clock A, central flash and a wavy signal extending from B through/past the flash. K/O and K_1/O_1 are visibly separated, with their upward Y/Y_1 arrows, rightward X/X_1 arrows and down-left Z/Z_1 arrows; C is marked on the horizontal axis. A rightward velocity vector above the spacecraft retains its vector-over-v label and arrow. The printed б label is included. Both subfigures remain in one fig-221 crop; `图 221` remains a separate caption.

| Figure | FIRST box | Native box | Padding | Native PNG size | Vector mismatch |
| --- | --- | --- | ---: | --- | ---: |
| `fig-220` | 830,230,510,285 | 842,234,481,275 | 12px | 505x299 | 0.012% |
| `fig-221` | 255,640,1090,350 | 265,651,1073,335 | 4px | 1081x343 | 0.017% |

The fig-221 white-edge override prevents the nearby separate caption from entering the crop; no source ink exclusions or counting overrides were used. Both native PNGs were opened once and compared with the already inspected source; no clipping or neighbouring prose/caption was observed.

| Owned native asset under `work/10p/pages/0255/figures/` | SHA-256 |
| --- | --- |
| `fig-220.png` | `6efa1cb41c9e35de3534437d4358533b6b266c372b762e9bbdfe6a91ac56370f` |
| `fig-220.svg` | `4ba10b6914ca634561eca3c469182af8fac39af49f8244adee011f1c61fc1bab` |
| `fig-221.png` | `221ef4d9a5be1251de0a6d42d043a438a3d77c239d949e9b6f9a9ce36a43ae9d` |
| `fig-221.svg` | `718c8110058d6fd5c0e18b57b64a2f739fe1b1919c358488433d93ebc7ac70fa` |

## Receipts And Usage

`receipts/invocations.json` records exact cwd, argv, TMPDIR, output paths and exit codes. Official `p2c.py finalize --book 10p --page 255 --root OWN/root --work OWN/work` ran exactly once after FIRST freeze (exit 0). Native `vectorize.py` ran once per owned PNG, sequentially, both exit 0. Full native JSON receipts retain figure sizes, curve counts, ink/missing/extra pixels, mismatch limits and parameters. No stage failed, no passed producer was replayed, and no dependent stage proceeded through a failure.

The four preparation copies exactly match their input hashes. Source PNG SHA-256: `52428a12f56440dcb408f63772f6a5f1ccccef33ed68e2043b7843c657c041ac`; source PDF SHA-256 retained by native finalize: `7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40`. No prepare replay or whole-PDF copy.

Actual context image opens: 6/8, in order: source PNG, grid PNG, source-only upper crop, source-only lower crop, native fig-220 PNG, native fig-221 PNG. No reopen, adjacent-page image, SVG-context image or image-bearing return. Native vector checks rasterize deterministically without loading images into the author context.

`usage.json` retains call/image counts and remaining holds. External/paid/model/network/DB/publish calls: 0; new dependencies, worktrees, tasks, chats, servers and whole-project checks: 0. One read-only branch identity check; no Git writes. All execution calls have exited; no sessions remain running. SOURCE254/SOURCE255 independent approval, SOURCE consumption and Unit95 closure/assembly remain parent pending.
