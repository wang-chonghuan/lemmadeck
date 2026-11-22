import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const configs = {
  'phy10-c1-s2-n2': {
    prepare: 'D1217', author: 'D1218', objects: 15, figures: 3,
    gate: 'image-review-10p-n2-n3-final-binding.json',
    boundaries: ['In an ideal model', 'For the mechanical systems'],
    texts: [
      String.raw`How can a body move back and forth after leaving equilibrium?
First consider the ball moving along a horizontal rod in Figure $3$` + '\u2460' + `: pull it away from equilibrium, release it from rest, and apply no continuing external drive.
For now, assume that the spring is within the range of Hooke's law and that friction and air resistance are negligible.`,
      '\u2460 ' + `A ball on a vertical spring is also acted on by gravity, so both gravity and the spring force must be considered.
If gravity remains constant and the spring still obeys Hooke's law, gravity changes the equilibrium position.
Studying the motion relative to that new equilibrium gives the same form of motion law as for the horizontal spring.`,
      '',
      'Figure 3',
      String.raw`Pull the ball to the right of equilibrium (Figure $3$a), extending the spring by $x_{\mathrm{m}}$ (Figure $3$b), and release it from rest.
The spring force $\vec{F}$ on the ball points left and is proportional in magnitude to the deformation, as described by Hooke's law.
Under the spring force $\vec{F}$, the ball accelerates leftward and its speed increases.

As the ball approaches equilibrium, the spring deformation and the spring force $\vec{F}$ decrease.
At equilibrium, the spring force $\vec{F}$ is zero.
If weight and vertical support balance and horizontal resistance is negligible, the net force and acceleration are also zero at that instant.`,
      String.raw`Zero acceleration does not mean zero velocity.
The ball still has leftward velocity as it passes through equilibrium, so inertia carries it farther to the left.
The spring then becomes compressed, and its force points right (Figure $3$c), slowing the ball.

The magnitude of rightward acceleration is proportional to the magnitude of displacement $x$ from equilibrium.
At the leftmost turning point, velocity is momentarily zero but the spring force is not, so the ball reverses direction.
As it approaches equilibrium to the right, its speed increases.

As the magnitude of displacement $x$ decreases, the spring force $\vec{F}$ decreases.
At equilibrium, $\vec{F}$ is again zero.
The ball still has rightward velocity and keeps moving right, stretching the spring.

The leftward spring force slows it until it reaches the rightmost turning point and reverses again.
The process repeats.`,
      `In an ideal model with no friction, air resistance, or other energy loss, the ball keeps oscillating.
Real apparatus has resistance.
For the stationary guide rod and air considered here, resistance opposes the ball's motion relative to them.

Resistance reduces the oscillation's energy, and the turning points gradually approach equilibrium as the oscillation decays.
When resistance is small, many oscillations occur before the decay becomes obvious.
If the observation time is short enough for the change in the range of motion to be negligible, a model without resistance can approximate this part of the motion.`,
      '',
      'Figure 4',
      String.raw`The apparatus in Figure $4$ reduces friction during horizontal oscillation.
The ball is attached by a small rod to the clamp of a pulley, which moves along a horizontal guide rod with relatively little friction.
The vertical support provided by the small rod balances the ball's weight.

When horizontal resistance is neglected, the combined spring force from the two springs determines the ball's horizontal oscillation.`,
      String.raw`If a ball suspended from a spring is immersed in a viscous liquid such as glycerol (Figure $5$), resistance may be too large to neglect.
The equilibrium position is determined jointly by the spring force, weight, and buoyancy.
If the ball is released from rest and damping is sufficiently strong relative to its mass and the spring stiffness, it gradually returns to equilibrium without crossing back and forth.

The dashed line in Figure $5$ marks equilibrium.
In this case, the ball's velocity approaches zero as it approaches equilibrium.
Not every soft spring or every liquid necessarily makes oscillation disappear.`,
      `For the mechanical systems studied here, back-and-forth oscillation requires both restoring action and inertia.
When a body is displaced from stable equilibrium, a restoring force must act toward equilibrium along the allowed direction of motion.
The spring system behaves this way: on either side of equilibrium, the spring force points toward it.

Damping must also be weak enough to allow back-and-forth motion.
Small resistance permits many observable free oscillations; greater resistance may make them decay quickly or prevent repeated crossings altogether.
Without a continuing external energy supply, only an ideal model that neglects all energy loss maintains oscillations without decay.`,
      '',
      'Figure 5',
      `The relationship between restoring action, inertia, and resistance also helps us analyze other mechanical oscillating systems.
Next we study the pendulum, seeing how it returns toward equilibrium and then passes through it because of inertia.`,
    ],
  },
  'phy10-c1-s2-n4': {
    prepare: 'D1202', author: 'D1203', objects: 6, figures: 1,
    gate: 'image-review-10p-n2-n3-final-binding.json',
    boundaries: ['For the ball moving'],
    texts: [
      `Newton's laws of mechanics connect the forces on an oscillating body with its motion.
This lesson first considers a ball on a horizontal spring: the mass remains constant, the spring obeys Hooke's law, and friction and air resistance are neglected.`,
      String.raw`In an inertial reference frame, Newton's second law states that mass $m$ multiplied by acceleration $\vec{a}$ equals the net force $\vec{F}$ on the body:
$m\vec{a}=\vec{F}$ (1.1)
Use the net force, not an arbitrarily selected single force.`,
      String.raw`For the ball moving along a horizontal straight line in Figure $3$, take the $OX$ axis to the right and place the origin at equilibrium (Figure $3$a).
The ball's weight and vertical support force balance, so motion along the $OX$ axis is determined by the spring force $\vec{F}$ through its component along the $OX$ axis, $F_x$.
By Hooke's law, the magnitude of $F_x$ is proportional to the magnitude of displacement from equilibrium.

With equilibrium as the origin, displacement equals coordinate $x$.
The restoring force always points toward equilibrium, so $F_x$ and $x$ have opposite signs (Figure $3$b, c):
$F_x=-kx$ (1.2)

Here $k$ is the spring stiffness and is positive.
The minus sign means that force and displacement point in opposite directions.`,
      String.raw`Substituting the horizontal restoring force into Newton's second law gives:
$ma_x=-kx$ (1.3)
Here $a_x$ is the acceleration component along the $OX$ axis.

Dividing both sides of equation (1.3) by mass $m$ gives:
$a_x=-\frac{k}{m}x$ (1.4)`,
      String.raw`Mass $m$ and stiffness $k$ remain constant, so the ratio $\frac{k}{m}$ is also constant.
The equation says that acceleration component $a_x$ is proportional in magnitude to displacement $x$ and has the opposite sign.
The farther the ball is from equilibrium, the greater its acceleration toward equilibrium.

At the instant it passes through equilibrium, its acceleration is zero, but its velocity need not be zero.`,
      `Other systems can also have oscillations described by an equation of the same form when the restoring force is proportional to displacement and resistance is negligible.
This is a conclusion with conditions: not every free oscillation obeys this equation.`,
    ],
  },
  'phy10-c1-s2-n1': {
    prepare: 'D1207', author: 'D1208', objects: 16, figures: 2,
    gate: 'image-review-10p-n1-length-correction.json',
    boundaries: ['**Free oscillations**', '**Forced oscillations**'],
    texts: [
      `Oscillations are very common in nature.
It is easy to set an object oscillating.`,
      String.raw`Hang a spring from a support and attach a small metal ball to its lower free end.
The spring stretches.
At equilibrium, the spring force $\vec{F}_0$ balances the ball's weight $\vec{G}$ (Figure $1$a).

Pull the ball gently downward, away from equilibrium, and release it.
It moves up and down, up and down (Figure $1$b).
In this motion, the body repeatedly moves first in one direction and then in the other.

This kind of motion is called oscillation.
After a time, the oscillations gradually die away and the ball finally stops moving.`,
      '',
      'Figure 1',
      String.raw`An even simpler way to produce oscillations is to hang a small ball from a string.
At equilibrium, the string is vertical, and the ball's weight $\vec{G}$ balances the string tension $\vec{F}_0$ (Figure $2$a).
Move the ball away from the vertical and release it: it swings back and forth (Figure $2$b) until the oscillations die away.

The ball on a string is a simple example of a pendulum` + '\u2460' + `.
More generally, a body hung from a string or mounted on an axis so that it can oscillate under gravity is called a pendulum.
The axis need not pass through the body's center of gravity.

A drawing ruler hung from a nail and a balance beam can both act as pendulums.`,
      '\u2460 ' + `A ball on a string acts as the gravitational pendulum discussed here because gravity provides a restoring action.
The Earth, which produces this gravitational interaction, is included in the oscillating system that we call a simple pendulum.`,
      '',
      'Figure 2',
      `What is the main feature of oscillation?
First, the motion repeats.
After a pendulum completes one oscillation, moving from the leftmost position to the rightmost and back to the leftmost, it begins another such motion.

If the motion repeats exactly at equal time intervals, it is called periodic motion.`,
      `In an oscillation, motion repeats exactly or approximately over intervals of time.
Real oscillations need not repeat with perfect regularity.`,
      `The motion of a car engine's piston, a buoy moving in waves, branches moving in the wind, and the beating of a heart are examples of repeated motion and oscillation.
These examples do not all have perfectly constant amplitudes or periods.`,
      `**Free oscillations** In mechanics, a group of bodies whose motion we study is called a system of bodies, or simply a system.
Forces between bodies within a system are internal forces.
Forces exerted on its bodies by bodies outside the system are external forces.`,
      `The simplest oscillations arise after a system is displaced from equilibrium and released, with the restoring interaction acting within the chosen system.
These are called free oscillations.
A mass on a spring and a mass hanging from a string are examples.

Once displaced from equilibrium, these systems can oscillate without a periodically varying external driving force.
Calling an oscillation free does not require real friction and air resistance to be absent.`,
      `**Forced oscillations** If we move a book back and forth on a table with a hand, the book oscillates, but this is not free oscillation.
The motion is produced by the hand's action.
In the periodic motion considered here, the applied force varies periodically in magnitude and direction.`,
      `Oscillations produced by a periodically varying external driving force are called forced oscillations.`,
      `A piston moving back and forth in an internal-combustion engine and a sewing-machine needle moving back and forth are examples of forced oscillations.`,
    ],
  },
};
const [stage, card] = process.argv.slice(2), config = configs[card];
assert(config);
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/10p`;
const prepareDirectory = `${ticket}/tmp/d1816-${config.prepare.toLowerCase()}-${card.split('-').at(-1)}-first-missing-en`;
const authorDirectory = `${ticket}/tmp/d1816-${config.author.toLowerCase()}-${card.split('-').at(-1)}-first-missing-en`;
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
if (stage === 'prepare') {
  const source = bind(`${book}/lessons/${card}/lesson.json`);
  const products = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${book}/editions/modern-us-neutral/lessons/${card}/${name}`));
  const raw = read(source.path), zh = read(products[0].path);
  assert.deepEqual(zh.source.data, raw);
  assert.equal(zh.prose.length, config.objects);
  assert.equal(zh.exercise_count, 0);
  assert.equal(zh.status, 'ready');
  assert.equal(read(products[3].path).status, 'pass');
  assert.equal(read(products[3].path).sourceLessonSha256, source.sha256);
  const delivery = read(`${ticket}/production-meter.json`).deliveryBatches.find(row => row.id === 'D-003');
  assert(delivery.cards.includes(card));
  assert.equal(delivery.status, 'complete-committed-pushed');
  const sourcePages = [...new Set(raw.prose.flatMap(block => block.source_refs)
    .map(ref => /^p(\d+)#/.exec(ref)[1]))]
    .flatMap(page => ['md', 'json'].map(ext => bind(`${book}/pages/${page}/page.${ext}`)));
  const historicalFigureGate = bind(`${ticket}/evidence/reports/${config.gate}`);
  assert.equal(read(historicalFigureGate.path).status, 'pass');
  const inventory = read(products[2].path).figures.map(entry => {
    const files = Object.fromEntries(['spec', 'svg', 'render', 'review'].map(key =>
      [key, bind(`${book}/editions/modern-us-neutral/${entry[key]}`)]));
    const review = read(files.review.path), render = read(files.render.path);
    assert.equal(review.status, 'pass');
    assert.equal(render.status, 'pass');
    assert.equal(review.spec.sha256, files.spec.sha256);
    assert.equal(review.render.sha256, files.render.sha256);
    assert.equal(review.outputs.svg.sha256, files.svg.sha256);
    assert.equal(render.output.svg.sha256, files.svg.sha256);
    const spec = read(files.spec.path);
    assert.equal(spec.mode, 'deterministic');
    assert(spec.source.inventory.length > 0);
    assert.equal(bind(path.resolve(repo, spec.source.image.path)).sha256, spec.source.image.sha256);
    return { id: entry.id, files, sourceInventoryAndApprovedSvgReused: true };
  });
  assert.equal(inventory.length, config.figures);
  for (const file of [source, ...products, ...sourcePages, ...inventory.flatMap(item => Object.values(item.files))]) {
    const result = spawnSync('git', ['show', `${delivery.commit}:${path.relative(repo, file.path)}`], { cwd: repo });
    assert.equal(result.status, 0);
    assert.equal(crypto.createHash('sha256').update(result.stdout).digest('hex'), file.sha256);
  }
  assert(!fs.existsSync(`${book}/editions/modern-us-neutral-en/lessons/${card}`));
  const work = `${repo}/.tmp/STEMROBIN-181/d1816-${config.prepare.toLowerCase()}/work`;
  const receipt = run(`${config.prepare.toLowerCase()}-${card.split('-').at(-1)}-first-missing-en-prepare`, [
    python, '-B', `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, 'adapt-prepare',
    '--book', '10p', '--root', path.dirname(book), '--work', work,
    '--edition', 'modern-us-neutral-en', '--lesson', card,
  ]);
  save(`${prepareDirectory}/prepared.json`, {
    task: config.prepare, card, book: '10p', source, approvedZh: products[0], sourcePages,
    productsReusedExactly: products, historicalFigureGate, existingFigureTupleInventory: inventory,
    historicalChineseDelivery: delivery, historicalZhScience: null,
    historicalScienceApprovalNotInvented: true, firstEnglishScienceReviewRequired: true,
    sourceAndChineseAndFigurePassReplayed: false,
    originalObjects: config.objects, originalTasks: 0, originalFigures: config.figures, work, receipt,
    parentImages: 0, paidCalls: 0, databaseWrites: 0,
  });
}
if (stage === 'author') {
  const preparedPath = `${prepareDirectory}/prepared.json`, prepared = read(preparedPath);
  const lesson = read(prepared.approvedZh.path);
  const tocPath = `${repo}/ssot-resources/soviet10year-textbooks/toc/10p/en.json`;
  const matches = read(tocPath).contents.flatMap(chapter => (chapter.lessons || []).flatMap(section =>
    (section.topics || []).filter(topic => topic.id === card).map(topic => ({ chapter, topic }))));
  assert.equal(matches.length, 1);
  const { chapter, topic } = matches[0];
  Object.assign(lesson, {
    edition: 'modern-us-neutral-en', locale: 'en', status: 'draft',
    title: topic.title, chapter: chapter.title, printed_title: `${topic.printedNumber}. ${topic.title}`,
  });
  assert.equal(config.texts.length, lesson.prose.length);
  for (const [i, text] of config.texts.entries()) {
    lesson.prose[i].text = text;
    lesson.prose[i].changes = text === lesson.prose[i].source_text ? [] :
      [...new Set([...lesson.prose[i].changes, 'translation'])];
    for (const figure of lesson.prose[i].figures || []) figure.label = `Figure ${figure.id.slice(4).replace(/^0/, '')}`;
  }
  save(`${authorDirectory}/en.before-native.json`, lesson);
  const receipt = run(`${config.author.toLowerCase()}-${card.split('-').at(-1)}-first-en-author-native`, [
    python, '-B', '-c', `import sys,json
from pathlib import Path
sys.path.insert(0,${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(`${authorDirectory}/en.before-native.json`)}))
prepared=edition.load(Path(${JSON.stringify(preparedPath)}))
raw=edition.load(Path(prepared["source"]["path"]))
zh=edition.load(Path(prepared["approvedZh"]["path"]))
edition.normalize_lesson_layout(lesson)
flow,errors=edition.prose_flow_contract(lesson["prose"],[])
boundaries=[]
for prefix in ${JSON.stringify(config.boundaries)}:
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
  save(`${authorDirectory}/en.lesson.draft.json`, output.lesson);
  save(`${authorDirectory}/en.prose-flow.json`, output.flow);
  save(`${authorDirectory}/authored.json`, {
    task: config.author, card, status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS',
    prepared: bind(preparedPath), source: prepared.source, approvedZh: prepared.approvedZh,
    englishToc: bind(tocPath), englishDraft: bind(`${authorDirectory}/en.lesson.draft.json`),
    englishFlow: bind(`${authorDirectory}/en.prose-flow.json`), receipt,
    originalObjects: config.objects, originalTasks: 0, originalFigures: config.figures,
    flowParagraphs: output.flow.paragraphs.length,
    historicalScienceApprovalNotInvented: true, firstIndependentEnglishReviewPending: true,
    sourceAndChineseAndFigurePassReplayed: false, parentImages: 0, paidCalls: 0, databaseWrites: 0,
  });
}
console.log(JSON.stringify({ stage, card, directory: stage === 'prepare' ? prepareDirectory : authorDirectory }));
