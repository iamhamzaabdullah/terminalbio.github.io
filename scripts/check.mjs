import {readFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
const pages=['index.html',...['about','applications','contact','models','platform','research','xira3','xira40','biocompute'].map(p=>p+'/index.html')];
let checked=0;
for(const page of pages){
 const html=await readFile(page,'utf8');
 if(!html.includes('src/design.css'))throw Error('Missing shared design: '+page);
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=match[1];
  if(/^(https?:|mailto:|tel:|#)/.test(url)||url==='../')continue;
  let path=url.split(/[?#]/)[0].replace(/^\//,'');
  if(!path||path.endsWith('/'))path+='index.html';
  await stat(resolve(path)).catch(()=>{throw Error('Broken link in '+page+': '+url);});
  checked++;
 }
}
const portfolio=await readFile('xira3/index.html','utf8');
for(const [category,count] of Object.entries({systematic:6,scoping:6,meta:4,original:10})){
 const actual=[...portfolio.matchAll(new RegExp('data-category="'+category+'"','g'))].length;
 if(actual!==count)throw Error('Unexpected XIRA3 count: '+category);
}
console.log('PASS: '+pages.length+' pages, '+checked+' local references, and all 26 XIRA3 studies.');
