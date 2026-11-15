# Choice15 Structural Check

## Result

Status: mechanical PASS only. Independent semantic review is pending.

Command run from `/Users/yong/.codex/worktrees/0f12/lemmadeck`:

```bash
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s15/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s15/draft.json
```

Exit code: `0`.

Captured stdout, verbatim:

```text
mechanical checks passed; semantic review still required
```

No stderr was returned. No review argument was supplied; no semantic gate, review file, publisher payload, fixture, bytecode cache or external service was produced by this command.

The checker refreshes the selected source projection, verifies the seed trace, validates exact draft fields and references, native modes, nonempty keys, one rationale per option, structural truth/key consistency and source coverage mapping. It does not prove physics, fidelity, absence of answer leakage, or acceptability of the recorded production losses.

## Bound Snapshot

- Seed canonical SHA-256: `c9ab2cefe4b73420dd48c17de590144bf7c7c7d517648e7eebbd072d14926845`.
- Draft canonical SHA-256: `f7a1b098c251459311f2722430aad4ae3b348276d49d6cf5909d9f041e89718f`.
- Draft byte SHA-256: `ad617a647a8ab595b363abac09ae7b1c74530e9338e4ed9a1f1642b3b0a29603`.
- Source-solution byte SHA-256: `4ff59e03f31a2b99aa1b68c7da6233e83458f3ddaa869505a8f5efb468fd1867`.

Canonical digests were computed using the existing offline `prepare.py digest` command with the same `PYTHONDONTWRITEBYTECODE=1` and `-B` Python settings. File-byte hashes were computed using `shasum -a 256`.

This is one successful structural validation of the first author handoff. There is no failed semantic report to overwrite, and no repair or promotion is implied.
