(() => {
  const data=window.SITE_DATA;
  const $=id=>document.getElementById(id);
  const defaultEnglish=new URLSearchParams(location.search).get('lang')!=='zh';
  $('cv-language').value=defaultEnglish?'en':'zh';
  const lang=()=> $('cv-language').value;
  const tr=x=>typeof x==='string'?x:x[lang()];
  const sectionLabels={education:{zh:'教育经历',en:'Education'},projects:{zh:'科研项目',en:'Research Projects'},publications:{zh:'论文成果',en:'Publications'},service:{zh:'学术服务',en:'Academic Service'},personal:{zh:'个人荣誉',en:'Personal Recognition'},student:{zh:'指导学生获奖',en:'Student Awards'}};
  const items={
    education:data.education.map((x,i)=>({id:`education-${i}`,section:'education',label:()=>`${x.years} · ${tr(x.degree)} · ${tr(x.school)}`,selected:true})),
    projects:data.projects.map((x,i)=>({id:`projects-${i}`,section:'projects',label:()=>`${tr(x.title)} · ${tr(x.funder)}`,selected:i<6})),
    publications:data.publications.map((x,i)=>({id:`publications-${i}`,section:'publications',label:()=>`${x.year||'—'} · ${x.title}`,selected:i<8})),
    service:data.service.flatMap((group,g)=>group.items.map((x,i)=>({id:`service-${g}-${i}`,section:'service',label:()=>tr(x.name),selected:false}))),
    personal:data.personalAwards.map((x,i)=>({id:`personal-${i}`,section:'personal',label:()=>`${x.year} · ${tr(x.title)}`,selected:i<4})),
    student:data.studentAwards.map((x,i)=>({id:`student-${i}`,section:'student',label:()=>`${x.year} · ${tr(x.title)}`,selected:i<4})),
  };
  const all=Object.values(items).flat();
  const selection=new Set(all.filter(x=>x.selected).map(x=>x.id));
  function make(tag,cls,content){const e=document.createElement(tag);if(cls)e.className=cls;if(content!==undefined)e.textContent=content;return e;}
  function labels(){
    const en=lang()==='en'; document.documentElement.lang=en?'en':'zh-CN';
    document.title=en?'Build an Academic CV | Wei-Kai Li':'定制学术简历 | 李伟凯';
    $('back-label').textContent=en?'Back to homepage':'返回主页';$('back-home').href=en?'../':'../cn/';$('other-site-link').href=en?'../cn/':'../';$('other-site-link').textContent=en?'中文网站 ↗':'English site ↗';$('builder-title').textContent=en?'Build an Academic CV':'定制学术简历';
    $('page-title').textContent=en?'Choose content for an A4 CV':'选择内容，生成 A4 简历';
    $('page-description').textContent=en?'Select research projects, publications, service, and awards. Preview the result, then use the print dialog to save it as a PDF.':'勾选需要的科研项目、论文、学术服务和奖项。右侧实时预览；点击“生成 PDF”后，在打印窗口选择“保存为 PDF”。';
    $('language-label').textContent=en?'CV language':'简历语言';$('select-all').textContent=en?'Select all':'全部选择';$('select-none').textContent=en?'Clear all':'清空选择';
    $('preview-label').textContent=en?'A4 preview':'A4 预览';$('print-cv').textContent=en?'Generate A4 PDF ↓':'生成 A4 PDF ↓';
    $('print-note').textContent=en?'In the print dialog, choose “Save as PDF”. The page size is A4.':'浏览器打印窗口打开后，请选择“保存为 PDF”；版式已设置为 A4。';
  }
  function renderControls(){
    const root=$('selection-groups');root.replaceChildren();
    Object.entries(items).forEach(([section,entries])=>{const details=make('details','selection-group');details.open=section==='projects'||section==='publications';const summary=make('summary','',tr(sectionLabels[section]));details.append(summary);const list=make('div','selection-items');entries.forEach(item=>{const label=make('label','selection-item');const box=make('input');box.type='checkbox';box.checked=selection.has(item.id);box.dataset.itemId=item.id;label.append(box,make('span','',item.label()));list.append(label);});details.append(list);root.append(details);});
  }
  function appendSection(root,key,renderItem){const selected=items[key].filter(x=>selection.has(x.id));if(!selected.length)return;const section=make('section');section.append(make('h2','',tr(sectionLabels[key])));const list=make('ol');selected.forEach(x=>{const li=make('li');renderItem(li,x);list.append(li);});section.append(list);root.append(section);}
  function renderPreview(){
    const root=$('cv-preview');root.replaceChildren(); const en=lang()==='en';
    const header=make('div','cv-header');const identity=make('div','cv-identity');
    identity.append(make('h1','',en?'Wei-Kai Li':'李伟凯'),make('p','cv-subtitle',en?'Professor · Doctoral Supervisor · Taishan Scholars Young Expert':'教授 · 博士生导师 · 泰山学者青年专家'),make('p','cv-contact',`leeweikai@sdjzu.edu.cn · ${en?'School of Computer Science and Artificial Intelligence, Shandong Jianzhu University':'山东建筑大学计算机与人工智能学院'} · ${en?'School of Mathematics and Statistics, Chongqing Jiaotong University':'重庆交通大学数学与统计学院'} · ${en?'Panoramic Medical Imaging Center':'全景医学影像中心'}`));
    const portrait=make('img','cv-portrait');portrait.src='../assets/profile.jpeg?v=20261004m';portrait.alt=en?'Portrait of Wei-Kai Li':'李伟凯照片';portrait.width=1279;portrait.height=1929;
    header.append(identity,portrait);root.append(header);
    appendSection(root,'education',(li,x)=>{li.textContent=x.label();});
    appendSection(root,'projects',(li,x)=>{li.textContent=x.label();});
    const selectedPubs=items.publications.filter(x=>selection.has(x.id)).map(x=>data.publications[Number(x.id.split('-')[1])]).sort((a,b)=>(b.year||0)-(a.year||0));
    if(selectedPubs.length){const section=make('section','cv-publications');section.append(make('h2','',tr(sectionLabels.publications)));const list=make('ol');selectedPubs.forEach(p=>list.append(make('li','',p.gbtCitation||`${p.title}. ${p.citation}`)));section.append(list);root.append(section);}
    appendSection(root,'service',(li,x)=>{li.textContent=x.label();});
    appendSection(root,'personal',(li,x)=>{li.textContent=x.label();});
    appendSection(root,'student',(li,x)=>{li.textContent=x.label();});
    $('selection-count').textContent=en?`${selection.size} items selected`:`已选择 ${selection.size} 项`;
  }
  $('selection-groups').addEventListener('change',e=>{if(e.target.matches('input[type=checkbox]')){const id=e.target.dataset.itemId;e.target.checked?selection.add(id):selection.delete(id);renderPreview();}});
  $('cv-language').addEventListener('change',()=>{labels();renderControls();renderPreview();});
  $('select-all').addEventListener('click',()=>{all.forEach(x=>selection.add(x.id));renderControls();renderPreview();});
  $('select-none').addEventListener('click',()=>{selection.clear();renderControls();renderPreview();});
  $('print-cv').addEventListener('click',()=>{if(!selection.size){alert(lang()==='en'?'Select at least one item.':'请至少选择一项内容。');return;}document.title=(lang()==='en'?'Wei-Kai-Li-CV':'李伟凯-学术简历');window.print();});
  labels();renderControls();renderPreview();
})();
