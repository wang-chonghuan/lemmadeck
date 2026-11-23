# Figure 215 First Validation Failure

2026-11-23. Working directory:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.

Command:
`.claude/skills/ld-s10y-lesson/.venv/bin/python .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/stemrobin-187/n56/figures/fig-215.spec.json --stage draft`

Actual exit status: 2. The original spec is retained beside this note.

```text
ERROR: assertions[182].a: expected coordinate or point id
ERROR: assertions[182].b: expected coordinate or point id
ERROR: assertions[182].c: expected coordinate or point id
ERROR: assertions[182].d: expected coordinate or point id
ERROR: source.inventory[0]: pointRelationships requirement needs at least two mapped points
```

Repair scope: use the supported four-point perpendicular assertion and map the
two boundary endpoint anchors alongside the corner with within-group
displacements. Tiny unlabeled endpoint dots are explicitly modern additions.
This is a candidate-validation repair, not source tick certification, visual
approval or removal of HOLD-215-TICKS. Unchanged 216/217 specs passed their first
validation and are not regenerated.
