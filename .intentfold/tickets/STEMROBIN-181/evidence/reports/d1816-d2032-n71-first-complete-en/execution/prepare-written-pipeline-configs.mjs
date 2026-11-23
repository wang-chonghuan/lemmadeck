import { repo, ticket, read, save } from './n42-native.mjs';

for (const input of read(process.argv[2])) {
  const { card, book, name, title, authorStage, prepareStage, firstStage } = input;
  const at = offset => `d${firstStage + offset}-${name}`;
  const local = `${ticket}/tmp/d1816-recovery`;
  const author = `${ticket}/tmp/d1816-${authorStage}-first-en-author`;
  const preparedFile = `${ticket}/tmp/d1816-${prepareStage}-preparation/prepared.json`;
  const prepared = read(preparedFile);
  const nativeFile = `${ticket}/tmp/d1816-${at(0)}-first-en-native/result.json`;
  const inputs = `${ticket}/tmp/d1816-${at(1)}-en-choice-review-inputs`;
  const domFile = `${ticket}/tmp/d1816-${at(2)}-first-en-display/report.json`;
  const reviewer = `${ticket}/tmp/d1816-${at(5)}-first-en-review`;
  const evidencePath = `.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-${at(6)}-first-complete-en`;
  save(`${local}/finalize-${at(0)}-config.json`, {
    book, stage: at(0), author, preparedFile,
    out: `${ticket}/tmp/d1816-${at(0)}-first-en-native`,
  });
  save(`${local}/choices-${at(1)}-config.json`, { card, book, author, out: inputs });
  const figures = read(`${repo}/ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/modern-us-neutral/lessons/${card}/figures.json`).figures;
  save(`${local}/display-${at(2)}-config.json`, {
    card, title, nativeFile, viewFile: `${inputs}/views.json`, figureSeedFile: `${inputs}/seed.json`,
    figureLabels: Object.fromEntries(figures.map(figure => [figure.id, `Figure ${figure.id.replace('fig-', '')}`])),
    mobileMediaConstraint: true, formulaPadding: '.25em .1em .55em', firstFile: null,
    focusedIndices: {
      answers: [0, prepared.readonlyAnswers - 1],
      choices: [0, prepared.choiceQuestions - 1],
    },
    out: `${ticket}/tmp/d1816-${at(2)}-first-en-display`,
    images: `${repo}/.tmp/STEMROBIN-181/d1816-${at(2)}/display`,
  });
  save(`${local}/pixels-${at(3)}-config.json`, {
    domFile, wholeStage: `${at(3)}-whole-pixels`, focusedStage: `${at(4)}-focused-pixels`,
  });
  save(`${local}/retain-${at(6)}-config.json`, {
    card, book, title, stage: at(6), out: `${repo}/${evidencePath}`, author, reviewer, inputs,
    nativeFile, domFile, preparedFile,
    pixelStages: [`${at(3)}-whole-pixels`, `${at(4)}-focused-pixels`],
    extraEvidenceDirectories: input.extraEvidenceDirectories ?? [],
    receiptStages: input.receiptStages ?? [],
    executionScripts: [
      'prepare-first-English-base-lesson.mjs', `prepare-${prepareStage}-config.json`,
      'finalize-first-English-lesson.mjs', `finalize-${at(0)}-config.json`,
      'prepare-first-English-choices.py', `choices-${at(1)}-config.json`,
      'display-d1892-ex1-first-en.mjs', `display-${at(2)}-config.json`,
      'prepare-d1940-ex9-pixel-inputs.mjs', `pixels-${at(3)}-config.json`,
      'retain-first-English-written-lesson.mjs', `retain-${at(6)}-config.json`,
      'prepare-written-pipeline-configs.mjs', 'written-pipeline-inputs-d2012.json',
    ],
  });
  save(`${local}/push-${at(6)}-config.json`, {
    card, book, title, stage: at(6), evidencePath,
    dependencyPaths: prepared.figureDependencies.map(item =>
      `ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/modern-us-neutral-en/${item.relative}`),
  });
  console.log(JSON.stringify({ card, native: at(0), choices: at(1), display: at(2),
    pixels: [at(3), at(4)], review: at(5), retention: at(6), approval: false }));
}
