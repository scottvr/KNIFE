(() => {
  'use strict';

  function create(options = {}) {
    const keys = options.keys || {};
    const consumeHyperPressed = typeof options.consumeHyperPressed === 'function'
      ? options.consumeHyperPressed
      : () => false;

    const fireGraceSec = Math.max(0, Number.isFinite(options.fireGraceSec) ? options.fireGraceSec : 0.09);
    const thrustGraceSec = Math.max(0, Number.isFinite(options.thrustGraceSec) ? options.thrustGraceSec : 0.08);
    const hyperBufferSec = Math.max(0, Number.isFinite(options.hyperBufferSec) ? options.hyperBufferSec : 0.22);

    let fireGrace = 0;
    let thrustGrace = 0;
    let hyperBuffer = 0;

    function decay(value, dt) {
      return Math.max(0, value - dt);
    }

    function tick(dt, state = {}) {
      const step = Math.max(0, Number.isFinite(dt) ? dt : 0);
      const active = state.active !== false;

      if (consumeHyperPressed()) hyperBuffer = hyperBufferSec;

      if (active) {
        fireGrace = keys.fire ? fireGraceSec : decay(fireGrace, step);
        thrustGrace = keys.thrust ? thrustGraceSec : decay(thrustGrace, step);
      } else {
        fireGrace = decay(fireGrace, step);
        thrustGrace = decay(thrustGrace, step);
      }

      hyperBuffer = decay(hyperBuffer, step);
    }

    function getIntents() {
      return {
        fire: !!keys.fire || fireGrace > 0,
        thrust: !!keys.thrust || thrustGrace > 0
      };
    }

    function consumeHyperBuffered() {
      if (hyperBuffer <= 0) return false;
      hyperBuffer = 0;
      return true;
    }

    function reset() {
      fireGrace = 0;
      thrustGrace = 0;
      hyperBuffer = 0;
    }

    return {
      tick,
      getIntents,
      consumeHyperBuffered,
      reset
    };
  }

  window.FrackingInputFeel = { create };
})();
