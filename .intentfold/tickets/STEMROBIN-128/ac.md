# Acceptance Check

## 1. English navigation is absent

Run the local app on the ticket port in headed Chromium at 1440x960 and 390x844. Open the landing page and authenticated learning shell, open the mobile catalog where applicable, and assert that there is no visible `技术英语` or `A1A2` text and no link whose destination starts with `/english/`.

Pass: all checked surfaces contain only the remaining curriculum navigation.

## 2. Old English lesson URLs do not expose English content

Visit representative `/english/<id>` and `/english/<id>/recite` URLs without relying on an existing session.

Pass: both resolve to `/`, no English lesson or recitation UI is rendered, and no error page appears.

## 3. Mathematics remains usable

Open a published mathematics card at both required viewports and inspect browser console/page errors.

Pass: the catalog and card render, the lesson text is visible, and no console or page error is recorded.

## 4. Charter reflects the product decision

Search the current Charter.

Pass: `product.md` states that the product is mathematics/physics only and explicitly excludes English learning; `engineering.md` does not describe the removed English pages as active learner routes.

## 5. English data is preserved and deployment is healthy

Query the live schema before and after implementation for the count of English `sr_lessons`; the established baseline is 14. After merge, run the routine deployment and the documented production health check, then inspect the deployed read-only UI.

Pass: the count remains 14, deployment succeeds, `https://lemmadeck.com/` returns HTTP 200, and the deployed catalog has no English-learning entry.

