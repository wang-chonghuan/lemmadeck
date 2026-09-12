# Acceptance Checks

## Complete 8 by 8 board

Open `alg6-c1-s1-n2` exercise 21 in the running product and assert that the chessboard has nine visible horizontal boundaries and nine visible vertical boundaries spanning the full board area. Capture a screenshot showing all 64 cells.

Pass: the board visibly contains eight rows and eight columns, including the lower four rows that were previously clipped.

## Complete and aligned labels

In the same browser check, assert that labels `a` through `h` and `1` through `8` are all present. Compare their rendered bounding boxes with the board bounds.

Pass: all 16 labels are visible, column labels sit below their columns, and row labels sit beside their rows.

## Responsive figure and usable exercise

Repeat the visual check at `1440x960` and `390x844`, and assert that exercise 21's prompt, figure, and answer controls remain reachable without horizontal page overflow or overlap.

Pass: the full board is visible at both viewports, the figure stays within its exercise container, and the exercise can still be answered.
