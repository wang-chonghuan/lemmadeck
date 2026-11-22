import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

export const card = 'phy10-c1-s1';
export const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/10p`;
export const out = `${ticket}/tmp/d1816-d1196-introduction-first-en`;
export const work = `${repo}/.tmp/STEMROBIN-181/d1816-d1196/work`;
export const root = `${repo}/.tmp/STEMROBIN-181/d1816-d1199/root`;
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const tool = `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`;
const command = process.argv[2];

if (command === 'prepare') {
  const source = bind(`${book}/lessons/${card}/lesson.json`);
  assert.equal(source.sha256, 'c2ab001a7c1479ee756d1148681352a4034e8b603254236e8faeb5ba773e7394');
  const products = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${book}/editions/modern-us-neutral/lessons/${card}/${name}`));
  const raw = read(source.path), zh = read(products[0].path);
  assert.equal(raw.prose.length, 4);
  assert.equal(raw.exercise_count, 0);
  assert.deepEqual(raw.figures, []);
  assert.deepEqual(zh.source.data, raw);
  assert.equal(zh.status, 'ready');
  assert.equal(read(products[3].path).status, 'pass');
  assert.equal(read(products[3].path).sourceLessonSha256, source.sha256);
  const delivery = read(`${ticket}/production-meter.json`).deliveryBatches.find(row => row.id === 'D-002');
  assert(delivery.cards.includes(card));
  assert.equal(delivery.status, 'complete-committed-pushed');
  const pages = [...new Set(raw.prose.flatMap(block => block.source_refs)
    .map(ref => /^p(\d+)#/.exec(ref)[1]))];
  const sourcePages = pages.flatMap(page => ['json', 'md'].map(ext => bind(`${book}/pages/${page}/page.${ext}`)));
  for (const file of [source, ...products, ...sourcePages]) {
    const result = spawnSync('git', ['show', `${delivery.commit}:${path.relative(repo, file.path)}`], { cwd: repo });
    assert.equal(result.status, 0);
    assert.equal(crypto.createHash('sha256').update(result.stdout).digest('hex'), file.sha256);
  }
  assert(!fs.existsSync(`${book}/editions/modern-us-neutral-en/lessons/${card}`));
  const historicalDisplay = bind(`${ticket}/evidence/offline/phy9-c1-s2-n13/result-phy10-c1-s1--phy9-c1-s2-n13.json`);
  assert.equal(read(historicalDisplay.path).status, 'pass');
  const receipt = run('d1196-introduction-first-en-prepare', [
    python, '-B', tool, 'adapt-prepare', '--book', '10p', '--edition', 'modern-us-neutral-en',
    '--lesson', card, '--root', path.dirname(book), '--work', work,
  ]);
  save(`${out}/prepared.json`, {
    task: 'D1196', card, book: '10p', source, approvedZh: products[0],
    productsReusedExactly: products, sourcePages, historicalChineseDelivery: delivery,
    historicalDisplay, historicalZhScience: null,
    historicalScienceApprovalNotInvented: true, firstEnglishScienceReviewRequired: true,
    originalObjects: 4, originalTasks: 0, originalFigures: 0, work, receipt,
    sourceAndChineseReviewReplayed: false, parentImages: 0, paidCalls: 0, databaseWrites: 0,
  });
}

if (command === 'author' || command === 'author-recovery') {
  const prepared = read(`${out}/prepared.json`);
  const lesson = read(prepared.approvedZh.path);
  const tocPath = `${repo}/ssot-resources/soviet10year-textbooks/toc/10p/en.json`;
  const matches = read(tocPath).contents.flatMap(chapter => (chapter.lessons || [])
    .filter(section => section.id === card).map(section => ({ chapter, section })));
  assert.equal(matches.length, 1);
  const { chapter, section } = matches[0];
  assert(!section.topics?.length);
  Object.assign(lesson, {
    edition: 'modern-us-neutral-en', locale: 'en', status: 'draft',
    title: section.title, printed_title: section.title, chapter: chapter.title,
  });
  const texts = [
    `So far, this textbook sequence has followed a connected path through physics.
In Grade Eight, we studied mechanical motion: how the positions of bodies, or parts of bodies, change relative to one another over time.
In Grade Nine, thermal and molecular physics introduced thermal processes.

The second half of Grade Nine physics dealt with electromagnetic phenomena.
But the study of electrodynamics was not yet complete.
Important processes such as alternating current and radio waves, which are electromagnetic waves, still remained.

Yet the first pages of the Grade Ten textbook return to mechanics, beginning with mechanical oscillations.
Only afterward does the book continue the electrodynamics left unfinished in Grade Nine.
Why take this route?`,
    `In Grade Eight, besides the general laws of mechanics, we spent much time on particular kinds of motion, such as uniformly accelerated motion and circular motion.
But two important forms of mechanical motion, oscillations and waves, had not yet been discussed.
They were not forgotten: there is a good reason to study mechanical and electromagnetic oscillations and waves together.`,
    `At first, a swinging pendulum and a capacitor discharging through a coil seem to have little in common.
But they do share something important.
In corresponding models and under the appropriate conditions, mechanical and electromagnetic oscillations can obey the same mathematical laws.

To see the connection, focus on how a quantity changes with time, rather than on what is oscillating, such as a mass attached to a spring or the current in a circuit.
This does not make the mechanical and electrical quantities the same physical thing.
Wave processes of different physical kinds can likewise share mathematical laws under corresponding conditions.`,
    `The physics of oscillations studies different kinds of oscillation from a unified point of view.
It has important practical uses, including the study of vibrations in machines and mechanisms.
Its results also provide a foundation for alternating-current and radio technology.`,
  ];
  assert.equal(texts.length, lesson.prose.length);
  for (const [i, text] of texts.entries()) {
    lesson.prose[i].text = text;
    lesson.prose[i].changes = ['layout', 'translation'];
  }
  const input = `${out}/en.before-native${command === 'author-recovery' ? '.recovery' : ''}.json`;
  save(input, lesson);
  const receipt = run(`d1197-introduction-first-en-author-native${command === 'author-recovery' ? '-recovery' : ''}`, [
    python, '-B', '-c', `import sys,json
from pathlib import Path
sys.path.insert(0,${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(input)}))
prepared=edition.load(Path(${JSON.stringify(`${out}/prepared.json`)}))
raw=edition.load(Path(prepared["source"]["path"]))
zh=edition.load(Path(prepared["approvedZh"]["path"]))
edition.normalize_lesson_layout(lesson)
flow,errors=edition.prose_flow_contract(lesson["prose"],[])
boundaries=[]
for prefix in ["Yet the first pages", "The physics of oscillations"]:
    indices=[i for i,p in enumerate(flow["paragraphs"]) if p["text"].startswith(prefix)]
    assert len(indices)==1 and indices[0]>0,(prefix,indices)
    i=indices[0]
    boundaries.append({"before":flow["paragraphs"][i-1]["text"],"after":flow["paragraphs"][i]["text"]})
lesson["section_breaks"]=boundaries
flow,flow_errors=edition.prose_flow_contract(lesson["prose"],boundaries)
errors.extend(flow_errors)
errors.extend(edition.validate_lesson_identity(raw,lesson))
profile=edition.load(Path(${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json`)}))
for i,(modern,approved,source) in enumerate(zip(lesson["prose"],zh["prose"],raw["prose"])):
    assert edition.math_signature(modern["text"])==edition.math_signature(approved["text"]),(i,"math signature")
    errors.extend(edition.validate_identity_fields(source,modern,["kind","id","printed_page","source_refs"],f"en.prose[{i}]"))
    errors.extend(edition.validate_text(source["text"],modern["text"],modern["changes"],modern["numeric_changes"],f"en.prose[{i}]",profile["forbidden_terms"]+profile["forbidden_person_names"],modern.get("historical_entities"),None))
print(json.dumps({"lesson":lesson,"flow":flow,"errors":errors},ensure_ascii=False))
assert not errors,errors`,
  ]);
  const output = JSON.parse(fs.readFileSync(read(receipt.path).streams.stdout.path, 'utf8'));
  save(`${out}/en.lesson.draft.json`, output.lesson);
  save(`${out}/en.prose-flow.json`, output.flow);
  save(`${out}/authored.json`, {
    task: 'D1197', card, status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS',
    prepared: bind(`${out}/prepared.json`), englishToc: bind(tocPath),
    source: prepared.source, approvedZh: prepared.approvedZh,
    englishDraft: bind(`${out}/en.lesson.draft.json`), englishFlow: bind(`${out}/en.prose-flow.json`),
    receipt, originalObjects: 4, originalTasks: 0, originalFigures: 0,
    flowParagraphs: output.flow.paragraphs.length, historicalScienceApprovalNotInvented: true,
    firstFailedReceipt: bind(`${ticket}/tmp/d1816-recovery/native/d1197-introduction-first-en-author-native/receipt.json`),
    firstFailedInput: bind(`${out}/en.before-native.json`),
    recoveryScope: 'Only Arabic-digit grade names replaced by English words; source grade identities unchanged.',
    scientificClarification: 'Analogous laws apply to corresponding models and conditions, not every oscillation or wave unconditionally.',
    sourceAndChineseReviewReplayed: false, firstIndependentEnglishReviewPending: true,
    parentImages: 0, paidCalls: 0, databaseWrites: 0, newCompleteCourses: 0, newSourcePages: 0,
  });
}

if (command === 'finalize') {
  const reviewPath = process.argv[3], reviewHash = process.argv[4];
  assert.equal(bind(reviewPath).sha256, reviewHash);
  assert.equal(read(reviewPath).status, 'PASS');
  const authored = read(`${out}/authored.json`), prepared = read(`${out}/prepared.json`);
  assert(JSON.stringify(read(reviewPath)).includes(authored.englishDraft.sha256));
  for (const file of [prepared.source, ...prepared.productsReusedExactly])
    assert.equal(bind(file.path).sha256, file.sha256);
  fs.mkdirSync(`${root}/10p/lessons`, { recursive: true });
  for (const name of ['book.json', 'pages', 'figures', `lessons/${card}`])
    fs.symlinkSync(`${book}/${name}`, `${root}/10p/${name}`, fs.statSync(`${book}/${name}`).isDirectory() ? 'dir' : 'file');
  copy(reviewPath, `${out}/first-en-review.original.json`);
  const templates = `${work}/adapt/10p/modern-us-neutral-en/lessons/${card}`;
  copy(`${templates}/lesson.template.json`, `${out}/prepared-template.original.json`);
  fs.copyFileSync(authored.englishDraft.path, `${templates}/lesson.template.json`);
  const receipts = [];
  for (const stage of ['adapt-finalize', 'render'])
    receipts.push(run(`d1199-introduction-first-en-${stage}`, [
      python, '-B', tool, stage, '--book', '10p', '--root', root, '--work', work,
      '--edition', 'modern-us-neutral-en', '--lesson', card,
    ]));
  const directory = `${root}/10p/editions/modern-us-neutral-en/lessons/${card}`;
  const row = {
    locale: 'en', edition: 'modern-us-neutral-en',
    lesson: bind(`${directory}/lesson.json`), exercises: bind(`${directory}/exercises.json`),
    figures: bind(`${directory}/figures.json`), audit: bind(`${directory}/adaptation.audit.json`),
    textHtml: bind(`${work}/render/10p/modern-us-neutral-en/${card}/text.html`),
    exercisesHtml: bind(`${work}/render/10p/modern-us-neutral-en/${card}/exercises.html`),
  };
  assert.equal(read(row.audit.path).status, 'pass');
  assert.equal(read(row.exercises.path).count, 0);
  assert.equal(read(row.figures.path).figures.length, 0);
  assert.deepEqual(read(row.lesson.path).prose, read(authored.englishDraft.path).prose);
  assert.deepEqual(read(row.lesson.path).section_breaks, read(authored.englishDraft.path).section_breaks);
  save(`${out}/native-result.json`, {
    task: 'D1199', card, status: 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS',
    root, work, rows: [row], receipts, prepared: bind(`${out}/prepared.json`),
    authored: bind(`${out}/authored.json`), review: bind(reviewPath),
    originalObjects: 4, originalTasks: 0, originalFigures: 0,
    parentImages: 0, paidCalls: 0, databaseWrites: 0, fullCourseDisplayPending: true,
  });
}

if (command) console.log(JSON.stringify({ command, output: out }));
