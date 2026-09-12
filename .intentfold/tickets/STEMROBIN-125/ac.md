# STEMROBIN-125 Acceptance Check

The live Plane ticket remains the requirement authority. A single ticket-scoped Node script under
`tmp/` will execute all checks and exit non-zero on the first failed assertion.

## AC1: Exact Four-File Charter

Check the direct file entries in `.intentfold/charter/`.

Pass when the set is exactly:

- `product.md`
- `engineering.md`
- `ui.md`
- `operations.md`

## AC2: Required Section Order

Parse every Charter file's level-two headings.

Pass when each file contains `Contract`, `Tools`, `Guidance`, and `Redlines` exactly once and in that
order.

## AC3: Current Session Routing

Inspect the machine-owned session entry and active non-frozen routing references.

Pass when the session entry names the four current dimensions, contains the Charter-format protocol,
and no active reference points to `dev.md`, `arch.md`, `runbook.md`, `qa.md`, `devops.md`, or
`format.md` as a current Charter file. Frozen history and completed ticket artifacts are excluded.

## AC4: IntentFold Development Preflight

Apply the current IntentFold layout predicate to the worktree.

Pass when all four required files exist, no former-layout file exists, the port contract validates,
and the preflight reports no legacy Charter-layout stop.
