import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.resolve(root, '../human-atlas-cn');
const read = (p) => JSON.parse(fs.readFileSync(path.join(source, p), 'utf8'));
const male = read('public/models/atlas.json');
const female = read('public/models/atlas-female.json');
const zh = read('app/dict.json');
const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(path.join(source, p))).digest('hex');
const femaleTermsSource=fs.readFileSync(path.join(source,'app/anatomy-zh.ts'),'utf8');
const femaleTermBlock=femaleTermsSource.match(/FEMALE_TERMS_ZH:[^=]+?=\s*\{([\s\S]*?)\};/)?.[1]||'';
const femaleNames={};
for(const match of femaleTermBlock.matchAll(/'((?:\\'|[^'])*)'\s*:\s*'((?:\\'|[^'])*)'/g)) femaleNames[match[1].replace(/\\'/g,"'")]=match[2].replace(/\\'/g,"'");
Object.assign(femaleNames,{'gastrocnemius medial':'腓肠肌内侧头','gastrocnemius lateral':'腓肠肌外侧头'});
function translate(name) {
  const key=name.toLowerCase().trim();
  const direct=zh[key]||femaleNames[key];
  if(direct){
    const right=zh[`right ${key}`]||femaleNames[`right ${key}`];
    const left=zh[`left ${key}`]||femaleNames[`left ${key}`];
    if(right&&left&&direct===right&&right.startsWith('右')&&left.startsWith('左'))return direct.slice(1);
    return direct;
  }
  const side=key.match(/\s*\((left|right)\)$/)||key.match(/^(left|right)\s+/);
  if(side){
    const base=key.replace(/\s*\((left|right)\)$/,'').replace(/^(left|right)\s+/,'');
    const translated=translate(base);
    if(translated!==base)return `${side[1]==='left'?'左':'右'}${translated}`;
  }
  return name;
}
function origin(system, sex) {
  if (sex === 'male') return 'bodyparts3d';
  if (system === 'borrowed') return 'male-derived';
  if (system === 'donor-muscle') return 'female-donor';
  return 'hra-female';
}
function convert(atlas, sex) {
  const parts = new Map(atlas.parts.map(p => [p.id, p]));
  return atlas.concepts.map(c => {
    const systems = c.elements.map(id => parts.get(id)?.system).filter(Boolean);
    const system = systems.sort((a,b) => systems.filter(x=>x===b).length - systems.filter(x=>x===a).length)[0] || 'unknown';
    const label = translate(c.name);
    return { id:c.id, en:c.name, zh:label, sex, system, origin:origin(system,sex), elements:c.elements.length };
  });
}
const concepts = [...convert(male, 'male'), ...convert(female, 'female')];
if (concepts.length !== 4871 || male.parts.length !== 2234 || female.parts.length !== 1220) throw new Error('上游模型数量发生变化，请复核导入规则');
const report = {
  generatedAt:new Date().toISOString(), concepts:concepts.length,
  maleConcepts:male.concepts.length, femaleConcepts:female.concepts.length,
  maleParts:male.parts.length, femaleParts:female.parts.length,
  femaleBorrowedParts:female.parts.filter(p=>p.system==='borrowed').length,
  femaleDonorMuscleParts:female.parts.filter(p=>p.system==='donor-muscle').length,
  untranslated:concepts.filter(c=>c.zh===c.en).length,
  sourceVersions:{male:male.version,female:female.version},
  sha256:{male:hash('public/models/atlas.json'),female:hash('public/models/atlas-female.json'),dictionary:hash('app/dict.json')},
};
fs.mkdirSync(path.join(root,'src/data'),{recursive:true});
fs.writeFileSync(path.join(root,'src/data/catalog.json'),JSON.stringify(concepts));
fs.writeFileSync(path.join(root,'src/data/import-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(`导入 ${concepts.length} 个概念；未翻译 ${report.untranslated} 个（保留英文原名）。`);
