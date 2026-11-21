import {cp,mkdir,rm,readdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {buildBlog} from './blog.mjs';
const root=process.cwd(),out=resolve(root,'dist');
// Only the generated output directory is replaced.
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
const entries=['index.html','about','applications','contact','models','platform','research','xira3','xira40','biocompute','about.html','applications.html','contact.html','models.html','platform.html','research.html','xira3.html','xira40.html','src'];
for(const entry of [...entries,'admin','p','kuiperhealth','keplerhealth','keplerhealth.html'])await cp(resolve(root,entry),resolve(out,entry),{recursive:true});
await buildBlog(root,out);
for(const entry of ['CNAME','.nojekyll']){try{await cp(resolve(root,entry),resolve(out,entry));}catch(e){if(e.code!=='ENOENT')throw e;}}
async function applyBrandStyles(dir,rel=''){
  for(const item of await readdir(resolve(dir,rel),{withFileTypes:true})){
    const child=rel?`${rel}/${item.name}`:item.name;
    if(item.isDirectory())await applyBrandStyles(dir,child);
    else if(item.isFile()&&item.name.endsWith('.html')&&!child.startsWith('p/geno/')){
      const path=resolve(dir,child),html=await readFile(path,'utf8');
      if(!html.includes('src/brand-system.css'))await writeFile(path,html.replace('</head>','<link rel="stylesheet" href="/src/brand-system.css?v=20261121-transparent-header"></head>'));
      else await writeFile(path,html.replace(/src\/brand-system\.css\?v=[^"']+/, 'src/brand-system.css?v=20261121-transparent-header'));
    }
  }
}
await applyBrandStyles(out);
console.log('Static site built in dist, including Kuiper Health and legacy redirects.');
