import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const root = path.join(repo, '.tmp/stemrobin-184-six/source164165-source');
const stageRoot = path.join(repo, '.tmp/stemrobin-184-six/stages');
assert.equal(process.cwd(), repo);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const binding = file => {
  const absolute = path.isAbsolute(file) ? file : path.join(root, file);
  const bytes = fs.readFileSync(absolute);
  return { path: absolute, bytes: bytes.length, sha256: hash(bytes) };
};
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (name, value) => fs.writeFileSync(
  path.join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' },
);
const priorStages = [
  'source164-first-prepare-nov21', 'source164-first-freeze-nov21',
  'source165-first-prepare-nov21', 'source165-first-freeze-nov21',
];
const stageEvidence = name => {
  const file = path.join(stageRoot, `${name}.receipt.json`);
  const receipt = read(file);
  assert.equal(receipt.exitCode, 0, `First producer failure: ${name}`);
  assert.equal(receipt.cwd, repo);
  for (const stream of Object.values(receipt.outputs)) {
    assert.deepEqual(binding(path.join(repo, stream.path)), {
      ...stream, path: path.join(repo, stream.path),
    });
  }
  return { name, receipt: binding(file), facts: receipt };
};
const frontmatter = text => {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  assert(match, 'Missing JSON template frontmatter');
  return JSON.parse(match[1]);
};

if (process.argv[2] === 'build') {
  for (const name of ['comparison.json', 'package.json', 'manifest.json']) {
    assert(!fs.existsSync(path.join(root, name)), `Already produced: ${name}`);
  }
  const stages = priorStages.map(stageEvidence);
  const freezes = [164, 165].map(page => read(path.join(root, `0${page}.freeze.json`)));
  for (const freeze of freezes) {
    const name = `source${freeze.physicalPage}-first-freeze-nov21`;
    const output = fs.readFileSync(path.join(stageRoot, `${name}.stdout`), 'utf8');
    for (const record of output.trim().split('\n').map(line => JSON.parse(line))) {
      assert.deepEqual(binding(record.path), {
        path: record.path, bytes: record.bytes, sha256: record.sha256,
      });
      assert.equal(fs.statSync(record.path).mode & 0o777, 0o444);
    }
    assert.deepEqual(binding(freeze.source.path), {
      path: freeze.source.path, bytes: freeze.source.bytes, sha256: freeze.source.sha256,
    });
  }
  assert(stages[1].facts.ended <= stages[2].facts.started, '164 freeze must precede165');
  const comparison = freezes.map(freeze => {
    const directory = path.join(repo, `.tmp/ld-s10y-lesson/9c/pages/0${freeze.physicalPage}`);
    const template = path.join(directory, 'page.template.md');
    const layoutFile = path.join(directory, 'layout.json');
    const originalMetadata = frontmatter(fs.readFileSync(template, 'utf8'));
    const originalLayout = read(layoutFile);
    return {
      physicalPage: freeze.physicalPage,
      readPhase: 'FULL_TEXT_ONLY_AFTER_BOTH_INDEPENDENT_FREEZES',
      sourceCounts: freeze.sourceCounts,
      projectionBandCount: originalLayout.line_bands.length,
      originalTemplate: binding(template),
      originalLayoutBinding: binding(layoutFile),
      originalMetadata,
      originalLayout,
      projectionCaveat: 'Original bands may include residual ink, underline, fraction tiers and limit scripts. No pixel interpretation, source modification, exclusion or count acceptance is performed.',
      proposal: {
        status: 'INERT_NOT_APPLIED_NOT_APPROVED',
        printed_page: Number(freeze.printedFolio.digits),
        notesEvidence: binding(`0${freeze.physicalPage}.freeze.json`),
        errata: [],
        bodyReference: binding(freeze.body),
        count_exclusions: [],
        noWholeCourseOrUnitBoundary: true,
      },
      projectionOwners: originalLayout.line_bands.map((band, index) => {
        const row = freeze.physicalRows[index];
        return {
          bandOrdinal: index + 1,
          originalBand: band,
          frozenRow: row?.row ?? null,
          frozenOwner: row?.owner ?? null,
          frozenYApprox: row?.yApprox ?? null,
          evidence: 'Ordered post-freeze textual band correspondence to native-view owner; not source/count/geometry acceptance',
          status: row ? 'INERT_CORRESPONDENCE_UNAPPROVED' : 'HOLD_UNOWNED_PROJECTION',
        };
      }),
      holds: ['H-PROJECTION', 'H-SOURCE', 'H-PARENT-INTAKE'],
    };
  });
  write('comparison.json', comparison);
  const externalPaths = [
    '.tmp/stemrobin-184-six/source164165-source-assignment.txt',
    '.tmp/stemrobin-184-six/source164165-dispatch-parent-receipt.json',
    '.tmp/stemrobin-184-six/run-stage.mjs',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    '.claude/skills/ld-s10y-lesson/tools/layout.py',
    '.claude/skills/ld-s10y-lesson/tools/blocks.py',
    '.claude/skills/ld-s10y-lesson/tools/normalize.py',
    '.claude/skills/ld-s10y-lesson/tools/mathcheck.py',
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
    '.claude/skills/ld-s10y-lesson/SKILL.md',
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  ];
  for (const page of [164, 165]) {
    for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
      externalPaths.push(`.tmp/ld-s10y-lesson/9c/pages/0${page}/${name}`);
    }
  }
  // Resolve only the already-frozen source's PDF identity; never parse PDF content.
  const pdfName = comparison[0].originalMetadata.source.pdf;
  const pdf = path.join(repo, 'ssot-resources/soviet10year-textbooks/sources/soviet10years', pdfName);
  assert(fs.existsSync(pdf), 'Original PDF reference absent');
  const pdfBinding = binding(pdf);
  assert.equal(pdfBinding.sha256, comparison[0].originalMetadata.source.pdf_sha256);
  externalPaths.push(pdf);
  const externalRefs = externalPaths.map(file => binding(path.isAbsolute(file) ? file : path.join(repo, file)));
  write('package.json', {
    schema: 'lean-source-text-intake@1',
    builtAt: new Date().toISOString(),
    ticket: 'STEMROBIN-184/184-6',
    pages: [164, 165],
    ownedRoot: root,
    status: 'OPEN_FULL_PARENT_TEXT_INTAKE_AND_EXPLICIT_CLOSE_REQUIRED',
    authority: 'AUTHOR_FREEZE_NOT_SOURCE_COUNT_MATH_NATIVE_BOUNDARY_OR_PUBLICATION_APPROVAL',
    bodyBindings: freezes.map(freeze => binding(freeze.body)),
    freezeBindings: [164, 165].map(page => binding(`0${page}.freeze.json`)),
    comparison: binding('comparison.json'),
    usage: binding('usage.json'),
    report: binding('report.txt'),
    completedStages: stages,
    externalRefs,
    holds: [
      ...freezes.flatMap(freeze => freeze.holds.map(hold => hold.id)),
      ...read(path.join(root, 'usage.json')).unknownHolds.map(hold => hold.id),
      'H-PROJECTION', 'H-SOURCE', 'H-PARENT-INTAKE',
    ],
    intakeOrder: [
      'report.txt', 'usage.json', '0164.body.md', '0164.freeze.json',
      '0165.body.md', '0165.freeze.json', 'comparison.json', 'package.json',
      'package.mjs', 'integrity.mjs', 'manifest.json',
    ],
    completionEvidencePaths: [
      ...['build', 'seal', 'integrity'].flatMap(action => ['stdout', 'stderr', 'receipt.json']
        .map(suffix => path.join(stageRoot, `source164165-first-${action}-nov21.${suffix}`))),
    ],
    closure: 'Not closed; no message to parent/other production chat. Await actual FULL parent textual intake and explicit close.',
    duplicationPolicy: 'No runtime/PDF/image/old-package copies; exact external bindings only',
  });
  for (const name of ['comparison.json', 'package.json']) console.log(JSON.stringify(binding(name)));
} else if (process.argv[2] === 'seal') {
  assert(!fs.existsSync(path.join(root, 'manifest.json')), 'Manifest already exists');
  const packageData = read(path.join(root, 'package.json'));
  const build = stageEvidence('source164165-first-build-nov21');
  const externalRefs = [
    ...packageData.externalRefs,
    ...[...packageData.completedStages, build].flatMap(stage => [
      stage.receipt,
      ...Object.values(stage.facts.outputs).map(stream => ({
        ...stream, path: path.join(repo, stream.path),
      })),
    ]),
  ];
  const names = fs.readdirSync(root).sort();
  assert(names.every(name => fs.statSync(path.join(root, name)).isFile()));
  const files = names.map(name => ({ name, ...binding(name), mode: '0444' }));
  write('manifest.json', {
    schema: 'self-excluding-zero-decode-manifest@1',
    root, excludesOnlySelf: 'manifest.json', files, externalRefs,
    stageCompletionBinding: 'Seal receipt/streams bound by integrity stdout; integrity stdout/stderr bound by its unique run-stage receipt',
    expectedModes: { files: '0444', root: '0555' },
    authority: 'BYTE_INTEGRITY_ONLY_NOT_SOURCE_ACCEPTANCE',
  });
  for (const name of fs.readdirSync(root)) fs.chmodSync(path.join(root, name), 0o444);
  fs.chmodSync(root, 0o555);
  console.log(JSON.stringify({ ...binding('manifest.json'), rootMode: '0555', filesMode: '0444', sealedFiles: files.length + 1 }));
} else {
  throw new Error('Only build or seal is supported; never retry after actual failure');
}
