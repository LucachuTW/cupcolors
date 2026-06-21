import { PRESETS } from './presets.mjs';

// Injected into the page. Recolors every <video> and lays a grain+scanline
// overlay over each one. Empty filter = remove everything.
function applyLook(filter, overlay) {
  const STYLE_ID = 'cupcolors-style';
  const NS = (window.__cupcolors = window.__cupcolors || {});

  // --- color: one <style> covers videos created later too ---
  let style = document.getElementById(STYLE_ID);
  if (filter) {
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.documentElement.appendChild(style);
    }
    style.textContent = `video { filter: ${filter} !important; }`;
  } else if (style) {
    style.remove();
  }

  // --- teardown ---
  function clear() {
    if (NS.raf) cancelAnimationFrame(NS.raf);
    NS.raf = null;
    document.querySelectorAll('[data-cupcolors]').forEach((el) => el.remove());
  }
  clear();
  if (!filter || !overlay) return; // color-only when grain is off
  NS.overlay = overlay;

  // Grain = SVG fractal noise as a tiled background; scanlines = a gradient.
  const grain =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
  const scanlines =
    'repeating-linear-gradient(to bottom, rgba(0,0,0,.35) 0 1px, transparent 1px 3px)';

  function makeOverlay() {
    const ov = document.createElement('div');
    ov.dataset.cupcolors = '1';
    ov.style.cssText =
      `pointer-events:none;position:fixed;z-index:2147483647;` +
      `mix-blend-mode:overlay;background-image:${grain},${scanlines};` +
      `background-size:120px 120px,auto;`;
    return ov;
  }

  // ponytail: rAF reposition loop — always correct under scroll/resize/layout
  // without juggling ResizeObserver + scroll + fullscreenchange listeners.
  // One video per page is the norm, so the per-frame rect read is cheap.
  function place(ov, v) {
    ov.style.opacity = NS.overlay;
    const fs = document.fullscreenElement;
    // ponytail: works when the player fullscreens a CONTAINER (DAZN, RTVE,
    // YouTube). A player that fullscreens the raw <video> can't host a child
    // overlay — the recolor still applies, grain/scanlines won't show there.
    if (fs && fs !== v && fs.contains(v)) {
      ov.style.inset = '0';
      ov.style.left = ov.style.top = ov.style.width = ov.style.height = '';
      if (ov.parentElement !== fs) fs.appendChild(ov);
    } else {
      const r = v.getBoundingClientRect();
      ov.style.inset = '';
      ov.style.left = r.left + 'px';
      ov.style.top = r.top + 'px';
      ov.style.width = r.width + 'px';
      ov.style.height = r.height + 'px';
      if (ov.parentElement !== document.body) document.body.appendChild(ov);
    }
  }

  function tick() {
    for (const v of document.querySelectorAll('video')) {
      if (!v.__cupcolorsOv || !v.__cupcolorsOv.isConnected) {
        v.__cupcolorsOv = makeOverlay();
      }
      place(v.__cupcolorsOv, v);
    }
    NS.raf = requestAnimationFrame(tick);
  }
  tick();
}

async function apply(filter, overlay) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true }, // streaming players live in iframes
    func: applyLook,
    args: [filter, overlay],
  });
  chrome.storage.local.set({ lastFilter: filter, lastOverlay: overlay });
  window.close();
}

const grain = document.getElementById('grain');
// Restore the toggle; grain is on by default.
chrome.storage.local.get({ grain: true }).then((s) => (grain.checked = s.grain));
grain.onchange = () => chrome.storage.local.set({ grain: grain.checked });

const box = document.getElementById('years');
for (const { label, color, filter, overlay } of Object.values(PRESETS)) {
  const b = document.createElement('button');
  b.textContent = label;
  b.style.background = color;
  b.onclick = () => apply(filter, grain.checked ? overlay : 0);
  box.appendChild(b);
}
document.getElementById('off').onclick = () => apply('', 0);
