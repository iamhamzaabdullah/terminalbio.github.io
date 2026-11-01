import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
if(!globalThis.crypto)Object.defineProperty(globalThis,'crypto',{value:webcrypto});
await import('../p/geno/crypto.js');
test('encrypted backups round trip without exposing plaintext',async()=>{const source={format:'geno-pedigree',version:2,people:[{id:'1',name:'Fictional individual',iscn:'46,XX'}]};const encrypted=await genoCrypto.encrypt(source,'example passphrase');assert.doesNotMatch(JSON.stringify(encrypted),/Fictional|46,XX/);assert.deepEqual(await genoCrypto.decrypt(encrypted,'example passphrase'),source);await assert.rejects(genoCrypto.decrypt(encrypted,'wrong passphrase'));const changed={...encrypted,ciphertext:encrypted.ciphertext.slice(0,-4)+'AAAA'};await assert.rejects(genoCrypto.decrypt(changed,'example passphrase'));await assert.rejects(genoCrypto.encrypt(source,'short'));});
