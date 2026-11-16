import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const here = path.dirname(new URL(import.meta.url).pathname);
const output = path.join(path.dirname(here), 'source-9g-p64-p65-author-manifest.json');
const report = path.join(path.dirname(here), 'source-9g-p64-p65-author-report.md');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const record = file => {
  const bytes = fs.readFileSync(file);
  const result = { path: file, sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length };
  if (file.endsWith('.png')) {
    result.width = bytes.readUInt32BE(16);
    result.height = bytes.readUInt32BE(20);
  }
  return result;
};
const inventory = read(path.join(here, 'author-inventory.json'));
const sourceCrops = read(path.join(here, 'source-crops/manifest.json'));
const phases = ['before-author', 'before-finalize', 'after-finalize', 'current'];
const pages = ['0064', '0065'].map(page => {
  const dir = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages', page);
  const work = path.join(repo, '.tmp/ld-s10y-lesson/9-10g/pages', page);
  const structured = read(path.join(dir, 'page.json'));
  const audit = read(path.join(dir, 'audit.json'));
  const snapshots = Object.fromEntries(phases.map(phase => {
    const file = path.join(here, page, phase, 'manifest.json');
    return [phase, { ...record(file), snapshot: read(file) }];
  }));
  const beforeMd = snapshots['before-finalize'].snapshot.files.find(file => file.path === path.join(dir, 'page.md'));
  return {
    physical_page: Number(page), printed_page: structured.meta.printed_page,
    role: 'source-page author only; continuation of §17',
    source: structured.meta.source, render: structured.meta.render,
    section_binding: 'geo910-c1-s2-n17', section_boundary: 'UNSEEN_OPEN',
    first_prefigure_estimate: page === '0064' ? 26 : 25,
    estimate_is_expected_override: false,
    current_files: ['page.md', 'page.json', 'audit.json'].map(name => record(path.join(dir, name))),
    original_png: record(path.join(work, 'page.png')),
    original_grid_png: record(path.join(work, 'page.grid.png')),
    authored_pre_finalize_md: beforeMd,
    snapshots,
    finalize: { ...read(path.join(here, page, 'finalize-result.json')),
      result_file: record(path.join(here, page, 'finalize-result.json')),
      stdout_file: record(path.join(here, page, 'finalize.stdout.txt')),
      stderr_file: record(path.join(here, page, 'finalize.stderr.txt')) },
    current_bindings: structured.blocks.map((block, index) => ({
      source_ref: `p${page}#${index + 1}`, kind: block.kind, label: block.label,
      owner_exercise: block.owner_exercise, cont: block.cont, open: block.open,
      samerow: block.samerow, box: block.box, figure_id: block.id ?? null,
      printed_text_rows: block.lines.length,
    })),
    current_crops: audit.figures.map(figure => ({
      ...figure, ...record(path.join(work, 'figures', `${figure.id}.png`)),
      source_png: record(path.join(work, 'page.png')),
      snapshot_copy: snapshots['after-finalize'].snapshot.files.find(file =>
        file.path === path.join(work, 'figures', `${figure.id}.png`))?.evidence_copy,
      independent_review: 'not performed', durable_promotion: false,
    })),
    tool_audit: audit,
    independent_source_review: 'not performed; no independent PASS claimed',
  };
});
const orderedImages = [
  { path: pages[0].original_grid_png.path, purpose: '0064 original grid, separate once' },
  { path: pages[1].original_grid_png.path, purpose: '0065 original grid, separate once' },
  ...sourceCrops.map(crop => ({ path: crop.path, purpose: 'actual new original-PNG text crop', source_crop: crop })),
  ...pages.flatMap(page => page.current_crops.map(crop => ({
    path: crop.path, purpose: 'first official finalize current PNG crop', figure: crop.id,
  }))),
];
const imageLedger = orderedImages.map((item, index) => ({
  ordinal: index + 1, batch: 1, detail: 'original', loads: 1, reopen: false,
  ...item, ...record(item.path),
}));
const manifest = {
  schema: 'source-page-author/manifest@1', ticket: 'STEMROBIN-184',
  generated_at: new Date().toISOString(), cwd: repo,
  status: 'AUTHOR_ONLY_FIRST_FINALIZE_RECORDED',
  report: record(report), author_inventory: record(path.join(here, 'author-inventory.json')),
  evidence_runner: record(path.join(here, 'evidence.mjs')),
  manifest_builder: record(new URL(import.meta.url).pathname),
  evidence_root: here, ownership: ['source physical 0064', 'source physical 0065'],
  image_budget: { batch_max: 8, context_max: 24, images_loaded: 8, originals_loaded: 2,
    actual_new_crops_loaded: 6, reopens: 0, stopped_at_batch_budget: true },
  image_ledger: imageLedger, pages, author_observations: inventory,
  excluded_actions: ['prepare or reprepare', 'count override', 'count exclusion', 'fake breaks',
    'finalize retry', 'source correction after finalize', 'tool edits', 'other page pixels',
    'prior-page edits', 'book assembly', 'SVG promotion', 'lesson or edition edits',
    'answers or specifications', 'independent review', 'freeze', 'IntentFold capability',
    'backend', 'Git operations', 'DB', 'production', 'publish', 'merge', 'close', 'deploy',
    'other chat', 'STEMROBIN-178', 'STEMROBIN-185', 'grades 1/2', 'history edits'],
};
fs.writeFileSync(output, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ manifest: record(output), image_count: imageLedger.length,
  pages: pages.map(page => ({ page: page.physical_page, files: page.current_files,
    crops: page.current_crops.map(crop => ({ id: crop.id, sha256: crop.sha256 })) })) }, null, 2));
