# S5 Historical Identity Metadata Candidate

2026-11-15. Author only; affected independent review pending. This is not a second full text review or approval.

Preserved the frozen original templates/handoffs and Wegener's first `REVISE` unchanged. Copied the three existing s5 templates to a separate candidate, then used `apply_patch` to change only `lesson.template.json.prose[1].historical_entities`: one retained `term` of `帕斯卡`, with a reason bound to `p0128#3` and `p0128#6`. No biography, prose, source snapshot, math, number, unit, anchor, exercise or figure change. s6 is untouched.

Candidate directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s5-s6/history-repair-candidate/phy6-c4-s5`.

| File | SHA-256 |
| --- | --- |
| Candidate lesson.template.json | 56e9fa2deffddc6bebfc10c140a74b8d85adbb5fcd1efc4c4aa7ef1482f2c161 |
| Candidate and original exercises.template.json | 9952920ce2eada39e878670dba64c61deba0257ec5b43dd68e182f062a74dfb9 |
| Candidate and original figures.template.json | be66c2ce8f5b3d18a873e772626625d60f20c2072493095c015e537fa57c85a0 |
| Unchanged original lesson.template.json | ba206492c4457bda2ec9add399b4c950b2238f8b57178c18154694811afeb6f9 |
| Copied original s5 author-handoff.json | 16ea0baa9f2996f0db4bc1f9e6063414d8b142264469026a615d83f13c1c830e |
| Copied first-REVISE.md | a5c634cce9d89df17cffe5f06121d9f0c494b4109a0e24d380b5a2b667953311 |

Detailed paths and frozen hashes:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s5-s6/history-repair-candidate/author-handoff.json`.

Commands: `mkdir -p` for this new candidate; `cp` existing s5 templates, original handoff and first rejection; `apply_patch` for the sole declaration; `diff -u` original/candidate lesson (exit 1, exactly one declaration hunk); `shasum -a 256` on candidate/original files (exit 0). No finalize, normalization, recheck, assembly, durable/app/DB/Git write or figure rerender was performed for this metadata repair. The assigned initial 110/111/112 figure authoring continues using the byte-identical prose already frozen in its context.
