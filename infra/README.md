# LemmaDeck Hosting

Production moved from Azure Container Apps to **Render** on September 23, 2026 under
STEMROBIN-159. DNS, TLS, the deployed commit, database readiness, and read-only desktop/mobile
course rendering were verified before accepting the cutover.

## Current Production

- Public URL: `https://lemmadeck.com`; `www` redirects once to the apex, preserving path and query.
- Render origin: `https://lemmadeck.onrender.com`.
- Workspace: `intentplex` (`tea-d229rofdiees73d7h4gg`).
- Web service: `lemmadeck` (`srv-dapsio9srm7s73an5p60`).
- Frankfurt, one `0.5c-512mb` instance, root `Dockerfile` and root build context.
- No Render database, disk, worker, cron, autoscaling, or preview service.
- GitHub repository: `wang-chonghuan/lemmadeck`, branch `main`, automatic deployments disabled.
- Health endpoint: `/healthz`; success requires production session configuration and a reachable
  existing Supabase database, and reports `RENDER_GIT_COMMIT`.
- Cloudflare apex and `www`: DNS-only CNAMEs to `lemmadeck.onrender.com`, TTL 300.
- Both custom domains are verified by Render and have valid HTTPS. Render handles the `www`
  redirect; the former Cloudflare redirect rule is retained only with the rollback baseline and
  is inactive while `www` is DNS-only.

The service was created through the official Render API. There is **no Blueprint instance or
Blueprint automatic sync**. Root `render.yaml` is a version-controlled configuration reference;
editing it alone does not update the service. Reconcile deliberate configuration changes with
the actual Render API state.

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

## Release And Observation

Production release is deliberate; a push or merge does not publish automatically. Use the current
`ips-render-ops` skill, scope it to this service, and specify the approved merged revision:

```bash
python3 <ips-render-ops>/scripts/release.py --dry-run --only lemmadeck --commit <merged-sha>
python3 <ips-render-ops>/scripts/release.py --only lemmadeck --commit <merged-sha>
```

The dry run must match exactly one service. After release, verify the API deploy is `live` on the
same revision and check the actual website, not only the deploy command:

```bash
render deploys list srv-dapsio9srm7s73an5p60 --output json --confirm
render logs -r srv-dapsio9srm7s73an5p60 --limit 50 --output text --confirm
curl -fsS https://lemmadeck.com/healthz
curl -sS -o /dev/null -w '%{http_code}\n' https://lemmadeck.com/
curl -sSI 'https://www.lemmadeck.com/card/alg6-c1-s1-n2?tab=ex&exercise=14'
```

Use the skill's secret-safe authentication setup. `/healthz` must name the intended commit,
the response must identify Render, and the `www` redirect must preserve the requested path/query.
Learner interaction acceptance remains local; production checks are read-only.

For application rollback, use `ips-render-ops` capability 7 and select the preceding successful
Render deploy, then recheck the actual commit and health. Rollback does not restore environment
variables, DNS, or database state. Do not create a second normal Azure deployment path.

## Pending Retirement And Charter Approval

The old Azure application `ca-lemmadeck` remains in `rg-easyapp-shared` /
`cae-easyapp-shared` until the guarded deletion is explicitly confirmed. Its retained origin is
`https://ca-lemmadeck.kindsmoke-4d84c417.northeurope.azurecontainerapps.io`.
The rollback DNS baseline is apex A `20.54.18.105` (DNS-only, automatic TTL) and `www` CNAME to
the apex (proxied, automatic TTL), with the original Cloudflare redirect rule. Reverting DNS is a
deliberate production operation, not a routine release.

Run the n-easyapp read-only deletion plan again before removal. It targets only `ca-lemmadeck`,
the empty **Azure** `easyapp` database's `lemmadeck-schema`, and `lemmadeck-user`; it must not target
the same-named Supabase schema. The human must reply with the tool's exact confirmation phrase
before the destructive command runs. The dedicated Azure certificate, ACR `lemmadeck` repository,
and `asuid.lemmadeck.com` verification record remain until ownership and cleanup are approved.

Keep the shared Azure resource group, environment, registry, PostgreSQL server/database, other
projects, Supabase, and Azure model/image/TTS services.

The human-owned Engineering and Operations Charter still describes the previous Azure runtime.
It was **not edited** by the migration agent. Its Azure hosting/deploy facts and commands need the
human's explicit approval for minimal in-place replacement; other product/UI boundaries remain
unchanged. This verified transition record and `.intentfold/project.json` identify the actual
runtime so the old Charter does not cause an accidental Azure redeploy.
