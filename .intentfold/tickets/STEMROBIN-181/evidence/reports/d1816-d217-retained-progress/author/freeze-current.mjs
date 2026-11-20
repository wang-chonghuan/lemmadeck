import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const author = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d217-10p-source74-76-author');
const root = path.join(repo, '.tmp/STEMROBIN-181/d1816-d217/root');
const work = path.join(repo, '.tmp/STEMROBIN-181/d1816-d217/source-work');
if (process.cwd() !== repo) throw new Error('Exact D217 cwd required');
const bind = file => {
  const data = fs.readFileSync(file);
  return { path: file, bytes: data.length, sha256: crypto.createHash('sha256').update(data).digest('hex') };
};
const load = name => JSON.parse(fs.readFileSync(path.join(author, name), 'utf8'));
const copy = (source, destination) => {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
  return bind(destination);
};
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const before = load('input-verification-before.json');
const providedAfter = before.provided.map(expected => {
  const actual = bind(expected.path);
  if (actual.bytes !== expected.bytes || actual.sha256 !== expected.sha256) {
    throw new Error(`Provided immutable input changed: ${expected.path}`);
  }
  return { ...actual, unchanged: true };
});
const contractAfter = before.contracts.map(expected => {
  const actual = bind(expected.path);
  if (actual.bytes !== expected.bytes || actual.sha256 !== expected.sha256) {
    throw new Error(`Shared contract changed: ${expected.path}`);
  }
  return { ...actual, unchanged: true };
});
const historical = load('prefinalize-freeze.json');
for (const page of historical.pages) {
  for (const key of ['draftMd', 'draftJson']) {
    const expected = page[key];
    if (!expected.path.startsWith(path.join(author, 'frozen/prefinalize/'))) {
      throw new Error('Historical draft binding points at an operative output');
    }
    const actual = bind(expected.path);
    if (actual.sha256 !== expected.sha256 || actual.bytes !== expected.bytes) {
      throw new Error('Historical frozen original snapshot changed');
    }
  }
}
const stages = load('native-summary.json');
const nativeFiles = walk(path.join(author, 'native'));
const subprocessReceipts = nativeFiles.filter(file => /subprocess-\d+\.receipt\.json$/.test(file));
const gitCalls = subprocessReceipts.map(file => ({ receipt: bind(file), ...JSON.parse(fs.readFileSync(file, 'utf8')) }))
  .filter(item => item.command[0] === 'git');
if (gitCalls.length !== 6) throw new Error('Unexpected actual implicit Git count');
if (subprocessReceipts.some(file => JSON.parse(fs.readFileSync(file, 'utf8')).cwd !== repo)) {
  throw new Error('Captured subprocess cwd is not the exact checkout');
}
const pages = [];
for (const number of [74, 75, 76]) {
  const padded = String(number).padStart(4, '0');
  const directory = path.join(root, '10p/pages', padded);
  const page = JSON.parse(fs.readFileSync(path.join(directory, 'page.json'), 'utf8'));
  const audit = JSON.parse(fs.readFileSync(path.join(directory, 'audit.json'), 'utf8'));
  const finalP = page.blocks.filter(block => block.kind === 'p').at(-1);
  pages.push({
    physicalPage: number, printedPage: page.meta.printed_page,
    actualPrintedRows: audit.lines_printed, authoredRows: audit.lines_md,
    blockCount: page.blocks.length, headingCount: page.blocks.filter(block => /^h[123]$/.test(block.kind)).length,
    taskCount: page.blocks.filter(block => block.kind === 'ex').length,
    exerciseGroupCount: page.blocks.filter(block => block.kind === 'exhead').length,
    firstProseCont: page.blocks.find(block => block.kind === 'p').cont,
    finalProseOpen: finalP.open,
    finalProseTail: finalP.lines.at(-1),
    nativeErrors: audit.errors, normalizations: audit.normalizations,
    katexWarningCount: audit.katex_warnings.length,
    artifacts: ['page.md', 'page.json', 'audit.json'].map(name => {
      const file = path.join(directory, name);
      return {
        current: bind(file),
        frozen: copy(file, path.join(author, 'frozen/current', padded, name)),
      };
    }),
  });
}
const figureArtifacts = [];
for (const name of ['fig-47.png', 'fig-47.svg']) {
  const file = path.join(work, '10p/pages/0076/figures', name);
  const retainedPageFile = path.join(root, '10p/pages/0076/figures', name);
  const retained = copy(file, retainedPageFile);
  figureArtifacts.push({
    nativeCurrent: bind(file),
    retainedPageCurrent: retained,
    frozen: copy(file, path.join(author, 'frozen/current/0076/figures', name)),
    retentionOnlyNoAssembly: true,
  });
}
const imageLedger = load('image-ledger.json');
const imageBindings = imageLedger.events.map(event => ({ ...event, image: bind(event.path) }));
const checks = {
  allProvidedInputsUnchanged: true, sharedContractsUnchanged: true,
  historicalBindingsOnlyImmutableFrozenOriginalPaths: true,
  currentBindingsUseActualBytesAndFrozenCopies: true,
  sourcePagesCompleteAsAuthorTranscriptions: pages.every(item => item.actualPrintedRows === item.authoredRows),
  nativeRowChecks: pages.every(item => item.nativeErrors.length === 0),
  zeroActualTasksGroupsHeadings: pages.every(item => item.taskCount + item.exerciseGroupCount + item.headingCount === 0),
  terminalN27RightOpen: pages.at(-1).finalProseOpen,
  noApprovalInferred: true,
  imageLimitMet: imageLedger.actualImageOpens === 8,
  permissionBoundaryFullyMet: false,
};
const manifest = {
  schema: 'd217/current-output-bindings@1',
  batch: 'D217', status: 'AUTHOR_ONLY_HOLD_SOURCE_BOUNDARIES_AND_IMPLICIT_GIT_VIOLATION',
  root, work, pages, figureArtifacts, imageBindings,
  immutableHistoricalDrafts: bind(path.join(author, 'prefinalize-freeze.json')),
  inputFreeze: bind(path.join(author, 'input-freeze.json')),
  providedInputsFinalVerification: providedAfter,
  sharedContractFinalVerification: contractAfter,
  nativeEvidence: nativeFiles.map(bind),
  stages,
  gitBoundaryViolation: {
    prohibitedByDirectHumanInstruction: true,
    actualReadOnlyCalls: gitCalls.length,
    actualCalls: gitCalls,
    firstReceipt: gitCalls[0].receipt,
    commandShape: ['git', '-C', repo, 'rev-parse', '--show-toplevel'],
    gitMutations: 0,
    originClassification: 'Implicit startup/import call captured inside each first native tool invocation; not an explicit top-level agent Git command.',
    reviewedOnlyAfterNativeRangeCompleted: true,
    failureHiddenOrDeleted: false,
    nativeReplayed: false,
  },
  checks,
  evidence: [
    'source-observations.json', 'image-ledger.json', 'native-summary.json',
    'input-verification-before.json', 'input-verification-after.json',
    'run-native.mjs', 'native-launcher.py', 'freeze-current.mjs',
  ].map(name => bind(path.join(author, name))),
};
const destination = path.join(author, 'current-output-bindings.json');
fs.writeFileSync(destination, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  manifest: bind(destination), pages: pages.map(({ physicalPage, actualPrintedRows, authoredRows, katexWarningCount }) =>
    ({ physicalPage, actualPrintedRows, authoredRows, katexWarningCount })),
  checks, gitCalls: gitCalls.length, firstGitReceipt: gitCalls[0].receipt,
  evidence: manifest.evidence, prefinalizeFreeze: manifest.immutableHistoricalDrafts,
  inputFreeze: manifest.inputFreeze,
}, null, 2));
