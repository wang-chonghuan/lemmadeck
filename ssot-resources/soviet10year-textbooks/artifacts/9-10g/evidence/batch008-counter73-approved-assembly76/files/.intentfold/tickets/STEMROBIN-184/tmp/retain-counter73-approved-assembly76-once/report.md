# Counter73 Assembly76 Retention First Failure

Ticket: STEMROBIN-184. Retention only. Requested durable archive:
`ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch008-counter73-approved-assembly76/`.

## Actual Outcome

The helper was authored through apply_patch and executed exactly once:

`node .intentfold/tickets/STEMROBIN-184/tmp/retain-counter73-approved-assembly76-once.mjs`

Actual exit1. The assertion failed during read-only preflight, before archive
creation or any payload copies. The durable archive does not exist. This is
not a completed retention manifest or PASS. No helper retry was performed.
The unmodified helper, first command.json, empty stdout.raw and full stderr.raw
are preserved in the real ticket tmp.

No tests, source gates, prepare, finalize, assembly, promotion, source/code/history
edits, image displays, browser, DB, Git, dependencies or other-worker writes ran.
Only the new retention helper and its failure/report/manifest files were written.

## Exact Cause

The helper indexed the v6/finalize/assembly packages and three previous durable
retention manifests. It mapped historical inputs by hash and refused any
unresolved nonimage frozen reference. Four p73-finalize protectedRecords
referenced old p80-83 page.md bytes that no longer match the live page.md.
Those historical copies were outside the helper's indexed roots.

The exact first assertion was:
`Unresolved nonimage frozen references ... 4 !== 0`.
The four occurrences are protectedRecords[209..212] in both
source-9g-p73-approved-affected-finalize/before.json and release.json.

This is a retention witness-index coverage defect, not a counter defect,
not a new source acceptance failure, and not evidence of unauthorized drift.
The old protected hashes must not be replaced with current MD hashes.

## Located Exact Witnesses

A subsequent read-only metadata/path/hash lookup located all four original
byte witnesses under the existing source80-83-supported-corrections directory:

| Page | Exact Frozen BeforeCopy SHA256 | Current MD SHA256 |
| --- | --- | --- |
| 80 | f4d18529136bde2b48c6b2e96137e2f701267a8012ae5b5e0b818eeac2ea1956 | 8d741a41158321c9a9b15896594fe6d2af06b8dce839527a700f09aebf4b8d71 |
| 81 | 3e0b1688eaedec74b631b21dd519e287a8e38c618d215b5191348caf7ea4ceee | d169731aa76543e99c5d5c533d868c69129ddd211650c4f646510cfcc8f487dc |
| 82 | 8dbd8715fab74110b94265b292461e3160381be4fbac286cb823249628a42c2e | 32f4ff9dad0dcd89c133c9d8ac15f8d6391540c8910901fe10e461219b61653d |
| 83 | bd2c2bf62905f67b861af6bc7ad65a3eeff1d1e9ad4ef4d29fa0f89bffed6163 | 54ca781dc94a8dae0b9c7af6e206ed92b11c58ea7626720fe27e6ffd11672490 |

Witness paths:

- `.intentfold/tickets/STEMROBIN-184/tmp/source80-83-supported-corrections/before/80.md`
- `.intentfold/tickets/STEMROBIN-184/tmp/source80-83-supported-corrections/before/81.md`
- `.intentfold/tickets/STEMROBIN-184/tmp/source80-83-supported-corrections/before/82.md`
- `.intentfold/tickets/STEMROBIN-184/tmp/source80-83-supported-corrections/before/83.md`

All four are regular files and match the exact release protected hash.
Only bytes for hashing and before/after metadata were examined, not source
prose or review content. No changes were made to these other-worker files.
before.json records each beforeCopy path and frozen SHA256. Its SHA256 is
5a87a02f4626bb579cc1b310a4cbaddc82db0aed70bc7bd63f71826c2c232891.
after.json SHA256 is
348e8ca40964703650f19470e9352f3e726da2bb9e23a6130bb5a154ad97031e.
Its recorded status is SUPPORTED_C01_C02_ONLY_SOURCE_EXACTNESS_HOLD.
This report does not review or clear that source scope.

## Frozen Approved Records

Read-only identity confirmation after the helper failure:

- Production layout.py:
  0e03889f54d21a3f509e1da1f3d1eebef88d9f531a558a346197c59aada25014
- Complete v6 report:
  22db870a480d117c186098cdc620505f2feeafaf7c1416592b86b50b7d757e93
- Parent approval:
  45759de7d8897eb841e310a4e3b72febca6ca3a4d98f7c85c573a29a10580aec
- Sole73 release:
  ca5d1336e4c2a4066a44954959a2d2ec9bf98c7bdc9d0f323652da191eef2d96
- Approved assembled book:
  5b63a28aa65fe2ce87bf8ddb4a3c9dcb3eef85b572d42812ce84172e25a4b20d

These records remain unchanged. The recorded parent sole73 finalize and
assembly successes remain historical successes; neither was executed here.
All historical v1-v5 failures and old candidate/unapproved prose remain untouched.

Parent first production patch-anchor failure text, retained verbatim from approval:

First parent apply_patch failed before writes because the supplied line_bands signature anchor was wrong. Tool output: Failed to find expected lines: def line_bands(ink: np.ndarray, content_w: int | None = None) -> list[tuple[int, int]]:. Corrected only the patch anchor to the actual required content_w: int signature. No test, source gate or finalize ran during that failure.

## Failure Evidence And Disposition

- Helper: retain-counter73-approved-assembly76-once.mjs,
  SHA256 02f3c859b567b9f5decf041a69dea60cdeba768dab3713e3788eac728a872e9e.
- Actual command.json, exit1/invocationCount1:
  SHA256 528743bf788a077e58929d8577610a2ce5f769b00c6635f620e3aa9bd679fe24.
- stdout.raw,0bytes:
  SHA256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.
- stderr.raw,2748bytes, original full assertion/stack:
  SHA256 a176f29a2911c56702f41ccd38595c1affc052c6f685b7ccb949333f529227b0.

Minimum continuation is additive retention-only witness indexing of these four
beforeCopy records, retaining the original helper and its failure evidence.
No source edits or new source gate is needed to resolve this mapping.
The once-only execution was consumed; no automatic retry or archival workaround
was attempted. Parent disposition is pending. The requested durable archive is
still uncreated, and this report/manifest explicitly records incomplete retention.
