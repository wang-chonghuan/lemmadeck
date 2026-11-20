import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {isDeepStrictEqual as equal} from 'node:util';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp');
const own = path.join(tmp, 'source226227-FIRST-review-01');
const read = name => JSON.parse(fs.readFileSync(path.join(tmp, name), 'utf8'));
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const save = (name, data) => fs.writeFileSync(path.join(own, name), JSON.stringify(data, null, 2) + '\n');
const compact = text => text.replace(/\s/gu, '');

// These are independent comparisons of saved data. No producer helpers are imported.
function regions(text) {
  const result = [];
  let start = 0;
  let math = false;
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== '$' || text[i - 1] === '\\') continue;
    result.push({region: math ? 'math' : 'text', text: text.slice(start, i)});
    math = !math;
    start = i + 1;
  }
  result.push({region: math ? 'math' : 'text', text: text.slice(start)});
  return {result, balanced: !math};
}
function signature(text) {
  const parsed = regions(text);
  return {
    balanced: parsed.balanced,
    formulas: parsed.result.filter(item => item.region === 'math').map(item => item.text),
    numbers: parsed.result.flatMap(item => [...item.text.matchAll(/\d+(?:\.\d+)?/gu)].map(match => ({region: item.region, value: match[0]}))),
    units: parsed.result.flatMap(item => [...item.text.matchAll(/\\mathrm\{[^}]+\}(?:\^\{?\d+\}?)?|平方米|昼夜/gu)].map(match => match[0])),
    subparts: parsed.result.filter(item => item.region === 'text').flatMap(item => [...item.text.matchAll(/(\d+)\)/gu)].map(match => match[1]))
  };
}
const rawLesson = read('g10-n61/artifacts/9-10g/lessons/geo910-c2-s3-n61/lesson.json');
const rawExercises = read('g10-n61/artifacts/9-10g/lessons/geo910-c2-s3-n61/exercises.json');
const lesson = read('n61-modern-text-author/lesson.template.json');
const exercises = read('n61-modern-text-author/exercises.template.json');
const flow = read('n61-modern-text-author/prose-flow.saved.json');
const objects = [];
function compareObject(raw, current, domain, index) {
  const identityFields = domain === 'prose'
    ? ['kind', 'id', 'label', 'printed_page', 'source_refs']
    : ['number', 'source_number', 'group', 'group_id', 'pages', 'figure_refs', 'figures'];
  const identity = identityFields.map(field => ({field, raw: raw[field], current: current[field], equal: equal(raw[field], current[field])}));
  const rawSignature = signature(raw.text);
  const currentSignature = signature(current.text);
  const contentWithoutWhitespaceEqual = compact(raw.text) === compact(current.text);
  const changed = raw.text !== current.text;
  const metadata = {
    changes: current.changes,
    numeric_changes: current.numeric_changes,
    historical_entities: current.historical_entities,
    sourceTextExactlyRaw: current.source_text === raw.text,
    layoutOnlyDeclarationMatches: equal(current.changes, changed ? ['layout'] : []),
    emptyNumericAndHistory: equal(current.numeric_changes, []) && equal(current.historical_entities, [])
  };
  const subpartLines = current.text.split('\n').filter(line => /^\d+\)/u.test(line));
  const exerciseLineCheck = domain !== 'exercises' || (
    equal(current.lines, current.text.split('\n')) &&
    (currentSignature.subparts.length === 0 || (
      current.text.split('\n').length === currentSignature.subparts.length + 1 &&
      subpartLines.length === currentSignature.subparts.length &&
      equal(currentSignature.subparts, Array.from({length: currentSignature.subparts.length}, (_, i) => String(i + 1)))
    ))
  );
  const comparison = {
    object: `${domain}[${index}]`,
    kind: current.kind ?? 'ex',
    id: current.id ?? current.number ?? null,
    source_refs: current.source_refs ?? current.pages,
    rawText: raw.text,
    currentText: current.text,
    identity,
    contentWithoutWhitespaceEqual,
    signatures: {raw: rawSignature, current: currentSignature, exactlyEqual: equal(rawSignature, currentSignature)},
    metadata,
    exerciseLineCheck,
    status: identity.every(item => item.equal) && contentWithoutWhitespaceEqual &&
      equal(rawSignature, currentSignature) && rawSignature.balanced && currentSignature.balanced &&
      metadata.sourceTextExactlyRaw && metadata.layoutOnlyDeclarationMatches &&
      metadata.emptyNumericAndHistory && exerciseLineCheck ? 'PASS' : 'FAIL'
  };
  objects.push(comparison);
}
rawLesson.prose.forEach((raw, index) => compareObject(raw, lesson.prose[index], 'prose', index));
rawExercises.exercises.forEach((raw, index) => compareObject(raw, exercises.exercises[index], 'exercises', index));
const flowStdoutPath = path.join(tmp, 'n61-modern-text-author/receipts/prose-flow-01/stdout.txt');
const stdout = fs.readFileSync(flowStdoutPath, 'utf8');
const stdoutBoundaries = stdout.split('\n').filter(line => line.trimStart().startsWith('break: ')).map(line => JSON.parse(line.trimStart().slice(7)));
const boundaries = lesson.section_breaks.map(boundary => {
  const index = flow.boundaries.findIndex(candidate => equal(candidate, boundary));
  const before = flow.paragraphs.findIndex(paragraph => paragraph.text === boundary.before);
  const after = flow.paragraphs.findIndex(paragraph => paragraph.text === boundary.after);
  return {boundary, savedBoundaryIndex: index, savedBeforeParagraph: before, savedAfterParagraph: after,
    exactSavedBoundary: index >= 0, adjacentSavedParagraphs: before >= 0 && after === before + 1,
    exactActualStdoutBoundary: stdoutBoundaries.some(candidate => equal(candidate, boundary))};
});
const figurePairs = lesson.figures.map(figure => {
  const number = figure.id.split('-').at(-1);
  const slots = lesson.prose.filter(item => item.kind === 'fig' && item.id === figure.id);
  const captions = lesson.prose.filter(item => item.kind === 'cap' && item.label === `图 ${number}`);
  return {id: figure.id, figureSlots: slots.length, captionSlots: captions.length,
    figureRefs: slots.map(slot => slot.source_refs), captionRefs: captions.map(slot => slot.source_refs),
    status: slots.length === 1 && captions.length === 1 ? 'PASS_TEXT_CONTRACT_ONLY' : 'FAIL'};
});
const protectedTokens = [
  {id: 'literal-parenthesis-after-frustum-height', text: '$[O_1,O]$)', present: lesson.prose[13].text.includes('$[O_1,O]$)')},
  {id: 'lateral-subscript-not-modernized', text: '$S_{侧}=\\pi RL$', present: lesson.prose[7].text.includes('$S_{侧}=\\pi RL$')},
  {id: 'total-subscript-not-modernized', text: '$S_{圆锥}=\\pi RL+\\pi R^2$', present: lesson.prose[8].text.includes('$S_{圆锥}=\\pi RL+\\pi R^2$')},
  {id: 'raised207', text: '207°.', present: exercises.exercises[1].text.startsWith('207°.')},
  {id: 'legacy-roof-word', text: '苫屋顶', present: exercises.exercises[4].text.includes('苫屋顶')},
  {id: 'exercise209-seam', refs: ['p0220#12', 'p0221#1'], present: equal(exercises.exercises[3].pages, ['p0220#12', 'p0221#1'])}
];
const lessonIdentity = Object.keys(rawLesson).filter(key => key !== 'prose').map(field => ({field, equal: equal(rawLesson[field], lesson[field])}));
const sourceSnapshotEquality = {lesson: equal(lesson.source.data, rawLesson), exercises: equal(exercises.source.data, rawExercises)};
save('n61-all30-independent-comparison.json', {
  schema: 'independent-saved-data-semantic-comparison@1',
  noProducerScriptsImportedOrRun: true,
  counts: {objects: objects.length, proseObjects: lesson.prose.length, textualProse: lesson.prose.filter(item => item.kind === 'p').length,
    figureSlots: lesson.prose.filter(item => item.kind === 'fig').length, captionSlots: lesson.prose.filter(item => item.kind === 'cap').length,
    exercises: exercises.exercises.length},
  sourceSnapshotEquality,
  sourceHashes: {lesson: lesson.source.sha256, exercises: exercises.source.sha256},
  lessonIdentity,
  objects,
  figurePairs,
  protectedTokens,
  sectionBreaks: {
    count: boundaries.length, boundaries,
    savedStdoutSha256: sha(fs.readFileSync(flowStdoutPath)), recordedStdoutSha256: flow.stdout.sha256,
    savedAllBoundaryArrayEqualsStdout: equal(flow.boundaries, stdoutBoundaries),
    flowRerun: false, layoutRerun: false
  },
  failures: objects.filter(object => object.status === 'FAIL').map(object => object.object)
});

const spec = read('n60-fig7778-author/fig-g10-77.draft02.spec.json');
const firstSpec = read('n60-fig7778-author/fig-g10-77.draft01.spec.json');
const objectMap = new Map(spec.objects.map(object => [object.id, object]));
const assertionMap = new Map(spec.assertions.map(assertion => [assertion.id, assertion]));
const coordinate = value => typeof value === 'string' ? objectMap.get(value).at : value;
const vector = (a, b) => [b[0] - a[0], b[1] - a[1]];
const distance = (a, b) => Math.hypot(...vector(a, b));
function inside(point, polygon) {
  let result = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if ((yi > point[1]) !== (yj > point[1]) &&
      point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi) result = !result;
  }
  return result;
}
const assertions = spec.assertions.map(assertion => {
  let actual;
  let expected;
  let passed;
  if (assertion.type === 'pointOnCircle') {
    actual = distance(coordinate(assertion.point), coordinate(assertion.center)); expected = assertion.radius;
    passed = Math.abs(actual - expected) <= 1e-9;
  } else if (assertion.type === 'equalDistance') {
    actual = distance(coordinate(assertion.a), coordinate(assertion.b)); expected = distance(coordinate(assertion.c), coordinate(assertion.d));
    passed = Math.abs(actual - expected) <= 1e-9;
  } else if (assertion.type === 'connects') {
    const edge = objectMap.get(assertion.arrow);
    actual = [coordinate(edge.from), coordinate(edge.to)]; expected = [coordinate(assertion.from), coordinate(assertion.to)];
    passed = equal(actual, expected);
  } else if (assertion.type === 'pointOnLine') {
    const v = vector(coordinate(assertion.a), coordinate(assertion.b));
    const w = vector(coordinate(assertion.a), coordinate(assertion.point));
    actual = v[0] * w[1] - v[1] * w[0]; expected = 0; passed = Math.abs(actual) <= 1e-9;
  } else if (assertion.type === 'perpendicular') {
    const v = vector(coordinate(assertion.a), coordinate(assertion.b));
    const w = vector(coordinate(assertion.c), coordinate(assertion.d));
    actual = v[0] * w[0] + v[1] * w[1]; expected = 0; passed = Math.abs(actual) <= 1e-9;
  } else if (assertion.type === 'inside') {
    const anchorObject = objectMap.get(assertion.point);
    actual = inside(anchorObject.at, objectMap.get(assertion.container).points); expected = true; passed = actual;
  } else if (assertion.type === 'objectCount') {
    actual = spec.objects.filter(object => object.type === assertion.objectType).length; expected = assertion.count; passed = actual === expected;
  } else throw new Error(`Unsupported saved assertion ${assertion.type}`);
  return {id: assertion.id, type: assertion.type, actual, expected, status: passed ? 'PASS_DATA_COMPARISON' : 'FAIL'};
});
const relationshipFields = ['point', 'center', 'a', 'b', 'c', 'd', 'from', 'to'];
const inventoryGroups = spec.source.inventory.map(group => {
  const mappedPoints = group.objects.filter(id => objectMap.get(id)?.type === 'point');
  const pointCoverage = mappedPoints.map(id => ({
    point: id,
    mappedInternalRelationships: group.assertions.filter(assertionId => {
      const assertion = assertionMap.get(assertionId);
      if (!assertion || assertion.type === 'objectCount' || assertion.type === 'inside') return false;
      const pointRefs = relationshipFields.map(field => assertion[field]).filter(value => typeof value === 'string' && objectMap.get(value)?.type === 'point');
      return pointRefs.includes(id) && new Set(pointRefs).size >= 2 && pointRefs.every(point => group.objects.includes(point));
    })
  }));
  return {id: group.id, requires: group.requires, allObjectIdsResolve: group.objects.every(id => objectMap.has(id)),
    allAssertionIdsResolve: group.assertions.every(id => assertionMap.has(id)), pointCoverage,
    allMappedPointsHaveInternalRelationships: pointCoverage.every(point => point.mappedInternalRelationships.length > 0)};
});
function differences(a, b, pointer = '') {
  if (equal(a, b)) return [];
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return [{path: pointer, before: a, after: b}];
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(key => differences(a[key], b[key], `${pointer}/${key}`));
}
const context77 = read('n60-fig7778-author-inputs-01/fig-g10-77.context.json');
const context78 = read('n60-fig7778-author-inputs-01/fig-g10-78.context.json');
const n60Lesson = read('n60-modern-text-author/lesson.template.json');
const n60Exercises = read('n60-modern-text-author/exercises.template.json');
save('figure77-independent-data-comparison.json', {
  schema: 'independent-saved-figure-data-comparison@1',
  noNativeOrRenderOrValidationImportedOrRun: true,
  fullContextEquality: {
    context77Prose: equal(context77.completeEditionProse, n60Lesson.prose),
    context77Exercises: equal(context77.completeEditionExercises, n60Exercises.exercises),
    context78Prose: equal(context78.completeEditionProse, n60Lesson.prose),
    context78Exercises: equal(context78.completeEditionExercises, n60Exercises.exercises)
  },
  authoritativeTextMatchesRelevantCompleteEdition: equal(spec.source.authoritativeText.map(item => item.text), n60Lesson.prose.slice(2, 4).map(item => item.text)),
  repairDiff: differences(firstSpec, spec),
  assertions,
  inventoryGroups,
  literalGeometryObjectCounts: Object.fromEntries(['point', 'circle', 'segment', 'polygon', 'text'].map(type => [type, spec.objects.filter(object => object.type === type).length])),
  semanticLimit: 'Only projected OM-axis perpendicularity is executable in this 2D representation; full spatial plane perpendicularity remains the bound edition-text premise, not a claim proved by the projection.'
});
console.log(JSON.stringify({textObjects: objects.length, textFailures: objects.filter(object => object.status === 'FAIL').map(object => object.object),
  boundaries: boundaries.length, assertionComparisons: assertions.length, assertionFailures: assertions.filter(assertion => assertion.status === 'FAIL').length,
  uncoveredGroups: inventoryGroups.filter(group => !group.allMappedPointsHaveInternalRelationships).map(group => group.id)}));
