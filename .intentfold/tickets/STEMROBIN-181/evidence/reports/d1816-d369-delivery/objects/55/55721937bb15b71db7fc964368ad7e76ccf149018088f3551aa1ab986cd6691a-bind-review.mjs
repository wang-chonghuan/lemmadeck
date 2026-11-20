import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, isAbsolute } from 'node:path';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const allowed = [
  'd1816-d346-source392-393-review',
  'd1816-d347-n149-affected-text-review',
  'd1816-d349-source390391-affected-review',
].map(name => resolve(repo, '.intentfold/tickets/STEMROBIN-181/tmp', name));
const [outputArgument, ...inputs] = process.argv.slice(2);
const output = resolve(outputArgument);
if (!allowed.some(root => output.startsWith(`${root}/`))) {
  throw new Error('Output outside reviewer ownership');
}
if (!inputs.length) throw new Error('Empty input freeze');
const bindings = inputs.map(input => {
  const path = isAbsolute(input) ? input : resolve(repo, input);
  const bytes = readFileSync(path);
  return {
    path,
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  };
});
const freeze = {
  schema: 'stemrobin181/reviewer-file-freeze@1',
  frozenAt: new Date().toISOString(),
  repository: repo,
  files: bindings,
};
writeFileSync(output, `${JSON.stringify(freeze, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  path: output,
  sha256: createHash('sha256').update(readFileSync(output)).digest('hex'),
  files: bindings,
}, null, 2));
