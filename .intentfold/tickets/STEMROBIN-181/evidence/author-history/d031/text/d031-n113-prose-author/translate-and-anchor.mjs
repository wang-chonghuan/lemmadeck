import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';

const cwd = process.cwd();
const own = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d031-n113-prose-author');
const folder = path.join(own, 'work/adapt/9p/modern-us-neutral/lessons/phy9-c2-s4-n113');
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const dump = async (file, value) => {
  assert.ok(file.startsWith(`${own}/`));
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
};
const digest = text => crypto.createHash('sha256').update(text).digest('hex');
const lessonPath = path.join(folder, 'lesson.template.json');
const lesson = await read(lessonPath);
const exercises = await read(path.join(folder, 'exercises.template.json'));
assert.deepEqual(lesson, (await read(path.join(own, 'normalizer.after.json'))).lesson);
const toolOutput = await fs.readFile(path.join(own, 'prose-flow.before-anchors.stdout.txt'), 'utf8');
const reportedBoundaries = toolOutput.split('\n')
  .filter(line => line.startsWith('    break: '))
  .map(line => JSON.parse(line.slice('    break: '.length)));
const nextParagraphStarts = [
  '**光敏电阻**也利用半导体导电性可以改变的性质。',
  '半导体吸收光的能量后，一些原先受束缚的电子能参与导电，原来的位置则留下空穴。',
  '利用这种光电导效应制成的电阻元件，叫做**光敏电阻**。',
];
lesson.section_breaks = nextParagraphStarts.map(start => {
  const matches = reportedBoundaries.filter(row => row.after.startsWith(start));
  assert.equal(matches.length, 1);
  return matches[0];
});
await dump(lessonPath, lesson);
const translations = new Map([
  ['p0276#7', [
    [
      'The resistance of a **thermistor** changes noticeably with temperature.',
      'For the kind of semiconductor sensing element discussed here, warming lowers the resistance and cooling raises it.',
      'Temperature changes the number of electrons and holes that take part in conduction, so it changes how easily current flows.',
    ].join('\n'),
    [
      'Figure 229 connects the temperature-sensitive element into a circuit and uses an ammeter to observe changes in current.',
      'With the supply voltage held constant, a decrease in the element\'s resistance makes the circuit current increase.',
      'Calibrating the readings at different temperatures lets us use a current reading to determine the temperature.',
    ].join('\n'),
    'The element that responds to temperature is the **thermistor**; the complete measuring instrument also includes a power supply and a readout.',
  ]],
  ['p0276#9', [
    [
      'A semiconductor warms when it absorbs incoming electromagnetic radiation; its resistance changes with temperature, and the circuit reading changes too.',
      'An instrument that detects radiation by this process is called a bolometer, or a resistance radiation thermometer.',
      'The original textbook uses the claim that radiation from a burning match several kilometres away can be detected to illustrate the sensitivity of historical high-sensitivity instruments.',
    ].join('\n'),
    [
      'Such sensitivity requires a suitable instrument and measurement conditions; detection also depends on collecting the radiation, its transmission along the path, and background interference.',
      'It is not a fixed detection distance that every bolometer can achieve.',
    ].join('\n'),
  ]],
  ['p0276#12', [
    [
      'A **photoresistor** also uses the fact that a semiconductor\'s conductivity can change.',
      'When a semiconductor absorbs light energy, its conductivity can increase and its resistance can decrease.',
      'This light-induced change can occur even when the material\'s temperature stays constant.',
    ].join('\n'),
  ]],
  ['p0276#13', [
    [
      'Hold the supply voltage and the semiconductor\'s temperature constant, and first observe the Figure 230 circuit.',
      'In Figure 231, illuminate the semiconductor; the ammeter shows a marked increase in current.',
      'An increased current at the same voltage means that the semiconductor\'s conductivity has increased and its resistance has decreased.',
    ].join('\n'),
    [
      'Because the temperature stays constant, this current change cannot be explained simply by saying that light has warmed the material.',
      'A light-induced change in conduction and a resistance change caused by absorbed radiation first producing heat are distinct processes.',
      'Real light-sensitive elements can also respond to temperature: a light effect at constant temperature does not mean that their resistance can never depend on temperature.',
    ].join('\n'),
  ]],
  ['p0277#7', [
    [
      'When a semiconductor absorbs light energy, some previously bound electrons become able to conduct, leaving holes in their former places.',
      'Free electrons move under the influence of an electric field and carry charge.',
      'A hole is a place where an electron is missing, not a cavity cut into the material.',
    ].join('\n'),
    [
      'A neighbouring electron can fill that place, leaving a hole where it came from.',
      'As these places are filled in turn, the hole\'s position moves too; we can describe this conduction as the motion of positive charge.',
      'Electrons and holes are both charge carriers: they take part in transferring charge.',
    ].join('\n'),
    [
      'Light increases the number of carriers available for conduction, increasing the semiconductor\'s conductivity.',
      'The original textbook calls this the **photoelectric effect**;',
      'here its particular form is photoconductivity within the material.',
    ].join('\n'),
    'It does not require electrons to leave the material, or the whole material to be heated first.',
  ]],
  ['p0277#8', [
    [
      'A resistive element made to use this photoconductive effect is called a **photoresistor**.',
      'It turns a change in illumination into a change in resistance, which the circuit then turns into a change in current reading.',
      'The original textbook describes these elements as small and sensitive, suitable for detecting light in different technical applications.',
    ].join('\n'),
    'The sensitivity and usable range of a particular element still depend on its material, structure, and operating conditions.',
  ]],
]);
const english = {
  ...structuredClone(lesson),
  schema: 'ld-s10y-lesson/bounded-aligned-english-lesson@1',
  language: 'en', title: 'Thermistors and Photoresistors',
  printed_title: '113. Thermistors and Photoresistors',
  chinese_template: { path: lessonPath, sha256: digest(await fs.readFile(lessonPath)) },
};
const alignment = [];
for (const [index, block] of english.prose.entries()) {
  const chinese = lesson.prose[index];
  block.chinese_text = chinese.text;
  if (block.kind === 'p') {
    const paragraphs = translations.get(block.source_refs[0]);
    assert.ok(paragraphs);
    const chineseParagraphs = chinese.text.split(/\n{2,}/);
    assert.equal(paragraphs.length, chineseParagraphs.length);
    block.text = paragraphs.join('\n\n');
    block.paragraph_alignment = paragraphs.map((text, paragraphInBlock) => ({
      paragraphInBlock,
      chinese_text: chineseParagraphs[paragraphInBlock],
      english_text: text,
    }));
    alignment.push(...block.paragraph_alignment.map(row => ({
      ...row, blockIndex: index, source_refs: block.source_refs,
    })));
  } else if (block.kind === 'cap' && block.text.startsWith('图 ')) {
    block.text = block.text.replace(/^图 /, 'Figure ');
  }
  if (block.kind !== 'fig') block.changes = [...new Set([...block.changes, 'language'])];
  if (block.label?.startsWith('图 ')) block.label = block.label.replace(/^图 /, 'Figure ');
}
english.figures = english.figures.map(row => ({
  ...row, label: row.label.replace(/^图 /, 'Figure '),
}));
english.section_breaks = lesson.section_breaks.map(boundary => {
  const before = alignment.filter(row => row.chinese_text === boundary.before);
  const after = alignment.filter(row => row.chinese_text === boundary.after);
  assert.equal(before.length, 1);
  assert.equal(after.length, 1);
  return { before: before[0].english_text, after: after[0].english_text };
});
const englishExercises = {
  ...structuredClone(exercises),
  schema: 'ld-s10y-lesson/bounded-aligned-english-exercises@1',
  language: 'en', chinese_template: {
    path: path.join(folder, 'exercises.template.json'),
    sha256: digest(await fs.readFile(path.join(folder, 'exercises.template.json'))),
  },
};
englishExercises.exercises[0].text = String.raw`1. A hollow conducting sphere of radius $R=5$ cm is placed in an electrolytic bath containing copper sulphate solution.
The sphere has a small hole of radius $r=0.5$ mm.
Copper is deposited for $t=30$ minutes, and the charge reaching each square centimetre of the sphere's surface in $1$ second is $0.01$ coulomb.
Find the increase in the sphere's mass.
The molar mass of copper is $A=0.0635$ kg/mol.

**Solution**
Because $r\ll R$, we neglect the small hole's effect on the electric field inside the sphere, treating the interior field that would drive directed ion motion as negligible.
We therefore calculate copper deposition only on the outer surface; this approximation does not mean that the solution inside contains no ions.
The outer surface area is $S=4\pi R^2=314$ cm$^2$.

During $t=30$ min$=1800$ s, the charge transported by the ions is $q=0.01$ coulomb/(cm$^2$ s)$\times314$ cm$^2\times1800$ s$=5652$ coulombs.
Multiply the charge arriving per unit area per second by the outer surface area and then by the deposition time.

Faraday's law gives the mass of deposited copper:
$m=\frac{1}{F}\cdot\frac{A}{n}q$.
We use copper's divalent character in copper sulphate and the Faraday constant already studied.
Substituting the given molar mass and the calculated charge gives:
$m\approx1.9\times10^{-3}$ kg.
This copper is deposited on the sphere, so it is the increase in the sphere's mass.`;
englishExercises.exercises[1].text = String.raw`2. A capacitor is connected to a high-voltage supply through a resistor of resistance $R=1$ ohm (Figure 232).
The capacitor plate area is $S=3\times10^{-3}$ m$^2$, and the plate separation is $d=$ $3\times10^{-3}$ m.
Roentgen rays, also called X rays, ionize the air between the plates.
In $1$ second, the number of ion pairs formed in each $1$ m$^3$ of air is $n=$ $10^4$.
The magnitude of each ion's charge equals the magnitude of the electron charge.
Assume all ions reach the capacitor plates without recombining on the way.
Find the voltage across the resistor.

**Solution**
By Ohm's law, the required voltage is $V=IR$, where $I$ is the circuit current.
Under steady-state, continuous ion collection, the current is the same throughout the circuit.
Negative ions move towards the positive plate and positive ions towards the negative plate; both contribute to current in the same direction.

When calculating current through a section, do not count collection of a pair at the two plates as two separate full charges.
Collecting a complete ion pair transfers a charge of one electron-charge magnitude through the external circuit.
The volume between the plates is the plate area times their separation; multiplying this by the number of pairs produced per unit volume per second gives the number of pairs collected per second.
The current is therefore $I=enSd$, where $e=1.6\times10^{-19}$ coulomb is the magnitude of the electron charge.
The ion-pair number here denotes a production rate, not the number of ions already accumulated.

Substituting the current expression into Ohm's law gives:
$V=enSdR$.
Multiplying the given pair-production rate, area, separation, and resistance gives the voltage across the resistor:
$V=1.4\times10^{-20}$ volts.`;
for (const [index, example] of englishExercises.exercises.entries()) {
  example.chinese_text = exercises.exercises[index].text;
  example.lines = example.text.split('\n');
  example.changes = [...example.changes, 'language'];
  example.group_en = 'Worked Examples';
  example.figures = example.figures.map(row => ({
    ...row, label: row.label.replace(/^图 /, 'Figure '),
  }));
  const chineseParagraphs = example.chinese_text.split(/\n{2,}/);
  const englishParagraphs = example.text.split(/\n{2,}/);
  assert.equal(chineseParagraphs.length, englishParagraphs.length);
  example.paragraph_alignment = englishParagraphs.map((text, paragraphInExample) => ({
    paragraphInExample, chinese_text: chineseParagraphs[paragraphInExample], english_text: text,
  }));
}
await dump(path.join(own, 'lesson.en.json'), english);
await dump(path.join(own, 'exercises.en.json'), englishExercises);
await dump(path.join(own, 'translation-alignment.json'), {
  proseParagraphs: alignment,
  exercises: englishExercises.exercises.map(example => ({
    number: example.number, source_number: example.source_number,
    group: example.group, group_id: example.group_id, pages: example.pages,
    paragraphs: example.paragraph_alignment,
  })),
  context: 'Свет　光 -> Light in both languages; inherited source pixels are unchanged.',
  completeness: 'All thirteen lesson objects and both complete worked examples translated, not independently science-reviewed.',
});
for (const [label, file] of [
  ['prose-flow.final.zh', lessonPath],
  ['prose-flow.final.en', path.join(own, 'lesson.en.json')],
]) {
  const args = ['node', path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'),
    '--json', file];
  const result = spawnSync(args[0], args.slice(1), { cwd, encoding: 'utf8' });
  await dump(path.join(own, `${label}.command.json`), {
    command: args, exitCode: result.status, stderr: result.stderr,
  });
  assert.equal(result.status, 0, result.stderr);
  await dump(path.join(own, `${label}.json`), JSON.parse(result.stdout));
}
const zhFlow = await read(path.join(own, 'prose-flow.final.zh.json'));
const enFlow = await read(path.join(own, 'prose-flow.final.en.json'));
assert.deepEqual(zhFlow.resolvedBreaks, enFlow.resolvedBreaks);
assert.equal(zhFlow.paragraphs.length, enFlow.paragraphs.length);
console.log(JSON.stringify({
  paragraphCount: zhFlow.paragraphs.length,
  resolvedBreaks: zhFlow.resolvedBreaks,
  sourceSnapshotHash: lesson.source.sha256,
  translatedWorkedExamples: englishExercises.count,
  nativeBoundaryObjectsCopiedFromNormalizedToolOutput: true,
}));
