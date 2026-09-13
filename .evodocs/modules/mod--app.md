# purpose

The `app` module is LemmaDeck's deployed learning application: a single server-rendered TanStack Start process that serves the public math and physics curriculum, Soviet textbook cards, account entry, learner statistics, and the mistake book. Domain services decide what data is available, safe to expose, and authoritative to persist; learner experience turns those contracts into routes, controls, and responsive screens.

The parent also owns the standalone package and production boundary. It defines how Vite, TanStack Start, React, Tailwind, and Nitro build the application, how the generated route graph is assembled, how unit and browser tests are invoked, and how the repository-root container build includes the external textbook source of truth. Content generation and database schema are upstream modules, not responsibilities of the application process.

# structure

`app/` has its own manifest, lockfile, TypeScript configuration, build configuration, test configuration, source tree, and generated server output. There is no repository-root JavaScript package. Vite reads environment variables from the repository root, grants the app access to the sibling `ssot-resources` tree, and serves `ssot-resources/public/` as its public directory. Nitro emits `.output/server/index.mjs`, which is the production entry point copied into the runtime container.

The generated route tree covers the public landing page, login, the learning dashboard, mistake history and Soviet textbook cards. Retained legacy English paths redirect to the landing page and expose no English-learning interface. The root document resolves locale during SSR, sets the document language, loads the application stylesheet and local math fonts, and includes KaTeX resources. The pathless `_app` shell keeps the curriculum catalog mounted around card, dashboard and mistake routes.

The two child modules divide the implementation. `app/domain-services` owns PostgreSQL access, sessions, locale state, textbook structure, current S10Y lesson delivery and grading, English projection, learner statistics, and retained compatibility services. `app/learner-experience` owns authored routes, React components, scroll and drawer interactions, answer widgets, the knowledge galaxy, and visual styling. The parent owns the package-level composition, generated route output, public assets, and test/deploy harness.

# flows

Every SSR request first resolves the locale in the root loader. The public `_app` shell then loads available textbook card ids, the active locale, and an optional current user. Public visitors can browse the landing page, curriculum and textbook cards. `/learn` and `/mistakes` perform their own session gates because their statistics and history have no anonymous equivalent.

The current Soviet textbook flow starts with a card id from the repository-level table of contents. Database availability decides whether that card is linked. `/card/$id` loads TOC-derived title, trail, and neighboring cards together with `sr_lessons.content.prose` and `sr_lessons.exercises.exercises`. The learner experience renders those preprocessed HTML fragments and inline figures directly in the application. Exercise controls receive only public answer-shape and grid metadata; server functions read the hidden answer key after submission, return a verdict, and persist events only for a signed-in learner.

The English flow uses the same shell and lesson table but a distinct short-text content shape. Reading exposes sentences, glosses, vocabulary, patterns, and available audio. Recitation progressively masks words and judges submissions on the server. Audio download and playback endpoints stream database bytes through server routes rather than exposing database access to the browser.

The production flow installs from the app lockfile, copies the app and the external textbook TOC into the repository-shaped container context, runs the Vite build, and starts Nitro from `.output`. Unit tests run through a separate Vitest configuration. Browser tests require a separately running application and an explicitly chosen base URL.

# module-relationships

The content-generation module is upstream. The current math chain is `ld-s10y-lesson`, with modern figures delegated to `ld-s10y-image` and answers plus interaction specifications delegated to `ld-s10y-answer`. Those tools publish one `sr_lessons` row per TOC card id. The app consumes their prose and exercise JSONB at `/card/$id`; it does not invoke authoring tools or rebuild lessons at runtime.

The database-schema module owns the durable contracts used by domain services: lessons, users, answer events, textbook mistakes, English audio, and retained legacy overlay, question, and attempt tables. All application database access is mediated by `app/src/lib/db.ts`. The browser receives server-function projections rather than connection details or raw privileged rows.

The Soviet textbook TOC under `ssot-resources` is a compile-time curriculum authority shared with content generation. It defines book hierarchy, card identity, labels, and navigation. `sr_lessons` determines whether a card currently has readable prose or exercises. A mismatch between TOC ids and published lesson ids makes content unreachable or unlabeled even when the database row itself is valid.

The learner-experience and domain-services children meet at typed server-function boundaries. Routes load locale, curriculum, content, user state, and statistics; components submit answers and recitation attempts; domain services return browser-safe results and own persistence. The root Dockerfile and deployment platform consume the built artifact, while the root document depends on jsDelivr for additional KaTeX assets.

# constraints

The app must remain a standalone package whose commands run from `app/` or through `npm --prefix app`. The repository-root Dockerfile relies on that layout and on a root build context that includes `ssot-resources`. The generated route tree and `.output` are tool-owned and must not be edited manually.

Database credentials and queries stay server-side, and the app uses one shared Postgres client. Hidden answer values must not cross initial lesson or exercise fetches. Current S10Y content is trusted generated material rendered as HTML and SVG, so upstream generation and figure audits are part of the runtime safety boundary.

Card identity is shared across the TOC, `sr_lessons`, answer events, mistakes, and navigation. Changing ids or exercise numbers is therefore a cross-module migration, not a local route refactor. Public lesson access and authenticated progress/history are intentional separate policies.

# known-limits

The Playwright harness does not start a server and has no common base URL. Individual specs choose their own base-URL environment variable, and the suite still includes an external Playwright example plus an empty seed test. Running the entire browser suite is therefore not a reliable single-command acceptance signal without selecting and configuring relevant specs.

The root document loads KaTeX scripts and a stylesheet from jsDelivr in addition to local package resources. Math enhancement can be delayed or impaired when that external network dependency is unavailable.

The current application carries both the direct S10Y prose/exercise path and older card-tree, overlay, relational quiz, and lesson-progress services. Those compatibility surfaces increase conceptual load even though the current `/card/$id` route does not use them.

# notes-for-ai

Classify changes before editing. Package, build, generated route, test harness, public asset, and container concerns belong to the parent. Database policy, content projection, curriculum logic, judging, sessions, and statistics belong to domain services. Routes, components, local interaction state, and CSS belong to learner experience.

For current math work, trace a real TOC card id through availability, `sr_lessons`, `/card/$id`, browser-safe answer metadata, server-side grading, answer events, and mistakes. Do not treat `reading.ts`, `quiz.ts`, or the old lesson progress model as the current generation or rendering entry. Coordinate storage-shape changes with the S10Y publishers and preserve hidden answer-key separation.

Run the focused unit tests and production build from `app/`. For browser verification, start the actual SSR service on the assigned port, pass that URL explicitly, and select current route specs. Verify public card access separately from authenticated dashboard and mistake-book behavior.
