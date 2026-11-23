# FIRST modern-text exact bindings

Date: 2026-11-23. Exact absolute root for every relative path below:

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`

Scratch paths identify the templates actually reviewed; the approved byte-identical copies are retained at durable paths below. This Markdown record does not make a persistent edition JSON depend on scratch files. No source image was reopened.

## Approved Raw and Reused Source Approval

| Exact path | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s2-t1/lesson.json` | `5d6be59edd0be157e3b8f23585c952d3d3776f3e90644b1a3fa8fd3b826b66d3` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s2-t1/lesson.md` | `1549b53d530ab569eaae25611f8444499d02ec0eded5a8ffcca0dde494c37fae` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s2-t1/exercises.json` | `a2c54919ed9a3357266b16bd2cd0a4a1e86a3e4e51e6b8e97c142dc421f8d495` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s2-t1/source-review/first-source-review.md` | `325606524c3ed529df854f0a4fceee91a744a8300fa26d68f3c46a8b58dfb713` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s2-t1/source-review/first-source-bindings.md` | `de243f2a074cea3ef3a45f868165e7b5d5e6865042b1044017d5f5c8c0c67e55` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s2-t1/source-review/first-source-inventory.md` | `3fa446addbb520b4c06d7a6cf8b233f6c75dc3abd67a944d4e64ac207c87db27` |

The promoted raw hashes match the FIRST source-approved scratch assembly hashes. Source approval is reused, not redone.

## Actual Reviewed Templates

| Exact path | SHA-256 |
| --- | --- |
| `.tmp/ld-s10y-lesson/adapt/8p/modern-us-neutral/lessons/phy8-c1-s2-t1/lesson.template.json` | `4222c8ce2126a93db4ac75be8c5bda479ade42a0c3fa3c6b070380d6cf4eb877` |
| `.tmp/ld-s10y-lesson/adapt/8p/modern-us-neutral/lessons/phy8-c1-s2-t1/exercises.template.json` | `4ff3a09c829efc0eefbc5d29ed6e1389e7a36eca6c25279c1f2f719638d918eb` |
| `.tmp/ld-s10y-lesson/adapt/8p/modern-us-neutral/lessons/phy8-c1-s2-t1/figures.template.json` | `eb5587acb17479e958ba3d83ac8ae9957af7a5bfb7ea34257165764a318b6436` |

## Durable Approved Copies

| Exact path | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s2-t1/modern-text-review/lesson.template.json` | `4222c8ce2126a93db4ac75be8c5bda479ade42a0c3fa3c6b070380d6cf4eb877` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s2-t1/modern-text-review/exercises.template.json` | `4ff3a09c829efc0eefbc5d29ed6e1389e7a36eca6c25279c1f2f719638d918eb` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s2-t1/modern-text-review/figures.template.json` | `eb5587acb17479e958ba3d83ac8ae9957af7a5bfb7ea34257165764a318b6436` |

These three copies preserve all original bytes and `status: "draft"`, with read-only permissions `0444`. They must not become writable finalizer targets; changed working templates require affected review.

## Flow Contract and Inspector

| Exact path | SHA-256 |
| --- | --- |
| `.claude/skills/ld-s10y-lesson/references/edition-text-contract.md` | `8deecbc68434e57b30ed8717dc22170a1988a0856af200a1875da58a3334bf90` |
| `.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs` | `f2a16357e2a0d5f8541b0cb401c5193c9cb10f6333dc16f92d5c7a18a5bee309` |
| `.claude/skills/ld-s10y-lesson/tools/htmlfrag.js` | `f93d13654fcfd5fb99d3f7d319fc294a4f9bec71787fd185c62ed9f9193f1c15` |

Actual read-only `prose_flow.mjs --json` execution exited 0 against the reviewed lesson template. It returned four paragraph indices 0..3, mapping to raw block/paragraph positions `(0,0)`, `(0,1)`, `(1,0)`, `(2,0)`, and `resolvedBreaks: [2]`.

Exact tool-returned boundary:

```json
{
  "index": 2,
  "before": "在这种运动中，不能说位移跟时间成正比.",
  "after": "**物体在相等的时间间隔内完成的位移不相等的运动，叫做变速运动.**"
}
```

The full actual paragraph texts are retained in `first-modern-text-review.md`. This review does not claim a finalizer or display receipt.

## Content Binding

- Card: `phy8-c1-s2-t1`; edition: `modern-us-neutral`.
- Source references: exactly `p0054#3`, `p0054#4`, `p0054#5`.
- Complete raw prose objects: 3; actual final-flow paragraphs: 4; boundary count: 1.
- Math expressions in source order: `\vec{s}=\vec{v}\cdot t`, `\vec{s}=\vec{v}t`.
- Changes: layout only on raw objects 1 and 3; none on raw object 2.
- Exercises 0; figures 0; numeric/cultural changes 0; errata 0.
- New images 0; cumulative images 1. FIRST modern-text verdict PASS; revisions 0.
