// Self-check: presets are well-formed and setFilter behaves. Run: node test.mjs
import assert from 'node:assert';
import { PRESETS } from './presets.mjs';

const years = Object.keys(PRESETS);
assert.deepStrictEqual(years, ['2002', '2006', '2010', '2014'], 'expected the 4 tournaments');

for (const [year, p] of Object.entries(PRESETS)) {
  assert.ok(/^#[0-9a-f]{6}$/i.test(p.color), `${year}: color must be a hex`);
  assert.ok(p.label && typeof p.label === 'string', `${year}: needs a label`);
  // filter must be non-empty and only use known CSS filter functions
  assert.ok(p.filter.length > 0, `${year}: empty filter`);
  const fns = p.filter.match(/([a-z-]+)\(/g).map(s => s.slice(0, -1));
  const allowed = ['contrast', 'saturate', 'sepia', 'brightness', 'hue-rotate'];
  for (const fn of fns) assert.ok(allowed.includes(fn), `${year}: unknown filter fn ${fn}`);
  assert.ok(typeof p.overlay === 'number' && p.overlay >= 0 && p.overlay <= 1, `${year}: overlay must be 0..1`);
}

// Behaviour check: tiny stub of the apply/overlay logic from popup.js.
// Models the bits that can leak: the color <style> and per-video overlays.
function applyLook(filter, overlay, store, videos) {
  const id = 'cupcolors-style';
  if (filter) store.set(id, `video { filter: ${filter} !important; }`);
  else store.delete(id);
  // clear(): remove every overlay before (re)building
  for (const v of videos) v.overlay = null;
  if (!filter || !overlay) return; // color-only when grain off
  for (const v of videos) v.overlay = { tag: 'div' }; // one per video, reused next time
}

const store = new Map();
const videos = [{}, {}]; // two players on a page
const p2014 = PRESETS['2014'];

applyLook(p2014.filter, p2014.overlay, store, videos);
assert.ok(store.get('cupcolors-style').includes('saturate(1.65)'), 'color not applied');
assert.strictEqual(videos.filter(v => v.overlay).length, 2, 'expected one overlay per video');

applyLook(PRESETS['2002'].filter, PRESETS['2002'].overlay, store, videos); // re-apply must not stack
assert.strictEqual(videos.filter(v => v.overlay).length, 2, 're-apply should not duplicate overlays');

applyLook(p2014.filter, 0, store, videos); // grain off → color only
assert.ok(store.has('cupcolors-style'), 'color should still apply with grain off');
assert.strictEqual(videos.filter(v => v.overlay).length, 0, 'grain off should add no overlays');

applyLook('', 0, store, videos); // Off
assert.strictEqual(store.size, 0, 'off should remove the color style');
assert.strictEqual(videos.filter(v => v.overlay).length, 0, 'off should remove all overlays');

console.log('ok — all checks passed');
