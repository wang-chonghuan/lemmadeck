# STEMROBIN-182 Affected Numbering Review

Verdict: **REVISE** tooling; **PASS** source numbering metadata and isolated candidate fidelity.
Offline finish:review. Sole cwd: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`. No permanent HOLD.

## Findings
1. **P1: Book-answer authority bypass.** `assemble.py:388-399` accepts missing/null records as printed source736 and self-consistent forged ordinals. `lesson_answers.py:215,312` trusts this result without current source comparison. Observed candidate786 with no record picks unrelated answer736; forged number+corrected787/source736 picks answer787. A continuation reference, records without id/reason, and synthetically stale id/reason compared with the current page ledger are also accepted. Fix fail-closed missing/shape checks and exact authoritative start-block binding before lookup; add negative cases. Preserve approved source text and ledger.
2. **P2: Numbering-only edition gate skipped.** `edition.py:221-226` returns before the new comparison at202-210 when no mathematical erratum exists. On actual231/232 page metadata, three numbering records produce zero authority calls. Validate numbering authority independently of mathematical errata; test stale/forged raw+modern bindings. Current n37 includes page229 mathematical errata and therefore enters this gate.

## Settled Proof
- Current231 stripped of only the new ledger restores entire FIRST MD/JSON bytes and structures.
- Current232 stripped of ledger and reversing ONLY inherited verified exponent6->8 restores entire FIRST MD/JSON bytes and structures; unmodified original audit bytes remain identical.
- Inherited independent pixels establish printed736/737/738. Ordered new objects between785 and789 uniquely give786/787/788; the736 continuation adds no object. No mathematics was guessed or changed in this review.
- Candidate777..798 has22 objects. All other candidate fields match FIRST after removing numbering-only additions; exact printed text/lines/source_number and786 refs p0231#8+p0232#1 are preserved.
- For each actual candidate786/787/788, a lone old sameprinted answer returns None; adding its canonical ordinal selects only that key. Answer data are sentinels, not mathematical answer approval.
- Source validator negatives and immutable edition metadata comparisons reject invalid inputs. Real missing790 and unregistered786..788 still produce gap failures. Ordinary book/lesson/lesson-group and legacy answer behavior match tracked HEAD in scoped pure-helper cases.
- FIRST assembly exit1 and corrected isolated assembly exit0 are reused. Existing focused5, assembly25, answer8 and edition51 test receipts pass with verified stream hashes; no suite/producer reruns. Historical receipts lack code digests.

## Limits
No actual canonical answer-content verification, durable lesson promotion, full downstream verification, or whole-batch/ticket approval. layout.py and original fraction baseline remain excluded. No images, DB, network, app, dependencies, publishing, Git writes, chats or agents. Only reports were written. Hashes identify bytes; they do not substitute for the semantic evidence above. Parent must make the scoped reversible tool fixes and verify affected failures only.

## Binding
JSON: `.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/numbering-affected-review/numbering-affected-review.json`
SHA256: `5bcb3861df2bdc606df0ca3e40f88012e47c9aee7aa0b8c961e1342aec3552bb`
Exact current code/source/candidate/review/receipt SHA256 and byte sizes: JSON `references`.
Independent report hashes: `report-hashes.json`.
