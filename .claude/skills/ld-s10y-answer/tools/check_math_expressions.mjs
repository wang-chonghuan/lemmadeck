import fs from 'node:fs'
import path from 'node:path'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..')
const require=createRequire(path.join(repo,'app/package.json'))
const {ComputeEngine}=require('@cortex-js/compute-engine')

export function validateMathExpected(parts) {
  const engine=new ComputeEngine()
  const failures=[]
  let checked=0
  for(const [index,part] of parts.entries()){
    if(!['numeric','expression'].includes(part.judge))continue
    for(const value of part.expected||[]){
      const label=`parts[${index}] expected ${JSON.stringify(value)}`
      if(/(?<![\\a-zA-Z])(?:abs|sqrt|sin|cos|tan|log|ln|exp)\s*\(/.test(value)){
        failures.push(`${label}: use LaTeX, not programming function notation`)
        continue
      }
      const parsed=engine.parse(value)
      if(parsed.has('Error')){
        failures.push(`${label}: invalid LaTeX expression`)
      }else if(part.judge==='numeric'){
        const number=parsed.N()
        if(!Number.isFinite(number.re)||number.im!==0){
          failures.push(`${label}: numeric key must evaluate to a finite real number`)
        }
      }
      checked++
    }
  }
  return {status:failures.length?'fail':'pass',checked,failures}
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const files=process.argv.slice(2)
  if(!files.length)throw Error('At least one answer key is required')
  const parts=files.flatMap(file=>JSON.parse(fs.readFileSync(file)).answers.flatMap(a=>a.parts))
  const report=validateMathExpected(parts)
  console.log(JSON.stringify(report,null,2))
  process.exitCode=report.status==='pass'?0:2
}
