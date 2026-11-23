import { repo, ticket, read, save } from './n42-native.mjs';

const source = read(process.argv[2]), native = read(source.nativeFile), prepared = read(native.prepared.path);
const editionPath = `ssot-resources/soviet10year-textbooks/artifacts/${native.book}/editions/modern-us-neutral-en`;
const evidencePath = `.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-${source.stage}-first-complete-en`;
const config = {
  ...source, card: native.card, book: native.book,
  out: `${repo}/${evidencePath}`,
};
save(`${ticket}/tmp/d1816-recovery/retain-${source.stage}-config.json`, config);
save(`${ticket}/tmp/d1816-recovery/push-${source.stage}-config.json`, {
  card: native.card, book: native.book, title: source.title, stage: source.stage, evidencePath,
  dependencyPaths: prepared.figureDependencies.map(item => `${editionPath}/${item.relative}`),
});
console.log(JSON.stringify({ card: native.card, stage: source.stage, approval: false }));
