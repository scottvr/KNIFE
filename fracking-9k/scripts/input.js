(() => {
  'use strict';

  function create(options = {}) {
    const ensureAudio = typeof options.ensureAudio === 'function' ? options.ensureAudio : () => {};
    const onStartRequested = typeof options.onStartRequested === 'function' ? options.onStartRequested : () => {};

    const keys = {
      left: false,
      right: false,
      thrust: false,
      fire: false,
      hyper: false
    };

    let hyperPressed = false;
    const unbind = [];

    function addListener(target, type, handler, opts) {
      if (!target) return;
      target.addEventListener(type, handler, opts);
      unbind.push(() => target.removeEventListener(type, handler, opts));
    }

    function onKeyDown(e) {
      ensureAudio();
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keys.left = true;
        e.preventDefault();
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keys.right = true;
        e.preventDefault();
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        keys.thrust = true;
        e.preventDefault();
      } else if (e.code === 'Space') {
        keys.fire = true;
        onStartRequested();
        e.preventDefault();
      } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        if (!keys.hyper) hyperPressed = true;
        keys.hyper = true;
        e.preventDefault();
      } else if (e.code === 'Enter') {
        onStartRequested();
      }
    }

    function onKeyUp(e) {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
      else if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
      else if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.thrust = false;
      else if (e.code === 'Space') keys.fire = false;
      else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.hyper = false;
    }

    function bindTouch(id, key, edgeHyper = false) {
      const el = document.getElementById(id);
      if (!el) return;

      const press = (e) => {
        e.preventDefault();
        ensureAudio();
        if (edgeHyper && !keys.hyper) hyperPressed = true;
        keys[key] = true;
        el.classList.add('active');
      };

      const release = (e) => {
        e.preventDefault();
        keys[key] = false;
        el.classList.remove('active');
      };

      addListener(el, 'touchstart', press, { passive: false });
      addListener(el, 'touchend', release, { passive: false });
      addListener(el, 'touchcancel', release, { passive: false });
      addListener(el, 'mousedown', press);
      addListener(el, 'mouseup', release);
      addListener(el, 'mouseleave', release);
    }

    addListener(window, 'keydown', onKeyDown);
    addListener(window, 'keyup', onKeyUp);

    bindTouch('btn-left', 'left');
    bindTouch('btn-right', 'right');
    bindTouch('btn-thrust', 'thrust');
    bindTouch('btn-fire', 'fire');
    bindTouch('btn-hyper', 'hyper', true);

    return {
      keys,
      consumeHyperPressed() {
        const wasPressed = hyperPressed;
        hyperPressed = false;
        return wasPressed;
      },
      destroy() {
        for (const fn of unbind) fn();
      }
    };
  }

  window.FrackingInput = { create };
})();
