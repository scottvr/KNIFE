(() => {
  'use strict';

  const DEFAULT_CLASS_MODES = {
    tau: 0,
    julia: 1,
    magnet: 2,
    buffalo: 3,
    tricorn: 4,
    mandelbrot: 5
  };

  const DEFAULT_MODE_NAMES = {
    0: 'tau',
    1: 'julia',
    2: 'magnet',
    3: 'buffalo',
    4: 'tricorn',
    5: 'mandelbrot'
  };

  function defaultClassSpecs(classModes) {
    return {
      mandelbrot: {
        mode: classModes.mandelbrot,
        label: 'MANDELBROT',
        focusX: -0.450,
        focusY: 0.003,
        zoomBase: 1.02,
        zoomVariance: 0.52,
        zoomMin: 1.5,
        zoomMax: 2.5,
        spreadMul: 0.94,
        waveZoomMul: 0.8,
        childZoomMin: 0.62,
        childZoomMax: 0.92,
        childTangent: 0.31
      },
      tau: {
        mode: classModes.tau,
        label: 'TAU BROT',
        focusX: -0.222,
        focusY: 0.003,
        zoomBase: 0.92,
        zoomVariance: 0.52,
        zoomMin: 0.38,
        zoomMax: 2.35,
        spreadMul: 0.94,
        waveZoomMul: 0.58,
        childZoomMin: 0.62,
        childZoomMax: 0.82,
        childTangent: 0.21
      },
      julia: {
        mode: classModes.julia,
        label: 'JULIA',
        focusX: -0.7445,
        focusY: 0.1318,
        zoomBase: 2.0,
        zoomVariance: 0.56,
        zoomMin: 1.5,
        zoomMax: 2.5,
        spreadMul: 1.0,
        waveZoomMul: 0.52,
        childZoomMin: 0.74,
        childZoomMax: 0.92,
        childTangent: 0.11
      },
      magnet: {
        mode: classModes.magnet,
        label: 'MAGNET',
        focusX: 0.5,
        focusY: 0.0,
        zoomBase: 1.0,
        zoomVariance: 0.38,
        zoomMin: 0.6,
        zoomMax: 1.7,
        spreadMul: 0.58,
        waveZoomMul: 0.56,
        childZoomMin: 0.64,
        childZoomMax: 0.86,
        childTangent: 0.18
      },
      buffalo: {
        mode: classModes.buffalo,
        label: 'BUFFALO',
        focusX: -1.713978835021709,
        focusY: -0.18926374819102731,
        zoomBase: 1/7,
        zoomVariance: 0.034,
        zoomMin: 0.26,
        zoomMax: 0.54,
        spreadMul: 0.42,
        waveZoomMul: 0.36,
        childZoomMin: 0.68,
        childZoomMax: 0.9,
        childTangent: 0.16
      },
      tricorn: {
        mode: classModes.tricorn,
        label: 'TRICORN',
        focusX: -0.485,
        focusY: 0.0,
        zoomBase: 1.04,
        zoomVariance: 0.56,
        zoomMin: 0.34,
        zoomMax: 2.2,
        spreadMul: 0.84,
        waveZoomMul: 0.6,
        childZoomMin: 0.6,
        childZoomMax: 0.84,
        childTangent: 0.2
      }
    };
  }

  function create(options = {}) {
    const classModes = options.classModes || DEFAULT_CLASS_MODES;
    const modeNames = options.modeNames || DEFAULT_MODE_NAMES;
    const classes = Array.isArray(options.classes) && options.classes.length
      ? options.classes.slice()
      : ['tau', 'magnet', 'buffalo', 'tricorn', 'julia', 'mandelbrot'];
    const classSequence = Array.isArray(options.classSequence) && options.classSequence.length
      ? options.classSequence.slice()
      : ['mandelbrot', 'magnet', 'julia', 'buffalo', 'tricorn', 'julia', 'tau'];
      // : ['julia', 'buffalo', 'mandelbrot', 'magnet', 'julia', 'buffalo', 'tricorn', 'julia', 'tau'];
    const classSpecs = options.classSpecs || defaultClassSpecs(classModes);
    const selectedClass = typeof options.selectedClass === 'string' ? options.selectedClass : 'cycle';
    const mixAfterCycle = options.mixAfterCycle !== false;

    function getClassSequence() {
      const seq = classSequence.filter((name) => classes.includes(name));
      return seq.length ? seq : ['tau'];
    }

    function getClassByMode(mode) {
      return modeNames[mode] || 'tau';
    }

    function getClassSpec(className) {
      const key = classSpecs[className] ? className : 'tau';
      return classSpecs[key] || classSpecs.tau;
    }

    function isJuliaMode(mode) {
      return mode === classModes.julia;
    }

    function hasCompletedCycle(wave) {
      if (!mixAfterCycle || selectedClass !== 'cycle') return false;
      const seq = getClassSequence();
      if (!seq.length) return false;
      const required = new Set(classes);
      const seen = new Set();
      const wavesElapsed = Math.max(0, Math.floor(wave) - 1);
      for (let i = 0; i < wavesElapsed; i++) {
        seen.add(seq[i % seq.length]);
      }
      for (const className of required) {
        if (!seen.has(className)) return false;
      }
      return true;
    }

    function isMixedWave(wave) {
      return hasCompletedCycle(wave);
    }

    function resolveClassForWave(wave) {
      if (classes.includes(selectedClass)) return selectedClass;
      if (isMixedWave(wave)) return 'mixed';
      const seq = getClassSequence();
      return seq[(Math.max(1, wave) - 1) % seq.length];
    }

    function pickClassForWaveSpawn(wave) {
      if (!isMixedWave(wave)) return resolveClassForWave(wave);
      const seq = getClassSequence();
      const anchorClass = seq[(Math.max(1, wave) - 1) % seq.length];
      if (Math.random() < 0.45) return anchorClass;
      return classes[Math.floor(Math.random() * classes.length)] || 'tau';
    }

    function classLabel(className) {
      if (className === 'mixed') return 'MIXED';
      const spec = getClassSpec(className);
      return spec.label || 'FRACTAL';
    }

    return {
      classModes,
      modeNames,
      classes,
      classSequence,
      classSpecs,
      selectedClass,
      mixAfterCycle,
      autoDiveWaveInterval: Math.max(1, getClassSequence().length),
      getClassSequence,
      getClassByMode,
      getClassSpec,
      isJuliaMode,
      hasCompletedCycle,
      isMixedWave,
      resolveClassForWave,
      pickClassForWaveSpawn,
      classLabel
    };
  }

  window.FrackingFractaloidClasses = { create };
})();
