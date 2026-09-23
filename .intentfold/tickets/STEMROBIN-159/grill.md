# Self Grill

1. **Blueprint or direct API creation?** Commit a Blueprint, but do not apply it in this run. The
   ticket needs a reviewable hosting configuration and later repeatable ownership; the repository
   already has a public Git remote and one service. The Render API and CLI prove no LemmaDeck
   service exists, and creating the paid instance is outside current authorization. Delivery will
   state that the file is only proposed until a human creates the Blueprint instance.
2. **What should the health check prove?** Readiness, not merely process liveness. Supabase is the
   application's critical runtime dependency, and the migration must prove it still reads the
   original database. The endpoint will run a trivial query and validate session configuration,
   return 503 on failure, and expose only status plus the injected deploy commit.
3. **Should production retain the development session fallback?** No. The current source visibly
   falls back to `stemrobin-dev-session-secret`, and the investigation found no production
   `SESSION_SECRET`. Production must require an injected value. Local development and tests keep the
   fallback; rotating the real service value remains a separately approved action and invalidates
   existing cookies.
4. **Does 20 books imply more web memory or a disk?** No. Runtime loads one lesson by id from
   Supabase, and generators remain outside the web process. Current live data shows 63 lessons use
   about 23.3 MB of stored lesson/exercise/PDF payload, with a 15.2 MB maximum row; the 512 MB
   process limit must be tested against that outlier and figure-heavy interactions. Storage growth
   is reported separately from RSS.
5. **Can the production acceptance criteria pass in this run?** No. The ticket explicitly withholds
   approval for new recurring cost, production deployment, domain cutover, production secret
   rotation, Charter edits, and Azure deletion. Local and read-only evidence can be completed and a
   review PR published, but cloud criteria remain pending and must not be represented as passed.
6. **Does the route cross a Charter redline?** No. It adds no dependency or schema, does not write
   production content, preserves the root Dockerfile and root context, commits no secret, performs
   no cloud mutation, and does not edit human-owned Charter files. The Blueprint declares future
   domain association, but no DNS or Render resource is changed until explicit approval.
