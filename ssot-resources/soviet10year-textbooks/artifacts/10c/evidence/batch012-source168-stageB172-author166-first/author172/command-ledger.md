# Actual operations and stream coverage

This is source authoring inside the existing invocation, not a new capability.
No command below is a setup, backend operation, pipeline count, test, or finalize.

Initial read commands and their observed exits are indexed in initial-observation.txt.
The exact initial absence stderr is preserved there. The other initial read raw tool
outputs remain in the conversation, not separately captured execution files; no claim
is made that this directory contains a complete raw transcript of those early reads.

## Generated command records

- command-001.json: actual Node executable and complete -e args; captures all supplied
  template/layout/prepare bytes, SHA and raw text into source-inputs.json, then metadata-only
  path/bytes/WH/SHA preload for original172. Exit 0, stdout captured, stderr empty.
- command-002.json: actual Node metadata-only preload for original173. Exit 0, raw streams.
- command-003.json: actual existing Python executable and -B/-c args for one Pillow crop.
  Source rectangle [210,415,1360,530], native1150x115, no resize. Actual child stdout,
  stderr, exit and transport metadata-preload stdout separately captured. Exit 0.
- command-004.json: actual Node metadata-only preload for original174. Exit 0, raw streams.
- command-005.json: actual Node metadata-only preload for original175. Exit 0, raw streams.
- command-006.json: actual existing Python executable and -B/-c args for one Pillow crop.
  Source rectangle [210,1225,1505,2160], native1295x935, no resize. Actual child stdout,
  stderr, exit and transport metadata-preload stdout separately captured. Exit 0.
- command-007.json: own four authored Markdown files read as text, SHA/bytes and filesystem
  inventory-before-MD birthtimes observed. Complete output raw text stored in bundle.json
  and this command stdout. Exit 0. This is not a count, validation, or independent review.

Earlier prepare commands are supplied inputs, not run by this author. Their exact args,
dates, exits, stdout and stderr are preserved inside source-inputs.json with measured
input-file hashes. Any earlier success message is not an authored-page PASS.

## Image operations

The six exact view operations are indexed in image-ledger.json. All used
functions.view_image with detail original, once per path, following textual preload.
No browser, OCR, resize, grid view, reopen, or pixel payload in the text bundle.

## Manual writes

All manual text writes used functions.apply_patch, with successful tool results:
initial README/absence record; then inventory172 before page172; inventory173 before
page173; inventory174 before page174; inventory175 before page175. The final patch
updates only this directory's README and adds this ledger, image-ledger.json,
projections.json, and handoff.md. Full patches and result streams are in the conversation.
No existing page.md was replaced, no peer file or T/ path was touched.

## Final generated integrity operation

The last Node command generates the manifest, source-output SHA TSV and seal. Its
complete executable/args and raw stream are recorded in command-008.json. It hashes
only the four owned Markdown paths, prepared text-input files, and this owned author
directory. It does not load pixels into the context, run counts/tests, or promote
anything. Original/crop pixel evidence remains referenced by already measured preload
hashes. Manifest sealing is file integrity only, not authenticity or correctness proof.
