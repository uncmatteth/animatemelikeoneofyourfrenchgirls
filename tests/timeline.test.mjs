import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceTime,speakingAt,mouthAmount,validateTimeline} from '../lib/timeline.js';
test('a title inserts time without accelerating or shifting speech internally',()=>{
 const ins=[{at:45.5,duration:8,id:'title'}];
 assert.equal(sourceTime(45,ins).time,45);
 assert.equal(sourceTime(49,ins).insert.id,'title');
 assert.equal(sourceTime(54.5,ins).time,46.5);
 assert.deepEqual(sourceTime(49,ins),sourceTime(49,ins));
});
test('listener remains silent and only the current speaker receives mouth motion',()=>{
 const cues=[{speaker:'A',start_seconds:0,end_seconds:1},{speaker:'B',start_seconds:1,end_seconds:2}];
 const env={rate:2,values:[.5,.5,.5,.5]};
 assert.equal(mouthAmount(env,.5,'B',cues),0);
 assert.ok(mouthAmount(env,.5,'A',cues)>0);
 assert.equal(speakingAt(cues,2),null);
});
test('contradictory object identity, time and anchors fail structural validation',()=>{
 const e=validateTimeline({duration:5,fps:24,shots:[{id:'a',start:0,end:3},{id:'b',start:2,end:6}],anchors:[{id:'wheel',position:[1,2,3]},{id:'wheel',position:[5,2,3]}]});
 assert.ok(e.some(x=>x.includes('overlaps')));
 assert.ok(e.some(x=>x.includes('outside')));
 assert.ok(e.some(x=>x.includes('duplicate anchor')));
});
