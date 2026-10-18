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
export function pageShell(home,{title,description,path,content,base='../',noindex=false}){
 let head=home.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<title>[\s\S]*?<\/title>/,'<title>'+escape(title)+' — terminalbio</title>').replace(/<meta name="description"[^>]*>/,'<meta name="description" content="'+escape(description)+'">').replace(/<link rel="canonical"[^>]*>/,'<link rel="canonical" href="https://terminalbio.com/'+path+'">');
 head='<base href="'+base+'">'+head+'<link rel="stylesheet" href="src/blog.css">'+(noindex?'<meta name="robots" content="noindex,nofollow">':'');
 const header=home.match(/<header[\s\S]*?<\/header>/)[0].replace('href="#systems"','href="/#systems"');
 const footer=home.match(/<footer[\s\S]*?<\/footer>/)[0];
 return '<!doctype html><html lang="en"><head>'+head+'</head><body><a class="skip-link" href="'+path+'#main">Skip to content</a>'+header+'<main id="main">'+content+'</main>'+footer+'<script src="src/main.js" defer></script></body></html>';
}
export async function buildBlog(root,out){
 const home=await readFile(resolve(root,'index.html'),'utf8');
 const files=(await readdir(resolve(root,'content/posts'))).filter(f=>f.endsWith('.json'));
 const posts=[];for(const file of files){const p=validatePost(JSON.parse(await readFile(resolve(root,'content/posts',file),'utf8')),file);if(p)posts.push(p);}
 posts.sort((a,b)=>Date.parse(b.date)-Date.parse(a.date)||a.slug.localeCompare(b.slug));
 const date=p=>new Date(p.date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
 const meta=p=>escape(p.topic||'Research')+' · '+escape(date(p))+' · '+escape(p.author);
 const cards=posts.map(p=>'<article class="journal-card"><a href="blog/'+p.slug+'/">'+(p.cover?'<img loading="lazy" src="'+escape(p.cover)+'" alt="'+escape(p.cover_alt)+'">':'<div class="journal-art" aria-hidden="true"></div>')+'<div class="journal-card-copy"><span class="journal-meta">'+meta(p)+'</span><h2>'+escape(p.title)+'</h2><p>'+escape(p.excerpt)+'</p><span class="text-link">Read article ↗</span></div></a></article>').join('');
 await mkdir(resolve(out,'blog'),{recursive:true});
 await writeFile(resolve(out,'blog/index.html'),pageShell(home,{title:'Blog',description:'Ideas, research notes, and updates from terminalbio.',path:'blog/',content:'<section class="journal-hero"><p class="section-kicker">THE TERMINALBIO JOURNAL</p><h1>Ideas for<br><em>living systems.</em></h1><p>Research perspectives, project updates, and notes on building biological intelligence.</p></section><section class="journal-list" aria-label="Articles">'+(posts.length?'<div class="journal-grid">'+cards+'</div>':'<div class="journal-empty"><p class="section-kicker">FROM THE LAB</p><h2>Our first articles are on their way.</h2><p>In the meantime, explore the research questions shaping our work.</p><a class="text-link" href="research/">Explore our research ↗</a></div>')+'</section>'}));
 for(const p of posts){
  const content='<header class="article-header"><a class="text-link" href="blog/">← All articles</a><p class="journal-meta">'+meta(p)+'</p><h1>'+escape(p.title)+'</h1><p class="excerpt">'+escape(p.excerpt)+'</p>'+(p.cover?'<img class="article-cover" src="'+escape(p.cover)+'" alt="'+escape(p.cover_alt)+'">':'')+'</header><article class="article-body">'+renderBody(p.body)+'</article>';
  await mkdir(resolve(out,'blog',p.slug),{recursive:true});await writeFile(resolve(out,'blog',p.slug,'index.html'),pageShell(home,{title:p.title,description:p.excerpt,path:'blog/'+p.slug+'/',base:'../../',content}));
 }
 console.log('Blog built: '+posts.length+' published articles; drafts excluded.');
}
