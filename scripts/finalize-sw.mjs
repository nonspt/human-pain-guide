import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const assets=fs.readdirSync(path.join(dist,'assets')).filter(name=>/\.(?:js|css)$/.test(name)).map(name=>`${process.env.GITHUB_PAGES?'/human-pain-guide/':'/'}assets/${name}`);
if(assets.length<2)throw new Error('未找到构建产物，无法生成离线缓存');
const scope=process.env.GITHUB_PAGES?'/human-pain-guide/':'/';
const files=[scope,`${scope}index.html`,`${scope}manifest.webmanifest`,`${scope}icon.svg`,...assets];
const hash=crypto.createHash('sha256').update(html).digest('hex').slice(0,12);
const source=fs.readFileSync(path.join(root,'public/sw.js'),'utf8');
fs.writeFileSync(path.join(dist,'sw.js'),source.replace('__CACHE__',JSON.stringify(`human-pain-guide-${hash}`)).replace('__ASSETS__',JSON.stringify(files)));
console.log(`离线缓存已包含 ${files.length} 个应用资源。`);
