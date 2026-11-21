import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d492';
const O = `${T}/tmp/d1816-d493-laboratory-bilingual-first-text`;
const ID = 'phy10-c4-s4';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
assert(!fs.existsSync(`${O}/result.json`));
const rawFile = `${B}/root/10p/lessons/${ID}/lesson.json`;
const raw = read(rawFile);
const english = [
  ['p0402#2', 'I. Determine gravitational acceleration with a simple pendulum'],
  ['p0402#3', '**Apparatus and materials:**'],
  ['p0402#4', 'A small ball with a hole, thread, a stand with a clamp and ring, a stopwatch, and a flexible measuring tape.'],
  ['p0402#5', '**Procedure:**'],
  ['p0402#6', '1. Set up the stand at the edge of the table. Use the clamp to attach the ring near the top of the stand, and suspend the ball from the stand with thread. The ball should be $1$ to $2$ cm above the floor.'],
  ['p0402#7', '2. Displace the ball $5$ to $8$ cm to one side, then release it so that the pendulum oscillates.'],
  ['p0402#8', '3. Count the complete oscillations during a time $t$ of $1$ to $1.5$ minutes.'],
  ['p0402#9', '4. Measure the pendulum length $l$ with the flexible tape.'],
  ['p0402#10', String.raw`5. Calculate gravitational acceleration using the formula.
$g=\frac{4\pi^2 l n^2}{t^2}$`],
  ['p0402#11', '6. Estimate the error.'],
  ['p0402#12', 'II. Investigate the law of reflection'],
  ['p0402#13', '**Apparatus and materials:**'],
  ['p0402#14', 'A small lamp in a holder, a battery pack, a switch, a small plane mirror, a screen with a slit, a right-angle ruler, a protractor, white paper, and connecting wires.'],
  ['p0402#15', '**Procedure:**'],
  ['p0402#16', '1. Connect the lamp and battery pack through the switch to form a circuit.'],
  ['p0403#1', '2. Place the screen with a slit in front of the lamp, and place a clean sheet of white paper behind the screen.'],
  ['p0403#2', '3. Close the circuit to produce a narrow, bright strip of light on the paper (a light ray).'],
  ['p0403#3', '4. Place the plane mirror vertically in the path of the light.'],
  ['p0403#4', '5. Use a pencil to draw a line along the mirror on the paper. Mark the start of the ray at the slit and its end at the mirror. Also mark a point on the reflected ray.'],
  ['p0403#5', '6. Switch off the current and remove the mirror.'],
  ['p0403#6', '7. Draw the incident and reflected rays. At the point of incidence, draw a line perpendicular to the mirror line.'],
  ['p0403#7', '8. Measure the angles of incidence and reflection with the protractor.'],
  ['p0403#8', '9. Repeat the experiment several times with the mirror in different positions. Draw a conclusion about the relationship between the angles of reflection and incidence.'],
  ['p0403#9', 'III. Determine the refractive index of glass'],
  ['p0403#10', '**Apparatus and materials:**'],
  ['p0403#11', 'A small lamp on a base, a battery pack, a switch, a glass plate with parallel plane faces, a screen with a slit, a set square, a protractor, white paper, and connecting wires.'],
  ['p0403#12', '**Procedure:**'],
  ['p0403#13', '1. Connect the lamp and battery pack through the switch to form a circuit.'],
  ['p0403#14', '2. Place the screen with a slit in front of the lamp, and place a sheet of white paper behind the screen.'],
  ['p0403#15', '3. Close the circuit to produce a narrow, bright strip of light on the paper (a light ray).'],
  ['p0403#16', '4. Place the glass plate across the path of the light.'],
  ['p0403#17', '5. Use a pencil to draw a line along the refracting face on the paper. Mark the start $A$ and end $B$ of the incident ray, and the point $C$ where the ray leaves the glass plate (Figure $278$).'],
  ['p0404#1', '6. Open the circuit and remove the glass plate.'],
  ['p0404#2', '7. Draw the incident and refracted rays. At the point of incidence, draw a line perpendicular to the face of the glass plate.'],
  ['p0404#3', String.raw`8. Measure the angle of incidence $\alpha$ and the angle of refraction $\beta$ with the protractor.`],
  ['p0404#4', String.raw`9. Calculate the refractive index using the formula.
$n=\frac{\sin\alpha}{\sin\beta}$`],
  ['p0404#5', '10. Repeat the experiment with other angles of incidence and compare the results.'],
  ['p0404#6', ''],
  ['p0404#7', 'Figure $278$'],
  ['p0404#8', 'IV. Obtain images with a concave mirror'],
  ['p0404#9', '**Apparatus and materials:**'],
  ['p0404#10', 'A concave mirror and a strip of paper with an arrow drawn on it.'],
  ['p0404#11', '**Procedure:**'],
  ['p0404#12', '1. Hold the strip of paper close to the mirror. Gradually move the strip away from the mirror surface and observe how the size of the virtual image of the arrow changes.'],
  ['p0404#13', '2. Draw image-formation diagrams for these situations.'],
  ['p0404#14', "3. Move the mirror to an arm's length away, and position your eye on its principal optical axis."],
  ['p0404#15', '4. Close one eye and suspend the strip of paper above the principal optical axis of the mirror. An inverted real image can be seen.'],
  ['p0404#16', '5. Move the strip along the optical axis and observe how the image size changes.'],
  ['p0404#17', '6. Draw real images that are smaller than, larger than, and the same size as the object.'],
  ['p0405#1', 'V. Obtain real images with a lens'],
  ['p0405#2', '**Apparatus and materials:**'],
  ['p0405#3', 'A long-focal-length converging lens, a glass plate marked with a millimeter grid, a flexible measuring tape, a guide rod, a concave mirror with a letter attached to its back, and a ground-glass screen.'],
  ['p0405#4', '**Procedure:**'],
  ['p0405#5', '1. Use the lens to form a real image of a distant object on the ground-glass screen.'],
  ['p0405#6', '2. Measure the distance between the lens and the ground-glass screen.'],
  ['p0405#7', 'This distance may be taken as approximately equal to the focal length of the lens.'],
  ['p0405#8', '3. Position the concave mirror with the letter attached to its back at a distance of $2$ focal lengths from the lens.'],
  ['p0405#9', '4. Place the glass plate with a millimeter grid on the other side of the lens. Arrange all the apparatus along the guide rod.'],
  ['p0405#10', '5. Use the parallax method to make the image of the letter coincide with the millimeter grid. Position your eye on the principal optical axis behind the grid, and move it slightly left, right, up, and down. Observe how the image moves relative to the grid. At one position of the grid, the image does not move relative to it; this means that the grid and the image coincide exactly.'],
  ['p0405#11', '6. Use the grid markings to measure the width and height of the image of the letter. Also measure the height of the letter itself.'],
  ['p0405#12', '7. Use the flexible tape to measure the distance from the image to the lens.'],
  ['p0405#13', '8. Find the ratio of a linear dimension of the object to the corresponding dimension of the image. Then find the ratio of the lens-to-object distance to the lens-to-image distance. Compare the two ratios and draw a conclusion.'],
  ['p0405#14', '9. Move the letter slightly closer to the lens and repeat the experiment.'],
  ['p0406#1', 'VI. Measure the focal length and optical power of a converging lens'],
  ['p0406#2', '**Apparatus and materials:**'],
  ['p0406#3', 'A small lamp on a base, a battery pack, a switch, a flexible measuring tape, a long-focal-length converging lens, a white screen with a slit, a guide rod, and connecting wires.'],
  ['p0406#4', '**Procedure:**'],
  ['p0406#5', '1. Connect the lamp and battery pack through the switch to form a circuit.'],
  ['p0406#6', '2. Place the lamp at one end of the table and the screen at the other, with the lens between them.'],
  ['p0406#7', '3. Switch on the lamp and move the lens along the guide rod until a sharp image of the glowing filament is formed on the screen.'],
  ['p0406#8', '4. Measure the lamp-to-lens distance and the lens-to-screen distance.'],
  ['p0406#9', String.raw`5. Use the formula $F=\frac{fd}{f+d}$ to calculate the principal focal length of the lens, and calculate its optical power from $D=1/F$.`],
  ['p0406#10', '6. Place the lamp at any distance $d_1$ from the lens.'],
  ['p0406#11', String.raw`7. With the focal length $F$ known, calculate $f_1$ from $f_1=\frac{d_1F}{d_1-F}$. The image should be at the distance $f_1$.`],
  ['p0406#12', '8. Verify the result experimentally.'],
  ['p0406#13', '9. Place the lamp at a distance $d_2=2F$ from the lens and repeat the experiment.'],
  ['p0406#14', 'VII. Assemble a model microscope'],
  ['p0406#15', '**Apparatus and materials:**'],
  ['p0406#16', 'A long-focal-length converging lens, a short-focal-length converging lens, a glass plate marked with a millimeter grid, a guide rod, and a concave mirror with a paper letter attached to its back.'],
  ['p0407#1', '**Procedure:**'],
  ['p0407#2', '1. Along the guide rod, place the short-focal-length converging lens (the *objective*) near the brightly illuminated letter. The distance between them should be slightly greater than the focal length of this lens. Its focal length should be known beforehand.'],
  ['p0407#3', '2. Use the glass plate with a millimeter grid and the parallax method (see Experiment $5$) to locate the enlarged, inverted real image of the letter.'],
  ['p0407#4', '3. Along the guide rod, place the second lens (the *eyepiece*) at a distance behind the image. Make this distance equal to, or slightly less than, the focal length of the eyepiece. Its focal length should also be known beforehand.'],
  ['p0407#5', 'Remove the glass plate with the millimeter grid. Use the eyepiece like a magnifying glass to observe the enlarged image of the letter.'],
  ['p0407#6', 'VIII. Observe light dispersion with a prism'],
  ['p0407#7', '**Apparatus and materials:**'],
  ['p0407#8', 'A projector, spectrum tubes containing hydrogen, neon, or helium, a high-voltage induction coil, a battery pack, a stand, and connecting wires (shared by all classes); and a glass plate with beveled edges for each person.'],
  ['p0407#9', '**Procedure:**'],
  ['p0407#10', String.raw`1. Hold the glass plate horizontally in front of your eyes. Look through its $45^\circ$ edge at the bright vertical strip on the screen: the image of the slit projected by the projector.`],
  ['p0407#11', '2. Identify the principal colors of the continuous spectrum and record them in the order observed.'],
  ['p0407#12', String.raw`3. Repeat the experiment by observing the strip through the $60^\circ$ edge. Record the different appearance of the spectrum.`],
  ['p0408#1', '4. View the glowing spectrum tubes through both edges of the glass plate. Observe the line spectra of hydrogen, helium, or neon, and record the brightest lines.'],
  ['p0408#2', 'IX. Observe light interference'],
  ['p0408#3', '**Apparatus and materials:**'],
  ['p0408#4', 'Two glass plates.'],
  ['p0408#5', '**Procedure:**'],
  ['p0408#6', '1. Carefully clean the glass plates, place one on top of the other, and press them together with your fingers.'],
  ['p0408#7', '2. Observe the plates in reflected light against a black background. Position them so that bright reflections from windows or white walls do not appear on the glass surfaces.'],
  ['p0408#8', '3. Observe the bright, multicolored rings or irregular fringes that appear where the plates touch.'],
  ['p0408#9', '4. Notice how the shape and position of the interference fringes change as you vary the pressure of your fingers.'],
  ['p0408#10', '5. Try to observe the interference pattern in transmitted light.'],
  ['p0408#11', 'X. Observe light diffraction'],
  ['p0408#12', '**Apparatus and materials:**'],
  ['p0408#13', 'An incandescent lamp with a straight filament (one for the class) and a vernier caliper.'],
  ['p0408#14', '**Procedure:**'],
  ['p0408#15', '1. Form a slit $0.5$ mm wide between the jaws of the vernier caliper.'],
  ['p0408#16', '2. Hold the slit vertically close to your eye.'],
  ['p0408#17', '3. Look through the slit at the vertically positioned glowing filament of the lamp. Multicolored fringes (diffraction spectra) appear on both sides of the filament.'],
  ['p0409#2', '4. Increase the slit width from $0.55$ mm to $0.8$ mm and observe the effect on the diffraction spectrum①.'],
  ['p0409#3', '① If a vernier caliper is not available, use a glass photographic plate coated with a black emulsion. Slits of different widths should be scratched in the coating beforehand.'],
];
assert.equal(english.length, raw.prose.length);
const records = [];
fs.mkdirSync(O, { recursive: true });
const dump = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
dump(`${O}/content-brief.json`, {
  reader: 'A student consulting the original laboratory course in Chinese or English.',
  jobStory: 'When studying these experiments, I want their complete apparatus lists and ordered procedures so I can follow the prescribed observations.',
  question: 'What apparatus and steps does each of the ten laboratory experiments prescribe?',
  source: bind(rawFile),
  order: 'Ten original experiment headings, materials, all procedures, the sole referenced figure, and the original explanatory footnote.',
  contentModel: 'Existing source-bound lesson.prose schema; one authored translation per exact source block; no omissions, invented problems, answers, or introductory filler.',
});
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const base = `${B}/source-work/adapt/10p/${edition}/lessons/${ID}`;
  const file = `${base}/lesson.template.json`;
  const before = bind(file);
  const lesson = read(file);
  lesson.locale = locale;
  if (locale === 'en') {
    lesson.title = 'Laboratory work';
    lesson.printed_title = 'Laboratory work';
    lesson.chapter = 'Laboratory work';
  }
  lesson.prose.forEach((block, index) => {
    assert.equal(block.source_refs[0], english[index][0]);
    assert.equal(block.source_text, raw.prose[index].text);
    let text = locale === 'en' ? english[index][1] : block.source_text
      .split(/(\$[^$]*\$)/g).map(part => part.startsWith('$') ? part
        : part.replace(/(?<!\d)\./g, '。').replaceAll('—', '至')
          .replaceAll('虚象', '虚像')).join('');
    if (block.kind === 'h3') text = `**${text}**`;
    block.text = text;
    block.changes = text === block.source_text ? []
      : locale === 'en' ? ['translation', 'layout'] : ['language', 'layout'];
    block.numeric_changes = [];
    if (locale === 'en' && ['fig', 'cap'].includes(block.kind)) block.label = 'Figure 278';
  });
  const figureFile = `${base}/figures.template.json`;
  const figures = read(figureFile);
  if (locale === 'en') figures.figures.forEach(figure => { figure.label = 'Figure 278'; });
  dump(figureFile, figures);
  dump(file, lesson);
  execFileSync('node', [
    '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', file,
  ], { cwd: repo, encoding: 'utf8' });
  fs.copyFileSync(file, `${O}/${locale}-lesson-first-author.json`, fs.constants.COPYFILE_EXCL);
  records.push({
    locale, edition, before, after: bind(file), figures: bind(figureFile),
    exercises: bind(`${base}/exercises.template.json`),
    firstAuthorSnapshot: bind(`${O}/${locale}-lesson-first-author.json`),
    proseBlocks: lesson.prose.length,
    experiments: lesson.prose.filter(block => block.kind === 'h3').length,
    independentExercises: 0,
  });
}
dump(`${O}/result.json`, {
  stage: 'D493', status: 'FIRST_AUTHOR_INDEPENDENT_REVIEW_PENDING',
  course: ID, records, source: bind(rawFile),
  assembly: bind(`${T}/tmp/d1816-d492-laboratory-assembly-repair/result.json`),
  copyAudit: 'Every apparatus, step, quantity, formula, cross-reference, caption and footnote remains source-bound. No filler or new scientific claims added.',
  sourceContentChanged: false, sourceReviewsReplayed: false, parentImageOpens: 0,
  paidCalls: 0, databaseWrites: false, wholeCourseApproval: false,
});
console.log(JSON.stringify({ status: 'first-author-complete', records }));
