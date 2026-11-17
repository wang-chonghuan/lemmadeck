import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, read, bytes, bind, verify, immutableWrite, exists,
} from './retain-d016-evidence.mjs';

const [action] = process.argv.slice(2);
assert.ok(['--snapshot', '--check'].includes(action));
const folder = `${ticket}/tmp/d049-number-token-repair`;
const tool = '.claude/skills/ld-s10y-lesson/tools/edition.py';
const author = `${ticket}/tmp/d049-10p-n43-author`;
const freeze = `${author}/author-freeze.json`;
const beforePath = `${folder}/before.json`;
if (action === '--snapshot') {
  assert.equal(await exists(beforePath), false);
  await verify(freeze, '10f825085f601b6f98f7b4a6a1e2c13ee76846e7c8757f895f856e5f6bf498cc');
  await verify(tool, '123886f27b64f0200f3157280b38c86ac9c208c6da1b53895dc93294ffeb2170');
  await immutableWrite(`${folder}/edition.before.py`, await bytes(tool));
  const frozen = await read(freeze);
  const en = frozen.frozen.find(row => row.language === 'en');
  const captured = await read(en.nativeTextCheck.path);
  assert.equal(captured.status, 'fail');
  assert.deepEqual(captured.stage_errors.native_text, [
    "en.prose[10] 的非公式数字变化未被准确声明: want=[], got=['3500']",
  ]);
  await immutableWrite(beforePath, `${JSON.stringify({
    tool: await bind(tool), toolSnapshot: await bind(`${folder}/edition.before.py`),
    freeze: await bind(freeze), originalFailure: await bind(en.nativeTextCheck.path),
    originalNativeReceipt: en.nativeTextCommandReceipt,
    unchanged: await Promise.all([en.template.path, frozen.source.path,
      ...frozen.frozen.map(row => row.template.path)].map(bind)),
    defect: 'Unicode word boundaries hide an unchanged quantity adjacent to Chinese text.',
    plannedChange: 'ASCII identifier boundaries for prose quantities only; preserve legacy number_signature.',
  }, null, 2)}\n`);
  console.log(JSON.stringify({ before: await bind(beforePath) }));
} else {
  const before = await read(beforePath);
  for (const row of before.unchanged) await verify(row.path, row.sha256);
  await verify(before.freeze.path, before.freeze.sha256);
  await verify(before.toolSnapshot.path, before.toolSnapshot.sha256);
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', '-c', `
import json,sys
from pathlib import Path
sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')
import edition
cases=[
  ("cjk-adjacent","3500赫兹",["3500"],{"图号":set(),"节号":set()}),
  ("english-spaced","3500 Hz",["3500"],{"图号":set(),"节号":set()}),
  ("chinese-references","图81、第43节，频率3500赫兹",["3500"],{"图号":{"81"},"节号":{"43"}}),
  ("english-references","Figure 81, Section 43, frequency 3500 Hz",["3500"],{"图号":{"81"},"节号":{"43"}}),
  ("math-excluded",r"频率$f=3500$，温度-2.5度",["-2.5"],{"图号":set(),"节号":set()}),
  ("identifier-excluded","x3500 3500x foo_3",[],{"图号":set(),"节号":set()}),
  ("duplicate-quantity","3500赫兹和3500赫兹",["3500","3500"],{"图号":set(),"节号":set()}),
]
results=[]
for name,text,numbers,references in cases:
  actual=edition.prose_number_signature(text)
  assert actual==(numbers,references),(name,actual)
  results.append({"case":name,"status":"PASS"})
for name,source,modern,passes in [
  ("unchanged-quantity","3500赫兹","3500 Hz",True),
  ("changed-quantity","3500赫兹","3600 Hz",False),
  ("reference-change","图81，3500赫兹","Figure 82, 3500 Hz",False),
  ("quantity-removal","3500赫兹","Hz",False),
]:
  errors=edition.validate_text(source,modern,["translation"],[],name,[])
  assert (not errors)==passes,(name,errors)
  results.append({"case":name,"status":"PASS","expectedAccepted":passes,"errors":errors})
author=Path(sys.argv[1])
source=json.loads((author/'en/root/10p/lessons/phy10-c1-s5-n43/lesson.json').read_text())
modern=json.loads((author/'native/en/lesson.template.json').read_text())
block=modern['prose'][10]
profile=edition.load(Path('.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'))
errors=edition.validate_text(source['prose'][10]['text'],block['text'],block['changes'],
  block['numeric_changes'],'en.prose[10]',
  profile['forbidden_terms']+profile['forbidden_person_names'],block['historical_entities'],
  notation_changes=block.get('notation_changes'))
assert errors==[],errors
assert block['numeric_changes']==[]
assert edition.prose_number_signature(source['prose'][10]['text'])[0]==['3500']
assert edition.prose_number_signature(block['text'])[0]==['3500']
print(json.dumps({"focusedCases":results,"affectedBlock":"en.prose[10]",
  "affectedBlockErrors":errors,"sourceQuantity":["3500"],"modernQuantity":["3500"]},
  ensure_ascii=False))
`, author];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  const receipt = `${folder}/command.json`;
  await immutableWrite(receipt, `${JSON.stringify({
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }, null, 2)}\n`);
  assert.equal(result.status, 0, result.stderr);
  for (const row of before.unchanged) await verify(row.path, row.sha256);
  await immutableWrite(`${folder}/result.json`, `${JSON.stringify({
    status: 'PASS-affected-number-token-repair', before: await bind(beforePath),
    tool: await bind(tool), command: await bind(receipt), ...JSON.parse(result.stdout),
    proseChanged: false, numericChangesAdded: false,
    passedTextOrSourceOrFigureOrBrowserChecksReplayed: false,
    existingNativeNonTextStagesRetained: true, independentSemanticReviewPending: true,
  }, null, 2)}\n`);
  console.log(JSON.stringify({ result: await bind(`${folder}/result.json`) }));
}
