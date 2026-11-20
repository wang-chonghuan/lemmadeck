import path from 'node:path'
import { tmp, core, read, bind, inventory, retain } from './retain-scoped-evidence-02.mjs'

const directories = [
  'n62-modern-prepare-01', 'n62-modern-adapt-finalize-01', 'n62-modern-render-01',
  'g10-n62/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s3-n62',
]
retain(path.join(core, 'evidence/stemrobin188-g10-n62/modern-native-ready'),
  [new URL(import.meta.url).pathname, path.join(tmp, 'finish-n62-modern-01.mjs'),
    path.join(tmp, 'n62-modern-text-admission-01.json'),
    ...directories.flatMap(directory => inventory(path.join(tmp, directory)))], {
    status: 'N62-modern-native-finalization-and-offline-render-PASS-not-complete-lesson',
    finalize: bind(path.join(tmp, 'n62-modern-adapt-finalize-01/result.json')),
    render: bind(path.join(tmp, 'n62-modern-render-01/result.json')),
    currentFigureIDs: [89, 90, 91],
    canonicalModernFiguresRecorded: true,
    rawSourceCorePromoted: false, mathematicalAnswersApproved: false,
    choicesApproved: false, finalBatchDesktopMobileAcceptanceRun: false,
    sourceHolds: read(path.join(tmp, 'n62-modern-text-admission-01.json')).sourceHolds,
  })
