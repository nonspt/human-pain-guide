import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../src/data/catalog.json' with {type:'json'};
import {assess} from '../src/matcher.ts';

const no = {deformity:'no',bladder:'no',breathing:'no',fever:'no'};

test('全部原版概念进入无几何数据的索引',()=>{
  assert.equal(catalog.length,4871);
  assert.equal(catalog.filter(x=>x.sex==='male').length,3432);
  assert.equal(catalog.filter(x=>x.sex==='female').length,1439);
  assert.ok(catalog.every(x=>!('positions' in x)&&!('bounds' in x)));
});
test('普通运动后疼痛只显示可能相关区域',()=>{
  const r=assess('昨天跑步后右小腿后侧酸痛，能走路，没有外伤，也没有麻木',no,catalog);
  assert.equal(r.level,'self-care');assert.equal(r.area,'小腿');assert.equal(r.side,'右侧');assert.ok(r.candidates.length>0);
});
test('大小便异常和会阴麻木先紧急分流',()=>{
  const r=assess('腰痛，突然出现尿不出来、会阴麻木',no,catalog);
  assert.equal(r.level,'emergency');assert.equal(r.candidates.length,0);
});
test('外伤后变形和麻木先紧急分流',()=>{
  const r=assess('摔倒后脚踝变形，脚发麻',no,catalog);
  assert.equal(r.level,'emergency');assert.equal(r.candidates.length,0);
});
test('否定表达不触发不存在的危险信号',()=>{
  const r=assess('右膝运动后酸，没有麻木，没有胸痛',no,catalog);
  assert.equal(r.level,'self-care');
});
test('安全问题回答不确定时采取更谨慎分流',()=>{
  const r=assess('左肩抬起来有点疼',{...no,fever:'unknown'},catalog);
  assert.equal(r.level,'clinician');
});
test('不明原因骨痛需要专业评估',()=>{
  const r=assess('小腿骨头疼，没有外伤',no,catalog);
  assert.equal(r.level,'clinician');
});
test('部位不明时不臆造结构',()=>{
  const r=assess('身体总是酸痛',no,catalog);
  assert.equal(r.area,null);assert.deepEqual(r.candidates,[]);
});
test('侧别短语能够匹配肩部，且骨骼卡不混入胫骨前肌',()=>{
  assert.equal(assess('左肩抬起时酸痛',no,catalog).area,'肩部');
  assert.equal(assess('右膝酸痛',no,catalog).area,'膝部');
  const calf=assess('右小腿后侧酸痛',no,catalog);
  const bone=calf.candidates.find(c=>c.label==='胫骨与腓骨');
  assert.ok(bone?.matches.length);
  assert.ok(bone.matches.every(m=>!m.en.toLowerCase().includes('tibialis')));
});
test('背部候选结构来自现有数据',()=>{
  const r=assess('腰部酸痛',no,catalog);
  assert.ok(r.candidates.find(c=>c.label==='背部肌群')?.matches.length);
});
