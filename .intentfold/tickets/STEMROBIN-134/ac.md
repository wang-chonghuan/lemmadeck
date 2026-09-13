# STEMROBIN-134 Acceptance Checks

## 1. Catalog Coverage

Run the ticket-scoped Playwright check from `app/` against the recorded ticket
port. It must find all fifteen numbered Chapter 5 cards and the supplementary
exercise card in the catalog, and every card route must finish loading.

## 2. Published Artifact Completeness

Run the lesson, edition, answer, and interaction finalizers, then query the live
content schema through `LEMMADECK_DATABASE_URL`. The generated audits and
published rows must agree on 16 cards and 306 exercises, with every exercise
carrying an answer key and an interaction specification and every referenced
figure resolving.

## 3. Browser Quality

Run `.intentfold/tickets/STEMROBIN-134/tmp/ac-check.mjs` from `app/` in headed
Chromium at `1440x960` and `390x844`. Across all Chapter 5 cards it must detect
no horizontal overflow, missing or blank figures, unavailable answer controls,
missing numeric/math keyboards, page errors, failed requests, or console
errors.

## 4. Measurement And Production

Derive wall-clock elapsed time from the recorded UTC start and completion
timestamps. Sum the ticket's model telemetry without double-counting reasoning
tokens and calculate cost at the recorded Azure GPT-5.6 Sol rates. After merge
and routine redeploy, read-only requests to the production homepage and first
Chapter 5 card must return HTTP 200, and a browser check must show Chapter 5.
