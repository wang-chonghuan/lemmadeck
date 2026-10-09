# Acceptance Checks

## AC1: Four Complete Lessons

Resolve 6a numbered topics 12-15 from the authoritative TOC and compare the
faithful transcription with PDF physical pages 66-80 (printed pages 60-74).
Close cross-page objects, finalize pages, and assemble with the TOC.
Record independently counted source exercises per lesson. Publish only the four
complete lessons through the named publishers. Query their edition and counts,
then open each card and its full exercise view at the ticket port.

Pass: four correct card identities, complete prose and matching exercise counts,
no missing or duplicated exercise, and no incomplete topic 16 published.

## AC2: Figures, Answers, and Interaction

Follow ld-s10y-image with direct source PNG inspection and source-bound inventory,
mathematical assertions, rendering and visual review. Derive answers from the
current edition and verify against source answer evidence where present.
Run lesson-answer and interaction finalizers, including the real MathLive edit
contract. Run check_product.mjs for all four lessons in headed desktop and mobile
viewports, inspect its screenshots and any figure-width failures.

Pass: required source data and relationships retained, readable unclipped images,
all exercises rendered, every answer input owns working mathematical keyboard
input, and current answers/interactions align with the current questions.

## AC3: Conditional Root-Cause Repair

Record only concrete failures observed in this batch. If a skill/tool defect is
responsible, fix its owning implementation and remove conflicting obsolete
instructions. Add focused positive and negative cases with independent expected
behavior, then execute them. Otherwise leave skills/tools unchanged.

Pass: each observed pipeline defect has a verified root-cause repair and
positive-pass/negative-reject evidence, or no defect and no gratuitous skill edits.

## AC4: Metering and Review Boundary

Read host token_count cumulative usage with a baseline immediately before the
first model response to this new request, excluding the old ticket's cumulative
usage. Count input/output/cache fields separately; reasoning is a subset of
output, not added again. Track any external generation usage separately.
Record the last measurable snapshot and exact coverage limitations.
Run the charter's mechanical defence before handoff.

Pass: measured numeric usage and scope documented, verified review handoff,
ticket not Done, branch not merged, no deployment command run.
