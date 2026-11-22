import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const preparedPath = `${ticket}/tmp/d1816-d1013-n64-first-missing-en/prepared.json`;
const prepared = read(preparedPath);
assert.equal(bind(prepared.approvedZh.path).sha256, prepared.approvedZh.sha256);
const lesson = read(prepared.approvedZh.path);
const tocFile = `${repo}/ssot-resources/soviet10year-textbooks/toc/9p/en.json`;
const matches = read(tocFile).contents.flatMap(chapter => (chapter.lessons || []).flatMap(section =>
  (section.topics || []).filter(topic => topic.id === prepared.card).map(topic => ({ chapter, topic }))));
assert.equal(matches.length, 1);
const { chapter, topic } = matches[0];
Object.assign(lesson, { edition: 'modern-us-neutral-en', locale: 'en', status: 'draft',
  title: topic.title, chapter: chapter.title, printed_title: `${topic.printedNumber}. ${topic.title}` });
const texts = [
  `The electrostatic interaction between charged bodies depends on the electrical properties of the surrounding medium, unlike the gravitational interaction compared in this lesson.
We use an electrostatic model of a homogeneous, isotropic, linear dielectric, treating small charged spheres as point charges and neglecting medium boundaries, cavities, and charge leakage.
The original textbook uses insulating liquids such as kerosene and oil to describe a force-measurement setting.

A solid also produces elastic constraint forces, so the measured total force cannot simply be taken as the electrostatic force; this does not mean that electrostatic interactions in solids cannot be studied in principle.
These materials are part of the original setting, not a request to conduct experiments with charged or flammable liquids.`,
  `For the ordinary insulating media considered here, with the model and material state fixed, the electrostatic force is smaller than in vacuum for the same charges at the same separation.
Let $F_0$ denote the force magnitude in vacuum and $F$ the force magnitude in the medium.
Within the linear-response range, their ratio does not depend on the charge amounts or their separation.

Denoting this ratio by $\\varepsilon$, we have`,
  String.raw`$\frac{F_0}{F}=\varepsilon$.`,
  `In SI units, Coulomb's law in this ideal model gives the magnitude of the force between the charges:`,
  String.raw`$F=\frac{1}{4\pi\varepsilon_0\varepsilon}\cdot\frac{|q_1|\cdot|q_2|}{r^2}$,
(8-9)`,
  `In the CGSE electrostatic system of units, the same relation is written as`,
  String.raw`$F=\frac{|q_1|\cdot|q_2|}{\varepsilon r^2}$.`,
  `The quantity $\\varepsilon$ is the dimensionless **relative permittivity**, called simply the dielectric constant in the original textbook.`,
  `**In this lesson's electrostatic model, relative permittivity describes the medium's electrical response and gives the ratio of the electrostatic force in vacuum to that in the medium for the same charges at the same separation.**
It can be treated approximately as a constant only when the material state and the range of applicability are fixed.
It is not a material number that is universally independent of temperature, field strength, frequency, and direction.

For vacuum, $\\varepsilon=1$.
Later, dielectric polarization will explain the reduction of electrostatic force discussed here.`,
  `A table at the end of the original textbook lists dielectric constants of some materials.
When using its values, also consider the material state and the corresponding measurement conditions.`,
  `**Worked examples**`,
  `1. How many electrons are in a water drop of mass $m=0.03$ grams?
Use the original textbook's water-molecule mass $m_0\\approx3\\times10^{-23}$ grams, estimating the drop as a collection of neutral water molecules.`,
  `Solution: A neutral water molecule H$_2$O contains 10 electrons: the 2 hydrogen atoms have 2 electrons in total, and the 1 oxygen atom has 8 electrons.
Using the given approximate molecular mass, the drop contains $\\frac{m}{m_0}=10^{21}$ molecules and therefore $10^{22}$ electrons in total.
This is the total number of electrons, not the number of excess electrons or the drop's net charge.`,
  `2. Suppose two stationary point charges in vacuum are 1 kilometer apart, have the same sign, and each carry 1 coulomb of charge. Find the repulsive force between them.
This is an ideal point-charge calculation, not a claim that ordinary charged spheres can retain such net charges in a real environment.`,
  `Solution: Using formulas (8-2) and (8-8), the magnitude of the repulsive force is`,
  String.raw`$F=k\frac{|q_1|\cdot|q_2|}{r^2}=\frac{|q_1|\cdot|q_2|}{4\pi\varepsilon_0r^2}$,`,
  `$F=9000$ newtons.
This result uses the original textbook's approximate value of the Coulomb constant.`,
  `3. Two identical small spheres are each suspended by a thin thread of length $l=2$ meters from the same point.
The spheres carry equal charges of the same sign, $q=2\\times10^{-8}$ coulombs, and their centers are $r=16$ centimeters apart at rest. Find the tension in each thread.
Treat the spheres as point charges and the threads as light and inextensible; neglect the dielectric effect of the surrounding air and any other external forces.`,
  String.raw`Solution: Each sphere is acted on by three forces: its downward weight $\vec{G}$, the tension $\vec{F}_{\text{tension}}$ directed along the thread toward the suspension point, and the horizontally outward Coulomb repulsion of magnitude $F=\frac{q^2}{4\pi\varepsilon_0r^2}$, as shown in Figure 108.
The thread's elastic force in the original notation is the tension exerted by the thread on the sphere.`,
  `The identical spheres are symmetrically at rest, so the line joining their centers is horizontal.
Denote the angle between each thread and the vertical by alpha.
The net horizontal force on each sphere is zero: the Coulomb force $F$ balances the horizontal component of tension.

Vertically, the vertical component of tension balances the weight.`,
  ``,
  `Figure 108`,
  String.raw`Horizontal equilibrium gives $F-F_{\text{tension}}\sin\alpha=0$.
The geometry of the symmetric suspension gives $\sin\alpha=\frac{r}{2l}$, and hence $F_{\text{tension}}=\frac{F}{\sin\alpha}=\frac{F\cdot2l}{r}=\frac{q^2\cdot2l}{4\pi\varepsilon_0r^3}$.

Converting to SI units and substituting the given data yields $F_{\text{tension}}\approx3.5\times10^{-3}$ newtons.
The full sine relationship is used directly, with no small-angle approximation.
The spheres' masses are not given and need not be assumed.`,
  String.raw`**The tension in each thread is approximately** $3.5\times10^{-3}$ newtons.`,
  `4. Three small charged bodies lie on the same straight line in a homogeneous dielectric, with relative permittivity $\\varepsilon=2.1$ under the stated conditions.

The body with charge $q_2=1.0\\times10^{-8}$ coulombs lies between the body with charge $q_1=-3.0\\times10^{-8}$ coulombs, at separation $r_{12}=0.4$ meters, and the body with charge $q_3=5.0\\times10^{-8}$ coulombs, at separation $r_{23}=0.6$ meters.
Find the net Coulomb force on each body, including its magnitude and direction.

Use stationary point charges, a linear isotropic medium, and force superposition, neglecting boundary effects.
The requested net force is electrical and does not include the constraint forces that hold the bodies in place.`,
  `**Solution:** Take rightward along the line as the positive direction, with the first, second, and third bodies arranged from left to right.
The forces with two subscripts below denote magnitudes of pairwise forces, not components that already include directional signs.
The first and second bodies have opposite signs and attract each other, with force magnitude`,
  String.raw`$F_{12}=\frac{|q_1|\cdot|q_2|}{4\pi\varepsilon_0\varepsilon r_{12}^2}$.`,
  `The second and third bodies have charges of the same sign and repel each other, with force magnitude`,
  String.raw`$F_{23}=\frac{|q_2|\cdot|q_3|}{4\pi\varepsilon_0\varepsilon r_{23}^2}$.`,
  `The first and third bodies have opposite signs and attract each other.
Their separation is the sum of the two adjacent separations, and the force magnitude is`,
  String.raw`$F_{13}=\frac{|q_1|\cdot|q_3|}{4\pi\varepsilon_0\varepsilon(r_{12}+r_{23})^2}$.`,
  `Both attractive forces on the first body point rightward along the line, as shown in Figure 109.
Its net force therefore points rightward, with magnitude equal to the sum of the two force magnitudes.
The separation between the first and third bodies in the expression below is still the sum of the two adjacent separations.`,
  ``,
  `Figure 109`,
  String.raw`$F_1=F_{12}+F_{13}=\frac{|q_1|}{4\pi\varepsilon_0\varepsilon}\left(\frac{|q_2|}{r_{12}^2}+\frac{|q_3|}{r_{13}^2}\right)$,`,
  String.raw`$F_1\approx14.5\times10^{-6}$ newtons, directed rightward.`,
  `The second body is attracted by the negative charge on its left and repelled by the positive charge on its right; both forces point leftward, as shown in Figure 109.
The two forces in an interaction pair are equal in magnitude but act on different bodies.
The net force on the second body points leftward, with magnitude`,
  String.raw`$F_2=F_{21}+F_{23}=\frac{|q_2|}{4\pi\varepsilon_0\varepsilon}\left(\frac{|q_1|}{r_{12}^2}+\frac{|q_3|}{r_{23}^2}\right)$,`,
  String.raw`$F_2\approx14.0\times10^{-6}$ newtons, directed leftward.`,
  `The two forces on the third body point in opposite directions, as shown in Figure 109.
The attractive force $F_{31}$ exerted by the first body points leftward and, for the given data, is larger than the rightward repulsive force $F_{32}$ exerted by the second body.
The net force therefore points leftward, with magnitude equal to the larger force minus the smaller, not the sum of their magnitudes.`,
  String.raw`$F_3=F_{31}-F_{32}=\frac{|q_3|}{4\pi\varepsilon_0\varepsilon}\left(\frac{|q_1|}{(r_{12}+r_{23})^2}-\frac{|q_2|}{r_{23}^2}\right)$,`,
  String.raw`$F_3\approx0.5\times10^{-6}$ newtons, directed leftward.
These are approximate results using the given data.
The vector sum of all the electrical forces is zero because each pair of internal interaction forces cancels; this does not mean that the net electrical force on each individual body is zero.`,
];
assert.equal(texts.length, 42);
for (let index = 0; index < texts.length; index++) {
  const block = lesson.prose[index];
  block.text = texts[index];
  block.changes = [...new Set([...block.changes, 'translation'])];
  if (block.label) block.label = block.label.replace(/^\u56fe /, 'Figure ');
}
const out = `${ticket}/tmp/d1816-d1014-n64-first-missing-en`;
const beforeFile = `${out}/en.before-native.json`;
save(beforeFile, lesson);
const receipt = run('d1014-n64-first-missing-en-author-native', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c',
  `import sys,json
from pathlib import Path
sys.path.insert(0,${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(beforeFile)}))
prepared=edition.load(Path(${JSON.stringify(preparedPath)}))
raw=edition.load(Path(prepared["source"]["path"]))
zh=edition.load(Path(prepared["approvedZh"]["path"]))
edition.normalize_lesson_layout(lesson)
flow,errors=edition.prose_flow_contract(lesson["prose"],[])
prefixes=["**Worked examples**","2. Suppose","3. Two identical","4. Three small"]
boundaries=[]
for prefix in prefixes:
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
    errors.extend(edition.validate_text(source["text"],modern["text"],modern["changes"],modern["numeric_changes"],f"en.prose[{i}]",profile["forbidden_terms"]+profile["forbidden_person_names"],modern.get("historical_entities")))
print(json.dumps({"lesson":lesson,"flow":flow,"errors":errors},ensure_ascii=False))
assert not errors,errors`,
]);
const result = read(receipt.path), native = JSON.parse(readText(result.streams.stdout.path));
function readText(file) {
  return fs.readFileSync(file, 'utf8');
}
save(`${out}/en.lesson.draft.json`, native.lesson);
save(`${out}/en.prose-flow.json`, native.flow);
save(`${out}/authored.json`, {
  task: 'D1014', card: prepared.card, status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS',
  prepared: bind(preparedPath), source: prepared.source, approvedZh: prepared.approvedZh,
  historicalZhNative: prepared.completeChineseHistoricalNative,
  historicalZhScience: prepared.historicalZhScience, englishToc: bind(tocFile),
  englishBeforeNative: bind(beforeFile), englishDraft: bind(`${out}/en.lesson.draft.json`),
  englishFlow: bind(`${out}/en.prose-flow.json`), nativeReceipt: receipt,
  firstHelperFailure: bind(`${out}/first-helper-failure.json`),
  errors: native.errors, originalObjects: 42, originalTasks: 0, originalFigures: 2,
  flowParagraphs: native.flow.paragraphs.length, derivedConceptBoundaries: 4,
  workedExamplesRemainProse: 4, sourceSectionIdentityRetained: true,
  descriptiveMathTextTranslation: 'The Chinese elastic-force descriptor becomes tension; mathematical atoms and numerical givens are unchanged.',
  spacedSourceFigureLabelsUseSupportedEnglishAliases: true,
  originalSourceZhAndFigureReviewReplayed: false, alreadyCountedInD018: true,
  englishReviewAndFigureTuples: 'pending', fullCourseApproval: false,
  parentNewImages: 0, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ author: bind(`${out}/authored.json`),
  draft: bind(`${out}/en.lesson.draft.json`), paragraphs: native.flow.paragraphs.length }));
