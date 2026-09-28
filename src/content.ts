export const SOURCES = {
  'nhs-back':{label:'NHS · 背痛就医建议',url:'https://www.nhs.uk/conditions/back-pain/'},
  'nhs-sprain':{label:'NHS · 扭伤与拉伤',url:'https://www.nhs.uk/conditions/sprains-and-strains/'},
  'medline-muscle':{label:'MedlinePlus · 肌肉疼痛',url:'https://medlineplus.gov/ency/article/003178.htm'},
  'medline-bone':{label:'MedlinePlus · 骨痛',url:'https://medlineplus.gov/ency/article/003180.htm'},
} as const;

export const CHECK_QUESTIONS = [
  {key:'deformity',label:'受伤后，部位是否变形、发冷或明显变色？'},
  {key:'bladder',label:'是否出现新的大小便控制异常或会阴麻木？'},
  {key:'breathing',label:'是否有胸痛或呼吸困难？'},
  {key:'fever',label:'是否发热，或疼痛处明显红肿发热？'},
] as const;

export const CARE = [
  {title:'让活动回到舒适范围',body:'暂时减少会明显加重疼痛的动作。能舒适活动时，避免长时间完全不动；不要强行拉伸。',when:'仅适用于没有紧急信号、且活动不会明显加重症状时。',source:'nhs-back'},
  {title:'近期轻微软组织扭伤或拉伤',body:'在受伤最初几天，可参考 NHS 的保护、休息、冰敷、加压和抬高原则。冰敷需隔着布，避免直接接触皮肤。',when:'仅适用于疑似轻微扭伤／拉伤；若变形、麻木、发冷、无法负重或疼痛明显，应先就医。',source:'nhs-sprain'},
  {title:'留意变化',body:'记录疼痛开始的时间、部位、诱因，以及是否出现麻木、无力、发热或肿胀；症状持续、加重或影响日常活动时联系医疗专业人员。',when:'适用于继续观察的情况；出现新的危险信号时立即就医。',source:'medline-muscle'},
] as const;
