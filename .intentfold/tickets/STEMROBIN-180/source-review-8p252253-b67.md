# b67 FIRST Independent SOURCE Review: 8p 0252/0253

Ticket/invocation: C/STEMROBIN-180, continued. Scope: original source fidelity of
0252 and 0253 only. Combined SOURCE result: **FAIL, frozen with exactly one finding,
F1, for the sole repair**. No source repair was performed.

## Gate Distinction

| Page | FIRST prepare receipt | FIRST finalize receipt | Physical rows | Figures | FIRST gate | SOURCE |
| --- | --- | --- | --- | --- | --- | --- |
| 0252 / printed 240 | b66-source252-prepare-first | b66-author252253-source252-finalize-first | 24/24 | 0 | PASS | FAIL: F1 |
| 0253 / printed 241 | b66-source253-prepare-first | b66-author252253-source253-finalize-first | 21/21 | 0 | PASS | PASS at bound bytes |

Both actual prepare and finalize calls exited 0. Finalize stdout reports 12 blocks,
24 rows for 0252 and 11 blocks, 21 rows for 0253; both report zero figures and zero
normalizations. All four stderr files contain zero bytes. Stream lengths and
SHA-256 values match each actual `.call.json`. No prepare/finalize/vectorize command
was rerun or retried. Mechanical FIRST passage is not SOURCE approval.

## Independent Evidence

Opened original `page.png` 0252 with `detail: original` FIRST. Persisted its full
24-row inventory before opening original 0253. Persisted the full 21-row 0253
inventory before reading any author artifact, provenance, or receipt. Neither
author inventory was opened or used as an expectation.

The independent baseline and explicit source-only adjudications are at:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b67-source252253-review/inventory.md`.
The complete normalized row/object expectations and sole frozen finding are at:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b67-source252253-review/expected.json`.

The inventory preserves an initially overreaching interpretation of 0252's
opening object, then explicitly adjudicates it from the reopened original:
the first row is indented as a new paragraph. A reference to an earlier equation
does not prove `cont`. Incoming 0251 remains UNKNOWN. This is not a finding
against the author's plain `p` opening.

## F1: Missing Source Emphasis Dots

Source: 0252 physical row 3, two visible dots under exactly `动能`. The term
`物体的动能` is also italicized across physical rows 2-3. Both properties must
coexist; retaining italics alone loses printed source emphasis.

Affected Markdown:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0252/page.md`,
line 40, first `<!-- p -->` block.

Affected JSON:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0252/page.json`,
pointer `/blocks/0/lines/2`. Context pointer `/blocks/0/lines/1` must retain the
italic opening at the end of physical row 2.

Full actual Markdown row:

```markdown
体的动能*，用字母$E_k$表示. 于是，公式(1)可以写成
```

Full expected adjacent Markdown rows:

```markdown
的速度平方的乘积的一半. 这个量具有特殊的名称，叫做*物
体的<span style="text-emphasis: filled dot; text-emphasis-position: under;">动能</span>*，用字母$E_k$表示. 于是，公式(1)可以写成
```

Full expected JSON scalar rows, keyed by their exact JSON pointers:

```json
{
  "/blocks/0/lines/1": "的速度平方的乘积的一半. 这个量具有特殊的名称，叫做*物",
  "/blocks/0/lines/2": "体的<span style=\"text-emphasis: filled dot; text-emphasis-position: under;\">动能</span>*，用字母$E_k$表示. 于是，公式(1)可以写成"
}
```

Only `动能` receives dots. Do not extend the dot span to `体的`, the comma, or
later prose; do not remove or shorten the italic `物体的动能` scope. This
replacement retains row count, wording, formula, punctuation, and sentence space.
All findings are frozen here as F1 only. This reviewer does not execute the repair
or approve changed bytes on the basis of this FIRST review.

## Complete Comparison

Compared all six complete `page.md`, `page.json`, and `audit.json` files, not selected
snippets. Compared all 45 physical rows, all 23 blocks, every expected object kind,
`open`/`cont`, `samerow`, labels, ownership, boxes, literal wording, mathematical
tokens, punctuation, sentence separators, emphasis boundaries, and footers.
The row-level comparison against the independent expectations found one changed
row in each representation, both manifestations of F1. MD frontmatter and JSON
metadata match on both pages. Both complete audits match their expected objects.

Other checked source features match:

- 0252's nested `$E_{k_2}$` and `$E_{k_1}$` subscripts, velocity subscripts,
  inequalities, and the full bold theorem sentence including the period.
- The dot span on exactly `动能定理`, and the complete two-row dot span beginning
  at `当力不是恒力` and ending at `正确的`, excluding the introductory colon and
  terminal period.
- 0253's first bold sentence starts after plain `因此，` and ends after
  `力所做的功.`; `使物体静` is outside. Its second bold scope includes both
  sentences from `动能是表征...` through `力所做的功.`.
- All sentence spaces, enumeration commas, formula punctuation, two three-row
  aligned calculations, vector arrows on both `F` and `S`, and source units.
- Footers are exactly `· 240 ·` and `· 241 ·`, each occupying one physical row.
- Zero figures, captions, tables, headings, or numbered exercises. `例题.` and
  `解：` remain prose, not fabricated exercise identities.
- 0252's final `根据动能定理得出：` is `p open`; 0253's opening equation is
  `p cont`. This pairing is directly witnessed within scope. 0253 ends with a
  complete sentence-period equation and a closed local object. Outgoing 0254
  remains UNKNOWN; neither neighbor image was opened.

0253 literally prints `2 千米` in the question, `200 米` in the force denominator,
and `125000 牛顿` / `125 千牛顿` as results. These bytes must not be scientifically
corrected under this review. The existing errata metadata records the discrepancy
and binds the unchanged original formula to `p0253#10` (`/blocks/9/lines/0`);
its source observation matches the scan. This SOURCE assessment neither adds nor
removes errata nor authorizes a modern-edition mathematical correction.

## Byte Bindings

Flat `[{path,sha256}]` bindings, excluding this report and the binding file itself:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b67-source252253-review/bindings.json`.

They bind all 12 actual FIRST receipt files, all six reviewed artifacts, both
original PNGs, prepared grids/layouts/templates, the source manifest and PDF,
profile, cap1 entrypoint and local dependencies, KaTeX entrypoint/package/lock,
the recorded Python binary/venv configuration, current Node/pdftoppm binaries,
binding skills/charters, wrapper, and this review's inventory/expectations.
Grid PNGs were hashed only, not opened.

The original PDF's actual SHA-256 matches the manifest and both page metadata:
`4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`.
Both original PNG hashes match their prepared templates and finalized metadata.
Profile bytes also match both page metadata.

| Reviewed File | SHA-256 |
| --- | --- |
| 0252/page.md | 6edcf00238edbf174983530b5e83aae51edc2254fdbb33f0c32f3a655e78337b |
| 0252/page.json | 21b409b8914d8096657dc2b2726dbfd752cd5b53c8afd76a4d96cbae6b1bde5b |
| 0252/audit.json | 8ad4696897437e4d1c71836a452122c70dc99831032d35edf214f5bf1bac8886 |
| 0253/page.md | 809d1792a42190f82a31223b53c275c69a62e5e3d6c3bb44a24d416492092115 |
| 0253/page.json | 5a66faebefdfb6c6b2975a633c637a0671306dcbceb7bb2837144b72612bde0f |
| 0253/audit.json | 289dfeb3940a4a5e072de386ec0c5dcfc5c2f23d7e3148023443c93f695213b1 |

Receipt stream hashes attest their recorded output bytes. The `.call.json` files
do not contain historical tool-code or pre-finalize Markdown hashes; current
source/tool associations are bound at review time, not presented as a historical
input snapshot or proof of unseen prior invocations.

## Image Ledger

1. Original 0252 `work/8p/pages/0252/page.png`, `detail: original`, before inventory.
   SHA-256: `0537949d08a7d6a2de9918acbe1d56925a92e411b5e5f67782714a1074093c1d`.
2. Original 0253 `work/8p/pages/0253/page.png`, `detail: original`, after 0252 inventory.
   SHA-256: `1daa738ba5a729265468385a3d9d07dce8d3c77520f3f226e8d8b18acdcf7fcd`.
3. Original 0252 reopened, `detail: original`, to adjudicate source emphasis.
   Same original SHA-256 as image 1.

Total 3/8 images, 0 crops, 1 reopen, 0 neighbor images. No further images.
Only the four requested review artifacts were authored. No setup/freshness replay,
pipeline rerun, Git, DB, publish, deployment, code edit, source repair, checkpoint,
usage, or seal operation was performed.
