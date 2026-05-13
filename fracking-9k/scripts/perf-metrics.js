(() => {
  'use strict';

  function mean(values) {
    if (!values.length) return 0;
    let total = 0;
    for (let i = 0; i < values.length; i++) total += values[i];
    return total / values.length;
  }

  function percentileFromSorted(sortedValues, p) {
    if (!sortedValues.length) return 0;
    const clamped = Math.max(0, Math.min(1, p));
    const index = Math.min(sortedValues.length - 1, Math.floor((sortedValues.length - 1) * clamped));
    return sortedValues[index];
  }

  function buildStats(samples) {
    const frameValues = [];
    const cpuValues = [];
    const dtValues = [];
    let slow16 = 0;
    let slow33 = 0;
    let fractaloidSum = 0;
    let bulletSum = 0;
    let saucerBulletSum = 0;
    let particleSum = 0;
    let shockwaveSum = 0;
    const stateCounts = {};

    for (let i = 0; i < samples.length; i++) {
      const s = samples[i];
      if (s.frameMs > 0) {
        frameValues.push(s.frameMs);
        if (s.frameMs > 16.7) slow16++;
        if (s.frameMs > 33.3) slow33++;
      }
      if (s.cpuMs >= 0) cpuValues.push(s.cpuMs);
      if (s.dtMs >= 0) dtValues.push(s.dtMs);
      fractaloidSum += s.fractaloids || 0;
      bulletSum += s.bullets || 0;
      saucerBulletSum += s.saucerBullets || 0;
      particleSum += s.particles || 0;
      shockwaveSum += s.shockwaves || 0;
      const stateKey = s.state || 'unknown';
      stateCounts[stateKey] = (stateCounts[stateKey] || 0) + 1;
    }

    const frameSorted = frameValues.slice().sort((a, b) => a - b);
    const cpuSorted = cpuValues.slice().sort((a, b) => a - b);
    const dtSorted = dtValues.slice().sort((a, b) => a - b);
    const frameAvg = mean(frameValues);
    const cpuAvg = mean(cpuValues);
    const dtAvg = mean(dtValues);
    const spanMs = samples.length >= 2
      ? Math.max(0, (samples[samples.length - 1].rafTs || 0) - (samples[0].rafTs || 0))
      : 0;

    return {
      sampleCount: samples.length,
      durationMs: spanMs,
      fpsAvg: frameAvg > 0 ? (1000 / frameAvg) : 0,
      frameMsAvg: frameAvg,
      frameMsP95: percentileFromSorted(frameSorted, 0.95),
      frameMsP99: percentileFromSorted(frameSorted, 0.99),
      frameMsMax: frameSorted.length ? frameSorted[frameSorted.length - 1] : 0,
      cpuMsAvg: cpuAvg,
      cpuMsP95: percentileFromSorted(cpuSorted, 0.95),
      cpuMsP99: percentileFromSorted(cpuSorted, 0.99),
      cpuMsMax: cpuSorted.length ? cpuSorted[cpuSorted.length - 1] : 0,
      dtMsAvg: dtAvg,
      dtMsP95: percentileFromSorted(dtSorted, 0.95),
      slowFramePct16: frameValues.length ? (slow16 / frameValues.length) * 100 : 0,
      slowFramePct33: frameValues.length ? (slow33 / frameValues.length) * 100 : 0,
      entitiesAvg: {
        fractaloids: samples.length ? fractaloidSum / samples.length : 0,
        bullets: samples.length ? bulletSum / samples.length : 0,
        saucerBullets: samples.length ? saucerBulletSum / samples.length : 0,
        particles: samples.length ? particleSum / samples.length : 0,
        shockwaves: samples.length ? shockwaveSum / samples.length : 0
      },
      stateCounts
    };
  }

  function fmt(value, digits = 2) {
    if (!Number.isFinite(value)) return 'n/a';
    return value.toFixed(digits);
  }

  function create(options = {}) {
    const rollingWindowMs = Number.isFinite(options.rollingWindowMs) ? options.rollingWindowMs : 5000;
    const overlayIntervalMs = Number.isFinite(options.overlayIntervalMs) ? options.overlayIntervalMs : 250;
    const maxCaptureSamples = Number.isFinite(options.maxCaptureSamples) ? options.maxCaptureSamples : 36000;
    const nowFn = typeof options.nowFn === 'function' ? options.nowFn : () => performance.now();
    const metaProvider = typeof options.metaProvider === 'function' ? options.metaProvider : () => ({});
    let rollingSamples = [];
    let snapshots = [];
    let activeCapture = null;
    let lastRafTs = null;
    let overlayEl = null;
    let overlayVisible = options.overlayVisible === true;
    let lastOverlayPaintTs = 0;

    function ensureOverlay() {
      if (overlayEl || !document.body) return;
      overlayEl = document.createElement('pre');
      overlayEl.id = 'perf-overlay';
      overlayEl.style.position = 'fixed';
      overlayEl.style.left = '10px';
      overlayEl.style.top = '10px';
      overlayEl.style.padding = '8px 10px';
      overlayEl.style.margin = '0';
      overlayEl.style.background = 'rgba(0,0,0,0.68)';
      overlayEl.style.border = '1px solid rgba(255,255,255,0.26)';
      overlayEl.style.color = '#d9ffe0';
      overlayEl.style.font = '12px/1.22 Menlo, Consolas, monospace';
      overlayEl.style.whiteSpace = 'pre';
      overlayEl.style.zIndex = '99';
      overlayEl.style.pointerEvents = 'none';
      overlayEl.style.textShadow = '0 0 4px rgba(120,255,160,0.35)';
      overlayEl.style.display = overlayVisible ? 'block' : 'none';
      document.body.appendChild(overlayEl);
    }

    function setOverlayVisible(v) {
      overlayVisible = !!v;
      ensureOverlay();
      if (overlayEl) overlayEl.style.display = overlayVisible ? 'block' : 'none';
      if (overlayVisible) paintOverlay(true);
    }

    function isOverlayVisible() {
      return overlayVisible;
    }

    function pruneRolling(latestTs) {
      const cutoff = latestTs - rollingWindowMs;
      let start = 0;
      while (start < rollingSamples.length && rollingSamples[start].rafTs < cutoff) start++;
      if (start > 0) rollingSamples = rollingSamples.slice(start);
    }

    function paintOverlay(force = false) {
      if (!overlayVisible) return;
      ensureOverlay();
      if (!overlayEl) return;
      const nowTs = nowFn();
      if (!force && nowTs - lastOverlayPaintTs < overlayIntervalMs) return;
      lastOverlayPaintTs = nowTs;
      const stats = buildStats(rollingSamples);
      const meta = metaProvider() || {};
      const captureLabel = activeCapture ? activeCapture.label : '-';
      const geometryBlock = meta.viewportRect || meta.playfieldRect || meta.worldRect || meta.render2dRect || meta.renderFractalRect
        ? (
            `geo ${meta.geometryMode || 'default'}\n` +
            `viewport ${meta.viewportRect || meta.viewport || 'n/a'}\n` +
            `playfield ${meta.playfieldRect || 'n/a'}\n` +
            `world ${meta.worldRect || meta.world || 'n/a'}\n` +
            `render2d ${meta.render2dRect || meta.render || 'n/a'}  gl ${meta.renderFractalRect || 'n/a'}\n` +
            `scale css/world ${meta.worldToPlayfieldScale || 'n/a'}  dpr ${meta.dpr != null ? meta.dpr : 'n/a'} ds ${meta.displayScale != null ? meta.displayScale : 'n/a'}\n`
          )
        : '';
      overlayEl.textContent =
        `Perf (${meta.mode || 'mode?'} | ${meta.state || 'state?'})\n` +
        `fps ${fmt(stats.fpsAvg, 1)}  frame ${fmt(stats.frameMsAvg)}ms p95 ${fmt(stats.frameMsP95)} p99 ${fmt(stats.frameMsP99)}\n` +
        `cpu ${fmt(stats.cpuMsAvg)}ms p95 ${fmt(stats.cpuMsP95)}  slow16 ${fmt(stats.slowFramePct16, 1)}% slow33 ${fmt(stats.slowFramePct33, 1)}%\n` +
        geometryBlock +
        `ents f=${fmt(stats.entitiesAvg.fractaloids, 1)} b=${fmt(stats.entitiesAvg.bullets, 1)} sb=${fmt(stats.entitiesAvg.saucerBullets, 1)} p=${fmt(stats.entitiesAvg.particles, 1)} sw=${fmt(stats.entitiesAvg.shockwaves, 1)}\n` +
        `cap: ${captureLabel}  samples=${stats.sampleCount}`;
    }

    function beginFrame(rafTs) {
      const ts = Number.isFinite(rafTs) ? rafTs : nowFn();
      const cpuStart = nowFn();
      const frameMs = lastRafTs == null ? 0 : Math.max(0, ts - lastRafTs);
      lastRafTs = ts;
      return { rafTs: ts, cpuStart, frameMs };
    }

    function endFrame(token, info = {}) {
      if (!token) return;
      const sample = {
        rafTs: token.rafTs,
        frameMs: token.frameMs,
        cpuMs: Math.max(0, nowFn() - token.cpuStart),
        dtMs: Number.isFinite(info.dtMs) ? info.dtMs : 0,
        state: info.state || 'unknown',
        wave: Number.isFinite(info.wave) ? info.wave : 0,
        fractaloids: Number.isFinite(info.fractaloids) ? info.fractaloids : 0,
        bullets: Number.isFinite(info.bullets) ? info.bullets : 0,
        saucerBullets: Number.isFinite(info.saucerBullets) ? info.saucerBullets : 0,
        particles: Number.isFinite(info.particles) ? info.particles : 0,
        shockwaves: Number.isFinite(info.shockwaves) ? info.shockwaves : 0
      };
      rollingSamples.push(sample);
      pruneRolling(sample.rafTs);

      if (activeCapture) {
        if (activeCapture.samples.length < maxCaptureSamples) activeCapture.samples.push(sample);
        else activeCapture.droppedSamples++;
      }
      paintOverlay(false);
    }

    function startCapture(label = 'capture') {
      activeCapture = {
        label: String(label),
        startedAtMs: nowFn(),
        startedAtIso: new Date().toISOString(),
        samples: [],
        droppedSamples: 0
      };
      paintOverlay(true);
      return { label: activeCapture.label, startedAtIso: activeCapture.startedAtIso };
    }

    function finalizeCapture(capture) {
      const stats = buildStats(capture.samples);
      return {
        label: capture.label,
        startedAtIso: capture.startedAtIso,
        endedAtIso: new Date().toISOString(),
        durationMs: stats.durationMs,
        droppedSamples: capture.droppedSamples,
        meta: metaProvider() || {},
        stats
      };
    }

    function stopCapture() {
      if (!activeCapture) return null;
      const capture = activeCapture;
      activeCapture = null;
      const snapshot = finalizeCapture(capture);
      snapshots.push(snapshot);
      if (snapshots.length > 32) snapshots = snapshots.slice(snapshots.length - 32);
      paintOverlay(true);
      return snapshot;
    }

    function snapshot(label = 'snapshot') {
      const snap = {
        label: String(label),
        startedAtIso: new Date().toISOString(),
        endedAtIso: new Date().toISOString(),
        durationMs: rollingSamples.length >= 2
          ? Math.max(0, rollingSamples[rollingSamples.length - 1].rafTs - rollingSamples[0].rafTs)
          : 0,
        droppedSamples: 0,
        meta: metaProvider() || {},
        stats: buildStats(rollingSamples)
      };
      snapshots.push(snap);
      if (snapshots.length > 32) snapshots = snapshots.slice(snapshots.length - 32);
      return snap;
    }

    function getSnapshots() {
      return snapshots.slice();
    }

    function getRollingStats() {
      return buildStats(rollingSamples);
    }

    function clearSnapshots() {
      snapshots = [];
    }

    function bindGlobalApi() {
      const api = {
        start: (label) => startCapture(label),
        stop: () => stopCapture(),
        snap: (label) => snapshot(label),
        stats: () => getRollingStats(),
        list: () => getSnapshots(),
        clear: () => clearSnapshots(),
        show: () => setOverlayVisible(true),
        hide: () => setOverlayVisible(false),
        toggle: () => setOverlayVisible(!isOverlayVisible())
      };
      window.frackingPerf = api;
      return api;
    }

    if (overlayVisible) ensureOverlay();

    return {
      beginFrame,
      endFrame,
      startCapture,
      stopCapture,
      snapshot,
      getSnapshots,
      getRollingStats,
      clearSnapshots,
      setOverlayVisible,
      isOverlayVisible,
      bindGlobalApi
    };
  }

  window.FrackingPerfMetrics = { create };
})();
