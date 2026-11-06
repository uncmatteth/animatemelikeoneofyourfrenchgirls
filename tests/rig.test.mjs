import test from 'node:test';
import assert from 'node:assert/strict';
import {validateRig} from '../lib/atlas-rig.js';
test('a limb cannot silently attach to an unknown or cyclic parent',()=>{
 assert.ok(validateRig({parts:[{id:'hand',parent:'ghost',size:[10,20]}]}).some(s=>s.includes('missing parent')));
 assert.ok(validateRig({parts:[{id:'a',parent:'b',size:[10,20]},{id:'b',parent:'a',size:[10,20]}]}).some(s=>s.includes('cyclic')));
 assert.deepEqual(validateRig({parts:[{id:'body',size:[100,200]},{id:'arm',parent:'body',size:[20,100]}]}),[]);
});
