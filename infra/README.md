# LemmaDeck Hosting

Production moved from Azure Container Apps to **Render** on September 23, 2026 under
STEMROBIN-159. DNS, TLS, the deployed commit, database readiness, and read-only desktop/mobile
course rendering were verified before accepting the cutover.

## Operations Home

`.intentfold/charter/operations.md` is the single maintained source for production identifiers,
configuration, deployment, logs, post-deploy verification, and rollback. The human authorized its
in-place replacement of Azure hosting instructions on September 23, 2026.

The Render service is API-managed, with no Blueprint instance or automatic configuration sync.
Root `render.yaml` is a reference, not an automatic deployment mechanism. Azure is not an
alternative routine hosting or build path.

## Database And Secrets

The database remains the original shared **Supabase** project, schema `lemmadeck-schema`.
The production `LEMMADECK_DATABASE_URL` was compared with the existing Azure runtime connection
before copying it. No courses, users, learning records, or database schemas were migrated.

Render stores only the website's required runtime secrets:

- `LEMMADECK_DATABASE_URL`: the existing authoritative Supabase connection.
- `SESSION_SECRET`: a newly generated random production signing key.

Neither value belongs in Git, logs, or tickets. The new signing key invalidated old login cookies;
users sign in again. Later rotations require explicit approval. Content-generation/model/TTS
credentials remain outside the web service.

## Pending Azure Retirement

The old Azure application `ca-lemmadeck` remains in `rg-easyapp-shared` /
`cae-easyapp-shared` until the guarded deletion is explicitly confirmed. Its retained origin is
`https://ca-lemmadeck.kindsmoke-4d84c417.northeurope.azurecontainerapps.io`.
The rollback DNS baseline is apex A `20.54.18.105` (DNS-only, automatic TTL) and `www` CNAME to
the apex (proxied, automatic TTL), with the original Cloudflare redirect rule. Reverting DNS is a
deliberate production operation, not a routine release.

Run the n-easyapp read-only deletion plan again before removal. It targets only `ca-lemmadeck`,
the empty **Azure** `easyapp` database's `lemmadeck-schema`, and `lemmadeck-user`; it must not target
the same-named Supabase schema. The human must reply with the tool's exact confirmation phrase
before the destructive command runs. The human approved cleanup of dedicated leftovers, but
has not supplied the required `delete easyapp lemmadeck` phrase. No deletion has run.

After the app/schema/role deletion, recheck ownership and references before removing:

- Dedicated Azure certificate `mc-cae-easyapp-sh-lemmadeck-com-3571`.
- ACR repository `lemmadeck`, not the shared registry itself.
- Cloudflare `asuid.lemmadeck.com` verification TXT.
- Former Cloudflare `www to apex` redirect ruleset, currently inactive while DNS is DNS-only.

These remain with the old app and its rollback baseline until the guarded retirement completes.

Keep the shared Azure resource group, environment, registry, PostgreSQL server/database, other
projects, Supabase, and Azure model/image/TTS services.
