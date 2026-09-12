# purpose

The database schema is the durable persistence contract for LemmaDeck's lesson content, learner activity, audio, identity, and retained story data. Its SQL file describes the live PostgreSQL schema named `lemmadeck-schema` in the shared Supabase database. It is a snapshot of the deployed shape, not a migration or bootstrap script, so changing the file alone does not change production.

For current Soviet mathematics courseware, `sr_lessons` is the central storage boundary. A TOC card id is also the lesson primary key, and one row carries the rendered prose blocks, exercise deck, answer keys, and interaction specifications consumed by `/card/:id`. Older ledger, overlay, card-tree, and relational quiz structures remain for compatibility; they are not the authoring entry point for the current `ld-s10y-lesson` workflow.

# structure

`sr_lessons` has thirteen declared columns. `id` is the text primary key. `subject`, `stage`, `lesson_order`, `title`, and `concept` provide catalog metadata. `html` and `pdf` are nullable derived artifacts. `status` is required and defaults to `draft`; `created_at` and `updated_at` default to the current time. `content` and `exercises` are nullable JSONB documents. A unique index on `(subject, stage, lesson_order)` prevents two rows from occupying the same ordering coordinate within a subject and stage.

The current math `content` document stores source hashes, edition metadata, and an ordered `prose` array. Prose entries are ready-to-embed HTML fragments or inline figures. The `exercises` document stores its edition, count, and ordered exercise objects containing printed number, group, rendered prompt, figure references, and inline figures. Each exercise may also contain an `answerKey` and an `interaction`.

An `answerKey` contains grading mode, a display answer revealed after submission, provenance, and auto-graded parts when applicable. Each part names an exact, numeric, or expression judge, accepted expected values, and optional label, unit, or tolerance. An `interaction` describes the input widget and its derivation. Grid interactions may additionally store a frame, target point coordinates, and the ordered mapping from input parts to point axes.

Supporting lesson tables include `sr_lesson_audio`, `sr_word_audio`, `sr_lesson_i18n`, and `sr_content_ledger`. Learner activity is split across current card events and mistake rows, recitation events, older relational questions and quiz attempts, and compact practice attempts. Identity lives in `sr_users` and `ld_user_emails`. The `sr_stories`, `sr_story_chapters`, `sr_story_questions`, and `sr_story_answer_events` family preserves biography content.

# flows

The current math publication flow starts with `ld-s10y-lesson`. Its publisher validates an audited modern edition, then upserts one `sr_lessons` row per TOC card. It writes `content.prose` and `exercises.exercises`, sets `html` to null on update, and inserts new rows with draft status. When republishing the same edition, it carries existing answer keys forward by exercise number.

`ld-s10y-answer` then augments the stored exercise deck without adding columns. The answer publisher requires an exact exercise-number match and merges `answerKey` into every exercise in one transaction. The interaction publisher separately requires one interaction per exercise and merges `interaction` beside the answer key. Edition equality is checked before either enrichment is accepted.

At runtime, `getCardContent` reads only the two JSONB columns. It projects prose and exercises into a browser payload while removing grading secrets. The browser receives grading mode and input labels, units, and kinds, but not expected values or the display answer. For grid interactions it receives the grid domain, point names, and part mapping, but not the stored target coordinates. `checkTextbookAnswer` rereads the full answer key server-side, judges the submission, then returns the verdict and display answer. Authenticated submissions append `sr_content_answer_events`; incorrect answers also append `sr_textbook_mistakes`.

Lesson availability is based on the presence of prose blocks or a positive exercise count, not on `status`. The textbook TOC remains the source of navigation order and supplies the ids that connect catalog cards, `sr_lessons`, answer events, and mistake history.

# module-relationships

The math-courseware skills are the main upstream writers. `ld-s10y-lesson` owns transcription, modern-edition validation, rendered fragments, and the initial lesson upsert. `ld-s10y-answer` owns answer-key and interaction production. The schema supplies JSONB storage, but the skills enforce edition consistency, exercise coverage, and document shape.

The application domain services are the downstream readers and learner-state writers. The lesson service exposes a key-free projection, the textbook answer service owns server-side judgment, and the current card route renders the result. The static textbook TOC and database rows meet at the shared card id; the database does not derive curriculum order from the TOC.

Legacy relationships remain deliberately visible. `sr_content_ledger` has no active producer or consumer in the current code. `sr_lesson_i18n` is bypassed by current math publication but is still used by English lessons and older math reading and quiz services. There is no separate card-tree table: the old card-tree contract is a `content.cards` shape inside `sr_lessons`, alongside the new `content.prose` shape. Old `sr_questions`, quiz attempts, and answer events support the retained relational quiz path rather than the current S10Y exercise renderer.

# constraints

The SQL snapshot declares table columns, primary keys, and indexes, but it does not validate JSONB structure. Exercise numbering, one-to-one answer and interaction coverage, supported judge modes, edition equality, and public-key removal are application and publisher invariants. Direct JSONB writes can therefore create rows that satisfy PostgreSQL while breaking rendering or leaking answers.

Answer secrecy spans both nested objects. Expected values and display answers in `answerKey`, and target coordinates in grid `interaction.points`, must remain server-side. Public projection may expose only the information needed to render an input.

The unique `(subject, stage, lesson_order)` index is stricter than the text primary key and can collide when different books reuse a grade and printed order. The current publisher intentionally surfaces that conflict. The SQL snapshot contains no declared foreign keys, check constraints, or cascades, so relationships and deletion behavior must not be assumed.

# known-limits

This file is descriptive rather than executable migration history. It does not encode deployment order, data transformations, or a schema version. It also shows bigint identifiers without identity or sequence defaults, although current writers insert rows without supplying those ids. Live identity-generation behavior therefore exists outside the documented SQL surface.

The old and new lesson representations share the same JSONB columns. Consumers must distinguish `content.cards` from `content.prose`, and PostgreSQL cannot guarantee that an exercise deck matches either shape. Compatibility code can drift even while the current card route continues to work.

Lesson republishing preserves existing `answerKey` objects but does not preserve existing `interaction` objects. Running the base lesson publisher after interaction publication can remove those specifications unless the interaction publication step is repeated. Status is also not a runtime publication gate: a draft row with usable content can become available.

# notes-for-ai

When changing current math persistence, trace the complete chain from the S10Y lesson publisher through answer and interaction publication to `getCardContent`, `checkTextbookAnswer`, and `/card/:id`. Preserve the card id, edition checks, exercise-number alignment, and server-only grading material.

Do not revive `sr_content_ledger`, math overlays, or the old card-tree shape as inputs to new S10Y generation. Do not remove them solely because the current card route bypasses them: English still depends on `sr_lesson_i18n`, and old math services remain compatibility readers.

Treat live schema changes as an explicit database operation and then synchronize this descriptive snapshot. Before changing deletion behavior or identifiers, inspect all application joins because the SQL file declares no foreign keys or cascades. Verify both the stored JSONB and the browser projection after any lesson-schema change, especially that expected answers, display answers, and target coordinates do not appear before submission.
