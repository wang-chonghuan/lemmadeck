import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const evidence = path.dirname(fileURLToPath(import.meta.url));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  if (!fs.existsSync(file)) return { path: file, state: 'absent' };
  const bytes = fs.readFileSync(file);
  return { path: file, state: 'present', size: bytes.length, sha256: hash(bytes) };
};
const load = relative => JSON.parse(fs.readFileSync(path.join(evidence, relative), 'utf8'));
const write = (name, value) => fs.writeFileSync(path.join(evidence, name),
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
if (fs.existsSync(path.join(evidence, 'full-author-manifest.json'))) {
  throw new Error('Package frozen');
}
const facts = load('author-observations.json');
const phaseNames = ['targetbefore', 'before-finalize-0054', 'after-finalize-0054',
  'before-finalize-0055', 'after-finalize-0055', 'targetafter'];
const phases = phaseNames.map(phase => ({
  phase, metadata: bind(path.join(evidence, phase, 'metadata.json')),
  targets: load(`${phase}/metadata.json`).targets,
}));
const commands = fs.readdirSync(path.join(evidence, 'commands')).sort().map(name => {
  const base = `commands/${name}`;
  return {
    name, start: load(`${base}/start.json`), result: load(`${base}/result.json`),
    records: ['start.json', 'result-before-call.json', 'result.json', 'stdout.bin', 'stderr.bin']
      .map(n => bind(path.join(evidence, base, n))),
  };
});
const variants = facts.pages.map(page => {
  const n = String(page.physicalPage).padStart(4, '0');
  const pageJson = load(`targetafter/durable/${n}/page.json`);
  let row = 0;
  const blocks = pageJson.blocks.map((block, index) => {
    const observed = page.blocks.find(b => b.ordinal === index + 1);
    return {
      ...block, ordinal: index + 1, sourceObservation: observed,
      rows: block.lines.map(text => {
        row += 1;
        const chars = Array.from(text);
        return {
          physicalRow: row, blockRow: block.lines.indexOf(text) + 1, text,
          utf8Sha256: hash(Buffer.from(text, 'utf8')),
          unicodeGlyphsInOrder: chars.map((glyph, position) => ({
            position, glyph, codepoint: `U+${glyph.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`,
          })),
          mathSpans: Array.from(text.matchAll(/\$([^$]*)\$/g)).map(m => ({
            literal: m[0], content: m[1], utf16Offset: m.index,
            latexCommands: Array.from(m[1].matchAll(/\\[A-Za-z]+/g)).map(c => c[0]),
          })),
          encodedEmphasis: { markdownBold: text.includes('**'), markdownItalic: false,
            boldMath: text.includes('\\boldsymbol{Z}'), observed: page.glyphAndEmphasisFacts.sourceEmphasis },
        };
      }),
    };
  });
  const before = path.join(evidence, `before-finalize-${n}/SOURCE-MD/${n}.md`);
  const after = path.join(evidence, `after-finalize-${n}/SOURCE-MD/${n}.md`);
  return {
    ...page, completeSerializedBlocks: blocks,
    completeFrontmatter: pageJson.meta,
    sourceMdBeforeFirstFinalize: bind(before), sourceMdAfterFirstFinalize: bind(after),
    sourceMdFinal: bind(path.join(evidence, `targetafter/SOURCE-MD/${n}.md`)),
    beforeAfterBytesEqual: hash(fs.readFileSync(before)) === hash(fs.readFileSync(after)),
    audit: load(`targetafter/durable/${n}/audit.json`),
    allTargetVariants: phases.map(p => ({
      phase: p.phase, metadata: p.metadata, target: p.targets.find(t => t.page === n),
    })),
  };
});
write('author-inventory.json', {
  schema: 'original-author-complete-rows-glyphs-records@1',
  generatedAt: new Date().toISOString(), scope: facts.scope,
  pages: variants, pipelineOutcome: facts.pipelineOutcome,
  evidenceSerializationOnly: true,
  notPipelineValidationOrIndependentReview: true,
  completeCommands: commands, completePhases: phases,
});
const summary = {
  generatedAt: new Date().toISOString(),
  phases: phases.map(p => ({ phase: p.phase, ...p.metadata })),
  pages: variants.map(p => ({
    page: p.physicalPage, originalSourceMd: p.sourceMdBeforeFirstFinalize,
    afterSourceMd: p.sourceMdAfterFirstFinalize,
    durable: ['page.md', 'page.json', 'audit.json'].map(name =>
      bind(path.join(evidence, 'targetafter/durable', String(p.physicalPage).padStart(4, '0'), name))),
  })),
  commands: commands.map(c => ({ name: c.name, exit: c.result.exit,
    record: c.records.find(r => r.path.endsWith('/result.json')),
    stdout: c.result.stdout, stderr: c.result.stderr })),
  authorInventory: bind(path.join(evidence, 'author-inventory.json')),
  initialBindings: bind(path.join(evidence, 'initial-bindings.json')),
  endBindings: bind(path.join(evidence, 'end-bindings.json')),
  firstFailure: bind(path.join(evidence, 'firstfailure.json')),
  figures: ['fig-32.png', 'fig-33.png'].map(name =>
    bind(path.join(evidence, 'targetafter/work/0055/figures', name))),
};
write('package-record-bindings.json', summary);
console.log(JSON.stringify(summary, null, 2));
