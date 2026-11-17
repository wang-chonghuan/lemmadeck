# STEMROBIN-180 Batch57 Summary Emphasis Review

Date: 2026-11-17. Same original independent reviewer. Course: `phy8-c4-s2-t15`. Scope: **R1 only**, zero-based `prose[1..3]`; mechanically inspect outer-wrapper closure only for `prose[0]`, `[4]`, `[5]`.

## Verdict

**Affected R1: PASS for all three blocks.** The current implementation resolves the identified CSS splitting, exposed source markup, and unmatched emphasis markers.

**Overall summary TEXT: PASS**, combining this bounded R1 result and the wrapper-only observations with the unchanged first complete review's source, physics, math, numeric, culture, and other-block findings. This is not a new whole TEXT review, a general sanitizer audit, or browser/product acceptance.

## Actual Affected Output

Executed the exact current `edition.py` layout functions on in-memory template JSON, then the actual `prose_flow.mjs --stdin`, `proseFlow`, and `proseInline`. No normalized template was written. `proseFlow` and the CLI outline agree exactly. The summary now has **six final paragraphs**, one per source prose block, with `resolvedBreaks=[]`; the old implementation produced nine.

| Block | Complete source refs | Actual final paragraph | Result |
| --- | --- | --- | --- |
| `prose[1]` | `p0291#5` | P1, two sentence lines | PASS: intact under-dot span around exactly `运动的`; one closed outer `<em>`; no CSS sentence split. |
| `prose[2]` | `p0291#6` | P2, three sentence lines | PASS: intact under-dot span around exactly `动能`; one closed outer `<em>`; one valid math fragment. |
| `prose[3]` | `p0291#7`, `p0292#1` | P3, three sentence lines | PASS: intact under-dot span around exactly `势能`; one closed outer `<em>`; three valid math fragments. |

Complete affected final paragraph strings follow. Each single newline is an actual sentence-line boundary; the CSS declarations remain inside one uninterrupted tag. Each paragraph carries its own balanced outer Markdown wrapper.

```text
P1 [block 1]
*只有当力对运动的物体作用时，才可以谈到力的功。
如果<span style="text-emphasis-style: dot; text-emphasis-position: under;">运动的</span>物体受到几个力的作用，其矢量和等于零（物体做匀速运动），则所有力的功的代数和等于零，但是，每个力所做的功并不等于零（除了其方向垂直于位移方向的一些力）。*

P2 [block 2]
*如果物体受到的合力不等于零，那么由于这些力的作用，说明物体运动、并叫做物体<span style="text-emphasis-style: dot; text-emphasis-position: under;">动能</span>的量$\frac{mv^2}{2}$改变。
它的变化量等于合力的功。
这就是动能定理。*

P3 [block 3]
*如果物体受到的是重力（万有引力）或弹性力，那么动能的变化量，在绝对值上等于说明物体相互作用、并叫做<span style="text-emphasis-style: dot; text-emphasis-position: under;">势能</span>的量的变化量，但相差一负号。
在重力的情况下，相对于规定的零水平面的势能等于$m|\vec{g}|h$，这里$h$是物体在该水平面上的高度。
在弹性力的情况下，势能等于$\frac{kx^2}{2}$。*
```

Actual P1 HTML fragment, not a simulated browser rendering:

```html
<em>只有当力对运动的物体作用时，才可以谈到力的功。<br>如果<span style="text-emphasis-style: dot; text-emphasis-position: under;">运动的</span>物体受到几个力的作用，其矢量和等于零（物体做匀速运动），则所有力的功的代数和等于零，但是，每个力所做的功并不等于零（除了其方向垂直于位移方向的一些力）。</em>
```

For every affected emitted HTML fragment, executable assertions confirmed:

- Starts with `<em>`, ends with `</em>`, and contains exactly one opening and one closing outer emphasis tag.
- The named source word is enclosed by the exact balanced under-dot span, once in its block. Source CSS semicolons do not create prose lines or paragraphs.
- No literal `*`, escaped source angle brackets (`&lt;`, `&gt;`), or exposed tag/CSS text. The source span is emitted as markup, not Latin prose tokens.
- Exact formula inventory survives normalization: P2 `\frac{mv^2}{2}`; P3 `m|\vec{g}|h`, `h`, `\frac{kx^2}{2}`. Actual `proseInline` emits respectively one and three `sr-nb` math fragments, with no `katex-error` or `sr-tex-err`.
- Removing only the per-paragraph outer wrappers and inserted sentence newlines reproduces each affected original template text exactly, including source tag bytes and formulas. All other fields of these blocks, including `source_text` and `source_refs`, are unchanged in memory.

## Other Wrappers Only

| Unchanged block | Actual final paragraph count | Mechanical observation |
| --- | --- | --- |
| `prose[0]` | 1 / P0 | PASS: balanced Markdown wrapper; emitted fragment has exactly one closed outer `<em>` and no literal stars. |
| `prose[4]` | 1 / P4 | PASS: same wrapper-closure result. |
| `prose[5]` | 1 / P5 | PASS: same wrapper-closure result. |

No physics or other semantic judgments for these three blocks were reconsidered. Their first-review PASS findings are retained. The summary lesson template and raw source byte hashes are exactly the original reviewed hashes; the companion exercise/figure template hashes also match the first review. Source snapshots, words, mathematical content, quantities, and zero exercise/figure content have not been edited.

## Hash Binding

All paths are relative to `/Users/yong/.codex/worktrees/0f12/lemmadeck`. T abbreviates `.tmp/ld-s10y-lesson/b57-summaries/work/adapt/8p/modern-us-neutral/lessons/phy8-c4-s2-t15`. SHA-256 binds this approval to the following bytes:

| Input | SHA-256 |
| --- | --- |
| `.claude/skills/ld-s10y-lesson/tools/edition.py` (current repaired normalizer) | `7a7f42d0e093db45ea3b39aa670548234d7bae6d27e71a77a8b8917af0842860` |
| `.claude/skills/ld-s10y-lesson/tools/htmlfrag.js` (current repaired fragment renderer) | `da12c7ba1a2848e6626e527c49c41a070466bb606feb55a51930ddc5ec32488e` |
| `.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs` | `f2a16357e2a0d5f8541b0cb401c5193c9cb10f6333dc16f92d5c7a18a5bee309` |
| `T/lesson.template.json` | `445c0e60e47167cf0f4713e22f94cad855882db9aea981fdd6ccb065d2054e5d` |
| `T/exercises.template.json` | `4f7106c3bac9d79f5e337fa480876f558f7fdb8473972f1f541c0f3e95ac98dc` |
| `T/figures.template.json` | `a6f65d473919367903596c61c3723123205022e28e773fc74024c7a686516288` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c4-s2-t15/lesson.json` | `0e42fca5e9253c3b56b36f54bce08c21709a33f55745e4b4a0bc3d6ec97baf84` |
| `.intentfold/tickets/STEMROBIN-180/modern-text-review-replacements-b57.md` (retained first review) | `97f2ebbfb3c15b51153393c757e214908a05a59caa4352dda43e11df374812a7` |

## Execution Boundary

- `B57-SUMMARY-R1-EMPHASIS-01-CURRENT-AFFECTED-FLOW`: executed the five required AST nodes from current `edition.py` with `python3 -B` in memory; actual flow/inline functions and affected text/math/span/closure assertions PASS.
- `B57-SUMMARY-R1-EMPHASIS-02-OTHER-WRAPPERS-ONLY`: outer-wrapper closure only for blocks 0, 4, 5; PASS.
- `B57-SUMMARY-R1-EMPHASIS-03-REPORT-BINDING`: separate report-only write and hash consistency verification.

The parent's seven Python and six Node focused first-pass test results were not rerun or newly certified here. No full review, physics research, network, images, browser, `adapt-finalize`, source/template/code edits, DB, or commit operations. Original review and R2 date review remain untouched.
