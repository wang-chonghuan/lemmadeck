import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n32-fig207208-author-first-10');
const mode = process.argv[2];
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const load = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const binding = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size });
const put = (name, value) => {
  const p = path.join(owned, name);
  if (fs.existsSync(p)) throw new Error(`Preserve existing evidence: ${name}`);
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`);
  return binding(p);
};
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const p = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(p) : [p];
  }).sort();
}
function verifyReceipts() {
  return walk(path.join(owned, 'receipts')).filter(p => p.endsWith('.json')).map(p => {
    const r = load(p);
    if (!Array.isArray(r.argv) || r.cwd !== root || !Number.isInteger(r.actualExitCode)) throw new Error(`Incomplete execution receipt: ${p}`);
    for (const stream of Object.values(r.streams)) {
      if (hash(stream.path) !== stream.sha256) throw new Error(`Stream hash mismatch: ${p}`);
    }
    for (const output of r.outputs) {
      if (output.exists && hash(output.path) !== output.sha256) throw new Error(`Output hash mismatch: ${output.path}`);
    }
    return { ...binding(p), actualExitCode: r.actualExitCode };
  });
}
if (mode === 'manifest') {
  const observations = load(path.join(owned, 'author-observations.json'));
  if (observations.imageBudget.charged !== 8) throw new Error('Image counter drift');
  const receiptBindings = verifyReceipts();
  const ledger = {
    schema: 'same188-6/figure-author-ledger@1',
    scope: observations.scope, imageBudget: observations.imageBudget,
    figures: observations.figures.map(f => ({
      id: f.id, status: f.status, contentRevisions: f.contentRevisions,
      fullRenderInvocations: f.fullRenderInvocations, technicalRecoveries: f.technicalRecoveries,
    })),
    observations: binding(path.join(owned, 'author-observations.json')),
    executionReceipts: receiptBindings, activeExecSessions: [],
    paidCalls: 0, reviewFilesProduced: 0, canonicalPromotion: false,
  };
  const ledgerBinding = put('ledger.json', ledger);
  const figures = observations.figures.map(author => {
    const id = Number(author.id.slice(4)), prefix = `fig-${id}.`;
    const current = suffix => path.join(owned, `${prefix}${id === 208 ? 'r1.' : ''}${suffix}`);
    const firstPath = path.join(owned, `${prefix}FIRST.json`), first = load(firstPath);
    if ((fs.statSync(firstPath).mode & 0o777) !== 0o444) throw new Error('FIRST permissions drift');
    const report = load(current('render.json'));
    const widths = load(path.join(owned, `${prefix}width-check${id === 207 ? '.recovery1' : ''}.json`));
    if (report.status !== 'pass' || widths.status !== 'pass') throw new Error('Current machine evidence not PASS');
    if (report.spec.sha256 !== hash(current('spec.json')) || report.output.svg.sha256 !== hash(current('svg'))) throw new Error('Current render drift');
    return {
      id: author.id, status: author.status, owner: first.scope.owner, author,
      source: binding(path.join(root, first.source.path)),
      first: { ...binding(firstPath), mode: '0444', freezeReceipt: binding(path.join(owned, 'receipts/freeze-first.json')) },
      context: binding(path.join(owned, `${prefix}context.json`)),
      current: {
        spec: binding(current('spec.json')), render: binding(current('render.json')),
        svg: binding(current('svg')), nativePreview: binding(current('native.png')),
        mobilePreview: binding(path.join(owned, `${prefix}mobile-300.png`)),
        machineWidths: binding(path.join(owned, `${prefix}width-check${id === 207 ? '.recovery1' : ''}.json`)),
      },
      machineStatus: 'PASS_AUTHOR_ONLY', independentReview: 'NOT_RUN',
      visualAuthorStatus: id === 207 ? 'AUTHOR_ONLY' : 'HOLD_MOBILE_NOT_INSPECTED',
      widths: widths.widths.map(w => ({ width: w.width, measuredMinTextPx: w.measuredMinTextPx, status: w.status })),
      ...(id === 208 ? {
        revision: binding(path.join(owned, 'fig-208.revision.json')),
        nativeSanityReuse: {
          originallyViewed: binding(path.join(owned, 'fig-208.native.png')),
          currentByteIdenticalReceipt: binding(path.join(owned, 'receipts/revision208-byte-check.json')),
          claim: 'Visible geometry unchanged only; not independent source-fidelity approval',
        },
      } : {}),
    };
  });
  const textRoot = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n32-text-candidate-10');
  const manifest = {
    schema: 'same188-6/figures-manifest@1', ticket: 'STEMROBIN-188', assignment: 'SAME188-6',
    book: '6-8g', lesson: 'geo68-c3-s1-n32', finish: 'review', offline: true,
    status: 'HOLD', preciseStatus: 'fig-207 AUTHOR_ONLY; fig-208 HOLD for uncompleted mobile author sanity',
    ownedRoot: owned, figures, ledger: ledgerBinding,
    textPaths: ['lesson.template.json', 'exercises.template.json', 'record.json'].map(name => binding(path.join(textRoot, name))),
    contextAuthority: 'Supplied read-only candidate text and approved source PNGs only; no answers or keys',
    tools: ['validate_spec.py', 'render_spec.mjs', 'assets/figure-spec.schema.json']
      .map(name => binding(path.join(root, '.agents/skills/ld-s10y-image', name.startsWith('assets/') ? name : `scripts/${name}`))),
    executionReceipts: receiptBindings,
    hashesFile: path.join(owned, 'hashes.json'),
    noApproval: ['No review@1 PASS', 'No canonical promotion', 'No whole-lesson finalization', 'No answer/choice/display approval'],
    activeExecSessions: [],
  };
  console.log(JSON.stringify(put('figures.manifest.json', manifest), null, 2));
} else if (mode === 'hashes') {
  verifyReceipts();
  const manifestPath = path.join(owned, 'figures.manifest.json');
  const manifest = load(manifestPath);
  const external = [
    ...manifest.textPaths.map(v => v.path),
    ...manifest.figures.map(v => v.source.path),
    ...manifest.tools.map(v => v.path),
  ];
  const files = [...new Set([...walk(owned), ...external])].sort().map(binding);
  const hashes = {
    schema: 'same188-6/hashes@1', algorithm: 'sha256', status: manifest.status,
    manifest: binding(manifestPath), files,
    nonCircularExclusions: [
      'hashes.json cannot contain its own hash',
      'receipts/seal-hashes.json and its streams are created after this file and externally bind hashes.json',
    ],
    terminalReceipt: path.join(owned, 'receipts/seal-hashes.json'),
  };
  console.log(JSON.stringify(put('hashes.json', hashes), null, 2));
} else {
  throw new Error('Unknown finishing stage');
}
