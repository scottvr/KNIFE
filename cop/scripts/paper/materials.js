(function (global) {
  function seededRandom(seed) {
    let t = seed >>> 0;
    return function () {
      t += 0x6d2b79f5;
      let v = Math.imul(t ^ (t >>> 15), 1 | t);
      v ^= v + Math.imul(v ^ (v >>> 7), 61 | v);
      return ((v ^ (v >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hash2(a, b) {
    let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b);
    h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
    h ^= Math.imul(b ^ 0x27d4eb2d, 0x165667b1);
    return h >>> 0;
  }

  function createRuntime(options) {
    const canvas = options.canvas;
    const paperCanvas = options.paperCanvas;
    const getPlayBounds = options.getPlayBounds;
    const getFrame = options.getFrame;
    const getGameState = options.getGameState;
    const getEffects = options.getEffects;
    const getLevel = options.getLevel;

    let paperPass = null;
    let playfieldPaperCanvas = null;
    // Materials pipeline slots; paper is active now, SDF shadow is staged as next pass.
    const pipelineState = {
      paperOverlayReady: false,
      sdfShadowReady: false,
    };

    function getTheme() {
      const api = global.COPRO_PAPER_PALETTE;
      if (!api) {
        return {
          baseHex: "#5f4230",
          baseUnit: [0.37, 0.26, 0.19],
          lineDarkRgba: "rgba(44,21,26,0.45)",
          lineLightRgba: "rgba(208,161,140,0.12)",
          fiberLightRgba: "rgba(244,224,196,0.045)",
          fiberDarkRgba: "rgba(36,25,18,0.05)",
          grainLightRgba: "rgba(235,223,201,0.06)",
          grainDarkRgba: "rgba(36,25,18,0.05)",
        };
      }
      return api.derivePaperTheme(api.readCssPaperBase(), getLevel());
    }

    function disableOverlay() {
      if (!paperCanvas) return;
      paperCanvas.classList.add("is-disabled");
      paperPass = null;
    }

    function syncPaperCanvasSize() {
      if (!paperCanvas) return;
      if (paperCanvas.width !== canvas.width) paperCanvas.width = canvas.width;
      if (paperCanvas.height !== canvas.height) paperCanvas.height = canvas.height;
    }

    function ensurePlayfieldTexture() {
      const bounds = getPlayBounds();
      if (
        playfieldPaperCanvas &&
        playfieldPaperCanvas.width === canvas.width &&
        playfieldPaperCanvas.height === bounds.height
      ) return;

      const theme = getTheme();
      playfieldPaperCanvas = global.document.createElement("canvas");
      playfieldPaperCanvas.width = canvas.width;
      playfieldPaperCanvas.height = bounds.height;
      const pctx = playfieldPaperCanvas.getContext("2d");
      const rand = seededRandom(0x53a1f00d);

      pctx.fillStyle = theme.baseHex;
      pctx.fillRect(0, 0, playfieldPaperCanvas.width, playfieldPaperCanvas.height);

      for (let i = 0; i < 2200; i++) {
        const x = rand() * playfieldPaperCanvas.width;
        const y = rand() * playfieldPaperCanvas.height;
        const r = 0.7 + rand() * 2.6;
        pctx.fillStyle = rand() > 0.72 ? theme.grainLightRgba : theme.grainDarkRgba;
        pctx.beginPath();
        pctx.arc(x, y, r, 0, Math.PI * 2);
        pctx.fill();
      }

      for (let i = 0; i < 1400; i++) {
        const x = rand() * playfieldPaperCanvas.width;
        const y = rand() * playfieldPaperCanvas.height;
        const len = 2 + rand() * 6;
        const ang = (rand() - 0.5) * 0.9;
        pctx.strokeStyle = rand() > 0.5 ? theme.fiberLightRgba : theme.fiberDarkRgba;
        pctx.lineWidth = 0.6 + rand() * 0.7;
        pctx.beginPath();
        pctx.moveTo(x, y);
        pctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
        pctx.stroke();
      }
    }

    function drawPlayfieldPaper(ctx) {
      const bounds = getPlayBounds();
      ensurePlayfieldTexture();
      ctx.drawImage(playfieldPaperCanvas, 0, bounds.top);
    }

    function compileShader(gl, type, source) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("Paper shader compile failed:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function buildProgram(gl, vertexSource, fragmentSource) {
      const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
      if (!vertexShader || !fragmentShader) {
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
        return null;
      }
      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn("Paper shader link failed:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      return program;
    }

    function initOverlay() {
      if (!paperCanvas) return;
      const sources = global.COPRO_PAPER_SHADER;
      if (!sources || !sources.vertex || !sources.fragment) {
        disableOverlay();
        return;
      }
      const gl = paperCanvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
      });
      if (!gl) {
        disableOverlay();
        return;
      }
      const program = buildProgram(gl, sources.vertex, sources.fragment);
      if (!program) {
        disableOverlay();
        return;
      }
      const vao = gl.createVertexArray();
      const buffer = gl.createBuffer();
      if (!vao || !buffer) {
        disableOverlay();
        return;
      }

      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

      const positionLoc = gl.getAttribLocation(program, "a_position");
      if (positionLoc === -1) {
        disableOverlay();
        return;
      }
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
      gl.bindVertexArray(null);

      paperPass = {
        gl: gl,
        program: program,
        vao: vao,
        uniforms: {
          resolution: gl.getUniformLocation(program, "u_resolution"),
          playBand: gl.getUniformLocation(program, "u_play_band"),
          tick: gl.getUniformLocation(program, "u_tick"),
          time: gl.getUniformLocation(program, "u_time"),
          intensity: gl.getUniformLocation(program, "u_intensity"),
          paperBase: gl.getUniformLocation(program, "u_paper_base"),
        },
      };
      pipelineState.paperOverlayReady = true;

      paperCanvas.classList.remove("is-disabled");
      syncPaperCanvasSize();
    }

    function renderOverlay() {
      if (!paperPass || !paperCanvas) return;
      syncPaperCanvasSize();

      const gl = paperPass.gl;
      const bounds = getPlayBounds();
      const theme = getTheme();
      let intensity = 1.0;
      if (getGameState() === "idle") intensity = 0.56;
      if (Date.now() < getEffects().burstUntil) intensity = 0.64;

      const playMin = 1 - bounds.bottom / canvas.height;
      const playMax = 1 - bounds.top / canvas.height;

      gl.viewport(0, 0, paperCanvas.width, paperCanvas.height);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(paperPass.program);
      gl.bindVertexArray(paperPass.vao);
      gl.uniform2f(paperPass.uniforms.resolution, paperCanvas.width, paperCanvas.height);
      gl.uniform2f(paperPass.uniforms.playBand, playMin, playMax);
      gl.uniform1f(paperPass.uniforms.tick, getFrame());
      gl.uniform1f(paperPass.uniforms.time, 0);
      gl.uniform1f(paperPass.uniforms.intensity, intensity);
      gl.uniform3f(paperPass.uniforms.paperBase, theme.baseUnit[0], theme.baseUnit[1], theme.baseUnit[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);
    }

    return {
      init: function () {
        initOverlay();
        ensurePlayfieldTexture();
      },
      onResize: function () {
        ensurePlayfieldTexture();
        syncPaperCanvasSize();
      },
      drawPlayfieldPaper: drawPlayfieldPaper,
      renderOverlay: renderOverlay,
      renderSdfShadow: function () {
        // Reserved for future SDF layer-shadow pass.
      },
      pipelineState: pipelineState,
      getTheme: getTheme,
      hash2: hash2,
      seededRandom: seededRandom,
    };
  }

  global.COPRO_PAPER_MATERIALS = {
    createRuntime: createRuntime,
    hash2: hash2,
    seededRandom: seededRandom,
  };
})(window);
