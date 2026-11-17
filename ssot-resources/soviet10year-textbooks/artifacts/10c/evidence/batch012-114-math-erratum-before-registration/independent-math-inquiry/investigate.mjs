import { createHash } from 'node:crypto';
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const own = dirname(fileURLToPath(import.meta.url));
const prefix = '.intentfold/tickets/STEMROBIN-184/tmp/';
const lessonFolder = `${prefix}production-assembly10c168-171/10c/lessons/x1-114-自然对数作为具有可变积分上限的积分`;
const frozen = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-source164-affected168-first114-assembly/first168/0171/before.md';
const contract = '.claude/skills/ld-s10y-lesson/SKILL.md';
const expectedFrozenHash = 'cc5c595c812f745511f9c239fa22155bf5957a6a7a4cdd190e3600e13d178686';
const original = String.raw`$\exp_a(x)=\exp_a(x\cdot\ln a)$`;
const corrected = String.raw`$\exp_a(x)=\exp(x\cdot\ln a)$`;
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');

function put(name, content) {
  const target = resolve(own, name);
  if (!target.startsWith(`${own}/`)) throw new Error('Write escaped ownership boundary');
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, { flag: 'wx' });
}

function json(name, content) {
  put(name, `${JSON.stringify(content, null, 2)}\n`);
}

const guard = openSync(join(own, 'run.guard'), 'wx');
closeSync(guard);
if (existsSync(join(own, 'terminalseal.json'))) throw new Error('Already sealed');
const commands = [];
function command(label, executable, args) {
  const started = new Date().toISOString();
  const result = spawnSync(executable, args, { cwd: root, encoding: null });
  const stdout = result.stdout ?? Buffer.alloc(0);
  const stderr = result.stderr ?? Buffer.alloc(0);
  put(`commands/${label}.stdout`, stdout);
  put(`commands/${label}.stderr`, stderr);
  const record = {
    label, executable, arguments: args, cwd: root,
    started_at: started, ended_at: new Date().toISOString(),
    exit_code: result.status, signal: result.signal,
    error: result.error?.message ?? null,
    stdout: `commands/${label}.stdout`, stdout_bytes: stdout.length,
    stdout_sha256: sha(stdout),
    stderr: `commands/${label}.stderr`, stderr_bytes: stderr.length,
    stderr_sha256: sha(stderr),
  };
  commands.push(record);
  json('commands/' + label + '.json', record);
  if (result.status !== 0 || result.error || result.signal) {
    throw new Error(`${label} did not exit successfully`);
  }
  return stdout;
}

const lessonBytes = command('unit114-json', '/bin/cat', [lessonFolder + '/lesson.json']);
const markdownBytes = command('unit114-md', '/bin/cat', [lessonFolder + '/lesson.md']);
const frozenHashOutput = command('frozen171-sha256', '/usr/bin/shasum', ['-a', '256', frozen]);
const contractOutput = command('errata-contract', '/usr/bin/sed', [
  '-n', '72,83p;244,261p;328,341p', contract,
]);
const lesson = JSON.parse(lessonBytes.toString('utf8'));
const target = lesson.prose.filter((p) => p.source_refs?.includes('p0171#5'));
if (lesson.id !== 'x1-114-自然对数作为具有可变积分上限的积分') {
  throw new Error('Unexpected lesson identity');
}
if (target.length !== 1 || !target[0].text.includes(original)) {
  throw new Error('Literal or block binding does not match');
}
if (!markdownBytes.toString('utf8').includes(original)) {
  throw new Error('Markdown does not retain literal formula');
}
if (frozenHashOutput.toString('utf8').split(/\s+/)[0] !== expectedFrozenHash) {
  throw new Error('Frozen BEFORE identity mismatch');
}
const evidenceRefs = ['p0168#2', 'p0168#5', 'p0169#2', 'p0169#3',
  'p0169#4', 'p0170#2', 'p0170#8', 'p0171#3', 'p0171#4', 'p0171#5'];
json('input-bindings.json', {
  ticket: 'STEMROBIN-184',
  session: 'SessionB, same continuous authorization (human supplied)',
  branch: 'codex/STEMROBIN-184-textbooks (human supplied; no Git query)',
  lesson_id: lesson.id,
  block: 'p0171#5',
  inputs: [
    { path: lessonFolder + '/lesson.json', sha256: sha(lessonBytes), capture: 'commands/unit114-json.stdout' },
    { path: lessonFolder + '/lesson.md', sha256: sha(markdownBytes), capture: 'commands/unit114-md.stdout' },
    { path: frozen, sha256: expectedFrozenHash, treatment: 'Hash only; no page-body or image inspection' },
    { path: contract, excerpt_sha256: sha(contractOutput), capture: 'commands/errata-contract.stdout' },
  ],
  paragraphs: lesson.prose.filter((p) => p.source_refs?.some((r) => evidenceRefs.includes(r))),
  stageB: {
    path: 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-source168-stageB172-author166-first/stageB168/report.md',
    status: 'Human supplied: sealed StageA/B already confirms both subscripts. Not read or re-reviewed here.',
  },
});

const reason = 'The same function exp_a appears on both sides. Because the paragraph also requires exp_a to have an inverse, it must be injective: exp_a(1)=exp_a(ln a) implies 1=ln a, hence a=e. This contradicts the stated arbitrary base a>0, a!=1. Independently, for the intended ordinary base-a exponential, a=e^2 and x=1 give LHS=e^2 and RHS=(e^2)^2=e^4, which are unequal because e>1. At a=e the printed equality is only a tautology and does not define the function. The preceding exp=ln^{-1} definition justifies the separate candidate exp_a(x)=exp(x ln a).';
json('erratum.draft.json', {
  id: 'p0171-exp-base-definition',
  block: 'p0171#5',
  original,
  reason,
});
json('candidate-correction.json', {
  erratum_id: 'p0171-exp-base-definition',
  corrected,
  status: 'UNREGISTERED SCRATCH CANDIDATE ONLY',
  justification: 'ln(exp(x ln a))=x ln a. Thus the candidate is continuous, maps R bijectively onto (0,infinity) for a>0,a!=1, has value a at x=1, agrees with a^r for every rational r by the unit114 rational-power logarithm property, and has inverse ln(y)/ln(a).',
  source_adoption: false,
  promotion: false,
  canonical_registration: false,
  humanpixel_grant: false,
});
put('findings.md', `# Unit114: independent mathematical erratum investigation

Conclusion: definite mathematical typo in the retained literal, under the
printed arbitrary-base and inverse-function requirements. This is not a
transcription correction or a pixel re-review.

## Source Binding

- Lesson: \`${lesson.id}\`.
- Target: \`p0171#5\`, printed page 165, source page 0171.
- Exact original: \`${original}\`.
- Both subscripts remain \`a\` in the assembly JSON and Markdown.
- Frozen BEFORE SHA-256: \`${expectedFrozenHash}\` (hash independently matched).
- StageA/B literal confirmation is supplied by the human; the sealed StageB
  report was not reopened. No image, crop, or canonical page body was opened.
- Assembly inputs are captured at this investigation's read time, not claimed
  to be the parent's later/final assembly identity.

## Independent Argument

Unit114 defines ln by the integral from 1 to x of 1/t, establishes strict
increase and range R, defines e by ln(e)=1, and defines exp as ln's inverse.
The initial paragraph intends the ordinary continuous base-a exponential.
The final paragraph additionally requires exp_a to have an inverse.

Put f=exp_a and c=ln(a). The literal states f(x)=f(cx) on R.
An inverse requires injectivity. Substituting x=1 forces 1=c, hence a=e.
Consequently no injective function can satisfy the literal for ANY allowed
base a other than e, irrespective of how ordinary exponentiation is defined.
For a=e, f(x)=f(x) is a tautology: consistent with the intended exponential
but unable to define it uniquely. At x=0 the equality also holds trivially,
which does not rescue an asserted identity for all real x.

The equation by itself can have non-injective solutions (a constant function,
for example), so it is not an absolute logical contradiction without the
context. Such solutions are not the intended exponential and cannot provide
the required inverse. Treating the RHS as the preceding unsubscripted exp
would fix the issue, but would change the retained literal rather than
interpret both identical subscripts faithfully.

## Exact Counterexample

Choose a=e^2 and x=1. By the unit's logarithm addition/power property,
ln(a)=2. For the intended f(t)=a^t:

- LHS = f(1) = e^2.
- RHS = f(1*ln(a)) = f(2) = (e^2)^2 = e^4.
- e>1 follows from ln's strict increase, ln(1)=0 and ln(e)=1;
  therefore e^4>e^2. No numerical approximation or model result is needed.

This counterexample uses integer exponent arithmetic already in the opening
definition, not a corrected formula silently assumed as source.

## Separate Corrected Candidate

Candidate ONLY: \`${corrected}\`.

Remove only the RHS subscript a. The RHS then uses the immediately preceding
exp=ln^{-1}. Let g(x)=exp(x ln(a)). Then ln(g(x))=x ln(a).
The rational-power property gives ln(a^r)=r ln(a), hence g(r)=a^r
for rational r by injectivity of ln. Continuity extends the intended ordinary
base-a exponential to all reals. Since ln(a)!=0 for allowed a, multiplication
by ln(a) is bijective; composed with exp it is a bijection R -> (0,infinity).
It increases for a>1 and decreases for 0<a<1, with inverse ln(y)/ln(a).
In particular g(1)=a and g(0)=1. This justifies the proposed correction.

## Draft and Contract

\`erratum.draft.json\` contains only the contract's id, block, faithful
original and independently checked reason. \`candidate-correction.json\`
keeps the proposed corrected formula outside that draft and outside source.

The skill requires faithful original text to remain unchanged and confirmed
mathematical errors to be registered against an existing page block. Modern
corrections require registered errata plus matched page hash, block, original,
corrected text and authoritative source/assembly binding. None of those
registration, prepare, finalize, publication or promotion actions was run.
The BEFORE Markdown hash is source-identity evidence, not a fabricated
finalized page-JSON hash or a substitute for the parent's assembly identity.

## Limits and Stop

Only NEW \`${relative(root, own)}\` is owned/written.
No source/page changes, corrected source adoption, old-unit re-review, pixel
inspection, model calls/images, counts, finalizers, assembly, rendering, Git,
backend, refresh, setup, app, schema, dependency operations or tests.
No claim about the printer's mental intent or an alternate source edition;
the mathematical defect is definite under the supplied literal and context.
Early bootstrap commands returned combined tool streams, preserved in this
chat at the chunk IDs recorded in bootstrap-transcript.md; their stdout and
stderr cannot retrospectively be separated. Investigation command streams
are captured separately and in full in the commands directory. This is an
explicit trace limit, not a claim of missing streams being empty.
The parent retains all source finalization, assembly identity and promotion
decisions. This draft is not promotion and grants no new humanpixel authority.
Stop after the scratch evidence seal.
`);
json('command-records.json', {
  outer_execution: {
    tool: 'functions.exec_command',
    arguments: {
      cmd: 'node .intentfold/tickets/STEMROBIN-184/tmp/production-114-expa-erratum/seal.mjs',
      workdir: root, login: false, max_output_tokens: 3000, yield_time_ms: 10000,
    },
    stdout: 'terminal.stdout',
    stderr: 'terminal.stderr',
    exit_code: 'The seal wrapper records the actual child exit and propagates it to the outer tool.',
  },
  bootstrap: 'See bootstrap-transcript.md for all eight prior actual exec calls and returned streams/exits.',
  commands,
  api_actions: 'Node standard-library reads/writes are this evidence script; outputs are confined to the owned directory. apply_patch authored the script, transcript and seal wrapper.',
});

function inventory(folder, excluded) {
  const entries = [];
  for (const name of readdirSync(folder).sort()) {
    const path = join(folder, name);
    const rel = relative(own, path);
    if (excluded.has(rel)) continue;
    if (statSync(path).isDirectory()) entries.push(...inventory(path, excluded));
    else {
      const bytes = readFileSync(path);
      entries.push({ path: rel, bytes: bytes.length, sha256: sha(bytes) });
    }
  }
  return entries;
}

json('manifest.json', {
  status: 'SCRATCH CANDIDATE ONLY; NO PROMOTION; STOP',
  ticket: 'STEMROBIN-184',
  scope: 'Independent mathematical investigation, prospective modern unit114 only',
  owned_path: own,
  source_before_sha256: expectedFrozenHash,
  finding: 'Definite mathematical typo for arbitrary allowed base; special base e is only tautological',
  outputs: inventory(own, new Set(['manifest.json', 'terminalseal.json',
    'terminal.stdout', 'terminal.stderr'])),
  seal_protocol: 'manifest.json inventories all preterminal files; terminalseal.json adds manifest and exact terminal stream hashes after observing this process exit. Neither document claims to hash itself.',
});
process.stdout.write('TEXT: definite mathematical typo in p0171#5; a=e^2,x=1 gives e^2 != e^4. Candidate only: ' + corrected + '\n');
process.stdout.write('PATH: ' + join(own, 'findings.md') + '\n');
process.stdout.write('HASH: ' + sha(readFileSync(join(own, 'findings.md'))) + '\n');
process.stdout.write('MANIFEST_PATH: ' + join(own, 'manifest.json') + '\n');
process.stdout.write('MANIFEST_HASH: ' + sha(readFileSync(join(own, 'manifest.json'))) + '\n');
process.stdout.write('STOP: no canonical edits or promotion; terminal seal follows only after observed exit.\n');
