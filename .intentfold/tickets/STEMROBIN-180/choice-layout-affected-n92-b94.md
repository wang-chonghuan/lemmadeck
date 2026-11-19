# STEMROBIN-180 b94: n92 Layout-Affected Snapshot Binding

## Scope and Outcome

**Affected binding PASS; original semantic PASS reused unchanged.**
This is only a new snapshot binding, not a replay of SOURCE, BLIND, or FINAL.
No image or answer/audit artifact was opened. No with-review validator,
author repair, adaptation, canonical retention, or publishing ran here.

The parent explicitly bound the independently approved layout to Hypatia
manifest SHA
`2f81c42497b4396182ebbd6160320f97095cf672db03216a1169fdbf41c4753d`,
reporting `17` whitespace-only layout blocks and `0` code findings. The parent
also reports successful affected adaptation/retention and unchanged answer-key
and audit bytes. Those authorized facts are reused, not independently
reinspected.

Retarget manifest SHA:
`639ba45e9673edc1ff1257377a0cff61b09f090ab9d369201bb1ec4e6f20718b`.

## Exact Affected Differences

The old and retargeted complete seed objects differ only in four selected
concept texts and the full lesson-file trace hash:

- Block `0`: one space after a sentence-ending period becomes a line feed.
- Block `1`: one space between the definition and symbol/unit sentences becomes
  two line feeds.
- Block `5`: two sentence-separating spaces become two line feeds.
- Block `8`: two sentence-separating spaces become two line feeds.

These are exactly `6` old ASCII-space gaps replaced by `7` line feeds. All gaps
are after sentence-ending periods and outside inline math. Normalizing only
ASCII space/tab/CR/LF runs produces equal before/after texts, and every complete
inline-dollar math span remains exactly equal. Coefficients, units, hypotheses,
directions, parentheses, punctuation, bold markup, sentence order, and all
non-whitespace characters are unchanged. Selected block `6` is entirely unchanged.

Restoring the old concept texts and trace reproduces the complete old seed
object. Both seeds' schema, selectors, exercise prose/relationships, and empty
figure list are otherwise exactly equal.

The selected book/index trace is current and unchanged:
`787fa632f73a0baec26d69a3a48d7e72b9b12da4853d964f8da2e8ed96f4f18e`.
This is the official canonical selected-index projection, not a whole-book
byte hash. The only changed trace is the lesson file:

- Old lesson SHA:
  `2b82aeabc64abb7395341556744197c8668ef68b1bdfb9f0d8a1f4923dcdf963`.
- Current lesson SHA:
  `cc00466a273ebe2d0260c770c0234f52b88c4c4fe1392c7c1cf15188b6444efe`.

Current exercises and figures hashes equal the old and retargeted traces:
`b386ec738bfbd1aed614b285246462e76ee3fd171b91305f7aa0d58ea5bf7739`
and
`f802dec21e7441c152a2250cd6a308703952f7d2562d9032cce60ee17f50a2af`.

The entire retargeted draft object equals the original after restoring only
`seed_sha256`. All three question objects, all learner views, keys and
rationales, intents including source solutions and limitations, coverage, and
`new_figures` are exactly equal. Serialization whitespace in the full draft is
not a changed content field.

## Official Fresh Projection

One read-only `prepare.prepare_seed` call used book `7p`, lesson
`phy7-c1-s1-n92`, exercises `1-5`, selected blocks `0,1,5,6,8`, and no concept
figures. Its current full projection, including all four trace entries, equals
the retargeted seed object exactly. The official `prepare.digest` results are:

- New seed canonical SHA:
  `4fe72b66633fca10d4b29160f871c15396562fa80ec4f0b8e7ee015cecdb92b7`.
- New draft canonical SHA:
  `6ce553f7213f3e8e7ec4435b77a405addc205c2a0d424cc4c66b58131de51a2a`.

The call returned `0`. It generated no seed or review output and used
`python3 -B` to prevent bytecode writes. No with-review validator was called;
the parent reserves its one retention-validation invocation.

## Review Preservation

Original FINAL review byte SHA:
`8e99bb1b47992df144add3f81c49b945de34ddeabbb0d219ec4a1d993db7594d`.
The original review and its original manifest remain read-only and unchanged.

An exact copy is rebound by changing only `seed_sha256` and `draft_sha256` to the
new canonical digests above. The new review is checked against the exact two-line
byte transformation and against full JSON equality after restoring those two
fields.

All seven other top-level fields are retained exactly: `schema`, `reviewer`,
`source_reviews`, `figure_checks`, `new_figure_reviews`, `question_reviews`, and
`outcome`. In particular, the original independent solutions, source coverage,
fidelity/redundancy/leakage evidence, complete true sets, all fourteen option
checks, and `pass` outcome are not changed or re-approved.

The inherited evidence still contains `5` source reviews, `11` source tasks,
`3` question reviews, and `14` option checks. Repeated SOURCE/BLIND/FINAL stages:
`0/0/0`; images `0`; with-review validator calls `0`; findings in the affected
binding `0`.

## Sealing and Stop

The rebound review, separate affected evidence, this durable report, and the
hash-bound manifest are frozen `0444`. The manifest binds exact original and
retargeted inputs, current affected source-file bytes, output bytes, and recorder
receipts/streams. The current selected book/index projection is evidenced by
the official API receipt, not by requiring unrelated whole-book bytes to remain
fixed.

The substantive difference and preservation evidence is recorded here without
requiring scratch files to understand it. No other artifact or action is owned
by this affected binder.

STOP after returning text, paths, and hashes.
