import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d029-n111-prose-author')
const template = path.join(own, 'work/adapt/9p/modern-us-neutral/lessons/phy9-c2-s4-n111/lesson.template.json')
const args = [path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), template]
const result = spawnSync(process.execPath, args, { cwd: repo, encoding: 'utf8' })
fs.writeFileSync(path.join(own, 'prose-flow.before-anchors.command.json'), JSON.stringify({
  executable: process.execPath, args, cwd: repo, exitCode: result.status,
  purpose: 'Native final-paragraph outline and adjacent boundary objects; no hand-counted anchors.',
}, null, 2) + '\n')
fs.writeFileSync(path.join(own, 'prose-flow.before-anchors.stdout.txt'), result.stdout ?? '')
fs.writeFileSync(path.join(own, 'prose-flow.before-anchors.stderr.txt'), result.stderr ?? '')
if (result.status !== 0) throw new Error('Native prose_flow failed; retain draft and HOLD')
console.log(result.stdout)
