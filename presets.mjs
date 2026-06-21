// One source of truth for the era looks. CSS filter strings applied to <video>.
// Tuned to mimic each tournament's broadcast feel. ponytail: filters by eye,
// nudge the numbers if a match looks off on your screen.
export const PRESETS = {
  // overlay: 0–1 grain + scanline strength. Older era = heavier.
  '2002': {
    label: '2002 · Korea/Japan',
    color: '#A58153', // official gold/copper from the trophy emblem
    // Broadcast in SD 4:3 (HD was only experimental) — soft, washed, cool,
    // low saturation. The SDTV softness IS the era, so grain runs heaviest.
    filter: 'contrast(1.06) saturate(0.8) sepia(0.10) brightness(0.95) hue-rotate(6deg)',
    overlay: 0.85,
  },
  '2006': {
    label: '2006 · Germany',
    color: '#C5A23A', // warm German-summer gold
    // First World Cup produced 100% in HD (1080i, 16:9). The signature is
    // CLEAN and crisp, not grainy — warm summer tone, light grain only.
    filter: 'contrast(1.12) saturate(1.15) sepia(0.08) brightness(1.02) hue-rotate(-8deg)',
    overlay: 0.3,
  },
  '2010': {
    label: '2010 · South Africa',
    color: '#F8A20C', // official "dark tangerine" — African-sun gold
    // HD, bright saturated African palette; gold = African sunshine,
    // ochre/orange textile hues. Pushed warm, golden and bright.
    filter: 'saturate(1.45) sepia(0.18) contrast(1.08) brightness(1.08) hue-rotate(-15deg)',
    overlay: 0.4,
  },
  '2014': {
    label: '2014 · Brazil',
    color: '#336F1B', // official "Palm Green" from the emblem
    // First World Cup with 4K (3 matches), mainstream Full HD — the cleanest,
    // sharpest era, so grain runs lowest. Vivid tropical with a warm sun lean.
    filter: 'saturate(1.65) contrast(1.14) brightness(1.08) sepia(0.06) hue-rotate(-4deg)',
    overlay: 0.2,
  },
};
