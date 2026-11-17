import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const core = JSON.parse(fs.readFileSync(path.join(directory, "solution-core.json"), "utf8"));
const add = (a,b) => a.map((x,index) => x+b[index]);
const sub = (a,b) => a.map((x,index) => x-b[index]);
const scale = (a,factor) => a.map((x) => x*factor);
const equal = (a,b) => a.length===b.length && a.every((x,index) => x===b[index]);
const tupleEqual = (a,b) => a.length===b.length && a.every((x,index) => equal(x,b[index]));
const dot = (a,b) => a.reduce((sum,x,index) => sum+x*b[index],0);
const norm2 = (a) => dot(a,a);
const ids = ["A","B","C","D"];
const checks = [];
const collect = (ordinal, target, options, note) => {
  const solution = core.view_solutions.find((item) => item.ordinal===ordinal);
  const results = ids.map((id,index) => {
    const observed = tupleEqual(options[index],target);
    const declared = solution.option_checks.find((item) => item.option_id===id).truth;
    assert.equal(observed,declared,`ordinal ${ordinal} option ${id}`);
    return { option_id:id, matches_target:observed, evaluated_tuple:options[index] };
  });
  assert.deepEqual(results.filter((item)=>item.matches_target).map((item)=>item.option_id),solution.independent_true_set);
  checks.push({ ordinal, target_tuple:target, option_results:results, note });
};

{
  const b=[1,0,0],c=[0,1,0],d=[0,0,1];
  const target=[sub(d,b),sub(c,d),sub(b,c)];
  collect(1,target,[
    [sub(b,d),sub(d,c),sub(c,b)],
    [sub(d,b),sub(c,d),sub(b,c)],
    [sub(d,b),sub(d,c),sub(b,c)],
    [sub(d,b),sub(c,d),sub(c,b)],
  ],"Nondegenerate standard tetrahedron with origin A.");
}
{
  const a=[1,0],b=[0,1],c=sub(a,b);
  const target=[b,sub(a,b),sub(c,a),scale(c,-1)];
  collect(2,target,[
    [b,sub(b,a),scale(b,-1),sub(a,b)],
    [b,sub(a,b),b,sub(a,b)],
    [a,sub(b,a),scale(a,-1),sub(a,b)],
    [b,sub(a,b),scale(b,-1),sub(b,a)],
  ],"O is origin; a,b independent. Tuple is actual O-B-A-C-O endpoint subtraction.");
}
{
  const a=[1,0,0],b=[0,1,0],c=[0,0,1];
  const p=scale(a,0.5),r=scale(b,0.5),m=scale(add(a,c),0.5),n=scale(add(a,b),0.5);
  const target=[sub(a,b),scale(add(a,c),-1),sub(add(a,b),c)];
  collect(3,target,[
    [sub(scale(p,2),b),scale(m,-2),sub(scale(n,2),c)],
    [sub(scale(p,2),b),scale(m,2),sub(scale(n,2),c)],
    [sub(scale(r,2),a),scale(m,-2),sub(scale(n,2),c)],
    [sub(scale(p,2),b),scale(m,-2),sub(scale(c,2),n)],
  ],"O lies outside base x+y+z=1; D's Z has coefficient sum 1 but is still the wrong endpoint.");
}
{
  const samples=[
    {u:[1,0],v:[0,2]},
    {u:[2,0],v:[0,2]},
    {u:[1,0],v:[1,1]},
    {u:[3,1],v:[-1,3]},
  ];
  const results=samples.map(({u,v})=>{
    assert.notEqual(u[0]*v[1]-u[1]*v[0],0,"Only nondegenerate triangles are allowed");
    const right=dot(u,v)===0;
    const sum=add(u,v),difference=sub(u,v);
    const equalNorms=norm2(sum)===norm2(difference);
    assert.equal(norm2(sum)-norm2(difference),4*dot(u,v));
    return {u,v,right,sum,difference,option_truth_in_instance:[
      !right||equalNorms,
      !right||equal(sum,difference),
      !equalNorms||right,
      !equalNorms||norm2(u)===norm2(v),
    ]};
  });
  const universals=ids.map((id,index)=>({
    option_id:id,
    true_on_all_checked_instances:results.every((result)=>result.option_truth_in_instance[index]),
  }));
  for(const result of universals) assert.equal(result.true_on_all_checked_instances,core.view_solutions[3].option_checks.find((item)=>item.option_id===result.option_id).truth);
  checks.push({ordinal:4,instances:results,option_results:universals,note:"Finite checks witness B,D failures. The squared-norm proof in solution-core.json establishes A,C universally, not the finite samples alone."});
}
{
  const a=[0,0,0],b=[2,0,0],c=[2,2,0],d=[0,2,0],m=[1,1,0];
  const samples=[
    {o:[1,1,1],p:[1,1,2]},
    {o:m,p:m},
    {o:[1,1,1],p:[1,1,1]},
    {o:[0,0,0],p:[1,1,2]},
  ];
  const results=samples.map(({o,p})=>{
    const so=add(sub(a,o),sub(c,o)),to=add(sub(b,o),sub(d,o));
    const sp=add(sub(a,p),sub(c,p)),tp=add(sub(b,p),sub(d,p));
    assert(equal(so,to)&&equal(sp,tp));
    const om=sub(m,o),pm=sub(m,p);
    const target=[so,to,sp,tp];
    const proposals=[
      [om,om,pm,pm],
      [scale(om,2),scale(om,2),scale(om,2),scale(om,2)],
      [scale(om,2),scale(om,2),scale(pm,2),scale(pm,2)],
      [scale(om,-2),scale(om,-2),scale(pm,-2),scale(pm,-2)],
    ];
    return {o,p,target,option_truth_in_instance:proposals.map((tuple)=>tupleEqual(tuple,target))};
  });
  const universals=ids.map((id,index)=>({
    option_id:id,
    true_on_all_checked_instances:results.every((result)=>result.option_truth_in_instance[index]),
  }));
  for(const result of universals) assert.equal(result.true_on_all_checked_instances,core.view_solutions[4].option_checks.find((item)=>item.option_id===result.option_id).truth);
  checks.push({ordinal:5,instances:results,option_results:universals,note:"Midpoint and coincident-origin samples demonstrate why accidental equality does not validate a false universal row. General midpoint proof is separate."});
}
{
  const a=[1,0,0,0],b=[0,1,0,0],c=[0,0,1,0],d=[0,0,0,1];
  const p=add(sub(d,a),sub(c,b)),q=add(sub(d,b),sub(c,a));
  const alternative=add(sub(b,a),sub(d,c));
  const twoMN=scale(sub(scale(add(c,d),0.5),scale(add(a,b),0.5)),2);
  assert(equal(p,q));
  assert(equal(p,twoMN));
  assert(!equal(p,alternative));
  assert(equal(sub(p,q),[0,0,0,0]));
  const symbolicTruth=[true,false,true,false];
  symbolicTruth.forEach((truth,index)=>assert.equal(truth,core.view_solutions[5].option_checks[index].truth));
  const examples=[
    {a:[0,0,0],b:[1,0,0],c:[0,1,0],d:[0,0,1]},
    {a:[0,0,0],b:[1,0,0],c:[3,0,0],d:[7,0,0]},
    {a:[2,3,4],b:[2,3,4],c:[-1,5,0],d:[7,-2,6]},
  ].map(({a,b,c,d})=>{
    const p=add(sub(d,a),sub(c,b)),q=add(sub(d,b),sub(c,a));
    const twoMN=scale(sub(scale(add(c,d),0.5),scale(add(a,b),0.5)),2);
    assert(equal(p,q)&&equal(p,twoMN));
    return {a,b,c,d,p,q,twoMN,AB_plus_CD:add(sub(b,a),sub(d,c))};
  });
  checks.push({
    ordinal:6,
    symbolic_coefficients_over:["a","b","c","d"],
    p_coefficients:p,
    q_coefficients:q,
    twoMN_coefficients:twoMN,
    AB_plus_CD_coefficients:alternative,
    p_minus_q_coefficients:sub(p,q),
    option_results:ids.map((id,index)=>({option_id:id,truth:symbolicTruth[index]})),
    examples,
    note:"The identically zero coefficient difference refutes any existential collinear counterexample; examples alone would not refute D.",
  });
}
const scriptPath=fileURLToPath(import.meta.url);
const result={
  schema:"s10y-choice-independent-phase2-mathematics-check-v1",
  checked_at:new Date().toISOString(),
  authority:"Reviewer-created arithmetic and linear-coefficient checks of the independently derived solutions. No author key, old skill test or internal reasoning.",
  limitation:"General conditions and norm/geometric proofs are in solution-core.json and comparison.md; finite checks are not a substitute.",
  script_path:scriptPath,
  script_sha256:crypto.createHash("sha256").update(fs.readFileSync(scriptPath)).digest("hex"),
  assertions_completed:true,
  ordinal_count:checks.length,
  option_count:core.view_solutions.flatMap((item)=>item.option_checks).length,
  checks,
};
assert.equal(result.ordinal_count,6);
assert.equal(result.option_count,24);
fs.writeFileSync(path.join(directory,"mathematics-evidence.json"),`${JSON.stringify(result,null,2)}\n`,{flag:"wx"});
console.log(JSON.stringify({assertions_completed:true,ordinals:6,options:24,image_opens:0,output:path.join(directory,"mathematics-evidence.json")},null,2));
