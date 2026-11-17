import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const own = path.dirname(fileURLToPath(import.meta.url));
const ticketTmp = path.dirname(own);
const repo = path.resolve(ticketTmp, '../../../..');
const artifacts = 'ssot-resources/soviet10year-textbooks/artifacts';
const lesson = 'phy10-c1-s5-n39';
const previous = 'phy10-c1-s5-n38';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const write = (target, value) => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const bytes = JSON.stringify(value, null, 2) + '\n';
  if (fs.existsSync(target)) {
    if (fs.readFileSync(target, 'utf8') !== bytes) throw new Error(`Existing file differs: ${target}`);
    return;
  }
  fs.writeFileSync(target, bytes, { flag: 'wx' });
};
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) {
    if (!fs.readFileSync(from).equals(fs.readFileSync(to))) throw new Error(`Copy differs: ${to}`);
    return;
  }
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
};
const provenance = [];

for (const [language, root] of [['en', 'en/display-root'], ['zh', 'zh/root']]) {
  const source = path.join(ticketTmp, 'd046-n39-native', root, '10p');
  const projection = path.join(own, language, 'repo');
  const book = path.join(projection, artifacts, '10p');
  const edition = path.join(book, 'editions/modern-us-neutral');
  const inputLesson = path.join(source, 'editions/modern-us-neutral/lessons', lesson);
  const outputLesson = path.join(edition, 'lessons', lesson);
  write(path.join(book, 'book.json'), {
    id: '10p',
    lessons: [{ id: lesson }],
  });
  for (const name of ['lesson.json', 'exercises.json', 'figures.json']) {
    const from = path.join(inputLesson, name);
    const to = path.join(outputLesson, name);
    copy(from, to);
    provenance.push({ language, kind: 'approved-source', source: from, projection: to,
      sha256: hash(fs.readFileSync(from)) });
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(inputLesson, 'figures.json'), 'utf8'));
  for (const figure of manifest.figures) {
    for (const kind of ['svg', 'png', 'artwork']) {
      if (!figure[kind]) continue;
      const relative = figure[kind];
      if (path.isAbsolute(relative) || relative.split('/').includes('..')) {
        throw new Error('Unsafe asset path');
      }
      const from = path.join(source, 'editions/modern-us-neutral', relative);
      const to = path.join(edition, relative);
      copy(from, to);
      provenance.push({ language, kind: 'approved-final-figure', figure_id: figure.id,
        source: from, projection: to, sha256: hash(fs.readFileSync(from)) });
    }
  }
  const scratch = path.join(projection, '.tmp/choice');
  fs.mkdirSync(scratch, { recursive: true });
  const args = [path.join(repo, '.agents/skills/ld-s10y-choice/scripts/prepare.py'),
    'inspect', '--repo', projection, '--book', '10p', '--lesson', lesson];
  const result = spawnSync('python3', args, {
    encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  fs.writeFileSync(path.join(scratch, 'whitelist-inventory.complete.json'), result.stdout, { flag: 'wx' });
  write(path.join(own, language, 'inspect-result-complete.json'), {
    command: ['python3', ...args], exit_code: result.status,
    stdout: result.stdout, stderr: result.stderr,
  });
  if (result.status !== 0) throw new Error(result.stderr);
  const contextSource = path.join(ticketTmp, 'd046-n38-native', root,
    '10p/editions/modern-us-neutral/lessons', previous, 'lesson.json');
  const context = JSON.parse(fs.readFileSync(contextSource, 'utf8'));
  write(path.join(own, language, 'n38-definition-candidates.json'), {
    source: contextSource, source_sha256: hash(fs.readFileSync(contextSource)),
    lesson: previous,
    concept_candidates: context.prose.flatMap((block, index) =>
      block.kind === 'p' && block.text ? [{ block: index, text: block.text }] : []),
  });
}
write(path.join(own, 'projection-provenance.json'), {
  identity_note: 'Local synthetic book.json contains only the approved n39 lesson identity; not a product book index.',
  source_files_and_final_assets: provenance,
  omitted: ['native-lesson.json', 'adaptation.audit.json', 'figure specs', 'figure reviews',
    'render reports', 'answers', 'choices', 'interaction configurations', 'ticket histories'],
});
