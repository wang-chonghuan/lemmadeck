import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const [, , batch, role, file, digest] = process.argv;
assert.ok(['175176', '177178'].includes(batch));
assert.ok(['author', 'independent'].includes(role));
assert.equal(path.basename(file), file);
assert.match(digest, /^[a-f0-9]{64}$/);
const tmp = '.intentfold/tickets/STEMROBIN-188/tmp';
const source = `${tmp}/source6g${batch}-${role}7`;
const root = `ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-source${batch}`;
const target = `${root}/${role === 'author' ? 'author-first7' : 'independent7'}`;
const hash = name => crypto.createHash('sha256').update(fs.readFileSync(name)).digest('hex');
assert.equal(hash(`${source}/${file}`), digest, 'Returned child binding differs');

function retain(from, to) {
  for (const item of fs.readdirSync(from, { withFileTypes: true })) {
    const input = path.join(from, item.name);
    const output = path.join(to, item.name);
    assert.ok(!item.isSymbolicLink(), `Unexpected source child symlink: ${input}`);
    if (item.isDirectory()) retain(input, output);
    else {
      fs.mkdirSync(path.dirname(output), { recursive: true });
      if (fs.existsSync(output))
        assert.ok(fs.readFileSync(input).equals(fs.readFileSync(output)),
          `Changed retained first bytes: ${output}`);
      else fs.copyFileSync(input, output, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(output, 0o444);
    }
  }
}
retain(source, target);
fs.mkdirSync(root, { recursive: true });
const helper = `${root}/resume-source175178-7.mjs`;
if (fs.existsSync(helper))
  assert.equal(hash(helper), hash(`${tmp}/resume-source175178-7.mjs`));
else fs.copyFileSync(`${tmp}/resume-source175178-7.mjs`, helper, fs.constants.COPYFILE_EXCL);
fs.chmodSync(helper, 0o444);
console.log(JSON.stringify({
  retained: target, binding: { file, sha256: digest },
  sourceReopens: 0, producerReplays: 0, contentApprovedByRetention: false,
}));
