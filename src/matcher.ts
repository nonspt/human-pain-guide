export type Answer = 'yes' | 'no' | 'unknown';
export type CheckKey = 'deformity' | 'bladder' | 'breathing' | 'fever';
export type Checks = Record<CheckKey, Answer>;
export type Level = 'emergency' | 'clinician' | 'self-care';
export type CatalogEntry = {id:string; en:string; zh:string; sex:string; system:string; origin:string; elements:number};
export type Candidate = {label:string; reason:string; terms:string[]; matches:CatalogEntry[]};
export type Assessment = {level:Level; area:string|null; side:string|null; title:string; summary:string; candidates:Candidate[]; reasons:string[]; sourceIds:string[]};

type Area = {id:string; label:string; aliases:string[]; candidates:{label:string; terms:string[]; reason:string}[]};
export const AREAS:Area[] = [
  {id:'neck',label:'颈部',aliases:['脖子','颈部','颈椎','后颈','落枕','颈'],candidates:[
    {label:'颈部肌群',terms:['sternocleidomastoid','trapezius'],reason:'位于颈侧和后颈，参与头颈活动。'},
    {label:'颈椎与周围组织',terms:['cervical vertebra'],reason:'颈部骨骼与相邻软组织也可能与局部不适有关。'}]},
  {id:'shoulder',label:'肩部',aliases:['肩膀','肩部','肩胛','肩峰','肩袖','肩'],candidates:[
    {label:'肩部肌群',terms:['deltoid','supraspinatus','infraspinatus'],reason:'这些肌肉参与抬臂和肩部旋转。'},
    {label:'肩胛骨与锁骨',terms:['scapula','clavicle'],reason:'肩带骨骼是肌肉与关节的支撑结构。'}]},
  {id:'arm',label:'手臂',aliases:['上臂','手臂','胳膊','肱骨','臂'],candidates:[
    {label:'上臂肌群',terms:['biceps brachii','triceps brachii'],reason:'上臂肌群参与屈伸手肘。'},
    {label:'肱骨',terms:['humerus'],reason:'上臂疼痛也可能与骨骼或关节周围组织有关。'}]},
  {id:'wrist',label:'手腕与前臂',aliases:['手腕','腕部','前臂','手肘','肘部','腕','肘'],candidates:[
    {label:'前臂肌群',terms:['flexor carpi','extensor carpi'],reason:'前臂肌肉和肌腱参与手腕动作。'},
    {label:'前臂与腕部骨骼',terms:['radius','ulna','carpal bone'],reason:'这些骨骼参与前臂和手腕的支撑与活动。'}]},
  {id:'back',label:'背部与腰部',aliases:['下背','腰背','腰部','后背','背部','腰椎','腰疼','腰痛','腰'],candidates:[
    {label:'背部肌群',terms:['longissimus thoracis','iliocostalis lumborum'],reason:'背部肌群参与姿势维持和躯干活动。'},
    {label:'腰椎及周围组织',terms:['lumbar vertebra','thoracolumbar fascia'],reason:'腰部疼痛不能仅由位置区分肌肉、骨骼或神经来源。'}]},
  {id:'hip',label:'髋部与臀部',aliases:['髋部','髋关节','臀部','屁股','胯部','髋','臀'],candidates:[
    {label:'臀部肌群',terms:['gluteus maximus','gluteus medius'],reason:'臀肌参与髋部稳定和行走。'},
    {label:'骨盆与股骨',terms:['pelvis','femur'],reason:'髋部不适也可能涉及关节和邻近骨骼。'}]},
  {id:'thigh',label:'大腿',aliases:['大腿','股四头肌','大腿后侧','大腿前侧'],candidates:[
    {label:'大腿肌群',terms:['quadriceps femoris','biceps femoris','rectus femoris'],reason:'大腿肌肉参与髋、膝活动。'},
    {label:'股骨',terms:['femur'],reason:'大腿骨骼和周围组织同样可能相关。'}]},
  {id:'knee',label:'膝部',aliases:['膝盖','膝部','膝关节','髌骨','膝'],candidates:[
    {label:'膝周肌群',terms:['quadriceps femoris','gastrocnemius'],reason:'膝周肌肉参与屈伸和稳定。'},
    {label:'髌骨与膝周骨骼',terms:['patella','tibia','femur'],reason:'膝痛的位置本身无法区分肌肉、关节和骨骼。'}]},
  {id:'calf',label:'小腿',aliases:['小腿','腿肚','小腿肚','腓肠肌','胫骨'],candidates:[
    {label:'小腿后侧肌群',terms:['gastrocnemius','soleus'],reason:'这组肌肉在跑跳和踮脚时工作。'},
    {label:'胫骨与腓骨',terms:['tibia','fibula'],reason:'小腿骨骼和周围组织也可能相关。'}]},
  {id:'ankle',label:'脚踝',aliases:['脚踝','足踝','踝关节','踝部','跟腱','踝'],candidates:[
    {label:'踝周软组织',terms:['calcaneal tendon','Achilles tendon','peroneus longus'],reason:'踝周肌腱与韧带参与稳定和推进。'},
    {label:'踝部骨骼',terms:['talus','calcaneus','fibula'],reason:'扭伤或撞击后需要同时考虑骨骼受伤的可能。'}]},
  {id:'foot',label:'足部',aliases:['脚底','足底','脚背','脚掌','足部','脚趾','足跟','脚跟'],candidates:[
    {label:'足部软组织',terms:['plantar fascia','flexor digitorum brevis'],reason:'足底软组织参与支撑和行走。'},
    {label:'足部骨骼',terms:['calcaneus','metatarsal bone'],reason:'足跟、足掌疼痛也可能来自骨骼或关节。'}]},
];

const has = (text:string, words:string[]) => words.some(word=>text.includes(word));
const denies = (text:string, word:string) => new RegExp(`(?:没有|无|不伴|未见|否认).{0,4}${word}`).test(text);
function positive(text:string, words:string[]) { return words.some(word=>text.includes(word) && !denies(text,word)); }
function detectArea(text:string) {
  const found = AREAS.flatMap(area=>area.aliases.filter(a=>text.includes(a)).map(a=>({area, length:a.length})));
  return found.sort((a,b)=>b.length-a.length)[0]?.area ?? null;
}
function detectSide(text:string) {
  if (has(text,['双侧','两侧','左右','双腿','双手'])) return '双侧';
  if (has(text,['右侧','右边','右腿','右手','右肩','右膝','右脚','右'])) return '右侧';
  if (has(text,['左侧','左边','左腿','左手','左肩','左膝','左脚','左'])) return '左侧';
  return null;
}
function lookUp(label:string, terms:string[], catalog:CatalogEntry[], side:string|null) {
  const normalized=terms.map(t=>t.toLowerCase());
  const excluded=['arterial','venous','nervous','cardiac','sensory','respiratory','digestive','urinary','lymphatic','endocrine','reproductive','brain','pregnancy','integumentary'];
  const patterns=normalized.map(t=>new RegExp(`(?:^|[^a-z])${t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(?:$|[^a-z])`));
  const opposite=side==='右侧'?/(?:^left |\(left\))/i:side==='左侧'?/(?:^right |\(right\))/i:null;
  const found=catalog.filter(c=>!excluded.includes(c.system)&&!opposite?.test(c.en)&&patterns.some(p=>p.test(c.en.toLowerCase())));
  const score=(c:CatalogEntry)=>{
    const name=c.en.toLowerCase();
    const sideMatch=side==='右侧'?/(?:^right |\(right\))/i.test(name):side==='左侧'?/(?:^left |\(left\))/i.test(name):false;
    const exact=normalized.some(t=>name===t||name===`right ${t}`||name===`left ${t}`||name===`${t} (right)`||name===`${t} (left)`);
    return (sideMatch?-10:0)+(exact?-5:0)+name.length/100;
  };
  const ordered=[...found.filter(c=>c.sex==='male').sort((a,b)=>score(a)-score(b)).slice(0,3),...found.filter(c=>c.sex==='female').sort((a,b)=>score(a)-score(b)).slice(0,2)];
  return ordered;
}
export function assess(raw:string, checks:Checks, catalog:CatalogEntry[]):Assessment {
  const text = raw.trim().toLowerCase();
  const area = detectArea(text);
  const side = detectSide(text);
  const emergency:string[] = [];
  const clinician:string[] = [];
  const injury = positive(text,['摔','跌','撞','扭伤','外伤','车祸','砸伤','骨折']);
  if (checks.breathing==='yes' || positive(text,['呼吸困难','喘不过气','胸痛','胸口痛'])) emergency.push('伴随胸痛或呼吸困难');
  if (checks.bladder==='yes' || positive(text,['大小便失禁','尿不出来','尿潴留','会阴麻木','裆部麻木'])) emergency.push('出现排尿排便异常或会阴感觉改变');
  if (checks.deformity==='yes' || (injury && positive(text,['变形','畸形','发冷','发紫','发青']))) emergency.push('外伤后出现变形或肢体循环异常');
  if (positive(text,['突然无力','无法活动','不能动','瘫痪','双腿无力'])) emergency.push('出现明显或突然的肢体无力');
  if (injury && positive(text,['麻木','发麻','刺痛','没有感觉'])) emergency.push('外伤后出现感觉异常');
  if (checks.fever==='yes' || positive(text,['发烧','发热','红肿发热'])) clinician.push('伴随发热或明显红肿');
  if (positive(text,['麻木','发麻','持续刺痛','无力']) && emergency.length===0) clinician.push('伴随感觉或力量变化');
  if (positive(text,['越来越痛','加重','剧痛','严重疼痛','不能走路','无法负重'])) clinician.push('疼痛明显、加重或影响活动');
  if (positive(text,['好几天','一周','两周','长期','反复'])) clinician.push('症状持续或反复');
  if (positive(text,['骨头疼','骨痛']) && !injury) clinician.push('不明原因的骨痛需要专业评估');
  if (injury) clinician.push('有近期外伤或扭伤史');
  if (Object.values(checks).includes('unknown')) clinician.push('部分安全问题尚不确定');
  if (emergency.length) return {level:'emergency',area:area?.label??null,side,title:'请尽快寻求急诊帮助',summary:'这些症状可能需要及时由医护人员评估。请拨打当地急救电话（中国大陆为 120）或前往急诊；不要继续尝试拉伸或自行处理受伤部位。',candidates:[],reasons:emergency,sourceIds:['nhs-back','nhs-sprain','medline-muscle']};
  const level:Level = clinician.length ? 'clinician' : 'self-care';
  const candidates = area ? area.candidates.map(c=>({...c,matches:lookUp(c.label,c.terms,catalog,side)})) : [];
  return {
    level,area:area?.label??null,side,
    title:level==='clinician'?'建议联系医生或专业人员':'先了解可能相关的部位',
    summary:level==='clinician'?'根据你的描述，建议由医疗专业人员进一步评估。下面的结构仅供理解部位，不表示已确定病因。':area?'这些是与所述部位可能相关的解剖结构，不能仅凭文字判断疼痛来源。':'目前无法可靠定位到某个肌肉或骨骼区域。请补充具体部位，或咨询医疗专业人员。',
    candidates:area?candidates:[],reasons:clinician,sourceIds:level==='clinician'?['nhs-back','nhs-sprain','medline-muscle']:['nhs-sprain','medline-muscle'],
  };
}
