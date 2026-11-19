# Source 0251-0258 Author Handoff

Work was confined to `/Users/yong/.codex/worktrees/d9b1/lemmadeck`, branch `codex/STEMROBIN-182-textbooks`. Existing user layout/helper/test changes were preserved. No preparation, tests, tool edits, book index edits, assembly, modern figure production, promotion, database, network or publication operation was performed.

Exactly eight source-grid images were viewed, once each at original detail, fresh counter 0 -> 8. No page.png, crop, sibling image, extra figure or reopened image was viewed. Text-only binding resolution added zero image reads.

Every page's FIRST source MD is retained as `page0251.first-source.md` through `page0258.first-source.md`. Every page now has durable `page.md`, `page.json`, `audit.json` produced by its single official finalize call. The failed 0251/0258 outputs remain failed candidates, not approved pages.

| Physical / Printed | MD / Detected Rows | Figures | Exercise Fragments | Calls / Exit |
| --- | --- | --- | --- | --- |
| 251 / 245 | 19 / 20 | 0 | 6 | 1 / 1 |
| 252 / 246 | 11 / 11 | 2 | 2 | 1 / 0 |
| 253 / 247 | 26 / 26 | 0 | 0 | 1 / 0 |
| 254 / 248 | 26 / 26 | 1 | 4 | 1 / 0 |
| 255 / 249 | 24 / 24 | 0 | 2 | 1 / 0 |
| 256 / 250 | 21 / 21 | 0 | 0 | 1 / 0 |
| 257 / 251 | 20 / 20 | 0 | 0 | 1 / 0 |
| 258 / 252 | 21 / 22 | 0 | 3 | 1 / 1 |

Totals: 168 MD rows / 170 detected rows; 3 source figures; 17 exercise block fragments covering 15 distinct printed exercises, 843-857. The fragment total includes both parts of 851 and both page parts of 853. Normalizations: 0 for all eight calls.

## Eight Pages

- **251:** New exercises 843-845, review heading, exercises 846-848, footer 245. Exercise 848 references figure 56 on 252; no figure is present on 251. The original missing-250 technical HOLD is preserved in `binding0251.md`. The direct user's sibling tail confirms 842 complete, then new 843, no artificial `cont`, n41 until 252. `binding0251.resolution.md` records that limited resolution. Durable input matched the frozen original byte-for-byte before first finalize. Exit 1: detected 20 versus MD 19; no missing/false row was invented or diagnosed by another image read.
- **252:** Figure 56 belongs to 848; figure 57 belongs to new exercise 849. Figure 56 contains three labelled straight lines a/b/c on the x/y grid; figure 57 contains two labelled straight lines a/b on the x/y grid. Both captions are separate text. Exercise 850 is complete. Section 12 and n42 begin at printed 246 / physical 252; final prose remains `p open` to 253. Exit 0.
- **253:** `p cont` closes 252's leading n42 paragraph, followed by quadratic-equation examples, definition, coefficients and graph-solving explanation. Figure 58 is referenced but not present. Final paragraph is `p open` after "-4 和 2" to 254. Exit 0.
- **254:** Leading `p cont` closes 253. Figure 58 is prose-owned: parabola y=x^2, line y=8-2x and labelled intersections A/B on the coordinate grid. Its caption shares the row of 851 г), using `samerow`; 851 is explicitly split `open` / `cont` around that caption. Actual wrapped y=x^2 and exercise-852 inequality retain their printed breaks. Exercise 853 is `open` after г), continued on 255. Exit 0.
- **255:** Leading 853 `cont` contains д)/е), then review heading and 854. n43 begins at printed 249 / physical 255. Completing-the-square derivation preserves its two printed rows. Final paragraph is `p open`, ending with 集 in the split word 集合. Exit 0.
- **256:** Leading `p cont` completes 集合 and the {-5,-1} root set. n43 examples 1 and 2 follow. Printed wording "第一项与第二项的和的两倍" is retained despite the adjacent product identity; no silent repair. Tall fractions remain their actual rows. Final `p open` ends "就是说，" to 257. Exit 0.
- **257:** Leading `p cont` closes the example-2 sentence, then the complete displayed square equation. Example 3 preserves the wrapped product identity and two-row completing-the-square equation. Final factored equation is complete and ends with a period; the example continues conceptually on 258 without an invented unfinished formula. Exit 0.
- **258:** Completes n43 example 3 with {-4/3,5}, exercises 855/856 and review exercise 857. n44 "二次方程的根的公式" starts at printed 252 / physical 258. Only opening prose, equation (1) ax^2+bx+c=0 with a!=0, and equation (2) x^2+(b/a)x+c/a=0 are captured. Equation (2) is a complete final printed sentence, but n44 is boundary-only and incomplete in this range. No 259 image was read, and no n44 assembly/promotion was performed. Unidentified upper-margin strokes were recorded without fabricating a figure or text. Exit 1: detected 22 versus MD 21; their relation to that discrepancy is unconfirmed.

## Execution Evidence

Actual official command for each N=251..258, exactly once:

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 7a --page N --root ssot-resources/soviet10year-textbooks/artifacts --books ssot-resources/soviet10year-textbooks/sources --work .tmp/ld-s10y-lesson
```

Execution order: 252, 253, 254, 255, 256, 257, then independent 251 and 258 calls in parallel. Each `finalize025N.start.json`, `.stdout`, `.stderr`, `.receipt.json` is under this owned author directory. Commands, UTC start/finish, exits and stream hashes are in those receipts and in `report.json`. No failed call was repeated.

Exact mismatch strings and preserved-output references are in `finalize-failures.md`. No independent source review has been conducted here; six mechanical passes are not source-content PASS, lesson approval or application approval.

## Hash References

`hashes.json` binds the eight frozen first-source MDs, eight exact grid inputs, 24 durable outputs and 32 execution evidence files with full SHA-256 values. `image-ledger.json` records the visual-open counts separately.

- `report.json`: `6f05b4030ccea1f4ea82d0989d916b9bd65d10da935a97e546e10e2bd3534860`
- `hashes.json`: `da6cfcc51fb8e6e207aec486e8dc9cafbee0e5472861d5840bbc4e7918912bf0`
- `image-ledger.json`: `1264082ece7def725bd6dd698968ff4c917ebedac646534c648dbc6bfd25440b`
- Source PDF identity retained by official finalize: `7a 苏联十年制学校数学教材 代数 七年级.pdf`, SHA-256 `8070c333ee46fb0dc650cb32d4d898f605ed308559b6cc430425d908dae6b052`.

Source figures' exact machine-snapped boxes are in `report.json` and durable audits: fig-56 [200,263,1075,383], fig-57 [198,839,1074,384], fig-58 [206,253,554,1215]. Generated page-local crops remain under the existing matching `.tmp/ld-s10y-lesson/7a/pages/0252/figures/` and `0254/figures/`; none was visually opened.
