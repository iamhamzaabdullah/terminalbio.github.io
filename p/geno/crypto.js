/* Local encrypted backup format; PDF exports are not encrypted. */
(function(root){'use strict';
 const enc=new TextEncoder(),dec=new TextDecoder('utf-8',{fatal:true}),rounds=600000;
 const b64=a=>{let s='';for(const v of a)s+=String.fromCharCode(v);return btoa(s)};
 const un64=(s,max)=>{if(typeof s!=='string'||s.length>max)throw Error('Invalid encrypted backup');return Uint8Array.from(atob(s),c=>c.charCodeAt(0))};
 async function key(password,salt,usage){const base=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations:rounds},base,{name:'AES-GCM',length:256},false,[usage])}
 async function encrypt(data,password){if(password.length<12)throw Error('Use a passphrase with at least 12 characters.');const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));const k=await key(password,salt,'encrypt'),payload=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:enc.encode('geno-encrypted-v1')},k,enc.encode(JSON.stringify(data)));return {format:'geno-encrypted',version:1,kdf:'PBKDF2-SHA256',iterations:rounds,cipher:'AES-256-GCM',salt:b64(salt),iv:b64(iv),ciphertext:b64(new Uint8Array(payload))}}
 async function decrypt(data,password){if(data.format!=='geno-encrypted'||data.version!==1||data.kdf!=='PBKDF2-SHA256'||data.iterations!==rounds||data.cipher!=='AES-256-GCM')throw Error('Unsupported encrypted backup');const salt=un64(data.salt,128),iv=un64(data.iv,128),payload=un64(data.ciphertext,28000000);if(salt.length!==16||iv.length!==12||payload.length<16)throw Error('Invalid encrypted backup');const k=await key(password,salt,'decrypt');return JSON.parse(dec.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:enc.encode('geno-encrypted-v1')},k,payload)))}
 root.genoCrypto={encrypt,decrypt};
})(globalThis);
