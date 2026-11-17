# Parent Delta Preflight Failure

Command: `node .intentfold/tickets/STEMROBIN-184/tmp/production-modern103-repair-delta.mjs`

Actual exit: 1. The four text replacements were found, but the helper incorrectly
asserted that the first section-break `after` matched prose index0. The actual
first boundary introduces acceleration at prose index4. The assertion displayed
the acceleration paragraph as actual and the initial coordinate paragraph as
expected.

No content, audit, template or output record was changed by this failed
read-only assertion. The original helper is retained byte-identically as
`parent-delta-helper-before-preflight-fix.mjs` in this directory.

Only the helper's boundary index assertion and its description were corrected
from index0 to index4. This is not another adaptation gate or content repair.
