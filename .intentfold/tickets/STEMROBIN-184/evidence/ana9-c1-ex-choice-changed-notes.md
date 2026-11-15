# ana9-c1-ex q3/q15/q19 Single Authorized Repair

Author: Codex, parent-agent delegation under existing STEMROBIN-184
authority. This record is author change evidence for the parent, not
independent approval and not blind Stage2 input. Forward only the repaired
view-only file to Banach until its changed-view observations are frozen.
No repaired internal draft or key was sent to another chat.

## Retained Initial Failure

Parent reported that Banach's initial Stage3 outcome was `revise`, with
one validator exit3: mechanical contract satisfied, semantic rejection.
Parent retained original seed/draft/views/review and Stage1/2/3 bytes in
evidence. Those evidence files and initial review were not edited here.
This author read only its own assigned units and the explicitly authorized
frozen Stage2 report, not standard answers or other source solutions.

Additional local byte-exact backups made BEFORE this repair:

- `ana9-c1-ex-choice-draft-before-stage3-repair.json`:
  raw SHA-256 `b49fddb6eea3f6c28d8d4dd4ce8943dc02c83ad51ac8781a8ba24771dfa77edb`.
- `ana9-c1-ex-choice-views-before-stage3-repair.json`:
  raw SHA-256 `618b2bfd4f548c975562a2532c6d34a58140df470ce283bab830fcc686f6a263`.

The current old `ana9-c1-ex-choice-views.json` remains byte-unchanged.
The repaired projection is a separate, first-created file:
`ana9-c1-ex-choice-views-repaired.json`.

## Concrete Changes

### q3: Standard Remainder Wording

Only option c text changes. It now explicitly squares the original
remainder representatives1/2 to obtain1/4, then reduces those representatives
modulo3 to standard remainder1. It does not call4 a standard remainder
when dividing by3. The integer premise, both other alternatives, all
internal reasoning and exact key are unchanged.

### q19: Explicit Induction Hypothesis

Only option c text changes. After the unchanged base case, it now says
to take arbitrary k>=10 and assume2^k>k^3 before using the unchanged
ratio bound and comparison chain. No new source solution, domain,
inequality, exact key or other alternative is introduced.

### q15: Equal Literal Coverage Across All Candidates

All three option texts change, with the SAME introductory coverage:

- First circle has2 regions and zero circles satisfy1<=2.
- k>=1 is the next-step domain.
- A coincident new circle has increment0.
- A noncoincident new circle has m<=2k distinct intersections.

All three explicitly discuss BOTH m>=1 and m=0, use the same closed-circle
terminology, and end with the SAME neutral conclusion wording:
`由此得到所求界。`

Their original mathematical distinctions remain the substance:
option a uses m+1 closed-circle arcs and the resulting n^2+1 bound;
option b extends zero increment to the noncoincident m=0 case;
option c uses m closed-circle arcs and the separately bounded m=0 case.
No candidate is now uniquely identified merely by mentioning coincidence,
zero intersections, closed circles, or the zero-circle check.
No option order, mode, stem, internal key/rationale, intent, limitation
or source coverage is changed.

## Exact Machine-Checked Diff

The complete draft diff is exactly these FIVE text fields:

```text
/questions/2/view/options/2/text
/questions/14/view/options/0/text
/questions/14/view/options/1/text
/questions/14/view/options/2/text
/questions/18/view/options/2/text
```

Other17 questions are deep-equal in every field. All20 internal keys,
rationales, intents, coverage records/relationships, question and option
orders, modes, stems, figure inventories and seed binding are unchanged.
Seed raw bytes remain:
`4cc597b0f08c5327b36861bb21d251bd943d245d21e6045873a9e1f3148c2398`.
No internal key values are disclosed in this record.

## Changed-Snapshot Mechanical Check

Executed once AFTER the changes:

```bash
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never python3 -B \
  .agents/skills/ld-s10y-choice/scripts/validate.py --repo . \
  --seed .intentfold/tickets/STEMROBIN-184/tmp/ana9-c1-ex-choice-seed.json \
  --draft .intentfold/tickets/STEMROBIN-184/tmp/ana9-c1-ex-choice-draft.json
```

Exit0:
`mechanical checks passed; semantic review still required`.
The initial review was not attached to a changed digest or overwritten.
No initial successful check, source solve, full semantic pass, render or
browser evidence was repeated.

The one-off scratch `ana9-c1-ex-choice-repair-project.py` created the
byte backups, asserted the exact five-field diff and unchanged seed/old
views, and mechanically projected only `questions[*].{id,view}` into
the repaired file. No options or mathematical conclusions were generated
by that script.

## Current Hash Binding

Still20 questions/66 options.

| Artifact | Raw SHA-256 | Official Canonical Digest |
| --- | --- | --- |
| current internal draft | `d83e6b74dd84dc8ed1fe83eae416eef663b8141859eeb0cdf821959785c551f8` | `fc67a9971486c8b14e2087c5179129f85caafab9e709216dfcc63719957499b5` |
| repaired view-only | `3aa0832dbc90c1acb69d18a5d3356a12446d5b414ab16718289e5a3cdae6a3b5` | `96861d21e6fec61185e919e2053079a3a6ab70accc2418751f858362cd3cc174` |

Banach owns substantive changed-only judgment of q3/q15/q19.
Parent owns only the three affected display checks; other17 display
evidence is reused. This was the one authorized repair for these three
units; no second repair was attempted or pre-approved.
No publisher, DB, new figure, browser, service, install, app change,
commit, push or other-chat message was used. No process remains running.
