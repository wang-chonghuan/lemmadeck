import fs from 'node:fs';
import { ticket, read, save, bind } from './n42-native.mjs';

const file = `${ticket}/production-meter.json`;
const meter = read(file), state = meter.currentResume1817;
state.independentReviewersInFlight = 1;
state.activeReviewer = {
  agentId: '01a2075d-4ab7-7aa3-a994-e0ff27648f2b',
  cards: ['phy9-c2-s2-n84', 'phy9-c2-s4-n113'],
  scope: 'first-English-text-only',
  status: 'in-flight',
  actualImageOpens: 0,
};
state.completedAuthors.push({
  agentId: '01a20754-86a6-77a2-bc6d-b48db457e50f',
  card: 'phy10-c1-s2-n16',
  status: 'completed-and-closed-native-passed-review-pending',
  report: bind(`${ticket}/tmp/d1816-d1981-n16-first-en-author/source-binding/report.json`),
  imageOpens: 0,
});
state.nextAuthor = {
  agentId: '01a2075e-9531-7d70-8dd2-b69769677b01',
  cards: ['phy10-c1-s2-t17', 'phy10-c1-s6-t16'],
  status: 'in-flight-first-English-translation',
  outputDirectories: [
    `${ticket}/tmp/d1816-d1990-t17-first-en-author`,
    `${ticket}/tmp/d1816-d1991-t16-first-en-author`,
  ],
  imageOpens: 0,
};
state.n16Preparation = bind(`${ticket}/tmp/d1816-d1982-n16-preparation/prepared.json`);
state.n16Native = bind(`${ticket}/tmp/d1816-d1988-n16-first-en-native/result.json`);
state.n16ChoiceStructure = bind(`${ticket}/tmp/d1816-d1989-n16-en-choice-review-inputs/result.json`);
state.stage = 'Exercise7 pushed/submitted. N84/N113 first English text review active; N12 native/display ready; N16 native/structure PASS, display next; Exercise1/5 author active.';
meter.updatedAt = new Date().toISOString();
save(`${ticket}/tmp/d1816-d1990-active-agent-recovery/result.json`, {
  status: 'ACTIVE_AGENT_BINDING_WRITE_RECOVERED',
  firstFailure: 'save() uses exclusive creation; production-meter.json already exists (EEXIST). No initial write occurred.',
  repair: 'Write the machine-owned meter with the established replacement-write API.',
  productChanges: 0,
  databaseWrites: 0,
  imagesOpened: 0,
});
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ reviewer: state.activeReviewer, nextAuthor: state.nextAuthor }));
