# Source-identity clarification

On 2026-11-20, the parent clarified that "raw4m lessons/..." described raw 4m
content, not a directory alias or an alternate snapshot. The canonical originals
independently solved in this review are exactly the intended source:

- `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c1-s2-n12/lesson.json`
  SHA-256 `034ba2d11e980ecca27c3f434c9303bce2b3597d2f360cc5638a97d3a7e54176`.
- `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c1-s2-n12/exercises.json`
  SHA-256 `765c89755bb60c191f36f4f5e404f7d4f3bf0216ff1cd8f2a703b9fc8f916fe7`.

Paths are relative to `/Users/yong/.codex/worktrees/stemrobin-187-six/lemmadeck`.
The parent confirms that these hashes, embedded in the current modern templates,
are authoritative. The previously recorded source-identity limitation is therefore
resolved by human clarification, without new source solving or content review.

The original report and failed lookup records remain unchanged:
`review.json` SHA-256
`c121752309478c09cc37662cdf2c19725cd37502da2e9179ab8cabcdfa367dba`.
The existing 18/18 text-content PASS stands. No image access or gates were
performed for this supplement; image count remains 0. Full-lesson and MathLive
gates remain PENDING. No subsequent image task is authorized or started.
