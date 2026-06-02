(function (global) {
  function createArtDirector(materialsRuntime) {
    function drawWobbleLine(ctx, x1, y1, x2, y2, seed) {
      const wobble = 0.65 + (seed % 7) * 0.08;
      const cx = (x1 + x2) * 0.5 + ((seed & 1 ? 1 : -1) * wobble);
      const cy = (y1 + y2) * 0.5 + (((seed >> 1) & 1 ? 1 : -1) * wobble * 2.1);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(cx, cy, x2, y2);
    }

    function drawGridLines(ctx, options) {
      const cols = options.cols;
      const rows = options.rows;
      const cell = options.cell;
      const playTop = options.playTop;
      const playBottom = options.playBottom;
      const playWidth = cols * cell;
      const theme = materialsRuntime.getTheme();

      for (let x = 0; x <= cols; x++) {
        const xPos = x * cell;
        const seed = materialsRuntime.hash2(x, 11);
        const jTop = ((seed & 15) - 7) * 0.06;
        const jBottom = (((seed >> 4) & 15) - 7) * 0.06;
        drawWobbleLine(ctx, xPos + jTop, playTop, xPos + jBottom, playBottom, seed);
        ctx.strokeStyle = theme.lineDarkRgba;
        ctx.lineWidth = 1.05;
        ctx.stroke();

        drawWobbleLine(ctx, xPos + jTop + 0.28, playTop, xPos + jBottom + 0.28, playBottom, seed + 17);
        ctx.strokeStyle = theme.lineLightRgba;
        ctx.lineWidth = 0.45;
        ctx.stroke();
      }

      for (let y = 0; y <= rows; y++) {
        const yPos = playTop + y * cell;
        const seed = materialsRuntime.hash2(y, 29);
        const jLeft = ((seed & 15) - 7) * 0.06;
        const jRight = (((seed >> 4) & 15) - 7) * 0.06;
        drawWobbleLine(ctx, 0, yPos + jLeft, playWidth, yPos + jRight, seed);
        ctx.strokeStyle = theme.lineDarkRgba;
        ctx.lineWidth = 1.05;
        ctx.stroke();

        drawWobbleLine(ctx, 0, yPos + jLeft + 0.24, playWidth, yPos + jRight + 0.24, seed + 13);
        ctx.strokeStyle = theme.lineLightRgba;
        ctx.lineWidth = 0.45;
        ctx.stroke();
      }
    }

    function drawSegmentPaperGrain(ctx, options) {
      const cx = options.cx;
      const cy = options.cy;
      const rx = options.rx;
      const ry = options.ry;
      const angle = options.angle;
      const segmentId = options.segmentId;
      const frame = options.frame;
      const theme = materialsRuntime.getTheme();
      const rand = materialsRuntime.seededRandom(materialsRuntime.hash2(segmentId || 0, 71));

      const coarseTick = Math.floor((frame || 0) * 0.5);
      const wobblePhase = materialsRuntime.hash2(segmentId || 0, coarseTick + 211) % 3;
      const edgeJitter = (wobblePhase - 1) * 0.018;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + edgeJitter);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.clip();

      for (let i = 0; i < 6; i++) {
        const y = (rand() - 0.5) * ry * 1.8;
        const len = rx * (0.75 + rand() * 0.35);
        const alpha = 0.05 + rand() * 0.06;
        ctx.strokeStyle = theme.fiberLightRgba.replace(/0\.0?\d+\)$/, alpha.toFixed(3) + ")");
        ctx.lineWidth = 0.55 + rand() * 0.8;
        ctx.beginPath();
        ctx.moveTo(-len, y);
        ctx.lineTo(len, y + (rand() - 0.5) * 1.2);
        ctx.stroke();
      }

      for (let i = 0; i < 4; i++) {
        const px = (rand() - 0.5) * rx * 1.65;
        const py = (rand() - 0.5) * ry * 1.65;
        const pr = 0.7 + rand() * 1.3;
        ctx.fillStyle = theme.fiberDarkRgba;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    return {
      drawGridLines: drawGridLines,
      drawSegmentPaperGrain: drawSegmentPaperGrain,
    };
  }

  global.COPRO_PAPER_ART = {
    createArtDirector: createArtDirector,
  };
})(window);
