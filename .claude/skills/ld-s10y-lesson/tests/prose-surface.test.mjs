import test from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {assertProseSurface} from '../tools/check_product.mjs'

const require=createRequire(new URL('../../../../app/package.json',import.meta.url))
const {chromium}=require('@playwright/test')

test('empty supplement surface passes but hidden required prose is rejected',async()=>{
 const browser=await chromium.launch({headless:false})
 try{
  const page=await browser.newPage()
  await page.setContent('<div class="sr-deck"><div class="sr-read" style="display:none"></div></div>')
  await assertProseSurface(page,{prose:[]})
  await assert.rejects(assertProseSurface(page,{prose:[{kind:'p',text:'Required text'}]}))
  await page.setContent('<div class="sr-deck"><div class="sr-read">Required text</div></div>')
  await assertProseSurface(page,{prose:[{kind:'p',text:'Required text'}]})
  await assert.rejects(assertProseSurface(page,{prose:[]}))
 }finally{await browser.close()}
})
