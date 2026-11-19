# STEMROBIN-180 7p0406/0407 Affected SOURCE Review B91

Verdict: PASS for BOTH current source pages, limited to the authorized
term-emphasis correction against the completed FIRST pixel observations.
Date: 2026-11-19.
Only workspace/cwd:
/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck

No new image was loaded, decoded, cropped, rendered or displayed.
This is an affected-only review, not another whole-page SOURCE review,
modern-lesson approval, assembly gate or production pipeline.

## Baseline And Method

Compared current author page.md/page.json with the preserved FIRST failures:
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/source406-FIRST-emphasis-failure/
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/source407-FIRST-emphasis-failure/

All six preserved page.md/page.json/audit.json files exactly match their
original FIRST SHA-256 bindings. These are authentic byte-identical baselines,
not reconstructed copies of the revised text.

Applied the five human-authorized old-line/new-line pairs to the FIRST text
IN MEMORY to derive the expected result, then compared with current files:
- MD matches the expected correction byte-for-byte.
- Parsed JSON matches the expected correction in its exact current structure.
- Removing only ASCII * from FIRST/current MD and RAW JSON gives
  byte-identical content. No JSON formatting or other byte churn is hidden
  by the structured comparison.
- Each expected old line occurs exactly once in the FIRST MD and once in
  the FIRST JSON. The revised MD line count is unchanged.

No finalize, normalization or vectorize was run. The author's reported
affected finalize executions were not rerun; the existing audit files
were read and bound directly.

## 0406: PASS

Only page.md lines 49, 53, 88 and their corresponding JSON line strings changed:

```text
49: 框架就得以做持续的*转动*.
53: 则框架也可以做持续*转动*（图 349）.
88: 通电导体在*磁场*中*转动*的现象被用来制做**电动机**. 图
```

These restore precisely the term-level emphasis recorded in FIRST, without
italicizing surrounding 持续的 / 持续 or replacing the existing bold 电动机.
Each MD/JSON adds exactly 8 ASCII stars, representing four italic spans.
MD bytes 2254 -> 2262; JSON bytes 5045 -> 5053.

All other prose, punctuation, six question identities, questions, headings,
footer, block ordering, metadata, flags and figure boxes are unchanged.
Consequently the FIRST-confirmed n160 six-question closure remains valid;
n161 still begins at heading 161, with the introductory paragraph open at 图.
The n160-affecting defects at lines 49/53 are closed for the current bytes.

Audit is byte-identical to FIRST: 16/16, normalizations 0, errors [].
Current Markdown frontmatter exactly matches current page.json.meta.

Current SHA-256:
- page.md 9f7099fd3c1372af9c24b3280cbc205537db799c15112d435ccf1bdade2cd839
- page.json 6e0d58659825e6aa0860e631f1cc61216e4db5f96da6fb75c32dbd9fcdb3be4b
- audit.json 3f8fe135dad4ecd0db3e39d9e4af23c20563abc2d75683358c3e46a64f88499d

## 0407: PASS

Only page.md lines 77, 78 and their corresponding JSON line strings changed:

```text
77: 一组装配起来的电枢. 电枢在其中*转动*的*磁场*，是由一些很
78: 强的*电磁铁*产生的. 电动机的这一部分叫做**感应器**（图 351，
```

These restore precisely the FIRST term-level emphasis, preserving the
existing bold 电枢/感应器 and italic Cyrillic subletters а/б/в.
Each MD/JSON adds exactly 6 ASCII stars, representing three italic spans.
MD bytes 2818 -> 2824; JSON bytes 5167 -> 5173.

All other prose, punctuation, figure references, footer, block ordering,
metadata, flags and figure boxes are unchanged. In particular, the opening
cont, fig350 paragraph open/cont pair, real cap350 samerow, cap351 grouping
and final open paragraph ending at 汲 retain the FIRST-confirmed values.
This is not a claim that n161 is complete.

Audit is byte-identical to FIRST: 21/21, normalizations 0, errors [].
Current Markdown frontmatter exactly matches current page.json.meta.

Current SHA-256:
- page.md a3bf48b45974f72f6cd3a4a08d447013adecf3b8b9b0f02ec319671916982e12
- page.json 8c13b8aa7b83223ca047745df504165346d6fcaab21702662d25a48a382bf12b
- audit.json 6582bdcfcc0b6c99c094018c788ad604f5d1ae95e4b75bc771cfa0efa4c7cbf2

## Unchanged Media And FIRST Evidence

Hashed the files as opaque bytes only; no pixels were loaded or decoded.
Both source page PNGs and all three crop PNGs / three SVGs match FIRST:

```text
0406/page.png        ab4331f43a62927b0ae9c0368c540b90f7ced31959e4bb6eabfaa33223267831
0407/page.png        e6c5dfd4ec4abb1fe5ffe952c5c810de635e70a3d01ab8cdcb78bd4043495c39
0406/fig-349.png     6c299b35332c8c1af75e55cab3b71cd011a3a111ca1a1feeb76ab3724eb9d2a8
0406/fig-349.svg     f9b8233f47258ddc994d4d310422b1d2f986b1693c9e68f48074cad3f0ecdc9d
0407/fig-350.png     fd984d2d3e29a1217a81e9eadd0e5d126625fd1db5ee686394ae86df42ca5d27
0407/fig-350.svg     45d3248f696a528aadb0e9a457cc15e1ab50ec39ee3bbbdd983c5683fd58caaf
0407/fig-351.png     6680dd766a656928ff38210b604df47bca33c59ee4e04f2c4056e415a1f7c9bb
0407/fig-351.svg     3aaf1263ea5271b19bd0fa87814791670f401ef72e16bffb07512a88d12b5989
```

The abbreviated media names above refer to the original source page
directories; full absolute paths are in the current hash table.
No new SVG visual approval or vectorization claim is made.

FIRST report, independent inventory and manifest are unchanged:
- report 36facabb1f508346fd571544f3c9330a8009a3ad32289ef5188bb6e11573963b
- inventory 979e7992d45d0bf63f2cfa57586edc84d3434381be570873e18d39a607ac7235
- manifest 93b0c875bb7c40e72369e2462a04112211ce1df9c9133b94ce03cdeee76f6026

Historical FIRST REVISE remains intact; this separate PASS closes only its
specified emphasis defects against the newly bound MD/JSON bytes.

## Current Hash Table And Accounting

Current hash table:
/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/source-review406407-affected-b91/current-hashes-b91.json
SHA-256:
1b2235eec3e6acfe8ddb87bf4de091160756b3511154b6f4eee0ada3759af3ec

New images this review: 0.
Cumulative actual images: 8 = original task budget 5 images + prior extra
crop reads 3, already retained/disclosed by the parent. No budget reset,
additional allowance or new image batch is claimed.
New review command failures: 0. FIRST failures were not rerun or erased.

Only apply_patch created this report and its necessary current hash table.
No author/source/FIRST file was changed. No new snapshot copies, worker,
subagent, chat, browser, paid call, network, dependencies, env, Git or DB action.
No whole-page/batch re-review, assembly, gate or successful-stage rerun.

PASS is limited to the current reviewed 0406/0407 SOURCE bytes. The previous
limits remain: no whole modern lesson, external figures 345/346/347/348,
unviewed neighbor pages, new SVG visual gate or publishing approval.
