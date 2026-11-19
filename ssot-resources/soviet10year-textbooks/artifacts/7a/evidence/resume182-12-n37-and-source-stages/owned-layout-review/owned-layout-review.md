# Owned Layout Review

PASS for the self-containment/guard delta only. No new actionable findings.

- staged-layout/layout.py:253-307: local outer-rule centres match the prior affected helper on six independent geometry cases. No unstaged helper dependency; no-brace, no-rule and empty inputs return None safely.
- staged-layout/layout.py:628-638: a braced fraction plus a separate full equation stays at two rows even when the unchanged legacy predicate would return True; a single nested outer fraction still uses that predicate and collapses to one.
- staged-layout/own.patch:6: exactly five owned hunks reconstruct the candidate from HEAD. All other existing helpers match HEAD. The dirty user helper and its entire early guard match layout-before.py byte-for-byte and are absent from the candidate.

Candidate SHA-256: bfb8d1f5207d003b5bafeb9313a63ddc916d0c0d8fed44539a6f4a162fe9a1bd
Owned patch SHA-256: 6c9659b4839a54d4924db3d3ba3368ce59e7cc93856690dabf82a7e9dd5e6397

Reused the existing successful 59-test receipt with four historical skips; no unit test sources read and no suite rerun. Confirmed opaque source-pixel input and page.md/page.json/audit.json hashes unchanged for 229, 233 and 238. Their independently confirmed counts 22, 23 and 25 remain inherited, not re-counted.

One exploratory isolated fraction fixture expected four total rows but returned five identically in HEAD, the prior saved module and the candidate. The original failure and expected value remain preserved. It is an existing row-joining limitation outside this delta, not a new finding. A separate inline-fraction fixture and focused positive/negative expansion-guard probes passed.

A second nested-rule fixture with a solid spanning strip expected one row but returned two identically in HEAD and both saved modules because the unchanged legacy predicate rejects that strip. Its failure is preserved separately. An unbraced nested outer fraction still collapses to one through the reviewed guard.

Staging condition: recheck the bound HEAD, candidate and own.patch immediately before staging only those hunks. Never stage the whole dirty layout.py or excluded-user.patch. No staging was performed. No source edits, image decoding/payloads, network, DB, .env, model, app, dependency, agent/chat, publish, merge, deploy or closure action. No whole-batch approval.
