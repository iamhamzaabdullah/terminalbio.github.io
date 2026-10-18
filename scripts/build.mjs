import {cp,mkdir,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {buildBlog} from './blog.mjs';
const root=process.cwd(),out=resolve(root,'dist');
// Only the generated output directory is replaced.
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
const entries=['index.html','about','applications','contact','models','platform','research','xira3','xira40','biocompute','about.html','applications.html','contact.html','models.html','platform.html','research.html','xira3.html','xira40.html','src'];
for(const entry of [...entries,'admin'])await cp(resolve(root,entry),resolve(out,entry),{recursive:true});
await buildBlog(root,out);
for(const entry of ['CNAME','.nojekyll']){try{await cp(resolve(root,entry),resolve(out,entry));}catch(e){if(e.code!=='ENOENT')throw e;}}
console.log('Static site built in dist: homepage + 9 clean routes + legacy redirects.');
