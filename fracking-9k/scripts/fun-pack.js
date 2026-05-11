(() => {
  'use strict';

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function create(options = {}) {
    const killChainWindowSec = typeof options.killChainWindowSec === 'number' ? options.killChainWindowSec : 2.2;
    const killChainMaxMult = typeof options.killChainMaxMult === 'number' ? options.killChainMaxMult : 7;
    const adaptiveReliefDurationSec = typeof options.adaptiveReliefDurationSec === 'number' ? options.adaptiveReliefDurationSec : 12;

    let killChainTimer = 0;
    let killChainCount = 0;
    let killChainMult = 1;
    let adaptiveReliefTimer = 0;

    function resetChain() {
      killChainTimer = 0;
      killChainCount = 0;
      killChainMult = 1;
    }

    function resetRun() {
      resetChain();
      adaptiveReliefTimer = 0;
    }

    function tick(dt) {
      if (killChainTimer > 0) {
        killChainTimer = Math.max(0, killChainTimer - dt);
        if (killChainTimer <= 0) {
          killChainCount = 0;
          killChainMult = 1;
        }
      }
      if (adaptiveReliefTimer > 0) {
        adaptiveReliefTimer = Math.max(0, adaptiveReliefTimer - dt);
      }
    }

    function award(baseScore) {
      const base = Math.max(1, Math.floor(baseScore || 0));
      if (killChainTimer > 0) {
        killChainCount += 1;
      } else {
        killChainCount = 1;
      }
      killChainTimer = killChainWindowSec;
      killChainMult = Math.min(killChainMaxMult, 1 + Math.floor((killChainCount - 1) / 2));
      return Math.max(1, Math.floor(base * killChainMult));
    }

    function triggerReliefForLives(lives) {
      if (lives <= 2) {
        adaptiveReliefTimer = adaptiveReliefDurationSec;
      }
    }

    function computeWavePace(wave, lives) {
      const waveScale = 1 + Math.log2(Math.max(2, wave + 1)) * 0.16;
      const chainHeat = killChainCount > 1 ? Math.min(0.24, (killChainCount - 1) * 0.03) : 0;
      const lowLifeRelief = lives <= 1 ? 0.72 : lives === 2 ? 0.82 : lives === 3 ? 0.9 : 1.0;
      let relief = 1.0;
      if (adaptiveReliefTimer > 0) {
        const fade = 1 - clamp(adaptiveReliefTimer / adaptiveReliefDurationSec, 0, 1);
        relief = lowLifeRelief + (1 - lowLifeRelief) * fade;
      }
      return {
        spawnMul: Math.max(0.72, waveScale * (0.92 + chainHeat) * relief),
        speedMul: Math.max(0.70, (0.96 + Math.log2(Math.max(2, wave + 1)) * 0.11) * (0.9 + chainHeat * 0.8) * relief),
        saucerCadenceMul: Math.max(0.68, (1 + Math.log2(Math.max(2, wave + 1)) * 0.07 + chainHeat * 0.35) * relief)
      };
    }

    function getChainLabel() {
      return killChainTimer > 0 && killChainMult > 1 ? ' • CHAIN x' + killChainMult : '';
    }

    return {
      resetChain,
      resetRun,
      tick,
      award,
      triggerReliefForLives,
      computeWavePace,
      getChainLabel
    };
  }

  window.FrackingFunPack = { create };
})();
