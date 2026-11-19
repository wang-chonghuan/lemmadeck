import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const owned = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1203-n98-first-bilingual-text-author')
const prep = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1201-n97n99-first-preparation')
const card = 'phy10-c2-s4-n98'
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const requirementsPath = path.join(prep, 'cards', card, 'source-requirements.json')
assert.equal(hash(requirementsPath), '3704022fa9ddfc034656a30b735df67cc9ea5e3a975e3393c4df0e16264f5c6c')
const requirements = load(requirementsPath)
assert.equal(requirements.card, card)
for (const binding of [requirements.rawLesson, requirements.rawExercises, ...requirements.sourcePages]) {
  assert.equal(hash(binding.path), binding.sha256, binding.path)
}
const lesson = load(requirements.rawLesson.path)
const exercises = load(requirements.rawExercises.path)
assert.equal(lesson.id, card)
assert.equal(lesson.exercise_count, 8)
assert.equal(exercises.count, 8)
assert.equal(exercises.exercises.length, 8)
assert.deepEqual(exercises.exercises[4].pages, ['p0263#11', 'p0264#1'])
for (const directory of ['root', 'work', 'zh', 'en', 'FIRST']) {
  assert.equal(fs.existsSync(path.join(owned, directory)), false, 'Inventory must precede seeds/candidates')
}

const proseRequirements = [
  ['The new velocity-addition law agrees with relativistic concepts of space and time.',
    'Classical addition cannot be generally correct because it conflicts with invariant vacuum light speed.'],
  ['A train moves at v; a light wave travels along the direction of train motion inside the carriage.',
    'Relative to Earth its speed must still be c, not v+c; the new law must reproduce this.'],
  ['State the special collinear velocity-addition law without a proof.',
    'The object moves along the axis of K_1; K_1 moves relative to K at v.',
    'X and X_1 remain coincident throughout the motion; Y/Y_1 and Z/Z_1 remain parallel.',
    'Retain the explicit reference to Figure 226.'],
  ['Retain the original fig-226 block identity and source ref; pixels are already approved/consumed and out of this author scope.'],
  ['v_1 is the object velocity relative to K_1; v_2 is its velocity relative to K.',
    'v denotes the relative velocity of K_1 with respect to K, defined in the preceding source block.',
    'Keep equation (8.6) exactly: v_2=(v_1+v)/(1+v_1v/c^2).'],
  ['Retain the Figure 226 caption as a separate source-bound cap block.'],
  ['Both v<<c AND v_1<<c are required for the classical regime.',
    'Then v_1v/c^2 can be neglected in the denominator and equation (8.6) reduces approximately to classical addition v_2=v_1+v.'],
  ['For v_1=c, v_2 also equals c, as required by the second postulate of relativity.',
    'Retain the exact substitution and simplification ending in c.'],
  ['For the source-permitted values of v_1 and v (neither exceeding c), v_2 does not exceed c.',
    'Retain v_1=v=c as a formal limiting substitution, not a realizable inertial frame moving at c.',
    'Keep v_2=2c/2=c exactly.'],
  ['v>c is not permitted in the source relativistic framework.',
    'Equations (8.1) and (8.2) lose physical meaning because their time and length values become imaginary.'],
  ['The speed of light is the maximum possible speed for transmitting interactions in nature.'],
]
assert.equal(proseRequirements.length, lesson.prose.length)
const questionRequirements = [
  'Ask which propositions/postulates form the basis of relativity.',
  'Ask the difference between the first postulate of relativity and the relativity principle in mechanics.',
  'Ask which events are called simultaneous.',
  'Ask what proper time means.',
  'Ask why slower passage of time in a moving reference frame does not contradict the relativity principle, namely equivalence of all inertial reference frames. Preserve the complete p0264#1 closure.',
  'Ask in which experiment the relativity of time intervals was discovered.',
  'Ask how a rod length changes with its velocity.',
  'Ask at which velocities relativistic velocity addition becomes the classical law.',
]
const mathTokens = (text) => [...text.matchAll(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g)].map((match) => match[0])
const sourceUnits = lesson.prose.map((block, index) => ({
  stableTarget: `lesson.prose[${index}]`,
  assembledOrder: index,
  source_refs: block.source_refs,
  identity: Object.fromEntries(['kind', 'id', 'label', 'printed_page'].map((key) => [key, block[key]])),
  source_text: block.text,
  exactMathTokensInOrder: mathTokens(block.text),
  mandatorySemantics: proseRequirements[index],
}))
const questionUnits = exercises.exercises.map((exercise, index) => ({
  stableTarget: `exercises[${index}]`,
  assembledOrder: index,
  identity: Object.fromEntries(['number', 'source_number', 'group', 'group_id', 'pages', 'figure_refs', 'figures']
    .map((key) => [key, exercise[key]])),
  source_text: exercise.text,
  literalSourceLines: exercise.lines,
  exactMathTokensInOrder: mathTokens(exercise.text),
  mandatorySemantics: questionRequirements[index],
}))
const claimedRefs = [...sourceUnits.flatMap((unit) => unit.source_refs), ...questionUnits.flatMap((unit) => unit.identity.pages)]
const expectedRefs = requirements.blocks.filter((block) => !['h3', 'exhead'].includes(block.kind)).map((block) => block.ref)
assert.equal(new Set(claimedRefs).size, claimedRefs.length)
assert.deepEqual([...claimedRefs].sort(), [...expectedRefs].sort())
const inventory = {
  schema: 'stemrobin/semantic-source-inventory@1',
  ticket: 'STEMROBIN-181', batch: 'D037', book: '10p', card,
  role: 'FIRST bilingual modern TEXT AUTHOR only',
  frozenAt: new Date().toISOString(), stage: 'FROZEN-BEFORE-ANY-SEEDS',
  cwd: repo, ownershipRoot: owned,
  approvedSourceRequirements: bind(requirementsPath),
  preparation: bind(path.join(prep, 'cards', card, 'preparation.json')),
  rawLesson: bind(requirements.rawLesson.path),
  rawExercises: bind(requirements.rawExercises.path),
  suppliedTemplates: ['lesson', 'exercises'].map((kind) =>
    bind(path.join(prep, 'work/adapt/10p/modern-us-neutral/lessons', card, `${kind}.template.json`))),
  sourcePages: requirements.sourcePages,
  boundary: requirements.boundary,
  literalSourceBlocksInPrintedOrder: requirements.blocks.map((block, index) => ({
    sourceOrder: index, ...block,
    stableTargets: [...sourceUnits, ...questionUnits]
      .filter((unit) => (unit.source_refs ?? unit.identity.pages).includes(block.ref))
      .map((unit) => unit.stableTarget),
  })),
  heading: requirements.blocks.find((block) => block.kind === 'h3'),
  exerciseHeading: requirements.blocks.find((block) => block.kind === 'exhead'),
  proseUnitsInAssembledOrder: sourceUnits,
  questionsInOriginalOrder: questionUnits,
  sourceCounts: {
    requirementBlocks: requirements.blocks.length,
    proseBlocks: lesson.prose.length,
    textBlocks: lesson.prose.filter((block) => block.kind === 'p').length,
    captionBlocks: lesson.prose.filter((block) => block.kind === 'cap').length,
    figureBlocks: lesson.prose.filter((block) => block.kind === 'fig').length,
    exercises: exercises.exercises.length,
    questionSourceBlocks: questionUnits.reduce((count, unit) => count + unit.identity.pages.length, 0),
    exactMathTokens: sourceUnits.reduce((count, unit) => count + unit.exactMathTokensInOrder.length, 0),
  },
  sourceFigureIds: requirements.sourceFigureIds,
  sourceImageContext: { actual: 0, status: 'approved/consumed; no images opened in this task' },
  limits: [
    'No original tasks omitted or invented; no choices, answers or worked review-question solutions.',
    'Source snapshots, source_refs/pages, original order, group identities and printed title remain literal.',
    'Formula tokens and their order remain exact; no unregistered scientific correction.',
    'No modern finalization, rendering, figure generation, publishing, DB, network, paid calls or Git commands.',
  ],
  independentApproval: 'pending', completeModernCard: false,
}
const output = path.join(owned, 'source-inventory.json')
fs.writeFileSync(output, JSON.stringify(inventory, null, 2) + '\n', { flag: 'wx', mode: 0o444 })
fs.chmodSync(output, 0o444)
console.log(JSON.stringify({ inventory: bind(output), sourceCounts: inventory.sourceCounts, seedsExistedAtFreeze: false }, null, 2))
