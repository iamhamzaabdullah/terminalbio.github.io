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
 const meta=p=>escape(p.topic||'Research')+' · '+escape(date(p));
 const topicKey=p=>(p.topic||'Research').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const visual=p=>p?.cover?'<img loading="lazy" src="'+escape(p.cover)+'" alt="'+escape(p.cover_alt)+'">':'<div class="journal-art" aria-hidden="true"><span>TERMINALBIO / FIELD NOTES</span><i></i><b></b></div>';
 const featured=posts[0];
 const feature=featured?'<section class="journal-feature" aria-label="Featured article"><div class="journal-feature-media">'+visual(featured)+'</div><div class="journal-feature-copy"><span class="journal-feature-label">LEAD STORY</span><p class="journal-meta">'+meta(featured)+'</p><h2>'+escape(featured.title)+'</h2><p class="journal-feature-excerpt">'+escape(featured.excerpt)+'</p><p class="journal-author">By '+escape(featured.author)+'</p><a class="journal-read-link" href="blog/'+featured.slug+'/">Read the story <span aria-hidden="true">↗</span></a></div></section>':'<section class="journal-feature journal-feature--empty" aria-label="Explore terminalbio research"><div class="journal-feature-media">'+visual(null)+'</div><div class="journal-feature-copy"><span class="journal-feature-label">FROM THE RESEARCH DESK</span><h2>Biology is always in motion.</h2><p class="journal-feature-excerpt">Explore the questions behind terminalbio’s work in biological intelligence, model-building, and experimental learning.</p><a class="journal-read-link" href="research/">Explore the research <span aria-hidden="true">↗</span></a><p class="journal-empty-note">Our first articles are on their way; no journal articles have been published yet.</p></div></section>';
 const remaining=posts.slice(1);
 const topics=[...new Map(remaining.map(p=>[topicKey(p),p.topic||'Research'])).entries()];
 const cards=remaining.map(p=>'<article class="journal-card" data-topic="'+escape(topicKey(p))+'" data-search="'+escape([p.title,p.excerpt,p.topic,p.author].join(' ').toLowerCase())+'"><a href="blog/'+p.slug+'/">'+visual(p)+'<div class="journal-card-copy"><span class="journal-meta">'+meta(p)+' · '+escape(p.author)+'</span><h3>'+escape(p.title)+'</h3><p>'+escape(p.excerpt)+'</p><span class="journal-read-link">Read article <span aria-hidden="true">↗</span></span></div></a></article>').join('');
 const latest=remaining.length?'<section class="journal-latest" aria-label="Latest articles"><div class="journal-latest-heading"><div><span class="journal-feature-label">THE LATEST</span><h2>More from the journal.</h2></div><span class="journal-count">'+String(remaining.length).padStart(2,'0')+' STORIES</span></div><div class="journal-tools"><div class="journal-filters" role="group" aria-label="Filter articles"><button type="button" data-filter="all" aria-pressed="true">All topics</button>'+topics.map(([key,label])=>'<button type="button" data-filter="'+escape(key)+'" aria-pressed="false">'+escape(label)+'</button>').join('')+'</div><label class="journal-search-label">Search the journal<input type="search" data-journal-search placeholder="Title, topic, or author" autocomplete="off"></label></div><div class="journal-grid">'+cards+'</div><p class="journal-no-results" hidden>No stories match that search. Try another topic or phrase.</p></section>':'';
 const content='<section class="journal-masthead"><div class="journal-masthead-copy"><p class="section-kicker">TERMINALBIO / JOURNAL</p><h1>Signals from<br><em>living systems.</em></h1><p>Research, methods, and perspectives on understanding biology through computation and experiment.</p></div><div class="journal-masthead-mark" aria-hidden="true"><span>FIELD NOTES</span><div class="journal-mark-orbit"><i></i><b></b></div><small>OBSERVE · MODEL · LEARN</small></div></section>'+feature+latest;
 await mkdir(resolve(out,'blog'),{recursive:true});
 await writeFile(resolve(out,'blog/index.html'),pageShell(home,{title:'Blog',description:'Research, methods, and perspectives on understanding biology through computation and experiment.',path:'blog/',content,extraScripts:'<script src="src/journal-ui.js?v=1" defer></script>'}));
 for(const p of posts){
  const readTime=Math.max(1,Math.ceil(p.body.trim().split(/\s+/).length/210));
  const content='<header class="article-header"><a class="article-back" href="blog/">← Journal</a><p class="journal-meta">'+meta(p)+' · '+readTime+' MIN READ</p><h1>'+escape(p.title)+'</h1><p class="excerpt">'+escape(p.excerpt)+'</p><p class="article-author">By '+escape(p.author)+'</p>'+(p.cover?'<img class="article-cover" src="'+escape(p.cover)+'" alt="'+escape(p.cover_alt)+'">':'')+'</header><article class="article-body">'+renderBody(p.body)+'</article><div class="article-end"><span>END OF ARTICLE</span><a href="blog/">Back to the journal ↗</a></div>';
  await mkdir(resolve(out,'blog',p.slug),{recursive:true});await writeFile(resolve(out,'blog',p.slug,'index.html'),pageShell(home,{title:p.title,description:p.excerpt,path:'blog/'+p.slug+'/',base:'../../',content}));
 }
 console.log('Blog built: '+posts.length+' published articles; drafts excluded.');
}
