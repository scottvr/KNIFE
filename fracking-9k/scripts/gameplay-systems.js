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

    const sfx = options.sfx || {
      bangLarge: () => {},
      bangMedium: () => {},
      bangSmall: () => {},
      saucerFire: () => {},
      extraLife: () => {}
    };

    const SAUCER_LARGE = options.SAUCER_LARGE || { r: 18, score: 200, speed: 90, fireRate: 1.6, accuracy: 0.0 };
    const SAUCER_SMALL = options.SAUCER_SMALL || { r: 15, score: 1000, speed: 130, fireRate: 1.0, accuracy: 0.75 };
    const BULLET_SPEED = options.BULLET_SPEED != null ? options.BULLET_SPEED : 540;
    const SHOCKWAVE_LIFE = options.SHOCKWAVE_LIFE != null ? options.SHOCKWAVE_LIFE : 0.62;
    const SHOCKWAVE_RADIUS_GAIN = options.SHOCKWAVE_RADIUS_GAIN != null ? options.SHOCKWAVE_RADIUS_GAIN : 2.2;
    const SHOCKWAVE_WIDTH = options.SHOCKWAVE_WIDTH != null ? options.SHOCKWAVE_WIDTH : 2.2;

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
        shapeClass: resolveSaucerFractalClass()
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
      getSaucerBullets().push({
        x: saucer.x,
        y: saucer.y,
        vx: Math.cos(angle) * BULLET_SPEED * 0.85,
        vy: Math.sin(angle) * BULLET_SPEED * 0.85,
        life: 1.0,
        r: 1.5
      });
      sfx.saucerFire();
    }

    function updateSaucer(dt) {
      const saucer = getSaucer();
      if (!saucer) return;

      saucer.x += saucer.vx * dt;
      saucer.y += saucer.vy * dt;

      saucer.directionTimer -= dt;
      if (saucer.directionTimer <= 0) {
        saucer.vy = randSign() * saucer.cfg.speed * 0.5;
        saucer.directionTimer = rand(1.2, 2.5);
      }
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

      strokeWithVectorGlow(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        drawKochSegment(p1.x, p1.y, p2.x, p2.y, depth);
        drawKochSegment(p2.x, p2.y, p3.x, p3.y, depth);
        drawKochSegment(p3.x, p3.y, p1.x, p1.y, depth);
        ctx.closePath();
      }, {
        haloWidthMul: 1.9,
        haloAlpha: 0.2,
        blur: 4.8
      });
    }

    function drawSaucer() {
      if (!ctx) return;
      const saucer = getSaucer();
      if (!saucer) return;
      ctx.save();
      ctx.translate(saucer.x, saucer.y);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      const r = saucer.r;
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
        const depth = saucer.isSmall ? 1 : 2;
        drawKochSnowflake(r * 0.94, depth);
        strokeWithVectorGlow(ctx, () => {
          ctx.beginPath();
          ctx.arc(0, r * 0.08, r * 0.2, 0, Math.PI * 2);
        }, {
          haloWidthMul: 2.1,
          haloAlpha: 0.24,
          blur: 5.2
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
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const t = i / points;
          const a = t * Math.PI * 2;
          const jitter = 1 + Math.sin(a * 6 + w.phase) * 0.05 + Math.sin(a * 11 + w.seed * 9) * 0.025;
          const x = w.x + Math.cos(a) * radius * jitter;
          const y = w.y + Math.sin(a) * radius * jitter;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
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
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
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

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt;
        if (b.x < 0) b.x += width;
        if (b.x > width) b.x -= width;
        if (b.y < 0) b.y += height;
        if (b.y > height) b.y -= height;
        if (b.life <= 0) bullets.splice(i, 1);
      }
      for (let i = saucerBullets.length - 1; i >= 0; i--) {
        const b = saucerBullets[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt;
        if (b.x < 0) b.x += width;
        if (b.x > width) b.x -= width;
        if (b.y < 0) b.y += height;
        if (b.y > height) b.y -= height;
        if (b.life <= 0) saucerBullets.splice(i, 1);
      }
    }

    function drawBullets() {
      if (!ctx) return;
      ctx.fillStyle = '#fff';
      for (const b of getBullets()) ctx.fillRect(b.x - 1.5, b.y - 1.5, 3, 3);
      for (const b of getSaucerBullets()) {
        const t = 1 - b.life;
        ctx.fillStyle = `hsl(${280 + t * 70}, 95%, ${62 - t * 14}%)`;
        ctx.fillRect(b.x - 1.9, b.y - 1.9, 3.8, 3.8);
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
