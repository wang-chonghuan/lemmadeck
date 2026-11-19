# STEMROBIN-180 B86 n69 Independent Structural Review

**REVISE: byte preservation failed. Both affected normalized boundaries PASS. STOP.**

November 19, 2026, Europe/Dublin. Existing session180-3; every shell cwd was
`/Users/yong/.codex/worktrees/0f12/lemmadeck`. This is one affected-only
structural review, not another science/TEXT, RAW, source or FIG review.

## Finding

**F01: 13 unrelated prose metadata arrays were reserialized.** The complete
recursive JSON delta is exactly the two authorized anchor values, but the
complete byte delta is not limited to those values. The repair changed compact
`changes` arrays into multiline arrays at:

`/prose/{0,3,14,15,17,18,20,23,25,27,28,30,31}/changes`.

These are **296 extra whitespace bytes** outside the anchor tokens. No array
value, prose text, formula or scientific statement changed. Nevertheless, the
request requires all prose bytes to remain untouched. Structural anchor
correctness does not waive that requirement. Preserve the FIRST serialization
outside the two authorized anchor strings; no content repair is requested.
No candidate correction was made by this reviewer.

## Bound Bytes

Paths below are relative to the explicit cwd above.

| Input | Bytes | SHA256 |
| --- | ---: | --- |
| `tmp/b86-n69-boundary-repair/FIRST-lesson.template.json` under this ticket | 38170 | `57aa71950b4aedf31eb1f46269b2b1134785740524d2a1888c62a17607b9f77b` |
| `tmp/b86-n69-boundary-repair/repaired-lesson.template.json` under this ticket | 38120 | `efb2654a32687749878aa00392e4e5653b87baeaf36260483621893aadd12235` |
| Current `.tmp/ld-s10y-lesson/b86-n69-finalize/work/adapt/8p/modern-us-neutral/lessons/phy8-c4-s2-n69/lesson.template.json` | 38120 | `efb2654a32687749878aa00392e4e5653b87baeaf36260483621893aadd12235` |

The frozen science candidate3 lesson is byte-identical to FIRST. Its existing
independent affected PASS in `modern-text-review-n69-affected-b86.md` is reused,
not rejudged. The current file is byte-identical to the repaired snapshot.

Replacing only the two anchor JSON string tokens in FIRST, in memory, yields
**37824 bytes**, SHA256
`6c64107d576600192ba0a293f3e52c2dd3ac4409561bd0da467c27a8403d9210`.
This is an expected byte-delta calculation, not a written or approved candidate.
The actual candidate is 296 bytes larger.

## Exact Affected Boundaries

The actual retained evidence is the normalized six-object projection
`[3,4,15,16,26,27]` and its single recorded proseFlow call, exit0.
The eight returned paragraphs reconstruct every normalized object exactly.
Only p15/p27 differ from their stored objects, by normalization whitespace;
their non-whitespace codepoints and all other object fields are unchanged.
No normalizer, prose parser or proseFlow was rerun.

| Boundary | Recorded Output Pair | Original Object Pair | Changed Side | Preserved Opposite Side |
| --- | --- | --- | --- | --- |
| `[2]` | paragraphs3/4 | p15/p16 | `/section_breaks/2/before` | `/section_breaks/2/after` |
| `[3]` | paragraphs5/6 | p26/p27 | `/section_breaks/3/after` | `/section_breaks/3/before` |

Boundary `[2]` exactly equals:

```text
before:
机械能不等于还包括内能等其他形式的总能量；
总能量守恒和动量守恒的适用范围比牛顿力学更广，但不能把本节机械能的表达式和适用条件不加区别地推广到牛顿力学不适用的情况.
after:
可以利用总能量守恒定律解许多力学问题.
```

Boundary `[3]` exactly equals:

```text
before:
解得到的这个二次方程，并把例题条件中的数据代入，则得到$l\approx0.5$米.
after:
例题 3. 起重机把质量为$m$的重物从高度$h_0$沿竖直方向升到高度$h$.
此时，重物的速度从$\vec{v}_0$增大到$\vec{v}$.
认为提升范围内的重力场均匀，忽略空气阻力，钢绳的张力始终竖直向上且大小恒定.
```

Both pairs have one exact match in their recorded real neighborhood.
The two synthetic projection joins p4/p15 and p16/p26 are excluded.
The final p27 question remains a separate returned paragraph7; it is not
part of boundary `[3].after`. Both old combined anchors have zero matches
in these neighborhoods. This is not a whole-flow/global uniqueness claim.

All **six other anchor sides** are unchanged, including both opposite sides
above. Boundary `[0]` is unchanged and matches retained paragraphs0/1 as a
preservation control; `[1]` is unchanged and its prior PASS is reused.

## Preservation And History

All 33 prose objects, all prose text/math strings, embedded source data,
source refs, source_text, figures, errata and all other JSON values outside
the two-anchor allowlist are identical. Raw prose serialization is not
identical because of F01. The current exercise template is byte-identical
to candidate3; its three tasks are not re-reviewed. The frozen candidate3
figure template retains SHA256
`d556b9ce2d27a6456598fb07d41f8f0add6244108a576d7cb9d55e31ad523326`.

21 restored non-lesson files match their existing byte bindings. This is
byte preservation only, not RAW/source/FIG acceptance. Image decoding,
opening as an image, display and visual review all0; one retained PNG was
byte-hashed without decoding.

The separate figure owner's current work template is776 bytes, differing
from its older646-byte restoration binding. Its current hash is recorded
as an out-of-ownership observation only. No change is attributed to this
boundary repair, no FIG verdict is made, and no other-owner file was edited.

The actual FIRST adapt-finalize call remains **exit2**, with retained stdout:
`section_breaks[2] must identify exactly one adjacent paragraph pair; matched 0`.
Its original call/stdout/stderr hashes were checked without execution or
replacement. Author structural continuation1, normalizer1 and affected
proseFlow1 remain historical calls, not new reviewer calls. The prior
content-repair round1 and affected science PASS are unchanged. This review
does not assert finalizer success or clear historical technical uncertainty.

## Evidence And Actual Counts

Owned outputs are this report and `tmp/b86-n69-boundary-independent/` under
this ticket: `verify.mjs`, `verification.json`, `first-helper-failure.md`,
`seal.mjs`, and `final-byte-seal.json`.

`verification.json`: **30294 bytes**, SHA256
`213cc6744c96e5db103474183e37f1644f26fad0f3a4d650d1b6935051578757`.
It retains all exact old/new anchor values, the13 byte-format deltas,
the8 recorded paragraphs, input bindings and preservation observations.

Actual new counts: structural review1; affected boundaries2 PASS;
byte-preservation finding1 REVISE; changed anchor sides2; preserved sides6;
selected objects6; recorded normalized paragraphs8; real projected adjacent
pairs5; excluded synthetic joins2; stored prose33 / kind=p31 / tasks3 /
section breaks4. These are not a new whole-parser paragraph count.

Invariant-helper attempts3: first exit1 due to an incorrect canonical-JSON
assumption, second exit1 due to using an older binding for another owner's
working figure template, third exit0 recording REVISE. Both failures remain
disclosed in `first-helper-failure.md`; neither changed an input. Final
byte-only seal1. Shell calls38: exit0=32, nonzero=6, comprising three initial
wrong-path lookups, two helper failures and the expected `diff -u` exit1.
Manual apply_patch calls4. No pipeline or content review was repeated.

New normalizer/proseFlow/parser/finalizer/producer/prepare/science/TEXT/RAW/
source/FIG stages, candidate/canonical edits, images, setup/freshness, Git,
DB/backend, paid calls, services, descendants and messages: **all0**.
Concurrent unrelated work was preserved. **REVISE. STOP.**
