# n89 CHOICE Author Notes

Status: author-only frozen candidate, awaiting an independent reviewer.

## Scope

- Ticket: STEMROBIN-180, live Plane work item `5d849725-dbba-4fa6-9233-9967f86bad69`, read through the n-plane helper; no ticket mutation or comments.
- Shared worktree: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
- Branch identity: `codex/STEMROBIN-180-textbooks`.
- Current HEAD: `31b1b46fd80841c5b92e065126b98efcfe5fa546`.
- New, previously absent root: `.intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s1-n89`.
- Write scope: this root and the n89 report only. No canonical, retain, finalize, publish, Git mutation, database, app, dependencies, tool edits, or production interaction.
- The user's scoped author instructions replace the skill's default self-review fallback. No semantic self-review, approved claim, review JSON or review validation is produced.

## Source Intake

1. Read entry, project configuration, all four charter files, CHOICE skill and authoring/contract references, image batch rules, and ips-chrome-background.
2. Used only the allowed `7p/book.json` index to identify `phy7-c1-s1-n89`; did not inventory neighboring lessons or old CHOICE artifacts.
3. Ran `prepare.py inspect --repo . --book 7p --lesson phy7-c1-s1-n89`.
4. Selected both written exercises, numbers `1` and `2`, in full. Both had empty figure IDs.
5. The candidate prose paragraphs were application examples, not clean, relevant definition blocks for these two aerospace questions. Selected `--no-concepts` rather than slicing solved examples into a definition.
6. Ran `prepare.py prepare` for both exercises in this new root. The seed was tool-prepared, never manually assembled or changed.
7. Independently solved both entire source tasks and froze `source-first-solution.json` before creating any options. Its raw-byte SHA-256 was recorded at that point: `b3c7edcbea2f792f777af7c3815d34bb2e14ff8a8fff9dc43971c680c9889b8b`.
8. Manually authored two full explanation units, each native `single`, with four alternatives. All eight alternatives have substantive derivations; every wrong alternative has a specific reproducible misconception, and each question has task, full source solution, unit reason and explicit capacity losses.

No answers, private files, source solutions, author final keys, old CHOICE, old input specifications, earlier ticket results, figure specs or image reviews were read. Internal solutions and draft keys here were authored anew from the current allowed prose, not imported.

## Task Decisions

- Exercise 1: a complete pair of usual altitude-dependent heating comparisons and a reason is one response unit. It remains qualitative; no fixed altitude, speed, heating rate, radiation intensity, temperature or total-temperature claim was added. The stem preserves the original usual-trend limitation.
- Exercise 2: weak gravity-dependent natural circulation and fan-driven circulation are the two connected parts of one reason. The user explicitly specified microgravity; the stem makes normal in-orbit microgravity visible instead of leaving the key dependent on hidden context. This is not a task about measuring or guaranteeing constant temperature.
- No letter-slot or blank-slot splitting, combination-code alternatives, repeated variants or image-count quota.
- `pure-view.json` contains only the two draft `view` subtrees in draft order. It is an offline learner-facing projection, not an app or publishing payload.

## Capacity Loss

Both written tasks remain necessary outside this artifact. Recognition of supplied explanations cannot prove independent production of either the two-altitude comparison and reasoning or the temperature-density-gravity-buoyancy-fan causal chain. Choice responses do not verify operation, circuit design or temperature control. Coverage records the original writing loss, without claiming that all written capabilities were preserved.

## Budget And Evidence

- New author budget: at most one causal repair per affected natural response unit, including mechanical defects; no inherited repair history.
- Repairs used: `0/1` overall; each of the two response units used `0/1`.
- Exactly one structural `validate.py` invocation, without `--review`; its command and observed output are in `structural-validation.json`.
- No post-author semantic review or approval. An independent reviewer must solve the seed first, then inspect the pure view, then unlock the author internals.
- Image load count: `0`; batch limit `8`, current-context limit `24`, neither approached. Body-only fig-223 and fig-224 were not needed and were not opened. No new figure assets.
- Browser sessions launched: `0`; no native input or production interactions. No task-owned browser remains.
- All commands were bounded; no task-owned long-running exec session remains. Python commands disabled bytecode output so imports could not write outside the own root.

## Freeze

`author-handoff.json` binds the raw-byte hashes of seed, source-first solution, draft, pure view, notes, input binding, current SHA and structural evidence. Seed/draft canonical digests are also recorded. This is an author snapshot for independent review, not semantic acceptance or canonical retention.
