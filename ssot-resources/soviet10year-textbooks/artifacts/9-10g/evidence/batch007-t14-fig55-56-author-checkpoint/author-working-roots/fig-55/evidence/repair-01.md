# One Targeted Repair

First actual failure: official draft validation attempt-01 exit 2 rejected
`fill: "none"` on the three source-hatching svgPath objects. Semantic fills
are a closed role vocabulary.

Repair: omit exactly those three fill properties. The official svgPath
renderer uses its unfilled fallback when fill is absent. No coordinates,
labels, inventory, assertions, dimensions or line styles changed.

Attempt-01 spec, command, result, stdout and stderr are retained untouched.
This exhausts figure 55's single targeted repair allowance. A defeating
attempt-02 result must become HOLD, not another repair.
