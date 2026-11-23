# Text Correction and Template Recovery

2026-11-23. The independent comparison reported two nonmathematical source
transcription differences. The initial modern draft snapshots retain both the
raw source data and modern text before correction. Only the explanation dash
on page 208 and the exercise 945 introductory colon on page 210 were repaired.

The corresponding official page finalizers returned exit 0 with 23/23 and
22/22 lines. Scoped assembly retained N56's 11 exercises and three figures;
neighboring N55/N57 material remains boundary-only.

The first `adapt-prepare` call after correction returned exit 1:

```text
ERROR: .tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s1-n56/lesson.template.json 已存在；确认重建模板时加 --force
```

After retaining the two original draft snapshots, the same scoped official
command with `--force` returned exit 0. The existing modernizer reapplied Latin
subpart labels, Ben, actual prose-flow boundaries and deterministic manifests.
This was a template-existence recovery, not mathematical or figure approval.
The source tick HOLD and all old reports remain unchanged.
