# Modern-edition figures

Modern figure generation is owned by the project skill:

```text
.agents/skills/ld-s10y-image/
```

Load `ld-s10y-image` and follow its cap1–cap4 workflow. This lesson skill only
provides edition text, original figure references, rendering, and publishing.

The compatibility command below delegates to the new skill:

```bash
python .claude/skills/ld-s10y-lesson/tools/figure_context.py \
  --book 5m --edition modern-us-neutral --figure fig-29 \
  --output .tmp/s10y-image/fig-29/context.json
```

Do not create new figure rules here. `ld-s10y-image/figure-spec@2` is the
single source-first contract for deterministic, hybrid, and GPT Image output.
It requires a source inventory mapped to stable object/assertion IDs, declared
product widths with at least 16 px final text, semantic color roles, and a
separate hash-bound `ld-s10y-image/review@1` record.

Reusing an existing FigureSpec or SVG does not reuse its source-fidelity
judgment. Reopen the original PNG, rebuild or recheck `source.inventory`, and
separate source facts from justified modern additions. Byte-identical
regeneration proves determinism only. Grid dimensions and point relationships
must use executable assertions rather than `objectCount`.

The edition manifest contracts are:

- deterministic: `spec`, `svg`, `render`, `review`
- hybrid: `spec`, `artwork`, overlay `svg`, `render`, `review`
- generated: `spec`, `png`, `generation`, `review`

Hybrid artwork-generation metadata is referenced by `spec.assets[].metadata`.
Do not publish a flattened hybrid PNG or embed review state in FigureSpec.
