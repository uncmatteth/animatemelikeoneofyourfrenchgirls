import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
test('the credited upstream files remain byte-for-byte unchanged',()=>{
 const source=JSON.parse(fs.readFileSync(path.join(root,'UPSTREAM.json'),'utf8'));
 assert.equal(Object.keys(source.sha256Files).length,source.copiedFiles);
 for(const [file,expected] of Object.entries(source.sha256Files)){
  const actual=createHash('sha256').update(fs.readFileSync(path.join(root,'vendor/cutaway',file))).digest('hex');
  assert.equal(actual,expected,file);
 }
 assert.match(fs.readFileSync(path.join(root,'vendor/cutaway/LICENSE'),'utf8'),/Nyxera0x/);
});
