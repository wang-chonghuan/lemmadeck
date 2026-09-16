# Acceptance Checks

## AC1: Exercise Figures

Derive every published grade-6 algebra lesson and exercise from the durable
edition and live content. Check source figure references and original diagrams
against modern figures, including subfigures, labels and given measurements.
Run the real lesson UI in headed Chromium at the viewports in operations.md.
Assert required images are present, loaded, nonblank and not clipped.
Record the complete checked inventory and screenshots of repaired figures.

## AC2: Math Keyboard

Enumerate all supported exercise answer-input widgets. In the real UI, verify
each answer input has an accessible keyboard button, opens a usable keyboard,
receives inserted mathematics, and does not change another input's value.
Cover desktop and mobile, multiple parts, navigation and free answers.

## AC3: Prevention

Run failing fixtures for missing figures, omitted necessary figure elements,
and answer inputs without keyboard access. Each must fail for its intended
reason; corrected content and UI must pass the same checks.

## AC4: Root Causes

Record source-to-publication and input-routing evidence, corpus coverage and
repair results. Updated generation skills must invoke the executable checks
that cover these failure modes.
