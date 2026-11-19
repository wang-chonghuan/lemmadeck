import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const scratch = path.join(repo, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/source259-266-author');
const root = 'ssot-resources/soviet10year-textbooks/artifacts';
const work = '.tmp/ld-s10y-lesson';
const books = 'ssot-resources/soviet10year-textbooks/sources';
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const tool = '.claude/skills/ld-s10y-lesson/tools/p2c.py';
const layout = '.claude/skills/ld-s10y-lesson/tools/layout.py';
const expectedRows = [18, 19, 20, 24, 22, 25, 26, 25];
const pages = Array.from({ length: 8 }, (_, i) => 259 + i);
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const save = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
const frozenDir = path.join(scratch, 'original-authored');
const receiptsDir = path.join(scratch, 'first-finalize');
fs.mkdirSync(frozenDir, { recursive: true });
fs.mkdirSync(receiptsDir, { recursive: true });

const freeze = {
  schema: 'STEMROBIN-182/source-author-freeze@1',
  scope: '7a physical 259-266, printed 253-260',
  frozen_at: new Date().toISOString(),
  repository: repo,
  branch: 'codex/STEMROBIN-182-textbooks',
  head: 'e16207d939526da0ebb2cfc528f084f0c3791afb',
  role: 'source AUTHOR; not independent source review',
  image_loads: { batches: 1, total: 8, reopens: 0, crops_opened: 0 },
  parser_verified: {
    command: `${python} ${tool} finalize --help`,
    flags: ['--book', '--page', '--root', '--books', '--work', '--series', '--pdf'],
    books_root: books,
  },
  tools: Object.fromEntries([tool, layout].map(file => [file, sha(path.join(repo, file))])),
  pages: [],
};

// Freeze every author input before the first page is finalized.
for (const [index, page] of pages.entries()) {
  const id = String(page).padStart(4, '0');
  const source = path.join(repo, root, '7a/pages', id, 'page.md');
  const frozen = path.join(frozenDir, `${id}.page.md`);
  fs.copyFileSync(source, frozen, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(frozen, 0o444);
  freeze.pages.push({
    page,
    printed_page: page - 6,
    author_observed_rows_including_foot: expectedRows[index],
    source,
    original_authored: frozen,
    original_sha256: sha(frozen),
    prepared_inputs: Object.fromEntries(
      ['page.png', 'page.grid.png', 'page.template.md'].map(name => {
        const file = path.join(repo, work, '7a/pages', id, name);
        return [name, { path: file, sha256: sha(file) }];
      }),
    ),
  });
}
save(path.join(scratch, 'freeze.json'), freeze);
fs.chmodSync(path.join(scratch, 'freeze.json'), 0o444);

const report = {
  schema: 'STEMROBIN-182/source-author-report@1',
  role: freeze.role,
  scope: freeze.scope,
  image_loads: freeze.image_loads,
  freeze: { path: path.join(scratch, 'freeze.json'), sha256: sha(path.join(scratch, 'freeze.json')) },
  pages: [],
};

for (const input of freeze.pages) {
  const id = String(input.page).padStart(4, '0');
  const dir = path.join(receiptsDir, id);
  fs.mkdirSync(dir);
  const args = [tool, 'finalize', '--book', '7a', '--page', String(input.page),
    '--root', root, '--work', work, '--books', books];
  const started = new Date().toISOString();
  const layoutBefore = sha(path.join(repo, layout));
  save(path.join(dir, 'start.json'), { started, cwd: repo, executable: python, args, layout_sha256: layoutBefore });
  const result = spawnSync(path.join(repo, python), args, { cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  fs.writeFileSync(path.join(dir, 'stdout.txt'), result.stdout ?? '', { flag: 'wx' });
  fs.writeFileSync(path.join(dir, 'stderr.txt'), result.stderr ?? '', { flag: 'wx' });
  const finished = new Date().toISOString();
  const outputDir = path.join(repo, root, '7a/pages', id);
  const outputs = {};
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const file = path.join(outputDir, name);
    if (!fs.existsSync(file)) continue;
    fs.copyFileSync(file, path.join(dir, name), fs.constants.COPYFILE_EXCL);
    outputs[name] = { path: file, sha256: sha(file), first_snapshot: path.join(dir, name) };
  }
  const audit = fs.existsSync(path.join(outputDir, 'audit.json'))
    ? JSON.parse(fs.readFileSync(path.join(outputDir, 'audit.json'), 'utf8')) : null;
  const parsed = fs.existsSync(path.join(outputDir, 'page.json'))
    ? JSON.parse(fs.readFileSync(path.join(outputDir, 'page.json'), 'utf8')) : null;
  const blocks = parsed?.blocks ?? [];
  const facts = {
    page: input.page,
    printed_page: input.printed_page,
    started,
    finished,
    executable: python,
    args,
    exit_code: result.status,
    signal: result.signal,
    execution_error: result.error?.message ?? null,
    layout_sha256_before: layoutBefore,
    layout_sha256_after: sha(path.join(repo, layout)),
    original_authored_sha256: input.original_sha256,
    outputs,
    stdout: { path: path.join(dir, 'stdout.txt'), sha256: sha(path.join(dir, 'stdout.txt')) },
    stderr: { path: path.join(dir, 'stderr.txt'), sha256: sha(path.join(dir, 'stderr.txt')) },
    author_observed_rows_including_foot: input.author_observed_rows_including_foot,
    lines_printed: audit?.lines_printed ?? null,
    lines_md: audit?.lines_md ?? null,
    block_count: blocks.length,
    figure_count: audit?.figures?.length ?? null,
    figure_ownership: blocks.filter(b => b.kind === 'fig'),
    exercise_starts: blocks.filter(b => b.kind === 'ex' && !b.cont).map(b => b.label),
    boundary_flags: blocks.flatMap((b, i) => b.open || b.cont
      ? [{ block: `p${id}#${i + 1}`, kind: b.kind, label: b.label, open: b.open, cont: b.cont, lines: b.lines }]
      : []),
    errors: audit?.errors ?? [],
    notes: parsed?.meta?.notes ?? [],
    state: result.status === 0 ? 'AUTHOR_FINALIZE_EXIT_0_NOT_INDEPENDENT_PASS' : 'AFFECTED_TECHNICAL_WORK_FIRST_FAILURE_PRESERVED',
  };
  save(path.join(dir, 'receipt.json'), facts);
  report.pages.push(facts);
  console.log(JSON.stringify({ page: input.page, exit: result.status, printed: facts.lines_printed, md: facts.lines_md, errors: facts.errors }));
}
report.totals = {
  pages: report.pages.length,
  finalize_calls: report.pages.length,
  retries: 0,
  lines_printed: report.pages.reduce((n, p) => n + (p.lines_printed ?? 0), 0),
  lines_md: report.pages.reduce((n, p) => n + (p.lines_md ?? 0), 0),
  figure_count: report.pages.reduce((n, p) => n + (p.figure_count ?? 0), 0),
  exercise_starts: report.pages.reduce((n, p) => n + p.exercise_starts.length, 0),
  exit_zero: report.pages.filter(p => p.exit_code === 0).length,
  affected_pages: report.pages.filter(p => p.exit_code !== 0).map(p => p.page),
};
save(path.join(scratch, 'author-report.json'), report);
console.log(JSON.stringify({ report: path.join(scratch, 'author-report.json'), sha256: sha(path.join(scratch, 'author-report.json')), totals: report.totals }));
