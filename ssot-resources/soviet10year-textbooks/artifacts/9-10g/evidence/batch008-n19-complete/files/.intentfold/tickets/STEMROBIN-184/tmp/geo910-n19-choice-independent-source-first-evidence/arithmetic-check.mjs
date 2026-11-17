import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const add = (a, b) => a.map((value, index) => value + b[index]);
const subtract = (a, b) => a.map((value, index) => value - b[index]);
const scale = (a, factor) => a.map((value) => value * factor);
const dot = (a, b) => a.reduce((sum, value, index) => sum + value * b[index], 0);
const normSquared = (a) => dot(a, a);
const equal = (a, b) => {
  assert.equal(a.length, b.length);
  a.forEach((value, index) => assert(value === b[index], `${value} != ${b[index]}`));
};
const checks = [];

{
  const a = [0,0,0], b = [1,0,0], c = [0,1,0], d = [0,0,1];
  const endpoints = [add(a, subtract(d,b)), add(a, subtract(c,d)), add(a, subtract(b,c))];
  equal(endpoints[0], [-1,0,1]);
  equal(endpoints[1], [0,1,-1]);
  equal(endpoints[2], [1,-1,0]);
  equal(subtract(endpoints[0],a), scale(subtract(b,d), -1));
  equal(subtract(endpoints[1],a), scale(subtract(d,c), -1));
  equal(subtract(endpoints[2],a), scale(subtract(c,b), -1));
  checks.push({ source: "186", scope: "Three signed opposites with the specified start A", endpoints });
}
{
  const o = [0,0], a = [1,0], b = [0,1], c = subtract(a,b);
  equal(subtract(a,b), subtract(c,o));
  equal(subtract(a,c), subtract(b,o));
  equal(scale(add(o,a), 0.5), scale(add(b,c), 0.5));
  checks.push({ source: "187", scope: "OB=CA, BA=OC and shared diagonal midpoint", O:o, A:a, B:b, C:c });
}
{
  const o = [0,0,0], a = [1,0,0], b = [0,1,0], c = [0,0,1];
  const endpoints = [subtract(a,b), scale(add(a,c), -1), subtract(add(a,b),c)];
  equal(endpoints[0], [1,-1,0]);
  equal(endpoints[1], [-1,0,-1]);
  equal(endpoints[2], [1,1,-1]);
  equal(subtract(endpoints[0],o), subtract(a,b));
  equal(endpoints[1], scale(scale(add(a,c),0.5),-2));
  equal(endpoints[2], subtract(scale(scale(add(a,b),0.5),2),c));
  const coefficientSums = endpoints.map((point) => point.reduce((sum,value) => sum+value,0));
  equal(coefficientSums, [0,-2,1]);
  checks.push({ source: "188", scope: "All three constructions and base-plane membership", endpoints, coefficient_sums: coefficientSums });
}
{
  const examples = [
    { u:[1,0], v:[0,2], right:true },
    { u:[1,0], v:[1,1], right:false },
    { u:[0,0], v:[1,2], right:null },
  ];
  for (const example of examples) {
    const difference = normSquared(add(example.u,example.v)) - normSquared(subtract(example.u,example.v));
    assert.equal(difference,4*dot(example.u,example.v));
    if (example.right !== null) assert.equal(difference === 0,example.right);
  }
  checks.push({ source: "189", scope: "Squared-norm identity, right/nonright cases and zero-vector caveat", examples });
}
{
  const a=[0,0,0],b=[1,0,0],c=[1,1,0],d=[0,1,0],m=[0.5,0.5,0];
  const origins = [[0,0,0],m,[2,-3,5]];
  for (const o of origins) {
    const left = add(subtract(a,o),subtract(c,o));
    const right = add(subtract(b,o),subtract(d,o));
    equal(left,right);
    equal(left,scale(subtract(m,o),2));
  }
  assert.notDeepEqual(add([0,0],[0,1]),add([1,0],[2,2]));
  checks.push({ source: "190", scope: "Arbitrary origins including a vertex, midpoint and outside-plane point; non-parallelogram failure", origins });
}
{
  const examples = [
    { a:[0,0,0],b:[1,0,0],c:[0,1,0],d:[0,0,1] },
    { a:[0,0,0],b:[1,0,0],c:[3,0,0],d:[7,0,0] },
    { a:[2,3,4],b:[2,3,4],c:[-1,5,0],d:[7,-2,6] },
    { a:[2,3,4],b:[-4,0,1],c:[9,5,-2],d:[1,-2,6] },
  ];
  for (const {a,b,c,d} of examples) {
    equal(add(subtract(d,a),subtract(c,b)),add(subtract(d,b),subtract(c,a)));
  }
  checks.push({ source: "191", scope: "Tetrahedron, collinear, coincident and unrestricted coordinate instances", examples });
}
const scriptPath = fileURLToPath(import.meta.url);
const result = {
  schema: "independent-source-arithmetic-evidence-v1",
  checked_at: new Date().toISOString(),
  script_path: scriptPath,
  script_sha256: crypto.createHash("sha256").update(fs.readFileSync(scriptPath)).digest("hex"),
  authority: "Reviewer-created coordinate checks from the source solutions, not old tests or an author key",
  limitation: "Finite arithmetic instances support sign checking; the report's algebra and geometric proofs establish the general claims.",
  assertions_completed: true,
  attempt: 2,
  retained_prior_attempt: path.join(directory, "arithmetic-attempt-1.json"),
  source_count: checks.length,
  checks,
};
fs.writeFileSync(path.join(directory,"arithmetic-evidence.json"),`${JSON.stringify(result,null,2)}\n`,{flag:"wx"});
console.log(JSON.stringify({ assertions_completed:true, sources:checks.map((item)=>item.source), output:path.join(directory,"arithmetic-evidence.json") },null,2));
