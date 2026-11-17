import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const own = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.resolve(own, '../../../../..');
const skill = path.join(repo, '.claude/skills/ld-s10y-lesson');
const python = path.join(skill, '.venv/bin/python');
const p2c = path.join(skill, 'tools/p2c.py');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const digest = file => hash(fs.readFileSync(file));
const relative = file => path.relative(own, file);

function immutable(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data, { flag: 'wx' });
  fs.chmodSync(file, 0o444);
}

function json(file, data) {
  immutable(file, JSON.stringify(data, null, 2) + '\n');
}

function files(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(entry => {
      const file = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${file}`);
      return entry.isDirectory() ? files(file) : [file];
    });
}

function snapshot(from, to) {
  return files(from).map(file => {
    const target = path.join(to, path.relative(from, file));
    immutable(target, fs.readFileSync(file));
    return { path: relative(target), sha256: digest(target), bytes: fs.statSync(target).size };
  });
}

function verifyInputs() {
  const inputs = JSON.parse(fs.readFileSync(path.join(own, 'receipts/inputs.json'), 'utf8'));
  for (const item of inputs.files) {
    if (digest(item.original) !== item.sha256) throw new Error(`Original input changed: ${item.original}`);
    if (digest(path.join(own, item.snapshot)) !== item.sha256) throw new Error(`Input snapshot changed: ${item.snapshot}`);
  }
  return inputs;
}

const [operation, value, attempt = 'initial'] = process.argv.slice(2);
if (operation === 'init') {
  const sourceRoot = path.join(repo, 'ssot-resources/soviet10year-textbooks/sources');
  const manifestPath = path.join(sourceRoot, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const catalog = manifest.catalogs.find(item => item.book === '10p');
  const record = manifest.pdfs.find(item => item.book === catalog.sourcePdf);
  const pdfRoot = path.resolve(repo, manifest.pdfRoot);
  const pdf = path.join(pdfRoot, record.file);
  if (digest(pdf) !== record.sha256) throw new Error('Authoritative PDF SHA mismatch');
  const toc = path.resolve(path.dirname(sourceRoot), catalog.tocSource);
  const prior = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d046-10p-source124-127-author/source/10p/pages/0127');
  const originals = [
    manifestPath, pdf, toc,
    path.join(repo, 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json'),
    path.join(prior, 'page.md'), path.join(prior, 'page.json'),
    path.join(skill, 'SKILL.md'),
    path.join(repo, '.agents/skills/ld-s10y-image/SKILL.md'),
    path.join(skill, 'profiles/soviet-cn.json'),
    ...['p2c.py', 'layout.py', 'blocks.py', 'normalize.py', 'mathcheck.py',
      'vectorize.py', 'svg_raster.js', 'katex_check.js', 'assemble.py'].map(name => path.join(skill, 'tools', name)),
  ];
  const rows = originals.map((original, index) => {
    const target = path.join(own, 'history/inputs', String(index).padStart(2, '0') + '-' + path.basename(original));
    immutable(target, fs.readFileSync(original));
    return { original, snapshot: relative(target), sha256: digest(target), bytes: fs.statSync(target).size };
  });
  for (const dir of ['source', 'work', 'receipts', 'history', 'work/native-tmp']) {
    fs.mkdirSync(path.join(own, dir), { recursive: true });
  }
  json(path.join(own, 'receipts/inputs.json'), {
    schema: 'source-author-inputs@1', book: '10p', pages: [128, 129, 130, 131],
    catalog, authoritative_pdf_sha256: record.sha256, files: rows,
    scope: 'offline author only; no assembly, approval, canonical, git, backend, app, DB, env or model writes',
    preceding_context: 'Only page127 md/json; unit46 still open; (4.4) complete; prior126/127 HOLD excluded',
  });
  console.log('Frozen authoritative inputs; no image opened.');
} else if (['prepare', 'finalize', 'vectorize'].includes(operation)) {
  const page = Number(value);
  if (![128, 129, 130, 131].includes(page)) throw new Error('Outside owned page scope');
  if (!['initial', 'repair1'].includes(attempt) || (operation === 'prepare' && attempt !== 'initial')) {
    throw new Error('Unsupported attempt');
  }
  verifyInputs();
  const label = `${operation}-${page}-${attempt}`;
  const receipt = path.join(own, 'receipts', label + '.json');
  const reserve = path.join(own, 'receipts', label + '.invocation.json');
  const pageName = String(page).padStart(4, '0');
  const workPage = path.join(own, 'work/10p/pages', pageName);
  const sourcePage = path.join(own, 'source/10p/pages', pageName);
  if (operation === 'prepare' && fs.existsSync(workPage)) throw new Error('Page already prepared');
  if (operation === 'finalize') {
    const observation = path.join(own, 'history', `observed-p${pageName}.json`);
    if (!fs.existsSync(observation)) throw new Error('Missing pixel-first observation');
    fs.chmodSync(observation, 0o444);
    immutable(path.join(own, 'history', label, 'page.authored.md'), fs.readFileSync(path.join(sourcePage, 'page.md')));
  }
  const args = ['-B', p2c, operation, '--book', '10p', '--page', String(page),
    '--root', path.join(own, 'source'), '--work', path.join(own, 'work')];
  const started = new Date().toISOString();
  json(reserve, { executable: python, args, cwd: repo, started, attempt,
    temp_root: path.join(own, 'work/native-tmp'), python_bytecode: false });
  const result = spawnSync(python, args, {
    cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, TMPDIR: path.join(own, 'work/native-tmp'), PYTHONDONTWRITEBYTECODE: '1' },
  });
  immutable(path.join(own, 'receipts', label + '.stdout.txt'), result.stdout ?? '');
  immutable(path.join(own, 'receipts', label + '.stderr.txt'), result.stderr ?? '');
  const outputs = operation === 'prepare'
    ? snapshot(workPage, path.join(own, 'history', label, 'work'))
    : operation === 'finalize'
      ? [...snapshot(sourcePage, path.join(own, 'history', label, 'source')),
        ...snapshot(path.join(workPage, 'figures'), path.join(own, 'history', label, 'figures'))]
      : snapshot(path.join(workPage, 'figures'), path.join(own, 'history', label, 'figures'));
  verifyInputs();
  json(receipt, { label, started, ended: new Date().toISOString(), exit_code: result.status,
    signal: result.signal, error: result.error?.message ?? null, outputs,
    stdout_sha256: digest(path.join(own, 'receipts', label + '.stdout.txt')),
    stderr_sha256: digest(path.join(own, 'receipts', label + '.stderr.txt')) });
  console.log(`${label}: exit ${result.status}; receipt ${relative(receipt)}`);
  if (operation !== 'prepare') process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  process.exitCode = result.status ?? 1;
} else if (operation === 'seal-observations') {
  verifyInputs();
  const draft = JSON.parse(fs.readFileSync(path.join(own, 'observations.draft.json'), 'utf8'));
  const image_opens = draft.image_opens.map(item => ({
    ...item, sha256: digest(path.join(own, item.path)),
  }));
  if (image_opens.length > 8) throw new Error('Image budget exceeded');
  const figure_candidates = draft.figure_candidates.map(item => {
    const png = path.join(own, item.png);
    const data = fs.readFileSync(png);
    if (data.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('Not a PNG');
    const size = [data.readUInt32BE(16), data.readUInt32BE(20)];
    if (JSON.stringify(size) !== JSON.stringify(item.crop_size)) throw new Error(`Crop dimensions drift: ${item.id}`);
    return { ...item, png_sha256: digest(png), svg_sha256: digest(path.join(own, item.svg)) };
  });
  const page_observations = [128, 129, 130, 131].map(page => {
    const file = path.join(own, 'history', `observed-p${String(page).padStart(4, '0')}.json`);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return { ...data, evidence: relative(file), evidence_sha256: digest(file),
      image_sha256: digest(path.join(own, data.image)) };
  });
  json(path.join(own, 'observations.json'), { ...draft, image_opens, figure_candidates, page_observations,
    process_notes_sha256: digest(path.join(own, draft.process_notes)) });
  console.log('Sealed hash-bound pixel, crop and boundary observations.');
} else if (operation === 'freeze') {
  verifyInputs();
  const observations = JSON.parse(fs.readFileSync(path.join(own, 'observations.json'), 'utf8'));
  for (const page of [128, 129, 130, 131]) {
    for (const op of ['prepare', 'finalize', 'vectorize']) {
      const receipt = JSON.parse(fs.readFileSync(path.join(own, 'receipts', `${op}-${page}-initial.json`), 'utf8'));
      if (receipt.exit_code !== 0) throw new Error(`Native command failed: ${op}/${page}`);
      if (fs.existsSync(path.join(own, 'receipts', `${op}-${page}-repair1.invocation.json`))) {
        throw new Error('Unexpected rerun in this freeze');
      }
      for (const output of receipt.outputs) {
        if (digest(path.join(own, output.path)) !== output.sha256) throw new Error('Native history drift');
      }
    }
    const name = String(page).padStart(4, '0');
    for (const file of files(path.join(own, 'source/10p/pages', name))) {
      const original = path.join(own, `history/finalize-${page}-initial/source`, path.basename(file));
      if (digest(file) !== digest(original)) throw new Error(`Native source output changed: ${file}`);
    }
  }
  const rows = files(own).map(file => ({
    path: relative(file), sha256: digest(file), bytes: fs.statSync(file).size,
  }));
  const pages = [128, 129, 130, 131].map(page => {
    const dir = path.join(own, 'source/10p/pages', String(page).padStart(4, '0'));
    const audit = JSON.parse(fs.readFileSync(path.join(dir, 'audit.json'), 'utf8'));
    const data = JSON.parse(fs.readFileSync(path.join(dir, 'page.json'), 'utf8'));
    const observed = observations.page_observations.find(item => item.page === page);
    if (audit.errors.length || audit.lines_printed !== audit.lines_md
      || observed.visual_text_rows !== audit.lines_md) throw new Error(`Native/visual mismatch: ${page}`);
    return { page, printed_page: data.meta.printed_page, blocks: data.blocks.length,
      lines_printed: audit.lines_printed, lines_md: audit.lines_md, native_errors: audit.errors,
      figures: audit.figures.map(figure => figure.id),
      page_md_sha256: digest(path.join(dir, 'page.md')),
      page_json_sha256: digest(path.join(dir, 'page.json')),
      audit_sha256: digest(path.join(dir, 'audit.json')) };
  });
  const freeze = path.join(own, 'author-freeze.json');
  json(freeze, { schema: 'source-author-freeze@1', ticket: 'STEMROBIN-181',
    status: observations.status, independent_approval: false, canonical_changes: false,
    own, pages, observations_sha256: digest(path.join(own, 'observations.json')),
    image_opens: observations.image_opens.length, max_image_opens: 8,
    newly_closed_tasks: observations.newly_closed_tasks,
    unopened_candidates: observations.unopened_candidates,
    newly_closed_objects: observations.newly_closed_objects,
    open_closure: observations.open_closure, inventory: rows });
  immutable(path.join(own, 'author-freeze.sha256'), `${digest(freeze)}  author-freeze.json\n`);
  for (const file of files(own)) fs.chmodSync(file, 0o444);
  for (const row of rows) {
    if (digest(path.join(own, row.path)) !== row.sha256) throw new Error(`Freeze drift: ${row.path}`);
  }
  console.log(JSON.stringify({ author_freeze: freeze, sha256: digest(freeze), pages,
    files: rows.length, image_opens: observations.image_opens.length }, null, 2));
} else {
  throw new Error('Expected init, prepare, finalize, vectorize or freeze');
}
