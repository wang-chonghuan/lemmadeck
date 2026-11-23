# N10 first candidate source comparison

STEMROBIN-184 / `ana9-c2-s3-n10`, 2026-11-23. One first-candidate comparison only.

Working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

Compared the current raw `page.md` and `page.json` for physical pages 43, 44, 45 against the independent [source-first.md](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/reviewer/source-first.md). The frozen report remains unchanged. Two authorized native-resolution source crops resolved localized p43 transcription questions; refinements of the frozen observations are recorded below, not silently edited into the freeze.

**Result:** one confirmed candidate literal-punctuation discrepancy, in Exercise 78. The p43 wording and punctuation questions specifically identified by the caller are resolved in favor of the current candidate, including `就不能`, absence of an additional `$a$` in the shortest-length-5 sentence, and the comma after `c=9`. No numerical, mathematical-condition, exercise-inventory, physical-wrapping, or figure-presence defect was identified. Other list-separator representation differences are explicitly qualified below rather than turned into unsupported literal findings.

No answer/choice author keys were read. N11 was checked only as a visible boundary and open source fragment, not solved or mathematically reviewed. No candidate or freeze was edited. No DB, `.env`, Git, network, installation, agent, chat, or timer operations were performed.

## Confirmed Candidate Finding

### D1: Exercise 78 changes a sentence stop to a comma

- Source: frozen p45:L15-L16, `随机取出两` / `本. 求它们共值5个卢布的概率.`
- Candidate: `page.md` p45 line 61, `本，求它们共值5个卢布的概率.`
- The same difference is present in p45 `page.json`, JSON pointer `/blocks/5/lines/2`.
- Literal correction: preserve `本. 求`, retaining the existing physical break between `两` and `本`.
- This is a localized punctuation/sentence-boundary discrepancy, not a change to the two-book request, the given prices, or the mathematics. There is no source-math erratum justifying replacement of this printed stop.
- Evidence: the original pre-candidate observation at p45:L16. No p45 replay or crop was needed.

## P43 Local Source Resolutions

These are refinements of the first observation, not instructions to restore its transcription mistakes.

| Location | Frozen transcription | Current candidate | Local source resolution |
| --- | --- | --- | --- |
| p43:L16; candidate md line 72; JSON `/blocks/5/lines/0` | `等于1，不能构成三角形` | `等于1，就不能构成三角形` | Native crop A visibly contains `就不能`. Candidate correct; the freeze omitted `就`. |
| p43:L20; candidate md line 78; JSON `/blocks/6/lines/1` | `如$b=5$，$c=9$，就不能` | Same wording | Native crop A confirms `就不能` also here. Do not change either occurrence to `不能` merely to match the earlier freeze. |
| p43:L21; candidate md line 81; JSON `/blocks/7/lines/0` | `最短的线段的长$a$等于5` | `最短的线段的长等于5` | Native crop A has no intervening `a`. Candidate correct; the freeze supplied a variable not printed in this sentence. |
| p43:L21, immediately after `c=9`; candidate md line 81 | `$c=9$. 这种情` | `$c=9$，这种情` | Native crop A shows the comma-shaped descending mark, matching the comma after `b=7` in the same physical line. Candidate correct; the freeze's period was incorrect. |
| p43:L10; candidate md line 61; JSON `/blocks/2/lines/0` | `1、3、5、7和9` | `1，3，5，7和9` | Native crop B shows comma-shaped separators consistent with the surrounding printed commas. Candidate comma transcription is supported; the freeze's uniform list-mark rendering is not an exact glyph record. All five values and their order agree. |

The source crops, not mathematical preferences, resolve these questions. The native marks after `b=7` and `c=9` in the shortest-length-5 line both have descending comma-shaped footprints; the latter is not the round sentence stop assumed in the freeze. No new image was emitted to inspect these marks again: positional/component checks used the already-opened crop buffer.

### Other List-Separator Differences

The candidate uses `，` where the freeze used `、` in p44:L02 (requested sums), p44:L04 (first-die values), and p45:L02/L05/L08/L11/L17 (letter or number inventories). All members, their order, the final conjunctions, and the physical line boundaries match.

The first observation did not establish a separate certainty claim for the exact typography of each of these separators. The p43 spot check demonstrates that its uniformly transcribed `、` should not be mechanically treated as authoritative evidence that every candidate comma is wrong. Accordingly, the remaining list-mark differences are recorded as transcription-representation differences, not confirmed omissions, mathematical changes, or individually pixel-certified punctuation matches. No additional source page/crop was opened for them. This qualification does not invent absent glyphs or impose a Unicode-recovery/publication gate.

## Text, Mathematics, Tasks, Wrapping

- **p43 Example 1:** ten balls, 3 white / 2 black / 5 red, both requested events, individual-ball equiprobability argument, and printed probabilities `5/10=1/2`, `8/10=4/5` agree. Short LaTeX forms such as `\frac12` are equivalent to the fully braced frozen notation, not altered source values.
- **p43 Example 2:** the five lengths, total `C_5^3=10`, sorted non-strict inequalities, strict triangle condition, distinct-odd-length reasoning, `C_4^2` failure count, successful cases, and printed result `3/10` agree. Candidate `\leqslant` is an ordinary transcription of the visible non-strict notation, not a mathematical discrepancy.
- **p43 formula wrapping:** candidate md line 69 and JSON `/blocks/4/lines/1` preserve `c-b<↵a`. This retains the source break after `<` even though the JSON stores the formula-containing text as one string. The mathematical object stays whole; no source line is lost. The splits after `C_4^2`, `或`, `情`, and `所` also agree.
- **p44 Example 3:** request includes every sum 2 through 12; the joint 36-outcome equal-probability premise, `6 x 6 = 36`, ordered-pair interpretation, and sum-8 probability `5/36` agree. No result for sums 9 through 12 has been fabricated as a literal table row.
- **p44 former author typo:** md line 73 and JSON `/blocks/2/lines/2` now correctly end `第一个2点，第二个6`, continuing with `点` on the next physical line. This matches frozen p44:L11-L12 and the printed ordered pair (2,6). The earlier `第一个6` is not present in the compared candidate.
- **p44 wrapping:** `等概 / 率`, the requested list break after 9, `可 / 能`, `第 / 二个`, `6 / 点`, and `掷 / 出` agree. No extra terminal punctuation is inserted after the request's `概率`.
- **p45 N10 tasks:** all six exercises 74 through 79 are present with their original data and requests. Exercise 77 still selects four distinct balls with all labels odd; it is not rewritten into a solvable three-ball or replacement-draw task. Exercise 78 retains all ten distinct books and the three price multiplicities; D1 is its only confirmed candidate discrepancy. Exercise 79 preserves all eight values and irreducibility, without adding numerator orientation.
- **p45 wrapping/boundary:** six three-line exercise stems remain complete before the `11*` heading; the `随 / 机`, `概 / 率`, `两 / 本`, and `是 / 不可约分数` breaks agree. The spaced `习 题` heading does not change its ownership or text. N11's visible heading and three-line opening are retained as an `h3` and `p open`; no unseen continuation is supplied.
- The `page.md` bodies and corresponding JSON block texts, types, labels, and open/closed states agree for the compared objects. The verified discrepancies/refinements above apply to both formats, not just one.

## Figure Presence and Source Pixels

The frozen inventory expects no instructional figure on p43 or p45 and one unnumbered four-column, six-data-row table on p44 belonging to Example 3. The candidate has exactly that inventory: p43/p45 `figures: []`; p44 one `fig` block and metadata entry `tbl-p0044-01`, label `表`, box `[206,1378,1235,717]`, following the prose table reference.

The actual retained figure is at the raw book-level figure root, not under the individual page directory:

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n10-nov23-source4345/raw/9c/figures/tbl-p0044-01.png`

Figure SHA-256: `7f437a89e35a22a92aca0952032470aa914d6ad494b91a00dec285cfac787dfb`.

It is 1259 x 741 px, with 12 px of padding around the declared 1235 x 717 px table. A read-only decoded-RGB comparison confirmed that its inner rectangle `[12,12,1235,717]` equals the original p44 rectangle `[206,1378,1235,717]` exactly. Thus the actual source table, including its header and printed rows 2 through 7, is retained unchanged. The surrounding padding is not asserted to be an unchanged crop of the scanned paper. The figure was not visually reopened, and no comparison crop file was written.

## Count-Copy Exclusion Identity

Both exclusions are present identically in candidate md frontmatter and JSON metadata. Actual original PNG SHA-256 values still match the prior freeze and each candidate's `render.sha256`; the exclusion reasons name those same source identities.

- **p43:** `[0,2358,1695,23]` on source SHA `68aaea11ea8680a71b77933cd3e667ed56a78935f3edf5572d234ff70deb2428`. It spans the final 23 rows, ending exactly at raster height 2381, below printed folio 36. The frozen original observation identifies this bottom scan-edge ink as noninstructional. This is the same page/bottom-edge identity, not an exclusion applied to another rendering or to the triangle prose.
- **p44:** `[0,1790,60,80]` on source SHA `34cd0bdc00ed4b63df4f92bd321ef9f618f8f67fe68b1165946ad9a8e1385616`. It lies in the isolated left blank scan margin observed in the freeze. Its right edge is x60, strictly left of table x206; even the padded table's left edge x194 is outside the excluded rectangle. The original table's inner pixels are unchanged as independently checked above.

These source-identity and localized non-content judgments use the original observations, hash bindings, and rectangle geometry. They do not turn the caller-reported native audits `25/25`, `15/15`, `24/24` into source approval. No total-count acceptance decision or counter implementation review was performed.

## Bound Candidate Snapshot

Root for the following candidate paths:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n10-nov23-source4345/raw/9c/pages/`

| Relative candidate | SHA-256 |
| --- | --- |
| `0043/page.md` | `d65b4cce911599dba7e6e378dce04b0bc76fb991ccd78ad5b870c4e843b0b368` |
| `0043/page.json` | `e3f79b1720e581dad4b2191ca786055edde4968c9ad7638a6840bf12851e03d6` |
| `0044/page.md` | `c15700319eb4b011d63f103fd6cf930c2a8b15edc1c7ebea0dd35ef0e2b5b456` |
| `0044/page.json` | `c876b4e50c842c813a1654fc1d15e3f0463e3c08f5f075ec023c4cec6bb7db63` |
| `0045/page.md` | `f537f0d77c4ad3121c084bc149a19f832edaf8618ed0876849e1e104693367cf` |
| `0045/page.json` | `7316e95d15fcb1088dce0b857df846abe894693e65592ab879cadf0418e63224` |

The p45 original remains bound to SHA `12a80fa5de28dceda4d993416601bfc2305492376c264db5d650a821ae4ab277`. Source p43/p44 full paths and hashes are already bound in the unchanged freeze; the only additional visual reads below use that same p43 original.

Frozen report identities at comparison:

- `source-first.md`: `a004cbf7e009965d14608697652b275fb6278cace176199816be5ae314413ed4`.
- `source-math.md`: `20a7e58bc2cbdc868ff43b7061f0d860f64d5b62daf6a7972e405a2b4d137712`.

## Actual Additional Image Opens and Stop

Exactly **2** additional images were emitted into context, both native-resolution crops from the bound original p43, held in memory only:

1. Crop A `[150,1410,1260,540]`: shortest-length cases, localized `就不能`, variable-presence, and punctuation questions.
2. Crop B `[150,940,1260,150]`: Example 2 length-list separators and the adjoining stem line.

No full page was replayed, no crop was reopened or resized, and no p44/p45/table image was visually emitted. Failed image-library loading attempts emitted no image and wrote no file. Programmatic image decoding/pixel equality did not load additional image payloads into context. Cumulative visual image opens across freeze and comparison: **5** (3 originals + 2 localized crops).

Only this comparison report is newly written. Stop after this first comparison; no repair, second comparison, answer/choice review, or N11 mathematics is authorized here.
