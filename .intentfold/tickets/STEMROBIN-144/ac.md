# Acceptance Checks

## 1. Desktop figure sizing

Open `phy6-c1-s4` at `1440x960`. Assert that all six lesson figures are
substantially narrower than the reading column and that figure 5 no longer
occupies nearly a full viewport height.

## 2. Mobile fit and layered alignment

Open `phy6-c1-s4` at `390x844`. Assert that every figure fits inside the
lesson viewport without horizontal scrolling or clipping. For figure 5,
assert that the PNG artwork and SVG overlay share the same bounding box.

## 3. Instrument readability

At desktop and mobile widths, inspect figures 6, 8, 9, and 10 and assert that
their scale labels remain visible and readable after the size reduction.

## 4. Unscoped figures and project checks

Open an instructional figure from another lesson that has no explicit compact
width and assert that it retains the existing normal width. Then run the
resource audit, textbook validation, application tests, and production build
commands from the project Charter.
