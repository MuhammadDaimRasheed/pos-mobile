const {sha256}=require("@noble/hashes/sha256"),{hmac}=require("@noble/hashes/hmac"),{bytesToHex,utf8ToBytes}=require("@noble/hashes/utils");
const acc=(fin)=>{let d="";const o={update(s){d+=s;return o;},digest:()=>fin(d)};return o;};
module.exports={
  createHash:()=>acc(d=>bytesToHex(sha256(utf8ToBytes(d)))),
  createHmac:(_a,k)=>acc(d=>bytesToHex(hmac(sha256,utf8ToBytes(k),utf8ToBytes(d)))),
  randomBytes:n=>{const b=globalThis.crypto.getRandomValues(new Uint8Array(n));return{toString:()=>bytesToHex(b)};}
};
