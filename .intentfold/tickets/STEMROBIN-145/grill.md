# Self Grill

1. **Should the new identity scheme rewrite existing numeric exercise IDs?**
   No. The live database proves existing 5m/6a rows rely on `number` and omit
   `sourceNumber`, while current 6p rows already use numeric identities. Qualifying only
   later cross-group collisions preserves old URLs, answer events, mistakes, and storage
   keys.

2. **How can the catalog distinguish a real main lesson from a mathematical grouping
   without a book-specific list?**
   The TOCs already expose the distinction: structural sections contain numbered topics;
   the eight affected 6p main lessons contain only unnumbered supplemental topics. Expand
   the parent plus children only in the latter shape.

3. **What identity should printed answers use when numbers repeat or are absent?**
   The assembled stable exercise ID is authoritative. Lesson/group-scoped captures also
   retain lesson, group, and printed number (including explicit null) as source evidence.
   Existing book-global math captures keep their positive integer exercise field unchanged.

4. **May verification publish sample rows to the shared content database?**
   No. The ticket and operations boundary require offline fixtures, read-only production
   inspection, and localhost checks. The implementation must be proved without inserting
   new sample lessons.

5. **Do any planned actions cross a Charter redline?**
   No. The route changes no dependencies, schema, infrastructure, token registry, or
   Charter file; it performs no destructive database operation, deployment, public
   publication, or paid image generation.

6. **What remains outside this fix even after the four defects pass?**
   The exact ten-book list, image budget, concurrency limit, and production rollout remain
   undecided. A chapter/sample pass cannot be presented as whole-book or ten-session
   acceptance.
