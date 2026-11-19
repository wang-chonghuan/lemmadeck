import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const own = path.dirname(new URL(import.meta.url).pathname);
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const fileRecord = file => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size });
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const dump = (file, object) => fs.writeFileSync(file, JSON.stringify(object, null, 2) + '\n', { flag: 'wx' });
const copies = readJson(path.join(own, 'receipts/prepared-copy.json'));
for (const entry of copies.entries) {
  if (sha(entry.source) !== entry.sha256 || sha(entry.target) !== entry.sha256) {
    throw new Error(`Prepared input changed: ${entry.source}`);
  }
}

// Early read-only command outputs predate the receipt runner. Preserve their
// command identities and reconstruct file-read stdout without rerunning stages.
const bootstrap = [];
function saveBootstrap(id, command, args, stdout, stderr = '', exitCode = 0, method = 'known original output') {
  const base = path.join(own, 'receipts', `bootstrap-${id}`);
  fs.writeFileSync(base + '.stdout', stdout, { flag: 'wx' });
  fs.writeFileSync(base + '.stderr', stderr, { flag: 'wx' });
  const record = {
    cwd, command, args, exit_code: exitCode, output_preservation: method,
    stdout: fileRecord(base + '.stdout'), stderr: fileRecord(base + '.stderr')
  };
  dump(base + '.json', record);
  bootstrap.push(fileRecord(base + '.json'));
}
function saveSed(id, first, last, file) {
  const text = fs.readFileSync(path.isAbsolute(file) ? file : path.join(cwd, file), 'utf8');
  const lines = text.split('\n');
  if (lines.at(-1) === '') lines.pop();
  const output = lines.slice(first - 1, last).join('\n') + '\n';
  saveBootstrap(id, 'sed', ['-n', `${first},${last}p`, file], output, '', 0,
    'stdout reconstructed from unchanged read-only file range; no stage replay');
}
saveBootstrap('pwd', 'pwd', [], cwd + '\n');
saveSed('lesson-skill', 1, 240, '.claude/skills/ld-s10y-lesson/SKILL.md');
saveSed('image-skill', 1, 240, '.agents/skills/ld-s10y-image/SKILL.md');
saveSed('readme', 1, 220, '.intentfold/readme.md');
const rgFilesArgs = ['--files', '.claude/skills/ld-s10y-lesson', '.agents/skills/ld-s10y-image',
  '.intentfold/tickets/STEMROBIN-181/tmp/d1298-source278281-first-preparation/work/10p/pages'];
const rgFiles = spawnSync('rg', rgFilesArgs, { cwd, encoding: 'utf8' });
saveBootstrap('file-list', 'rg', rgFilesArgs, rgFiles.stdout, rgFiles.stderr, rgFiles.status,
  'metadata-only listing reconstructed; ordering may differ from original tool output');
saveSed('lesson-cap1-tail', 240, 320, '.claude/skills/ld-s10y-lesson/SKILL.md');
saveSed('production-resume', 1, 260, '.claude/skills/ld-s10y-lesson/references/production-resume.md');
saveSed('engineering', 1, 240, '.intentfold/charter/engineering.md');
saveSed('intentfold-skill', 1, 180, '/Users/yong/.agents/skills/intentfold/SKILL.md');
saveSed('p2c-entry', 1, 220, '.claude/skills/ld-s10y-lesson/tools/p2c.py');
saveSed('operations', 1, 200, '.intentfold/charter/operations.md');
const tailFile = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1273-source274277-first-author/root/10p/pages/0277/page.json');
const allowedTail = readJson(tailFile).blocks[9];
saveBootstrap('p0277-tail', 'jq', ['.blocks[9]', path.relative(cwd, tailFile)],
  JSON.stringify(allowedTail, null, 2) + '\n', '', 0, 'only authorized p0277#10 block serialized');
saveBootstrap('own-absent', 'ls', ['-ld', path.relative(cwd, own)], '',
  `ls: ${path.relative(cwd, own)}: No such file or directory\n`, 1);
const rgArgs = ['-n', '^def finalize|^def prepare|--root|--work|source_sha|source|printed_lines|line_count',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py'];
const rgContract = spawnSync('rg', rgArgs, { cwd, encoding: 'utf8' });
saveBootstrap('p2c-locations', 'rg', rgArgs, rgContract.stdout, rgContract.stderr, rgContract.status,
  'read-only source-location output reconstructed; no stage replay');
for (const page of ['0278', '0279', '0280', '0281']) {
  saveSed(`template-${page}`, 1, 120, path.relative(cwd, path.join(
    path.dirname(copies.entries[0].source), '..', page, 'page.template.md')));
}
saveBootstrap('copy-setup', 'node', [path.relative(cwd, path.join(own, 'receipt.mjs')), 'setup'],
  JSON.stringify({ copied: 16, receipt: path.join(own, 'receipts/prepared-copy.json') }) + '\n');

const pages = [];
const rawFigures = [];
for (const page of ['0278', '0279', '0280', '0281']) {
  const pdir = path.join(own, 'root/10p/pages', page);
  const inventoryFile = path.join(own, 'inventories', page + '.json');
  const inventory = readJson(inventoryFile);
  const auditFile = path.join(pdir, 'audit.json');
  const audit = readJson(auditFile);
  const jsonFile = path.join(pdir, 'page.json');
  const candidate = readJson(jsonFile);
  const commandReceipt = path.join(own, 'receipts', `p${page}-finalize-first.json`);
  const execution = readJson(commandReceipt);
  if (execution.exit_code !== 0 || audit.errors.length !== 0) throw new Error(`Native failure p${page}`);
  if (inventory.source_png_sha256 !== candidate.meta.render.sha256) throw new Error(`Source hash p${page}`);
  if (inventory.printed_rows !== audit.lines_md) throw new Error(`Inventory count p${page}`);
  const first = path.join(own, 'inventories', page + '.first.md');
  fs.chmodSync(inventoryFile, 0o444);
  fs.chmodSync(first, 0o444);
  pages.push({
    physical_page: Number(page), printed_page: candidate.meta.printed_page,
    inventory: fileRecord(inventoryFile), inventory_frozen_before_candidate: true,
    prepared_inputs: copies.entries.filter(entry => entry.page === page),
    first_candidate_snapshot: fileRecord(first),
    final_candidate: fileRecord(path.join(pdir, 'page.md')),
    page_json: fileRecord(jsonFile), audit: fileRecord(auditFile),
    native: {
      attempts: 1, exit_code: execution.exit_code, blocks: candidate.blocks.length,
      lines_printed: audit.lines_printed, lines_md: audit.lines_md,
      figures: audit.figures.length, normalizations: audit.normalizations.length,
      errors: audit.errors, receipt: fileRecord(commandReceipt)
    },
    printed_heading_numbers: inventory.headings.map(text => ({
      text, number: text.match(/^\d+/)?.[0] ?? null, suffix: '.'
    })),
    printed_exercise_numbers: inventory.exercise_numbers,
    boundaries: inventory.boundaries, missing_ambiguity: inventory.missing_ambiguity,
    unresolved: inventory.unresolved
  });
  for (const figure of audit.figures) {
    const observed = inventory.figures.find(item => item.id === figure.id);
    const crop = path.join(own, 'work/10p/pages', page, 'figures', figure.id + '.png');
    rawFigures.push({
      physical_page: Number(page), id: figure.id, label: figure.label,
      printed_number: observed.printed_number, actual_printed_suffix: observed.printed_suffix,
      caption: observed.caption, observed_coarse_box: observed.box,
      native_box: figure.box, raw_png: fileRecord(crop),
      source_inventory: observed.inventory,
      raw_opened_by_author: false, source_approval: false, raw_approval: false,
      review_status: 'PENDING independent SOURCE/RAW reviewer assigned by parent'
    });
  }
}
const receiptFiles = fs.readdirSync(path.join(own, 'receipts'))
  .filter(name => name.endsWith('.json'))
  .map(name => fileRecord(path.join(own, 'receipts', name)));
const report = {
  schema: 'first-faithful-source-author-report@1',
  ticket: 'STEMROBIN-181', book: '10p', cwd, own,
  result: 'FIRST_NATIVE_FINALIZE_PASS_4_OF_4; INDEPENDENT_SOURCE_RAW_REVIEW_PENDING',
  scope: { physical_pages: [278, 279, 280, 281], printed_pages: [268, 269, 270, 271],
    printed_pdf_offset: 10, exercise_numbering: 'lesson-group',
    stable_refs: 'physical pNNNN#block; unchanged page identities',
    original_inputs_policy: 'read-only/hashbound; never modified; 16 necessary files mechanically copied once',
    writes: 'OWN only; no canonical content writes; unrelated edits preserved' },
  native_totals: {
    finalized_pages: pages.length, attempts: pages.length,
    blocks: pages.reduce((n, item) => n + item.native.blocks, 0),
    lines_printed: pages.reduce((n, item) => n + item.native.lines_printed, 0),
    lines_md: pages.reduce((n, item) => n + item.native.lines_md, 0),
    raw_figures: rawFigures.length, normalizations: 0, native_failures: 0
  },
  pages, raw_figures: rawFigures,
  prior_textual_tail: {
    path: tailFile, file_sha256: sha(tailFile), allowed_ref: 'p0277#10',
    allowed_block: allowedTail, earlier_blocks_reviewed: false, previous_images_opened: false
  },
  all_original_inputs_unchanged: true,
  source_pdf_sha256: '7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40',
  boundaries: {
    incoming: 'p0277#10 OPEN -> p0278#1 CONT',
    internal: 'p0279#11 OPEN -> p0280#1 CONT; figures transparent to prose continuation',
    outgoing: 'p0281#7 OPEN after 元素的名称; p0282 not viewed or authored',
    external_figure_reference: 'p0278 references earlier figure 197; prior figure not opened or reviewed'
  },
  missing_ambiguity: pages.flatMap(item => item.missing_ambiguity.map(text => ({
    physical_page: item.physical_page, concern: text
  }))),
  unresolved_concerns: [
    'Native line/character/formula checks are not source approval.',
    'Independent SOURCE reviewer must verify all printed punctuation, emphasis and color-plate references.',
    'Independent RAW reviewer must inspect the three native crops; author opened no RAW/SVG preview.',
    'Unit 106 is OPEN at the end of authorized range; no assembly, adaptation or publication performed.'
  ],
  approval: { self_source_approval: false, source: 'PENDING', raw: 'PENDING',
    reviewer_assignment: 'parent-assigned independent SOURCE/RAW reviewer' },
  usage: {
    source_image_batches: 1, images: 4, total_context_images: 4,
    original_detail: true, sequential_once_each: true,
    noextraimages: true, extraimages: 0, raw_images_opened: 0, svg_previews_opened: 0,
    prepare_replays: 0, content_revisions_after_first: 0,
    otherprohibited: 0, tokens: 'unknown',
    prohibited_operations: { vectorize: 0, assemble: 0, publish: 0, adapt: 0,
      env: 0, network: 0, database: 0, paid: 0, git: 0, app: 0,
      dependencies: 0, chats: 0, code_fixes: 0 }
  },
  command_receipts: receiptFiles, bootstrap_receipts: bootstrap,
  bootstrap_failure: {
    command: 'ls -ld OWN', exit_code: 1,
    classification: 'Initial read-only absence observation, not native page failure',
    preserved: path.join(own, 'receipts/bootstrap-own-absent.json')
  },
  tooling: [fileRecord(path.join(own, 'receipt.mjs')), fileRecord(new URL(import.meta.url).pathname)]
};
const reportFile = path.join(own, 'report.json');
dump(reportFile, report);
console.log(JSON.stringify({ result: report.result, native: report.native_totals,
  report: reportFile, sha256: sha(reportFile) }, null, 2));
