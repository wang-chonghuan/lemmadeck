# purpose

The domain-services module is LemmaDeck's data and policy layer. It connects the SSR application to PostgreSQL and the repository-level curriculum sources, then returns browser-safe views of textbook cards, exercises, English lessons, learner state, and account state. It owns server-side decisions that must remain authoritative: session verification, locale resolution, content availability, hidden-answer handling, mathematical judgment, learner-event writes, mistake tracking, recitation judgment, and statistics.

The active Soviet 10 Years path is intentionally direct. A textbook card id identifies one `sr_lessons` row. `lessons.ts` projects the row's prose and exercises, `textbooks.ts` supplies its place in the printed curriculum, and `textbook-answer.ts` reads hidden answer keys only after submission. Older neutral card-tree, locale-overlay, relational-question, quiz-attempt, and lesson-progress services remain in this module as compatibility surfaces, but they are not the current math generation or `/card/$id` entry.

# structure

The database and request boundary is centralized. `db.ts` creates one memoized TLS Postgres client, uses a small recyclable pool, and sets the quoted `lemmadeck-schema` search path. Session primitives isolate Node crypto and server cookie APIs; public account server functions verify users, log in, log out, and collect registration-interest emails. Locale primitives resolve a separate Chinese-or-English preference cookie during SSR. The isomorphic string dictionary localizes application chrome and curriculum labels, not current textbook body fragments.

The current math area has three cooperating responsibilities. Textbook projection eagerly loads localized TOC files, builds the discipline/book/chapter/section/card hierarchy, resolves printed labels, and computes navigation. Lesson delivery reads `sr_lessons.content.prose` and `sr_lessons.exercises.exercises`, exposing only renderable content and public answer-control metadata. Textbook answering validates a submission, loads the hidden per-exercise key, judges every part, and records learner history.

Learner-state services support the active dashboard. Deck statistics combine the full TOC card set with `sr_content_answer_events` to calculate coverage, answer accuracy, and passed-card mastery. Mistake services list each wrong textbook occurrence and derive whether it was corrected from a later correct event for the same exercise.

Short-text English is a separate active content contract within the same lesson table. It projects readable passages, localized glosses, patterns, vocabulary, and audio availability; creates deterministic five-level recitation masks; judges sentence or full-passage recall; and records recitation attempts. Lesson-scoped and word-scoped audio are fetched lazily as bytes through server functions.

Compatibility services preserve the earlier math model. `reading.ts` understands neutral `content.cards` plus `sr_lesson_i18n` overlays and server-judged read checks. `quiz.ts` understands relational `sr_questions`, answer events, resumable quiz attempts, and score summaries. `progress.ts` derives the old two-points-per-lesson state from read checks and practice scores. These services still have tests and supporting components, but current routes do not use their fetchers or progress model.

Small shared utilities include math-answer normalization, localized labels, responsive drawer state, and visual-viewport clamping. They remain under this module because its declared source boundary is `app/src/lib`, even when the immediate consumer is learner experience.

# flows

For current S10Y availability, the service selects lesson rows whose `content` exists and which contain at least one prose block or a positive exercise count. An exercise-only card is valid. The resulting ids are overlaid on the TOC: numbered topics become links when their own ids are available, sections become ready when any child card is ready, and book/card order continues to come from the printed source rather than database ordering.

A `/card/$id` load combines two authorities. The TOC supplies title, printed number, trail, book membership, and previous/next cards. `sr_lessons` supplies prose blocks and exercises. Prose may contain pre-rendered HTML, inline SVG, or data-URL images. Exercises carry their printed numbers, grouping, HTML, figures, and figure references. The service also derives an answer specification from each stored `answerKey`, but returns only grading mode, part labels, units, and whether each blank needs a native numeric input or a math field.

Grid interactions are projected with the same secrecy rule. The browser receives the widget kind, x/y domain, point names, and point-to-axis part order so a click can fill the same numeric blanks used by ordinary grading. The stored coordinate map is never returned. Invalid or incomplete interaction metadata simply does not activate the grid widget.

When a learner submits a textbook exercise, the service bounds answer count and length, rereads the exercise deck, and finds the key by printed exercise number. Exact parts use normalized textual equality. Numeric parts are parsed by Compute Engine after removing common unit notation and may use an authored absolute tolerance. Expression parts use symbolic equality. Auto-grading requires every part to be nonempty and correct; ungraded exercises return their reference answer without a correctness verdict.

Judging is available without login, but persistence is not. A signed-in auto-graded submission writes an exercise event. If it is wrong, the same transaction also inserts a mistake occurrence with the TOC-derived book id. A correct result writes only the event. An ungraded result writes a null-correctness event. Later mistake summaries consider a wrong occurrence corrected when a newer correct event exists for the same lesson and exercise.

The active learning dashboard uses a card-deck model. The denominator is every card declared by the TOC. Any content-answer event marks a card seen; any correct event marks it passed; only non-null verdicts enter accuracy. This model is monotonic for seen/passed cards and separate from the retained legacy lesson-progress model.

English reading first validates the short-text content discriminator, joins the current locale overlay, and discovers available sentence and passage audio. It derives global lesson sequence, new words, and previously introduced review words from all English lessons. Recitation tokenizes words separately from punctuation, ranks pattern-slot words before lesson targets and remaining words, and hides increasingly long prefixes of that deterministic order. Hidden tokens carry no text. Server judgment ignores case and punctuation but preserves spelling and word order, then records correctness and assistance when a learner is signed in.

The compatibility reading path projects old card bodies by resolving prose node ids against a locale overlay and omitting embedded read-check keys. The compatibility quiz path sends relational questions without correct indexes, accepted forms, or answers; judges them after submission; supports open-attempt replacement and resume; and scores unanswered gradable items as wrong while excluding self-checked work. Its completed score is copied into the retained practice-progress table.

# module-relationships

`content-generation/math-courseware` is the upstream current math producer. `ld-s10y-lesson` publishes one lesson row per TOC card id with `content.prose` and an exercise deck, clears the old whole-document HTML field, and preserves existing keys for matching exercise numbers on republish. `ld-s10y-image` supplies audited modern figures. `ld-s10y-answer` merges one `answerKey` and optional interaction specification into each exercise. Changes to card ids, exercise numbers, part ordering, key fields, or interaction shape must be coordinated with this module.

The database-schema module owns the persistent contracts. Current textbook delivery relies primarily on `sr_lessons`; learner history uses `sr_content_answer_events` and `sr_textbook_mistakes`; identity uses `sr_users` and `ld_user_emails`. English additionally uses lesson overlays, lesson audio, word audio, and recitation attempts. Relational questions, answer events, quiz attempts, practice scores, and the old card-tree/overlay shapes remain compatibility contracts. The historical content ledger exists in the schema but is not read here.

The repository-level Soviet textbook TOC is an upstream authority alongside the database. It determines hierarchy, localized book and lesson names, every card id, book membership, and navigation order. Database rows determine readiness. A row whose id is absent from the TOC can be fetched by id but cannot participate correctly in ordinary catalog labels, navigation, book attribution, deck totals, or mistake history.

The learner-experience module is downstream. Current card routes consume `getCardContent` and `findCard`, then submit to `checkTextbookAnswer`. The dashboard consumes availability, TOC ordering, deck statistics, and mistake summaries. The mistake route consumes occurrence history. English routes consume reading, recitation, hint, and audio operations. Components for the old card reader and quiz drawer remain present but are not mounted by the current route graph.

The app parent supplies SSR transport, cookie request context, environment variables, and build composition. The Compute Engine is dynamically loaded for server-side mathematical equivalence. MathLive is a learner-experience dependency for formula entry; the domain contract receives its LaTeX-like string values without trusting the browser to grade them.

# constraints

All application database access must continue through the single `sql()` client. Connection strings, password hashes, answer keys, and raw audio bytes must remain server-side. Session and locale cookie primitives must stay in server-only modules so Node crypto and request APIs do not enter client bundles.

Initial textbook payloads may expose grading mode, labels, units, input kinds, grid domains, and point names, but never expected values, display answers, or answer coordinates. Compatibility card and quiz payloads likewise omit read-check keys, correct indexes, accepted forms, and reference answers. Reveals and verdicts are returned only after a submission reaches the server.

Current S10Y card ids and printed exercise numbers are durable joins. They connect the TOC, `sr_lessons`, answer keys, interactions, content events, mistake rows, routes, and learner-local answer storage. Renaming or reordering them requires coordinated producer, database, and application migration.

Generated lesson HTML and SVG are inserted into the DOM rather than sanitized at request time. Their safety and shape depend on the S10Y generation and figure-audit pipeline. Bypassing those publishers or manually writing lesson JSONB would cross the runtime trust boundary.

Wrong textbook events and mistake occurrences must remain atomic. Numeric tolerances and units are authored answer semantics, not presentation hints. English masks must remain deterministic and hidden tokens must remain text-free. Compatibility quiz scores shown to learners and copied into progress must continue to use the same server formula.

# known-limits

Current S10Y JSONB is interpreted through TypeScript casts and selective shape checks rather than a runtime schema validator. Malformed prose, exercise, answer-key, or figure values can fail late or render incorrectly. The app also injects generated HTML and SVG directly, making upstream audits essential.

The current textbook path is not locale-complete. Availability is not filtered by locale, and `getCardContent` does not join `sr_lesson_i18n`; switching locale changes shell and TOC labels but does not translate stored S10Y prose or exercise fragments. The older overlay-aware reader does not solve this for `/card/$id` because that route no longer uses it.

Deck statistics are intentionally coarse. The denominator includes every TOC card, including unpublished cards. Any event marks a card seen, and any correct event marks it passed; mastery does not require every exercise on a card. Repeated wrong answers create repeated mistake rows, and one later correct event can mark multiple prior occurrences corrected.

The two-attempt delay before showing a current textbook standard answer is client-side pacing. The server returns the display answer with every valid submitted verdict, so it is not an authorization or secrecy boundary.

Authentication remains minimal. There is no account creation from the registration queue, password reset, role model, server-side session revocation, or external identity provider. The session cookie lacks an explicit `secure` option and the secret has a development fallback, so production configuration remains important.

The retained compatibility APIs have additional brittle assumptions. Non-Chinese quiz text aligns old exercise JSONB to relational questions by ordinal. Attempt answer writes accept an optional attempt id without verifying its ownership or lesson relationship, and attempt completion receives the lesson id separately from the attempt id. These paths are not current S10Y entry points, but they require care while compatibility data or callers remain.

# notes-for-ai

For current Soviet textbook work, begin with `lessons.ts`, `textbooks.ts`, and `textbook-answer.ts`, then inspect `/card/$id` and the S10Y publishers. Do not route new math generation or rendering through `reading.ts`, `quiz.ts`, `progress.ts`, `sr_lesson_i18n`, `sr_questions`, or the content ledger. Retain those only as compatibility surfaces unless a separate migration establishes that their data and callers can be removed.

When changing public exercise metadata, inspect both what is returned initially and what is returned after judging. Serialize representative payloads and confirm that expected values, display answers, accepted forms, and grid coordinates are absent before submission. Test exact, numeric, tolerance, expression, ungraded, multi-part, legacy part-label, and invalid-data cases.

When changing curriculum behavior, use the TOC rather than parsing ids or inventing a second ordering list. Verify cards with prose only, exercises only, both, and neither. Check cross-section previous/next navigation, book attribution for mistake writes, localized TOC fallback, and the effect on the full deck denominator.

For learner-history changes, preserve the event-plus-mistake transaction and test repeated wrong submissions followed by a correct one. For authentication or locale changes, verify SSR first paint, cookie validation, logged-out judging without persistence, authenticated dashboard gating, and English reading/recitation separately.

Run the focused Vitest suites for textbook projection, answer judgment, normalization, mistakes, English masking, locale behavior, and retained compatibility formulas. Then build the app and exercise a real `/card/$id` against the assigned local server, inspecting both rendered content and browser-visible server-function payloads.
