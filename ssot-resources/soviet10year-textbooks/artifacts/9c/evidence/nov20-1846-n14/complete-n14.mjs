import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const artifact = 'ssot-resources/soviet10year-textbooks/artifacts/9c';
const lesson = 'ana9-c3-s1-n14';
const modern = `${artifact}/editions/modern-us-neutral/lessons/${lesson}`;
const evidence = `${artifact}/evidence/nov20-1846-n14`;
const read = p => JSON.parse(fs.readFileSync(p));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const content = read(`${modern}/lesson.json`);
const exercises = read(`${modern}/exercises.json`);
const answers = read(`${modern}/answer-keys.json`);
const answerAudit = read(`${modern}/answer-keys.audit.json`);
const audit = read(`${modern}/adaptation.audit.json`);
const draft = read(`${modern}/choice-set/draft.json`);
const review = read(`${modern}/choice-set/review.json`);
const visual = read(`${evidence}/mobile-e-readable/report.json`);
const intake = read(`${evidence}/mobile-e-readable/parent-intake.json`);
assert.equal(audit.status, 'pass');
assert.equal(audit.sourceLessonSha256, hash(`${artifact}/lessons/${lesson}/lesson.json`));
assert.equal(audit.sourceExercisesSha256, hash(`${artifact}/lessons/${lesson}/exercises.json`));
assert.equal(answers.status, 'ready');
assert.equal(answerAudit.status, 'pass');
assert.equal(answers.answers.length, 2);
assert.equal(answerAudit.ungraded, 2);
assert.deepEqual(answers.answers.map(a => a.exercise), exercises.exercises.map(e => e.number));
assert.equal(review.outcome, 'pass');
const digestResult = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '-c',
  'import sys,json;sys.path.insert(0,".agents/skills/ld-s10y-choice/scripts");from prepare import digest,load_json;print(json.dumps({name:digest(load_json(__import__("pathlib").Path(sys.argv[1])/name)) for name in ("draft.json","seed.json")}))',
  `${modern}/choice-set`,
], { cwd: root, encoding: 'utf8' });
assert.equal(digestResult.status, 0, digestResult.stderr);
const digests = JSON.parse(digestResult.stdout);
assert.equal(review.draft_sha256, digests['draft.json']);
assert.equal(review.seed_sha256, digests['seed.json']);
assert.equal(visual.verdict, 'PASS');
assert.equal(intake.fullReportAnd24CellObservationsConsumed, true);
assert.equal(intake.actualIndependentReviewer, '01a1f809-c0a7-7e30-a93a-a52b444ebdb7');
const restore = read('.tmp/stemrobin-184-six/n14-restore-passed.receipt.json');
for (const binding of restore.files) assert.equal(hash(binding.target), binding.sha256);
const { proseFlow } = createRequire(`${root}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`)('./htmlfrag.js');
const flow = proseFlow(content.prose, content.section_breaks ?? []);
assert.equal(flow.length, 12);
for (const file of [
  `${artifact}/book.json`,
  `${artifact}/editions/modern-us-neutral/book.json`,
]) assert(read(file).lessons.some(row => row.id === lesson));
const document = {
  schema: 's10y-offline-lesson-completion@1',
  date: '2026-11-20',
  lesson,
  status: 'offline-complete, unpushed; next small batch',
  newCompleteLessonDelta: 1,
  sourceBlocks: 7,
  modernProseObjects: content.prose.length,
  displayProseBlocks: flow.length,
  exercises: 2,
  figures: 0,
  answers: { count: 2, auto: 0, ungraded: 2, gate: 'Prior formal Gate2 and official finalize PASS reused byte-exactly; both complete standard answers retained.' },
  choices: {
    questions: draft.questions.length,
    options: draft.questions.reduce((count, q) => count + q.view.options.length, 0),
    reviewer: review.reviewer,
    gate: 'Prior source-first/view-only/internal review and official reviewed validation/retention PASS reused. No new answer, option or mathematical review.',
    losses: draft.coverage,
  },
  offline: {
    inherited: ['first', 'text-followup', 'revision1-visual-first', 'revision1-visual-followup', 'revision1-heading-nav-recovery', 'revision1-nav-assertion-recovery'],
    priorSixViewsAndControlsReplayed: false,
    pendingMobileEReadability: 'PASS; independent actual observations of all24cells across native left/right captures at390x844/mobile=true/touch=true/DSF1.',
    boundedReview: `${evidence}/mobile-e-readable/parent-intake.json`,
    nativeBrowser: 'Existing app Playwright, isolated headless browser; all runtimes closed.',
    renderingQualification: intake.renderingQualification,
    broaderApproval: 'Aggregate offline completion only, not a new whole-course/source approval, live product acceptance or formal ticket handoff.',
  },
  bindings: Object.fromEntries([
    'lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
    'answer-keys.json', 'answer-keys.audit.json',
    'choice-set/seed.json', 'choice-set/draft.json', 'choice-set/review.json',
  ].map(name => [name, { path: `${modern}/${name}`, sha256: hash(`${modern}/${name}`) }])),
  preservedHolds: [
    'Source glyph/Unicode ancestry and incidental ink UNKNOWNs unchanged.',
    'Original first visual/count/font predicate/nav assertion FAIL receipts remain historical, not rewritten.',
    'Exercise2px tiny-scroll gesture advisory UNKNOWN retained; full visible/reachable exercise ink previously observed.',
    'Source62 folio and source65 origins remain unrelated HOLDs, not dependencies of this no-figure lesson.',
    'n6 E59 missing noncollinearity, E58b book-answer conflict, n7 E64 literal5 and E69 empty-set convention remain HOLD.',
    'All unrelated geometry/scientific/glyph/fine-ink HOLDs preserved.',
  ],
  imageUsage: { parent: '24/24 exhausted;0newopens/decoders', oldReviewers: ['6/6', '2/2'], newBoundedIndependent: '2/2;0reopens' },
  boundary: '9c/10c offline only; no DB/publisher/interactions/model service/setup/review replay/merge/deploy/closure or proactive peer messages.',
  next: 'Continue actual missing native138 stage in new working layout; do not replay137 or release source/lesson HOLDs.',
};
assert.equal(document.choices.questions, 2);
assert.equal(document.choices.options, 10);
fs.writeFileSync(`${evidence}/completion.json`, JSON.stringify(document, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ lesson, completeLessons: 1, answers: 2, choices: 2, options: 10, pushed: false }));
