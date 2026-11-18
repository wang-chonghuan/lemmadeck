# n32 Four-Figure Author Report

Ticket STEMROBIN-182; sole worktree /Users/yong/.codex/worktrees/d9b1/lemmadeck; declared branch codex/STEMROBIN-182-textbooks. No Git/backend lookup. Only new temporary outputs were written. Current prepared templates, not finalized edition files, supplied complete authoritative text. No answer key was opened or used.

cap1 authored. cap2 draft validation/render and one standalone offline preview check per figure passed. Full previews were observed once by the author, not independently reviewed. Mathematical review, visual independent review, final modern validation and promotion are pending. No pass-review file exists.

| Figure | Source structure | Minimum text px at fixed 640 | Candidate attempts | cap2 | Offline |
|---|---|---:|---:|---|---|
| fig-44 | 4 exact real positions | 32 | 2 | pass | pass |
| fig-45 | a/b/c; 2, 11, 101 scale ticks | 22 | 2 | pass | pass |
| tbl-p0209-02 | 2x5 exact cells | 30 | 2 | pass | pass |
| tbl-p0210-01 | 2x6 exact cells | 30 | 2 | pass | pass |

All figures are instructional deterministic JSXGraph SVG, fixed 640 px scroll media. Offline 360 and 640 px containers preserve that actual media width; both reach the horizontal scroll end. 108 offline assertions checked exact visible values, table cells/lattice dimensions, every rendered scale tick, labels, text size and nonblank raster content. No product app, DB, publisher, deployment, artwork, paid model, dependencies, old chats or agents were used.

## Source Facts

- fig-44: one right-directed line, marked -sqrt(7), 0, sqrt(5), 32/7; no added integer ticks.
- fig-45: three aligned source views of [2,3], with 2/11/101 scale ticks plus a sqrt(5) mark each. a/b/c matches current prose. c retains the entire hundredth-ruled [2,3] interval and exact 2.23/2.24 callout anchors. Tenths labels in c move above the line solely for separation.
- tbl-p0209-02: x | 2.0 | 2.1 | 2.2 | 2.3; x squared | 4.0 | 4.41 | 4.84 | 5.29.
- tbl-p0210-01: x | 2.20 | 2.21 | 2.22 | 2.23 | 2.24; x squared | 4.8400 | 4.8841 | 4.9284 | 4.9729 | 5.0176.

## Real Failures And Repairs

The first candidate of fig-44 and both tables failed the unchanged validator's inline <=352/331 px width requirements. The smallest permitted repair was fixed 640 px scroll layout, not a validator change. fig-45's first render failed one c-root label collision; only its label y changed 163 to 158. Original failed receipts/candidates and fig-45 failed render/SVG/PNG remain intact. Attempt counters were not reset. No source ambiguity or local HOLD was found. No full certification was repeated.

Actual image context use: 8, in two batches of 4 (four originals, then four full current previews), all individually at original detail. No reopens, crops, source grids, PDFs, failed-preview reads, or image payloads in the parent-facing return.

Exact input files/hashes, all current output files/hashes, template bindings, source inventories, declarative contracts, counters and current stages are in /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures-author.json. Unknown independent-review/final-validation/promotion facts are null. Input template hashes remain unchanged from authoring: true.

## fig-44
- spec: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-44/fig-44.spec.json
  SHA-256: 8d55343f10287e54ea8d2e90857ac3aaad9ae0b7849a02973a8e2b518d62f1ec
- svg: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-44/fig-44.svg
  SHA-256: e31549082d53a7e724ea6ca92b65d0cd167d339ba2a5eb83713f0a94561182ea
- render: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-44/fig-44.render.json
  SHA-256: 29149718090aac5d5c792312c19424e4434713df6e28aeca196dc837675127a3
- completePreview: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-44/complete-preview.png
  SHA-256: ffdb054d3729f1194a780b0502d91ce7b24e788f547e5a2ee301582c76204ac6
- offlineHtml: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-44/complete-preview.html
  SHA-256: 66f0ba83c355aa42cd4664d7c938e01297b1c0bd08d7aed9e59010d3c8d34b57
- offlineResult: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-44/offline-preview.result.json
  SHA-256: 8eea525413416f891f8016b499c25bfac0f04bcd9d7b2d5bdfe517fce26a0d16
- Source SHA-256: b8244509cdf733fe7e2ae54d0692cdbb684b35bcf84a70aa1737f7377ef05ab9
- Inventory: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-44/inventory.json; SHA-256: bca274ecc2852c40382656481bfac3078f8f82db69b6b22c3668bd3e19e35b48
- Contract: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-44/contract.json; SHA-256: dbab57ff5e64a6718ac93cb99de79325a48e23f18aacd33e4a2d59b60ee297b8
- Attempt 1 receipt: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-44/attempt-1.receipt.json; SHA-256: 1f22b4cbee55cff2865db61c3a91da08cacce12bd14997388fac9a3e2d9e74fd; draft exit 2; render exit not run.
- Attempt 2 receipt: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-44/attempt-2.receipt.json; SHA-256: d00ad96cdf45dd635c929caeb8aa214702ec9614435d58c0623635b5f4bf773c; draft exit 0; render exit 0.

## fig-45
- spec: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-45/fig-45.spec.json
  SHA-256: 78ae3f40c5cc8fb44acd90176e65ade4d912a52f8139cab30642010b69b8c80e
- svg: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-45/fig-45.svg
  SHA-256: ff1c0fd831ef867db2a38eed4d04fbe8f06dddf15d4d8a1484f2c5be4888db37
- render: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-45/fig-45.render.json
  SHA-256: a2b29a08396d1b2ca16294d86bce872a0b8ffcb5b32ad677f5c6bfae2d13de64
- completePreview: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-45/complete-preview.png
  SHA-256: 2f9ed189ecc49cfcab26d157611d7dcb8039c3ecdfacd5948c9c12289af85611
- offlineHtml: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-45/complete-preview.html
  SHA-256: 304e0f13199b6dedd26d9a79cfc1f536126bc3d36a1fdb5257a9cfd2329fd81b
- offlineResult: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-45/offline-preview.result.json
  SHA-256: 1734b362fe9be00aab4a44f2f2396cc42429ea180a25aeab9ea719ffe2e8de34
- Source SHA-256: b840613b41a3f84fa29c1105cfe2a9b0120856a71734b164ec5bc6852813cbaa
- Inventory: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-45/inventory.json; SHA-256: 86aed3ab3146d8277bd8b0d7ceec26fd9f54766fc038fadf3d692c8c1a33815c
- Contract: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-45/contract.json; SHA-256: 09cd717a0b467c2736966dbfb4eedb7e17d30cb0cde94b52f5b5b18dc9e36a8d
- Attempt 1 receipt: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-45/attempt-1.receipt.json; SHA-256: fb5501423d93800ab46fb91f913aa9e1e2acf036574313074fb6483d44fd625c; draft exit 0; render exit 2.
- Attempt 2 receipt: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-45/attempt-2.receipt.json; SHA-256: 478226ef3b217c743d458fbcf2d4b24b2007746370a81cad13fd0103f356cc20; draft exit 0; render exit 0.

## tbl-p0209-02
- spec: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0209-02/tbl-p0209-02.spec.json
  SHA-256: 6e45782ea928c17bcadbb30eaea7c26ab964639c75ac3859c64b5509d63e32a5
- svg: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0209-02/tbl-p0209-02.svg
  SHA-256: 23cb7c928dec7290848e845813d81ffc2bed93b504f63814f95a17b81bcce022
- render: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0209-02/tbl-p0209-02.render.json
  SHA-256: 58b161866ebcd8ab095201aa279d04e49cf5bf7e2a56a9a21861e4ae2247046f
- completePreview: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0209-02/complete-preview.png
  SHA-256: b3f822fbf16713e622ec0b1fdf6e2d7c1b82dcbdbf4bc083d0425d790c741311
- offlineHtml: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0209-02/complete-preview.html
  SHA-256: 6a4fb947e4609d1c3a3e573481c05c90480bd0ea3b9e688e1b381a60e0e28b9c
- offlineResult: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0209-02/offline-preview.result.json
  SHA-256: 2a01473acd12b23b74e3e2a69577ed8bf9dd2c812fcae8e287895ec658a26802
- Source SHA-256: 13975e4addf1ae5e9bcb809b97fc06c35151a06618de4a3bf83f28dba1edbd9b
- Inventory: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0209-02/inventory.json; SHA-256: 58e2c5fbc743e8051833d5ad02cb7b61d250a412e8b2bb0ef2faa0d60c28c759
- Contract: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0209-02/contract.json; SHA-256: 197b2be18ccdf11f80f39f58a4dc138e743aa77b974bbdadbc4a8fc0295d75f1
- Attempt 1 receipt: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0209-02/attempt-1.receipt.json; SHA-256: 1e7746159d215fd9f0d997bec4f6596b844ebc67e165ffd2d6a420d4dd195929; draft exit 2; render exit not run.
- Attempt 2 receipt: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0209-02/attempt-2.receipt.json; SHA-256: aa6c9e0464c3fb008e3610e843002b243b10a92147040e00333f3d3383cb7cdf; draft exit 0; render exit 0.

## tbl-p0210-01
- spec: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0210-01/tbl-p0210-01.spec.json
  SHA-256: 5966c25f6847d7ff6a60388421ef8a0fc237fbf0a4e8c40e00a3cfbfbcaf8457
- svg: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0210-01/tbl-p0210-01.svg
  SHA-256: 912b0cd9320f57633c8a2de983baaffe85acf682f042c23422d6c0fea95347d6
- render: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0210-01/tbl-p0210-01.render.json
  SHA-256: 5d3933c50acba1cf0ea051b32a8281990efcafe91506796e94b13c663d1679cb
- completePreview: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0210-01/complete-preview.png
  SHA-256: 15c7d7aa9910fc5c8b461eaedecd9a08b8fb830b688cabe048dc586525611b94
- offlineHtml: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0210-01/complete-preview.html
  SHA-256: b2bf9843ca7ae3a84769080719ce952bb599135d7336a46e7fdc3244bd566659
- offlineResult: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0210-01/offline-preview.result.json
  SHA-256: bd1dc512c25c9f72d808cdb1f61523fc98439fdf31213d757b1f10c34dbdc800
- Source SHA-256: a8baa0e88ef55f5bd2e335f8e88d7acb3378cf348bf75a963195f13d9e0e014d
- Inventory: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0210-01/inventory.json; SHA-256: 54b161c88fc956331b0208e550ac1dbf1f82ecabe2651d1d71d3d8e5703a942b
- Contract: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0210-01/contract.json; SHA-256: 00dd2d25226329627db6632573397353cda1a33655c1c82838cefe9df0fb7821
- Attempt 1 receipt: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0210-01/attempt-1.receipt.json; SHA-256: 9b9226b19308e08d1089816de4e17454bff6eb514e01a76945779906c9161255; draft exit 2; render exit not run.
- Attempt 2 receipt: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/tbl-p0210-01/attempt-2.receipt.json; SHA-256: 93bf856bfe803c0a34900d860c323f3a4f828c3bbca30626bf46a80f474c0070; draft exit 0; render exit 0.
