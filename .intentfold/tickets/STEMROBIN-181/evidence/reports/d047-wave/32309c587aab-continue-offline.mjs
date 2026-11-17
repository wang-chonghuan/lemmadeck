import fs from 'node:fs'
import path from 'node:path'
import { A, W, card, read, write, command } from './prepare.mjs'

for (const language of ['zh','en']) {
  const contentRoot=`context/geometry-${language}/root/10p/editions/modern-us-neutral`
  write(`${contentRoot}/lessons/${card}/lesson.json`,read(path.join(A,`inputs/${language}/lesson.template.json`)))
  write(`${contentRoot}/lessons/${card}/exercises.json`,read(path.join(A,`inputs/${language}/exercises.template.json`)))
  for (const file of ['fig-83.spec.json','fig-83.svg','fig-83.artwork.png','fig-83.render.json']) {
    write(`${contentRoot}/figures/${file}`,fs.readFileSync(path.join(A,'candidates/repair',file)))
  }
  command(`offline-geometry-${language}`,'node',[
    path.join(W,'.claude/skills/ld-s10y-lesson/tools/render_lesson.js'),
    path.join(A,`context/geometry-${language}/root/10p`),'--edition','modern-us-neutral',
    '--lesson',card,'--out',path.join(A,`previews/geometry-native-${language}`),
  ])
}
