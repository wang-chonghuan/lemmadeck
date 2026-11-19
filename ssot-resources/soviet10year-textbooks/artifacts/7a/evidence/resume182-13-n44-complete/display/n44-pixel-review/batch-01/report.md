# STEMROBIN-182 n44 Pixel Observation: Batch 01

Outcome: **pass**, limited to the visible typography and layout in the eight supplied images. No concrete clipping, fraction collision, incoherent overlap, unreadable heading or label, or option-separation defect was observed. This is not exhaustive native-glyph certification.

Exactly eight image calls were made, each once with `detail: original`; no reopen, new crop, other image, render, browser, or network operation was used. All eight byte hashes matched the immutable request before observation. Exact paths, hashes, dimensions, per-image observations, and limitations are in `review.json`.

## Observed

- Desktop text: heading, prose, case sections, examples, fraction rows, and formula terminals have visible clearance.
- Desktop exercises: exercise numbers 858-872, subparts, review heading, and wrapped prose are separated. The supplied exercise-871 local region shows intact radicals, stacked fraction, parentheses, and terminals.
- Desktop choices: blocks 1-33 and their lettered options remain distinct at the delivered full-page scale. Supplied local regions for blocks 14 and 15 show readable table headers, separated rows, intact fraction and option terminals, and aligned continuations without overlap.
- Mobile text: heading and prose fit the narrow column without collision. The long completing-square identity extends beyond the base first display; its supplied right-end fragment shows the final squared term, fraction denominator, and punctuation intact. A lone punctuation continuation is visible elsewhere but is not a clipping or overlap defect.
- No standalone figure is visible; the choice tables are the instructional visual structures observed.

## Limits

The tool explicitly resized the desktop choice page from 1425 x 12549 to 681 x 6000, and the mobile text page from 375 x 6554 to 343 x 6000 despite `original` requests. Their native-resolution glyphs were not seen. Specific unverified fine detail includes small option fractions in choice blocks 3-6, 10-13, and 20-22, the small radical fraction in block 32, and reciprocal or superscript details in block 33. These are native-detail limits, not observed failures. No extra image was opened to resolve them.

The mobile identity terminal is absent from the base display but visible in the supplied final fragment. No intermediate scroll state, scroll affordance, or interaction was inspected. Mobile exercises and choices are outside this batch. Absence of a resize notice for other images is not a guarantee of exhaustive native-glyph inspection.

## Inherited Evidence

Parent reports headed RECOVERY1 passed all six combinations. The preserved FIRST failure occurred before any screenshot because of the renderer navigation link. Parent reports that the exact read-only derivation removed only two anchors and left source content unchanged. Metrics, current-content/source approval, and mathematics approval are inherited, not recomputed or independently reopened.

Only new `review.json` and this report were authored inside the owned batch directory, then frozen to mode `0444`. The request, supplied images, source, choices, answers, existing files, durable content, database, application, dependencies, and other agents' work were not modified. Parent integration remains outside this observer's scope.
