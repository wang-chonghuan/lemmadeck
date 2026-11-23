# First Modern Finalize Failure

Date: 2026-11-23. Actual exit code: 2.
Explicit workdir: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
Command:

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-finalize --book 8p --edition modern-us-neutral --lesson phy8-c1-s1-n5
```

Actual tool output:

```text
ERROR phy8-c1-s1-n5: lesson.errata[p0031-fig22a-arrow] 必须绑定数学原式与修正式
ERROR phy8-c1-s1-n5: lesson.errata[p0032-projection-algebra] 必须绑定数学原式与修正式
ERROR phy8-c1-s1-n5: lesson.prose[29] 的数学公式变化没有匹配已绑定勘误
ERROR phy8-c1-s1-n5: lesson.prose[29] 声明 math-correction 但没有已绑定勘误
ERROR phy8-c1-s1-n5: lesson.prose[38] 声明 math-correction 但没有已绑定勘误
```

The actual failed lesson template is already retained byte-identical as
`modern-text-reviewed.template.snapshot.txt`, SHA-256
`0d64d52579593024087aec5f033d4a429e63075c1297bcf1913fc967788f6ef5`.
All nine actual modern figures have independent PASS and remain unchanged.
This is a validator-contract failure for source-bound semantic/figure errata,
not a failed source/text/figure review or permission to remove the corrections.
No successful modern finalization, display, commit, push or DB write is claimed.

## Affected Recovery

The first failure above remains the actual historical result. The pre-repair
validator bytes are retained in `edition-before-semantic-errata-fix.snapshot.txt`.
The smallest repair permits registered wording/figure disclosures without an
equation while still forbidding a formula erratum from erasing its formula.
All existing source/target/hash/original/replacement checks remain unchanged;
unrelated mathematical or numerical changes still fail.

Ten new semantic-contract tests, ten existing owner/source-binding tests and
eight existing erratum/math/culture/numeric controls passed (28/28).
Only affected n5 adapt-finalize was rerun: exit0, PASS, 16/43 prose blocks
changed, zero exercises, nine current figures. The reviewed template, source,
approved SVG/spec and independent review bytes remain unchanged. Full-project
tests/build and publication were not run.
