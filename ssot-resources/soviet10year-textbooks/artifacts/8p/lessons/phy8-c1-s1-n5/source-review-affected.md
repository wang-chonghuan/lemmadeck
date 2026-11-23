# Affected-only SOURCE recovery: phy8-c1-s1-n5

## Independent pixel freeze

Frozen on 2026-11-23 before reading recovered candidates, the erratum registry candidate, modern files, or the canonical assembly. This new file is the only write owned by this reviewer in the recovery turn.

The first source inventory and first HOLD report are unchanged:

- `source-first.md`: SHA-256 `cedd37de90883e74478266da3dc4ffea23fc8b0158287e4e62e284f96d4f52d9`.
- `source-review.md`: SHA-256 `b82ecd0b1e5c6b1d3f25028f95b906b4921597f2cb395f02eca1ae48afb9ad46`.

Three additional visual image loads, in this order, one at a time:

| New load / cumulative | Authorized original evidence | SHA-256 |
| --- | --- | --- |
| 1 / 6 | .tmp/ld-s10y-lesson/8p/pages/0021/page.png | 1a89ba33ff928f650764117b97b67a1774baf03b6722dc834ac544dfbeb1e4a1 |
| 2 / 7 | ssot-resources/soviet10year-textbooks/artifacts/8p/figures/fig-07.png | 6078b261d71eeca1492f623a2eae47011ecf662efc7b223543cf7c078b8765a4 |
| 3 / 8 | ssot-resources/soviet10year-textbooks/artifacts/8p/figures/fig-22.png | 1761ff0407f2b5b08d8395bdbe7198d145a4f9d2433495de0a40d861bcf83b33 |

Exactly **8 cumulative visual image loads** (5 first review + 3 recovery), no reopen of the original five source pages, no other crop or modern image preview, no image payload in the report. Every command uses explicit workdir `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`. No child agent, DB, Git/package/deploy write or publisher.

## F7 independent source inventory

The original full physical21 / printed9 page contains two separate figures: figure 6 at lower left, and figure 7 at lower right. Figure 6 and page21 prose are not approved here. Figure 7's grouping contains two subfigures, labelled Cyrillic `а` and `б`, with its printed caption `图 7` outside and below the grouping.

| Stable observation ID | Objects and relationships directly observed |
| --- | --- |
| F7-a-M1 | One solid point labelled $M_1$, detached at the lower left of subfigure а. The point is not joined to the standalone arrow's tail. Do not create a connecting segment or relocate the arrow tail onto it. |
| F7-a-s | One solid oblique straight arrow, tail lower-left and head upper-right, labelled $\vec s$. Its arrowhead and vector accent over s are visible. No scale or numerical length. |
| F7-a-letter | Cyrillic subfigure `а` below the standalone arrow. |
| F7-b-M1 | A solid lower-left point labelled $M_1$, at the tail of the solid displacement arrow. |
| F7-b-M2 | A solid upper-right point labelled $M_2$, at the head/end of the solid displacement arrow. |
| F7-b-s | Solid straight arrow directed $M_1 \to M_2$, up-right, labelled $\vec s$. Never reverse it or read it as a distance-only segment. |
| F7-b-translated | A separate dashed up-right arrow to the right of the solid M1->M2 drawing. It has no printed endpoint names or s label. Its matching direction illustrates the movable arrow representation; do not invent a numerical equality or scale from its approximate drawn length. Preserve dashed versus solid strokes and its arrowhead. |
| F7-b-letter | Cyrillic subfigure `б` below the lower grouping. |
| F7-caption | Single printed `图 7` below the grouped illustration on p21, excluded from the standalone crop as a separately transcribed caption. |

Inventory totals: 2 subfigures; 3 drawn arrows (2 solid, 1 dashed); 3 solid point occurrences (M1 twice, M2 once); 2 vector-s labels; 2 subfigure letters; one page-level caption. No axes, ticks, table, grid, angle, numeric magnitude, or extra point labels.

The durable fig-07.png visually contains both complete subfigures, all inventoried point/vector labels, both subfigure letters and the dashed arrow. It excludes figure 6, neighboring prose and the separate caption, as intended for a figure-only crop. No label/arrow truncation is visible in the inspected crop.

**Independent source conclusion for n5's F7 reference:** source-backed and usable for the specific statement that a vector is represented by an arrowed straight segment whose length represents magnitude and arrowhead represents direction. The original grouping and label letters match n5's reference `图 7а 和 б`. This is source fidelity of the original dependency, not approval of a modern figure, invented dimensions or page21 candidate prose.

## F22 independent source resolution

The durable figure22 bytes equal the already bound durable page31 fig-22.png hash from the first review; the clearer authorized crop resolves the earlier full-page uncertainty without reopening p31.

| Subfigure | Actual printed labels and orientations | Mathematical assessment |
| --- | --- | --- |
| а | Separate $\vec a$ and shorter $\vec b$ both point up-right. Construction $\vec a$ points up-right; $-\vec b$ points down-left. The outlined lower resultant actually points **down-left**, and the printed label is **$\vec c=\vec a-\vec b$**, not b-a and not a+b. | For the pictured longer a and shorter parallel b, a-b points **up-right**. The printed outlined arrow has the opposite orientation and so disagrees with its own label and construction. This is now a confirmed source-diagram arrow error, not merely unresolved scan uncertainty. |
| б | Separate a points up-right, b down-left. Construction -b and a point up-right head-to-tail; the outlined $\vec c=\vec a-\vec b$ points up-right. | Consistent: subtracting the oppositely directed b adds -b. No corresponding orientation defect observed in б. |

The minus sign is visible in each resultant equality. The source error is confined to а's resultant arrow direction; the raw crop faithfully preserves it. Do not silently reverse the faithful crop, change the equation to b-a, or approve a modern corrected figure from this source review. Modern instructional treatment must explicitly account for this independently confirmed source error; the mathematical correction would reverse only а's outlined resultant arrow to up-right while retaining c=a-b and the given a/b/-b relationships.

## S1 independent correction rationale

The first independent freeze already transcribed p0032#3 as `矢量投影的运算也是根据几何学的一般法则`, identified its contradiction, and verified the earlier raw algebraic rules. No p32 source image was reopened.

Projection onto a fixed oriented axis is a signed scalar operation. For vectors a,b and real k:

```text
(a+b)_x = a_x+b_x
(a-b)_x = a_x-b_x
(ka)_x  = k a_x
```

These are algebraic scalar operations, consistent with the explicitly stated preceding projection sum, difference and scalar-multiplication rules. Replacing only `几何学的一般法则` with **`代数学的一般法则`** in a properly source-bound modern erratum is mathematically correct and narrowly justified. Retain the raw printed wording. This assessment does not approve modern lesson text, options or figures.

No candidate-specific recovery verdict has yet been made in this frozen section. Subsequent candidate/hash/identity checks and any remaining issue disposition are appended below.

## Affected verdict

**Affected SOURCE HOLD, restricted to F22а's confirmed source-diagram error and its unresolved mathematical treatment.**

R1/R2 and the previous H1/H2/H3 recovery checks now PASS in their respective scopes. S1's registry candidate and proposed correction also PASS the source-binding and independent mathematical assessment. No earlier PASS was reinterpreted or subjected to a new full-lesson gate. The first HOLD/report remain untouched.

F22а's original crop is faithful, but its resultant arrow is mathematically wrong. Source p31's `meta.errata` is still empty; no separate bound treatment for this figure error has been approved in this review. Retain the raw source and independently confirmed error; the owning workflow must account for it explicitly before a modern instructional diagram can be mathematically approved. This is not authorization for the reviewer to edit/register an erratum, reverse an original arrow, or review a modern figure.

## Recovered candidate byte changes

| Artifact below artifacts/8p/pages/ | Current SHA-256 | Affected check |
| --- | --- | --- |
| 0028/page.md | 09c232eb2259736a04e14e3feb008bb3f048f2c6f64e22205f1ba33fe2370a8a | R1 repaired to `示，用`; heading normalization and profile refresh are the already assessed differences. |
| 0028/page.json | 4fd40e60bf20a3c4ae83f6d366ceffa7fb5702b0d3a2a20dac6f41dd84f22597 | Reversing only R1, the heading normalization and profile hash reproduces original JSON SHA-256 `f000c234d37de3bb99038b478d9346889580c0a60abc24c147c04a6bd6309526`. |
| 0030/page.md | 5e6ca608cbee464ea3c803e8c47fc0528cc17efbe33c383fa7613d1211917d18 | Snapshot diff is exactly `相加. 也就是` -> `相加，也就是`, with no other change. |
| 0030/page.json | 8595902381af569abc7e1f690eda880cd3f99acf9ac894d99eb3ff968d8c10aa | Structured snapshot comparison confirms exactly the corresponding R2 row change. |
| 0032/page.md | 1aa75097235f98cb351296e8df682deda663144c5e93edde618e6e3e637d5bd3 | Only registry addition and profile-hash refresh; no printed prose change. |
| 0032/page.json | 15e1a8c55b0d9fdde0f31e0fd3f5e2675e17ce798956eb74ccf70f9874bfa98c | All source blocks exactly equal pre-erratum snapshot blocks. Only `meta.errata` and profile hash changed. |

The p28 Markdown comparison to the original retained heading snapshot also confirms exactly those three differences (R1, heading, profile), not additional prose edits. The comma repairs agree with the frozen first source observations; no original p28/p30 image was reopened.

Source-repair snapshots for p30 reproduce the first-review candidate hashes:

- `0030/page-before-source-repair.snapshot.md`: `6163ef312151803898e3f902d8aad3d7f1ed03bd8e73599ee474836cd1dce777`.
- `0030/page-before-source-repair.snapshot.json`: `2fddd8fb9699e1e2818f0f7aa932a4f658a1201aaf877df1a1d4c8078e54f6f1`.

Targeted mechanical audit fields, read without rerunning finalize:

| Page | lines_printed / lines_md | errors | Audit SHA-256 |
| --- | --- | --- | --- |
| 0028 | 26 / 26 | [] | 37cad0ded59b948140680feff7c423000e8dbdf9f550532c15f717b9d9784fa6 |
| 0030 | 20 / 20 | [] | 90cd4fa8e1a5810cb27a4749dc1342d7cc341d259b03c66332d7d9cd0cd71801 |
| 0032 | 19 / 19 | [] | 8cb7e74490d63c5192b23d5cedade4f0629e4ccfc0d1310bcb0c98bee55e796a |

These are mechanical recovery checks, not mathematical-source approval. The reviewer did not invoke finalize or any assembly/publisher.

## F7 exact original crop binding: PASS

After the independent pixel freeze, only figure7 box/render fields were extracted from p21 page.json; its prose was not reviewed. That JSON has SHA-256 `2ff4b7b2a3714d1be44a76c75957f06c793c56be9a210750b2be69258e1abc57`, render SHA-256 matching the independently inspected p21 PNG, and figure7 ink box `[958,1398,420,652]`.

The retained crop is 444 x 676 pixels, with 12-pixel padding on each side. Its exact source rectangle is `[946,1386,1390,2062]` in left/top/right/bottom coordinates on the 1695 x 2580 source page. Numerical comparison of these already-authorized pixels returned exact RGB equality:

```text
source-rectangle RGB pixel SHA-256:
ce4448839f27e5042b7609c9781b7c566d3b5db8645c27a4018ed2dbde9d28d8

durable-crop RGB pixel SHA-256:
ce4448839f27e5042b7609c9781b7c566d3b5db8645c27a4018ed2dbde9d28d8
```

No image was emitted or visually reopened by the numerical check. This proves the inspected fig-07.png is the exact padded original source region, together with the independent all-object visual comparison above. It closes H2 for the original n5 arrow-representation reference; it does not approve a modern rendering or p21 prose.

## Durable figures 15-20: H1 resolved

For every row below, all three PNG locations exist and have the stated identical SHA-256:

1. `.tmp/ld-s10y-lesson/8p/pages/<page>/figures/<id>.png`.
2. `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/<page>/figures/<id>.png`.
3. `ssot-resources/soviet10year-textbooks/artifacts/8p/figures/<id>.png`.

| Figure / physical page | Cache = durable page = durable book SHA-256 |
| --- | --- |
| fig-15 / 0029 | 0f6c36251427b0f83722ccd7f638e159fd8ae76ef66b6c1d5fb328238c4a9b43 |
| fig-16 / 0029 | 244cc3d546a70fa6d65b9e440e33162346f32ee37e9cdc0076d310aa7516d888 |
| fig-17 / 0029 | 74ea7dcd9365da08431b4e1a406ab401f396b3d4a01ee791e6f12163a5a55c9d |
| fig-18 / 0029 | d93d3fef8cbcb120b0b5d9be02e11a92d686ff17f283ca65e165861c841af110 |
| fig-19 / 0030 | 98370364987503ee52744d3b007389d61ab182cfd038914c14f985c4d4171bd2 |
| fig-20 / 0030 | f42099a98394107bb8d663471cc9cf97a7c9b444716173416f9685989eabc8fe |

These also match the exact cache hashes preserved in the first report, so retention did not repair or reinterpret figure content. The prior local source inventories and unrelated PASS observations are reused without reopening their images.

The parent reports that the first copy exited 1 because durable page figure directories were absent; mkdir followed by exact-copy succeeded. That first technical failure is preserved here as reported, not reclassified as successful or as a content repair. The verified current hash equality closes the missing-durable-file issue. The reviewer did not mkdir or copy any figure.

Figures21-23 at both durable page and book locations match their original first-review hashes:

- fig-21: `a4605a9d47afdab96eee5c6a2330da42f9ea7f6b818b0bd7105e5e95ac3b7842`.
- fig-22: `1761ff0407f2b5b08d8395bdbe7198d145a4f9d2433495de0a40d861bcf83b33`.
- fig-23: `2865e54b151a8865f048a7dec699cd4338810a092092e371c558fdf3dfbab69d`.

In particular, fig22's confirmed arrow error was already in the unchanged original bytes, not introduced by retention. Fig23's declaration remains `[480,820,696,499]`; its pixels and the complete p32 source blocks remain unchanged after S1 registration.

## Canonical limited assembly identity: PASS

Read only the identity/index fields of `.tmp/180-7-n5-assembly/8p/book.json`, SHA-256 `f0c78adac3c8096ea573190937cda1d49293545e0c089f74c8c8ceea31d13886`.

- Book is `8p`; the index reports 5 pages, not a full-book rebuild.
- Exactly one active entry has both `id` and `card_id` equal to `phy8-c1-s1-n5`.
- Its title is `矢量及其投影的运算`, number `"5"`, start printed page 16.
- Its owned exercise count is **0**.
- No active x-prefixed n5 entry remains in this book index.

This closes H3's actual canonical identity check, beyond the previously approved heading representation. It is not approval of all assembled prose, figure manifests, modern content, adjacent lessons, full-book coverage or publication. No assembled lesson file was read. The parent's retained `assembly-first-noncanonical.json` is historical evidence, not overwritten or treated as current approval.

## S1 registry candidate and correction: PASS in stated scope

The retained p32 pre-erratum snapshots reproduce the first-review hashes:

- `pages/0032/page-before-erratum.snapshot.md`: `c1a0c6c308aeb830a806f5c6b60176ce3da4b39087d7aa3c720b5b8661d93f93`.
- `pages/0032/page-before-erratum.snapshot.json`: `9d36297a9d4844b29f47953e735c0a58d11333de62e5c5cf3914f8864a25d9b3`.

The new registry entry is unique and correctly bound:

```text
id:       p0032-projection-algebra
block:    p0032#3
original: 几何学的一般法则
```

Its original substring occurs exactly once in that source block. The original printed `几何学` remains in the raw block. All p32 blocks, flags, formulas and figure data are byte-equivalent to the pre-erratum JSON; metadata differences are exactly the registry entry and profile-hash refresh. The source render binding is unchanged. No full p32 prose or source image was reread.

The registered reason identifies projection as a signed scalar and points to the source's preceding algebraic sum/difference/scalar-multiplication rules. This agrees with the independent rationale frozen above. The proposed modern-only substitution:

```text
几何学的一般法则 -> 代数学的一般法则
```

is mathematically correct and narrowly justified. The resulting bound statement is `矢量投影的运算也是根据代数学的一般法则.` This is **PASS for the registry/source binding and intended correction's mathematical content**, not approval that any modern candidate has applied it correctly or that a modern lesson/choice/figure may publish. No modern file was read, edited or approved by this review.

## Remaining issue and preservation

Only one newly confirmed mathematical-source issue remains in this affected scope: **F22а's outlined c=a-b arrow points down-left instead of up-right**. Its source-preserving crop is usable as historical evidence, but not as an unqualified mathematically correct subtraction diagram. Subfigure б is consistent. Appropriate source-bound handling of а is still required; p31's empty `meta.errata` does not address it.

The p31 page.md/page.json still match the first report's hashes `4ba2285adaf9419e0c44223d306a4ac7883ff3f95cd9ee3a89c24aa777d170f1` and `6bd18a159e57792efe2786ce53cc8f569d14d8ace4086ba199a6bf355737824e`. No p31 rewrite or image reopen was made.

SHA-256 of this affected file at the initial pixel freeze, before candidate-check appendices: `99228005def2a16cc1fc5090615cd4c4001451d8bac78d803481623e58f3602b`. Those independent observations remain unchanged.

The original first inventory/report hashes were rechecked and remain exactly as recorded at the top. Recovery-turn writes are confined to **source-review-affected.md**. Cumulative image loads remain **8**, with no other source/modern pixels in context and no image payload returned.
