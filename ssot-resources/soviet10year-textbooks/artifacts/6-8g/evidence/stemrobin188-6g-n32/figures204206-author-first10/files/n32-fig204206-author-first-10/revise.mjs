import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cwd = process.cwd();
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n32-fig204206-author-first-10');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
for (const id of ['fig-205', 'fig-206']) {
  const dir = path.join(root, id);
  const original = path.join(dir, 'spec.json');
  const revised = path.join(dir, 'spec.r1.json');
  const spec = read(original);
  const firstFailure = path.join(dir, 'firstfailure.json');
  if (!fs.existsSync(firstFailure)) throw new Error('A real preserved first failure is required');
  let defect;
  let correction;
  let revisedContext;
  if (id === 'fig-205') {
    defect = 'Native render found stroke collision score 10000 for B at SE offset [14,16]. All width checks had passed.';
    correction = 'Move only B label offset to [10,48], still below/right of B as in source, without moving B or any stroke.';
    spec.objects.find(o => o.id === 's205-B').labelPlacement.offset = [10, 48];
  } else {
    defect = 'Wrong prose index 14 selected the following central-symmetry section rather than fig-206 proof; native validator rejected missing centralSymmetry.';
    correction = 'Bind exact relevant corollary and contradiction proof at indices 8 and 13 of the authorized lesson template. Geometry and all source objects unchanged.';
    const contextFile = path.join(dir, 'context.json');
    const context = read(contextFile);
    const lessonPath = context.bindings[0].path;
    if (hash(lessonPath) !== context.bindings[0].sha256) throw new Error('Authoritative lesson hash drift');
    const lesson = read(lessonPath);
    context.authoritativeText = [8, 13].map(i => ({ lesson: lesson.id, text: lesson.prose[i].text }));
    if (!context.authoritativeText[1].text.includes('图206')) throw new Error('Proof binding must explicitly name figure 206');
    spec.source.authoritativeText = context.authoritativeText;
    revisedContext = path.join(dir, 'context.r1.json');
    write(revisedContext, context);
  }
  write(revised, spec);
  const semantics = read(path.join(dir, 'author-semantics.json'));
  semantics.spec = bind(revised);
  semantics.contentRevisions = 1;
  write(path.join(dir, 'author-semantics.r1.json'), semantics);
  write(path.join(dir, 'revision.r1.json'), {
    schema: 'bounded-figure-content-revision@1', figure: id,
    contentRevision: 1, maximumContentRevisions: 1, technicalRecoveries: 0,
    originalSpec: bind(original), firstFailure: bind(firstFailure),
    revisedSpec: bind(revised), revisedContext: revisedContext ? bind(revisedContext) : null,
    defect, correction, sourceReopened: false,
    sourceOrFirstChanged: false, nativeRendererOrValidatorChanged: false,
    priorOutputsPreservedAtOriginalPaths: true,
    independentReview: false, promotion: false,
  });
}
