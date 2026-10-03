(() => {
  const data = window.SITE_DATA;
  const en = document.documentElement.lang === 'en';
  const base = en ? '../' : './';
  const t = (value) => typeof value === 'string' ? value : (en ? value.en : value.zh);
  const el = (tag, className, text) => { const x = document.createElement(tag); if (className) x.className = className; if (text !== undefined) x.textContent = text; return x; };
  const link = (path, label) => { const a = el('a', '', label); a.href = base + path; a.download = ''; return a; };

  const newsList = document.getElementById('news-list');
  data.news.forEach(item => { const card=el('article','news-item'); card.append(el('span','news-year',String(item.year))); const body=el('div'); body.append(el('h3','',t(item.title)),el('p','',t(item.detail)),link(item.file,en?'Download certificate PDF ↓':'下载证书 PDF ↓')); card.append(body); newsList.append(card); });

  const education = document.getElementById('education-list');
  data.education.forEach(item => { const row = el('div','timeline-item'); row.append(el('div','timeline-year',item.years), el('h3','',t(item.degree)), el('p','',t(item.school))); education.append(row); });

  const projectList = document.getElementById('project-list');
  data.projects.forEach(item => { const card=el('article','project'); const head=el('div','project-header'); head.append(el('span','',t(item.funder)),el('span','',t(item.role))); card.append(head,el('h3','',t(item.title))); if(item.note)card.append(el('p','',t(item.note))); projectList.append(card); });

  const serviceList = document.getElementById('service-list');
  data.service.forEach(group => { const card=el('article','service-card'); card.append(el('h3','',t(group.title))); const ul=el('ul'); group.items.forEach(item => { const li=el('li'); li.append(document.createTextNode(t(item.name))); if(item.file){li.append(document.createTextNode(' · '),link(item.file,en?'Certificate ↓':'聘书／证明 ↓'));} ul.append(li); }); card.append(ul); serviceList.append(card); });

  function renderAwards(target, items) {
    const list=document.getElementById(target);
    items.forEach(item => { const card=el('article','award'); const top=el('div','award-top'); top.append(el('h4','',t(item.title)),el('span','award-year',String(item.year))); card.append(top); if(item.note)card.append(el('p','',t(item.note))); const files=el('div','award-files'); item.files.forEach((file,i)=>files.append(link(file.path,t(file.label || {zh:`下载材料 ${i+1} ↓`,en:`Evidence ${i+1} ↓`})))); card.append(files); list.append(card); });
  }
  renderAwards('personal-awards',data.personalAwards);
  renderAwards('student-awards',data.studentAwards);

  const pubList=document.getElementById('publication-list');
  const search=document.getElementById('pub-search');
  const area=document.getElementById('pub-area');
  const year=document.getElementById('pub-year');
  const count=document.getElementById('pub-count');
  Object.entries(data.areas).forEach(([key,name])=>{const option=el('option','',t(name));option.value=key;area.append(option);});
  [...new Set(data.publications.map(p=>p.year).filter(Boolean))].sort((a,b)=>b-a).forEach(y=>{const option=el('option','',String(y));option.value=String(y);year.append(option);});
  const sorted=[...data.publications].sort((a,b)=>(b.year||0)-(a.year||0)||a.title.localeCompare(b.title));
  const expandedAreas=new Set();
  function renderPublications(){
    const term=search.value.trim().toLocaleLowerCase(); const selected=year.value; const selectedArea=area.value;
    const shown=sorted.filter(p=>(selected==='all'||String(p.year)===selected)&&(selectedArea==='all'||p.area===selectedArea)&&(!term||(p.title+' '+p.citation).toLocaleLowerCase().includes(term)));
    pubList.replaceChildren();
    Object.entries(data.areas).forEach(([key,name])=>{
      const papers=shown.filter(p=>p.area===key); if(!papers.length)return;
      const group=el('section','publication-group');group.append(el('h3','',t(name)),el('p','',en?`${papers.length} papers`:`${papers.length} 篇`));
      const filtered=Boolean(term)||selected!=='all';
      const visible=filtered||expandedAreas.has(key)?papers:papers.slice(0,5);
      visible.forEach(p=>{ const row=el('article','publication'); row.append(el('div','publication-year',p.year?String(p.year):(en?'Year n/a':'年份待核'))); const middle=el('div');middle.append(el('h4','',p.title),el('p','',p.citation)); if(p.scholar){const source=el('a','publication-source',en?'Scholar record ↗':'学术记录 ↗');source.href=p.scholar;source.target='_blank';source.rel='noopener noreferrer';middle.append(source);} row.append(middle); if(p.file)row.append(link(p.file,en?'Full text ↓':'下载全文 ↓')); else row.append(el('span','download-link disabled',en?'Full text pending':'待补全文')); group.append(row); });
      if(!filtered&&papers.length>5){const toggle=el('button','publication-toggle',expandedAreas.has(key)?(en?'Show latest five ↑':'收起至最新五篇 ↑'):(en?`View all ${papers.length} papers ↓`:`查看全部 ${papers.length} 篇 ↓`));toggle.type='button';toggle.setAttribute('aria-expanded',String(expandedAreas.has(key)));toggle.addEventListener('click',()=>{if(expandedAreas.has(key))expandedAreas.delete(key);else expandedAreas.add(key);renderPublications();});group.append(toggle);}
      pubList.append(group);
    });
    count.textContent=en?`${shown.length} papers`:`${shown.length} 篇`;
  }
  search.addEventListener('input',renderPublications);year.addEventListener('change',renderPublications);area.addEventListener('change',renderPublications);renderPublications();
})();
