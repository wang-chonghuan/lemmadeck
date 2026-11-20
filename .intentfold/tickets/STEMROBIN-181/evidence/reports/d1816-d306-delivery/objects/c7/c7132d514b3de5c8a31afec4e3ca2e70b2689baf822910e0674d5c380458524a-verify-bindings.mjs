import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

process.on('uncaughtException', error => {
  console.error(JSON.stringify({ status: 'fail', error: error.message,
    location: error.stack?.split('\n').find(line => line.includes('verify-bindings.mjs:')) }));
  process.exitCode = 1;
});

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const own = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp');
const author = path.join(tmp, 'd1816-d281-fig2829-author');
const contextResult = path.join(tmp, 'd1816-d293-n19-figure-context/result.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({
  path: path.resolve(root, file),
  sha256: hash(path.resolve(root, file)),
  bytes: fs.statSync(path.resolve(root, file)).size,
});
const write = (name, payload) => {
  const file = path.resolve(own, name);
  assert(file.startsWith(`${own}/`));
  fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx' });
};
const verified = new Map();
const verify = (entry, authority) => {
  const actual = bind(entry.path);
  assert.equal(actual.sha256, entry.sha256, `${authority}: SHA-256 ${entry.path}`);
  if (entry.bytes !== undefined) assert.equal(actual.bytes, entry.bytes, entry.path);
  const prior = verified.get(actual.path);
  verified.set(actual.path, {
    ...actual,
    authorities: [...new Set([...(prior?.authorities || []), authority])],
    status: 'pass',
  });
  return actual;
};
const walk = (value, authority) => {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) verify(value, authority);
  for (const child of Object.values(value)) {
    if (child && typeof child === 'object') walk(child, authority);
  }
};
const freezeFile = path.join(author, 'author-freeze.json');
const freeze = read(freezeFile);
const expectedFreezeHash = fs.readFileSync(path.join(author, 'author-freeze.sha256'), 'utf8')
  .trim().split(/\s+/)[0];
verify({ path: freezeFile, sha256: expectedFreezeHash }, 'D281 author-freeze.sha256');
walk(freeze.bindings, 'D281 original immutable author output and receipt freeze');
verify(freeze.report, 'D281 original author report');
const historicalInputDrift = [];
for (const entry of freeze.inputs) {
  const actual = bind(entry.path);
  if (actual.sha256 === entry.sha256) {
    verify(entry, 'D281 historical input still current');
  } else {
    assert(entry.path.endsWith('modern-us-neutral-en/lessons/phy10-c1-s3-n18/lesson.template.json'),
      `Unexpected historical input drift: ${entry.path}`);
    historicalInputDrift.push({
      originalBinding: { path: entry.path, sha256: entry.sha256, bytes: entry.bytes },
      currentBinding: actual,
      status: 'historical-hash-drift-not-output-drift',
      sharedInputPreserved: true,
    });
  }
}
const result = read(contextResult);
const selected = result.records.filter(record => ['fig-28', 'fig-29'].includes(record.id));
assert.equal(selected.length, 2);
for (const record of selected) walk(record, `D293 ${record.id} selected record`);
const textFreezeFile = path.join(author, 'text-freeze.json');
const textFreeze = read(textFreezeFile);

// Parse the existing SVG as XML without creating a browser, raster or preview.
const xmlProgram = `
import json,sys,xml.etree.ElementTree as E
r=E.fromstring(sys.stdin.buffer.read())
local=lambda n:n.tag.rsplit("}",1)[-1]
texts=[{"id":n.get("data-label-id"),"text":n.get("data-label-text","".join(n.itertext())),"renderedBaseText":"".join(n.itertext()),"fontSize":float(n.get("font-size"))} for n in r.iter() if local(n)=="text"]
vectors=[{"label":n.get("data-vector-label"),"accentPaths":[c.get("d") for c in n if c.get("data-vector-accent")=="U+20D7"]} for n in r.iter() if n.get("data-vector-label")]
elements=[{"id":n.get("id"),"type":local(n),"dash":n.get("stroke-dasharray"),"markerStart":n.get("marker-start"),"markerEnd":n.get("marker-end")} for n in r.iter() if n.get("id")]
hidden=lambda n:"visibility:hidden" in n.get("style","").replace(" ","")
paints=[v for n in r.iter() if not hidden(n) for k,v in n.attrib.items() if k in ("stroke","fill") and v!="none"]
print(json.dumps({"root":r.attrib,"texts":texts,"vectors":vectors,"elements":elements,"paints":sorted(set(paints)),"hiddenConstructionCount":sum(hidden(n) for n in r.iter())}))
`;

const records = [];
for (const record of selected) {
  const spec = read(record.spec.path);
  const firstSpec = read(record.firstSpec.path);
  const render = read(record.render.path);
  const firstRender = read(record.firstRender.path);
  const preview = read(record.previewReport.path);
  const semanticPath = path.join(author, 'first', record.id, 'semantic-assertions.json');
  const semantic = read(semanticPath);
  assert.equal(spec.schema, 'ld-s10y-image/figure-spec@2');
  assert.equal(render.status, 'pass');
  assert.equal(firstRender.status, 'pass');
  assert.equal(preview.status, 'pass');
  assert.equal(semantic.status, 'pass');
  assert.equal(spec.id, record.id);
  assert.equal(spec.mode, 'deterministic');
  const withoutContext = value => {
    const copy = structuredClone(value);
    delete copy.source.authoritativeText;
    delete copy.source.image.path;
    return copy;
  };
  assert.deepEqual(withoutContext(spec), withoutContext(firstSpec),
    `${record.id}: only complete text and byte-identical canonical source path rebinding`);
  verify(firstSpec.source.image, `${record.id} original source copy`);
  assert.equal(firstSpec.source.image.sha256, spec.source.image.sha256);
  const withoutSpecBinding = value => {
    const copy = structuredClone(value);
    delete copy.spec;
    return copy;
  };
  assert.deepEqual(withoutSpecBinding(render), withoutSpecBinding(firstRender),
    `${record.id}: render metadata changed only its spec binding`);
  verify(render.spec, `${record.id} current render -> selected spec`);
  verify(render.output.svg, `${record.id} current render -> original SVG`);
  assert.equal(render.output.svg.sha256, record.svg.sha256);
  walk(preview, `${record.id} original native preview receipt`);
  walk(semantic, `${record.id} original native semantic assertion receipt`);
  const source = verify(spec.source.image, `${record.id} canonical source PNG`);
  assert.deepEqual(spec.source.authoritativeText.slice(0, 2),
    textFreeze.authoritativeText.slice(0, 2), `${record.id}: complete N18 authority`);
  const textBindings = [];
  for (const [index, locale] of ['zh', 'en'].entries()) {
    const input = textFreeze.n18[locale];
    const sourceTemplate = read(input.path);
    const currentNonfig = sourceTemplate.prose.filter(block => block.kind !== 'fig');
    const normalizeTextLayout = blocks => blocks.map(block => ({
      ...block, text: block.text?.replace(/\s+/g, ' ').trim(),
    }));
    assert.deepEqual(normalizeTextLayout(input.nonfig), normalizeTextLayout(currentNonfig),
      'Current N18 source prose may differ in text whitespace only');
    const changedBlockIndices = currentNonfig.flatMap((block, i) =>
      JSON.stringify(block) === JSON.stringify(input.nonfig[i]) ? [] : [i]);
    for (const item of historicalInputDrift) {
      if (item.currentBinding.path === input.path) {
        item.classification = 'N18 English text whitespace/layout only; all non-text block fields unchanged';
        item.changedNonfigureBlockIndices = changedBlockIndices;
        item.contentAndMathSemanticallyIdentical = true;
      }
    }
    for (const block of input.nonfig) {
      if (block.text) assert(spec.source.authoritativeText[index].text.includes(block.text));
    }
    const n19File = record.completeN19Text[index];
    const n19Text = fs.readFileSync(n19File.path, 'utf8');
    const n19Entry = spec.source.authoritativeText[2 + index];
    assert.equal(n19Entry.lesson, 'phy10-c1-s3-n19');
    assert.equal(n19Entry.locale, locale);
    assert.equal(n19Entry.text, n19Text);
    textBindings.push({
      locale,
      completeN18CurrentTemplate: bind(input.path),
      completeN18OriginalTemplateBinding: { path: input.path, sha256: input.sha256, bytes: input.bytes },
      completeN18FrozenAuthority: bind(textFreezeFile),
      completeN18OriginalTemplateHashStillCurrent: hash(input.path) === input.sha256,
      completeN18CurrentTextEquivalentIgnoringLayoutWhitespace: true,
      currentTemplateWhitespaceChangedBlockIndices: changedBlockIndices,
      completeN18NonfigureBlocks: input.nonfig.length,
      completeN19Text: verify(n19File, `${record.id} complete D287 N19 ${locale}`),
      allTextRead: true,
      truncatedSourceSnippetsUsedAsAuthority: false,
    });
  }
  assert.equal(spec.source.authoritativeText.length, 4);

  const objectIds = new Set(spec.objects.map(object => object.id));
  const assertionIds = new Set(spec.assertions.map(assertion => assertion.id));
  assert.equal(objectIds.size, spec.objects.length);
  assert.equal(assertionIds.size, spec.assertions.length);
  for (const group of spec.source.inventory) {
    for (const id of group.objects) assert(objectIds.has(id), `Unresolved inventory object ${id}`);
    for (const id of group.assertions) assert(assertionIds.has(id), `Unresolved inventory assertion ${id}`);
  }
  const missingEdgeCoverage = spec.objects
    .filter(object => ['segment', 'arrow'].includes(object.type))
    .filter(object => !spec.assertions.some(a => a.type === 'connects' && a.arrow === object.id))
    .map(object => object.id);
  assert.deepEqual(missingEdgeCoverage, []);
  const mapping = spec.source.inventory.map(group => ({
    id: group.id,
    objectCount: group.objects.length,
    assertionCount: group.assertions.length,
    allObjectIdsResolve: true,
    allAssertionIdsResolve: true,
  }));
  const svg = JSON.parse(execFileSync('python3', ['-c', xmlProgram], {
    input: fs.readFileSync(record.svg.path), encoding: 'utf8',
  }));
  assert.equal(Number(svg.root.width), 640);
  assert.equal(Number(svg.root.height), spec.canvas.height);
  assert.equal(svg.root.viewBox, `0 0 640 ${spec.canvas.height}`);
  assert(svg.paints.every(value => value.startsWith('var(--ld-figure-') || value === 'context-stroke'),
    'Visible SVG paints must use semantic variables or inherit a semantic context stroke');
  assert.equal(svg.texts.length, render.labels);
  assert(!svg.texts.some(t => /[\u0400-\u04ff\u3400-\u9fff]/u.test(t.text)));
  const textMin = Math.min(...svg.texts.map(text => text.fontSize));
  assert(textMin >= 16);
  for (const object of spec.objects.filter(o => o.type === 'text')) {
    assert(svg.texts.some(t => t.id === `${object.id}-label` && t.text === object.text));
    if (object.text.includes('\u20d7')) {
      assert(svg.vectors.some(v => v.label === object.text && v.accentPaths.length === 1 &&
        v.accentPaths[0].length > 0), `Missing rendered vector accent ${object.id}`);
    }
  }
  assert.equal(spec.display.layout, 'scroll');
  assert.equal(spec.display.purpose, 'instructional');
  assert.equal(spec.display.minTextPx, 16);
  assert.deepEqual(spec.display.widths, [640]);
  assert.deepEqual(render.collisions, []);
  const dashBindings = [];
  for (const object of spec.objects.filter(o => /equilibrium-reference$/.test(o.id))) {
    const element = svg.elements.find(e => e.id === `ld-${record.id}_ld-${object.id}`);
    assert.equal(object.dash, 3);
    assert.equal(element.dash, '10,10');
    dashBindings.push({ object: object.id, svgElement: element.id, dash: element.dash });
  }
  for (const object of spec.objects.filter(o => /mass-position-extension$|displacement-marker$/.test(o.id))) {
    const element = svg.elements.find(e => e.id === `ld-${record.id}_ld-${object.id}`);
    assert(element);
    assert(!element.dash);
    assert(!element.markerStart && !element.markerEnd);
  }
  const displayChecks = preview.previews.map(item => {
    assert.equal(item.geometry.mediaWidth, 640);
    assert.equal(item.geometry.minTextPx, 16);
    assert.equal(item.geometry.scrollWidth, 640);
    if (item.viewportWidth === 331) {
      assert.equal(item.geometry.clientWidth, 331);
      assert.deepEqual(item.geometry.scrollEnd, { scrollLeft: 309, maxScroll: 309 });
    }
    return { ...bind(item.path), viewportWidth: item.viewportWidth,
      capture: item.capture, nativeGeometry: item.geometry, imageIndependentlyViewed: true };
  });
  const n = record.id === 'fig-28' ? '28' : '29';
  const receiptNames = [
    n === '28' ? 'd281-002-fig28-draft' : 'd281-003-fig29-draft',
    n === '28' ? 'd281-004-fig28-render' : 'd281-005-fig29-render',
    n === '28' ? 'd281-006-fig28-assert-preview' : 'd281-007-fig29-assert-preview',
  ];
  const nativeReceipts = receiptNames.map(name => {
    const directory = path.join(author, 'native', name);
    const receiptPath = path.join(directory, 'receipt.json');
    const receipt = read(receiptPath);
    assert.equal(receipt.cwd, root);
    assert.equal(receipt.exitCode, 0);
    assert.equal(receipt.signal, null);
    assert.equal(receipt.error, null);
    assert.equal(fs.statSync(path.join(directory, 'stderr.txt')).size, 0);
    return { ...bind(receiptPath), exitCode: receipt.exitCode,
      originalCommand: receipt.command, neverReexecutedInD294: true,
      stdout: bind(path.join(directory, 'stdout.txt')),
      stderr: bind(path.join(directory, 'stderr.txt')) };
  });
  records.push({
    id: record.id,
    source,
    spec: bind(record.spec.path),
    svg: bind(record.svg.path),
    render: bind(record.render.path),
    firstSpec: bind(record.firstSpec.path),
    firstRender: bind(record.firstRender.path),
    previewReport: bind(record.previewReport.path),
    originalSemanticAssertions: bind(semanticPath),
    nativeReceipts,
    completeTextBindings: textBindings,
    contextOnlyUpdateConfirmed: true,
    byteIdenticalSourceRelocatedFromOriginalCopyToCanonicalPng: true,
    geometryObjectsAssertionsInventoryUnchanged: true,
    renderMetadataOnlySpecBindingChanged: true,
    objectCount: spec.objects.length,
    assertionCount: spec.assertions.length,
    labelCount: render.labels,
    inventoryMappings: mapping,
    inventoryIdsResolve: true,
    allSemanticSegmentsAndArrowsHaveConnects: true,
    displayChecks,
    svgXmlInspection: {
      root: svg.root, minTextPxAt640: textMin,
      textCount: svg.texts.length, paintRoles: svg.paints,
      vectorAccentPaths: svg.vectors,
      hiddenJsxgraphConstructionElementsExcludedFromVisiblePaintAudit: svg.hiddenConstructionCount,
      dashBindings, allVisibleTextMatchesSpec: true,
      culturalTextLeak: false, displacementGuidesSolidUnarrowed: true,
    },
    nativePassedStagesReusedWithoutRerun: true,
  });
}

const inventory = bind(path.join(own, 'source-inventory.json'));
const imageRows = [
  ['fig-28', 'canonical-source', path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-28.png')],
  ['fig-29', 'canonical-source', path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-29.png')],
  ['fig-29', 'existing-source-spring-crop', path.join(author, 'fig-29.spring-top.crop.png')],
  ['fig-29', 'existing-source-spring-crop', path.join(author, 'fig-29.spring-bottom.crop.png')],
  ['fig-28', 'full-640-preview', path.join(author, 'first/fig-28/fig-28.w640.png')],
  ['fig-28', 'mobile-331-scroll-end-preview', path.join(author, 'first/fig-28/fig-28.w331.png')],
  ['fig-29', 'full-640-preview', path.join(author, 'first/fig-29/fig-29.w640.png')],
  ['fig-29', 'mobile-331-scroll-end-preview', path.join(author, 'first/fig-29/fig-29.w331.png')],
];
const imageLedger = {
  schema: 'd294/actual-image-ledger@1',
  batch: 'D294', freshBoundedContext: true,
  totalLoadedIntoAgentContext: 8, batchLimit: 8,
  canonicalSourceLoads: 2, existingCropLoads: 2, previewLoads: 4,
  reopens: 0, otherImageLoads: 0, furtherImageOpensAllowed: 0,
  loads: imageRows.map(([figure, kind, file], index) => ({
    index: index + 1, figure, kind, ...bind(file), tool: 'functions.view_image',
    sourceInventoryBeforeComparison: index < 4,
  })),
  inventoryRecordedBeforeFirstModernPreview: inventory,
  evidenceCreationIsNotImageViewing: true,
};
write('image-ledger.json', imageLedger);
write('bindings-verification.json', {
  schema: 'd294/hash-and-existing-evidence-inspection@1',
  batch: 'D294', cwd: root, status: 'pass',
  d293Result: bind(contextResult),
  d281AuthorFreeze: bind(freezeFile),
  d281FreezeChecksum: bind(path.join(author, 'author-freeze.sha256')),
  sourceInventory: inventory,
  historicalInputDrift,
  immutableD281OutputsAndNativeReceiptsAllHashVerified: true,
  verifiedBindings: [...verified.values()],
  records,
  revalidationCommandsRun: 0, geometryRerenders: 0,
  browserStarts: 0, screenshotsCreated: 0, paidCalls: 0,
  method: 'SHA-256/bytes binding audit, complete-context equality and static JSON/XML inspection; no original validator, renderer or semantic assertion executable was rerun.',
});
console.log(JSON.stringify({
  status: 'pass',
  uniqueHashBindingsVerified: verified.size,
  records: records.map(r => ({ id: r.id, objects: r.objectCount,
    assertions: r.assertionCount, labels: r.labelCount })),
  imageLoads: 8, stageReruns: 0,
  output: bind(path.join(own, 'bindings-verification.json')),
  imageLedger: bind(path.join(own, 'image-ledger.json')),
}));
