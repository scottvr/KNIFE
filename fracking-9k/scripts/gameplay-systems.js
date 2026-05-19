(() => {
  'use strict';

  function create(options = {}) {
    const ctx = options.ctx;
    const state = options.state || {};
    const strokeWithVectorGlow = typeof options.strokeWithVectorGlow === 'function'
      ? options.strokeWithVectorGlow
      : (context, drawStrokePath) => {
          if (!context || typeof drawStrokePath !== 'function') return;
          drawStrokePath();
          context.stroke();
        };

    const rand = typeof options.rand === 'function' ? options.rand : (a, b) => a + Math.random() * (b - a);
    const randSign = typeof options.randSign === 'function' ? options.randSign : () => (Math.random() < 0.5 ? -1 : 1);
    const dist2 = typeof options.dist2 === 'function' ? options.dist2 : (() => Infinity);
    const maybeEnterFractalDive = typeof options.maybeEnterFractalDive === 'function' ? options.maybeEnterFractalDive : () => false;
    const damageFractaloid = typeof options.damageFractaloid === 'function' ? options.damageFractaloid : () => false;
    const killShip = typeof options.killShip === 'function' ? options.killShip : () => {};
    const resolveSaucerFractalClass = typeof options.resolveSaucerFractalClass === 'function' ? options.resolveSaucerFractalClass : () => 'classic';
    const drawSierpinski = typeof options.drawSierpinski === 'function' ? options.drawSierpinski : () => {};
    const triggerNonEuclideanFromSaucerHit = typeof options.triggerNonEuclideanFromSaucerHit === 'function'
      ? options.triggerNonEuclideanFromSaucerHit
      : () => false;

    const sfx = options.sfx || {
      bangLarge: () => {},
      bangMedium: () => {},
      bangSmall: () => {},
      saucerFire: () => {},
      extraLife: () => {}
    };

    const SAUCER_LARGE = options.SAUCER_LARGE || { r: 17, score: 200, speed: 90, fireRate: 1.6, accuracy: 0.0 };
    const SAUCER_SMALL = options.SAUCER_SMALL || { r: 17, score: 1000, speed: 130, fireRate: 1.0, accuracy: 0.75 };
    const BULLET_SPEED = options.BULLET_SPEED != null ? options.BULLET_SPEED : 540;
    const SHOCKWAVE_LIFE = options.SHOCKWAVE_LIFE != null ? options.SHOCKWAVE_LIFE : 0.62;
    const SHOCKWAVE_RADIUS_GAIN = options.SHOCKWAVE_RADIUS_GAIN != null ? options.SHOCKWAVE_RADIUS_GAIN : 2.2;
    const SHOCKWAVE_WIDTH = options.SHOCKWAVE_WIDTH != null ? options.SHOCKWAVE_WIDTH : 2.2;
    const isNonEuclideanActive = typeof options.isNonEuclideanActive === 'function'
      ? options.isNonEuclideanActive
      : () => false;
    const projectPointForRender = typeof options.projectPointForRender === 'function'
      ? options.projectPointForRender
      : null;
    const projectRadiusForRender = typeof options.projectRadiusForRender === 'function'
      ? options.projectRadiusForRender
      : null;

    function getWidth() { return typeof state.getWidth === 'function' ? state.getWidth() : 0; }
    function getHeight() { return typeof state.getHeight === 'function' ? state.getHeight() : 0; }
    function getScore() { return typeof state.getScore === 'function' ? state.getScore() : 0; }
    function setScore(v) { if (typeof state.setScore === 'function') state.setScore(v); }
    function getLives() { return typeof state.getLives === 'function' ? state.getLives() : 0; }
    function setLives(v) { if (typeof state.setLives === 'function') state.setLives(v); }
    function getNextExtraLife() { return typeof state.getNextExtraLife === 'function' ? state.getNextExtraLife() : 0; }
    function setNextExtraLife(v) { if (typeof state.setNextExtraLife === 'function') state.setNextExtraLife(v); }
    function getWave() { return typeof state.getWave === 'function' ? state.getWave() : 1; }
    function getShip() { return typeof state.getShip === 'function' ? state.getShip() : null; }
    function getBullets() { return typeof state.getBullets === 'function' ? state.getBullets() : []; }
    function getSaucerBullets() { return typeof state.getSaucerBullets === 'function' ? state.getSaucerBullets() : []; }
    function getFractaloids() { return typeof state.getFractaloids === 'function' ? state.getFractaloids() : []; }
    function getParticles() { return typeof state.getParticles === 'function' ? state.getParticles() : []; }
    function getShockwaves() { return typeof state.getShockwaves === 'function' ? state.getShockwaves() : []; }
    function getSaucer() { return typeof state.getSaucer === 'function' ? state.getSaucer() : null; }
    function setSaucer(v) { if (typeof state.setSaucer === 'function') state.setSaucer(v); }

    function isCurvatureSaucer(saucerObj) {
      return !!saucerObj && saucerObj.shapeClass === 'pseudosphere';
    }

    function projectRenderPoint(x, y, radius = 0) {
      if (!isNonEuclideanActive() || !projectPointForRender) {
        return { x, y, scale: 1, hidden: false };
      }
      const p = projectPointForRender(x, y, radius) || null;
      if (!p) return { x, y, scale: 1, hidden: true };
      const px = Number.isFinite(p.x) ? p.x : x;
      const py = Number.isFinite(p.y) ? p.y : y;
      const scale = Number.isFinite(p.scale) ? p.scale : 1;
      const hidden = p.insideDisk === false || p.hidden === true;
      return { x: px, y: py, scale, hidden };
    }

    function projectRenderRadius(radius, scale = 1) {
      if (!isNonEuclideanActive() || !projectRadiusForRender) {
        return Math.max(0, radius);
      }
      const projected = projectRadiusForRender(radius, scale);
      return Math.max(0, Number.isFinite(projected) ? projected : radius);
    }

    function nonEuclideanFarFieldRadius(extra = 0) {
      const base = Math.max(getWidth(), getHeight()) * 8.0;
      return Math.max(24, base + Math.max(0, extra));
    }

    function isOutsideNonEuclideanFarField(obj, extra = 0) {
      if (!isNonEuclideanActive() || !obj) return false;
      const cx = getWidth() * 0.5;
      const cy = getHeight() * 0.5;
      const dx = (Number.isFinite(obj.x) ? obj.x : cx) - cx;
      const dy = (Number.isFinite(obj.y) ? obj.y : cy) - cy;
      const rr = nonEuclideanFarFieldRadius(extra);
      return (dx * dx + dy * dy) > rr * rr;
    }

    function checkExtraLife() {
      if (getScore() >= getNextExtraLife()) {
        setLives(getLives() + 1);
        setNextExtraLife(getNextExtraLife() + 10000);
        sfx.extraLife();
      }
    }

    function spawnSaucer() {
      const score = getScore();
      const isSmall = score > 10000 || Math.random() < Math.min(0.4 + score / 30000, 0.7);
      const cfg = isSmall ? SAUCER_SMALL : SAUCER_LARGE;
      const fromLeft = Math.random() < 0.5;
      const shapeClass = resolveSaucerFractalClass();
      const saucer = {
        x: fromLeft ? -30 : getWidth() + 30,
        y: rand(60, getHeight() - 60),
        vx: (fromLeft ? 1 : -1) * cfg.speed,
        vy: 0,
        r: cfg.r,
        isSmall,
        cfg,
        fireTimer: cfg.fireRate * 0.6,
        directionTimer: rand(1.5, 3),
        shapeClass
      };
      setSaucer(saucer);
    }

    function saucerFire() {
      const saucer = getSaucer();
      if (!saucer) return;
      let angle;
      const ship = getShip();
      if (saucer.cfg.accuracy > 0 && ship && ship.alive) {
        const dx = ship.x - saucer.x;
        const dy = ship.y - saucer.y;
        angle = Math.atan2(dy, dx);
        angle += (1 - saucer.cfg.accuracy) * (Math.random() - 0.5) * Math.PI;
      } else {
        angle = Math.random() * Math.PI * 2;
      }
      const curvatureShot = isCurvatureSaucer(saucer) && Math.random() < (saucer.isSmall ? 0.72 : 0.58);
      const speedMul = curvatureShot ? 0.62 : 0.85;
      const radius = curvatureShot ? 4.8 : 1.5;
      const life = 1.0;
      getSaucerBullets().push({
        x: saucer.x,
        y: saucer.y,
        vx: Math.cos(angle) * BULLET_SPEED * speedMul,
        vy: Math.sin(angle) * BULLET_SPEED * speedMul,
        life,
        r: radius,
        maxLife: life,
        kind: curvatureShot ? 'curvature' : 'normal',
        saucerClass: saucer.shapeClass || 'classic',
        warpDurationSec: curvatureShot ? (saucer.isSmall ? 22 : 18) : 0
      });
      sfx.saucerFire();
    }

    function updateSaucer(dt) {
      const saucer = getSaucer();
      if (!saucer) return;
      const nonEuclid = isNonEuclideanActive();

      saucer.x += saucer.vx * dt;
      saucer.y += saucer.vy * dt;

      saucer.directionTimer -= dt;
      if (saucer.directionTimer <= 0) {
        saucer.vy = randSign() * saucer.cfg.speed * 0.5;
        saucer.directionTimer = rand(1.2, 2.5);
      }
      if (!nonEuclid) {
        if (saucer.y < 30) saucer.vy = Math.abs(saucer.vy);
        if (saucer.y > getHeight() - 30) saucer.vy = -Math.abs(saucer.vy);
        if (saucer.vx > 0 && saucer.x > getWidth() + 40) {
          setSaucer(null);
          return;
        }
        if (saucer.vx < 0 && saucer.x < -40) {
          setSaucer(null);
          return;
        }
      } else if (isOutsideNonEuclideanFarField(saucer, (saucer.r || 0) + 260)) {
        setSaucer(null);
        return;
      }

      const ship = getShip();
      saucer.fireTimer -= dt;
      if (saucer.fireTimer <= 0 && ship && ship.alive) {
        saucerFire();
        saucer.fireTimer = saucer.cfg.fireRate;
      }
    }

    function drawKochSegment(x1, y1, x2, y2, depth) {
      if (!ctx) return;
      if (depth <= 0) {
        ctx.lineTo(x2, y2);
        return;
      }
      const dx = (x2 - x1) / 3;
      const dy = (y2 - y1) / 3;
      const ax = x1 + dx;
      const ay = y1 + dy;
      const bx = x1 + dx * 2;
      const by = y1 + dy * 2;
      const px = ax + dx * 0.5 - dy * 0.86602540378;
      const py = ay + dy * 0.5 + dx * 0.86602540378;

      drawKochSegment(x1, y1, ax, ay, depth - 1);
      drawKochSegment(ax, ay, px, py, depth - 1);
      drawKochSegment(px, py, bx, by, depth - 1);
      drawKochSegment(bx, by, x2, y2, depth - 1);
    }

    function drawKochSnowflake(radius, depth) {
      if (!ctx) return;
      const p1 = { x: 0, y: -radius };
      const p2 = { x: -radius * 0.866, y: radius * 0.5 };
      const p3 = { x: radius * 0.866, y: radius * 0.5 };
      const baseWidth = Math.max(0.48, Math.min(0.92, radius * 0.04));

      strokeWithVectorGlow(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        drawKochSegment(p1.x, p1.y, p2.x, p2.y, depth);
        drawKochSegment(p2.x, p2.y, p3.x, p3.y, depth);
        drawKochSegment(p3.x, p3.y, p1.x, p1.y, depth);
        ctx.closePath();
      }, {
        baseWidth,
        glowQuality: 'low',
        haloWidthMul: 1.25,
        haloAlpha: 0.12,
        bodyWidthMul: 0.92,
        coreWidthMul: 0.68,
        blur: 2.8
      });
    }

    function drawSaucer() {
      if (!ctx) return;
      const saucer = getSaucer();
      if (!saucer) return;
      const projected = projectRenderPoint(saucer.x, saucer.y, saucer.r);
      if (projected.hidden) return;
      ctx.save();
      ctx.translate(projected.x, projected.y);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      const r = Math.max(2, projectRenderRadius(saucer.r, projected.scale));
      const saucerClass = saucer.shapeClass || 'classic';
      if (saucerClass === 'sierpinski') {
        const s = r * 1.08;
        const depth = saucer.isSmall ? 2 : 3;
        drawSierpinski(0, -s * 0.84, -s * 0.92, s * 0.72, s * 0.92, s * 0.72, depth);
        strokeWithVectorGlow(ctx, () => {
          ctx.beginPath();
          ctx.moveTo(-r * 0.48, r * 0.22);
          ctx.lineTo(r * 0.48, r * 0.22);
        }, {
          haloWidthMul: 2.1,
          haloAlpha: 0.24,
          blur: 5.2
        });
      } else if (saucerClass === 'koch') {
        const depth = r < 19 ? 2 : (saucer.isSmall ? 2 : 3);
        drawKochSnowflake(r * 0.94, depth);
        const coreWidth = Math.max(0.45, Math.min(0.92, r * 0.035));
        strokeWithVectorGlow(ctx, () => {
          ctx.beginPath();
          ctx.arc(0, r * 0.08, r * 0.16, 0, Math.PI * 2);
        }, {
          baseWidth: coreWidth,
          glowQuality: 'low',
          haloWidthMul: 1.3,
          haloAlpha: 0.14,
          bodyWidthMul: 0.9,
          coreWidthMul: 0.7,
          blur: 2.8
        });
      } else if (saucerClass === 'pseudosphere') {
        const outer = r * 0.92;
        const arcW = Math.max(0.6, Math.min(1.2, r * 0.05));
        strokeWithVectorGlow(ctx, () => {
          ctx.beginPath();
          ctx.arc(0, 0, outer, 0, Math.PI * 2);
        }, {
          baseWidth: arcW,
          glowQuality: 'low',
          haloWidthMul: 1.85,
          haloAlpha: 0.24,
          bodyWidthMul: 0.9,
          coreWidthMul: 0.68,
          blur: 4.8
        });

        strokeWithVectorGlow(ctx, () => {
          ctx.beginPath();
          ctx.moveTo(-outer * 0.78, 0);
          ctx.quadraticCurveTo(0, -outer * 0.68, outer * 0.78, 0);
          ctx.moveTo(-outer * 0.78, 0);
          ctx.quadraticCurveTo(0, outer * 0.68, outer * 0.78, 0);
          ctx.moveTo(0, -outer * 0.78);
          ctx.quadraticCurveTo(-outer * 0.68, 0, 0, outer * 0.78);
          ctx.moveTo(0, -outer * 0.78);
          ctx.quadraticCurveTo(outer * 0.68, 0, 0, outer * 0.78);
        }, {
          baseWidth: arcW * 0.94,
          glowQuality: 'low',
          haloWidthMul: 1.7,
          haloAlpha: 0.22,
          bodyWidthMul: 0.88,
          coreWidthMul: 0.62,
          blur: 4.6
        });

        strokeWithVectorGlow(ctx, () => {
          ctx.beginPath();
          ctx.arc(0, 0, outer * 0.26, 0, Math.PI * 2);
        }, {
          baseWidth: arcW * 0.9,
          glowQuality: 'low',
          haloWidthMul: 1.5,
          haloAlpha: 0.2,
          bodyWidthMul: 0.84,
          coreWidthMul: 0.6,
          blur: 3.8
        });
      } else {
        strokeWithVectorGlow(ctx, () => {
          ctx.beginPath();
          ctx.moveTo(-r, 0);
          ctx.lineTo(-r * 0.5, -r * 0.4);
          ctx.lineTo(r * 0.5, -r * 0.4);
          ctx.lineTo(r, 0);
          ctx.lineTo(r * 0.5, r * 0.4);
          ctx.lineTo(-r * 0.5, r * 0.4);
          ctx.closePath();
          ctx.moveTo(-r, 0);
          ctx.lineTo(r, 0);
          ctx.moveTo(-r * 0.5, -r * 0.4);
          ctx.lineTo(-r * 0.25, -r * 0.75);
          ctx.lineTo(r * 0.25, -r * 0.75);
          ctx.lineTo(r * 0.5, -r * 0.4);
        }, {
          haloWidthMul: 2.1,
          haloAlpha: 0.24,
          blur: 5.2
        });
      }
      ctx.restore();
    }

    function explode(x, y, count, scale = 1) {
      const particles = getParticles();
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = rand(40, 180) * scale;
        particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: rand(0.4, 1.0) * scale,
          maxLife: 1,
          size: rand(1, 2.5)
        });
      }
    }

    function spawnShockwave(x, y, sourceRadius, seed = 0) {
      const r0 = Math.max(10, sourceRadius * 0.62);
      const r1 = r0 + sourceRadius * SHOCKWAVE_RADIUS_GAIN;
      getShockwaves().push({
        x,
        y,
        r0,
        r1,
        age: 0,
        life: SHOCKWAVE_LIFE * rand(0.92, 1.08),
        phase: Math.random() * Math.PI * 2,
        seed
      });
    }

    function drawShockwaveRing(w, radius, alpha, width, harmonicScale) {
      if (!ctx) return;
      const points = 84;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = width;
      ctx.strokeStyle = `hsl(${38 + w.seed * 84}, 92%, ${62 + harmonicScale * 14}%)`;
      strokeWithVectorGlow(ctx, () => {
        let started = false;
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const t = i / points;
          const a = t * Math.PI * 2;
          const jitter = 1 + Math.sin(a * 6 + w.phase) * 0.05 + Math.sin(a * 11 + w.seed * 9) * 0.025;
          const x = w.x + Math.cos(a) * radius * jitter;
          const y = w.y + Math.sin(a) * radius * jitter;
          const p = projectRenderPoint(x, y, 0);
          if (p.hidden) continue;
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
      }, {
        haloWidthMul: 1.8,
        haloAlpha: 0.3,
        blur: 5.8
      });
    }

    function updateParticles(dt) {
      const particles = getParticles();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) particles.splice(i, 1);
      }
    }

    function updateShockwaves(dt) {
      const shockwaves = getShockwaves();
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const w = shockwaves[i];
        w.age += dt;
        if (w.age >= w.life) shockwaves.splice(i, 1);
      }
    }

    function drawParticles() {
      if (!ctx) return;
      ctx.fillStyle = '#fff';
      for (const p of getParticles()) {
        const projected = projectRenderPoint(p.x, p.y, p.size * 0.5);
        if (projected.hidden) continue;
        const drawSize = Math.max(0.8, p.size * projected.scale);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.fillRect(projected.x - drawSize / 2, projected.y - drawSize / 2, drawSize, drawSize);
      }
      ctx.globalAlpha = 1;
    }

    function drawShockwaves() {
      if (!ctx) return;
      const shockwaves = getShockwaves();
      if (shockwaves.length === 0) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const w of shockwaves) {
        const t = Math.min(1, w.age / w.life);
        const eased = 1 - Math.pow(1 - t, 2.2);
        const radius = w.r0 + (w.r1 - w.r0) * eased;
        const fade = Math.max(0, 1 - t);

        drawShockwaveRing(w, radius, fade * 0.42, SHOCKWAVE_WIDTH, 0.2);
        drawShockwaveRing(w, radius * 0.74, fade * 0.22, SHOCKWAVE_WIDTH * 0.58, 0.55);
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    function updateBullets(dt) {
      const bullets = getBullets();
      const saucerBullets = getSaucerBullets();
      const width = getWidth();
      const height = getHeight();
      const nonEuclid = isNonEuclideanActive();

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.prevX = b.x;
        b.prevY = b.y;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt;
        if (!nonEuclid) {
          if (b.x < 0) b.x += width;
          if (b.x > width) b.x -= width;
          if (b.y < 0) b.y += height;
          if (b.y > height) b.y -= height;
        }
        if (b.life <= 0 || isOutsideNonEuclideanFarField(b, (b.r || 1.5) + 120)) bullets.splice(i, 1);
      }
      for (let i = saucerBullets.length - 1; i >= 0; i--) {
        const b = saucerBullets[i];
        b.prevX = b.x;
        b.prevY = b.y;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt;
        if (!nonEuclid) {
          if (b.x < 0) b.x += width;
          if (b.x > width) b.x -= width;
          if (b.y < 0) b.y += height;
          if (b.y > height) b.y -= height;
        }
        if (b.life <= 0 || isOutsideNonEuclideanFarField(b, (b.r || 2.0) + 120)) saucerBullets.splice(i, 1);
      }
    }

    function drawBullets() {
      if (!ctx) return;
      const nonEuclid = isNonEuclideanActive();
      ctx.fillStyle = '#fff';
      for (const b of getBullets()) {
        const p = projectRenderPoint(b.x, b.y, b.r || 1.5);
        if (p.hidden) continue;
        if (nonEuclid) {
          const p0 = projectRenderPoint(Number.isFinite(b.prevX) ? b.prevX : b.x, Number.isFinite(b.prevY) ? b.prevY : b.y, b.r || 1.5);
          if (!p0.hidden) {
            ctx.strokeStyle = 'rgba(214, 244, 255, 0.58)';
            ctx.lineWidth = Math.max(0.65, 1.35 * p.scale);
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
        const size = Math.max(1.1, 3 * p.scale);
        ctx.fillStyle = '#fff';
        ctx.fillRect(p.x - size * 0.5, p.y - size * 0.5, size, size);
      }
      for (const b of getSaucerBullets()) {
        const p = projectRenderPoint(b.x, b.y, b.r || 1.9);
        if (p.hidden) continue;
        const lifeMax = Number.isFinite(b.maxLife) && b.maxLife > 0 ? b.maxLife : 1;
        const t = Math.max(0, Math.min(1, 1 - (b.life / lifeMax)));
        const isCurvature = b.kind === 'curvature';
        const size = Math.max(
          isCurvature ? 2.6 : 1.2,
          (isCurvature ? Math.max(4.6, (b.r || 2) * 1.8) : 3.8) * p.scale
        );
        ctx.fillStyle = isCurvature
          ? `hsla(${188 + t * 28}, 98%, ${66 + t * 8}%, 0.94)`
          : `hsl(${280 + t * 70}, 95%, ${62 - t * 14}%)`;
        if (nonEuclid) {
          const p0 = projectRenderPoint(Number.isFinite(b.prevX) ? b.prevX : b.x, Number.isFinite(b.prevY) ? b.prevY : b.y, b.r || 1.9);
          if (!p0.hidden) {
            ctx.strokeStyle = isCurvature
              ? `hsla(${192 + t * 24}, 98%, ${72 + t * 6}%, 0.62)`
              : `hsla(${280 + t * 70}, 95%, ${62 - t * 14}%, 0.56)`;
            ctx.lineWidth = Math.max(isCurvature ? 1.0 : 0.7, (isCurvature ? 2.2 : 1.5) * p.scale);
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
        ctx.fillRect(p.x - size * 0.5, p.y - size * 0.5, size, size);
        if (isCurvature) {
          ctx.strokeStyle = `hsla(${188 + t * 26}, 100%, ${72 + t * 6}%, 0.84)`;
          ctx.lineWidth = Math.max(0.6, 1.15 * p.scale);
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1.2, size * 0.72), 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    function checkCollisions() {
      const bullets = getBullets();
      const fractaloids = getFractaloids();
      const ship = getShip();
      const saucerBullets = getSaucerBullets();
      let saucer = getSaucer();

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        for (let j = fractaloids.length - 1; j >= 0; j--) {
          const a = fractaloids[j];
          if (dist2(b, a) < a.r * a.r) {
            if (maybeEnterFractalDive(a, b)) {
              bullets.splice(i, 1);
              break;
            }
            bullets.splice(i, 1);
            const destroyed = damageFractaloid(a, b, true);
            if (destroyed) fractaloids.splice(j, 1);
            checkExtraLife();
            break;
          }
        }
      }

      saucer = getSaucer();
      if (saucer) {
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          if (dist2(b, saucer) < saucer.r * saucer.r) {
            bullets.splice(i, 1);
            setScore(getScore() + saucer.cfg.score);
            explode(saucer.x, saucer.y, 16, 1.0);
            sfx.bangMedium();
            setSaucer(null);
            checkExtraLife();
            break;
          }
        }
      }

      if (ship && ship.alive && ship.invuln <= 0) {
        for (const a of fractaloids) {
          if (dist2(ship, a) < (a.r + ship.r) * (a.r + ship.r)) {
            const destroyed = damageFractaloid(a, ship, true);
            if (destroyed) fractaloids.splice(fractaloids.indexOf(a), 1);
            killShip();
            return;
          }
        }

        saucer = getSaucer();
        if (saucer && dist2(ship, saucer) < (saucer.r + ship.r) * (saucer.r + ship.r)) {
          explode(saucer.x, saucer.y, 16, 1.0);
          sfx.bangMedium();
          setSaucer(null);
          killShip();
          return;
        }

        for (let i = saucerBullets.length - 1; i >= 0; i--) {
          const b = saucerBullets[i];
          if (dist2(ship, b) < (ship.r + b.r) * (ship.r + b.r)) {
            saucerBullets.splice(i, 1);
            if (b.kind === 'curvature' || b.saucerClass === 'pseudosphere') {
              triggerNonEuclideanFromSaucerHit({
                reason: 'saucer-hit',
                durationSec: b.warpDurationSec,
                originX: ship.x,
                originY: ship.y
              });
              explode(ship.x, ship.y, 10, 0.5);
              spawnShockwave(ship.x, ship.y, Math.max(ship.r, b.r || 2), (b.life || 0) * 0.37);
              return;
            }
            killShip();
            return;
          }
        }
      }

      for (let i = saucerBullets.length - 1; i >= 0; i--) {
        const b = saucerBullets[i];
        for (let j = fractaloids.length - 1; j >= 0; j--) {
          const a = fractaloids[j];
          if (dist2(b, a) < a.r * a.r) {
            saucerBullets.splice(i, 1);
            const destroyed = damageFractaloid(a, b, false);
            if (destroyed) fractaloids.splice(j, 1);
            break;
          }
        }
      }
    }

    return {
      spawnSaucer,
      updateSaucer,
      drawSaucer,
      explode,
      spawnShockwave,
      updateParticles,
      updateShockwaves,
      drawParticles,
      drawShockwaves,
      updateBullets,
      drawBullets,
      checkCollisions,
      checkExtraLife
    };
  }

  window.FrackingGameplaySystems = { create };
})();
