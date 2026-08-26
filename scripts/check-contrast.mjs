// Script ad hoc de verificação de contraste WCAG AA para os tokens de cor
// de src/app/globals.css. Rodar com: node scripts/check-contrast.mjs

function oklchToSrgb(l, c, h) {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ ** 3;
  const m3 = m_ ** 3;
  const s3 = s_ ** 3;

  let r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  const toSrgb = (v) => {
    v = Math.min(1, Math.max(0, v));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  };

  return [toSrgb(r), toSrgb(g), toSrgb(bl)];
}

function relativeLuminance([r, g, b]) {
  const lin = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(oklchA, oklchB) {
  const lumA = relativeLuminance(oklchToSrgb(...oklchA));
  const lumB = relativeLuminance(oklchToSrgb(...oklchB));
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

function toHex(oklch) {
  const [r, g, b] = oklchToSrgb(...oklch);
  const to255 = (v) => Math.round(Math.min(1, Math.max(0, v)) * 255);
  return (
    "#" +
    [to255(r), to255(g), to255(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

// [L, C, H] — colar direto dos valores oklch(L C H) do globals.css
const TOKENS = {
  primary: [0.57, 0.19, 27.6],
  "primary-foreground": [0.985, 0.004, 260],
  secondary: [0.96, 0.008, 260],
  "secondary-foreground": [0.26, 0.02, 260],
  "muted-foreground": [0.52, 0.02, 260],
  background: [0.985, 0.005, 260],
  card: [0.985, 0.005, 260],
  "card-foreground": [0.18, 0.014, 260],
  foreground: [0.18, 0.014, 260],
  destructive: [0.514, 0.198, 16.9],
  sidebar: [0.241, 0.056, 260.3],
  "sidebar-foreground": [0.97, 0.005, 260],
  "sidebar-primary": [0.57, 0.19, 27.6],
  "sidebar-primary-foreground": [0.985, 0.004, 260],
  "sidebar-accent": [0.3, 0.065, 262],
  "sidebar-accent-foreground": [0.97, 0.005, 260],
  "status-success-bg": [0.93, 0.08, 150],
  "status-success-fg": [0.38, 0.14, 150],
  "status-alugado-bg": [0.92, 0.045, 250],
  "status-alugado-fg": [0.38, 0.12, 250],
  "status-vendido-bg": [0.92, 0.045, 320],
  "status-vendido-fg": [0.38, 0.12, 320],
  "status-indisponivel-bg": [0.93, 0.01, 260],
  "status-indisponivel-fg": [0.45, 0.015, 260],
};

const PAIRS = [
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["muted-foreground", "background"],
  ["destructive", "background"],
  ["destructive", "card"],
  ["sidebar", "sidebar-foreground"],
  ["sidebar-primary", "sidebar-primary-foreground"],
  ["sidebar-accent", "sidebar-accent-foreground"],
  ["status-success-bg", "status-success-fg"],
  ["status-alugado-bg", "status-alugado-fg"],
  ["status-vendido-bg", "status-vendido-fg"],
  ["status-indisponivel-bg", "status-indisponivel-fg"],
  ["foreground", "background"],
  ["card-foreground", "card"],
];

const rows = PAIRS.map(([a, b]) => {
  const ratio = contrastRatio(TOKENS[a], TOKENS[b]);
  return {
    par: `${a} / ${b}`,
    [`${a}`]: toHex(TOKENS[a]),
    [`${b}`]: toHex(TOKENS[b]),
    ratio: ratio.toFixed(2),
    "AA normal (4.5)": ratio >= 4.5 ? "PASS" : "FAIL",
    "AA grande/UI (3.0)": ratio >= 3.0 ? "PASS" : "FAIL",
  };
});

console.table(
  rows.map((r) => ({
    par: r.par,
    ratio: r.ratio,
    "AA normal (4.5)": r["AA normal (4.5)"],
    "AA grande/UI (3.0)": r["AA grande/UI (3.0)"],
  }))
);
