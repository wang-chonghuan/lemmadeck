# STEMROBIN-180 Batch58 Independent SOURCE Review

Date: 2026-11-17.
Assignment: fresh independent SOURCE review, 8p physical 140/141/142 only.
Worktree: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

**Verdict: SOURCE fidelity PASS. Revision findings: 0.**
This is not approval of correct physics, answers, modern-course suitability, assembly or publication.

## Scope And Independence

Same existing invocation: no freshness update, setup or backend access. Read the routed IntentFold entry, applicable engineering/product/operations charter and lesson/image rules.

For each page, opened its original full `page.png` before reading its MD, in order 140, 141, 142. Independently compared every printed word, formula, punctuation mark, heading, emphasis span, actual footer and object boundary. Then read the corresponding page JSON and existing audit JSON. The per-block observations were written before reading the author report.

Image budget: **3/8 total**, one original PNG per page, each once. No grids, crops, reopens, other images, physical 143 or prior reviews/old HOLDs. Physical 139 was also not read; no upstream text or lesson identity was invented.

Only this new report and the assigned new scratch observation file were written. No source, code, TOC or other contributor's file was edited. No gate, prepare, finalize, vectorize, assemble, adapt, promotion, DB, browser, git or network command was executed. Existing author receipts were read, not rerun.

## Actual Source Observations

| Physical / Actual footer | All blocks checked | Independently counted printed lines | Existing audit printed/MD | SOURCE |
| --- | ---: | --- | --- | --- |
| 140 / 128 | 12 | 4+1+1+1+2+2+3+1+4+3+1+1 = 24 | 24/24 | PASS |
| 141 / 129 | 11 | 2+2+2+2+2+2+2+3+5+3+1 = 26 | 26/26 | PASS |
| 142 / 130 | 3 | 4+5+1 = 10 | 10/10 | PASS |

The 60 printed lines include the three numeric footers. Footer flanking dots are decoration, not prose or figures. Isolated margin blots are not instructional content. No figures, tables or captions appear on any of these pages.

**Physical 140:** `p0140#1` contains four calculation lines before the centered exercise heading. Uppercase S, subscripts, squaring, multiplication signs, fraction denominators, negative signs, decimals, units and final stops match:

```text
$S_1=\frac{100\,\text{牛顿}\times(5\,\text{秒})^2}{2\times400\,\text{千克}}$
$=3.125$ 米。
$S_2=-\frac{100\,\text{牛顿}\times(5\,\text{秒})^2}{2\times200\,\text{千克}}$
$=-6.25$ 米。
```

`p0140#2` is `练习 20`; `#3-7` are the five printed exercises, with their original question numbers, wording and punctuation. Exercise 3 correctly preserves `利害`, not a modern spelling replacement. Exercise 4 retains 50/80 newtons and `那么` with its surrounding commas; exercise 5 retains masses 40/50 kilograms and force 10 newtons. All preceding calculations and exercises remain **outside the summary**. The incoming `p cont` does not certify the identity or completeness of the unread upstream object.

The summary starts at **`p0140#8`**, the single bold heading `第四章提要　牛顿定律的意义`; prose starts at `#9`. The subsequent kaishu prose is not extra bold emphasis. Its wording about another object's action, acceleration, force magnitude, mutual interaction, inertia and mass matches the source without correction or rewriting.

**Physical 141:** no duplicate title is printed or inserted. All ten prose blocks match the pixels. The three law statements at **`p0141#3/#5/#7`** are each genuinely bold over two printed lines, with the full statements and punctuation inside the preserved Markdown emphasis. Surrounding introductions and explanatory kaishu remain unbolded. The quoted `“线索”`, colon, quoted `“初始条件”`, following em-dash, coordinate/velocity wording and spacecraft example are preserved. No symbolic formula is printed on this page.

**Physical 142:** `p0142#1` continues the spacecraft example and finishes at `计算机进行计算。`. The final block `p0142#2` preserves both colons and the velocity/acceleration/force list with its commas and `等等。`. Its last two source lines are:

```text
速度，作用在物体上的力，等等。当然，牛顿定律可以解决这
些比较简单的问题。
```

The final stop is visible; extensive blank space follows. There is no dangling sentence, new heading, exercise or additional emphasis.

## Continuation And Ownership

| Boundary | Source observation | Current flags | Decision |
| --- | --- | --- | --- |
| Before 140#1 | Calculation tail before exercise heading; left source outside assignment | p cont, not open | Retain; do not invent upstream text/ownership |
| 140#8 | Printed summary heading after exercises 1-5 | h3 | Summary begins here |
| 140#11 to 141#1 | `参照` + `系来描写运动` | p open -> p cont | Complete cross-page word and paragraph preserved |
| 141#10 to 142#1 | `他们` + `还已知` | p open -> p cont | Complete cross-page paragraph preserved |
| 142#2 | Full final sentence, final stop, then blank page remainder | p, not open | Summary closes on 142 |

**Physical 143 is neither needed nor read.** No claim is made about its pixels or the next chapter's content. This review establishes the summary boundary from the assigned source pages, not a new TOC or assembled lesson.

## Existing FIRST Evidence

After completing source comparison and recording the independent ledger, read `source-author-8p140142-b58.md` and only its seven batch-specific prepare/finalize/vectorize call receipts and stdout/stderr streams.

The supplied FIRST record is **24/24, 26/26, 10/10, all exit 0**. Existing audits have 0 figures, 0 normalizations, 0 unknown characters, 0 KaTeX warnings, 0 errata and 0 errors on every page. Read receipts show one recorded prepare and one recorded finalize for each assigned page, all exit 0 with empty stderr. Stream byte counts and hashes match their call receipts.

The batch's **once-only empty-input vectorize** record has exit **0**, with stdout `[vectorize] 0 张通过, 0 张不匹配超限`. This is not evidence that any figure was vectorized. FIRST/once-only invocation history is the supplied author record; the bounded receipts substantiate the recorded calls, not an audit of unrelated command history. The reviewer executed none of these pipeline operations.

The author report's observations and artifact hashes agree with the independently recorded comparison. Its candidate ID is author-provided and was not independently re-resolved through TOC/backend/assembly.

## Hash Binding

Absolute roots:

- A: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-fourth-summary/artifacts/8p/pages`
- W: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-fourth-summary/work/8p/pages`
- C: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands`
- T: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180`

Hashes below were computed from actual local bytes, not copied from the author report. Page MD/JSON content and flags agree, and each actual original-PNG hash matches its MD/JSON render binding.

| Reviewed file | SHA-256 |
| --- | --- |
| W/0140/page.png | aa26604c82c438f2649ec8e6b2701e13d080f3ced0e9a1d3de8ab8657f8073d0 |
| A/0140/page.md | 8ad7a7b3d229c314ba13b18c637a6aa2e047d6cc431f9a857a4ef03ba111a8c0 |
| A/0140/page.json | 2a6afe758235ee9c358862364cfaf661bb25870facb80df5d47339f54912fabd |
| A/0140/audit.json | 37b64a8890e9065e7275c7442e9688b169100972702ef2f40d0cf5d058740b8e |
| W/0141/page.png | aa4204d45f4ca330cf446927de88a589ad74a0b29986687f37c1f78bc50efb9a |
| A/0141/page.md | 07d7d63a8e54eff49a17b23c51b1ce20952f68fda192a73dbe8aa0c0d367ece6 |
| A/0141/page.json | 412b66277a62aefe7cdf9f373624a8a8eae78facfe4d4ee6eeed495dd514daab |
| A/0141/audit.json | e0f3ae7888e9e96c458a95126009ab84af9648234b9668610ed2fe10e58c9425 |
| W/0142/page.png | 901ffea0ef6993143480410278ecac0be758bb2f5c68eba165bf2d18e1277b0d |
| A/0142/page.md | f161952402183de5d87c7cb5998ab5397a86fcea05d0cd356b714dcb326d648b |
| A/0142/page.json | b183055ff7b184e3dc8f3a4e3de6c02dd725797cfda56751d3711b26c98ce4d2 |
| A/0142/audit.json | e15646dfcf4a071258c1df69390986b7612434dae16d423b8322b817102856c4 |
| T/source-author-8p140142-b58.md | 1de952b80959ddfe3a4fcd4e8b80345ceea860046f892208fec100246f2896e4 |
| T/tmp/b58-source-review140142/independent-observations.md | 42b055bd96fa77e7ebe1ea0493c93f2509c19c0986126f139453107f009d2d28 |

The scratch ledger contains all 26 per-block observations, independent line counts, exact formula inventory and pre-author-read disposition. Its hash binds the observations above to the reviewed source snapshot.

Receipt filenames below expand as `C/b58-author140142-<step>.call.json` and matching `.stdout`/`.stderr`:

| Step | Call SHA-256 | Stdout SHA-256 |
| --- | --- | --- |
| prepare-p0140 | 31c64e8975a3fccd86831e6823eaaf040e55f6295ce61bdf736e361ae394b706 | ba6e8272254f0ba7ddae7bfb550d1c8363a81b791275ad8f14906b4044fa8ecc |
| prepare-p0141 | a5fc5c40d6a100bb84223f3b6915704ae17e7a0bc649035bdc021baf47aeaf1e | 0309f8bb78a55dff067b120ad3f3f9844c7855eecbb31bf453726d330bc8bb34 |
| prepare-p0142 | 8c89fbbed3a5a1485884282444f01332c013d3476ec92e655b9c968166d6a066 | b70f9de542624d633af788a4faec375eb9272333aed1b85303ead0773a036900 |
| finalize-p0140 | 8795788a09c1e31700d21de7965502794bd861ee628611ab5538698707cc85fa | f72fbd830d9f4bcccf4c631b85c68de87085100c19cf9d38b6437a804d1d2a3b |
| finalize-p0141 | 2dd2c0ed99294d9fcdf08215e445e5031b9472fd70031f142539863bd90ce2fb | 7c70f4bff1b8b8ca4d018538f12681a6dadd9ec5507ffbe493cf7aca861d9f99 |
| finalize-p0142 | 38c594b45b287e505865e76b7dd5b849ffefcb80fe4dec2acb9503fe1dfef3ab | ce7e8983c5e9af6c92ee655a0d0400618151af141ffe4c14dc61b6af0c6d497a |
| vectorize-passed-pages | b7bed5bc5380b7a361dec797deba7064b017082ac0233123d1798d33028745bb | 81c5cc5d95dd029f0a645ac8c2798e31eb930360f6cccf9b0bc8155302f5129b |

All seven reviewed stderr files are empty, with SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
The declared PDF/profile hashes and DPI were not independently re-derived; the assigned originals themselves were viewed and hashed.

## Disposition

**SOURCE PASS for exactly the bound three-page snapshot.** No source revisions requested. Summary begins at `p0140#8`, closes at `p0142#2`, and contains none of the preceding exercise-20 material. Physics correctness and modern-course approval remain separate and unassessed.
