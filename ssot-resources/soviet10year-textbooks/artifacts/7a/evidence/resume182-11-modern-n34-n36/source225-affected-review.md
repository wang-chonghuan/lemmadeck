# STEMROBIN-182 Source225 Affected Binding Review

W: /Users/yong/.codex/worktrees/d9b1/lemmadeck

Limited verdict: PASS. Only F225-765-б's strict-glyph correction is rebound to the current physical225 / printed219 source triplet. No fresh source-page review, mathematical re-solving, image inspection, lesson completion or downstream approval.

Image reads in this affected review: 0. Source files edited: 0. Finalizers executed by this reviewer: 0. Only this report was written; all shell commands used explicit workdir W. No Git, network, .env, DB or app access. n35 assembly files and unrelated n34 work were ignored.

## Immutable FIRST Binding

Original independent FIRST review remains byte-identical:

```text
d3e246937c84448161141e914b4cbabaf135730d55d93551d5372931cb85900e  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/source221-227-review.md
```

That review independently observed the plain strict `>` in 765 б), eighth physical text row, right-hand subpart, approximately x970-1110/y770-810. This affected check reuses that observation and its sole required token correction, not the finalizer exit as evidence of source faithfulness. The original report's historical REVISE and original triplet hashes are not overwritten.

The original source-grid binding also remains unchanged, verified by file hash only, with no image opening or pixel reread:

```text
ff694c04416b0d648b61c824f7fd5bbb86e4905faf29abdb4e4db77263cf2964  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0225/page.grid.png
```

## Complete Affected Diff

Preserved before triplet hashes exactly match the physical225 baseline in the immutable FIRST review:

```text
ef978f4d64f535f1ba79c8fe11fe6ece1925fc7406449936cc4964f06a41af94  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/source225-before/page.md
018ea72f99dbc7f05a004f1e8fe67a02558254e97ad15dde3a7d593499e7fc47  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/source225-before/page.json
010eff84d3f5abc6ffe3dd9c3ae8a881625f709e120436a0cabcb0ed684482df  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/source225-before/audit.json
```

Full-file MD diff: exactly one expected replacement at line48. Full-file JSON diff: exactly one string change at line73, JSON pointer `/blocks/2/lines/1`. A recursive comparison found no other changed JSON value. A full-string comparison confirmed current MD equals before MD with exactly this one subpart token replacement:

```text
BEFORE:
а) $\sqrt{c^2}$，设 $c\geq 0$；　　б) $\sqrt{a^2}$，设 $a\geq 0$；
AFTER:
а) $\sqrt{c^2}$，设 $c\geq 0$；　　б) $\sqrt{a^2}$，设 $a>0$；
```

The sole unique correction is `\geq` -> `>` inside 765 б)'s condition. Same-line765 а) `c\geq 0` is unchanged. Next-row765 г) `a\geq 0` is unchanged. Radical, exponent, original subpart order, punctuation, whitespace separators, physical folds, metadata, block types, open/cont flags and all other content are unchanged.

Current MD frontmatter equals page.json.meta; every block-body line equals its corresponding JSON line. Current audit.json is byte-identical to the preserved before audit. No new issue or further correction is identified within this limited scope.

## Current Triplet And Audit

```text
81961264bffdfad45de04ad88358363b94166d3e60d27654417770bd546b1ef0  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0225/page.md
02b5378d198461472c25f18b66f3892e7c4212e528b177a5bfa77e9f0161aed9  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0225/page.json
010eff84d3f5abc6ffe3dd9c3ae8a881625f709e120436a0cabcb0ed684482df  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0225/audit.json
```

Counters: 27 MD / 27 printed lines; 8 blocks, comprising7 ex fragments and1 footer; figures0. Audit errors, normalizations, unknown_chars and katex_warnings are empty; errata0. These are unchanged mechanical facts, not a new image-based assessment.

## Reused Affected Receipt

Label: `source225-765b-glyph-recovery`. The parent-reported single affected finalize invocation is evidenced by the existing start, receipt and streams below; it was not rerun here.

Recorded cwd: /Users/yong/.codex/worktrees/d9b1/lemmadeck

Recorded command: `.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 7a --page 225 --work .tmp/ld-s10y-lesson`.

Started2026-11-18T23:17:36.214Z; finished2026-11-18T23:17:36.626Z. Actual exit0; signal null; error null. Start and receipt command/cwd/start time agree. Both stream hashes match their receipt bindings; stderr is empty,0 bytes.

Saved stdout records8 blocks,27/27 lines,0 figures,0 normalizations and mechanical pass. It is byte-identical to the original225 FIRST stdout, which is expected for unchanged counters and is not proof of the glyph; the full diff plus prior independent source observation provides that binding.

```text
a7d26aff0cf91d9ce04dae4bd9351c1af62a52f90461095d65f1bc5579d3e21b  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source225-765b-glyph-recovery.start.json
b21310ad6838d40f439de375bfff9eb86460b8b9fbda69dc6d76fbcba30ccaaf  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source225-765b-glyph-recovery.receipt.json
a5de10ec8359739e3e583d37c327f3a44cc27d223aa7fe18115242ca0f67767d  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source225-765b-glyph-recovery.stdout
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source225-765b-glyph-recovery.stderr
44fc7840565d32e01f4750c214abc7c0029a66a8cf67c24857074b32c28bd9b7  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/run-stage.cjs
```

The runner hash matches the existing baseline. The runner was hashed, not executed.

## Six Unaffected Pages

Hash-only comparison to the immutable FIRST review: physical221,222,223,224,226,227 each match all7 baseline file bindings: page.md, page.json, audit.json, page.png, page.grid.png, page.template.md and layout.json. Total42/42 unchanged,0 mismatches; this includes18/18 source-triplet files. No image reopening, source rereview or finalizer invocation. Existing six-page conclusions are retained, not reissued as new reviews.

The18 unchanged durable source-triplet bindings are:

```text
61917c4e3fa6cdf1af49897dbc88a37f2bceeac8a0a4985c6d9b4be7b6bd69bb  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0221/page.md
bdf6d8e5283021ee302b992d7edd0eec3b34032147cc632f2181071d9a93ecef  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0221/page.json
0ee9c24fc6a29e36c81419701a498aeec3cb7151aa4bbefc3e6352c9150cb6f9  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0221/audit.json
1007d32ccdd15de082e9a5b3df3169927f75379dbf6c42f3c3b341507dce780c  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0222/page.md
e514a1851229912593dd3d6a2d40e366b1735b4e02d9975e5bf68e570e0c4767  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0222/page.json
54b75e2ac874240b39c18b087792db82358d0aaccbbef0b30c54a7c0212ca99d  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0222/audit.json
d2737a24eaebdab8ff17afeb94d230cbc277dcd6f5cae0c3b0939c04c7efaa20  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0223/page.md
95ae90da0d955fe9d8b5644a46ca4ce8474ba23e17708266697621f740fbc4a1  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0223/page.json
df675dc0494c6cfe7de3f9482d65225245137249c7f454759da6caae10b3ffdf  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0223/audit.json
2722e35b916158bb4619f72f8aa1a5a1d7facac351b2c52cea6bbc5a1a9fe9fe  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0224/page.md
19ebd8af694362da30e1ba132612da778c550705a532771a0d085f1cc890ea61  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0224/page.json
40d82361af839f0ad17518b3833312c1125f6c806dc601659b26d27b1e1f0df2  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0224/audit.json
9ca297130b74f6e5045a2f9372b8094cdc4046f7f1a293434f8f151325e61666  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0226/page.md
597ce0b74fc5220f6d965c9ecd98e11aaa717d8634db30350d8e4cfb34d96910  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0226/page.json
5daa57519c6e52063312054effeee2f6d17d976b30468b9f24f29efea6b24da8  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0226/audit.json
afa09684990cce1512c4fbef7c36424fce995d2e802ee10fa5862122608427f7  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0227/page.md
d07991bcf4c4d2c7dd58d7c920c7f703e1fac6319174150e94acf834b15bdf52  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0227/page.json
d27467b347a0e15ad386c2ea3d9867b299eb98107589488fe01503551fe64997  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0227/audit.json
```

Limited closure: F225-765-б is resolved for the current hashed225 triplet. The remainder of225's prior independent review is inherited because the full before/current diff is confined to that exact correction. All unit boundaries, n37's open status and downstream-approval limits in the FIRST review remain unchanged.
