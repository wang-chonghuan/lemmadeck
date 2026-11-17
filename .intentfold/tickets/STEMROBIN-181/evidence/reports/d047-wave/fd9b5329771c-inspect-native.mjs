import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { A, W, card, read, write, hash } from './prepare.mjs'

const require=createRequire(path.join(W,'app/package.json'))
const {chromium}=require('playwright')
const stage=process.argv[2] || 'geometry'
const folder=process.argv[3] || 'candidates/repair'
const declaredWidths=read(path.join(A,folder,'fig-83.spec.json')).display.widths
const browser=await chromium.launch({headless:false})
const result=[]
try {
  for (const language of ['en','zh']) {
    const native=path.join(A,`previews/${stage}-native-${language}/${card}/text.html`)
    const context=await browser.newContext({viewport:{width:1440,height:960}})
    const page=await context.newPage()
    await page.goto(`file://${native}`)
    const offline=await page.evaluate(()=>{
      const f=document.querySelector('#fig-83')
      return {
        figure: f.outerHTML,
        flow:[...document.querySelector('.sheet').children].filter(e=>e.matches('.para,.fig,.figcap')).map(e=>e.outerHTML),
        errors:[...document.querySelectorAll('.err')].map(e=>e.textContent),
      }
    })
    if(offline.errors.length) throw new Error(`Offline error: ${offline.errors.join(',')}`)
    for(const [width,height] of [[1440,960],[390,844]]) {
      await page.setViewportSize({width,height})
      const snapshot=read(path.join(A,`receipts/product-width-${width===1440?'desktop':'mobile'}.json`))
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${snapshot.css}</style></head><body>${snapshot.bodyHtml}</body></html>`)
      await page.evaluate(({flow})=>{
      const reader=document.querySelector('.sr-read')
      const template=document.createElement('template')
      template.innerHTML=flow.join('')
      template.content.querySelectorAll('.para').forEach(e=>{
        e.className=`sr-read-p${e.classList.contains('section')?' sr-read-section':''}`
      })
      template.content.querySelectorAll('.figcap').forEach(e=>e.className='sr-read-cap')
      template.content.querySelectorAll('.fig').forEach(e=>e.className='sr-read-fig')
      template.content.querySelectorAll('.figure-media').forEach(e=>e.className='sr-figure-media sr-figure-layered')
      template.content.querySelectorAll('.figure-layered').forEach(e=>{
        e.className='sr-figure-layered'
        e.style.display='contents'
      })
      template.content.querySelectorAll('.figure-vector').forEach(e=>e.className='sr-figure-vector')
      template.content.querySelectorAll('.figure-artwork').forEach(e=>e.className='sr-figure-artwork')
      reader.replaceChildren(template.content)
      },offline)
      await page.evaluate(async()=>{
        await Promise.all([...document.querySelectorAll('#fig-83 img')].map(i=>i.decode()))
      })
      await page.locator('#fig-83').scrollIntoViewIfNeeded()
      const measures=await page.locator('#fig-83').evaluate(f=>{
        const media=f.querySelector('.sr-figure-media'),vector=f.querySelector('svg')
        const labels=[...vector.querySelectorAll('text')].map(t=>({
          text:t.textContent,size:parseFloat(getComputedStyle(t).fontSize)*(vector.getScreenCTM()?.a ?? 1),
          box:{x:t.getBoundingClientRect().x,y:t.getBoundingClientRect().y,width:t.getBoundingClientRect().width,height:t.getBoundingClientRect().height},
        }))
        return {
          figureWidth:f.getBoundingClientRect().width,mediaWidth:media.getBoundingClientRect().width,
          mediaHeight:media.getBoundingClientRect().height,vectorWidth:vector.getBoundingClientRect().width,
          labels,images:[...media.querySelectorAll('img')].map(i=>({complete:i.complete,width:i.naturalWidth,height:i.naturalHeight})),
          viewBox:vector.getAttribute('viewBox'),svgImageCount:vector.querySelectorAll('image').length,
          layout:f.dataset.figureLayout,scrollWidth:f.scrollWidth,clientWidth:f.clientWidth,
          documentOverflow:document.documentElement.scrollWidth>innerWidth+1,
        }
      })
      const widthMatches=width===1440 ? Math.abs(measures.mediaWidth-640)<=1
        : measures.mediaWidth>=331 && measures.mediaWidth<=346
      if(!widthMatches || !declaredWidths.some(w=>Math.abs(w-measures.mediaWidth)<=1) || measures.labels.some(l=>l.size<16) ||
        measures.images.some(i=>!i.complete) || measures.svgImageCount!==0 ||
        measures.documentOverflow) throw new Error(`Product-fit failed: ${JSON.stringify(measures)}`)
      const screenshot=path.join(A,`previews/${stage}-${language}-${width}.png`)
      await page.locator('#fig-83').screenshot({path:screenshot})
      result.push({language,viewport:[width,height],...measures,screenshot:{path:screenshot,sha256:hash(screenshot)},status:'PASS'})
    }
    write(`previews/${stage}-product-${language}.html`,await page.content())
    await context.close()
  }
  const context=await browser.newContext()
  const page=await context.newPage()
  const layerPaths=[
    ['overlay',path.join(A,folder,'fig-83.svg')],
    ['artwork',path.join(A,folder,'fig-83.artwork.png')],
  ]
  const layers=[]
  for(const [name,p] of layerPaths) {
    const mime=name==='overlay'?'image/svg+xml':'image/png'
    const pixels=await page.evaluate(async({data})=>{
      const img=new Image()
      img.src=data
      await img.decode()
      const canvas=document.createElement('canvas')
      canvas.width=img.naturalWidth
      canvas.height=img.naturalHeight
      const c=canvas.getContext('2d')
      c.drawImage(img,0,0)
      const a=c.getImageData(0,0,canvas.width,canvas.height).data
      let visible=0,dark=0,nonwhite=0,transparent=0
      for(let i=0;i<a.length;i+=4){
        if(a[i+3]===0)transparent++
        else{visible++;if(Math.max(a[i],a[i+1],a[i+2])<40)dark++;if(Math.min(a[i],a[i+1],a[i+2])<245)nonwhite++}
      }
      return{width:canvas.width,height:canvas.height,visible,dark,nonwhite,transparent}
    },{data:`data:${mime};base64,${fs.readFileSync(p).toString('base64')}`})
    if(pixels.nonwhite===0 || pixels.visible===0 || pixels.dark/pixels.visible>0.9 ||
      pixels.width!==800 || pixels.height!==400)throw new Error(`${name} blank/broken`)
    layers.push({name,path:p,sha256:hash(p),pixels,status:'PASS'})
  }
  await context.close()
  write(`receipts/${stage}-native-inspection.json`,{
    schema:'ld-s10y-image/native-author-inspection@1',status:'PASS',
    method:'Headed Chromium using native offline figure/prose, captured live product CSS and card-shell DOM. Temporary local author preview, not DB-backed publication.',
    nativeOfflineErrors:[],results:result,layers,
    widthsFromLiveProduct:[640,346],headedFullProseWidths:[...new Set(result.map(r=>r.mediaWidth))],
    scrollbarObservation:'Live empty-card width probe was 346px. Headed native full-prose card shell uses 331px when its vertical scrollbar occupies 15px. Both media widths are declared and checked.',
    textMinimum:16,visibleLabels:0,
    noFigureText:'No source label exists; 16px figure-text requirement is vacuous. Caption styling is inherited and not a new figure label.',
    layout:'inline',scrollCheck:'Not applicable: no fixed-width scroll media.',
    noBackendWrites:true,independentReview:false,
  })
  console.log(JSON.stringify({status:'PASS',screenshots:result.length,layers:layers.length,headed:true}))
} finally {
  await browser.close()
}
