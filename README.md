# ⚽ CupColors

A browser extension that paints your live World Cup stream with the colors of a
past tournament — and a bright new look for **2026**. Works on any HTML5 player
(RTVE Play, DAZN, etc.) because it just filters the `<video>`.

## Looks
- **2002 · Korea/Japan** — washed early-digital broadcast
- **2006 · Germany** — warm summer
- **2010 · South Africa** — golden, dusty yellow
- **2014 · Brazil** — vivid tropical

Optional **film grain + scanlines** add an old-broadcast feel (toggle in the
popup, heaviest on 2002). Turn it off for color only.

## Install (Chrome/Edge/Brave)
1. Go to `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. **Load unpacked** → pick this folder
4. Pin the ⚽ icon

## Use
Play the match, click the ⚽ icon, click a year. The look appears instantly.
**Off / Original** restores it. That's it.

> Firefox: load via `about:debugging` → This Firefox → Load Temporary Add-on → pick `manifest.json`.

## Tweak a look
All five filters live in `presets.mjs` — edit the CSS `filter` strings.
Run `node test.mjs` to check they're still valid.
