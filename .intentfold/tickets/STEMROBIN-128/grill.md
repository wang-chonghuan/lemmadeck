# Self Grill

## Does the request conflict with the Product Charter?

Yes. The existing Charter names short-literature English as a second product pillar. The user explicitly authorized changing the Charter and decided that this application will no longer include English learning. The plan therefore updates the product contract rather than leaving known drift.

## Does "remove English learning" authorize deleting data or generation assets?

No. The live ticket explicitly preserves database rows, resources, skills, and backend interfaces. The implementation removes only learner-facing UI and front-end route behavior. The current database premise was probed directly: 14 English lesson rows exist and form the preservation baseline.

## What should happen to saved direct links?

Redirect them before rendering to `/`. The landing page is the existing public mathematics/physics surface, while `/learn` is authenticated and would turn a retired public course link into a login wall. TanStack Router's current documented pattern is a `beforeLoad` guard that throws `redirect(...)`.

## Should the English route files be deleted?

No. Deleting them would produce an error surface for saved links and fail the direct-URL criterion. Minimal redirect routes preserve compatibility without retaining any English lesson UI.

## Should the audio download endpoint or `lib/english.ts` be removed?

No. They are backend interfaces explicitly preserved by the ticket. Removing their imports from the learner shell is sufficient to stop UI exposure.

## Are the acceptance criteria sufficient?

They now cover navigation absence, direct URL behavior, math continuity, the Charter decision, data preservation, deployment health, and deployed visibility. No additional product choice remains unresolved.

## Redline lookup

- The user explicitly directed the human-owned Product Charter change that this ticket requires.
- No dependency, schema, credential, generated-file, infrastructure, token-value, or destructive data change is planned.
- Deployment is the established routine application-image redeploy requested in the ticket.

