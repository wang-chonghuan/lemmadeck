# Acceptance Checks

## Complete subject and book shelf

Open the application catalog in headed Chromium and derive the expected math and physics books from
the repository TOC files.

Pass: both subjects are present and every expected book appears immediately without a visibility
toggle or another preparatory action.

## Complete hierarchy with availability behavior

Expand representative math and physics books and compare their visible chapter, lesson, and topic
labels with the corresponding TOC entries. Inspect one unavailable item and one published item.

Pass: the represented hierarchy is complete, the unavailable item is visible but is not a link, and
the published item remains a link that opens its lesson.

## Responsive catalog browsing

Repeat the catalog check at `1440x960` and `390x844`, opening the mobile catalog drawer where needed.

Pass: the complete catalog can be scrolled at both viewports with no horizontal page overflow, and
neither subject is omitted by availability filtering.
