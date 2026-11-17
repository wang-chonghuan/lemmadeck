# STEMROBIN-184 Session B: Six Count Failures

Generated UTC: 2026-11-17T03:03:49.781350+00:00

## Scope

Only physical 10c pages 125, 128, 129, 130, 131, and 133 were diagnosed.
This is continuation evidence, not workflow setup, update, handoff, or closure.
No production edit, layout patch, finalize, test, assembly, database, publishing, Git,
browser operation, previous image history, or passed-page rerun was performed.
All written files are beneath this diagnostic directory. Parent applies proposals.

## Six Dispositions

| Physical page | Actual / independent witness | Disposition | Exact proposed XYWH | Read-only count |
| --- | --- | --- | --- | --- |
| 125 | 20 / 19 | Safe scan-artifact proposal | `[393, 2480, 492, 6]` | 20 -> 19 |
| 128 | 25 / 24 | Safe scan-artifact proposal | `[1594, 1550, 11, 12]` | 25 -> 24 |
| 129 | 19 / 18 | Safe scan-artifact proposal | `[1483, 2486, 153, 5]` | 19 -> 18 |
| 130 | 27 / 26 | UNKNOWN; no exclusion | `None` | Not attempted |
| 131 | 24 / 23 | Safe scan-artifact proposal | `[34, 2484, 1593, 24]` | 24 -> 23 |
| 133 | 17 / 16 | Confirmed math-row split; no exclusion | `None` | Not attempted |

The four proposals were selected from native non-text classification and measured
object envelopes before count execution. No desired-count override is present.
Each removes only the named extra band; all other returned bands remain identical.

### Pixel Attribution and Protection

- 125: blank bottom-margin irregular dot trail; full native envelope
  `[393,2480,492,6]`, 121 ink pixels; counted core y=2482..2485.
- 128: isolated irregular right-margin blot; full native object
  `[1594,1550,11,12]`, 99 pixels; counted projection core y=1552..1558.
  The initial core-only draft was corrected to the full native object before counting.
  Adjacent printed Chinese text remains outside the proposed rectangle.
- 129: short ragged bottom-margin trail `[1483,2486,153,5]`, 222 pixels;
  counted core y=2486..2489. It is not an intentional separator.
- 130: UNKNOWN sparse dot/stroke cluster; counted core
  `[781,2395,119,19]`; full inspected-region ink envelope
  `[781,2393,121,44]`, 240 pixels. No provenance is asserted.
- 131: ragged descending bottom scan-edge smear
  `[34,2484,1593,24]`, 11872 pixels; counted band y=2484..2507.
- 133: one native equals-expression has three horizontal terms with fractions and
  evaluation bars (upper 4, lower 1/4), including nested fractional notation.
  Its complete y=701..855 band is split into y=701..777 and y=778..855.

Legal scan-artifact zones under current counting_ink: x+w <= 84.75,
x >= 1525.5, y+h <= 129, or y >= 2451. The four proposals lie wholly
in blank bottom/right margins and exclude no text, footer, or mathematics.
No separator-rule proposal is justified. The page-130 cluster is outside
all legal margin zones, is not a separator, and is narrower than the 339px
minimum separator width. No box enlargement or kind substitution was attempted.

### Current Counter Cause on 133

The unchanged layout joins the entire expression as `[701,855]` before expansion.
At layout.py:1039: band_h=155, typical_h=46, glyph_h=43.75, typical_gap=40,
pitch=86, count=2. compact_text_rows, subscript_row, and carrier_row are false;
fraction_starts is empty. _single_fraction_row returns false at layout.py:423
for either scale: it recognizes rules but retains only one supported core,
so len(cores)>=3 fails even though overlapping=true. Equal-step expansion
therefore emits two count bands from one native mathematical expression.
Excluding any of these fraction/evaluation strokes would mask genuine math.
Full trace: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/0133/layout-trace.json`

## Native Image Ledger

Exactly 6 model image opens: one fresh, native rectangle per page; no reopen,
whole-page display, resizing, enhancement, overlay, or montage. Assignment 6/8;
lifetime 6/24. Parent received no image payload and must not reopen these crops.
Each pre-load record logs source/crop dimensions, SHA256, exact rectangle equality,
and budget consumption before the successful functions.view_image(original) call.
All originals are RGB 1695x2580, nominal 300dpi (PNG metadata 299.9994dpi).

| Page | Native crop XYWH | Crop SHA256 |
| --- | --- | --- |
| 125 | `[375, 2465, 525, 40]` | `c66f71c3e6211f47d3327a266178f4ab44decc08c127a55b64f515ccad1f015c` |
Crop path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/0125/bottom-margin.png`
| 128 | `[1345, 1515, 290, 120]` | `607b071234e6bdcb41507d2deaf27c42386600d0f099f9d6fd195d45e8e2884d` |
Crop path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/0128/right-margin.png`
| 129 | `[1465, 2470, 190, 40]` | `52359343417b87a3ebb439dfa85305c4d6cd5bf53bfa5098b88cc0ac33960c4f` |
Crop path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/0129/bottom-margin.png`
| 130 | `[755, 2375, 170, 65]` | `4b90e82b22bd3518c4d6a2935db06038693a399b2e98624509d0b08358669c0f` |
Crop path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/0130/subfolio-ink.png`
| 131 | `[20, 2465, 1625, 60]` | `09e8b87d7a95ae3c944545a92713546a6245dd4026442e2ed09bb0c653bf2bc1` |
Crop path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/0131/bottom-edge.png`
| 133 | `[410, 685, 580, 185]` | `a0db49e069a717b77730ef2981a22c310a5f274c0fb08b440ac26afa52dc1b68` |
Crop path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/0133/nested-fraction.png`

Pre-load ledger: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/image-open-ledger.jsonl`
Crop creation/equality ledger: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/crop-ledger.jsonl`
Model-tool wall-clock durations are not provided by the image tool; none are invented.

## Source Preservation

Final SHA256 equals the baseline for all six native PNGs. Current audit JSONs,
layout.py, p2c.py, and first-finalize command/stdout/stderr inputs also remain unchanged.
Full final hash record: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/final-hashes.json`

| Page | Unchanged original SHA256 |
| --- | --- |
| 125 | `141bb38b345bb0889b511f70207a49c81530d848be0195ae870a3d47461e7aaf` |
Source path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125/10c/pages/0125/page.png`
| 128 | `f74699e0b56c9b10fdaa77797ab4ba44850d09af75073a238f65116b68008a00` |
Source path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129/10c/pages/0128/page.png`
| 129 | `e1195915cfcd3fa0648339e333d4b4776a86466b353f28e3e5561267a349ef98` |
Source path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129/10c/pages/0129/page.png`
| 130 | `20b99ecbddcf7da8cc40c5fe29c401cb1170b15b5913533c186f504ad4238536` |
Source path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133/10c/pages/0130/page.png`
| 131 | `2dec1ab3b23b0a3a2853cecb82f81ba573e759c1852b902ffd94cd3109808abc` |
Source path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133/10c/pages/0131/page.png`
| 133 | `5e95f8447938b6b0d6781ea937124a1b4cac643181dec76445735237a2093816` |
Source path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133/10c/pages/0133/page.png`

Current layout SHA256: `211f8b194c1fae5d5ab87543ea13931811d44574386d1082dc9eab816afde389`

## First-Finalize Records

These are existing first-failure records, not reruns. The recorded args are
preserved exactly. Their command.json does not name the Python executable;
that missing field is not reconstructed or presented as known.

### Physical 125

Recorded args: `.claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 125 --work .intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125`
UTC start `2026-11-17T02:51:34.241Z`; finish `2026-11-17T02:51:34.725Z`;
exit=1, signal=None, error=None.
```text
[finalize] 10c p0125: 7 块 / 19 行（印刷 20）, 插图 1 张, 规范化 0 处
    fig-56(图 56) → [506, 905, 676, 344]
  ✗ 失败 1 项:
    - 行数对不上：印刷 20 行，块体 19 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```
stderr: ''
Exact copied record directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/first-finalize/125`

### Physical 128

Recorded args: `.claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 128 --work .intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129`
UTC start `2026-11-17T02:50:52.432Z`; finish `2026-11-17T02:50:52.917Z`;
exit=1, signal=None, error=None.
```text
[finalize] 10c p0128: 3 块 / 24 行（印刷 25）, 插图 0 张, 规范化 0 处
  ✗ 失败 1 项:
    - 行数对不上：印刷 25 行，块体 24 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```
stderr: ''
Exact copied record directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/first-finalize/128`

### Physical 129

Recorded args: `.claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 129 --work .intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129`
UTC start `2026-11-17T02:50:52.918Z`; finish `2026-11-17T02:50:53.447Z`;
exit=1, signal=None, error=None.
```text
[finalize] 10c p0129: 10 块 / 18 行（印刷 19）, 插图 2 张, 规范化 0 处
    fig-61(图 61) → [249, 532, 479, 238]
    fig-62(图 62) → [797, 627, 663, 61]
  ✗ 失败 1 项:
    - 行数对不上：印刷 19 行，块体 18 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```
stderr: ''
Exact copied record directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/first-finalize/129`

### Physical 130

Recorded args: `.claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 130 --work .intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133`
UTC start `2026-11-17T02:51:32.698Z`; finish `2026-11-17T02:51:33.466Z`;
exit=1, signal=None, error=None.
```text
[finalize] 10c p0130: 11 块 / 26 行（印刷 27）, 插图 1 张, 规范化 0 处
    fig-63(图 63) → [893, 448, 483, 320]
  ✗ 失败 1 项:
    - 行数对不上：印刷 27 行，块体 26 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```
stderr: ''
Exact copied record directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/first-finalize/130`

### Physical 131

Recorded args: `.claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 131 --work .intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133`
UTC start `2026-11-17T02:51:33.468Z`; finish `2026-11-17T02:51:34.006Z`;
exit=1, signal=None, error=None.
```text
[finalize] 10c p0131: 9 块 / 23 行（印刷 24）, 插图 0 张, 规范化 0 处
  ✗ 失败 1 项:
    - 行数对不上：印刷 24 行，块体 23 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```
stderr: ''
Exact copied record directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/first-finalize/131`

### Physical 133

Recorded args: `.claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 133 --work .intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133`
UTC start `2026-11-17T02:51:34.611Z`; finish `2026-11-17T02:51:35.126Z`;
exit=1, signal=None, error=None.
```text
[finalize] 10c p0133: 6 块 / 16 行（印刷 17）, 插图 0 张, 规范化 2 处
  ✗ 失败 1 项:
    - 行数对不上：印刷 17 行，块体 16 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```
stderr: ''
Exact copied record directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/first-finalize/133`

## New Read-Only Commands

All diagnostic subprocess argv, UTC start/finish, elapsed time, exit/signal/status,
and byte-exact stdout/stderr plus their hashes are retained in commands/*/command.json.
commands.jsonl also includes this report-generation command after it returns.
Complete live command index: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands.jsonl`

| Action | Start UTC | Elapsed seconds | Exit | Command/stdout/stderr directory |
| --- | --- | --- | --- | --- |
| `inventory` | 2026-11-17T02:54:38.911918+00:00 | 1.902597 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025438911516Z-inventory` |
| `crop 125` | 2026-11-17T02:55:45.570794+00:00 | 0.179545 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025545570497Z-crop-125` |
| `crop 128` | 2026-11-17T02:55:45.603252+00:00 | 0.147130 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025545602925Z-crop-128` |
| `crop 133` | 2026-11-17T02:55:45.643610+00:00 | 0.132627 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025545643298Z-crop-133` |
| `crop 129` | 2026-11-17T02:55:45.686506+00:00 | 0.113769 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025545686073Z-crop-129` |
| `crop 130` | 2026-11-17T02:55:45.684820+00:00 | 0.116369 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025545684292Z-crop-130` |
| `crop 131` | 2026-11-17T02:55:45.699612+00:00 | 0.110810 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025545699026Z-crop-131` |
| `preopen 125` | 2026-11-17T02:55:49.222936+00:00 | 0.084338 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025549222526Z-preopen-125` |
| `preopen 128` | 2026-11-17T02:56:08.110014+00:00 | 0.123890 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025608109644Z-preopen-128` |
| `preopen 129` | 2026-11-17T02:56:19.227183+00:00 | 0.097297 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025619226807Z-preopen-129` |
| `preopen 130` | 2026-11-17T02:56:31.788711+00:00 | 0.110334 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025631788342Z-preopen-130` |
| `preopen 131` | 2026-11-17T02:56:50.762330+00:00 | 0.116703 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025650761968Z-preopen-131` |
| `preopen 133` | 2026-11-17T02:57:06.355138+00:00 | 0.119204 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025706354814Z-preopen-133` |
| `region 128` | 2026-11-17T02:59:45.384646+00:00 | 0.334926 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025945384322Z-region-128` |
| `region 129` | 2026-11-17T02:59:45.435474+00:00 | 0.283729 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025945435008Z-region-129` |
| `region 131` | 2026-11-17T02:59:45.438205+00:00 | 0.281003 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025945437863Z-region-131` |
| `region 125` | 2026-11-17T02:59:45.354770+00:00 | 0.364491 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025945354010Z-region-125` |
| `trace 133` | 2026-11-17T02:59:45.426279+00:00 | 9.545307 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T025945425964Z-trace-133` |
| `region 130` | 2026-11-17T03:01:02.544986+00:00 | 0.262645 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T030102544622Z-region-130` |
| `candidate 125` | 2026-11-17T03:01:02.460724+00:00 | 0.723505 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T030102460282Z-candidate-125` |
| `candidate 129` | 2026-11-17T03:01:02.533061+00:00 | 0.688980 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T030102532715Z-candidate-129` |
| `candidate 128` | 2026-11-17T03:01:02.490979+00:00 | 0.879625 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T030102490695Z-candidate-128` |
| `candidate 131` | 2026-11-17T03:01:02.542363+00:00 | 0.874926 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T030102542015Z-candidate-131` |
| `final-hashes` | 2026-11-17T03:03:41.525122+00:00 | 0.058490 | 0 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/commands/20261117T030341523026Z-final-hashes` |

## Parent Delta

Apply-or-reject proposal file: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis/proposed-exclusions.json`
Only 125, 128, 129, and 131 have proposals; all are scan-artifact exclusions.
130 stays UNKNOWN. 133 is confirmed mathematical row splitting, not an exclusion.
Author body, expected/witness values, wraps, source pixels, and figure boxes are untouched.
This bounded assignment ends with this report.
