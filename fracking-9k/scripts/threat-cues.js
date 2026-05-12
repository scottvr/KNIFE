(() => {
  'use strict';

  function create(options = {}) {
    const ctx = options.ctx;

    function wrappedDelta(d, span) {
      if (!span || span <= 0) return d;
      if (d > span * 0.5) return d - span;
      if (d < -span * 0.5) return d + span;
      return d;
    }

    function threatFromFractaloid(ship, target, width, height) {
      const dx = wrappedDelta(target.x - ship.x, width);
      const dy = wrappedDelta(target.y - ship.y, height);
      const dist = Math.max(0.001, Math.hypot(dx, dy));
      const relVx = (target.vx || 0) - (ship.vx || 0);
      const relVy = (target.vy || 0) - (ship.vy || 0);
      const approach = Math.max(0, -((dx * relVx + dy * relVy) / dist));
      const edgeDist = Math.max(0, dist - (target.r || 0) - (ship.r || 0));
      const closeness = Math.max(0, 1 - (edgeDist / 430));
      const score = Math.min(1, closeness * 0.78 + Math.min(1, approach / 230) * 0.22);
      if (score <= 0.06) return null;
      return {
        kind: 'fractaloid',
        // Keep cue anchored to the same world coords as the rendered entity.
        // Using the "nearest wrapped image to ship" can place the cue on the
        // opposite edge before the fractaloid itself appears.
        x: target.x,
        y: target.y,
        radius: Math.max(10, (target.r || 12) + 5),
        score,
        phase: (target.fseed || 0) * Math.PI * 2
      };
    }

    function threatFromBullet(ship, bullet, width, height) {
      const dx = wrappedDelta(bullet.x - ship.x, width);
      const dy = wrappedDelta(bullet.y - ship.y, height);
      const dist = Math.max(0.001, Math.hypot(dx, dy));
      const relVx = (bullet.vx || 0) - (ship.vx || 0);
      const relVy = (bullet.vy || 0) - (ship.vy || 0);
      const approach = Math.max(0, -((dx * relVx + dy * relVy) / dist));
      const edgeDist = Math.max(0, dist - (bullet.r || 2) - (ship.r || 0));
      const closeness = Math.max(0, 1 - (edgeDist / 360));
      const score = Math.min(1, Math.max(0.12, closeness * 0.82 + Math.min(1, approach / 390) * 0.18));
      if (score <= 0.08) return null;
      return {
        kind: 'bullet',
        x: bullet.x,
        y: bullet.y,
        radius: 12,
        score,
        phase: (bullet.life || 0.5) * Math.PI * 4
      };
    }

    function compute(args = {}) {
      const ship = args.ship;
      if (!ship) return [];
      const width = args.width || 0;
      const height = args.height || 0;
      const maxThreats = Math.max(1, args.maxThreats || 2);
      const threats = [];

      const fractaloids = Array.isArray(args.fractaloids) ? args.fractaloids : [];
      for (const target of fractaloids) {
        const threat = threatFromFractaloid(ship, target, width, height);
        if (threat) threats.push(threat);
      }

      const bullets = Array.isArray(args.saucerBullets) ? args.saucerBullets : [];
      for (const bullet of bullets) {
        const threat = threatFromBullet(ship, bullet, width, height);
        if (threat) threats.push(threat);
      }

      threats.sort((a, b) => b.score - a.score);
      return threats.slice(0, maxThreats);
    }

    function draw(args = {}) {
      if (!ctx) return;
      const ship = args.ship;
      const threats = Array.isArray(args.threats) ? args.threats : [];
      if (!ship || !threats.length) return;
      const timeSec = Number.isFinite(args.timeSec) ? args.timeSec : 0;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      for (let i = 0; i < threats.length; i++) {
        const threat = threats[i];
        const pulse = 0.52 + 0.48 * Math.sin(timeSec * 8.6 + threat.phase + i * 0.9);
        const radius = threat.radius + pulse * 3 + i * 2.8;
        const alpha = Math.min(0.55, 0.12 + threat.score * 0.36);
        const hue = threat.kind === 'bullet' ? 14 : (i === 0 ? 28 : 48);

        ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${alpha})`;
        ctx.lineWidth = 1.2 + i * 0.35;
        ctx.setLineDash(i === 0 ? [] : [5, 7]);
        ctx.beginPath();
        ctx.arc(threat.x, threat.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        const toShipX = ship.x - threat.x;
        const toShipY = ship.y - threat.y;
        const len = Math.max(0.001, Math.hypot(toShipX, toShipY));
        const ux = toShipX / len;
        const uy = toShipY / len;
        ctx.beginPath();
        ctx.moveTo(threat.x + ux * (radius + 2), threat.y + uy * (radius + 2));
        ctx.lineTo(threat.x + ux * (radius + 10 + pulse * 2), threat.y + uy * (radius + 10 + pulse * 2));
        ctx.stroke();
      }

      ctx.restore();
    }

    return {
      compute,
      draw
    };
  }

  window.FrackingThreatCues = { create };
})();
