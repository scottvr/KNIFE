(function (global) {
  const CONSTRUCTION_PAPER = {
    white: "#f5f1e8",
    black: "#1f1a17",
    red: "#b33a32",
    orange: "#cb6a32",
    yellow: "#d5b33a",
    festiveGreen: "#4a6b3c",
    blue: "#3f608f",
    purple: "#665286",
    pink: "#c68393",
    darkBrown: "#5f4230",
  };

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function hexToRgb(hex) {
    if (!hex || typeof hex !== "string") return null;
    const clean = hex.trim().replace("#", "");
    if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }

  function rgbToHex(rgb) {
    const r = Math.max(0, Math.min(255, Math.round(rgb.r)));
    const g = Math.max(0, Math.min(255, Math.round(rgb.g)));
    const b = Math.max(0, Math.min(255, Math.round(rgb.b)));
    return "#" + [r, g, b].map(function (v) { return v.toString(16).padStart(2, "0"); }).join("");
  }

  function rgbToUnit(rgb) {
    return [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  }

  function rgbToHsl(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (d !== 0) {
      s = d / (1 - Math.abs(2 * l - 1));
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }

    return { h: h, s: s, l: l };
  }

  function hslToRgb(hsl) {
    const h = ((hsl.h % 360) + 360) % 360;
    const s = clamp01(hsl.s);
    const l = clamp01(hsl.l);
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let r1 = 0;
    let g1 = 0;
    let b1 = 0;

    if (hp < 1) { r1 = c; g1 = x; }
    else if (hp < 2) { r1 = x; g1 = c; }
    else if (hp < 3) { g1 = c; b1 = x; }
    else if (hp < 4) { g1 = x; b1 = c; }
    else if (hp < 5) { r1 = x; b1 = c; }
    else { r1 = c; b1 = x; }

    const m = l - c / 2;
    return {
      r: Math.round((r1 + m) * 255),
      g: Math.round((g1 + m) * 255),
      b: Math.round((b1 + m) * 255),
    };
  }

  function derivePaperTheme(baseHex, level) {
    const rgb = hexToRgb(baseHex) || hexToRgb(CONSTRUCTION_PAPER.darkBrown);
    const hsl = rgbToHsl(rgb);
    const levelBand = Math.max(0, Math.floor((level - 1) / 3));
    const hueShift = Math.min(8, levelBand * 1.4);
    const satShift = Math.min(0.08, levelBand * 0.015);
    const lightShift = Math.min(0.08, levelBand * 0.018);

    const shifted = hslToRgb({
      h: hsl.h + hueShift,
      s: clamp01(hsl.s + satShift),
      l: clamp01(hsl.l + lightShift),
    });

    const lineDark = hslToRgb({
      h: hsl.h,
      s: clamp01(hsl.s * 0.92),
      l: clamp01(hsl.l * 0.52),
    });

    const lineLight = hslToRgb({
      h: hsl.h,
      s: clamp01(hsl.s * 0.76),
      l: clamp01(0.35 + hsl.l * 0.28),
    });

    const fiberLight = hslToRgb({
      h: hsl.h + 6,
      s: clamp01(hsl.s * 0.68),
      l: clamp01(0.58 + hsl.l * 0.2),
    });

    const fiberDark = hslToRgb({
      h: hsl.h - 4,
      s: clamp01(hsl.s * 0.84),
      l: clamp01(hsl.l * 0.46),
    });

    return {
      baseHex: rgbToHex(shifted),
      baseUnit: rgbToUnit(shifted),
      lineDarkRgba: "rgba(" + lineDark.r + "," + lineDark.g + "," + lineDark.b + ",0.46)",
      lineLightRgba: "rgba(" + lineLight.r + "," + lineLight.g + "," + lineLight.b + ",0.12)",
      fiberLightRgba: "rgba(" + fiberLight.r + "," + fiberLight.g + "," + fiberLight.b + ",0.05)",
      fiberDarkRgba: "rgba(" + fiberDark.r + "," + fiberDark.g + "," + fiberDark.b + ",0.05)",
      grainLightRgba: "rgba(235,223,201,0.06)",
      grainDarkRgba: "rgba(36,25,18,0.05)",
    };
  }

  function readCssPaperBase() {
    const style = global.getComputedStyle(global.document.documentElement);
    const paletteName = (style.getPropertyValue("--copro-paper-palette-name") || "").trim();
    const cssBase = (style.getPropertyValue("--copro-paper-base") || "").trim();
    if (hexToRgb(cssBase)) return cssBase;
    if (paletteName && CONSTRUCTION_PAPER[paletteName]) return CONSTRUCTION_PAPER[paletteName];
    return CONSTRUCTION_PAPER.darkBrown;
  }

  global.COPRO_PAPER_PALETTE = {
    constructionPaper: CONSTRUCTION_PAPER,
    derivePaperTheme: derivePaperTheme,
    readCssPaperBase: readCssPaperBase,
    hexToRgb: hexToRgb,
    rgbToUnit: rgbToUnit,
  };
})(window);
