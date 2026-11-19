# n8 Mathematical Inquiry

Scope: 9c / ana9-c2-s2-n8 recurrence and E70 only. Text-only independent mathematics, not source glyph/count acceptance, Gate2 or lesson approval.

## Independent-First Ordering

Canonical retained 0035-0037 were read first, followed by the finite definition/formulas on retained 0029-0031. Domains and proofs were derived and checked before opening the candidate.

- Independent solution frozen and hashed at `2026-11-19T13:59:08.233Z`; SHA-256 `c8dd8e7ffa92c6df5c3d5f02d929b64f5d8f40c0a31777990769dccd8447e1a3`.
- Candidate first read at `2026-11-19T13:59:12.704Z`; SHA-256 `6e74097c3c79e8cc1256b7f0a820e456f231da27f0d1b988be1792b295539663`.
- All canonical MD/JSON input hashes and contract hash are recorded in `inquiry.json`; complete independent proof details are in `independent-solution.json`, unchanged after candidate read.

## Domains and Proofs

The retained notation counts finite subsets, with integer `N>=0, 0<=K<=N`. Page 0029 includes the empty subset; 0030 gives the finite factorial formula; 0031 explicitly specifies `0<=m<=n`. Blank triangle cells are not a zero convention.

**Recurrence: REVISE the literal source domain, not the identity.** The source attaches `0<=m<=n` to

`C_n^m+C_n^(m+1)=C_(n+1)^(m+1)`.

Its exact finite integer domain is **`n>=1, 0<=m<=n-1`**, equivalently `0<=m<n`. At `m=n`, the symbol `C_n^(n+1)` is undefined. The non-containing subset class has zero members, but identifying that count with an out-of-domain symbol extends the notation. A zero factor obtained by extending the falling-product formula does not establish a pre-existing source convention.

Proof: partition the `(m+1)`-subsets of an `(n+1)`-set by membership of one distinguished element. The two disjoint counts are `C_n^m` and `C_n^(m+1)`. Algebraically their common-denominator numerator is `n![(m+1)+(n-m)]=(n+1)!`; all factorial arguments are nonnegative on the stated domain, including `m=0`.

**E70a: PASS.** Exact finite integer domain: **`n>=2, 0<=m<=n-2`**.

`C_n^m+2C_n^(m+1)+C_n^(m+2)`
`=(C_n^m+C_n^(m+1))+(C_n^(m+1)+C_n^(m+2))`
`=C_(n+1)^(m+1)+C_(n+1)^(m+2)=C_(n+2)^(m+2)`.

This uses recurrence at `(n,m)`, `(n,m+1)`, then `(n+1,m+1)`. Alternatively adjoin two elements and partition by selecting 2, 1 or 0 new elements, with multiplicities 1, 2, 1. The domain is sharp because the extreme old-set selection sizes are `m` and `m+2`.

**E70b: PASS.** Exact finite integer domain: **`n>=3, 0<=m<=n-3`**.

Split into E70a at `(n,m)` and `(n,m+1)`. Their sum is `C_(n+2)^(m+2)+C_(n+2)^(m+3)`, so recurrence gives `C_(n+3)^(m+3)`. Alternatively adjoin three elements: selecting 3, 2, 1 or 0 of them gives multiplicities 1, 3, 3, 1. The extreme old-set selection sizes `m` and `m+3` make the domain sharp.

Minimum cases: recurrence `(n,m)=(1,0)` gives `2=2`; E70a `(2,0)` gives `6=6`; E70b `(3,0)` gives `20=20`. Strict finite BigInt checks through `n=32` passed 528, 496 and 465 cases respectively, with 35 invalid-index calls rejected rather than assigned zero. These corroborate, not replace, the universal proofs.

## Candidate Comparison

- **PASS:** candidate recurrence-domain inquiry, both E70 identities, exact integer domains, every regrouping and proof equality.
- **REVISE, minor wording only:** E70a says two recurrence uses. The written chain has three substitutions in two layers. Say "apply the recurrence in two layers" or "three times"; keep equations unchanged.
- **PASS, local observation only:** the retained 0037 E70 block prints no separate range. Supplying finite domains in a solution is clarification, not evidence that either exercise identity is erroneous.
- **HOLD:** the candidate's supplied physical269/printed262 omission inventory was not independently read or checked here. Its page-local limitation must remain; infer no absence elsewhere and no book answer.
- **HOLD:** canonical errata action, source glyph fidelity, count evidence, Gate2 and full lesson approval remain outside this inquiry. Source64/E59/116 HOLDs are unchanged.

## Minimal Parent Recommendation

Report the mathematically certain recurrence-domain correction: retain the formula and change the attached integer bound to `0<=m<n`. The certainty is conditional on retained transcription, not fresh glyph acceptance. Do not introduce generalized zero notation.

The existing lesson skill requires any later modern-layer mathematical correction to match authoritative source page JSON hash, stable block reference, exact original text and source-to-lesson binding. Parent owns that source-bound errata workflow. This sidecar authors no canonical errata and edits neither source nor candidate.

Only the three files in the specified `n8-math-review` directory were created. Zero images, browser, source-PDF reopen, network/models, installs, workers/chats, database, publishing, finalizing, rendering, Git mutation or charter edits. Parent image count remains permanently 24/24. No owned persistent resources remain.
