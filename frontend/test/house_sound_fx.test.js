/**
 * MathCity AI — Smoke Test for HouseSoundFx and NullSoundFx
 */

const assert = require('assert');
const { HouseSoundFx, NullSoundFx } = require('../web/house_game/js/audio.js');

console.log('Running HouseSoundFx Smoke Tests...');

// 1. Instantiation test
const soundFx = new HouseSoundFx();
assert(soundFx !== null, 'HouseSoundFx should instantiate cleanly');
assert.strictEqual(soundFx.enabled, true, 'Default enabled should be true');
assert.strictEqual(soundFx.isMuted, false, 'Default isMuted should be false');

// 2. Safe execution without AudioContext (server/headless environment fallback)
soundFx.play();
soundFx.playBuildKnock();
soundFx.playPlaceSuccess();
soundFx.playCoinChime();
soundFx.playFanfare();
soundFx.playErrorThud();
console.log('✓ All playback methods execute safely without crash in headless/node context');

// 3. Mute & Enable controls
soundFx.setMuted(true);
assert.strictEqual(soundFx.isMuted, true);
assert.strictEqual(soundFx.enabled, false);
soundFx.playBuildKnock(); // Should no-op safely

soundFx.setMuted(false);
assert.strictEqual(soundFx.isMuted, false);
assert.strictEqual(soundFx.enabled, true);

// 4. NullSoundFx fallback
const nullFx = new NullSoundFx();
assert(nullFx !== null);
nullFx.play();
nullFx.playBuildKnock();
nullFx.playPlaceSuccess();
nullFx.playCoinChime();
nullFx.playFanfare();
nullFx.playErrorThud();
nullFx.setMuted(true);
nullFx.setEnabled(false);
console.log('✓ NullSoundFx fallback behaves cleanly as no-op');

console.log('All HouseSoundFx Smoke Tests Passed Successfully!');
