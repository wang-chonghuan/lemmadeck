# purpose

The learner-experience module owns LemmaDeck's authored routes, React interaction state, navigation surfaces, responsive shell, and visual presentation. It turns server-side projections from `app/domain-services` into public curriculum discovery, Soviet 10 Years textbook cards, short-text English study, account entry, and authenticated progress and mistake views. It does not decide which content is authoritative, judge answers locally, or access persistence directly.

The current mathematics experience is centered on `/card/$id`. One textbook card is rendered as ordinary application DOM from the current `sr_lessons` prose and exercise fragments. This is the active reading and practice path. The older iframe-based card reader and relational quiz drawer still exist as compatibility components, but no current route mounts them.

# structure

The route graph has three presentation contexts. `/` is a public standalone landing page with its own `lw-*` layout and scroll container. `/login` is a standalone account page. The pathless `_app` route is a public learning shell around `/card/$id`, `/english/$id`, `/english/$id/recite`, `/learn`, and `/mistakes`; only `/learn` and `/mistakes` enforce authentication. `/english-audio/$id` is a server route that returns a downloadable practice recording.

The root document resolves locale on the server, sets the HTML language, installs global application CSS, loads packaged MathLive fonts and KaTeX CSS, and adds deferred KaTeX scripts from jsDelivr. The TanStack router uses its generated route tree and built-in scroll restoration. An additional rendered-navigation subscriber resets elements marked as application scroll containers, because the shell keeps the document itself fixed while route content scrolls inside dedicated panes.

The `_app` shell loads available math ids, English lesson references, locale, and an optional user. It keeps a hierarchical catalog mounted beside the changing route outlet and places one locale menu over the detail header. The catalog can hide unavailable curriculum or reveal it as non-link rows, preserves disclosure state while navigating, and links ready TOC cards and available English lessons. Guests see a sign-in action; authenticated learners receive a compact account menu with mistake-book and logout actions.

Desktop catalog width is draggable, CSS-clamped, and persisted in local storage without rerendering the curriculum tree on every pointer move. Below 1200px the catalog becomes an 80vw drawer behind a scrim. The shell also maps `window.visualViewport` dimensions and offsets into CSS variables so the fixed mobile layout follows browser keyboard and panning changes. The global stylesheet provides the dense teal, green, and white application system, card and exercise typography, English worksheet controls, landing composition, focus treatment, safe-area padding, and reduced-motion behavior.

The source tree also contains `CardReader` and `QuizDrawer`. They are substantial retained implementations, not dead stubs: the first renders legacy `content.cards` in measured sandboxed iframes with app-DOM read checks, and the second renders relational questions with shuffled choices and resumable attempts. However, neither is imported by an authored route or another mounted component. Their `.sr-read-modes`, `.sr-card-reader`, and `.sr-quiz-*` CSS must therefore be treated as compatibility styling rather than evidence of current user flow.

# flows

The current S10Y route begins when a learner follows a TOC link to `/card/$id`. Its loader asks domain services for locale and card content and asks the textbook projection for title, number, curriculum trail, and adjacent cards. The page renders prose blocks as paragraphs, captions, inline SVG figures, or images. Exercise fragments retain the printed book's group headings and globally meaningful exercise numbers. Both lesson HTML and SVG enter the application DOM directly with `dangerouslySetInnerHTML`; there is no nested lesson document, iframe height measurement, full-text mode, or read-check gate.

If a card has exercises, the page presents local read and exercise tabs. A normal navigation starts on reading. A mistake-book redo supplies `tab=ex` and an exercise number, causing the route to open practice, highlight that book-numbered item, and scroll it into view after router scroll restoration and delayed MathLive replacement have settled. Previous and next links come from TOC order. The favorite and ask-AI controls currently render in the footer without attached behavior.

Each exercise receives only public answer shape and interaction metadata. Automatically graded numeric parts use native text inputs with decimal keyboards and an explicit sign toggle. Other parts dynamically instantiate MathLive, share its virtual keyboard, offer compact and full layouts, and scroll the focused field above the visible viewport or keyboard. Inputs persist drafts in local storage using lesson, exercise, and part identity. Missing answer metadata produces an unavailable state rather than an editable field.

Submission calls server-side textbook grading. Automatic multi-part answers cannot submit until every part has content. A correct result locks the exercise. An ungraded exercise reveals its reference response and closes. An incorrect first attempt stays editable and shows only a retry prompt; the standard answer is revealed after the second wrong attempt. Multi-part feedback reports each part's correctness. Coordinate exercises replace text entry with a click grid: the learner selects named points, each click fills configured x and y answer positions, and standard points are sent back and overlaid only after grading.

The public landing page derives its curriculum menu from the TOC and current availability. Desktop users get a sticky navigation bar and curriculum mega-menu; narrower screens get a right-side drawer and scrim. Ready sections link directly to `/card/$id`, while unavailable sections remain visible but inert. Locale switching writes the locale through a server function and invalidates the router. The primary visual surface is the knowledge galaxy beside the course proposition.

The galaxy waits until its host intersects the viewport, then imports Three.js and OrbitControls and fetches `/galaxy.json` in parallel. It renders semantically positioned stars, discipline-colored hubs, curved hub relationships, collision-managed labels, and localized tooltips. Pointer movement highlights nearby hubs and relationships; a click recenters the scene on a hub or star. Search focuses matching concepts, zoom controls change camera distance, panning is clamped to the disc, and idle auto-rotation resumes after interaction. The renderer follows container resizes, pauses while the document is hidden, and disposes geometry, materials, controls, listeners, overlays, and the WebGL renderer on unmount.

English reading uses `/english/$id` inside the shared catalog shell. It presents sentence-pattern templates first, then one passage card with per-sentence audio and Chinese-gloss controls, followed by new and review vocabulary. Whole-passage and sentence narration are fetched lazily from database-backed server functions and cached by lesson plus node; word audio is cached by word. Navigating to another lesson clears gloss and playback state to prevent route-component reuse from leaking the prior lesson. The page can download a PDF through a base64 browser conversion and can link directly to the streamed practice MP3 attachment.

Recitation at `/english/$id/recite` provides five selectable levels over the same passage. Levels one through four show all sentences at once and progressively replace words with narrow inline inputs. The learner may answer in any order. A hint marks that sentence assisted; even if the server accepts the answer, it remains pending, clears its help and draft, and must be produced again without assistance before the level passes. Wrong results identify positions rather than exposing expected words. Level five grades one whole-passage textarea. Lesson or level changes reset pending, answers, hints, errors, and result state.

Authenticated learners enter `/learn`, which combines card coverage, answer accuracy, mastery, mistake ratio, and links to the latest available cards. `/mistakes` groups recorded textbook errors by UTC date and links each occurrence back to its exact card and exercise. `/login` accepts existing credentials and separately records registration-interest email; successful login navigates to the dashboard. The `_app` shell itself remains public, so card and English browsing do not require a session.

# module-relationships

`app/domain-services` is the learner experience's server-side counterpart. Route loaders consume its locale, session, curriculum, card, English, statistics, audio, and mistake projections. Components call its login, logout, locale, textbook-answer, and recitation functions. Domain services retain database access, authorization, normalization, grading, answer-key secrecy, and persistence; this module retains rendering, local state, browser storage, navigation, and interaction pacing.

The S10Y content-generation modules are upstream through `sr_lessons`. They provide the prose, exercise HTML, figures, answer shape, and interaction metadata rendered by `/card/$id`. The textbook TOC is a separate upstream authority for hierarchy, card labels, availability navigation, and neighboring links. Lesson ids and printed exercise numbers connect the visible card, answer events, dashboard statistics, and mistake-book redo, so identity changes affect several modules at once.

The app parent owns the package, build, deployment, generated route output, and browser-test harness that compose this child with domain services. The root document depends on Google Fonts and jsDelivr KaTeX resources. The knowledge galaxy depends on browser WebGL, dynamically loaded Three.js, and the public galaxy dataset. English playback depends on stored database audio, while practice download uses a route response rather than embedding a large base64 payload in the page.

# constraints

Public content and personal state have different access policies. Do not restore a global `_app` authentication wall: math cards and English lessons are public, while progress and mistake history require a user. Browser-visible card data must remain answer-key-free, and all correctness decisions must continue through server functions.

Current S10Y content is trusted generated HTML and SVG inserted directly into the application DOM. Any change to fragment shape, CSS classes, sanitization assumptions, figure behavior, lesson ids, or exercise numbering must be coordinated with the content producers and domain projections. The active route must not be inferred from the retained `CardReader`, `QuizDrawer`, or their comments.

The shell relies on fixed document overflow, nested marked scroll containers, a persistent catalog, router reset behavior, and mobile visual-viewport variables. Changes to layout or route transitions must preserve keyboard visibility, safe areas, drawer closure, desktop resizing, and mistake-redo scrolling. Locale changes must invalidate the router so server-projected labels and content change together.

Math answer drafts are client-local, but grading and standard answers are server-owned. The first-wrong retry interval, two-attempt reveal rule, original answer-part ordering, and post-grade-only grid standards are user-visible contracts. Dynamic MathLive setup and teardown must not leave stale fields or a visible virtual keyboard after navigation.

# known-limits

The component and stylesheet tree contains a large compatibility surface for the retired card-reader and relational-quiz experience. `CardReader`, `QuizDrawer`, iframe measurement, read-check UI, attempt phases, reading-mode CSS, and quiz drawer CSS are unmounted by the current route graph but still increase maintenance cost and can mislead code readers.

Several comments also lag runtime behavior. `login.tsx` still describes `_app` as globally protected, `start.ts` says the application has no auth layer, and parts of the catalog and stylesheet describe older card boundaries or reading modes. Route guards, imports, and rendered JSX are more reliable than those comments.

Direct fragment insertion assumes S10Y HTML and SVG are trusted. MathLive initializes asynchronously and answer drafts live only in the current browser's local storage. Google Fonts and root KaTeX resources require external network access. The galaxy requires WebGL, Three.js, and a valid `/galaxy.json`; a failed import or fetch has no explicit error state and can leave the loading skeleton in place.

The login page cannot create or recover an account; its registration form only records email interest. Favorite and ask-AI controls on the card footer have no action. The landing's “start learning” link targets the authenticated dashboard, so a guest is redirected through login rather than entering a public card directly.

# notes-for-ai

For math UI work, start at `/card/$id` and trace the exact `ProseBlock`, `CardExercise`, answer-specification, and grid shapes returned by domain services. Verify direct DOM rendering with real generated HTML and SVG. Test cards with no content, prose only, grouped exercises, multiple answer parts, numeric and MathLive inputs, ungraded responses, first and second wrong attempts, coordinate grids, previous/next navigation, and mistake-book search parameters.

Do not wire new behavior into `CardReader` or `QuizDrawer` unless the task explicitly restores those compatibility flows. Confirm a component is reachable from an authored route before treating it as active architecture. Likewise, do not preserve obsolete iframe or reading-mode CSS merely because old comments describe it; establish whether a current selector is mounted.

For shell work, verify guest and signed-in catalogs, show-all availability, nested TOC expansion, English navigation, locale invalidation, account actions, desktop rail resizing, the sub-1200px drawer, visual viewport movement, internal scroll restoration, safe-area padding, and reduced-motion behavior. Remember that `/` has its own scroll container and responsive navigation rather than using `_app`.

For English changes, test route reuse across lesson ids, all three audio cache scopes, gloss reset, PDF and MP3 download, every recitation level, assisted answers that require a clean retry, wrong-position feedback, whole-passage grading, and switching levels while asynchronous requests are in flight. For galaxy changes, exercise delayed intersection loading, search focus, click versus drag, zoom and pan bounds, resize, visibility pause, locale relabeling, and cleanup on unmount.
