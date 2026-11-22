import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp');
const own = path.join(tmp, 'n32-nineanswers-text-207208-independent-review-11');
const sourcePath = path.join(tmp, 'n32-integrated-independent-inputs-10/source-only.json');
const postPath = path.join(tmp, 'n32-nineanswer-draft-and-review-inputs-11/post-FIRST.json');
const json = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write = (name, value) => fs.writeFileSync(path.join(own, name), `${JSON.stringify(value, null, 2)}\n`);
const source = json(sourcePath);
const post = json(postPath);
const rootNames = [
  'n32-integrated-independent-inputs-10',
  'n32-draft-first-10',
  'n32-nineanswer-draft-and-review-inputs-11',
  'n32-text-candidate-10',
  'n32-eight-answers-author-first-10',
  'n32-438-author-mobile-recovery-11',
  'n32-fig207208-author-first-10',
];
const allowedRoots = rootNames.map(n => path.join(tmp, n));
const sourceImages = new Set(source.sourceImages.map(x => x.path));
const allowedTools = new Set([
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
].map(p => path.join(repo, p)));
const allowed = p => sourceImages.has(p) || allowedTools.has(p) ||
  allowedRoots.some(r => p.startsWith(`${r}/`)) || p.startsWith(`${own}/`);
const resolve = (p, parent) => path.isAbsolute(p) ? p :
  p.startsWith('.intentfold/') || p.startsWith('ssot-resources/') ? path.join(repo, p) :
    path.join(path.dirname(parent), p);

if (process.argv[2] === 'bindings') {
  const entries = new Map();
  const add = (p, expected, from) => {
    const resolved = resolve(p, from);
    const key = `${resolved}|${expected ?? ''}`;
    if (!entries.has(key)) {
      const result = { path: resolved, declaredSha256: expected ?? null, referencedBy: [from] };
      if (!allowed(resolved)) result.status = 'EXCLUDED_NOT_READ';
      else if (!fs.existsSync(resolved)) result.status = 'MISSING';
      else {
        result.actualSha256 = sha(resolved);
        result.bytes = fs.statSync(resolved).size;
        result.status = expected ? result.actualSha256 === expected ? 'MATCH' : 'DRIFT' : 'HASHED';
      }
      entries.set(key, result);
    } else entries.get(key).referencedBy.push(from);
  };
  const walk = (v, from) => {
    if (!v || typeof v !== 'object') return;
    if (typeof v.path === 'string' && typeof v.sha256 === 'string') add(v.path, v.sha256, from);
    for (const child of Object.values(v)) walk(child, from);
  };
  add(sourcePath, '3acbfd12a5e8136309c90bb6edc54c5c0bdae1a77e6e41668abb6fd2741c5363', sourcePath);
  add(postPath, '4aa0bc5165d0cf3810fb5e51e82e9991ce76625ec19e53d29eb66db0d95bd0d2', postPath);
  walk(source, sourcePath);
  walk(post, postPath);
  const manifestPath = post.figureAuthorManifest.path;
  const recoveryPath = post.mobile208AuthorRecovery.path;
  const manifest = json(manifestPath);
  const recovery = json(recoveryPath);
  walk(manifest, manifestPath);
  walk(recovery, recoveryPath);
  walk(json(post.textAuthorRecord.path), post.textAuthorRecord.path);
  const receipts = [];
  const receiptBindings = [
    ...manifest.executionReceipts,
    ...recovery.executionReceipts,
  ];
  for (const binding of receiptBindings) {
    const receipt = json(binding.path);
    walk(receipt, binding.path);
    const exits = ['actualExitCode', 'exitCode', 'exit_code', 'returncode']
      .filter(k => receipt[k] !== undefined).map(k => receipt[k]);
    const streams = Object.values(receipt.streams ?? {});
    const argv = receipt.argv ?? receipt.child_argv;
    const record = {
      path: binding.path, sha256: sha(binding.path),
      cwd: receipt.cwd ?? receipt.workdir,
      argv,
      exitCode: exits[0] ?? null,
      aliasesConsistent: exits.every(x => x === exits[0]),
      completionRecorded: Boolean(receipt.finishedAt ?? receipt.completedAt),
      signal: receipt.signal ?? null,
      executionError: receipt.executionError ?? receipt.error ?? null,
      streams: streams.map(s => ({
        path: resolve(s.path, binding.path),
        declaredSha256: s.sha256,
        actualSha256: sha(resolve(s.path, binding.path)),
      })),
      outputs: receipt.outputs ?? [],
      reusedNotExecuted: true,
    };
    record.status = record.cwd === repo && record.aliasesConsistent &&
      record.exitCode !== null && record.completionRecorded && !record.signal &&
      !record.executionError && record.streams.length === 2 &&
      record.streams.every(s => s.actualSha256 === s.declaredSha256) ?
        record.exitCode === 0 ? 'COMPLETE_BOUND_SUCCESS' : 'COMPLETE_BOUND_HISTORICAL_FAILURE' :
        'RECEIPT_DEFECT';
    receipts.push(record);
  }
  for (const figure of post.figures) {
    walk(json(figure.current.render.path), figure.current.render.path);
    walk(json(figure.current.machineWidths.path), figure.current.machineWidths.path);
  }
  const results = [...entries.values()];
  write('reference-bindings.json', {
    scope: 'Only assigned completed roots; excluded figure/source bindings declared but not read',
    entries: results,
    summary: Object.fromEntries(['MATCH', 'HASHED', 'DRIFT', 'MISSING', 'EXCLUDED_NOT_READ']
      .map(s => [s, results.filter(x => x.status === s).length])),
    receipts,
    receiptDefects: receipts.filter(x => x.status === 'RECEIPT_DEFECT'),
  });
  console.log(JSON.stringify({
    references: results.length,
    issues: results.filter(x => ['DRIFT', 'MISSING'].includes(x.status)),
    receipts: receipts.length,
    receiptDefects: receipts.filter(x => x.status === 'RECEIPT_DEFECT'),
  }, null, 2));
}

if (process.argv[2] === 'text') {
  const lesson = json(source.rawLesson.path);
  const exercises = json(source.rawExercises.path);
  const lt = json(post.modernTemplates[0].path);
  const et = json(post.modernTemplates[1].path);
  const compact = text => text.replace(/\s/g, '');
  const checkItems = (raw, modern) => raw.map((item, i) => {
    const candidate = modern[i];
    return {
      identity: item.number ?? item.source_refs?.join(',') ?? i,
      sourceSnapshotExact: candidate.source_text === item.text,
      proseMathAndNumbersUnchangedIgnoringWhitespace: compact(candidate.text) === compact(item.text),
      metadataUnchanged: Object.entries(item).filter(([k]) => !['text', 'lines'].includes(k))
        .every(([k, v]) => isDeepStrictEqual(v, candidate[k])),
      changes: candidate.changes,
      numericChanges: candidate.numeric_changes,
    };
  });
  const unknown = text => (text.match(/Z_\{\\text\{UNKNOWN\}\}/g) ?? []).length;
  const result = {
    lessonSourceSnapshotExact: isDeepStrictEqual(lt.source.data, lesson),
    exercisesSourceSnapshotExact: isDeepStrictEqual(et.source.data, exercises),
    lessonSourceShaBinding: lt.source.sha256 === sha(source.rawLesson.path),
    exercisesSourceShaBinding: et.source.sha256 === sha(source.rawExercises.path),
    prose: checkItems(lesson.prose, lt.prose),
    exercises: checkItems(exercises.exercises, et.exercises),
    unknownOperatorCounts: {
      source: unknown(lesson.prose.map(x => x.text).join('\n')),
      modern: unknown(lt.prose.map(x => x.text).join('\n')),
    },
    modern438CyrillicSubpartMarkers: [...et.exercises.find(x => x.number === '438').text.matchAll(/^([\u0400-\u04ff])\)/gm)]
      .map(x => x[1]),
    sectionBreaks: lt.section_breaks,
    noEditionFinalizationClaim: true,
  };
  write('text-source-check.json', result);
  const args = ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', post.modernTemplates[0].path];
  const executed = spawnSync(process.execPath, args, { cwd: repo, encoding: 'utf8', timeout: 30000 });
  fs.writeFileSync(path.join(own, 'prose-flow.stdout'), executed.stdout ?? '');
  fs.writeFileSync(path.join(own, 'prose-flow.stderr'), executed.stderr ?? '');
  write('prose-flow.execution.json', {
    cwd: repo, argv: [process.execPath, ...args],
    exitCode: executed.status, signal: executed.signal, error: executed.error?.message ?? null,
    completed: true,
    streams: ['stdout', 'stderr'].map(s => ({
      path: path.join(own, `prose-flow.${s}`), sha256: sha(path.join(own, `prose-flow.${s}`)),
    })),
    notRenderOrFinalize: true,
  });
  console.log(JSON.stringify(result, null, 2));
  console.log(executed.stdout);
  if (executed.status !== 0) process.exitCode = 1;
}

if (process.argv[2] === 'widths') {
  const result = post.figures.map(figure => {
    const widths = json(figure.current.machineWidths.path);
    return { figure: figure.id, actualSha256: sha(figure.current.machineWidths.path), data: widths };
  });
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[2] === 'geometry') {
  const s207 = json(post.figures[0].current.spec.path);
  const s208 = json(post.figures[1].current.spec.path);
  const map207 = new Map(s207.objects.map(o => [o.id, o]));
  const coord207 = p => typeof p === 'string' ? map207.get(p).at : p;
  const mid = (a, b) => a.map((x, i) => (x + b[i]) / 2);
  const delta = (a, b) => a.map((x, i) => x - b[i]);
  const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  const norm = a => Math.hypot(...a);
  const center207 = map207.get('207-point-O').at;
  const central207 = s207.assertions.filter(a => a.type === 'centralSymmetry').map(a => ({
    id: a.id, center: coord207(a.center),
    pairs: a.pairs.map(p => ({
      a: coord207(p.a), b: coord207(p.b),
      midpoint: mid(coord207(p.a), coord207(p.b)),
      residual: norm(delta(mid(coord207(p.a), coord207(p.b)), center207)),
    })),
  }));
  const group207 = s207.source.inventory.find(g => g.id === '207-points');
  const pointSet = new Set(group207.objects);
  const pointRelationships = group207.assertions.map(id => s207.assertions.find(a => a.id === id))
    .filter(a => ['collinear', 'equalDistance', 'centralSymmetry'].includes(a.type))
    .map(a => {
      const named = new Set();
      const collect = v => {
        if (typeof v === 'string' && map207.get(v)?.type === 'point') named.add(v);
        else if (v && typeof v === 'object') Object.values(v).forEach(collect);
      };
      collect(a);
      return { id: a.id, points: [...named], whollyInsideGroup: [...named].every(p => pointSet.has(p)) };
    });
  const map208 = new Map(s208.objects.map(o => [o.id, o]));
  const lineA = map208.get('208-line-a');
  const lineB = map208.get('208-line-b');
  const lineC = map208.get('208-line-c');
  const va = delta(lineA.to, lineA.from);
  const vc = delta(lineC.to, lineC.from);
  const directions = { ne: [va, vc], nw: [vc, va.map(x => -x)],
    sw: [va.map(x => -x), vc.map(x => -x)], se: [vc.map(x => -x), va] };
  const arcs = s208.objects.filter(o => o.type === 'arc').map(o => {
    const wedge = o.id.split('-')[2];
    const start = delta(o.start, o.center);
    const end = delta(o.end, o.center);
    const startRay = directions[wedge][0];
    const endRay = directions[wedge][1];
    const startAngle = Math.atan2(start[1], start[0]);
    const endAngle = Math.atan2(end[1], end[0]);
    const sweep = ((endAngle - startAngle + 2 * Math.PI) % (2 * Math.PI)) * 180 / Math.PI;
    const group = s208.source.inventory.find(g => g.objects.includes(o.id));
    const required = ['start-radius', 'end-radius', 'start-ray', 'end-ray'].map(s => `${o.id}-${s}`);
    return {
      id: o.id, center: o.center, radius: norm(start), endRadius: norm(end), sweepDegrees: sweep,
      startRayCrossResidual: Math.abs(cross(start, startRay)) / norm(startRay),
      endRayCrossResidual: Math.abs(cross(end, endRay)) / norm(endRay),
      startPositiveRay: dot(start, startRay) > 0,
      endPositiveRay: dot(end, endRay) > 0,
      group: group.id,
      allFourRadiusRayAssertionsMapped: required.every(id => group.assertions.includes(id) &&
        s208.assertions.some(a => a.id === id)),
    };
  });
  const widths = post.figures.map(f => {
    const w = json(f.current.machineWidths.path);
    return {
      figure: f.id, status: w.status,
      inputBindingsMatch: w.inputBindings.every(b => sha(b.path) === b.sha256),
      checks: w.widths.map(c => ({
        width: c.width, actualMediaWidthPx: c.actualMediaWidthPx,
        measuredMinTextPx: c.measuredMinTextPx, finiteGeometryAndLabelsFit: c.finiteGeometryAndLabelsFit,
        sectorGlyphsInsideActualWedges: c.sectors.length,
        allSectorGlyphsInside: c.sectors.every(s => s.entireGlyphBoxWithinWedge),
        minSectorRayClearancePx: c.sectors.length ? Math.min(...c.sectors.map(s => s.minRayClearancePx)) : null,
        errors: c.errors, status: c.status,
      })),
    };
  });
  const svgRoles = post.figures.map(f => {
    const svg = fs.readFileSync(f.current.svg.path, 'utf8');
    return { figure: f.id, sha256: sha(f.current.svg.path),
      semanticVariables: [...new Set(svg.match(/var\(--[a-zA-Z0-9-]+(?:,[^)]*)?\)/g) ?? [])],
      containsCyrillicOrCJK: /[\u0400-\u04ff\u3400-\u9fff]/u.test(svg),
      containsSourceOperatorOrAnswerText: /UNKNOWN|同位|内错|parallel axiom/.test(svg),
    };
  });
  const result = {
    kind: 'read-only targeted independent geometry calculations, not validator/render or answer sanity replay',
    source207ExplicitInkGapSupplement: {
      note: 'Frozen FIRST described geometric AA1 alignment, not the last ink endpoint. Initial original image shows the connector ending short of A1; current native/mobile preserve that appearance. FIRST not rewritten.',
      connectorEnd: map207.get('207-connector').to,
      lowerPoint: map207.get('207-point-A1').at,
      gapLengthNative: norm(delta(map207.get('207-connector').to, map207.get('207-point-A1').at)),
    },
    central207,
    inventoryGroup207: { id: group207.id, pointRelationships,
      coveredPoints: [...pointSet].filter(p => pointRelationships.some(r => r.whollyInsideGroup && r.points.includes(p))) },
    parallel208CrossResidual: Math.abs(cross(va, delta(lineB.to, lineB.from))),
    arcs208: arcs,
    widthEvidenceReused: widths,
    svgRoles,
    noNewCentralSymmetryAssertionInventedFor208: true,
  };
  write('geometry-width-check.json', result);
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[2] === 'history') {
  const manifest = json(post.figureAuthorManifest.path);
  const recovery = json(post.mobile208AuthorRecovery.path);
  for (const binding of [manifest.ledger, recovery.ledger]) {
    const ledger = json(binding.path);
    console.log(JSON.stringify({ path: binding.path, sha256: sha(binding.path),
      keys: Object.keys(ledger),
      counters: Object.fromEntries(Object.entries(ledger).filter(([k, v]) =>
        /image|revis|budget|active|failed|limit|context|status/i.test(k) ||
        typeof v !== 'object')),
    }, null, 2));
  }
}

if (process.argv[2] === 'boundary-provenance') {
  const lt = json(post.modernTemplates[0].path);
  const stdout = fs.readFileSync(path.join(own, 'prose-flow.stdout'), 'utf8');
  const boundaries = stdout.split('\n').filter(s => s.startsWith('    break: '))
    .map(s => JSON.parse(s.slice('    break: '.length)));
  const actualMatches = lt.section_breaks.map(boundary => ({
    boundary,
    exactMatchesInActualProseFlow: boundaries.filter(b => isDeepStrictEqual(b, boundary)).length,
  }));
  const full = json(post.answerCandidates.path);
  const eight = json(post.answerProvenance[0].path);
  const one = json(post.answerProvenance[1].path);
  const entries = data => Array.isArray(data) ? data : data.answers ?? data.candidates ?? [];
  const oldEight = entries(eight);
  const oneAnswer = entries(one);
  const provenance = full.answers.map(a => {
    const old = (a.exercise === '438' ? oneAnswer : oldEight).find(x =>
      String(x.exercise ?? x.number) === a.exercise);
    return { exercise: a.exercise, completeOriginalEntryPresent: Boolean(old),
      exactEntryUnchanged: Boolean(old && isDeepStrictEqual(a, old)) };
  });
  const result = {
    boundarySource: path.join(own, 'prose-flow.stdout'),
    boundarySourceSha256: sha(path.join(own, 'prose-flow.stdout')),
    actualMatches,
    oneSemanticSwitchNotHandIndexed: actualMatches.length === 1 &&
      actualMatches.every(b => b.exactMatchesInActualProseFlow === 1),
    answerExercises: full.answers.map(a => a.exercise),
    provenance,
    gradingCounts: Object.fromEntries(['auto', 'ungraded'].map(g => [g, full.answers.filter(a => a.grading === g).length])),
    sourceCounts: Object.fromEntries(['book', 'derived'].map(s => [s, full.answers.filter(a => a.source === s).length])),
    authorSanityReplays: 0,
    finalizerInvocations: 0,
  };
  write('boundary-provenance-check.json', result);
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[2] === 'complete-bindings') {
  const existing = json(path.join(own, 'reference-bindings.json'));
  const recovery = json(post.mobile208AuthorRecovery.path);
  for (const binding of recovery.finalPackagingReceipts) {
    const receipt = json(binding.path);
    const record = {
      path: binding.path, sha256: sha(binding.path),
      cwd: receipt.cwd, argv: receipt.argv,
      exitCode: receipt.exitCode, completionRecorded: Boolean(receipt.completedAt),
      signal: receipt.signal, executionError: receipt.error,
      streams: Object.values(receipt.streams).map(s => ({
        path: s.path, declaredSha256: s.sha256, actualSha256: sha(s.path),
      })),
      outputs: [], reusedNotExecuted: true,
    };
    record.status = record.cwd === repo && record.exitCode === 0 &&
      record.completionRecorded && !record.signal && !record.executionError &&
      record.streams.every(s => s.declaredSha256 === s.actualSha256) ?
        'COMPLETE_BOUND_SUCCESS' : 'RECEIPT_DEFECT';
    existing.receipts.push(record);
    existing.entries.push({
      path: binding.path, declaredSha256: null, actualSha256: record.sha256,
      bytes: fs.statSync(binding.path).size, status: 'HASHED',
      referencedBy: [post.mobile208AuthorRecovery.path],
    });
    for (const stream of record.streams) {
      existing.entries.push({
        path: stream.path, declaredSha256: stream.declaredSha256,
        actualSha256: stream.actualSha256, bytes: fs.statSync(stream.path).size,
        status: stream.declaredSha256 === stream.actualSha256 ? 'MATCH' : 'DRIFT',
        referencedBy: [binding.path],
      });
    }
  }
  existing.summary = Object.fromEntries(['MATCH', 'HASHED', 'DRIFT', 'MISSING', 'EXCLUDED_NOT_READ']
    .map(s => [s, existing.entries.filter(x => x.status === s).length]));
  existing.receiptDefects = existing.receipts.filter(x => x.status === 'RECEIPT_DEFECT');
  write('reference-bindings.json', existing);
  console.log(JSON.stringify({ references: existing.entries.length, summary: existing.summary,
    receipts: existing.receipts.length, receiptDefects: existing.receiptDefects,
    priorPassedBindingsReusedNotReexecuted: true }, null, 2));
}

if (process.argv[2] === 'manifest') {
  const firstPath = path.join(own, 'FIRST.md');
  const first = fs.statSync(firstPath);
  const firstHash = sha(firstPath);
  if ((first.mode & 0o777) !== 0o444 ||
    firstHash !== '291b66c5da1ba8f43b1795b0018327acdf68201f1941e0ec05f92b391a2ad541') {
    throw new Error('FIRST lock changed');
  }
  const refs = json(path.join(own, 'reference-bindings.json'));
  const ledger = json(path.join(own, 'image-ledger.json'));
  if (ledger.chargedAttempts !== 6 || ledger.successfulImages !== 6 ||
    ledger.attempts.some(a => a.status !== 'success')) throw new Error('Incomplete image ledger');
  const guidancePaths = [
    '.intentfold/readme.md', '.intentfold/project.json',
    '.intentfold/charter/product.md', '.intentfold/charter/engineering.md',
    '.intentfold/charter/operations.md',
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.claude/skills/ld-s10y-lesson/SKILL.md',
    '.claude/skills/ld-s10y-answer/SKILL.md',
    '.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md',
    '.agents/skills/ld-s10y-image/references/quality-gate.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  ].map(p => path.join(repo, p));
  guidancePaths.push('/Users/yong/.agents/skills/intentfold/SKILL.md');
  const ownEntries = fs.readdirSync(own).filter(n => n !== 'manifest.json').sort().map(n => {
    const p = path.join(own, n);
    const s = fs.statSync(p);
    if (!s.isFile()) throw new Error(`Unexpected owned non-file ${p}`);
    return { path: p, sha256: sha(p), bytes: s.size, mode: (s.mode & 0o777).toString(8).padStart(4, '0') };
  });
  const original = json(post.figureAuthorManifest.path);
  const recovery = json(post.mobile208AuthorRecovery.path);
  const manifest = {
    schema: 'SAME188-6/substantive-scoped-independent-review-manifest',
    ticket: 'STEMROBIN-188', book: '6-8g', lesson: 'geo68-c3-s1-n32',
    role: 'sole-new-independent-reviewer', offline: true, freshNonforkContext: true,
    ownedRoot: own, status: 'SCOPED_REVIEW_COMPLETE_N32_BLOCKED',
    finalReport: ownEntries.find(x => x.path.endsWith('/report.md')),
    FIRST: { path: firstPath, sha256: firstHash, mode: '0444', bytes: first.size,
      inode: first.ino, unchangedAfterSequentialFreeze: true },
    ownFiles: ownEntries,
    selfHashRule: 'manifest.json intentionally excludes its own hash; actual manifest SHA is returned in the final text, avoiding circular self-hashing',
    sourcePackage: { path: sourcePath, sha256: sha(sourcePath) },
    postFIRSTPackage: { path: postPath, sha256: sha(postPath) },
    referencedFiles: refs.entries,
    referenceSummary: refs.summary,
    guidanceReadOnlyHashes: guidancePaths.map(p => ({ path: p, sha256: sha(p), bytes: fs.statSync(p).size })),
    actualExistingExecutionReceipts: refs.receipts,
    newExecutionEvidence: [
      { command: 'chmod 0444 FIRST.md', toolReceipt: '895fb2', exitCode: 0, completed: true },
      { command: 'stat FIRST.md', toolReceipt: '30fc06', exitCode: 0, completed: true },
      { command: 'shasum -a 256 FIRST.md', toolReceipt: 'c92c76', exitCode: 0, completed: true },
      { command: 'review-checks.mjs bindings', toolReceipt: '90a37b', exitCode: 0, completed: true,
        output: path.join(own, 'reference-bindings.json') },
      { command: 'review-checks.mjs text / actual prose_flow child',
        toolReceipt: 'b4f7a3', exitCode: 0, completed: true,
        receipt: ownEntries.find(x => x.path.endsWith('/prose-flow.execution.json')) },
      { command: 'review-checks.mjs geometry', toolReceipt: '7986bf', exitCode: 0, completed: true,
        output: path.join(own, 'geometry-width-check.json') },
      { command: 'review-checks.mjs boundary-provenance', toolReceipt: 'fa0143',
        exitCode: 0, completed: true, output: path.join(own, 'boundary-provenance-check.json') },
      { command: 'review-checks.mjs complete-bindings', toolReceipt: 'e9cfa8',
        exitCode: 0, completed: true, output: path.join(own, 'reference-bindings.json') },
    ],
    perExercise: [
      { exercise: '432', verdict: 'PASS_WITH_EXPLICIT_INCLUSIVE_PARALLEL_CONVENTION' },
      { exercise: '433', verdict: 'PASS' },
      { exercise: '434', verdict: 'PASS_MATH_GRADING_NOTE', values: [true, true, true, false, false] },
      { exercise: '435', verdict: 'PASS_MATH_GRADING_NOTE', values: ['reflexive', 'symmetric', 'transitive'] },
      { exercise: '436', verdict: 'PASS_MATH_GRADING_NOTE', result: 'a intersects c' },
      { exercise: '437', verdict: 'FAIL_AVAILABLE_PREMISE_PROOF', finalGeometry: 'CORRECT_WITH_FOOT_ON_ACTUAL_RAY' },
      { exercise: '438', verdict: 'FAIL_ALL_TEN_AVAILABLE_PREMISE_PROOFS', finalMathAndFootnote: 'PASS',
        preciseDependenciesAndValidProofs: path.join(own, 'report.md') },
      { exercise: '439', verdict: 'PASS_ALL_LINE_UNION_CASES' },
      { exercise: '440', verdict: 'FAIL_AVAILABLE_PREMISE_REASONING_AND_NUMERIC_UNDERGRADING',
        anglesDegrees: [30, 150, 30, 150], sidesCm: [2, 4, 2, 4] },
    ],
    text: { sourceBinding: 'PASS', knowledge: 'PASS', mathematics: 'PASS',
      actualProseFlowBoundary: 'PASS', finalPresentation: 'HOLD_CYRILLIC438_LABELS_AND_DRAFT_OUTPUT_CONTRACT',
      unknownOperatorSubscripts: 4, identitiesResolved: false },
    figures: post.figures.map(f => ({
      id: f.id, current: f.current, source: f.source, revision: f.priorRevisions,
      mathematical: 'SCOPED_PASS', sourceFidelity: 'SCOPED_PASS', cultural: 'SCOPED_PASS',
      actualNativeAnd300PxMobileVisual: 'SCOPED_PASS',
      durablePromotion: false, reviewAt1Produced: false, rerendered: false,
    })),
    imageLedger: ownEntries.find(x => x.path.endsWith('/image-ledger.json')),
    imageCounters: { currentCharged: 6, currentSuccessful: 6, currentFailed: 0,
      currentCrops: 0, currentReopens: 0, chargedLimit: 8, contextTotal: 6, contextLimit: 24,
      parentPermanent: '24/24', imagePayloadsReturnedToParent: 0 },
    historicalCounters: {
      originalFigureAuthorLedger: original.ledger, originalCharged: 8, originalSuccessful: 7,
      originalMalformedLoadFailures: 1, recoveryLedger: recovery.ledger, recoveryCharged: 3,
      revision207: 0, revision208: 1, reset: false,
    },
    notRun: ['author65formula12caseReplay', 'author44formulaReplay', 'validator',
      'renderer', 'widthProducer', 'fullNineNativeFinalizer', 'app', 'network', 'DB'],
    preservedOutsideScope: ['201203 HOLD', '204206 HOLD', '205 persistent B collision and exhausted revision1',
      'source155 glyphFAIL', 'all printing-role UNKNOWN', 'prior reviewer retained and closed'],
    activeExecSessions: [], browserSessionsCreated: 0, childAgentsCreated: 0,
    forbiddenActionsExecuted: [],
    wholeLessonApproved: false, wholeN32: 'BLOCKED',
    returnFormat: 'TEXT_PATHS_SHA_ONLY_NO_IMAGES',
  };
  write('manifest.json', manifest);
  console.log(JSON.stringify({
    manifestPath: path.join(own, 'manifest.json'), manifestSha256: sha(path.join(own, 'manifest.json')),
    reportPath: path.join(own, 'report.md'), reportSha256: sha(path.join(own, 'report.md')),
    FIRST: manifest.FIRST, ledgerSha256: sha(path.join(own, 'image-ledger.json')),
    ownedFilesExcludingSelf: ownEntries.length, references: refs.entries.length,
    actualExistingReceipts: refs.receipts.length, activeExecSessions: [],
  }, null, 2));
}
