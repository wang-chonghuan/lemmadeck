# Verification

## Source And Publication

Ten target cards were finalized and published through ld-s10y-lesson, ld-s10y-answer and its interaction publisher, without direct row authoring.

| Card | Exercises |
| --- | ---: |
| alg6-c3-s1-n22 | 16 |
| alg6-c3-s1-n23 | 8 |
| alg6-c3-s1-n24 | 5 |
| alg6-c3-s1-n25 | 10 |
| alg6-c3-s2-n26 | 9 |
| alg6-c3-s2-n27 | 2 |
| alg6-c3-s2-n28 | 13 |
| alg6-c3-s2-n29 | 14 |
| alg6-c3-ex | 60 |
| alg6-hard | 34 |

All43 newly transcribed pages finalized. Assembly, adaptation, source-bound figure reviews and offline renders passed. The complete raw book contains271 pages,61 cards,1058 exercises and127 numbered figures.

## Product

The headed product check passed for every card at1440x960 and390x844. Evidence covers302 math-input fields at each viewport, actual keyboard ownership, media rendering, print, all exercises, anonymous ungraded submission and numeric standard-answer rendering where applicable.

The final549 correction was published before repeating only alg6-c3-ex at both viewports. The final catalog/current-content check then passed all ten cards at both viewports, and all ten official-domain read-only GETs returned200 with their corresponding SSR headings/content.

Reproducible ticket-scoped commands, run from the checkout:

```bash
node .claude/skills/ld-s10y-lesson/tools/check_product.mjs \
  --book-dir ssot-resources/soviet10year-textbooks/artifacts/6a \
  --edition modern-us-neutral --lesson alg6-c3-ex \
  --base-url http://localhost:52162 \
  --output .intentfold/tickets/STEMROBIN-162/tmp/product-supplement-final
```

From app/:

```bash
node ../.intentfold/tickets/STEMROBIN-162/tmp/ac-check.mjs
```

Uncommitted evidence is retained under the ticket's tmp/: product/product-check.json contains the original20 successful viewport/card rows; product-supplement-final/product-check.json contains the final two supplement rows; ac-evidence.json contains the ten current-content and official GET records. Catalog and product screenshots are beside those reports. math-verification.json contains108 independent equation/point substitution records.

## Mechanical Checks

Required resource audit, textbook validation, four content-db tests,113 app tests and production build passed. After the final answer correction, resource audit and textbook validation passed again. Eleven layout cases and two path-stroke cases also passed.

## Metering

token-usage.json records the host cumulative counter delta for the human request, including closure of160/161 and generation/verification of162. Cache reads/writes are within input, reasoning is within output; do not add those categories again. No separate external generation API calls were made.

The request has no preceding counter event in this rollout. Its baseline is inferred from the first cumulative count minus that event's last-call count, and this limitation is explicitly recorded. Cached conversation history and compaction are included. The snapshot excludes subsequent responses and is not billing evidence.
