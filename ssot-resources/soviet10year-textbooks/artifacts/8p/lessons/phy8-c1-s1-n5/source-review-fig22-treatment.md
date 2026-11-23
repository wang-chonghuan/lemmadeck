# Figure22 source-treatment assessment: phy8-c1-s1-n5

## Narrow verdict

**SOURCE-TREATMENT PASS, limited to the registered figure22а error, source binding, proposed disclosure and mathematical correction plan.**

**Technical stage remains HOLD:** the current p31 metadata-only finalize audit reports 14 printed / 15 Markdown rows and an error. This assessment does not waive that failure, decide which count is correct, approve finalize, or authorize modern figure/lesson publication.

Date: 2026-11-23. Same independent SOURCE reviewer, STEMROBIN-180 / 180-7. Reused the frozen figure22 source observations; no source image or modern file was reopened. New image loads: **0**; cumulative visual image loads remain **8/8**.

Only write in this turn: this new `source-review-fig22-treatment.md`. Every command used explicit workdir `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`. No source/modern/figure/erratum/code/tool edit, counter run, child agent, package operation, DB/Git/deploy write, finalize or publisher.

The prior first HOLD and affected HOLD reports are preserved, not rewritten. This document addresses only their remaining figure22 source-treatment gap; all unrelated PASS scopes are reused.

## Registry and source binding

The unique current p31 registry entry is:

```text
id:       p0031-fig22a-arrow
block:    p0031#4
original: 共线矢量的减法，也按同样的法则计算（图22а，б）.
```

The `original` is byte-exactly the one-row p0031#4 reference paragraph, including Cyrillic а/б, Chinese comma and final dot. It occurs exactly once in that bound block. Markdown frontmatter matches current JSON metadata.

The registered reason explicitly names source PNG SHA-256:

```text
1761ff0407f2b5b08d8395bdbe7198d145a4f9d2433495de0a40d861bcf83b33
```

That equals both the durable book and page fig-22.png hashes and the independent frozen source22 binding. The reason correctly describes longer up-right a, shorter up-right b, and the oppositely directed outlined c=a-b source arrow; it requires preserving raw prose/PNG, disclosing the error and reversing only the modern resultant in (a).

Binding this error at its own printed reference block is acceptable source-bound treatment: the reference paragraph locates the affected figure, while the explicit PNG digest and reason locate the actual incorrect arrow. The paragraph itself need not be falsely described as an incorrect equation. The independently frozen source evidence, registered identity and proposed modern disclosure distinguish a deliberate mathematical correction from silent redrawing.

Current raw Markdown body and all JSON source blocks are exactly unchanged from the retained pre-erratum snapshots. Metadata differences are only the new registry entry and profile-hash refresh. Source p31 render SHA-256 remains `113a8c265f65849b8a1a8e8cb8b3f9ddcc72ec0e0df7e948520c8e4500f10646`, and figure22's box remains `[553,984,692,461]`. Neither original prose nor original crop has been repaired or called mathematically corrected.

## Proposed modern wording

The supplied disclosure and planned arrow-only reversal are mathematically justified. For parallel, same-direction a and b with a longer than b, c=a-b has a's direction. Subfigure (b) and the original a/b/-b directions and equations are unaffected.

Preferred wording uses `差矢量` for precision; `合矢量` can mean the sum a+(-b), but may be confused with a+b in this subtraction example:

```text
共线矢量的减法，也按同样的法则计算（图22的 (a)、(b)）.
原稿 (a) 的差矢量箭头方向印反，现代图保留差矢量的定义，仅将该箭头改为与较长的矢量 $\vec{a}$ 同向.
```

This is assessment of proposed wording only, not an edit to modern prose. The correction scope is exactly the outlined resultant arrow in (a): reverse its direction while retaining the difference definition c=a-b, all source a/b/-b/equation relationships, and all of subfigure (b). The future FigureSpec must identify `p0031-fig22a-arrow`, the exact source PNG and the deliberate correction; those implementation bindings and its rendered output were not inspected here.

Accordingly, the registered reason plus exact reference-block/PNG binding, independent mathematics and explicit disclosure provide a source-bound treatment for the confirmed source error. They do **not** establish original-source redraw equality, prove that a proposed FigureSpec implements the correction, or approve a rendered modern figure.

## Current technical-stage limit

Read only the affected current `pages/0031/audit.json` fields:

```text
lines_printed: 14
lines_md:      15
errata:       1
errors:       ["行数对不上：印刷 14 行，块体 15 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）"]
```

This is an actual failed stage, despite raw prose/figure byte equality. Neither count is declared authoritative by this treatment review. Do not remove a row, alter source prose, insert a synthetic line break, or waive the failure to fit a presumed count. The parent reports the first failure was saved and a separate bounded counter worker is diagnosing it; this reviewer did not read/reuse its conclusions, invoke it or change its code. The failure remains unresolved here.

A successful affected finalize and any subsequent modern content/figure validation remain separate required evidence. This treatment PASS grants no permission to perform those operations or write the DB.

## Exact evidence hashes

All page paths below are under `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0031/`.

| Artifact | SHA-256 |
| --- | --- |
| page-before-erratum.snapshot.md | 4ba2285adaf9419e0c44223d306a4ac7883ff3f95cd9ee3a89c24aa777d170f1 |
| page-before-erratum.snapshot.json | 6bd18a159e57792efe2786ce53cc8f569d14d8ace4086ba199a6bf355737824e |
| page.md, current registry candidate | 5407d9433b36f6b4564864756f05c323bb63a26b59de37245cf01804b413c0ff |
| page.json, current registry candidate | 3a557cfa5dbc9c627c0493626dec9f0c64545f8fecff2a12ba82ccc9b1880e83 |
| audit.json, failed stage | 3e9698f10d55fea41d4552a518ee045ed620f13d0930e592cb6c56de5d21651b |
| figures/fig-22.png | 1761ff0407f2b5b08d8395bdbe7198d145a4f9d2433495de0a40d861bcf83b33 |

The snapshot hashes reproduce the original p31 candidate hashes retained by the first review.

Prior raw n5 review documents were rehashed and remain unchanged:

| Preserved report | SHA-256 |
| --- | --- |
| source-first.md | cedd37de90883e74478266da3dc4ffea23fc8b0158287e4e62e284f96d4f52d9 |
| source-review.md | b82ecd0b1e5c6b1d3f25028f95b906b4921597f2cb395f02eca1ae48afb9ad46 |
| source-review-affected.md | f63b196bcae39f7966b617d638d552ab3281b3127b7ec0b01ccb6efcd9aa6ee3 |

Final disposition: **figure22 source-treatment PASS; p31 technical stage HOLD; no rendered modern figure, modern lesson/choice or publication approval.**
