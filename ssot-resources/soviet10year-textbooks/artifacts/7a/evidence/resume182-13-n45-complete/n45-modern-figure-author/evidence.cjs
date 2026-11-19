const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const resume = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13');
const own = path.join(resume, 'n45-modern-figure-author');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write = (p,d) => {
  if (!p.startsWith(own + '/')) throw new Error('Write outside owned scratch');
  fs.mkdirSync(path.dirname(p), {recursive:true});
  fs.writeFileSync(p, JSON.stringify(d,null,2)+'\n');
};
function binding(p) {
  const b=fs.readFileSync(p), s=fs.statSync(p);
  return {path:p,sha256:hash(p),bytes:b.length,mode:(s.mode&0o777).toString(8),
    ...(p.endsWith('.png')?{width:b.readUInt32BE(16),height:b.readUInt32BE(20),inspection:'header-only; not an image open'}:{})};
}
if (process.cwd() !== root) throw new Error('Wrong cwd');
const [action,...args] = process.argv.slice(2);
if (action === 'inventory') {
  const finalDir=path.join(own,'EVIDENCE');
  fs.mkdirSync(finalDir,{recursive:true});
  const dest=path.join(finalDir,'source-inventory-BEFORE-DRAWING.json');
  if(fs.existsSync(dest)) throw new Error('Inventory already frozen');
  fs.copyFileSync(path.join(own,'WORKING/source-inventory.json'),dest);
  fs.chmodSync(dest,0o444);
  const inputs=[
    '.intentfold/readme.md','.intentfold/project.json',
    ...['product','engineering','ui','operations'].map(n=>`.intentfold/charter/${n}.md`),
    '.agents/skills/ld-s10y-image/SKILL.md',
    ...['routing','figure-spec','quality-gate'].map(n=>`.agents/skills/ld-s10y-image/references/${n}.md`),
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
    '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
    ...['render_spec.mjs','validate_spec.py','materialize_arrowheads.mjs'].map(n=>`.agents/skills/ld-s10y-image/scripts/${n}`),
    '.claude/skills/ld-s10y-lesson/tools/svg_raster.js',
    '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
    ...['lesson','exercises'].map(n=>`n45-source-stage/artifacts/7a/lessons/alg7-c4-s3-n45/${n}.json`),
    ...['lesson','exercises'].map(n=>`n45-modern-author/WORKING/alg7-c4-s3-n45/${n}.template.json`),
    'n45-modern-author/report.md','source267-274-review/report.md',
    ...[59,60,61].map(n=>`n45-source-stage/artifacts/7a/figures/fig-${n}.png`)
  ].map(p=>p.startsWith('n45-')||p.startsWith('source267')?path.join(resume,p):path.join(root,p));
  inputs.push('/Users/yong/.agents/skills/intentfold/SKILL.md');
  write(path.join(finalDir,'input-bindings.json'),{
    stage:'before-drawing',at:new Date().toISOString(),cwd:root,
    branch:'codex/STEMROBIN-182-textbooks',gitHead:'bf7d8a1cc29d492b89cce112e090d0f21d265083',
    inventory:binding(dest),inputs:inputs.map(binding),
    liveTicketRead:'Not performed: explicit human offline/no-network scope; no IntentFold capability invoked.',
    textReceipts:[
      {tool:'exec_command',command:'pwd',exitCode:0,outcome:'exact cwd'},
      {tool:'exec_command',command:'git status --short --branch',exitCode:0,outcome:'correct branch; pre-existing dirty files left alone'},
      {tool:'exec_command',command:'cat .intentfold/readme.md',exitCode:0},
      {tool:'exec_command',command:'cat .agents/skills/ld-s10y-image/SKILL.md',exitCode:0,outcome:'full skill'},
      {tool:'exec_command',command:'cat /Users/yong/.agents/skills/intentfold/SKILL.md',exitCode:0,outcome:'scope routing only'},
      {tool:'exec_command',command:'cat .intentfold/project.json .intentfold/charter/{product,engineering,ui,operations}.md',exitCode:0,outcome:'all four charters and redlines read'},
      {tool:'exec_command',command:'cat ld-s10y-image/references/{routing,figure-spec,quality-gate}.md production-resume.md',exitCode:0,outcome:'full contracts read; exact paths in inputs'},
      {tool:'exec_command',command:'rg --files --hidden [four explicitly named input/own directories]',exitCode:2,outcome:'owned directory absent before creation; existing input files identified; no producer ran'},
      {tool:'exec_command',command:'rg --files .agents/skills/ld-s10y-image/scripts',exitCode:0},
      {tool:'exec_command',command:'cat n45-modern-author/report.md WORKING/alg7-c4-s3-n45/{lesson,exercises}.template.json',exitCode:0,outcome:'output display truncated; complete top-level modern prose/exercises reread via structured projection'},
      {tool:'exec_command',command:'cat n45-source-stage/artifacts/7a/lessons/alg7-c4-s3-n45/{lesson,exercises}.json source267-274-review/report.md',exitCode:0,outcome:'full raw inputs/context; report treated as hypotheses'},
      {tool:'exec_command',command:'cat .agents/skills/ld-s10y-image/assets/figure-spec.schema.json',exitCode:0},
      {tool:'exec_command',command:'cat .agents/skills/ld-s10y-image/scripts/render_spec.mjs',exitCode:0,outcome:'full current renderer read'},
      {tool:'exec_command',command:'cat .agents/skills/ld-s10y-image/scripts/validate_spec.py',exitCode:0,outcome:'display truncated; assertion/completeness portion reread'},
      {tool:'exec_command',command:"sed -n '530,905p' .agents/skills/ld-s10y-image/scripts/validate_spec.py",exitCode:0},
      {tool:'exec_command',command:'node -e [structured top-level modern lesson prose and all modern exercises projection]',exitCode:0,outcome:'full relevant modern text read, no nested source snapshot relied upon'},
      {tool:'exec_command',command:'rg -n [width query] tools/render.mjs lib components/s10y-figure.tsx components/card-reader.tsx',exitCode:2,outcome:'two nonexistent guessed paths; no mutation or renderer attempt'},
      {tool:'exec_command',command:'git rev-parse HEAD',exitCode:0,outcome:'head recorded above'},
      {tool:'exec_command',command:'rg --files .claude/skills/ld-s10y-lesson/tools .agents/skills/lib app/src/lib',exitCode:0,outcome:'file-name inventory only; no answer/choice file contents inspected'},
      {tool:'exec_command',command:'rg -n [width query] tools lib app/src/lib/s10y*',exitCode:1,outcome:'zsh unmatched glob; no file contents read or mutation'},
      {tool:'exec_command',command:'cat .agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',exitCode:0},
      {tool:'exec_command',command:'rg -n [width query] tools/{htmlfrag.js,render_lesson.js,edition.py,svg_raster.js}',exitCode:0,outcome:'existing product display routing found; no app run'},
      {tool:'exec_command',command:'cat .claude/skills/ld-s10y-lesson/tools/svg_raster.js',exitCode:0,outcome:'existing raster tool read, not run'}
    ],
    imageOpens:3,sourceOpens:3,reopens:0,crops:0,previewOpens:0,
    sourceFactsAndModernAdditionsSeparated:true,noAnswersChoicesOrOldModernDiagramsInspected:true
  });
  fs.chmodSync(path.join(finalDir,'input-bindings.json'),0o444);
  console.log(JSON.stringify({frozenInventory:binding(dest),sourceImages:inputs.filter(p=>p.endsWith('.png')).map(binding)},null,2));
} else if (action === 'prepare') {
  const files=[];
  for(const id of ['fig-59','fig-60','fig-61']) {
    const from=path.join(own,'WORKING',id,id+'.spec.json');
    const to=path.join(own,'FINAL',id,id+'.spec.json');
    if(fs.existsSync(to)) throw new Error('Never overwrite a prepared candidate');
    fs.mkdirSync(path.dirname(to),{recursive:true});
    fs.copyFileSync(from,to);fs.chmodSync(to,0o444);
    files.push(binding(to));
  }
  const inv=path.join(own,'FINAL/source-inventory.json');
  fs.copyFileSync(path.join(own,'WORKING/source-inventory.json'),inv);fs.chmodSync(inv,0o444);
  write(path.join(own,'EVIDENCE/prepare-candidates.json'),{
    cwd:root,at:new Date().toISOString(),files,inventory:binding(inv),
    authoring:binding(path.join(own,'authoring-binding.json')),
    upcomingRender:'Renderer will write FINAL SVG/PNG/report directly so original render metadata names exactly these candidate paths. No durable promotion.'
  });
  console.log(JSON.stringify({files,inventory:binding(inv)},null,2));
} else if (action === 'run') {
  const [name,exe,...argv]=args;
  const dir=path.join(own,'RECEIPTS',name);
  if(fs.existsSync(dir)) throw new Error('Never overwrite a command receipt');
  fs.mkdirSync(dir,{recursive:true});
  const start={name,cwd:root,executable:exe,args:argv,start:new Date().toISOString(),
    environment:'PYTHONDONTWRITEBYTECODE=1; no env file read',wrapperHash:hash(__filename)};
  write(path.join(dir,'start.json'),start);
  const r=spawnSync(exe,argv,{cwd:root,encoding:'utf8',env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'},maxBuffer:20*1024*1024});
  for(const [n,s] of [['stdout',r.stdout||''],['stderr',r.stderr||'']]) fs.writeFileSync(path.join(dir,n+'.txt'),s);
  const receipt={...start,end:new Date().toISOString(),exitCode:r.status,signal:r.signal,
    error:r.error?.message||null,stdout:binding(path.join(dir,'stdout.txt')),stderr:binding(path.join(dir,'stderr.txt'))};
  write(path.join(dir,'receipt.json'),receipt);
  if (name === 'freeze-FIRST' && r.status === 0) {
    for (const n of fs.readdirSync(dir)) fs.chmodSync(path.join(dir,n),0o444);
  }
  console.log(JSON.stringify(receipt,null,2));
  console.log(r.stdout||'');
  if(r.stderr) console.error(r.stderr);
  process.exitCode=r.status??1;
} else {
  throw new Error('Use inventory or run');
}
