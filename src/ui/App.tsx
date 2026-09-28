import {useEffect,useMemo,useState} from 'react';
import {Icon} from './Icon';
import report from '../data/import-report.json';
import {assess,type Answer,type Assessment,type CatalogEntry,type CheckKey,type Checks} from '../matcher';
import {CARE,CHECK_QUESTIONS,SOURCES} from '../content';

type Screen = 'home'|'checks'|'result'|'records'|'about';
type Saved = {id:string; date:string; text:string; level:string; area:string|null};
const emptyChecks:Checks = {deformity:'unknown',bladder:'unknown',breathing:'unknown',fever:'unknown'};
const examples = ['跑步后右膝外侧疼','久坐后腰部酸胀','抬手时左肩不舒服'];
const STORE = 'human-pain-guide-saved-v1';
function readSaved():Saved[] {try{return JSON.parse(localStorage.getItem(STORE)||'[]') as Saved[]}catch{return[]}}
const source = (id:string) => SOURCES[id as keyof typeof SOURCES];

export function App(){
  const [catalog,setCatalog]=useState<CatalogEntry[]|null>(null);
  const [screen,setScreen]=useState<Screen>('home');
  const [text,setText]=useState('');
  const [checks,setChecks]=useState<Checks>(emptyChecks);
  const [saved,setSaved]=useState<Saved[]>(readSaved);
  const [opened,setOpened]=useState<number|null>(null);
  const [result,setResult]=useState<Assessment|null>(null);
  const [error,setError]=useState('');
  const savedThis = useMemo(()=>saved.some(s=>s.text===text.trim()),[saved,text]);
  useEffect(()=>{import('../data/catalog.json').then(module=>setCatalog(module.default as CatalogEntry[])).catch(()=>setError('资料未能加载，请检查网络后刷新页面。'));},[]);
  useEffect(()=>{window.scrollTo({top:0,behavior:'auto'});},[screen]);
  function start(){
    const value=text.trim();
    if(value.length<4){setError('请再描述具体一点，例如哪里不舒服、什么时候开始。');return}
    if(value.length>500){setError('请将描述缩短至 500 字以内。');return}
    setError('');setChecks(emptyChecks);
    const initial=assess(value,{deformity:'no',bladder:'no',breathing:'no',fever:'no'},catalog??[]);
    if(initial.level==='emergency'){setResult(initial);setScreen('result')}
    else setScreen('checks');
  }
  function finish(){if(!catalog)return;setResult(assess(text,checks,catalog));setScreen('result')}
  function save(){
    if(!result||savedThis)return;
    const next=[{id:crypto.randomUUID(),date:new Date().toISOString(),text:text.trim(),level:result.level,area:result.area},...saved].slice(0,30);
    localStorage.setItem(STORE,JSON.stringify(next));setSaved(next);
  }
  function remove(id:string){const next=saved.filter(s=>s.id!==id);localStorage.setItem(STORE,JSON.stringify(next));setSaved(next)}
  function exportSaved(){
    const text=saved.map(s=>`${new Date(s.date).toLocaleString('zh-CN')}\n${s.text}\n部位：${s.area??'未定位'}`).join('\n\n---\n\n');
    const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));link.download='感知身体-我的记录.txt';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
  }
  function reset(){setText('');setChecks(emptyChecks);setResult(null);setError('');setScreen('home')}
  function openSaved(item:Saved){setText(item.text);setChecks(emptyChecks);setResult(null);setScreen('checks')}
  const resolved = CHECK_QUESTIONS.filter(q=>checks[q.key]!=='unknown').length;
  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={reset} aria-label="感知身体，返回首页"><span className="brand-mark"><Icon name="heart" size={20}/></span><span>感知身体</span></button>
      <button className="header-link" onClick={()=>setScreen('about')} aria-label="关于应用" title="关于应用"><Icon name="info" size={20}/></button>
    </header>
    <main>
      {screen==='home'&&<div className="home page-enter">
        <h1>哪里不舒服</h1>
        <section className="input-card" aria-labelledby="input-title">
          <label id="input-title" htmlFor="symptom">用自己的话描述</label>
          <textarea id="symptom" value={text} maxLength={500} onChange={e=>{setText(e.target.value);setError('')}} placeholder="例如：昨天跑步后，右小腿后侧有点酸痛……" rows={5}/>
          <div className="input-foot"><span>越具体，提示越有帮助</span><span>{text.length}/500</span></div>
        </section>
        {error&&<p className="field-error" role="alert">{error}</p>}
        <div className="examples"><span>试试这样描述</span><div className="example-list">{examples.map(e=><button key={e} onClick={()=>setText(e)}>{e}<Icon name="forward" size={16}/></button>)}</div></div>
        <button className="primary-button" onClick={start} disabled={!catalog}>{catalog?'查看可能相关的部位':'正在准备资料…'} <Icon name="forward" size={20}/></button>
        <div className="privacy-line"><Icon name="lock" size={16}/> 描述只在这台设备上处理，默认不保存</div>
      </div>}
      {screen==='checks'&&<div className="question-page page-enter">
        <button className="back-link" onClick={()=>setScreen('home')}><Icon name="back" size={20}/> 返回修改描述</button>
        <div className="step-label">继续之前 · 安全确认</div>
        <h1>再确认<br/><em>几件事</em></h1>
        <p className="lead compact">这些问题帮助我们判断是否应该先寻求医疗帮助。可以选择“不确定”。</p>
        <div className="summary-quote">“{text.trim()}”</div>
        <div className="question-list">{CHECK_QUESTIONS.map((q,i)=><fieldset className="question-card" key={q.key}>
          <legend><span>{String(i+1).padStart(2,'0')}</span>{q.label}</legend>
          <div className="segmented">{([['no','没有'],['yes','有'],['unknown','不确定']] as [Answer,string][]).map(([v,l])=><button key={v} type="button" className={checks[q.key]===v?'selected':''} aria-pressed={checks[q.key]===v} onClick={()=>setChecks(s=>({...s,[q.key as CheckKey]:v}))}>{l}</button>)}</div>
        </fieldset>)}</div>
        <button className="primary-button" onClick={finish} disabled={!catalog}>查看提示 <Icon name="forward" size={20}/></button>
        <p className="question-note">已确认 {resolved}/4 项。若不确定，我们会更谨慎地建议你就医。</p>
      </div>}
      {screen==='result'&&result&&<div className="result-page page-enter" aria-live="polite">
        <button className="back-link" onClick={reset}><Icon name="back" size={20}/> 重新描述</button>
        <div className={`result-status ${result.level}`}><span className="status-icon">{result.level==='emergency'?<Icon name="heart" size={24}/>:result.level==='clinician'?<Icon name="shield" size={24}/>:<Icon name="check" size={24}/>}</span><span>{result.level==='emergency'?'需要立即关注':result.level==='clinician'?'建议进一步评估':'一般信息参考'}</span></div>
        <h1>{result.title}</h1>
        <p className="result-summary">{result.summary}</p>
        {result.reasons.length>0&&<section className="reason-box"><h2>我们注意到</h2><ul>{result.reasons.map((r,i)=><li key={i}>{r}</li>)}</ul></section>}
        {result.level!=='emergency'&&<>
          {result.area&&<div className="area-pill"><Icon name="location" size={16}/>{result.side?`${result.side} · `:''}{result.area}</div>}
          {result.candidates.length>0&&<section className="content-section"><div className="section-heading"><span className="section-index">01</span><h2>可能相关的部位</h2></div><p className="section-intro">按描述中的位置作解剖关联，不能据此判断疼痛病因。</p>
            <div className="candidate-list">{result.candidates.map((c,i)=><article key={c.label} className="candidate-card"><button aria-expanded={opened===i} onClick={()=>setOpened(opened===i?null:i)}><span className="candidate-num">0{i+1}</span><span className="candidate-title">{c.label}</span><Icon name="expand" size={20} className={opened===i?'up':''}/></button><p>{c.reason}</p>{opened===i&&<div className="candidate-detail"><strong>数据索引中的相关概念</strong>{c.matches.length?<ul>{c.matches.slice(0,5).map(m=><li key={`${m.sex}:${m.id}`}>{m.zh===m.en?m.en:m.zh}<span>{m.sex==='female'?'女性数据':'男性数据'}{m.origin==='male-derived'?' · 男性来源骨骼':m.origin==='female-donor'?' · 另一女性的腿肌':''}</span></li>)}</ul>:<p>当前原版数据没有可可靠展示的对应细分结构。</p>}<small>结构目录用于解释解剖位置，不代表已识别疼痛来源。</small></div>}</article>)}</div>
          </section>}
          {result.level==='self-care'&&<section className="content-section"><div className="section-heading"><span className="section-index">02</span><h2>可以怎样照顾自己</h2></div><div className="care-list">{CARE.filter(c=>c.title!=='近期轻微软组织扭伤或拉伤'||/扭伤|拉伤/.test(text)).map(c=><article key={c.title} className="care-card"><div className="care-dot"/><div><h3>{c.title}</h3><p>{c.body}</p><small>适用前提：{c.when}</small><a href={source(c.source).url} target="_blank" rel="noreferrer">查看来源 <Icon name="next" size={16}/></a></div></article>)}</div></section>}
        </>}
        <section className="source-section"><h2>信息来源</h2><div>{result.sourceIds.map(id=>{const s=source(id);return s?<a key={id} href={s.url} target="_blank" rel="noreferrer">{s.label}<Icon name="forward" size={16}/></a>:null})}</div></section>
        <div className="review-note">此版本为开发原型，护理和分流文案尚待临床人员审核。它不能替代面对面的诊断或治疗。</div>
        <div className="result-actions"><button className="primary-button" onClick={reset}>描述其他不适 <Icon name="reset" size={20}/></button><button className="secondary-button" onClick={save} disabled={savedThis}><Icon name="bookmark" size={20}/>{savedThis?'已保存在本机':'保存在本机'}</button></div>
      </div>}
      {screen==='records'&&<div className="simple-page page-enter"><button className="back-link" onClick={()=>setScreen('home')}><Icon name="back" size={20}/> 返回首页</button><div className="step-label">只保存在这台设备</div><h1>我的记录</h1><p className="lead compact">只有你主动保存的描述会出现在这里。重新查看时会再次询问安全问题。</p>{saved.length?<div className="record-list">{saved.map(item=><article key={item.id} className="record-card"><button className="record-open" onClick={()=>openSaved(item)}><time>{new Date(item.date).toLocaleDateString('zh-CN')}</time><span>{item.text}</span><small>{item.area??'未定位部位'} · 重新查看</small></button><button className="delete-record" onClick={()=>remove(item.id)} aria-label={`删除记录：${item.text}`} title="删除记录"><Icon name="delete" size={20}/></button></article>)}</div>:<div className="empty-state"><Icon name="bookmark" size={24}/><strong>还没有保存的记录</strong><span>查询默认不会留下记录。</span></div>}{saved.length>0&&<div className="record-actions"><button onClick={exportSaved}>导出纯文本</button><button className="clear-button" onClick={()=>{if(confirm('确定删除所有本机记录？')){localStorage.removeItem(STORE);setSaved([])}}}>清除全部记录</button></div>}</div>}
      {screen==='about'&&<div className="simple-page page-enter"><button className="back-link" onClick={()=>setScreen('home')}><Icon name="back" size={20}/> 返回首页</button><div className="step-label">关于这个工具</div><h1>简单，<br/><em>也要诚实。</em></h1><p className="lead compact">它帮助你理解疼痛附近可能有哪些解剖结构，并找到一般护理与就医信息。文字描述不能确定病因。</p><div className="about-stats"><div><strong>{report.maleConcepts.toLocaleString()}</strong><span>男性参考概念</span></div><div><strong>{report.femaleConcepts.toLocaleString()}</strong><span>女性参考概念</span></div></div><section className="about-block"><h2>数据的范围</h2><p>后台索引完整导入两个原版模型的 {report.concepts.toLocaleString()} 个命名概念，不下载或展示三维模型。女性参考数据不完整，部分骨骼来自男性、腿部肌肉来自另一女性；匹配时会保留这些来源标记。解剖数据不包含症状诊断知识。</p></section><section className="about-block"><h2>隐私</h2><p>描述与安全确认在你的设备内处理。只有主动保存的记录才写入浏览器本地存储；删除记录后从本机移除。打开外部资料链接时，该网站适用自己的隐私规则。</p></section><section className="about-block"><h2>资料与署名</h2><p>BodyParts3D 4.0、HuBMAP Human Reference Atlas 女性版和 Visible Human Female 下肢资料采用 CC BY 4.0；详细原始署名请查看下方链接。护理信息来自 NHS 和美国国家医学图书馆 MedlinePlus。</p><a href="https://github.com/nonspt/human-atlas-cn/blob/main/public/ATTRIBUTION.md" target="_blank" rel="noreferrer">查看完整解剖数据署名 <Icon name="forward" size={16}/></a></section><div className="review-note">开发原型 · 未经临床内容审核 · 请勿用于诊断或治疗决策</div></div>}
    </main>
    {(screen==='home'||screen==='records')&&<nav className="bottom-nav" aria-label="主要导航"><button className={screen==='home'?'active':''} onClick={()=>setScreen('home')}><Icon name="heart" size={20}/><span>首页</span></button><button className={screen==='records'?'active':''} onClick={()=>setScreen('records')}><Icon name="bookmark" size={20}/><span>记录</span></button></nav>}
  </div>;
}


