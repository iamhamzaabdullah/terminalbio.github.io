import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve,basename} from 'node:path';
import {marked} from 'marked';
import sanitizeHtml from 'sanitize-html';
export const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderBody(body){return sanitizeHtml(marked.parse(body),{allowedTags:sanitizeHtml.defaults.allowedTags.concat(['img']),allowedAttributes:{...sanitizeHtml.defaults.allowedAttributes,img:['src','alt','title','width','height'],a:['href','title']},allowedSchemes:['https','http','mailto'],allowProtocolRelative:false});}
export function validatePost(p,file){
 const slug=basename(file,'.json');
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw Error('Article filename must use lowercase words and hyphens: '+file);
 if(p.published!==true)return null;
 for(const key of ['title','date','author','excerpt','body'])if(typeof p[key]!=='string'||!p[key].trim())throw Error(file+': missing '+key);
 if(!/^\d{4}-\d{2}-\d{2}/.test(p.date)||!Number.isFinite(Date.parse(p.date)))throw Error(file+': invalid publication date');
 if(p.cover && (!/^\/src\/uploads\/[\w /%.()-]+\.(png|jpe?g|webp|gif|avif)$/i.test(p.cover)||p.cover.includes('..')))throw Error(file+': cover must be an image in src/uploads');
 if(p.cover&&!p.cover_alt?.trim())throw Error(file+': add a cover image description');
 return {...p,slug};
}
export function pageShell(home,{title,description,path,content,base='../',noindex=false,extraScripts=''}){
 let head=home.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<title>[\s\S]*?<\/title>/,'<title>'+escape(title)+' — terminalbio</title>').replace(/<meta name="description"[^>]*>/,'<meta name="description" content="'+escape(description)+'">').replace(/<link rel="canonical"[^>]*>/,'<link rel="canonical" href="https://terminalbio.com/'+path+'">');
 head='<base href="'+base+'">'+head+'<link rel="stylesheet" href="src/blog.css?v=20261115-editorial">'+(noindex?'<meta name="robots" content="noindex,nofollow">':'');
 const header=home.match(/<header[\s\S]*?<\/header>/)[0];
 const footer=home.match(/<footer[\s\S]*?<\/footer>/)[0];
 return '<!doctype html><html lang="en"><head>'+head+'</head><body><a class="skip-link" href="'+path+'#main">Skip to content</a>'+header+'<main id="main">'+content+'</main>'+footer+'<script src="src/main.js?v=20261103-header" defer></script>'+extraScripts+'</body></html>';
}
export async function buildBlog(root,out){
 const home=await readFile(resolve(root,'index.html'),'utf8');
 const files=(await readdir(resolve(root,'content/posts'))).filter(f=>f.endsWith('.json'));
 const posts=[];for(const file of files){const p=validatePost(JSON.parse(await readFile(resolve(root,'content/posts',file),'utf8')),file);if(p)posts.push(p);}
 posts.sort((a,b)=>Date.parse(b.date)-Date.parse(a.date)||a.slug.localeCompare(b.slug));
 const date=p=>new Date(p.date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
 const category=p=>escape(p.topic||'Research');
 const art=(p,kind='')=>p?.cover?'<img loading="lazy" src="'+escape(p.cover)+'" alt="'+escape(p.cover_alt)+'">':'<img loading="lazy" src="/src/assets/biological-field.svg" alt="Abstract terminalbio visualization of biological systems">';
 const lead=posts[0];
 const hero='<section class="insights-masthead" data-nav-label="Overview"><p class="section-kicker">TERMINALBIO / INSIGHTS</p><h1>Biology, in focus.</h1><p>Ideas, discoveries, and perspectives at the edge of computation and life science.</p></section>';
 const leadStory=lead?'<section class="insights-lead" data-nav-label="Featured story" aria-label="Featured story"><a class="insights-lead-image" href="blog/'+lead.slug+'/">'+art(lead)+'</a><div class="insights-lead-copy"><span class="insights-label">FEATURED STORY</span><p class="insights-meta">'+category(lead)+' <i>·</i> '+escape(date(lead))+'</p><h2><a href="blog/'+lead.slug+'/">'+escape(lead.title)+'</a></h2><p class="insights-excerpt">'+escape(lead.excerpt)+'</p><p class="insights-byline">By '+escape(lead.author)+'</p><a class="insights-more" href="blog/'+lead.slug+'/">Read story <span aria-hidden="true">↗</span></a></div></section>':'<section class="insights-lead insights-lead--empty" data-nav-label="Featured story" aria-label="Featured research"><div class="insights-lead-image">'+art(null)+'</div><div class="insights-lead-copy"><span class="insights-label">FROM TERMINALBIO</span><p class="insights-meta">BIOLOGY · COMPUTATION · EXPERIMENT</p><h2>New perspectives are taking shape.</h2><p class="insights-excerpt">We are preparing stories on biological intelligence, model building, and the experiments that move ideas forward.</p><a class="insights-more" href="research/">Explore our research <span aria-hidden="true">↗</span></a><p class="insights-empty-note">Our first articles are on their way; we are preparing them for publication.</p></div></section>';
 const remaining=posts.slice(1);
 const cards=remaining.map(p=>'<article class="insight-card"><a class="insight-card-image" href="blog/'+p.slug+'/">'+art(p)+'</a><div class="insight-card-copy"><p class="insights-meta">'+category(p)+' <i>·</i> '+escape(date(p))+'</p><h3><a href="blog/'+p.slug+'/">'+escape(p.title)+'</a></h3><p>'+escape(p.excerpt)+'</p><div class="insight-card-foot"><span>By '+escape(p.author)+'</span><a href="blog/'+p.slug+'/" aria-label="Read '+escape(p.title)+'">Read story ↗</a></div></div></article>').join('');
 const latest=remaining.length?'<section class="insights-latest" data-nav-label="Latest stories" aria-label="Latest stories"><div class="insights-section-head"><div><span class="insights-label">MORE STORIES</span><h2>Latest from terminalbio</h2></div><span class="insights-count">'+String(remaining.length).padStart(2,'0')+' STORIES</span></div><div class="insights-grid">'+cards+'</div></section>':'';
 const content=hero+leadStory+latest;
 await mkdir(resolve(out,'blog'),{recursive:true});
 await writeFile(resolve(out,'blog/index.html'),pageShell(home,{title:'Insights',description:'Ideas, discoveries, and perspectives at the edge of computation and life science.',path:'blog/',content}));
 for(const p of posts){
  const readTime=Math.max(1,Math.ceil(p.body.trim().split(/\s+/).length/210));
  const content='<header class="article-header"><a class="article-back" href="blog/">← Insights</a><p class="journal-meta">'+category(p)+' · '+escape(date(p))+' · '+readTime+' MIN READ</p><h1>'+escape(p.title)+'</h1><p class="excerpt">'+escape(p.excerpt)+'</p><p class="article-author">By '+escape(p.author)+'</p>'+(p.cover?'<img class="article-cover" src="'+escape(p.cover)+'" alt="'+escape(p.cover_alt)+'">':'')+'</header><article class="article-body">'+renderBody(p.body)+'</article><div class="article-end"><span>END OF STORY</span><a href="blog/">More terminalbio stories ↗</a></div>';
  await mkdir(resolve(out,'blog',p.slug),{recursive:true});await writeFile(resolve(out,'blog',p.slug,'index.html'),pageShell(home,{title:p.title,description:p.excerpt,path:'blog/'+p.slug+'/',base:'../../',content}));
 }
 console.log('Blog built: '+posts.length+' published articles; drafts excluded.');
}
