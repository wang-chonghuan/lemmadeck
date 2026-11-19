# n37 Offline Authoring

Ticket: STEMROBIN-182, existing invocation, finish: review.

Reader: a Chinese-reading learner studying square roots independently.
Question: when can a square root of a product or quotient be separated into square roots?
Evidence: the retained n37 source lesson and its 22 original exercises.

Keep the source sequence: comparison, product theorem and proof, quotient theorem and proof,
seven applications, and all original exercises. Use short sentences and separately introduced
formulas. Keep every formula and numeric token except the explicitly authorized replacement
of 33 by 36 in the registered example 3 target.

Source snapshots, source_text, source bindings, identities, printed lines, and numbering_erratum
records are not author-editable. The named finalizer owns normalized modern display lines.
Exercise 790 retains its source-supplied worked formats and square-table instruction; no table,
figure, computed exercise answer, answer key, interaction, or choice reading is added.

Section anchors will be copied from the existing prose_flow tool after wording edits.
The FIRST edited template snapshot precedes the named n37-modern-finalize-FIRST call.

This is authorship, not independent text/math approval. Prior independent source/candidate
fidelity PASS is caller-provided context; affected tool-binding review is still pending.
No promotion or semantic approval follows from candidate presence or a mechanical audit status.

Image opens: 0. No source figures.

## FIRST Failure And Scoped Recovery

`n37-modern-finalize-FIRST` exited 2. Its sole diagnostic is:
`exercises[21]` non-formula numeric tokens `want=['5', '2'], got=['5', '2', '3']`.

The source ends in `3.`; the authored text ended in `3` followed by a Chinese period.
`edition.py` uses `ERRATA_NUMBER`, whose negative dot lookahead excludes a numeral followed
by an ASCII period. Thus the source's upper bound 3 is absent from its numeric signature.
The number itself and the inequality requirement did not change.

Retain the FIRST edited templates and FIRST failure audit. Restore only the source-terminal
ASCII period in exercise 798, then finalize the affected template once under a new label.
Do not fabricate numeric_changes, edit source lines, modify tools, or treat this as approval.
The inconsistent punctuation and the numeric check's blind spot are disclosed for parent review.

The affected-only finalize exited 0. Offline HTML generation exited 0 and reported 29 prose
paragraphs and 22 exercises. These are tool execution facts, not semantic or visual approval.
No browser, screenshot, source image, or product page was opened.

The retained exercise `lines` arrays are unchanged from the prepared templates. The finalizer
leaves those arrays unchanged when `text` is already normalized. They still contain the prepared
source-language labels; the offline renderer consumes authored `text`, not `lines`.
Faithful printed lines remain intact in `source.data.exercises[].lines`. This distinction is
included in the evidence report rather than repaired through an out-of-scope tool change.
