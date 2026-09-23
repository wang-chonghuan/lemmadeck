# Acceptance Checks

## AC1 Render Runtime And Product Flow

Before cloud authorization, validate the same artifact locally: build the root Dockerfile, run the
image as one production process with a 512 MB memory limit and the real Supabase connection, and
check `/healthz`. In headed Chromium at `1440x960` and `390x844`, verify the catalog, the largest
published lesson `phy6-c1-s6`, the figure-heavy lesson `alg6-c2-s1-n11`, lesson switching, the
MathLive input in `alg6-c1-ex`, and the print/download action. Record response latency, container
memory peak, restart/OOM state, browser errors, image failures, and the unchanged database row
count. After authorization, repeat the same checks on the Render URL and confirm the health payload
names the approved deployed commit.

## AC2 Domain And TLS Cutover

Before authorization, record the current read-only DNS and origin baseline and validate that the
cutover procedure preserves paths and query strings. After the Render service and domains are
approved, prove apex and `www` DNS targets, Render domain verification, certificate validity, one
intended redirect, preserved path/query, Render response-origin headers, and the deployed commit.
Do not mark this criterion passed from an HTTP 200 alone.

## AC3 Azure Retirement

Run only the n-easyapp read-only deletion plan and inventory the application-specific certificate,
image repository, validation record, empty Azure schema, and role alongside the shared resources
that must remain. After cutover approval and proof, run the guarded deletion flow only with the
human's exact confirmation and verify each approved target is absent while shared resources and
generation services remain. Until then, record this criterion as pending.

## AC4 Release, Rollback, Capacity, And Handoff

Validate `render.yaml` with the Render CLI and show it selects the root Dockerfile/context,
Frankfurt, one `0.5c-512mb` instance, manual deploys, `/healthz`, no disk/worker/cron, and secret
placeholders only. Verify the documented release and rollback commands against actual service
state after authorization. Report the current corpus distribution and an explicitly qualified
1,500-lesson storage projection, local capacity evidence, required secret migration, expected
session invalidation, rollback boundary, Charter replacement proposal, and every unexecuted
production step without including secret values.
