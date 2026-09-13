# purpose

The content-generation module is LemmaDeck's repository-local authoring and publication toolchain. It converts governed curriculum sources into validated artifacts that the deployed application can consume. The tools are run manually or as one-off generation jobs; they are not part of the application's request path. Committed product resources live under `ssot-resources/`, disposable work lives under `.tmp/`, and published lesson content lives in the database.

The parent directly owns two workflows that do not have specialist child modules: short-text English lessons and the offline knowledge-galaxy rebuild. It also owns the shared dependency package and content-database adapter used by content skills. Public-domain biography reading and Soviet-textbook math courseware are declared children. The parent chooses and connects these workflows but does not own the children's internal narrative, extraction, figure, answer, or publication rules.

A common principle connects the workflows: generated prose or layout is not published merely because a model produced it. Human-owned source intent, deterministic validation, explicit failure behavior, controlled persistence, and product-level verification remain distinct stages.

# structure

The shared skill runtime under `.agents/skills` is intentionally separate from the web application's package. It provides PostgreSQL, browser automation, Markdown, and figure-related dependencies for one-off tools without coupling those dependencies to the deployed bundle. A single database adapter reads the repository-root environment, selects the content database URL, requires TLS, and fixes PostgreSQL's search path to `lemmadeck-schema`. English and biography publishers use that adapter so content writers do not each invent connection behavior.

The retained short-text English area is organized around three authorities. The human-owned 84-lesson outline defines scenes, reusable sentence patterns, dialogue or narrative form, and recycling intent. `ssot-resources/content/course/course-wordlist.json` is both the allowed vocabulary and the allocation plan: each canonical word carries level, provenance, intended introduction lesson, and a lifecycle state. Individual JSON lesson specs are the author-facing inputs containing English sentences, Chinese glosses, pattern instances, slot words, target words, and declared proper names. This tooling and historical data are retained but are not exposed as a learner-facing product area.

The English implementation separates vocabulary analysis, publication, media, and reporting. The vocabulary resolver maps ordinary surface forms, contractions, possessives, irregular forms, and productive suffixes back to canonical course entries. Its audit script generates thousands of plausible forms and protects both acceptance and rejection behavior. The publisher validates a spec, converts target and slot words to token indices, builds neutral content plus a Chinese overlay, renders a PDF, synthesizes narration, and persists the result. Reconciliation mutates the vocabulary plan after a save so omitted planned words become visible orphans rather than disappearing. Coverage remains a derived report over stored lessons.

The knowledge-galaxy area is an operational skill around an external prototype pipeline. It turns bilingual textbook tables of contents into Chinese embedding text, a UMAP layout, KMeans clusters, manually reviewed bilingual hub names, semantic links, and a static `galaxy.json`. The browser only loads and renders that file. A repository Playwright template provides the acceptance boundary for star counts, hub counts, labels, lazy canvas initialization, and screenshots.

# flows

An English lesson starts from the outline's scene and sentence patterns, then uses the wordlist entries assigned to that lesson as a coverage budget. The author writes a six-to-nine-sentence passage of at most 120 words, with a natural Chinese gloss for every sentence. Target words must be real course entries present in their sentence. Pattern ids, pattern translations, slot words, dialogue speakers, and declared proper names are all explicit data rather than conventions hidden in prose.

The dry-run path performs all inexpensive content checks and compares planned words with words actually covered. It rejects missing fields, invalid sentence counts, excess length, out-of-vocabulary forms, missing glosses, invalid targets or slots, malformed pattern references, missing target translations, and dialogue specs without speakers. The gate does not widen the vocabulary when a passage fails; the passage must be rewritten.

A full save transforms author-facing strings into the runtime contract. Sentence ids are assigned in order. Target and slot words become zero-based word-token indices. Canonical vocabulary keys and whole-passage covered keys are recorded in neutral JSONB, while Chinese sentence glosses and pattern explanations become a locale overlay keyed by stable ids. This split lets the application show localized support without duplicating the English artifact being memorized.

Before database mutation, the publisher renders a bilingual A4 PDF and calls Azure OpenAI TTS for sentence narration. Dialogue voices are assigned by first speaker appearance, and the whole-passage track preserves those voices by concatenating sentence clips. Narration uses one joined-text synthesis. A practice track adds a spoken lesson title, repeats each sentence, and inserts MP3-frame silence so the learner has time to speak. Word pronunciation is course-global and is synthesized only when the database does not already contain that word.

The lesson, overlay, sentence/full/practice audio, PDF, and new word audio are upserted in one PostgreSQL transaction. After it commits, reconciliation compares the saved passage with the wordlist plan. Covered planned words become taught; skipped words become orphaned; newly introduced words planned for unwritten lessons move to the lesson that actually taught them. Operators must either rewrite the lesson, move each orphan to a valid future lesson, or defer it with an explicit reason. Course coverage and recurrence are recomputed from stored lesson text, never copied back into the plan.

A galaxy rebuild starts from the authoritative Chinese textbook TOCs and English title overlays. Extraction follows the same card-addressing rule as the application: numbered topics become stars, while a section without topics becomes its own star. Chinese branch and chapter context are added to the embedding text. BGE embeddings feed a cosine UMAP layout and KMeans clustering. The layout command prints representative titles nearest every centroid; those samples are the evidence used to rewrite every Chinese and English hub label after a rerun.

The build step filters reviews, exercises, summaries, introductions, and appendices from final stars. It connects each hub to its strongest semantic neighbors and adds the strongest cross-discipline links, then writes the sole dataset to `ssot-resources/public/galaxy.json`; the prototype and application both consume that file. Verification runs against the real application, waits for lazy Three.js initialization, checks expected JSON and label counts, and captures the rendered galaxy before temporary test artifacts are removed.

# module-relationships

English authoring consumes human intent from the course outline and machine-readable allocation state from the course wordlist. The live database is the publication boundary: English writes `sr_lessons`, `sr_lesson_i18n`, `sr_lesson_audio`, and `sr_word_audio`. The application reads the `short-text` content discriminator, sentence and pattern ids, locale overlay, canonical vocabulary keys, token indices, and reserved `full` and `practice` audio nodes.

Those contracts have direct learner consequences. The reading view shows full English text, optional Chinese glosses, patterns, new versus review vocabulary, sentence audio, whole-passage audio, PDF, and the downloadable practice track. The recitation service uses the generated slot and target indices to choose a deterministic nested masking order, with pattern slots hidden before target words and remaining words. Hidden answers are omitted from browser payloads and graded against stored text on the server. Changing tokenization or publication shape therefore requires coordinated checks in the English domain service and both reading and recitation routes.

Azure OpenAI TTS is an external production dependency for newly published or regenerated English media. Playwright and a local browser are required for English PDF generation and galaxy acceptance. The repository-root environment is the operational bridge to both services.

The galaxy consumes the textbook catalog and emits `ssot-resources/public/galaxy.json` for the homepage `KnowledgeGalaxy` component. Vite serves that directory as the application's public root. Its discipline keys, bilingual titles, coordinates, clusters, hubs, and weighted links are a static contract. The component dynamically imports Three.js and fetches the JSON only when visible, so generation cost stays offline and the main client bundle does not absorb the layout stack.

The biography-reading child shares the parent's database adapter but owns its own provenance, narrative, question, and story persistence behavior. The math-courseware child owns Soviet-textbook lesson extraction, modern figures, answer enrichment, and lesson publication. Changes confined to either child belong in that child's documentation; parent-level changes concern shared infrastructure, skill routing, or interactions among the content producers and application consumers.

# constraints

English lesson rows must be written through the publisher, not by hand. The outline is human-owned and must not be machine-edited. The course wordlist is the only vocabulary and allocation authority, and unresolved words remain errors except for declared proper names and numbers. Lesson coverage, recurrence, and OOV reports are derived from stored lessons rather than persisted as competing truth.

Stable sentence and pattern ids, tokenization rules, target indices, slot indices, canonical vocabulary keys, overlay keys, and reserved audio node ids are cross-layer contracts. A seemingly editorial change can alter recitation masking, new-versus-review classification, hints, audio lookup, or server grading. PDF and TTS generation must succeed before publication; missing media is not silently accepted.

The database adapter must continue to target the shared content schema with TLS and the same URL precedence as the application. Secrets remain in the ignored root environment and must not appear in generated output or logs.

Galaxy extraction must remain aligned with the application's textbook card rules and subject mapping. Any embedding-corpus change requires a complete review of cluster names because KMeans ids are not stable semantic identities. The one canonical JSON output must remain under `ssot-resources/public/`. Embedding, reduction, clustering, and force-like work remain offline; the browser is a renderer and interaction layer, not a fallback generator.

# known-limits

The English blueprint covers 84 lessons, but committed lesson specs currently cover only the first two units. The vocabulary plan therefore remains largely unassigned or untaught, and the course-wide 100 percent coverage and three-lesson recurrence goals are not yet achieved.

Database publication and local wordlist reconciliation are sequential rather than atomic. A database transaction can commit before the repository JSON plan is updated, so an interrupted reconciliation requires an explicit out-of-band repair. The shared database adapter also retains compatibility URL fallbacks; a misconfigured environment can still select a nonpreferred database unless operators verify `LEMMADECK_DATABASE_URL`.

English publication depends on Azure TTS and a working Playwright browser. It performs PDF and audio generation before opening the persistence transaction, so a late failure avoids partial database writes but can consume significant time and external API usage. The Oxford parser is recovery code with machine-specific scratch paths and is not a portable way to rebuild the committed word list.

Hub naming remains a manual review step after every embedding rerun. Galaxy links express centroid similarity, not prerequisite direction, and UMAP may rotate or mirror the map without changing its semantics.

# notes-for-ai

For English work, begin with the requested lesson's outline card, assigned wordlist entries, and existing JSON spec. Run the vocabulary audit after changing lemma rules, use the publisher's dry run before paying for PDF or TTS work, and never relax a gate to accommodate one passage. After a full save, inspect the reconciliation report and leave no unexplained orphan.

Trace publication-shape changes through `vocab.mjs`, `save-lesson.mjs`, the live schema, `app/src/lib/english.ts`, and the reading and recitation routes. Verify actual stored rows, locale overlays, sentence and whole-passage playback, the practice download, vocabulary grouping, nested masking, server-side grading, and attempt recording. A successful saver run does not by itself prove that the passage is natural, memorable, or faithful to its scene and patterns.

For a galaxy rebuild, follow the skill's sequence without skipping cluster-sample review. Confirm the TOC source checkout before extraction, rewrite every hub label after layout changes, compare printed star and discipline totals, and use the repository's Playwright projects against the running application. Keep the temporary verification spec and screenshots out of the committed tree.

When a request concerns biography or Soviet-textbook math content, move into the corresponding child skill instead of adding another parent-level generator. Preserve the shared database adapter as the single connection definition for consumers that already use it, and coordinate any shared contract change with the application and schema owners.
