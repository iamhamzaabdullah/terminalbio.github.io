import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildBlog,renderBody,validatePost} from './blog.mjs';
const post={title:'A research note',date:'2026-10-19',author:'terminalbio',excerpt:'A summary',published:true,body:'## Findings\n\nA **clear** result.\n\n- One\n- Two'};
test('Markdown formatting is preserved, unsafe HTML is removed',()=>{const html=renderBody(post.body+'\n\n<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">\n\n[bad](javascript:alert(1))');assert.match(html,/<h2>Findings/);assert.match(html,/<strong>clear/);assert.doesNotMatch(html,/<script|onerror=|href="javascript:/);assert.doesNotMatch(html,/alert\(1\)/);});
test('Drafts are excluded and published articles validated',()=>{assert.equal(validatePost({published:false},'draft.json'),null);assert.throws(()=>validatePost(post,'../BAD.json'));assert.throws(()=>validatePost({...post,date:'bad'},'note.json'));assert.throws(()=>validatePost({...post,cover:'/src/uploads/../secret.png'},'note.json'));assert.throws(()=>validatePost({...post,cover:'/src/uploads/cover.png'},'note.json'));});
test('Build creates clean article URLs, escapes titles, excludes drafts and raw content',async()=>{
 const root=await mkdtemp(join(tmpdir(),'terminalbio-blog-test-')),out=join(root,'dist');await mkdir(join(root,'content/posts'),{recursive:true});
 await writeFile(join(root,'index.html'),await readFile('index.html','utf8'));
 await writeFile(join(root,'content/posts/note.json'),JSON.stringify({...post,title:'<script>bad</script>'}));await writeFile(join(root,'content/posts/draft.json'),JSON.stringify({...post,published:false}));
 await buildBlog(root,out);const html=await readFile(join(out,'blog/note/index.html'),'utf8');assert.match(html,/&lt;script&gt;bad/);assert.match(html,/<base href="..\/..\/">/);assert.match(html,/<h2>Findings/);await assert.rejects(access(join(out,'blog/draft/index.html')));await assert.rejects(access(join(out,'content')));
 const listing=await readFile(join(out,'blog/index.html'),'utf8');assert.match(listing,/blog\/note\//);assert.doesNotMatch(listing,/blog\/draft\//);
});
test('Empty collection renders an honest empty state',async()=>{const root=await mkdtemp(join(tmpdir(),'terminalbio-blog-empty-'));await mkdir(join(root,'content/posts'),{recursive:true});await writeFile(join(root,'index.html'),await readFile('index.html','utf8'));await buildBlog(root,join(root,'dist'));assert.match(await readFile(join(root,'dist/blog/index.html'),'utf8'),/first articles are on their way/);});
