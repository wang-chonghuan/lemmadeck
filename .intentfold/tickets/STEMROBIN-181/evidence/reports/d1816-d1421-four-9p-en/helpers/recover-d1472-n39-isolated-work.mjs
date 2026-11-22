import fs from 'node:fs';
import { ticket, repo, bind, read, save, copy } from './n42-native.mjs';

const failure = `${ticket}/tmp/d1816-d1468-n39-unit-native`;
copy(`${ticket}/tmp/d1816-recovery/finalize-d997-n72-first-en.mjs`,
  `${failure}/helper.executed-original.mjs`);
const prior = read(`${ticket}/tmp/d1816-d1414-n39-first-missing-en/prepared.json`);
save(`${failure}/first-failure.json`, {
  task: 'D1468', status: 'FAILED_BEFORE_OFFICIAL_NATIVE_COMMAND',
  execution: { chunk: '4c7b58', exitCode: 1, cwd: repo,
    argv: ['node', '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/finalize-d997-n72-first-en.mjs',
      '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d1467-n39-unit-review/unit-text-review.json',
      '5893676d8dcc9d2e8197b522974580da7495dd71b4e4697a634d4c1d6cacb3ba', 'phy9-c1-s4-n39'] },
  message: 'ENOENT at copy of the uninitialized isolated-work lesson.template.json.',
  officialNativeCommandsInvoked: 0, oldNativeHtmlUnchanged: true,
  helper: bind(`${failure}/helper.executed-original.mjs`),
});
const templates = `${repo}/.tmp/STEMROBIN-181/d1816-d1472/work/adapt/9p/modern-us-neutral-en/lessons/phy9-c1-s4-n39`;
fs.mkdirSync(templates, { recursive: true });
for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json'])
  copy(`${prior.work}/adapt/9p/modern-us-neutral-en/lessons/phy9-c1-s4-n39/${name}`, `${templates}/${name}`);
console.log(JSON.stringify({ preservedFailure: bind(`${failure}/first-failure.json`), templates }));
