# Plan

## Observed contracts

- Production rows for `math5-c1-s1-n1` and `alg6-c1-s1-n1` carry `number` but omit
  `sourceNumber`; the published physics row carries both fields. The runtime currently
  collapses a missing field and an explicit `null` into the same blank display.
- The eight affected 6p sections are the only catalog sections whose children are all
  unnumbered supplemental topics. Math sections with children use numbered topics as their
  actual cards, while 7p and later physics containers also have numbered topics.
- The printed 6p page 20 sequence is three questions numbered 1-3, two exercises numbered
  1-2, then one unnumbered assignment. Printed 7p pages 205 and 207 show that question
  numbering restarts in another lesson.
- The lesson pipeline already resolves catalog books through
  `sources/manifest.json`; the answer capture tool still searches PDF filename prefixes.
- Existing 5m and 6a captured-answer artifacts pass their current finalizer and must remain
  valid.

## Route

1. Make display-number projection backward compatible: an absent source-number field falls
   back to the stable exercise number, while an explicit null remains blank. Apply the same
   rule in runtime projection, offline rendering, publication payloads, and product checks.
2. Extend assembly with a `lesson-group` numbering scope. Preserve the first unique printed
   number as its existing internal identity, qualify only later cross-group collisions, keep
   unnumbered `qN` identities, reject duplicate or missing numbers within a real group, and
   require unambiguous figure ownership.
3. Treat a section with only unnumbered children as a publishable main card followed by
   supplemental cards. Keep sections with numbered children as structural groups. Use the
   same expansion in assembly, publication order, runtime catalog, navigation, and counts.
4. Resolve answer source PDFs through the shared manifest. Extend captured-answer validation
   and matching so lesson/group-scoped books can carry a stable exercise identity, a repeated
   printed number, or an explicitly unnumbered item without weakening book-global math rules.
5. Update the lesson and answer skill contracts and source manifest, then add focused
   regressions built from the cited 6p/7p pages plus legacy 5m/6a samples.

## Delivery boundary

No database writes, schema changes, dependency changes, public publishing, paid image calls,
deployment, merge, or ten-book generation are part of this route.
