import assert from 'node:assert/strict';
import path from 'node:path';
import {chromium} from 'playwright-core';

const chrome=process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const url=process.env.APP_URL||'http://localhost:5173/';
const browser=await chromium.launch({executablePath:chrome,headless:true,args:['--no-sandbox']});
const width=Number(process.env.VIEWPORT_WIDTH||390);
const dark=process.env.COLOR_SCHEME==='dark';
const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,colorScheme:dark?'dark':'light'});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const requests=[];
page.on('request',r=>requests.push(r.url()));
try{
  await page.goto(url,{waitUntil:'networkidle'});
  await page.getByRole('button',{name:/查看可能相关的部位/}).waitFor();
  await page.waitForTimeout(350);
  assert.deepEqual(await page.locator('.home h1').allTextContents(),['哪里不舒服']);
  assert.equal(await page.locator('.home > .eyebrow, .home > .lead').count(),0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'首页发生横向溢出');
  assert.ok(await page.evaluate(()=>{const c=document.querySelector('.home .primary-button')?.getBoundingClientRect();const n=document.querySelector('.bottom-nav')?.getBoundingClientRect();return c&&n&&c.bottom<=n.top+1}),'首页主按钮被底部导航遮挡');
  if(process.env.QA_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.QA_SCREENSHOT_DIR,`pain-guide-home${dark?'-dark':''}.png`),fullPage:true});
  await page.getByRole('textbox',{name:'用自己的话描述'}).fill('昨天跑完步右小腿后侧酸痛，没有外伤也没有麻木');
  await page.getByRole('button',{name:/查看可能相关的部位/}).click();
  const negative=page.getByRole('button',{name:'没有',exact:true});
  for(let i=0;i<4;i++)await negative.nth(i).click();
  await page.getByRole('button',{name:'查看提示'}).click();
  await page.getByRole('heading',{name:'先了解可能相关的部位'}).waitFor();
  await page.waitForTimeout(350);
  assert.ok(await page.getByText(/右侧 · 小腿/).count()>0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'结果页发生横向溢出');
  if(process.env.QA_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.QA_SCREENSHOT_DIR,`pain-guide-result${dark?'-dark':''}.png`),fullPage:true});
  await page.getByRole('button',{name:'保存在本机'}).click();
  await page.getByRole('button',{name:/描述其他不适/}).click();
  await page.getByRole('button',{name:'记录'}).click();
  assert.ok(await page.getByText('昨天跑完步右小腿后侧酸痛，没有外伤也没有麻木').count()>0);
  await page.getByRole('button',{name:'首页',exact:true}).click();
  await page.getByRole('textbox',{name:'用自己的话描述'}).fill('摔倒后脚踝变形，脚发麻');
  await page.getByRole('button',{name:/查看可能相关的部位/}).click();
  await page.getByRole('heading',{name:'请尽快寻求急诊帮助'}).waitFor();
  assert.equal(await page.getByText('可以怎样照顾自己').count(),0);
  assert.equal(errors.length,0,`浏览器脚本错误：${errors.join('; ')}`);
  assert.equal(requests.some(r=>/\.(?:bin|glb|gltf)(?:\?|$)/.test(r)),false,'移动端不应加载三维模型');
  if(process.env.OFFLINE_CHECK){
    await page.evaluate(()=>navigator.serviceWorker.ready);
    await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
    await page.context().setOffline(true);
    await page.reload({waitUntil:'domcontentloaded'});
    await page.getByRole('button',{name:/查看可能相关的部位/}).waitFor();
    assert.ok(await page.getByRole('button',{name:/查看可能相关的部位/}).isEnabled(),'离线索引未加载');
    assert.equal(errors.length,0,`离线页面错误：${errors.join('; ')}`);
  }
  console.log('iPhone 尺寸浏览器流程通过：输入、分流、结果、记录；无三维资源请求或横向溢出。');
}finally{await browser.close()}
