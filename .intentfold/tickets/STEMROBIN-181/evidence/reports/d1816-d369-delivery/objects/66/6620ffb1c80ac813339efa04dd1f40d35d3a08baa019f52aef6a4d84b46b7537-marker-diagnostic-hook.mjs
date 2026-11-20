import assert from 'node:assert/strict'
import fs from 'node:fs'
import { registerHooks } from 'node:module'

const target = 'file:///Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs'
registerHooks({
  load(url, context, nextLoad) {
    if (url !== target) return nextLoad(url, context)
    const source = fs.readFileSync(new URL(url), 'utf8')
    const before = 'throw new Error(`Unsupported arrow marker aspect ratio: ${id}`)'
    assert.equal(source.split(before).length, 2)
    return {
      format: 'module',
      shortCircuit: true,
      source: source.replace(before, 'throw new Error(`Unsupported arrow marker aspect ratio: ${id}; ${JSON.stringify({viewBox:[viewBox.x,viewBox.y,viewBox.width,viewBox.height],width,height,lineId:line.id,stroke:line.getAttribute("stroke-width"),marker:marker.outerHTML,line:line.outerHTML})}`)'),
    }
  },
})
