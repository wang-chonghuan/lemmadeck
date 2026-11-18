# STEMROBIN-182: 7a physical 203–209 FIRST authoring

Offline author delivery only. No independent source, figure, full-page, or card
approval is claimed for these seven pages. A zero FIRST exit proves only the
checks reported by that call.

Checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Authorized branch: `codex/STEMROBIN-182-textbooks`; branch was not inspected
because Git operations were prohibited.

## Scope and evidence

- All 21 durable targets (`page.md`, `page.json`, `audit.json` for each page)
  were asserted absent before source work. Each `page.md` was checked absent
  again immediately before its single manual creation by `apply_patch`.
- All seven prepared FIRST stages were already successful according to the
  caller. Their retained input/log hashes are recorded; their exit receipts
  were not available to this author, so observed prepare exit codes are null.
  No prepare or reprepare ran.
- Exactly seven images were loaded, one at a time, once each: the assigned
  `0203`–`0209/page.grid.png`, with `functions.view_image` and `detail=original`.
  The image-free entry context therefore consumed seven images in one batch,
  seven in context. No reopens, crops, page-202 image, or other images loaded.
- FIRST finalize ran exactly once per page with the repo Python and separate
  `finalize --book 7a --page N` arguments. The wrapper wrote an exclusive,
  fsynced `pNNNN.first.start.json` before execution, sent raw stdout/stderr
  directly to exclusive disk files, fsynced the logs and generated outputs,
  and wrote a fsynced per-call receipt before the next page advanced.
- Failed FIRST outputs were retained. No post-FIRST source edits, retries,
  counter changes, assembly, solutions, modern work, choices, DB, publisher,
  application, deployment, Git, other-agent, or old-chat operations occurred.

## Actual FIRST Results

| Physical | Printed | FIRST exit | Tool printed / authored rows | Figures | Result |
| --- | --- | --- | --- | --- | --- |
| 203 | 197 | 0 | 23 / 23 | none | mechanical checks passed; unreviewed |
| 204 | 198 | 0 | 22 / 22 | none | mechanical checks passed; unreviewed |
| 205 | 199 | 1 | 25 / 24 | none | row reconciliation failed; retained |
| 206 | 200 | 1 | 21 / 20 | none | row reconciliation failed; retained |
| 207 | 201 | 0 | 22 / 22 | none | mechanical checks passed; unreviewed |
| 208 | 202 | 0 | 22 / 22 | fig-44 | mechanical checks passed; unreviewed |
| 209 | 203 | 0 | 16 / 16 | fig-45, tbl-p0209-02 | mechanical checks passed; unreviewed |

Both failed audits report only the row-count mismatch. This author does not
infer a counter defect or a scientific verdict from those mismatches. No
padding, source deletion, arithmetic correction, or errata was added to make
the tool pass.

## Source Boundaries

Page 203 actually continues exercise 715:

```text
ж) $\sqrt{0.04}$；　з) $\sqrt{\frac{25}{4}}$；　и) $\sqrt{2\frac{1}{4}}$；
к) $\sqrt{1\frac{7}{9}}$；　л) $\sqrt{1\frac{24}{25}}$.
```

Other boundaries: exercise 721 is open on 203 and continued on 204; exercise
728 is open on 204 and continued on 205; exercise 733 is open on 206 and
continued on 207. Page 207's paragraph ends `而且这个映`; page 208 begins
`射是可逆的.`. Footers are transparent.

Exact page-209 open tail, after the closed preceding paragraph:

```markdown
<!-- p open -->
从下表可以看出，

<!-- foot -->
203
```

No next-page words or next table were invented or inspected.

The latest direct caller update supplies the independent 196–202 review path
`.intentfold/tickets/STEMROBIN-182/tmp/resume182-6/source196-202-review.md`
and SHA-256
`d23e2825c855969059b1dd5dbdb17b1673b357cbdbaa3315535bfc4ed1413c8b`.
That update independently confirms only the supplied page-202 exercise-715
tail; it says the unrelated `ge` glyph repair awaits zero-image binding,
exercise-715 text is untouched, and this is not full-page/card approval.
This path/hash is caller-supplied, not reread or independently hash-verified
here. The original supplied text was:

```text
<!-- ex 715 open -->
715. 求下列根式的值.
а) $\sqrt{49}$；　б) $\sqrt{10000}$；　в) $\sqrt{2500}$；
г) $\sqrt{900}$；　д) $\sqrt{0.81}$；　е) $\sqrt{0.16}$；
transparent footer: 196
```

## TOC and Figures

The actual `toc/7a/zh.json` was read. Its fourth chapter, first section
(`alg7-c4-s1`, printed section 10, 二次根式), owns n30 at printed 192/physical
198, n31 at printed 199/physical 205, and n32 at printed 201/physical 207.
The later cards n33, n34, and n35 begin at printed/physical 205/211, 208/214,
and 214/220 respectively. Only true TOC card starts use `h3`; both
`复习题` headings use `exhead`.

Figure 44 is a prose number line on 208, labelled `-sqrt(7)`, `0`, `sqrt(5)`,
and `32/7`. Its rough box `[170,350,1090,105]` snapped to
`[182,359,1069,84]`. Its separate caption remains text.

Figure 45 is a single prose figure on 209 containing all three labelled
number-line subfigures а, б, в. Its rough box `[240,240,1110,375]` snapped to
`[256,250,1085,358]`; the caption stays outside the crop. The unnumbered
prose table is not an exercise figure: two rows, five columns, with first
row `x, 2.0, 2.1, 2.2, 2.3` and second row `x^2, 4.0, 4.41, 4.84, 5.29`.
Its rough box `[230,895,1145,260]` snapped to `[237,904,1133,247]`.
Generated figure PNGs were hashed, never reopened.

Existing physical-196 counter `19/18` HOLD, physical 177/178, and all existing
SOURCE/figure/881 holds are unchanged by this author. The caller's latest
196 fact is 18 actual text rows plus a footnote separator; no repair is
authorized or attempted here.

## Hash Manifest

`source203-209-author.json` records command, interpreter/tool/profile/TOC/PDF,
prepared-input, grid, FIRST authored-input, final-output, figure, receipt,
and every scoped changed-file SHA-256. Generated outputs are compared against
their immediate per-call receipts without rerunning producers. Unknown facts
and approval fields are null. The JSON's own in-document SHA is null to avoid
self-hashing; its actual final SHA is returned separately.
