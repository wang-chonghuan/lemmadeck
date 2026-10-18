# STEMROBIN-177 Acceptance

## 1. Tab Name And Content

Use the local Chinese lesson page in headed Chromium. Assert the tab order is
课文, 选择题, 书写题 and no tab uses 习题. Click 选择题 and assert the existing
question region appears with the expected lesson question count.

## 2. Desktop And Mobile

Use both viewports from operations.md. Assert the complete new label is visible
without clipping, the supplement keeps its 95-question count and 50/45 pagination,
and the other tabs still select their existing content. Do not submit answers.

## 3. Publication

Run the existing mechanical defence. Merge the verified branch and deploy the
exact merge commit through operations.md. Read the online lesson HTML to confirm
the new tab name and unchanged question count, alongside the prescribed health,
SSR and redirect checks. Set the live ticket Done after publication succeeds.
