# Count-Only Nontext Metadata

Before changes, current page.md/page.json/audit.json for physical
110, 114, 117 and 121 were copied byte-identically to
`production-source110-121-before-count-metadata`.
Original first-finalize failures and counter failures remain immutable.

The complete independent native report
`production-source110-122-margin-and-separator-resolution/report.md`
SHA-256 `787c35f8f94ba92b4bdaa4db83bdcce237c4fc26f3ea337d1bff9dd1ffbf6d63`
and ledger
`62b3b9bc645c8d8d2c33bf7513afcaa5d6c7d635d19490103747bc3c84f40c96`
were consumed in full. Four exact nontext regions were conclusively
classified with source-context separation from text, footer and mathematics:

| Physical | Kind | Native XYWH |
| --- | --- | --- |
| 110 | scan-artifact | [107,2479,438,4] |
| 114 | scan-artifact | [16,2474,1586,40] |
| 117 | separator-rule | [245,1986,483,8] |
| 121 | scan-artifact | [17,823,15,15] |

Only these supported metadata entries and qualified notes are applied.
No expected-count override, body row change, formula change, source pixel
change, source image deletion or figure crop change is permitted.
The existing counting_ink contract validates margin/thin-rule bounds and
only changes a counting copy.
Physical 122 punctuation remains unresolved because the resolver's two
target attempts did not cover that glyph; no punctuation inference is made.

Affected metadata/body-delta assertion and failed-page finalization retry
are pending. This record does not claim an accepted count or completed lesson.
Parent images remain permanently 24/24; no new parent image loads.

## Actual affected-only retry

The preceding pending statement records the pre-execution checkpoint.
The first helper preflight failed before any finalizer ran because two
supported last-note replacements were incorrectly treated as appended notes.
Original helper and observed failure output remain in
`production-source110-121-count-retry`; only this preflight was corrected.

One actual failed-page retry then passed for 110/114/117/118/121 at
22/22, 23/23, 25/25, 18/18 and 20/20. All five source bodies, source PNG and
existing crop hashes, and prior figure geometry remained unchanged.
Metadata changed only as stated above; normalizations were zero.
Full per-page records and structured assertions are in
`production-source110-121-count-retry-after-preflight-fix`.
The other seven previously passing pages were not rerun.

122 punctuation was subsequently resolved as colon by the separate native
resolver `production-source122-125-final-glyph-resolution/report.md`,
SHA-256 `711b7a4ce3877db5fb38b84ac23159be21ba1990e6b97d1514aa440ddb3f47f2`.
The current body already had that mark and was not edited.
These page/count conclusions do not complete a modern lesson.
