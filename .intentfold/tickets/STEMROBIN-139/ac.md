# AC1 - Real Figures

Run the current image-skill validator and renderer for all figures referenced by
`alg6-c2-s1-n8` and `alg6-c2-s1-n9`, plus the selected hybrid representative.
The command must exit zero and produce current render reports whose hashes match
the specs and final outputs.

Open the local original/new preview and both lesson pages. Confirm Figure 34 has
four complete relation panels, every member and label lies inside its set, and
all declared arrows match the source inventory. Confirm the remaining examples
retain every required object, value, label, and relationship.

# AC2 - Readability And Themes

Run the ticket Playwright check from `app/` against `http://localhost:52139` at
`1440x960` and `390x844`. It must measure every main SVG label in lesson 8 and 9
at 16px or larger after SVG scaling and report no unreachable clipping or
overlap.

The same check must show that default neutral ink, an alternate existing app
accent, and print black/gray change computed vector colors without changing the
figure structure or invoking image generation. The layered hybrid preview must
retain separately selectable artwork and SVG overlay layers.

# AC3 - Reject Known Failures

Run the image-skill unit tests. Fixtures must fail for:

- a point outside its declared container;
- a required object or source requirement omitted;
- an arrow whose declared endpoints do not match the source relationship;
- rendered text below a declared display minimum;
- review evidence that no longer matches the current spec/source.

The repaired fixtures and regenerated figures must pass the same executable
checks. The publication gate must reject a historical or unverified figure when
asked to republish it.

# AC4 - One Current Path

Run repository searches proving that the deleted SVG-inference entrypoint and
the hybrid-only-flattened manifest contract have no active callers or skill
instructions. Record the deleted/replaced list in `handoff.md`.

Run:

```bash
python3 ssot-resources/audit.py
python3 ssot-resources/soviet10year-textbooks/validate.py
cd app && npm run test && npm run build
```

All commands must exit zero, and lesson assembly/publication must consume the
new final figure contracts successfully.
