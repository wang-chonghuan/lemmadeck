# 10c43/46 Targeted Repair Independent Review

STEMROBIN-184; 2026-11-16.

**Targeted notes/literal-closure verdict: LIMITEDPASS.**
**Separate proposed scan-exclusion metadata verdict: PASS for the three exact boxes only, not applied.**
**Count acceptance: FAIL remains 43=10/12 and 46=13/28; needs algorithm fix.**

## Scope And Bindings

Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
`T` means that workspace's `.intentfold/tickets/STEMROBIN-184/tmp`.
`E` means `T/source-10c-p43-p46-targeted-repair-evidence`.
`D` means that workspace's `ssot-resources/soviet10year-textbooks/artifacts/10c/pages`.
All paths below expand against these exact roots.

Read the readme, ld-s10y-image and ips-chrome-background instructions first, then both reports fully. Independently computed raw SHA-256 values match the supplied bindings:

| Artifact | SHA-256 |
| --- | --- |
| Reused original StageB `T/source-10c-p43-p46-independent-review.md` | `711c6ade6097c9315deb9020882044a041e72bbdafad0bcfa3903af29b069151` |
| Targeted author `T/source-10c-p43-p46-targeted-repair-author.md` | `4df0a4d779be588b163175b36200584cf4bb5dc4131f62b9596124a0346ac804` |
| Targeted author manifest `T/source-10c-p43-p46-targeted-repair-author.manifest.json` | `9e70d8fa6bbc4fdc4120240d8ad119b68deffc6bb7001ca1ea1b8d27431d7ee9` |
| `E/comparisons.json` | `f61a22b58f499d603ef461dbbc25bb52aa32795b02b8c7e7d70a1c908ef53c6b` |
| `E/before.manifest.json` | `ae72fe165cd3d93aaab5f4205823d510b838b3379b224bc92e9dd04f6469b5bf` |
| `E/native-strips.json` | `20aec57bbdf6ff70aceb74dbe6c87d7501c6fe1e80e57e0542ec41d24664f6b3` |
| `E/margin-only-diagnostic.json` | `9bde46a8d4d9d030bd6f925c19f98741ba2ac61fdab978c077035eaed3a33a36` |

This is the sole targeted independent review of the already-applied 43/46 notes and 46 literal closure, plus the three proposed margin boxes. It is not a new full-source, figure, mathematics or counter gate. Other StageB dispositions are reused unchanged, not repeated or reapproved.

## Exact Before/After

Independently read the four complete MD/JSON snapshot diffs: `E/before/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0043/` and `0046/` against `E/after-repair/0043/` and `0046/`. Each diff contains only the changes below. `comparisons.json` records the same two page results and 125 unchanged entries, with no nonidentical entry in that recorded unchanged list; that broader author comparison was not rerun.

| File | Before SHA-256 | After SHA-256 |
| --- | --- | --- |
| 43 `page.md` | `50f7c4130b42a895a23b475c0857ef4f2a8b62c7485bba3af8f8e27b84c29df0` | `647c245e20ba19703352311e8705aa9f1510c6107b686b610b5b2d17eccbd146` |
| 43 `page.json` | `21a53c324d8c7396bb5840cf7e4fdd30fa95fbfb9fe380bb201c7c1dae0048e2` | `d1d1f05b8c7e5f6a7e329008c27027cd565e55c889d27527d9fcc1a464b9dcf5` |
| 46 `page.md` | `9019817988e0ca7ae160aba01e5e3aa7bdca14259deb0d9b3e603e276d1b1a6b` | `d9a8ecadf6bf4ecf27baf42aecb1d0fec8e65980a92b20166ae34e5c6fd00014` |
| 46 `page.json` | `6af9e0918d0ec1f181f8f5720fd13eeb6cf76347394416289dffbd904e568ae8` | `23d7816d779702be27e62bb2d1b830bc66d1d0bd80b18194b2b5dd5190da9d4b` |

The six current durable MD/JSON/audit hashes also matched their frozen after-repair counterparts at this review's read time.

- **43 LIMITEDPASS:** only notes[2] changes, in both MD and JSON: asserted original uppercase T becomes arrow-bearing T/tau-like identity UNKNOWN, with `\vec{T}` explicitly provisional. The body at MD:70 remains `$=\frac{\pi}{2}$`, positive with no added minus or explicit plus. Both body expressions at MD:77 and :79 remain exactly `\vec{T}(2\pi,0)` and `\vec{T}(2\pi n,0)`. The JSON diff confirms the same unchanged body. Positive-sign source support is reused from the bound StageB observation; no new glyph inspection occurred.
- **46 LIMITEDPASS:** only notes[1], last prose open flag and terminal punctuation change, consistently in MD/JSON. MD:77 changes `<!-- p open -->` to `<!-- p -->`; JSON:144 changes `"open": true` to `"open": false`. The final line at MD:85 / JSON:154 retains `$\arcsin a$`, replacing only the following U+FF0C comma with U+002E period outside math. The note now explicitly keeps final a/q identity UNKNOWN and `a` provisional, without inferring it from equation(1). Local sentence/paragraph closure does not declare n85 complete. The period and local-closure source observation are reused from StageB, not newly decoded.

No other body text, mathematics, block order, cont/samerow flag or metadata changes appear in these snapshot diffs. This byte comparison is not a repeated review of their meaning.

## Independent Proposed-Box Review

Exactly two existing images were loaded once each at original detail, in this order; no whole page, reopen, other crop, scaling, enhancement or annotation was viewed:

| Existing strip | Source box `[x,y,w,h]` / native size | Independently matched strip SHA-256 |
| --- | --- | --- |
| `E/p46-right-margin.png` | `[1495,1310,170,385]` / `170x385` | `57306b5fa5854eb8b94af349a35565479de2545f37c489c13db4e0e3c20e5a06` |
| `E/p46-bottom-margin.png` | `[420,2458,1275,70]` / `1275x70` | `6ca914dceb87f49347fc8429bcab08247106e5f4aacfd9fe9af00b696f41cc57` |

`native-strips.json` binds both to the existing original `.tmp/ld-s10y-lesson/10c/pages/0046/page.png`, SHA-256 `ac5fba505b0423e47fac1a89737d5d6e05aa7adcc4daed1022467a83450a5366`, and records exact, unscaled, unenhanced, unannotated native pixel slices. Independently hashed that original without opening it; no reslicing was performed.

| Proposed `scan-artifact` box | Local strip box | Independent visual verdict |
| --- | --- | --- |
| `[1594,1360,11,14]` | Right `[99,50,11,14]` | **PASS.** Only the upper isolated irregular ink speck in otherwise blank margin. No adjacent typeset row, caption, formula, meaningful line or folio; the entire box is marginal noise. |
| `[1589,1554,11,17]` | Right `[94,244,11,17]` | **PASS.** Only the lower isolated irregular ink speck, disconnected from any printed content. The entire box is marginal noise, not punctuation in a body row or a diagram mark. |
| `[492,2468,1153,31]` | Bottom `[72,10,1153,31]` | **PASS.** Sparse dots and a long uneven, broken, shallowly sloping scan-edge trace on blank bottom margin. No text, folio, caption, fraction bar, table rule or meaningful diagram line lies in the box. |

All boxes are wholly inside their bound strips. The right boxes lie outside both frozen figure boxes `[155,261,1288,388]` and `[168,763,1271,302]`. The bottom box starts at y2468, below the retained folio band y2256-2292; the strip itself contains no folio or body. These are actual independent pixel observations, not approval inferred from a guard or count decrease.

**Separate metadata verdict: PASS, proposed-only.** It covers exactly these three boxes for noise exclusion from a counting copy. It neither installs exclusions nor approves any broader crop, body exclusion, count override or count result.

## Remaining FAIL And Limits

The unchanged before/after/current audit SHA-256 values are 43 `8fe17392a54850829bab07f4d99cb1bc92ce7bb24467d4be701c37a5071bbb04` and 46 `96753a7948a9f544e1843ef0459d93636075b91c3ff9859971e50d87a28e1a4e`. Their existing results remain **FAIL 10/12** and **FAIL 13/28**.

The author's existing read-only, guard-accepted 46 probe gives 28 -> 16, not 13. It is author diagnostic evidence only, not independently executed or sufficient for count acceptance. The author records residual single-row fraction/bracket splits on 43 and 46; these require the separately assigned counter worker's algorithm fix, not hiding printed content with exclusions. No counter repair or later result is certified here.

43 T/tau and 46 final a/q remain UNKNOWN. The two newly inspected margin strips contain neither contested glyph, so they cannot resolve those codepoints. All other StageB UNKNOWNs remain frozen; no mathematical expectation, glyph identity, larger-lesson completion or product approval is inferred.

Image budget: 2/8 this batch, 2/24 this context; zero reopens and no further image loads. Wrote only this scratch report. No counter, finalize, validator, stable-tool execution/edit, test, exclusion insertion, durable edit, Git, DB, other-chat or browser action; no other agent's changes reverted. Stop.
