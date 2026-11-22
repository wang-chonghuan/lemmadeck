import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const preparedFile = `${ticket}/tmp/d1816-d965-n74-missing-en/prepared.json`;
const prepared = read(preparedFile);
const old = read(prepared.approvedZh.path);
assert.equal(bind(prepared.approvedZh.path).sha256, prepared.approvedZh.sha256);
assert.equal(old.prose.length, 25);
const texts = {
  0: '**A conservative field**. In an electrostatic field with a fixed source-charge distribution, the work done by the electric force in moving a charge between two points depends only on the initial and final points, not on the path.\nIf the charge returns to its starting point along a closed path, the total work done by the electrostatic force is zero. A field with this property is called a conservative field.\n\nElectrostatic work is related to the change in electric potential energy and is consistent with energy conservation. Energy conservation alone, however, does not establish that every time-dependent electric field is conservative.',
  1: 'In this electrostatic model, the electric force does work equal to the negative change in electric potential energy: $A=-(E_{P_2}-E_{P_1})$.\nHere, work means only work done by the electric force, and the initial and final potential energies use the same reference zero.\nThe distance expression in formula (8-22) from the previous lesson applies only to its uniform-field model, not directly to every electrostatic field.',
  2: '**Electric potential**. In a given electrostatic field, choose a common reference zero for potential energy and make the test charge small enough not to change the source-charge distribution.\nAt a given point, the interaction potential energy is proportional to the signed test charge. The ratio of potential energy to a nonzero charge therefore does not depend on the test charge itself.\nThis ratio depends on the position in the field and the chosen reference zero, in uniform and nonuniform electrostatic fields alike.',
  3: "This introduces electric potential, a quantity describing the energy properties of an electrostatic field.\n**The electric potential at a point is the ratio of a charge's electric potential energy there to its signed charge.** The charge in the denominator must not be zero.\n\nPotential can also be understood as the potential energy per unit positive charge at that point. It is not kinetic energy or total energy divided by charge.",
  4: 'The definition of electric potential is:',
  6: "Electric field strength $\\vec{E}$ is a vector describing the electric force on a charge, including the direction of that force.\nElectric potential $U$ is a scalar describing the energy properties of an electrostatic field: given the charge, it determines that charge's electric potential energy relative to the chosen zero.",
  7: 'Keep the uniform-field model between two parallel charged plates, neglect edge effects, and choose the negatively charged plate as the zero of potential energy and potential.\nMeasure distance normally from the negative plate toward the positive plate, and use the magnitude of electric field strength.\nFrom formulas (8-22) and (8-23), the potential in this region is:',
  9: '**Potential difference**. The value of potential at a point depends on the reference zero. Changing the zero adds the same constant to the potential at every point.\nOnce a reference is chosen, potential values can be described and compared. The change in potential between two points is unaffected by a change of zero and is directly related to electrostatic work.',
  10: 'Potential energy satisfies $E_P=qU$.\nFor the same charge moving from the initial point to the final point, the work done by the electric force can be written:',
  11: '$A=-(E_{P_2}-E_P)=-q(U_2-U_1)=-q\\Delta U$. (8-25)\nIn this formula, the potential-energy term without a numbered subscript specifically denotes the initial potential energy; the term with the final-point subscript denotes the final potential energy.\nThe sign of the work depends on both the signed charge and the potential change. A rise or fall in potential alone does not determine the sign of electric work on a moving negative charge.',
  12: 'The potential change is defined as final potential minus initial potential: $\\Delta U=U_2-U_1$.\nThis lesson defines potential difference in the opposite order, as initial potential minus final potential.\nUse the same initial and final points when comparing the two quantities:',
  14: 'Potential difference is also commonly called voltage.\nFor the initial-to-final order specified in this lesson, voltage is the negative of the potential change.\nExchanging the order of the two points reverses the sign of the voltage.',
  15: 'When studying electric current, it is often more convenient to use the potential difference or voltage $V$ between two specified points.\nThe electrostatic-work relation here applies to circuit sections treated with an electrostatic model. It cannot be directly extended to total work in every circuit with electromagnetic induction.',
  16: 'From formulas (8-25) and (8-26), potential difference can also be written:',
  18: 'The potential difference or voltage between two points, $V=U_1-U_2$, equals the work done by the electric force as a charge moves from the initial point to the final point, divided by its signed, nonzero charge.\nThis still requires a fixed source-charge distribution and negligible disturbance of the original field by the test charge. Work done by other forces must not be included as electric-force work.',
  19: 'For a lighting-circuit section that can be treated with an electrostatic field model, knowing the voltage between two nodes determines the work done by the electric force per unit positive charge moving from the initial node to the final node.\nThis does not identify work done by other forces inside a source, or work around an entire closed circuit with induction effects, with work done by an electrostatic force.\nPotential difference will be used frequently in the later study of circuits.',
  20: '**The unit of potential difference**. Formula (8-27) shows that the unit of potential difference is determined by the units of work and charge.',
  21: 'In the International System of Units, work is measured in joules and charge in coulombs.\nIf the electric force does 1 joule of work when 1 coulomb of positive charge moves from the initial point to the final point, the potential difference for this order of points is 1 joule per coulomb.\nThis unit is called the volt.',
  22: 'The source also uses the electrostatic system of units: if the electric force does 1 erg of work in moving 1 electrostatic unit of positive charge, the corresponding potential difference defines the potential-difference unit in that system.\nThis historical system differs from the International System of Units. Numerical values in the two systems cannot be combined without conversion.',
  23: 'Using the approximate conversion factor adopted in the source, the units are related by:',
};
const en = structuredClone(old);
en.edition = 'modern-us-neutral-en';
en.locale = 'en';
en.status = 'draft';
en.title = 'Electric Potential and Potential Difference';
en.printed_title = `74. ${en.title}`;
const tocFile = `${repo}/ssot-resources/soviet10year-textbooks/toc/9p/en.json`;
const chapters = read(tocFile).contents.filter(chapter =>
  (chapter.lessons || []).some(section => section.topics?.some(topic => topic.id === prepared.card)));
assert.equal(chapters.length, 1);
en.chapter = chapters[0].title;
const raw = read(prepared.source.path);
const unitTranslations = [
  ['\\text{伏特}', '\\text{volt}'],
  ['\\text{焦耳}', '\\text{joule}'],
  ['\\text{库仑}', '\\text{coulomb}'],
  ['\\text{尔格}', '\\text{erg}'],
  ['\\text{静电制电量单位}', '\\text{electrostatic charge unit}'],
  ['\\text{静电制电势差单位}', '\\text{electrostatic potential unit}'],
];
for (const [index, block] of en.prose.entries()) {
  assert.equal(block.kind, 'p');
  if (index === 24) {
    const math = [...block.text.matchAll(/\$[^$]+\$/g)];
    assert.equal(math.length, 1);
    let translated = math[0][0];
    for (const [before, after] of unitTranslations) {
      assert(translated.includes(before));
      translated = translated.replaceAll(before, after);
    }
    block.text = `${translated}.\nThis conversion retains the approximate values used in the source. Their limited number of digits is not an exact definition.`;
  } else if (texts[index]) {
    block.text = texts[index];
  } else {
    assert([5, 8, 13, 17].includes(index), `Missing prose translation ${index}`);
  }
  block.changes = block.text === raw.prose[index].text ? [] : ['translation', 'layout', 'clarification'];
}
en.section_breaks = [];
const out = `${ticket}/tmp/d1816-d966-n74-missing-en`;
save(`${out}/en.before-native.json`, en);
save(`${out}/inputs.json`, {
  task: 'D966', card: prepared.card, prepared: bind(preparedFile),
  approvedZh: prepared.approvedZh, historicalZhScience: prepared.historicalZhScience,
  historicalZhNative: prepared.completeChineseHistoricalNative,
  source: prepared.source, sourcePages: prepared.sourcePages,
  englishBeforeNative: bind(`${out}/en.before-native.json`), englishToc: bind(tocFile),
  fullOriginalObjects: 25, originalTasks: 0, originalFigures: 0,
  unitTextLiteralTranslations: unitTranslations,
  mathCoreNumericGivensAndReferencesUnchanged: true,
  historicalZhAndSourcePassReplayed: false, alreadyCountedInD019: true,
  newCompleteCourses: 0, newSourcePages: 0, parentNewImages: 0,
});
run('d966-n74-first-missing-en-text-layout-native', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${ticket}/tmp/d1816-recovery/normalize-d966-n74-missing-en.py`,
]);
