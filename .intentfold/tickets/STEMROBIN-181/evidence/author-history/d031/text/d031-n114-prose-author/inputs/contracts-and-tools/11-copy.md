# cap3: Copy

Use for the words on a page whose structure is settled: writing them, or auditing existing copy line by line. If the page has no job story yet, run cap1 or cap2 first.

An audit produces a report with suggested rewrites. Edit the copy only when the user asks.

## Three tests for every line

Apply them in this order to every line, block, and number:

1. **Evidence.** Is there a fact behind this line, from the data, a source, or the expert? If not, delete the line. Do not replace it with a line saying the fact is missing.
2. **About this item.** Does the line say something about this specific product, person, or item? Or does it describe the kind of thing it is, such as what the section is for or what products like this usually do? A line that would be equally true on every page of this type tells the reader nothing about this one.
3. **Deletion.** Remove the line. If the reader in the job story loses nothing, it stays removed.

Most bad copy fails test 1 or test 2, and the fix is to delete it. Rewording such a line keeps the problem.

The defect list below records what has already been found on real pages. Use it to name what you find. Keep running the three tests as well, because they also catch defects the list does not have yet.

## Defects found on real pages

**The system showing through**

1. **Internal vocabulary.** Terms from the schema, pipeline, or team printed for users: `saved`, `cohort`, `population`, `coverage`, `observed`, internal tier names.
2. **Reporting absence.** "Not checked. No record found. No date available." Three sentences about one gap.
3. **Layout for missing data.** A list of "not detected" rows, or a heading over an empty block.
4. **Data quality and methodology in the body.** Coverage ratios, QA counts, how the sample was built. These belong on the team's dashboard, or in one note at the end of the page.

**Filler that reads like prose**

5. **A teaching sentence above each block** that explains what the block is for and says nothing about the item in it.
6. **A disclaimer that undercuts the number next to it.** If the number cannot be trusted, do not show it.
7. **Value claims nobody could check.** "Reveals what supports growth and where the strategy is thin."
8. **Abstract nouns stacked with no verb.** "Monetisation coverage." "Competitive authority."
9. **Passives with no subject.** "No structured check has been recorded." Recorded by whom, about what?
10. **Stacked hedges.** Two or more qualifiers in one sentence, until no claim is left.

**Shapes the generator repeats**

11. **Numbers with no sentence saying what they mean.** A grid of metrics and no conclusion.
12. **A number with no baseline, sample, or date.** Worst when a figure from 2% of the set sits in the same row as complete totals.
13. **The same sentence frame repeated** down the page, or across every generated page.
14. **Headlines that hold back the subject or turn on a contrast**, such as "Not A, but B" or "Only one ...". Name the subject and finish the sentence. If two facts both matter, write two sentences.

## Audit

1. Read the page as the reader in the job story, and note the question they arrive with.
2. Run the three tests on every line, block, and number.
3. For each failure, quote the line, name the defect, and give the replacement or `DELETE`.
4. Judge the page as a whole: does it say anything definite about this item anywhere, or does it only present material?
5. Report.

```markdown
# Copy Audit

## Verdict
- Status: Pass | Needs Improvement | Fail
- Target:
- Reader and their question:
- Worst pattern:

## Findings
1. Severity: Blocker | Major | Minor
   Defect:
   Quote:
   Why it fails:
   Replacement: <rewritten line, or DELETE>

## Page-level judgment
<Does the page say anything definite about this item? Where does the reader get stuck?>
```

If there are no findings, write `No findings.` under `## Findings`.

Severity:

- **Blocker**: the reader is misled, or leaves without the answer they came for. This includes a number shown without the sample that would change its meaning.
- **Major**: the line survives but costs the reader time: filler, hedging, internal vocabulary, absence reported as content.
- **Minor**: wording and rhythm that would improve on a second pass.

## Write

1. List what is actually known, with its source, sample size, and date.
2. Write the answer to the page's one question first, in one plain sentence a reader could repeat to a colleague.
3. Add only the facts that support it.
4. Drop every block that has no fact behind it. Do not write a note about the gap.
5. Run the three tests on your own draft.

Return the copy, plus a short list of what was dropped for lack of evidence, so the owner can decide whether to go and get that evidence.

## Rules

- Delete before rewriting.
- Never write a sentence whose subject is missing data.
- Order a block as: the answer, then the facts behind it, then methodology once at the end if the reader needs it.
- A number appears with its sample, its date, or its baseline. Otherwise it does not appear.
- Say what is true plainly. Do not add hedges to help a claim survive review.
