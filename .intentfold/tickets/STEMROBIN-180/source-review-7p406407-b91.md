# STEMROBIN-180 C180-4 SOURCE review B91

Verdict: REVISE.
Date: 2026-11-19.
Workspace/cwd: /Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck
Scope: book 7p, physical 0406/0407 (printed 395/396), source extraction only.

This is one substantive independent review of the replacement source draft,
not a production worker or approval of an entire modern lesson. The old B55
interrupted HOLD is neither a content verdict nor approval. No old chat,
subagent or old completed-stage report was read. No internal 1/1 allowance is
treated as a permanent ban on substantive gap recovery.

## Independent Order And Pixel Findings

1. Read only the requested image rules, lesson cap1/recovery contract, and
   ips-chrome-background skill. No browser was opened.
2. Individually opened source page.png for 0406, then 0407.
3. Before any author artifact access, wrote the independent full source text,
   emphasis observations/uncertainty, continuation, question and figure inventory:
   tmp/resume-180-4/source-review406407/source-inventory-b91.md
   SHA-256 979e7992d45d0bf63f2cfa57586edc84d3434381be570873e18d39a607ac7235.
4. Read the two page.md, two page.json and two audit.json files.
5. Actually opened fig-349.png, fig-350.png and fig-351.png individually.
6. Used three additional in-memory pixel crops to resolve emphasis. These
   are additional image reads, not new source assets or regenerated figures.
   The first broad inventory's phrase-level slant observation is refined here
   to the term-level emphasis; do not blindly italicize all of 持续的.

## Page 0406: REVISE

Author page.md lines 49, 53, 88 and corresponding page.json blocks:
the printed narrative emphasis is absent from the plain-text 转动 occurrences,
and the n161 introductory 磁场 emphasis is also absent. The source uses a
distinct slanted/Kai emphasis face for these terms. Encode the original
term-level emphasis with Markdown italics, retaining the ordinary surrounding
text and the already correct **电动机**. The introductory 转动 is not another
bold term. The first inventory's uncertainty about its bold/italic weight is
resolved by the final pixel crop: retain italic/emphasis, not invented bold.
This is a semantic-formatting loss in BOTH page.md and page.json, not a line
count or crop failure.

Confirmed unaffected facts:
- All source prose and all SIX printed questions (1)-(6) are present. No
  detected missing/replaced word; 制做 remains faithful and must not be
  silently modernized to 制作.
- Question labels in JSON are exactly "1" through "6", each cont=false and
  open=false, with printed line lengths 1,1,2,1,2,1. Question (6) retains
  both question marks; question (3) retains the interior period after 磁场.
- Periods, commas, parentheses and question marks preserve the source
  punctuation functions. Chinese transcription width choices are not a new
  punctuation defect. No Chinese full stop has replaced the printed period.
- First p is cont=true/open=false, continuing the preceding discussion; no
  independent claim is made about unviewed 0405.
- The n160 questions close on this page before heading
  161. 电动机及其应用. The heading is h3 and 问题 is exhead.
  Structural heading weight need not be duplicated with literal ** markers.
- n161 begins with an open paragraph ending at 图. The next reviewed page's
  leading 350 correctly completes that reference.
- Printed footer is 395 and appears only as foot; physical page is 406.
- 图349 caption is a separate row, not samerow.
- Existing audit reports 16/16, no errors, zero normalizations. Read only;
  not rerun and not sufficient to approve missing emphasis.

## Page 0407: REVISE

Author page.md lines 77-78 and corresponding page.json block:
the narrative 转动 / 磁场 / 电磁铁 source emphasis is lost. In particular,
the original visibly distinguishes 磁场 and 电磁铁 from their surrounding
upright prose. Restore source term-level italic/emphasis and retain the
already correct **电枢**, **感应器**, *а*, *б*, *в*. Do not turn the whole
sentence italic or make these terms bold.

Confirmed unaffected facts:
- Complete reviewed-page prose is present, including the winding-slot,
  laminated steel, commutator segments, armature, field magnet, carbon brush,
  transport, AC use and advantages passages. No source text was deleted to
  obtain the existing line count.
- Opening p is cont=true/open=false, correctly completing 0406's 图350
  paragraph. There are no questions or a new section heading on 0407.
- The paragraph split around fig350 is p open followed by p cont; joining
  its text reconstructs the full paragraph through 带刷握的碳刷.
- 图350 cap has samerow=true, and really shares the row
  质圆筒上的各线槽内. 这个圆筒是由许. No fabricated extra caption row.
- 图351 has a separate caption row. Its three subletters and prose
  references are the source's Cyrillic а/б/в, codepoints 1072/1073/1074;
  the letters are not Latin a/b/c.
- Parentheses around 图351, б and the source comma after each figure number
  are retained; the cross-line letter reference is not a separate question.
- End paragraph is open=true and ends exactly at 汲, with no invented final
  punctuation or inferred text from unviewed 0408. n161 is NOT complete.
- Printed footer is 396, physical page 407.
- Existing audit reports 21/21, no errors, zero normalizations. Read only;
  not rerun and not evidence that formatting is faithful.
- In both pages, Markdown frontmatter JSON exactly equals page.json.meta.

## Source Crops And Existing Vector Results

All three specified PNG crops were actually opened and compared with their
source page inventory. Crop/source-object checks PASS for the current bytes:
- fig349: entire apparatus, left S/right N, rectangular coil/vertical shaft,
  rotation arrow and dashed detail, lower commutator/brush/contact mounting,
  switch, battery +/-, and connecting leads. No prose or 图349 caption ink.
- fig350: entire motor exterior, front ventilated end, cylindrical housing,
  side detail, top lifting eye, feet/base and right extension. No prose or
  图350 caption ink.
- fig351: one grouped object containing the full armature with both shaft
  ends and commutator (а), field housing/inward poles/eye/base (б), and carbon
  brush/holder/leads (в). All three labels retained. No prose or 图351
  caption ink. A single grouped crop is correct, not three source figures.

Read all three existing SVG files as bytes and checked their current headers/
structure: each has one compound path with evenodd fill, no embedded raster
image. SVG viewport/dimensions match the PNG crops: 572x527, 320x268,
1125x346. This is inspection of existing vector results, not a vectorize run,
new modern drawing, new figure review, or rendered-SVG visual acceptance.
No standalone vectorize stdout/result receipt was found in the authorized
page/candidate directories. That provenance limit is explicit; no old stage
report was opened to fill it and no passed stage was rerun.

## Current SHA-256 Bindings

Paths below are relative to the explicit workspace above. Every listed file
was read and hashed from that workspace. Full absolute paths are in the manifest.

0406:
- source PNG .tmp/ld-s10y-lesson/7p/pages/0406/page.png
  ab4331f43a62927b0ae9c0368c540b90f7ced31959e4bb6eabfaa33223267831
- author page.md .tmp/ld-s10y-lesson/resume-180-4-source/artifacts/7p/pages/0406/page.md
  20670030db2ce2a8d7556c6259e22a7cd8bbccddc5863ff05b8896799ed9b85e
- author page.json (same author directory)
  68e8a587a19fcd331a5e812861409f4ef5845a7161d8151591c11fd6acaae0aa
- author audit.json (same author directory)
  3f8fe135dad4ecd0db3e39d9e4af23c20563abc2d75683358c3e46a64f88499d

0407:
- source PNG .tmp/ld-s10y-lesson/7p/pages/0407/page.png
  e6c5dfd4ec4abb1fe5ffe952c5c810de635e70a3d01ab8cdcb78bd4043495c39
- author page.md .tmp/ld-s10y-lesson/resume-180-4-source/artifacts/7p/pages/0407/page.md
  ed0c92894746b4d25bae20b8d8d39705a148fe926b0ddd6df533b5528727b977
- author page.json (same author directory)
  1e29dad19e4975c4bfddaac606f5b9c6adc352c3d43a2cac4de14ab6e7250a74
- author audit.json (same author directory)
  6582bdcfcc0b6c99c094018c788ad604f5d1ae95e4b75bc771cfa0efa4c7cbf2

fig349 under .tmp/ld-s10y-lesson/7p/pages/0406/figures/:
- PNG 6c299b35332c8c1af75e55cab3b71cd011a3a111ca1a1feeb76ab3724eb9d2a8
- SVG f9b8233f47258ddc994d4d310422b1d2f986b1693c9e68f48074cad3f0ecdc9d
fig350 under .tmp/ld-s10y-lesson/7p/pages/0407/figures/:
- PNG fd984d2d3e29a1217a81e9eadd0e5d126625fd1db5ee686394ae86df42ca5d27
- SVG 45d3248f696a528aadb0e9a457cc15e1ab50ec39ee3bbbdd983c5683fd58caaf
fig351 under .tmp/ld-s10y-lesson/7p/pages/0407/figures/:
- PNG 6680dd766a656928ff38210b604df47bca33c59ee4e04f2c4056e415a1f7c9bb
- SVG 3aaf1263ea5271b19bd0fa87814791670f401ef72e16bffb07512a88d12b5989

Both author render.sha256 fields match the actually opened source PNG bytes.
The PDF hash 46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0
is an author-declared binding only: the PDF was not opened or rehashed.
The profile hash is likewise a declaration, not newly revalidated here.

## Image Budget And Failures

Actual image reads: 8 total, batch budget 8, hard maximum 24.
- #1 0406/page.png, #2 0407/page.png.
- #3 fig349 PNG, #4 fig350 PNG, #5 fig351 PNG.
- #6 0406/page.png ROI [165,185,1175,201].
- #7 0407/page.png ROI [180,684,1190,277].
- #8 0406/page.png ROI [250,1904,1110,68].
The last three were in-memory crops from the same SHA-bound source pages,
with no file writes. No additional image was opened, including SVG screenshots.

Two execution/search failures, neither a scientific result:
1. node_repl sharp import failed before emitting an image:
   Unsupported import specifier "../package.json" in node_repl.
   Only .js and .mjs files are supported.
   Recovered only this failed pixel-read stage using built-in fs/buffer/zlib;
   no installed dependency or environment was changed. Failed call counts zero
   image reads because no image payload was loaded into the context.
2. rg --files --hidden .tmp/ld-s10y-lesson/resume-180-4-source
   -g '*vector*' -g '*349*' -g '*350*' -g '*351*' -g '*finalize*'
   exited 1 with no matches. This was a filename search, not vectorize.
   Existing SVGs were then directly read from the specified source-page paths.
No finalize/vectorize/normalization command was run or failed.

## Write Scope And Approval Limit

Only apply_patch was used to create the independent inventory, this report,
and tmp/resume-180-4/source-review406407/manifest-b91.json.
No author/source file was edited. No Git, DB, env, paid call, network,
dependency installation, browser, new chat or worker was used.

REVISE applies only to the current two source pages and their matching JSON.
Crop PASS does not waive the text-emphasis findings. This report does not
approve a complete modern lesson, external figures 345/346/347/348, unviewed
neighbor pages, assembly, publishing or any other stage. After real revisions,
only affected evidence needs a new hash-bound review under human authorization.
