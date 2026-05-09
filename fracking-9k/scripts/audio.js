(() => {
  'use strict';

  function createNoopSfx() {
    const noop = () => {};
    return {
      fire: noop,
      thrust: noop,
      bangLarge: noop,
      bangMedium: noop,
      bangSmall: noop,
      death: noop,
      hyper: noop,
      saucerLarge: null,
      saucerSmall: null,
      saucerFire: noop,
      extraLife: noop
    };
  }

  function create() {
    let audioCtx = null;

    function ensureAudio() {
      if (!audioCtx) {
        try {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
          audioCtx = null;
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    }

    function beep(freq, dur, type = 'square', vol = 0.08) {
      if (!audioCtx) return;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, audioCtx.currentTime);
      g.gain.setValueAtTime(vol, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      o.connect(g).connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + dur);
    }

    function noise(dur, vol = 0.15) {
      if (!audioCtx) return;
      const bufSize = Math.floor(audioCtx.sampleRate * dur);
      const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      const g = audioCtx.createGain();
      g.gain.value = vol;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      src.connect(filter).connect(g).connect(audioCtx.destination);
      src.start();
    }

    function sweepDown(f1, f2, dur, vol = 0.1) {
      if (!audioCtx) return;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(f1, audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(f2, audioCtx.currentTime + dur);
      g.gain.setValueAtTime(vol, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      o.connect(g).connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + dur);
    }

    function heartbeatPulse(freq, options = {}) {
      if (!audioCtx) return;
      const level = options.level ?? 0.052;
      const dur = options.pulseSec ?? 0.102;
      const attackSec = options.attackSec ?? 0.0018;
      const decaySec = options.decaySec ?? 0.074;
      const now = audioCtx.currentTime;

      const carrier = audioCtx.createOscillator();
      const sub = audioCtx.createOscillator();
      const mod = audioCtx.createOscillator();

      const modGain = audioCtx.createGain();
      const subGain = audioCtx.createGain();
      const amp = audioCtx.createGain();

      const hp = audioCtx.createBiquadFilter();
      const lp = audioCtx.createBiquadFilter();
      const peak = audioCtx.createBiquadFilter();

      carrier.type = 'sawtooth';
      sub.type = 'square';
      mod.type = 'sine';

      carrier.frequency.setValueAtTime(freq * 1.018, now);
      carrier.frequency.exponentialRampToValueAtTime(freq * 0.992, now + dur);
      sub.frequency.setValueAtTime(freq * 0.5, now);

      mod.frequency.setValueAtTime(6.2, now);
      modGain.gain.setValueAtTime(freq * 0.024, now);
      modGain.gain.exponentialRampToValueAtTime(0.35, now + dur);

      subGain.gain.setValueAtTime(0.16, now);
      subGain.gain.exponentialRampToValueAtTime(0.06, now + dur);

      hp.type = 'highpass';
      hp.frequency.setValueAtTime(34, now);

      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(2300, now);
      lp.frequency.exponentialRampToValueAtTime(520, now + dur);

      peak.type = 'peaking';
      peak.frequency.setValueAtTime(270, now);
      peak.Q.setValueAtTime(1.35, now);
      peak.gain.setValueAtTime(5.6, now);

      amp.gain.setValueAtTime(0.0001, now);
      amp.gain.exponentialRampToValueAtTime(level, now + attackSec);
      amp.gain.exponentialRampToValueAtTime(level * 0.1, now + decaySec);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      mod.connect(modGain).connect(carrier.frequency);
      carrier.connect(hp);
      sub.connect(subGain).connect(hp);
      hp.connect(lp).connect(peak).connect(amp).connect(audioCtx.destination);

      carrier.start(now);
      sub.start(now);
      mod.start(now);

      const stopAt = now + dur + 0.02;
      carrier.stop(stopAt);
      sub.stop(stopAt);
      mod.stop(stopAt);
    }

    const sfx = {
      fire: () => beep(880, 0.08, 'square', 0.05),
      thrust: () => { if (!audioCtx) return; noise(0.05, 0.04); },
      bangLarge: () => { sweepDown(160, 40, 0.4, 0.15); noise(0.3, 0.12); },
      bangMedium: () => { sweepDown(220, 60, 0.3, 0.12); noise(0.2, 0.1); },
      bangSmall: () => { sweepDown(320, 100, 0.2, 0.1); noise(0.15, 0.08); },
      death: () => { sweepDown(400, 50, 0.7, 0.18); noise(0.5, 0.15); },
      hyper: () => {
        for (let i = 0; i < 6; i++) {
          setTimeout(() => beep(200 + Math.random() * 800, 0.05, 'sawtooth', 0.06), i * 30);
        }
      },
      saucerLarge: null,
      saucerSmall: null,
      saucerFire: () => beep(660, 0.08, 'sawtooth', 0.06),
      extraLife: () => {
        [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.1, 'square', 0.07), i * 70));
      }
    };

    return {
      ensureAudio,
      heartbeatPulse,
      sfx
    };
  }

  window.FrackingAudio = {
    create,
    createNoopSfx
  };
})();
