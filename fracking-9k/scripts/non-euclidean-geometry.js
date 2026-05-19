(() => {
  'use strict';

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function asFinite(v, fallback) {
    return Number.isFinite(v) ? v : fallback;
  }

  function create(options = {}) {
    const diskFillDefault = clamp(asFinite(options.diskFillDefault, 0.46), 0.12, 0.92);
    const curvatureMulDefault = clamp(asFinite(options.curvatureMulDefault, 1.0), 0.08, 12.0);
    const minScale = clamp(asFinite(options.minScale, 0.02), 0.001, 1.0);

    function resolveView(view = {}) {
      if (view && view.__nonEuclidResolved) return view;
      const width = Math.max(1, asFinite(view.width, 1));
      const height = Math.max(1, asFinite(view.height, 1));
      const centerX = asFinite(view.centerX, width * 0.5);
      const centerY = asFinite(view.centerY, height * 0.5);
      const originX = asFinite(view.originX, width * 0.5);
      const originY = asFinite(view.originY, height * 0.5);
      const diskFill = clamp(asFinite(view.diskFill, diskFillDefault), 0.12, 0.92);
      const diskRadius = Math.max(10, asFinite(view.diskRadius, Math.min(width, height) * diskFill));
      const curvatureMul = clamp(asFinite(view.curvatureMul, curvatureMulDefault), 0.08, 12.0);
      const curvature = Math.max(1e-6, asFinite(view.curvature, diskRadius * curvatureMul));

      return {
        __nonEuclidResolved: true,
        width,
        height,
        centerX,
        centerY,
        originX,
        originY,
        diskRadius,
        curvature
      };
    }

    function projectPoint(x, y, view = {}) {
      const v = resolveView(view);
      const dx = x - v.originX;
      const dy = y - v.originY;
      const rho = Math.hypot(dx, dy);
      if (rho < 1e-9) {
        return {
          x: v.centerX,
          y: v.centerY,
          rNorm: 0,
          scale: 1,
          insideDisk: true
        };
      }

      const rNorm = Math.tanh(rho / v.curvature);
      const mapped = v.diskRadius * rNorm;
      const invRho = 1 / rho;
      const px = v.centerX + dx * invRho * mapped;
      const py = v.centerY + dy * invRho * mapped;

      // Local metric scale in the disk model (up to a constant).
      const local = (1 - rNorm * rNorm) * (v.diskRadius / v.curvature);
      const scale = Math.max(minScale, local);
      const insideDisk = mapped <= v.diskRadius * 0.999;

      return {
        x: px,
        y: py,
        rNorm,
        scale,
        insideDisk
      };
    }

    function projectRadius(radius, projectedScale) {
      const base = Math.max(0, asFinite(radius, 0));
      const scale = Math.max(minScale, asFinite(projectedScale, 1));
      return base * scale;
    }

    function projectEntity(entity, view = {}) {
      if (!entity) return null;
      const p = projectPoint(entity.x || 0, entity.y || 0, view);
      const out = Object.assign({}, entity);
      out.x = p.x;
      out.y = p.y;
      out.renderScale = p.scale;
      if (Number.isFinite(entity.r)) {
        out.r = projectRadius(entity.r, p.scale);
      }
      out._outsideDisk = !p.insideDisk;
      out._diskRNorm = p.rNorm;
      return out;
    }

    return {
      resolveView,
      projectPoint,
      projectRadius,
      projectEntity
    };
  }

  window.FrackingNonEuclideanGeometry = { create };
})();
