# 7a Physical228-234 Independent Source Review

**HOLD:** actual transcription defect on232; FIRST gates229/233 remain failed.
Offline, finish: review. All operations used the assigned d9b1 checkout; writes only in this reviewer scratch directory.

## Findings

- **P1, p0232#3,738(а), page.md:49:** source `sqrt(2^6*3^4)`; current `sqrt(2^8*3^4)`. Superscript6 at approximately x435-451,y960-982 was misread as8. Current md/json agree on the wrong exponent; FIRST exit0 is not source approval.
- **P2, p0229#5:** source22 rows including footer; detector23. Band[1888,1892] is the final radical's overbar fragment, not missing text; it belongs to the formula band[1907,1982].
- **P2, p0233#7:** source23 rows including footer; detector24.796 has two shared equation rows, not three. Detector splits1348-1491 into[1348,1395],[1396,1443],[1444,1491]; the middle band is not a new equation/text row.

## Settled Source

- **229 example3, p0229#2:** middle numerator is definitively33, not36. Sole crop[520,630,970,775] confirms it. Existing erratum `p0229-math-1` correctly preserves the mathematical source misprint.
- **231/232:** printed labels736/737/738, not786/787/788. Preserve them; numbering-sequence expectation is not pixel evidence. Source positions and block refs are in JSON.
- **229:**21 content rows; example4's `=-7a` is a genuine second row, correctly marked. Tall/nested fractions are single rows. Every source text row is present.
- **233:**22 content rows.793's parallel radicals occupy one row;794 prompt occupies2;795 prompt2 plus subquestions2;796 prompt1 plus systems2;797 occupies3;798 occupies2 and ends completely. No missed source text.
- Original notebook shorthand4.84 on234 omitted the visible trailing0; final pixel reading is4.840, correctly retained. Notebook0:2/15:2 on233 represents rough decimal dots; final readings0.2/15.2 are faithful. No images reopened.

## Boundaries And Figures

- Accepted227 theorem2 open ->228 cont; example2:228->229; example6:229->230;779:230->231; printed736:231->232;791:232->233. All current open/cont markers match.
-233 completes798;234 starts unit38.234 ends `我们利用普通的乘法求 $7.34^2$ 的值：` with p open. Neither227 nor235 pixels were opened.
- **Zero figures independently verified on all7 pages.**233 asks learners to draw graphs but supplies none;234 discusses square tables without printing one. No figure/caption/ownership gap.

## Current Hash-Bound Verdicts

|Physical|Printed|Source rows incl. footer|FIRST exit|Verdict|
|---|---|---|---|---|
|228|222|22|0|passed-unchanged|
|229|223|22|1|source-pass-gate-failed|
|230|224|20|0|passed-unchanged|
|231|225|22|0|passed-unchanged|
|232|226|22|0|source-defect|
|233|227|23|1|source-pass-gate-failed|
|234|228|25|0|passed-unchanged|

Each line below lists SHA256 in `page.md / page.json / audit.json` order. Full absolute paths, image hashes, receipt hashes, per-block physical rows and parity checks are in JSON.

- 228: `484691b5aa1b91f0dbdbbc5418a42929db8e696df938f5064158555d7ba31d9a` / `1829e332f24a8a47f565942413fe0e9d0481644667a36a21de01ed5abf6a71a2` / `777b63078a9b4077533631276cd89c67c9b9c58e523561d47dab6da3d68ce8ea`
- 229: `7b5f86e4fd84245968e9d35900932bde2662a588741226ed7bae1d26d44d7bbd` / `b6631d97cf8fdaac164c8a78a6727fca692f8b240d15e5a10cc6cab12e7a2302` / `d962a29214585c295a4fb5affaa69cb789cfc613d73d9bacc7109882182eb00d`
- 230: `4be1f8553d61064f16b507d50d7ce28ece15c86ce6fcaf0cfc75c9b8d33d4693` / `5ac60ca696dac36c8df2a92cbae84ec138ddb47e8b41f46266fb4296efd0c453` / `bf5fd106aad07636052035f773e562ad93108d7704775f415c1305e8fe18b5ec`
- 231: `20059c209e941ec739177cdfdd0750627a9178031949015bdabae14063588e42` / `1e251902ff193b2897852dc0c38e67ab3e4e387cee82c8a3c64ec74748457c4f` / `3f5d628b4f71aa00694cb3147908f1fc94954313c02511fe640d81dfe249db28`
- 232: `9851c744d025f61cf3d7baa4fc6be00775d448616b769693bcfcc7ebb01be6b7` / `6f33d0d1fa4eda073b0855289e46e6d3a5197558e50429fbd753b1dc1a772492` / `f7ea81656e04ba7325a5e87678dbba58a7dac6ae83670501cf358b2b37c46e29`
- 233: `c3437ddaead9b7c7123d1491f6d5349b82f08c8546458f28f96e26be5a304e4b` / `417d36480642d5441e9a8ec70caa38e75590d7a6560fca1d4a8a45f987591722` / `77f03faaa975364c9757044ccc77be472305dd98c20e1479981191ef613b6eab`
- 234: `71eae7889de57b736283094965aaa560eda2d030be9878e592e5d3c714273c2e` / `dcb3e2e5405d452df9835fcf9f25a1be564885a01a55308bc2df9a7c2b028973` / `d856ae4c700c5eefd085c663bc539f243ed1e0691f0235c19c9d75d86408d0d0`

## Evidence

- `source-observations.md` was saved before target artifacts or author reports were read; its hash binds the independent notebook.
- Visual loads:7 unique grid opens +1 unique crop open =8;0 reopens. JSON binds each grid and the crop.
- All21 current md/json/audit hashes equal the author FIRST report. Existing FIRST receipts and their stdout/stderr hashes were verified in source228-234-author, not stages.
- Passed unchanged:228,230,231,234. Source-faithful but gates failed:229,233. Real content defect:232.
- No source/tool/index/lesson edits, production reruns, retries, assembly, DB, publishers, app, dependencies, git, network, new chats/agents or self approval. Retain FIRST failures; owner-only affected repair remains required.
