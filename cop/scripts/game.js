(function () {
  const IS_COMPACT = window.matchMedia("(max-width: 820px)").matches;
  const IS_TOUCH = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const SHOW_DPAD_BY_DEFAULT = IS_COMPACT || IS_TOUCH;
  const MOBILE_COLS = 12;
  const DESKTOP_COLS = 16;
  const COLS = IS_COMPACT ? MOBILE_COLS : DESKTOP_COLS;
  const ROWS = COLS;
  const CELL = IS_COMPACT ? 34 : 32;
  // UI safe bands: top/bottom rows reserved for HUD + status overlays.
  const SAFE_TOP_ROWS = IS_COMPACT ? 2 : 2;
  const SAFE_BOTTOM_ROWS = IS_COMPACT ? 2 : 2;
  const PLAY_COLS = COLS;
  const PLAY_ROWS = ROWS - SAFE_TOP_ROWS - SAFE_BOTTOM_ROWS;
  const PLAY_TOP = SAFE_TOP_ROWS * CELL;
  const PLAY_HEIGHT = PLAY_ROWS * CELL;
  const PLAY_BOTTOM = PLAY_TOP + PLAY_HEIGHT;
  const START_SPEED = 250;
  const SPEED_FACTOR = 12;
  const MIN_SPEED = 70;
  const BOARD_PATH = buildBoardPath();

  const canvas = document.getElementById("copro-canvas");
  const paperCanvas = document.getElementById("copro-paper");
  const ctx = canvas.getContext("2d");
  const stage = document.getElementById("copro-stage");
  const dpad = document.querySelector(".dpad");
  const msg = document.getElementById("copro-msg");
  const startPanel = document.getElementById("copro-start");
  const startOptions = Array.from(document.querySelectorAll('input[name="character-mode"]'));
  const toastHost = document.getElementById("copro-toasts");
  const perkHud = document.getElementById("copro-perks");
  const helpPanel = document.getElementById("copro-help");
  const btnStart = document.getElementById("btn-start");
  const btnSelect = document.getElementById("btn-select");
  const btnLaunch = document.getElementById("btn-launch");
  const btnPause = document.getElementById("btn-pause");
  const btnMode = document.getElementById("btn-mode");
  const btnHelp = document.getElementById("btn-help");
  const btnHelpClose = document.getElementById("btn-help-close");
  const btnRestart = document.getElementById("btn-restart");
  canvas.width = COLS * CELL;
  canvas.height = ROWS * CELL;

  const PALETTE = {
    bg: "#4a2730",
    grid: "#6f4651",
    body: ["#8b6914", "#9a7520", "#a8842b", "#7a5c10", "#8d6b18"],
    head: "#c4a040",
    eye: "#f0e8c0",
    pupil: "#1e1108",
    food: ["#8b3a0f", "#6b4c12", "#5a3d08", "#7a2d07"],
    foodShine: "#f0d890",
    soilDark: "#2a1318",
    segOutline: "#5a3d08",
    text: "#f2d8a4",
    textDim: "#c9a06a",
    death: "#f05f43",
  };

  let snake;
  let dir;
  let nextDir;
  let foods;
  let score;
  let best = 0;
  let level;
  let roundTargetLength;
  let speed;
  let gameState;
  let intervalId;
  let frame;
  let particles;
  let controlMode = "direct";
  let audioCtx = null;
  let audioMaster = null;
  let noiseBuffer = null;
  let musicBus = null;
  let musicTimer = null;
  let musicStep = 0;
  let musicSyncAccumulator = 0;
  let dpadVisible = SHOW_DPAD_BY_DEFAULT;
  let roundStartTimeoutId = null;
  let roundIntroTickId = null;
  let roundIntroUntil = 0;
  let roundIntroLabel = "";
  let roundIntroIsLevelUp = false;
  let roundIntroLastSecond = null;
  let foodSpawnCounter = 0;
  let perfectRoundStreak = 0;
  let roundStats = null;
  let burstTimeoutId = null;
  let helpReturnState = "idle";
  let perkTutorialTimeoutId = null;
  let tutorialPerkKey = null;
  let pendingPerkTutorials = [];
  let seenPerks = {};
  let paperRuntime = null;
  let paperArt = null;
  let nextSegmentId = 1;
  const perks = {
    gutShield: 0,
    molting: 0,
    acidSpray: 0,
    scentTrail: 0,
    digestiveEfficiency: 0
  };
  const effects = {
    burstUntil: 0,
    burstReleaseUntil: 0,
    scentTrailUntil: 0,
    moltFreezeTicks: 0
  };

  const DIRS = {
    U: { x: 0, y: -1 },
    D: { x: 0, y: 1 },
    L: { x: -1, y: 0 },
    R: { x: 1, y: 0 },
  };

  const BITE_TOASTS = [
    "Snack secured.",
    "Fresh find.",
    "Prime pile.",
    "Gobble complete.",
    "Larva approved.",
    "Compost candy."
  ];

  const BITE_MESSAGES = [
    "Yum Yum!",
    "Delicioso!",
    "Prime Dung!",
    "Chef's Kiss!",
    "So Fresh!",
    "Glorious Morsel!",
    "Compost Deluxe!"
  ];

  const LEVEL_MESSAGES = [
    "Metabolism Up!",
    "Scavenger Supreme!",
    "Larva Ascendant!",
    "Speed Unlocked!"
  ];

  const ROUND_BASE_SEGMENTS = 2;
  const ROUND_GROWTH_BASE = 5;
  const ROUND_GROWTH_PER_LEVEL = 1;
  const ROUND_CLEAR_BONUS_PER_LEVEL = 25;
  const ROUND_MASS_BONUS_PER_SEG = 5;
  const ROUND_MIN_EMPTY_CELLS = 8;
  const PERK_MAX_STACK = 3;
  const MOLTING_MIN_LENGTH = 7;
  const SCENT_TRAIL_MS = 6000;
  const BURST_MS = 4000;
  const BURST_SPEED_MUL = 0.82;
  const BURST_RELEASE_MS = 900;
  const MOLT_ESCAPE_FREEZE_TICKS = 3; // Includes the collision-rescue tick itself for ~3 total hold ticks.
  const STEP_SFX_VOLUME = 0.01;
  const BEST_SCORE_STORAGE_KEY = "coprophage_best_score_v1";
  const SEEN_PERKS_STORAGE_KEY = "coprophage_seen_perks_v1";
  const CHARACTER_MODE_STORAGE_KEY = "coprophage_character_mode_v1";
  const PERK_TUTORIAL_MS = 4400;
  const ROUND_START_DELAY_MS = 3000;
  const MULTI_FOOD_START_LEVEL = 3;
  const MAX_FOOD_COUNT = 4;
  const TEMP_FOOD_TTL_BASE = 24;
  const TEMP_FOOD_TTL_DROP_PER_LEVEL = 1;
  const TIMED_ROUTE_SLACK_STEPS = 2;
  const PERK_META = [
    { key: "gutShield", icon: "🛡", label: "Shield", desc: "Blocks one fatal crash.", tip: "Auto-triggers to prevent death." },
    { key: "molting", icon: "🪱", label: "Molt", desc: "Sheds a segment to escape danger.", tip: "Creates reaction time and keeps you alive." },
    { key: "acidSpray", icon: "🧪", label: "Acid", desc: "Lets you phase through your body once.", tip: "Best on tight self-crossings." },
    { key: "scentTrail", icon: "👃", label: "Scent", desc: "Highlights timed dung priority.", tip: "Helps route oldest timed targets first." },
    { key: "digestiveEfficiency", icon: "⚡", label: "Digest", desc: "Reduces next round goal requirement.", tip: "Spend it for easier level clears." }
  ];

  // Music shape shorthand:
  // A2 B2 A2 C1 B1 O1 => A A B B A A C B O
  // Composition model:
  // - roots: harmonic timeline (key/chord center over time)
  // - scale: allowed intervals from each root (mode / color)
  // - leadPattern: melody+rhythm script as scale indices; null = rest
  // Final lead pitch per step is effectively:
  //   leadMidi = root + octaveOffset + scale[leadPatternIndex]
  // where root is further shifted by section/key/round bindings.
  // Current scale [0,3,5,7,10] is minor pentatonic.
  // leadSwing: per-step melodic bias added to leadPattern degree before scale lookup.
  // Example: leadPattern degree 2 + leadSwing value 3 => scale index 5 (mod scale length).
  // sections keys:
  // - A: verse / baseline groove
  // - B: lift / busier accent pattern
  // - C: contrast / bridge
  // - O: outro / sparse cooldown
  // section params:
  // - rootShift: semitone offset applied to current root.
  // - tempoMul: per-section tempo multiplier (used in free-running mode, or optionally when synced).
  // - leadGate: probability [0..1] that a lead note plays on a step.
  // - bassEvery: play bass every N steps.
  // - accentEvery: accent every N steps.
  // - swingShift: phase offset into leadSwing array.
  const MUSIC_THEME = {
    baseStepMs: 200,
    sectionLengthSteps: 16,
    shape: "A1",
    keyCycle: [0],
    scale: [0, 3, 5, 7, 10],
    roots: [36, 36, 34, 34, 32, 32, 32, 32], // harmonic center movement
    leadPattern: [0, null, 0, null, 8, null, -2, 1], // scale degrees over time (null = silence)
    leadSwing: [0, 2, 4, 2, 1, 2, 3, 2],
    sections: {
      A: { rootShift: 0, tempoMul: 1, leadGate: 1, bassEvery: 4, accentEvery: 8, swingShift: 0 },
      //B: { rootShift: 2, tempoMul: 1, leadGate: 1, bassEvery: 4, accentEvery: 4, swingShift: 1 },
      //C: { rootShift: -2, tempoMul: 1.0, leadGate: 0.5, bassEvery: 2, accentEvery: 4, swingShift: 2 },
//      O: { rootShift: -5, tempoMul: 0.5, leadGate: 1, bassEvery: 8, accentEvery: 8, swingShift: 0 }
    }
  };
  // Music <-> game coupling policy.
  // This lets us declaratively bind music behavior to gameplay state.
  // Examples:
  // - syncToGameTicks + ticksPerMusicStep: lock beat grid to board movement.
  // - transposeHalfStepsPerRound: move whole score upward each round.
  // - transposeMaxLeadMidi: safety ceiling so transposition stays musical.
  const MUSIC_BINDINGS = {
    syncToGameTicks: true,
    ticksPerMusicStep: 1,
    keepSectionTempoWhenSynced: false,
    // "baseSpeed": follow level tick pace only (ignores short burst effects).
    // "actualTick": follow real current tick interval (includes burst effects).
    syncTempoSource: "actualTick",
    transposeHalfStepsPerRound: 1,
    transposeMaxLeadMidi: 84
  };
  const MUSIC_ARRANGEMENT = expandMusicShape(MUSIC_THEME.shape);
  const CHARACTER_MODES = {
    worm: {
      id: "worm",
      paper: true,
      idleTitle: "COPROPHAGE",
      idleSubtitle: "paper-cut larva mode"
    },
    snake: {
      id: "snake",
      paper: false,
      idleTitle: "SNAKE",
      idleSubtitle: "scaled field mode"
    }
  };
  let characterMode = "worm";

  function setMessage(text) {
    msg.textContent = text;
  }

  function getCharacterModeConfig() {
    return CHARACTER_MODES[characterMode] || CHARACTER_MODES.worm;
  }

  function isPaperCharacterMode() {
    return !!getCharacterModeConfig().paper;
  }

  function loadCharacterMode() {
    try {
      const raw = window.localStorage.getItem(CHARACTER_MODE_STORAGE_KEY);
      if (!raw) return "worm";
      if (!CHARACTER_MODES[raw]) return "worm";
      return raw;
    } catch (err) {
      return "worm";
    }
  }

  function saveCharacterMode() {
    try {
      window.localStorage.setItem(CHARACTER_MODE_STORAGE_KEY, characterMode);
    } catch (err) {
      // Ignore storage failures.
    }
  }

  function syncCharacterOptionUI() {
    startOptions.forEach(function (input) {
      const selected = input.value === characterMode;
      input.checked = selected;
      const label = input.closest(".start-option");
      if (label) label.classList.toggle("is-selected", selected);
    });
  }

  function applyCharacterMode(mode) {
    if (!CHARACTER_MODES[mode]) return;
    characterMode = mode;
    saveCharacterMode();
    syncCharacterOptionUI();
    if (paperCanvas) {
      paperCanvas.classList.toggle("is-disabled", !isPaperCharacterMode());
    }
    stage.setAttribute("data-character-mode", characterMode);
  }

  function setStartPanelOpen(open) {
    if (!startPanel) return;
    startPanel.classList.toggle("is-open", open);
    stage.classList.toggle("is-start-screen", open);
    syncControls();
  }

  function showCharacterSelect() {
    if (gameState !== "idle" && gameState !== "dead") {
      pushToast("Pause or finish the run before changing character.", "bad");
      return;
    }
    setStartPanelOpen(true);
    setMessage("Choose your critter.");
    syncControls();
    drawIdle();
  }

  function characterBoardTheme() {
    if (characterMode === "snake") {
      return {
        glowInner: "#607551",
        glowMid: "#36472f",
        glowOuter: "#171f16",
        band: "rgba(10, 20, 12, 0.53)",
        line: "rgba(225, 240, 211, 0.09)",
        border: "#22311f",
      };
    }
    return {
      glowInner: "#7d525d",
      glowMid: PALETTE.bg,
      glowOuter: "#2a1318",
      band: "rgba(38, 16, 22, 0.5)",
      line: "rgba(255, 214, 192, 0.09)",
      border: PALETTE.soilDark,
    };
  }

  function perkMetaByKey(key) {
    return PERK_META.find(function (m) { return m.key === key; }) || null;
  }

  function renderHelpPerks() {
    const host = document.getElementById("copro-help-perks");
    if (!host) return;
    host.textContent = "";
    PERK_META.forEach(function (meta) {
      const card = document.createElement("div");
      card.className = "help-perk";
      card.innerHTML =
        "<div>" + meta.icon + " <strong>" + meta.label + "</strong></div>" +
        "<div>" + meta.desc + "</div>" +
        '<div class="kicker">' + meta.tip + "</div>";
      host.appendChild(card);
    });
  }

  function loadSeenPerks() {
    try {
      const raw = window.localStorage.getItem(SEEN_PERKS_STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return {};
      return parsed;
    } catch (err) {
      return {};
    }
  }

  function saveSeenPerks() {
    try {
      window.localStorage.setItem(SEEN_PERKS_STORAGE_KEY, JSON.stringify(seenPerks));
    } catch (err) {
      // Ignore storage failures.
    }
  }

  function clearPerkTutorialTimer() {
    if (!perkTutorialTimeoutId) return;
    clearTimeout(perkTutorialTimeoutId);
    perkTutorialTimeoutId = null;
  }

  function maybeShowQueuedPerkTutorial() {
    if (gameState !== "running") return;
    if (perkTutorialTimeoutId || tutorialPerkKey) return;
    const key = pendingPerkTutorials.shift();
    if (!key) return;
    const meta = perkMetaByKey(key);
    if (!meta) return;
    tutorialPerkKey = key;
    stopTickLoop();
    stopMusic();
    gameState = "perk_tutorial";
    setMessage(meta.label + " discovered.");
    playSfxUi("start");
    syncControls();
    draw();
    perkTutorialTimeoutId = setTimeout(function () {
      perkTutorialTimeoutId = null;
      tutorialPerkKey = null;
      if (gameState !== "perk_tutorial") return;
      gameState = "running";
      setMessage("Eat the dung.");
      startMusic();
      syncControls();
      startTickLoop();
      draw();
      maybeShowQueuedPerkTutorial();
    }, PERK_TUTORIAL_MS);
  }

  function dismissPerkTutorial() {
    if (gameState !== "perk_tutorial") return;
    clearPerkTutorialTimer();
    tutorialPerkKey = null;
    gameState = "running";
    setMessage("Eat the dung.");
    startMusic();
    syncControls();
    startTickLoop();
    draw();
    maybeShowQueuedPerkTutorial();
  }

  function openHelpOverlay() {
    if (!helpPanel || gameState === "help") return;
    if (gameState === "round_intro") {
      pushToast("Countdown active. Open help after round starts.", "bad");
      return;
    }
    helpReturnState = gameState;
    if (gameState === "running") {
      stopTickLoop();
      stopMusic();
    }
    if (gameState === "perk_tutorial") {
      helpReturnState = "running";
      clearPerkTutorialTimer();
      tutorialPerkKey = null;
    }
    gameState = "help";
    helpPanel.classList.remove("is-hidden");
    setMessage("Instructions");
    syncControls();
    draw();
  }

  function closeHelpOverlay() {
    if (!helpPanel || gameState !== "help") return;
    helpPanel.classList.add("is-hidden");
    gameState = helpReturnState || "idle";
    if (gameState === "running") {
      setMessage("Eat the dung.");
      startMusic();
      syncControls();
      startTickLoop();
      draw();
      maybeShowQueuedPerkTutorial();
      return;
    }
    if (gameState === "paused") {
      setMessage("Paused");
    } else if (gameState === "idle") {
      setMessage("Press Space to Begin");
    } else if (gameState === "dead") {
      setMessage("You died. Score " + score);
    }
    syncControls();
    draw();
  }

  function controlModeLabel(mode) {
    return mode === "steer" ? "Steer" : "Direct";
  }

  function renderPerkHUD() {
    if (!perkHud) return;
    perkHud.textContent = "";
    PERK_META.forEach(function (meta) {
      const count = perks[meta.key] || 0;
      const row = document.createElement("div");
      row.className = "copro-perk" + (count > 0 ? "" : " is-empty");
      row.innerHTML =
        '<span class="icon">' + meta.icon + '</span>' +
        '<span class="label">' + meta.label + "</span>" +
        '<span class="count">x' + count + "</span>";
      perkHud.appendChild(row);
    });
  }

  function setPerkHudMode(mode) {
    if (!perkHud) return;
    perkHud.classList.remove("mode-outside", "mode-outside-compact", "mode-band", "mode-overlay");
    perkHud.classList.add("mode-" + mode);
  }

  function applyPerkHudLayout() {
    if (!perkHud || !stage) return;

    // Tier 1: outside the play stage when viewport has side gutter room.
    setPerkHudMode("outside");
    perkHud.style.left = "";
    perkHud.style.top = "";
    perkHud.style.bottom = "";
    const stageRect = stage.getBoundingClientRect();
    const scale = stageRect.width / Math.max(1, canvas.width);
    const fullRect = perkHud.getBoundingClientRect();
    const fullW = Math.ceil(fullRect.width);
    const fullH = Math.ceil(fullRect.height);
    const leftRoom = Math.max(0, Math.floor(stageRect.left) - 8);
    const rightRoom = Math.max(0, Math.floor(window.innerWidth - stageRect.right) - 8);
    const canOutsideLeft = leftRoom >= fullW + 10;
    const canOutsideRight = rightRoom >= fullW + 10;
    if ((canOutsideLeft || canOutsideRight) && fullH + 16 <= window.innerHeight) {
      const preferRight = canOutsideRight && (!canOutsideLeft || rightRoom >= leftRoom);
      const y = Math.max(8, Math.min(window.innerHeight - fullH - 8, stageRect.top + 8));
      perkHud.style.left = preferRight
        ? Math.round(stageRect.right + 10) + "px"
        : Math.round(stageRect.left - fullW - 10) + "px";
      perkHud.style.top = Math.round(y) + "px";
      return;
    }

    // Tier 1b: still prefer outside; switch to icons-only outside before using in-stage spots.
    setPerkHudMode("outside-compact");
    const compactRect = perkHud.getBoundingClientRect();
    const compactW = Math.ceil(compactRect.width);
    const compactH = Math.ceil(compactRect.height);
    const canOutsideCompactLeft = leftRoom >= compactW + 10;
    const canOutsideCompactRight = rightRoom >= compactW + 10;
    if ((canOutsideCompactLeft || canOutsideCompactRight) && compactH + 16 <= window.innerHeight) {
      const preferRightCompact = canOutsideCompactRight && (!canOutsideCompactLeft || rightRoom >= leftRoom);
      const yCompact = Math.max(8, Math.min(window.innerHeight - compactH - 8, stageRect.top + 8));
      perkHud.style.left = preferRightCompact
        ? Math.round(stageRect.right + 10) + "px"
        : Math.round(stageRect.left - compactW - 10) + "px";
      perkHud.style.top = Math.round(yCompact) + "px";
      perkHud.style.bottom = "auto";
      return;
    }

    // Tier 2: icons-only in bottom safe band (outside grid area).
    setPerkHudMode("band");
    perkHud.style.left = "8px";
    perkHud.style.top = "";
    perkHud.style.bottom = "0px";
    const bandRect = perkHud.getBoundingClientRect();
    const bandH = Math.ceil(bandRect.height);
    const bandW = Math.ceil(bandRect.width);
    const safeBandH = (canvas.height - PLAY_BOTTOM) * scale;
    const dpadW = dpadVisible ? Math.ceil(dpad.getBoundingClientRect().width) + 10 : 0;
    const availableBandW = Math.max(0, stageRect.width - 16 - dpadW);
    const fitsBand = bandH <= Math.max(18, safeBandH - 2) && bandW <= availableBandW;
    if (fitsBand) {
      const top = PLAY_BOTTOM * scale + Math.max(1, Math.floor((safeBandH - bandH) / 2));
      perkHud.style.top = top + "px";
      perkHud.style.bottom = "auto";
      return;
    }

    // Tier 3: icons-only over grid as last resort.
    setPerkHudMode("overlay");
    perkHud.style.left = "8px";
    perkHud.style.top = (PLAY_TOP * scale + 8) + "px";
    perkHud.style.bottom = "auto";
  }

  function setControlMode(mode, announce) {
    const normalized = mode === "steer" ? "steer" : "direct";
    const changed = controlMode !== normalized;
    controlMode = normalized;
    const modeNode = document.getElementById("ctrl-mode");
    if (modeNode) modeNode.textContent = controlModeLabel(controlMode);
    if (changed && announce) {
      pushToast("Control mode: " + controlModeLabel(controlMode) + ".", "level");
      setMessage(controlMode === "steer" ? "Steer mode: L/U = left turn, R/D = right turn." : "Direct mode: arrows/WASD set heading.");
      setTimeout(function () {
        if (gameState === "running") setMessage("Eat the dung.");
      }, 950);
    }
  }

  function cycleControlMode(announce) {
    setControlMode(controlMode === "direct" ? "steer" : "direct", announce);
  }

  function setDpadVisible(visible, announce) {
    dpadVisible = !!visible;
    dpad.classList.toggle("is-hidden", !dpadVisible);
    applyPerkHudLayout();
    if (announce && !IS_COMPACT) {
      pushToast(dpadVisible ? "D-pad on." : "D-pad off.");
    }
  }

  function expandMusicShape(shape) {
    const out = [];
    const tokens = String(shape).toUpperCase().match(/[A-Z][0-9]*/g) || [];
    tokens.forEach(function (token) {
      const label = token.charAt(0);
      const count = Math.max(1, parseInt(token.slice(1), 10) || 1);
      for (let i = 0; i < count; i++) out.push(label);
    });
    return out.length ? out : ["A"];
  }

  function getMusicSection() {
    const span = MUSIC_THEME.sectionLengthSteps;
    const sectionTick = Math.floor(musicStep / span);
    const label = MUSIC_ARRANGEMENT[sectionTick % MUSIC_ARRANGEMENT.length];
    return MUSIC_THEME.sections[label] || MUSIC_THEME.sections.A;
  }

  function getMusicStepMs(section) {
    return getMusicTempoMs(section);
  }

  function getMusicTempoMs(section) {
    const levelTempoMul = Math.max(0.72, 1 - (level - 1) * 0.018);
    const themeMs = MUSIC_THEME.baseStepMs * section.tempoMul * levelTempoMul;
    if (!MUSIC_BINDINGS.syncToGameTicks) {
      return Math.max(82, Math.round(themeMs));
    }
    const tickRatio = Math.max(0.2, MUSIC_BINDINGS.ticksPerMusicStep || 1);
    const tickMs = MUSIC_BINDINGS.syncTempoSource === "baseSpeed"
      ? speed
      : currentTickIntervalMs();
    let syncedMs = tickMs * tickRatio;
    if (MUSIC_BINDINGS.keepSectionTempoWhenSynced) {
      syncedMs *= section.tempoMul;
    }
    return Math.max(45, Math.round(syncedMs));
  }

  function advanceMusicFromGameTick() {
    if (!MUSIC_BINDINGS.syncToGameTicks) return;
    if (gameState !== "running") return;
    const ratio = Math.max(0.25, MUSIC_BINDINGS.ticksPerMusicStep || 1);
    let progress = 1;
    if (MUSIC_BINDINGS.syncTempoSource === "baseSpeed") {
      progress = Math.max(0.05, currentTickIntervalMs() / Math.max(1, speed));
    }
    musicSyncAccumulator += progress;
    while (musicSyncAccumulator >= ratio) {
      musicTick();
      musicSyncAccumulator -= ratio;
    }
  }

  function getMusicRoundTranspose(section, keyShift, levelShift) {
    const desired = Math.max(0, (level - 1) * (MUSIC_BINDINGS.transposeHalfStepsPerRound || 0));
    if (desired <= 0) return 0;

    const sectionShifts = Object.keys(MUSIC_THEME.sections).map(function (k) {
      return MUSIC_THEME.sections[k].rootShift || 0;
    });
    const maxSectionShift = sectionShifts.length ? Math.max.apply(null, sectionShifts) : 0;
    const maxRootBase = MUSIC_THEME.roots.length ? Math.max.apply(null, MUSIC_THEME.roots) : 0;
    const maxScale = MUSIC_THEME.scale.length ? Math.max.apply(null, MUSIC_THEME.scale) : 0;
    const maxLeadBase = maxRootBase + maxSectionShift + keyShift + levelShift + 12 + maxScale;
    const cap = Math.floor(MUSIC_BINDINGS.transposeMaxLeadMidi - maxLeadBase);
    if (cap <= 0) return 0;
    return Math.min(desired, cap);
  }

  function roundBaseLengthForLevel(lvl) {
    return ROUND_BASE_SEGMENTS + lvl;
  }

  function roundGrowthGoalForLevel(lvl) {
    return ROUND_GROWTH_BASE + (lvl - 1) * ROUND_GROWTH_PER_LEVEL;
  }

  function computeRoundTarget(startLength, lvl) {
    const maxTarget = Math.max(3, BOARD_PATH.length - ROUND_MIN_EMPTY_CELLS);
    return Math.min(maxTarget, startLength + roundGrowthGoalForLevel(lvl));
  }

  function buildBoardPath() {
    const path = [];
    for (let y = 0; y < PLAY_ROWS; y++) {
      if (y % 2 === 0) {
        for (let x = 0; x < PLAY_COLS; x++) path.push({ x: x, y: y });
      } else {
        for (let x = PLAY_COLS - 1; x >= 0; x--) path.push({ x: x, y: y });
      }
    }
    return path;
  }

  function makeSnakeAtLength(length) {
    const maxLen = Math.max(3, BOARD_PATH.length - ROUND_MIN_EMPTY_CELLS);
    const safeLength = Math.max(3, Math.min(maxLen, length));
    const headIndex = Math.max(
      safeLength - 1,
      Math.min(BOARD_PATH.length - 1, Math.floor(BOARD_PATH.length / 2))
    );
    const s = [];
    for (let i = 0; i < safeLength; i++) {
      const cell = BOARD_PATH[headIndex - i];
      s.push({ x: cell.x, y: cell.y, id: nextSegmentId++ });
    }
    return s;
  }

  function isSafeStartMove(moveDir, segments) {
    if (!segments || segments.length === 0) return false;
    const hx = segments[0].x + moveDir.x;
    const hy = segments[0].y + moveDir.y;
    if (hx < 0 || hx >= PLAY_COLS || hy < 0 || hy >= PLAY_ROWS) return false;
    for (let i = 1; i < segments.length; i++) {
      if (segments[i].x === hx && segments[i].y === hy) return false;
    }
    return true;
  }

  function pickSafeStartDir(segments, preferredDir) {
    const candidates = [];
    if (preferredDir) candidates.push(preferredDir);
    candidates.push(DIRS.D, DIRS.R, DIRS.L, DIRS.U);
    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i];
      if (isSafeStartMove(c, segments)) return { x: c.x, y: c.y };
    }
    return { x: 1, y: 0 };
  }

  function desiredFoodCountForLevel(lvl) {
    if (lvl < MULTI_FOOD_START_LEVEL) return 1;
    return Math.min(MAX_FOOD_COUNT, 1 + Math.floor((lvl - MULTI_FOOD_START_LEVEL + 2) / 2));
  }

  function tempFoodChanceForLevel(lvl) {
    if (desiredFoodCountForLevel(lvl) <= 1) return 0;
    return 1;
  }

  function tempFoodTtlForLevel(lvl) {
    return Math.max(8, TEMP_FOOD_TTL_BASE - (lvl - 1) * TEMP_FOOD_TTL_DROP_PER_LEVEL);
  }

  function clearRoundIntroTimers() {
    if (roundStartTimeoutId) {
      clearTimeout(roundStartTimeoutId);
      roundStartTimeoutId = null;
    }
    if (roundIntroTickId) {
      clearInterval(roundIntroTickId);
      roundIntroTickId = null;
    }
    roundIntroLastSecond = null;
  }

  function clearBurstTimer() {
    if (burstTimeoutId) {
      clearTimeout(burstTimeoutId);
      burstTimeoutId = null;
    }
  }

  function isBurstActive() {
    return Date.now() < effects.burstUntil;
  }

  function currentScoreMultiplier() {
    return isBurstActive() ? 2 : 1;
  }

  function currentBurstMul() {
    const now = Date.now();
    if (now < effects.burstUntil) return BURST_SPEED_MUL;
    if (now < effects.burstReleaseUntil) {
      const span = Math.max(1, effects.burstReleaseUntil - effects.burstUntil);
      const t = Math.max(0, Math.min(1, (now - effects.burstUntil) / span));
      return BURST_SPEED_MUL + (1 - BURST_SPEED_MUL) * t;
    }
    return 1;
  }

  function currentTickIntervalMs() {
    const base = speed;
    const burstMul = currentBurstMul();
    return Math.max(45, Math.round(base * burstMul));
  }

  function stopTickLoop() {
    if (!intervalId) return;
    clearTimeout(intervalId);
    intervalId = null;
  }

  function startTickLoop() {
    stopTickLoop();
    const schedule = function () {
      if (gameState !== "running") {
        intervalId = null;
        return;
      }
      intervalId = setTimeout(function () {
        tick();
        schedule();
      }, currentTickIntervalMs());
    };
    schedule();
  }

  function activateBurst(reasonText) {
    const now = Date.now();
    const wasBursting = now < effects.burstReleaseUntil;
    effects.burstUntil = Math.max(effects.burstUntil, now + BURST_MS);
    effects.burstReleaseUntil = effects.burstUntil + BURST_RELEASE_MS;
    clearBurstTimer();
    burstTimeoutId = setTimeout(function () {
      burstTimeoutId = null;
    }, Math.max(0, effects.burstReleaseUntil - now) + 10);
    if (!wasBursting) {
      playSfxBurstStart();
      pushToast("Fermentation Burst active.", "level");
    }
    if (reasonText) {
      setMessage(reasonText);
      setTimeout(function () {
        if (gameState === "running") setMessage("Eat the dung.");
      }, 640);
    }
  }

  function resetRoundStats() {
    roundStats = {
      spoiledCount: 0,
      timedSpawned: 0,
      timedCollected: 0,
      orderedTimedChain: 0,
      burstAwarded: false,
      stepsSinceEat: 0,
      pathWaste: 0,
      eats: 0,
      preventedDeaths: 0
    };
  }

  function canStackPerk(name) {
    return perks[name] < PERK_MAX_STACK;
  }

  function grantPerk(name, amount, toastText) {
    const before = perks[name];
    perks[name] = Math.min(PERK_MAX_STACK, perks[name] + amount);
    const gained = perks[name] - before;
    if (gained > 0 && toastText) {
      pushToast(toastText + " (" + perks[name] + ")", "level");
      if (!seenPerks[name]) {
        seenPerks[name] = true;
        saveSeenPerks();
        pendingPerkTutorials.push(name);
      }
      updateHUD();
    }
  }

  function oldestTimedFood() {
    let oldest = null;
    for (let i = 0; i < foods.length; i++) {
      const f = foods[i];
      if (f.kind !== "temp") continue;
      if (!oldest || f.spawnId < oldest.spawnId) oldest = f;
    }
    return oldest;
  }

  function ensureTimedRouteFeasible() {
    if (!snake || snake.length === 0) return;
    const timedFoods = foods
      .filter((f) => f.kind === "temp")
      .sort((a, b) => a.spawnId - b.spawnId);
    if (timedFoods.length <= 1) return;

    let cursorX = snake[0].x;
    let cursorY = snake[0].y;
    let cumulative = 0;
    for (let i = 0; i < timedFoods.length; i++) {
      const f = timedFoods[i];
      cumulative += Math.abs(f.x - cursorX) + Math.abs(f.y - cursorY);
      const minTtl = cumulative + TIMED_ROUTE_SLACK_STEPS;
      if (f.ttl < minTtl) {
        f.ttl = minTtl;
        if (f.maxTtl < f.ttl) f.maxTtl = f.ttl;
      }
      cursorX = f.x;
      cursorY = f.y;
    }
  }

  function consumeScentTrailIfAvailable() {
    if (perks.scentTrail <= 0) return;
    if (!foods.some((f) => f.kind === "temp")) return;
    perks.scentTrail--;
    effects.scentTrailUntil = Date.now() + SCENT_TRAIL_MS;
    updateHUD();
    playSfxPerk("scent");
    pushToast("Scent Trail active.", "level");
    setMessage("Scent Trail active.");
    setTimeout(function () {
      if (gameState === "running") setMessage("Eat the dung.");
    }, 640);
  }

  function consumeDigestiveEfficiencyIfAvailable(baseTarget, startLength) {
    const use = Math.min(2, perks.digestiveEfficiency);
    if (use <= 0) return baseTarget;
    perks.digestiveEfficiency -= use;
    updateHUD();
    const minTarget = startLength + 2;
    playSfxPerk("digestive");
    pushToast("Digestive Efficiency used. Goal -" + use + ".", "level");
    return Math.max(minTarget, baseTarget - use);
  }

  function cloneSnakeSegments(segments) {
    return segments.map(function (s) {
      return { x: s.x, y: s.y };
    });
  }

  function countSafeNextMoves(simSnake, facingDir) {
    if (!simSnake || simSnake.length === 0) return 0;
    const head = simSnake[0];
    const dirs = [DIRS.U, DIRS.D, DIRS.L, DIRS.R];
    let safe = 0;
    for (let i = 0; i < dirs.length; i++) {
      const d = dirs[i];
      if (d.x === -facingDir.x && d.y === -facingDir.y) continue;
      const nx = head.x + d.x;
      const ny = head.y + d.y;
      if (nx < 0 || nx >= PLAY_COLS || ny < 0 || ny >= PLAY_ROWS) continue;
      const hitBody = simSnake.slice(1).some(function (s) {
        return s.x === nx && s.y === ny;
      });
      if (!hitBody) safe++;
    }
    return safe;
  }

  function simulateRescueOutcome(kind, plannedHead) {
    const baseSnake = cloneSnakeSegments(snake);
    const facing = { x: dir.x, y: dir.y };
    if (kind === "shield") {
      return { snake: baseSnake, facingDir: facing, safeMoves: countSafeNextMoves(baseSnake, facing), roundComplete: false };
    }
    if (kind === "molt") {
      if (baseSnake.length < MOLTING_MIN_LENGTH || !baseSnake[1]) return null;
      const neck = baseSnake[1];
      baseSnake[0] = { x: neck.x, y: neck.y };
      baseSnake.splice(1, 1);
      return { snake: baseSnake, facingDir: facing, safeMoves: countSafeNextMoves(baseSnake, facing), roundComplete: false };
    }
    if (kind === "acid") {
      if (!plannedHead) return null;
      if (plannedHead.x < 0 || plannedHead.x >= PLAY_COLS || plannedHead.y < 0 || plannedHead.y >= PLAY_ROWS) return null;
      const nextSnake = [{ x: plannedHead.x, y: plannedHead.y }].concat(baseSnake);
      const eats = foods.some(function (f) {
        return f.x === plannedHead.x && f.y === plannedHead.y;
      });
      if (!eats) nextSnake.pop();
      const wouldComplete = eats && nextSnake.length >= roundTargetLength;
      return {
        snake: nextSnake,
        facingDir: facing,
        safeMoves: countSafeNextMoves(nextSnake, facing),
        roundComplete: wouldComplete
      };
    }
    return null;
  }

  function chooseBestRescueOption(hitSelf, plannedHead) {
    const options = [];
    if (hitSelf && perks.acidSpray > 0) {
      const acidSim = simulateRescueOutcome("acid", plannedHead);
      if (acidSim) options.push({ kind: "acid", priority: 0, sim: acidSim });
    }
    if (perks.gutShield > 0) {
      const shieldSim = simulateRescueOutcome("shield", plannedHead);
      if (shieldSim) options.push({ kind: "shield", priority: 1, sim: shieldSim });
    }
    if (perks.molting > 0 && snake.length >= MOLTING_MIN_LENGTH) {
      const moltSim = simulateRescueOutcome("molt", plannedHead);
      if (moltSim) options.push({ kind: "molt", priority: 2, sim: moltSim });
    }
    if (options.length === 0) return null;

    const viable = options.filter(function (o) {
      return o.sim.roundComplete || o.sim.safeMoves > 0;
    });
    if (viable.length === 0) return null;

    viable.sort(function (a, b) {
      if (a.sim.roundComplete !== b.sim.roundComplete) {
        return a.sim.roundComplete ? -1 : 1;
      }
      if (a.sim.safeMoves !== b.sim.safeMoves) {
        return b.sim.safeMoves - a.sim.safeMoves;
      }
      return a.priority - b.priority;
    });
    return viable[0].kind;
  }

  function tryAutoPreventDeath(hitSelf, plannedHead) {
    const choice = chooseBestRescueOption(hitSelf, plannedHead);
    if (!choice) {
      return "none";
    }

    if (choice === "acid") {
      perks.acidSpray--;
      roundStats.preventedDeaths++;
      updateHUD();
      playSfxPerk("acid");
      pushToast("Acid Spray phase-through.", "level");
      setMessage("Acid Spray!");
      return "phase";
    }

    if (choice === "shield") {
      perks.gutShield--;
      roundStats.preventedDeaths++;
      updateHUD();
      playSfxPerk("shield");
      pushToast("Gut Shield blocked crash.", "level");
      setMessage("Gut Shield saved you.");
      return "skip";
    }

    if (choice === "molt" && perks.molting > 0 && snake.length >= MOLTING_MIN_LENGTH) {
      perks.molting--;
      roundStats.preventedDeaths++;
      updateHUD();
      const neck = snake[1];
      if (neck) {
        // Tactical molt: retreat head into the neck cell and shed that neck link.
        // This shortens by one and gives the player a reaction window next tick.
        snake[0] = { x: neck.x, y: neck.y };
        snake.splice(1, 1);
        effects.moltFreezeTicks = MOLT_ESCAPE_FREEZE_TICKS;
        playSfxPerk("molt");
        pushToast("Molting escape! -1 segment.", "level");
        setMessage("Molting escape: reorient!");
        return "skip";
      }
    }

    return "none";
  }

  function beginRoundIntro(isLevelUp) {
    clearRoundIntroTimers();
    stopTickLoop();
    stopMusic();
    gameState = "round_intro";
    roundIntroIsLevelUp = !!isLevelUp;
    roundIntroLastSecond = null;
    roundIntroUntil = Date.now() + ROUND_START_DELAY_MS;
    roundIntroLabel = "Level " + level;
    setMessage(isLevelUp ? "Round cleared. " + roundIntroLabel + " in 3..." : "Get ready. " + roundIntroLabel + " in 3...");
    syncControls();
    draw();
    roundIntroTickId = setInterval(draw, 100);
    roundStartTimeoutId = setTimeout(function () {
      clearRoundIntroTimers();
      gameState = "running";
      setMessage("Eat the dung.");
      playSfxUi("start");
      consumeScentTrailIfAvailable();
      startMusic();
      syncControls();
      startTickLoop();
      draw();
      maybeShowQueuedPerkTutorial();
    }, ROUND_START_DELAY_MS);
  }

  function ensureAudio() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return false;
    if (!audioCtx) {
      audioCtx = new AudioCtor();
      audioMaster = audioCtx.createGain();
      audioMaster.gain.value = 1.6;
      audioMaster.connect(audioCtx.destination);

      musicBus = audioCtx.createGain();
      musicBus.gain.value = 1.5;
      musicBus.connect(audioMaster);

      const sampleLen = Math.floor(audioCtx.sampleRate * 0.4);
      noiseBuffer = audioCtx.createBuffer(1, sampleLen, audioCtx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < sampleLen; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * 0.9;
      }
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return true;
  }

  function routeNode(node, volume, start, attack, release) {
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + release);
    node.connect(gain);
    gain.connect(audioMaster);
    return gain;
  }

  function playSfxBite() {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;

    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    const band = audioCtx.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 1.3;
    band.frequency.setValueAtTime(420, t);
    band.frequency.exponentialRampToValueAtTime(210, t + 0.09);
    noise.connect(band);
    routeNode(band, 0.12, t, 0.01, 0.11);
    noise.start(t);
    noise.stop(t + 0.14);

    const plop = audioCtx.createOscillator();
    plop.type = "sine";
    plop.frequency.setValueAtTime(150, t);
    plop.frequency.exponentialRampToValueAtTime(78, t + 0.09);
    routeNode(plop, 0.09, t, 0.004, 0.1);
    plop.start(t);
    plop.stop(t + 0.13);
  }

  function playSfxStep() {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;

    // Hat-like noise burst.
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    const high = audioCtx.createBiquadFilter();
    high.type = "highpass";
    high.frequency.setValueAtTime(3400, t);
    high.frequency.exponentialRampToValueAtTime(4800, t + 0.08);
    noise.connect(high);
    routeNode(high, STEP_SFX_VOLUME, t, 0.001, 0.11);
    noise.start(t);
    noise.stop(t + 0.12);

    // Short FM-ish metallic ping layered under the noise.
    const carrier = audioCtx.createOscillator();
    carrier.type = "triangle";
    carrier.frequency.setValueAtTime(1300, t);
    carrier.frequency.exponentialRampToValueAtTime(980, t + 0.12);

    const mod = audioCtx.createOscillator();
    mod.type = "sine";
    mod.frequency.setValueAtTime(170, t);
    const modGain = audioCtx.createGain();
    modGain.gain.setValueAtTime(700, t);
    modGain.gain.exponentialRampToValueAtTime(80, t + 0.11);
    mod.connect(modGain);
    modGain.connect(carrier.frequency);

    const ring = audioCtx.createBiquadFilter();
    ring.type = "bandpass";
    ring.Q.value = 4.5;
    ring.frequency.setValueAtTime(2100, t);
    ring.frequency.exponentialRampToValueAtTime(3000, t + 0.1);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(STEP_SFX_VOLUME * 0.85, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);

    carrier.connect(ring);
    ring.connect(gain);
    gain.connect(audioMaster);

    carrier.start(t);
    mod.start(t);
    carrier.stop(t + 0.14);
    mod.stop(t + 0.14);
  }

  function playSfxLevel() {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;
    [0, 0.06, 0.12].forEach(function (offset, i) {
      const osc = audioCtx.createOscillator();
      osc.type = "triangle";
      const freq = i === 0 ? 280 : i === 1 ? 360 : 450;
      osc.frequency.setValueAtTime(freq, t + offset);
      routeNode(osc, 0.08, t + offset, 0.004, 0.12);
      osc.start(t + offset);
      osc.stop(t + offset + 0.16);
    });
  }

  function playSfxCountdownBang(step) {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;
    const weight = step === 1 ? 1.42 : step === 2 ? 1.24 : 1.1;

    const hitBus = audioCtx.createGain();
    hitBus.gain.value = 1;
    hitBus.connect(audioMaster);

    const send = audioCtx.createGain();
    send.gain.value = 0.4;
    hitBus.connect(send);

    // Lo-fi pseudo reverb via short feedback delays.
    const delayA = audioCtx.createDelay(0.8);
    delayA.delayTime.setValueAtTime(0.19, t);
    const delayB = audioCtx.createDelay(0.8);
    delayB.delayTime.setValueAtTime(0.37, t);
    const fbA = audioCtx.createGain();
    fbA.gain.setValueAtTime(0.45, t);
    fbA.gain.exponentialRampToValueAtTime(0.0001, t + 0.92);
    const fbB = audioCtx.createGain();
    fbB.gain.setValueAtTime(0.31, t);
    fbB.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    const tailLow = audioCtx.createBiquadFilter();
    tailLow.type = "lowpass";
    tailLow.frequency.setValueAtTime(980, t);
    const tailHigh = audioCtx.createBiquadFilter();
    tailHigh.type = "highpass";
    tailHigh.frequency.setValueAtTime(65, t);
    const wetGain = audioCtx.createGain();
    wetGain.gain.setValueAtTime(0.0001, t);
    wetGain.gain.exponentialRampToValueAtTime(0.1, t + 0.04);
    wetGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);

    send.connect(delayA);
    delayA.connect(fbA);
    fbA.connect(delayA);
    delayA.connect(delayB);
    delayB.connect(fbB);
    fbB.connect(delayB);
    delayB.connect(tailLow);
    tailLow.connect(tailHigh);
    tailHigh.connect(wetGain);
    wetGain.connect(audioMaster);

    const hitNode = function (node, volume, start, attack, release) {
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + release);
      node.connect(gain);
      gain.connect(hitBus);
      return gain;
    };

    // Big low tom body.
    const tom = audioCtx.createOscillator();
    tom.type = "sine";
    tom.frequency.setValueAtTime(84 * weight, t);
    tom.frequency.exponentialRampToValueAtTime(28 * weight, t + 0.5);
    hitNode(tom, 0.19, t, 0.002, 0.62);
    tom.start(t);
    tom.stop(t + 0.68);

    // Metallic chip thump layer.
    const thunk = audioCtx.createOscillator();
    thunk.type = "triangle";
    thunk.frequency.setValueAtTime(116 * weight, t);
    thunk.frequency.exponentialRampToValueAtTime(46 * weight, t + 0.38);
    hitNode(thunk, 0.088, t + 0.004, 0.0015, 0.44);
    thunk.start(t + 0.004);
    thunk.stop(t + 0.5);

    // Noisy impact smack.
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    const band = audioCtx.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 0.8;
    band.frequency.setValueAtTime(290 * weight, t);
    band.frequency.exponentialRampToValueAtTime(96 * weight, t + 0.34);
    noise.connect(band);
    hitNode(band, 0.118, t, 0.001, 0.36);
    noise.start(t);
    noise.stop(t + 0.4);
  }

  function playSfxDeath() {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(170, t);
    osc.frequency.exponentialRampToValueAtTime(44, t + 0.32);
    routeNode(osc, 0.1, t, 0.01, 0.34);
    osc.start(t);
    osc.stop(t + 0.36);

    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    const low = audioCtx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.setValueAtTime(700, t);
    low.frequency.exponentialRampToValueAtTime(180, t + 0.28);
    noise.connect(low);
    routeNode(low, 0.08, t, 0.01, 0.26);
    noise.start(t);
    noise.stop(t + 0.28);
  }

  function playSfxUi(kind) {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    osc.type = "square";
    const f1 = kind === "pause" ? 190 : 240;
    const f2 = kind === "pause" ? 150 : 310;
    osc.frequency.setValueAtTime(f1, t);
    osc.frequency.exponentialRampToValueAtTime(f2, t + 0.06);
    routeNode(osc, 0.045, t, 0.003, 0.08);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  function playSfxPerk(kind) {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    let f1 = 220;
    let f2 = 330;
    let vol = 0.05;
    if (kind === "molt") {
      f1 = 140;
      f2 = 240;
      vol = 0.065;
    } else if (kind === "acid") {
      f1 = 260;
      f2 = 180;
      vol = 0.055;
    } else if (kind === "shield") {
      f1 = 200;
      f2 = 320;
      vol = 0.05;
    } else if (kind === "scent") {
      f1 = 280;
      f2 = 360;
      vol = 0.045;
    } else if (kind === "digestive") {
      f1 = 190;
      f2 = 270;
      vol = 0.05;
    }
    osc.frequency.setValueAtTime(f1, t);
    osc.frequency.exponentialRampToValueAtTime(f2, t + 0.1);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    osc.connect(gain);
    gain.connect(audioMaster);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  function playSfxBurstStart() {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;
    const notes = [520, 660, 840];
    notes.forEach(function (freq, i) {
      const at = t + i * 0.045;
      const osc = audioCtx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, at);
      routeNode(osc, 0.04, at, 0.003, 0.1);
      osc.start(at);
      osc.stop(at + 0.12);
    });
  }

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function playMusicVoice(freq, duration, volume, isBass) {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;

    const carrier = audioCtx.createOscillator();
    carrier.type = isBass ? "sawtooth" : "square";
    carrier.frequency.setValueAtTime(freq, t);

    const mod = audioCtx.createOscillator();
    mod.type = "sine";
    mod.frequency.setValueAtTime(isBass ? 26 : 44, t);
    const modGain = audioCtx.createGain();
    modGain.gain.setValueAtTime(freq * (isBass ? 0.22 : 0.12), t);
    modGain.gain.exponentialRampToValueAtTime(freq * (isBass ? 0.11 : 0.05), t + duration * 0.9);
    mod.connect(modGain);
    modGain.connect(carrier.frequency);

    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = isBass ? 1.8 : 2.2;
    filter.frequency.setValueAtTime(isBass ? 250 : 420, t);
    filter.frequency.exponentialRampToValueAtTime(isBass ? 140 : 260, t + duration);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    carrier.connect(filter);
    filter.connect(gain);
    gain.connect(musicBus);

    carrier.start(t);
    mod.start(t);
    carrier.stop(t + duration + 0.04);
    mod.stop(t + duration + 0.04);
  }

  function musicTick() {
    if (gameState !== "running") return;
    const section = getMusicSection();
    const span = MUSIC_THEME.sectionLengthSteps;
    const stepInSection = musicStep % span;
    const sectionTick = Math.floor(musicStep / span);
    const arrangementLoop = Math.floor(sectionTick / MUSIC_ARRANGEMENT.length);
    const keyShift = MUSIC_THEME.keyCycle[arrangementLoop % MUSIC_THEME.keyCycle.length];
    const rootBase = MUSIC_THEME.roots[Math.floor(musicStep / 8) % MUSIC_THEME.roots.length];
    const levelShift = Math.floor((level - 1) / 4) * 2;
    const roundTranspose = getMusicRoundTranspose(section, keyShift, levelShift);
    const root = rootBase + section.rootShift + keyShift + levelShift + roundTranspose;
    const groove = MUSIC_THEME.leadSwing[(musicStep + section.swingShift) % MUSIC_THEME.leadSwing.length];
    const leadDegree = MUSIC_THEME.leadPattern[stepInSection % MUSIC_THEME.leadPattern.length];
    const bassHit = stepInSection % section.bassEvery === 0;
    const accent = stepInSection % section.accentEvery === 0;

    if (bassHit) {
      playMusicVoice(midiToFreq(root - 12), 0.24, accent ? 0.06 : 0.047, true);
    }

    if (leadDegree !== null && Math.random() < section.leadGate) {
      const leadMidi = root + 12 + MUSIC_THEME.scale[(leadDegree + groove) % MUSIC_THEME.scale.length];
      playMusicVoice(midiToFreq(leadMidi), 0.16, accent ? 0.042 : 0.031, false);
    }

    musicStep++;
  }

  function startMusic() {
    if (!ensureAudio()) return;
    if (musicTimer) return;
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    if (MUSIC_BINDINGS.syncToGameTicks) {
      musicSyncAccumulator = 0;
      return;
    }
    musicTick();
    const schedule = function () {
      if (gameState !== "running") {
        musicTimer = null;
        return;
      }
      const ms = getMusicStepMs(getMusicSection());
      musicTimer = setTimeout(function () {
        musicTick();
        schedule();
      }, ms);
    };
    schedule();
  }

  function stopMusic() {
    if (musicTimer) {
      clearTimeout(musicTimer);
      musicTimer = null;
    }
    musicSyncAccumulator = 0;
  }

  function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function loadBestScore() {
    try {
      const raw = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);
      if (raw === null) return 0;
      const parsed = Number(raw);
      if (!Number.isFinite(parsed) || parsed < 0) return 0;
      return Math.floor(parsed);
    } catch (err) {
      return 0;
    }
  }

  function saveBestScore(value) {
    try {
      window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(value));
    } catch (err) {
      // Storage may be blocked/unavailable; fail silently.
    }
  }

  function updateBestIfHigher(candidate) {
    if (candidate <= best) return;
    best = candidate;
    saveBestScore(best);
  }

  function pushToast(text, tone) {
    const toast = document.createElement("div");
    toast.className = "copro-toast" + (tone ? " " + tone : "");
    toast.textContent = text;
    toastHost.appendChild(toast);
    while (toastHost.children.length > 3) {
      toastHost.firstElementChild.remove();
    }
    setTimeout(function () {
      toast.remove();
    }, 1550);
  }

  function initPaperPipeline() {
    if (paperRuntime) return;
    if (!window.COPRO_PAPER_MATERIALS || !window.COPRO_PAPER_ART) return;

    paperRuntime = window.COPRO_PAPER_MATERIALS.createRuntime({
      canvas: canvas,
      paperCanvas: paperCanvas,
      getPlayBounds: function () {
        return {
          top: PLAY_TOP,
          bottom: PLAY_BOTTOM,
          height: PLAY_HEIGHT,
        };
      },
      getFrame: function () { return frame || 0; },
      getGameState: function () { return gameState; },
      getEffects: function () { return effects; },
      getLevel: function () { return level || 1; },
    });
    paperArt = window.COPRO_PAPER_ART.createArtDirector(paperRuntime);
    paperRuntime.init();
  }

  function renderPaperOverlay() {
    if (!isPaperCharacterMode()) return;
    if (!paperRuntime) return;
    paperRuntime.renderOverlay();
  }

  function init() {
    initPaperPipeline();
    characterMode = loadCharacterMode();
    applyCharacterMode(characterMode);
    nextSegmentId = 1;
    clearRoundIntroTimers();
    clearBurstTimer();
    clearPerkTutorialTimer();
    stopMusic();
    if (helpPanel) helpPanel.classList.add("is-hidden");
    effects.burstUntil = 0;
    effects.burstReleaseUntil = 0;
    effects.scentTrailUntil = 0;
    effects.moltFreezeTicks = 0;
    perks.gutShield = 0;
    perks.molting = 0;
    perks.acidSpray = 0;
    perks.scentTrail = 0;
    perks.digestiveEfficiency = 0;
    pendingPerkTutorials = [];
    tutorialPerkKey = null;
    seenPerks = loadSeenPerks();
    renderHelpPerks();
    perfectRoundStreak = 0;
    best = loadBestScore();
    score = 0;
    level = 1;
    speed = START_SPEED;
    gameState = "idle";
    frame = 0;
    particles = [];
    setupRound();
    updateHUD();
    syncControls();
    setDpadVisible(SHOW_DPAD_BY_DEFAULT, false);
    setStartPanelOpen(true);
    setMessage("Choose your critter.");
    drawIdle();
  }

  function spawnFood(kind) {
    let attempts = 0;
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * PLAY_COLS),
        y: Math.floor(Math.random() * PLAY_ROWS),
      };
      attempts++;
      if (attempts > 300) return null;
    } while (
      snake.some((s) => s.x === pos.x && s.y === pos.y) ||
      foods.some((f) => f.x === pos.x && f.y === pos.y)
    );
    pos.type = Math.floor(Math.random() * PALETTE.food.length);
    pos.kind = kind || "normal";
    if (pos.kind === "temp") {
      pos.spawnId = ++foodSpawnCounter;
      pos.ttl = tempFoodTtlForLevel(level);
      pos.maxTtl = pos.ttl;
      if (roundStats) roundStats.timedSpawned++;
    } else {
      pos.ttl = Infinity;
      pos.maxTtl = Infinity;
      pos.spawnId = 0;
    }
    return pos;
  }

  function ensureFoods() {
    const target = desiredFoodCountForLevel(level);
    const allTimed = target > 1;
    while (foods.length < target) {
      const kind = allTimed ? "temp" : "normal";
      const next = spawnFood(kind);
      if (!next) break;
      foods.push(next);
    }
    ensureTimedRouteFeasible();
  }

  function setupRound(carryLength) {
    const minLength = roundBaseLengthForLevel(level);
    const desiredLength = Math.max(minLength, carryLength || 0);
    snake = makeSnakeAtLength(desiredLength);
    const preferredDir = snake.length > 1
      ? { x: snake[0].x - snake[1].x, y: snake[0].y - snake[1].y }
      : { x: 1, y: 0 };
    dir = pickSafeStartDir(snake, preferredDir);
    nextDir = { ...dir };
    roundTargetLength = computeRoundTarget(snake.length, level);
    roundTargetLength = consumeDigestiveEfficiencyIfAvailable(roundTargetLength, snake.length);
    particles = [];
    foods = [];
    resetRoundStats();
    ensureFoods();
  }

  function updateHUD() {
    document.getElementById("score").textContent = score;
    document.getElementById("best").textContent = best;
    document.getElementById("level").textContent = level;
    document.getElementById("goal").textContent = roundTargetLength;
    const modeNode = document.getElementById("ctrl-mode");
    if (modeNode) modeNode.textContent = controlModeLabel(controlMode);
    renderPerkHUD();
    applyPerkHudLayout();
  }

  function syncControls() {
    btnRestart.style.display = gameState === "idle" ? "none" : "inline-flex";
    btnPause.textContent = gameState === "paused" ? "Resume" : "Pause";
    btnStart.textContent = startPanel && startPanel.classList.contains("is-open") ? "Play" : "Start";
    btnStart.disabled = gameState === "running" || gameState === "round_intro" || gameState === "perk_tutorial" || gameState === "help";
    btnPause.disabled = gameState === "help" || gameState === "perk_tutorial";
    btnMode.disabled = gameState === "help";
    if (btnSelect) btnSelect.disabled = gameState !== "idle" && gameState !== "dead";
    btnHelp.textContent = gameState === "help" ? "Close" : "How To";
  }

  function speedForLevel(lvl) {
    return Math.max(MIN_SPEED, START_SPEED - (lvl - 1) * SPEED_FACTOR);
  }

  function resetGame() {
    stopTickLoop();
    clearRoundIntroTimers();
    clearBurstTimer();
    clearPerkTutorialTimer();
    stopMusic();
    if (helpPanel) helpPanel.classList.add("is-hidden");
    effects.burstUntil = 0;
    effects.burstReleaseUntil = 0;
    effects.scentTrailUntil = 0;
    effects.moltFreezeTicks = 0;
    perks.gutShield = 0;
    perks.molting = 0;
    perks.acidSpray = 0;
    perks.scentTrail = 0;
    perks.digestiveEfficiency = 0;
    pendingPerkTutorials = [];
    tutorialPerkKey = null;
    perfectRoundStreak = 0;
    musicStep = 0;
    score = 0;
    level = 1;
    speed = START_SPEED;
    frame = 0;
    nextSegmentId = 1;
    setStartPanelOpen(true);
    if (paperRuntime) paperRuntime.onResize();
    setupRound();
    updateHUD();
    setMessage("Choose your critter.");
  }

  function startGame() {
    if (gameState === "running" || gameState === "round_intro") return;
    ensureAudio();
    setStartPanelOpen(false);
    if (gameState === "idle" || gameState === "dead") resetGame();
    setStartPanelOpen(false);
    beginRoundIntro(false);
  }

  function pauseGame() {
    if (gameState === "running") {
      stopTickLoop();
      stopMusic();
      gameState = "paused";
      setMessage("Paused");
      playSfxUi("pause");
      syncControls();
      draw();
    } else if (gameState === "paused") {
      gameState = "running";
      setMessage("Eat the dung.");
      playSfxUi("start");
      startMusic();
      syncControls();
      startTickLoop();
      maybeShowQueuedPerkTutorial();
    }
  }

  function rotateDir90(base, clockwise) {
    return clockwise
      ? { x: -base.y, y: base.x }
      : { x: base.y, y: -base.x };
  }

  function turnRelative(clockwise) {
    const base = nextDir || dir || { x: 1, y: 0 };
    nextDir = rotateDir90(base, clockwise);
    if (gameState === "idle" || gameState === "dead") {
      startGame();
    }
  }

  function applyDirectionalControl(next) {
    if (controlMode === "steer") {
      // Steer mode maps all direction keys to left/right turns only.
      const turnRight = next === DIRS.R || next === DIRS.D;
      turnRelative(turnRight);
      return;
    }
    turnTo(next);
  }

  function turnTo(next) {
    if (next.x !== -dir.x || next.y !== -dir.y) {
      nextDir = next;
    }
    if (gameState === "idle" || gameState === "dead") {
      startGame();
    }
  }

  function completeRound() {
    const carryLength = snake.length;
    const baseAtCurrentLevel = roundBaseLengthForLevel(level);
    const surplus = Math.max(0, carryLength - baseAtCurrentLevel);
    const roundBonus = level * ROUND_CLEAR_BONUS_PER_LEVEL + surplus * ROUND_MASS_BONUS_PER_SEG;
    score += roundBonus;
    updateBestIfHigher(score);

    const avgWaste = roundStats.eats > 0 ? roundStats.pathWaste / roundStats.eats : 999;
    if (roundStats.spoiledCount === 0 && canStackPerk("gutShield")) {
      grantPerk("gutShield", 1, "Gut Shield gained");
    }
    if (roundStats.timedSpawned > 0 && roundStats.timedCollected === roundStats.timedSpawned && canStackPerk("scentTrail")) {
      grantPerk("scentTrail", 1, "Scent Trail gained");
    }
    if (snake.length >= roundBaseLengthForLevel(level) + 5 && canStackPerk("molting")) {
      grantPerk("molting", 1, "Molting gained");
    }
    if (roundStats.eats >= 4 && avgWaste <= 2.2 && canStackPerk("digestiveEfficiency")) {
      const amount = avgWaste <= 1.3 ? 2 : 1;
      grantPerk("digestiveEfficiency", amount, "Digestive Efficiency gained");
    }
    if (roundStats.spoiledCount === 0 && roundStats.preventedDeaths === 0) {
      perfectRoundStreak++;
    } else {
      perfectRoundStreak = 0;
    }
    if (perfectRoundStreak > 0 && perfectRoundStreak % 2 === 0 && canStackPerk("acidSpray")) {
      grantPerk("acidSpray", 1, "Acid Spray gained");
    }

    clearBurstTimer();
    effects.burstUntil = 0;
    effects.burstReleaseUntil = 0;
    effects.moltFreezeTicks = 0;
    level++;
    speed = speedForLevel(level);
    setupRound(carryLength);
    playSfxLevel();
    pushToast("Round clear. +" + roundBonus + " bonus. Goal " + roundTargetLength + ".", "level");
    setMessage(pickRandom(LEVEL_MESSAGES) + "  L" + level);
    updateHUD();
    beginRoundIntro(true);
  }

  function updateTimedFoods() {
    ensureTimedRouteFeasible();
    let expired = 0;
    foods = foods.filter(function (f) {
      if (f.kind !== "temp") return true;
      f.ttl--;
      if (f.ttl > 0) return true;
      expired++;
      roundStats.spoiledCount++;
      roundStats.orderedTimedChain = 0;
      return false;
    });
    if (expired > 0) {
      pushToast("Spoiled dung vanished.", "bad");
      if (gameState === "running") {
        setMessage("Hurry: timed dung spoils.");
        setTimeout(function () {
          if (gameState === "running") setMessage("Eat the dung.");
        }, 520);
      }
    }
    ensureFoods();
    ensureTimedRouteFeasible();
  }

  function tick() {
    frame++;
    advanceMusicFromGameTick();
    if (effects.moltFreezeTicks > 0) {
      effects.moltFreezeTicks--;
      updateParticles();
      draw();
      return;
    }
    dir = { ...nextDir };
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y, id: nextSegmentId++ };
    const hitSelf = snake.slice(1).some((s) => s.x === head.x && s.y === head.y);
    const hitWall = head.x < 0 || head.x >= PLAY_COLS || head.y < 0 || head.y >= PLAY_ROWS;

    if (hitWall || hitSelf) {
      const rescue = tryAutoPreventDeath(hitSelf, head);
      if (rescue === "none") {
        die();
        return;
      }
      if (rescue === "skip") {
        updateTimedFoods();
        updateParticles();
        draw();
        return;
      }
    }

    snake.unshift(head);
    playSfxStep();
    const eatenIdx = foods.findIndex((f) => f.x === head.x && f.y === head.y);
    if (eatenIdx !== -1) {
      const oldestTimed = oldestTimedFood();
      const eaten = foods.splice(eatenIdx, 1)[0];
      roundStats.pathWaste += roundStats.stepsSinceEat;
      roundStats.stepsSinceEat = 0;
      roundStats.eats++;
      if (eaten.kind === "temp") {
        roundStats.timedCollected++;
        if (oldestTimed && eaten.spawnId === oldestTimed.spawnId) {
          roundStats.orderedTimedChain++;
        } else {
          roundStats.orderedTimedChain = 1;
        }
        if (roundStats.orderedTimedChain >= 3 && !roundStats.burstAwarded) {
          roundStats.burstAwarded = true;
          activateBurst("Fermentation Burst! x2");
        }
      } else {
        roundStats.orderedTimedChain = 0;
      }
      const bitePoints = Math.round((eaten.kind === "temp" ? 15 : 10) * level * currentScoreMultiplier());
      score += bitePoints;
      updateBestIfHigher(score);
      spawnParticles(eaten.x, eaten.y);
      playSfxBite();
      pushToast(pickRandom(BITE_TOASTS));
      ensureFoods();

      if (snake.length >= roundTargetLength) {
        completeRound();
        return;
      }

      setMessage(pickRandom(BITE_MESSAGES));
      setTimeout(function () {
        if (gameState === "running") setMessage("Eat the dung.");
      }, 700);
      updateHUD();
    } else {
      roundStats.stepsSinceEat++;
      snake.pop();
    }

    updateTimedFoods();
    updateParticles();
    draw();
  }

  function die() {
    gameState = "dead";
    stopTickLoop();
    clearRoundIntroTimers();
    clearBurstTimer();
    clearPerkTutorialTimer();
    stopMusic();
    playSfxDeath();
    updateBestIfHigher(score);
    updateHUD();
    syncControls();
    setMessage("You died. Score " + score);
    pushToast("Larva down.", "bad");
    draw();
    drawDeathOverlay();
  }

  function spawnParticles(gx, gy) {
    for (let i = 0; i < snake.length; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 1 + Math.random() * 2.4;
      particles.push({
        x: gx * CELL + CELL / 2,
        y: PLAY_TOP + gy * CELL + CELL / 2,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 16,
        maxLife: 16,
        color: PALETTE.food[Math.floor(Math.random() * PALETTE.food.length)],
      });
    }
  }

  function updateParticles() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life--;
    }
    particles = particles.filter((p) => p.life > 0);
  }

  function drawGrid() {
    const board = characterBoardTheme();
    const w = canvas.width;
    const h = canvas.height;
    const glow = ctx.createRadialGradient(w * 0.5, h * 0.38, 50, w * 0.5, h * 0.4, w * 0.72);
    glow.addColorStop(0, board.glowInner);
    glow.addColorStop(0.5, board.glowMid);
    glow.addColorStop(1, board.glowOuter);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = board.band;
    ctx.fillRect(0, 0, w, PLAY_TOP);
    ctx.fillRect(0, PLAY_BOTTOM, w, h - PLAY_BOTTOM);

    ctx.fillStyle = board.line;
    ctx.fillRect(0, PLAY_TOP - 1, w, 1);
    ctx.fillRect(0, PLAY_BOTTOM, w, 1);
    if (isPaperCharacterMode() && paperRuntime) paperRuntime.drawPlayfieldPaper(ctx);
    if (isPaperCharacterMode() && paperArt) {
      paperArt.drawGridLines(ctx, {
        cols: PLAY_COLS,
        rows: PLAY_ROWS,
        cell: CELL,
        playTop: PLAY_TOP,
        playBottom: PLAY_BOTTOM,
      });
    }

    ctx.strokeStyle = board.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, PLAY_TOP + 1, PLAY_COLS * CELL - 2, PLAY_HEIGHT - 2);
  }

  function drawFood() {
    const iconScale = IS_COMPACT ? 0.82 : 0.7;
    const scentActive = Date.now() < effects.scentTrailUntil;
    const oldestTimed = scentActive ? oldestTimedFood() : null;
    foods.forEach(function (food, index) {
      const cx = food.x * CELL + CELL / 2;
      const cy = PLAY_TOP + food.y * CELL + CELL / 2;
      const r = CELL * 0.4;
      ctx.save();
      const bob = Math.sin(frame * 0.18 + index * 0.7) * 1.3;
      ctx.translate(0, bob);
      ctx.fillStyle = PALETTE.food[food.type];
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PALETTE.segOutline;
      ctx.lineWidth = 0.9;
      ctx.stroke();

      if (food.kind === "temp") {
        const lifePct = food.ttl / food.maxTtl;
        ctx.strokeStyle = "rgba(255, 145, 120, " + (0.28 + (1 - lifePct) * 0.55) + ")";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(cx, cy, r * (0.95 + (1 - lifePct) * 0.1), 0, Math.PI * 2);
        ctx.stroke();
        if (oldestTimed && food.spawnId === oldestTimed.spawnId) {
          ctx.strokeStyle = "rgba(255, 248, 178, 0.92)";
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.arc(cx, cy, r * 1.18, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.fillStyle = PALETTE.foodShine;
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.26, cy - r * 0.3, r * 0.22, r * 0.14, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(246, 232, 196, 0.95)";
      ctx.beginPath();
      ctx.arc(cx, cy + 0.2, r * 0.68, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(90, 61, 8, 0.45)";
      ctx.lineWidth = 0.7;
      ctx.stroke();
      ctx.font = "bold " + Math.floor(CELL * iconScale) + "px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(20,10,5,0.7)";
      ctx.shadowBlur = 2;
      ctx.shadowOffsetY = 1;
      ctx.fillText("💩", cx, cy + 0.5);
      ctx.shadowColor = "transparent";
      ctx.restore();
    });
  }

  function catmullRomPoint(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    return {
      x: 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
      ),
      y: 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
      )
    };
  }

  function buildSnakeSpine(points, samplesPerSegment) {
    if (!points || points.length === 0) return [];
    if (points.length === 1) return [{ x: points[0].x, y: points[0].y }];
    const sampled = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const steps = i === points.length - 2 ? samplesPerSegment + 1 : samplesPerSegment;
      for (let j = 0; j < steps; j++) {
        const t = j / samplesPerSegment;
        sampled.push(catmullRomPoint(p0, p1, p2, p3, t));
      }
    }
    return sampled;
  }

  function drawWorm() {
    const len = snake.length;
    for (let i = len - 1; i >= 1; i--) {
      const s = snake[i];
      const prev = snake[i - 1];
      const ci = i % PALETTE.body.length;
      const px = s.x * CELL;
      const py = PLAY_TOP + s.y * CELL;
      ctx.fillStyle = PALETTE.body[ci];
      const isEnd = i === len - 1;
      const segR = isEnd ? CELL * 0.28 : CELL * 0.37;
      const cx2 = px + CELL / 2;
      const cy2 = py + CELL / 2;
      const segAngle = isEnd
        ? Math.atan2(prev.y - s.y, prev.x - s.x)
        : 0;
      ctx.beginPath();
      ctx.ellipse(cx2, cy2, segR, segR * (isEnd ? 0.72 : 0.88), segAngle, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PALETTE.segOutline;
      ctx.lineWidth = 0.7;
      ctx.stroke();
      if (paperArt) {
        paperArt.drawSegmentPaperGrain(ctx, {
          cx: cx2,
          cy: cy2,
          rx: segR,
          ry: segR * (isEnd ? 0.72 : 0.88),
          angle: segAngle,
          segmentId: s.id || i,
          frame: frame,
        });
      }
      if (!isEnd) {
        const ncx = prev.x * CELL + CELL / 2;
        const ncy = PLAY_TOP + prev.y * CELL + CELL / 2;
        ctx.beginPath();
        ctx.moveTo(cx2, cy2);
        ctx.lineTo((cx2 + ncx) / 2, (cy2 + ncy) / 2);
        ctx.lineWidth = segR * 1.6;
        ctx.strokeStyle = PALETTE.body[ci];
        ctx.stroke();
      }
    }

    const h = snake[0];
    const hx = h.x * CELL + CELL / 2;
    const hy = PLAY_TOP + h.y * CELL + CELL / 2;
    const hr = CELL * 0.44;
    const angle = Math.atan2(dir.y, dir.x);
    ctx.fillStyle = PALETTE.head;
    ctx.beginPath();
    ctx.ellipse(hx, hy, hr, hr * 0.84, angle, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#4a2e05";
    ctx.lineWidth = 0.9;
    ctx.stroke();
    if (paperArt) {
      paperArt.drawSegmentPaperGrain(ctx, {
        cx: hx,
        cy: hy,
        rx: hr,
        ry: hr * 0.84,
        angle: angle,
        segmentId: h.id || 0,
        frame: frame,
      });
    }
    const ex1x = hx + Math.cos(angle + 0.5) * hr * 0.55;
    const ex1y = hy + Math.sin(angle + 0.5) * hr * 0.55;
    const ex2x = hx + Math.cos(angle - 0.5) * hr * 0.55;
    const ex2y = hy + Math.sin(angle - 0.5) * hr * 0.55;
    ctx.fillStyle = PALETTE.eye;
    ctx.beginPath();
    ctx.arc(ex1x, ex1y, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex2x, ex2y, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PALETTE.pupil;
    ctx.beginPath();
    ctx.arc(ex1x + Math.cos(angle) * 0.8, ex1y + Math.sin(angle) * 0.8, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex2x + Math.cos(angle) * 0.8, ex2y + Math.sin(angle) * 0.8, 1.2, 0, Math.PI * 2);
    ctx.fill();
    if (frame % 18 < 9) {
      const tail = snake[len - 1];
      const preTail = len > 1 ? snake[len - 2] : null;
      const tailAngle = preTail
        ? Math.atan2(tail.y - preTail.y, tail.x - preTail.x)
        : Math.atan2(-dir.y, -dir.x);
      const tailX = tail.x * CELL + CELL / 2;
      const tailY = PLAY_TOP + tail.y * CELL + CELL / 2;
      const baseX = tailX + Math.cos(tailAngle) * CELL * 0.22;
      const baseY = tailY + Math.sin(tailAngle) * CELL * 0.22;
      const plumeLen = CELL * 0.2 + Math.sin(frame * 0.6) * CELL * 0.05;

      ctx.strokeStyle = "#5f3110";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(baseX + Math.cos(tailAngle + 0.24) * plumeLen, baseY + Math.sin(tailAngle + 0.24) * plumeLen);
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(baseX + Math.cos(tailAngle - 0.24) * plumeLen, baseY + Math.sin(tailAngle - 0.24) * plumeLen);
      ctx.stroke();

      ctx.fillStyle = "#8b3a0f";
      ctx.beginPath();
      ctx.arc(
        baseX + Math.cos(tailAngle) * (plumeLen + 1.5),
        baseY + Math.sin(tailAngle) * (plumeLen + 1.5),
        1.6,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  function drawSnake() {
    if (characterMode !== "snake") {
      drawWorm();
      return;
    }
    const len = snake.length;
    if (len === 0) return;

    const centers = snake.map(function (segment) {
      return {
        x: segment.x * CELL + CELL / 2,
        y: PLAY_TOP + segment.y * CELL + CELL / 2
      };
    });

    const heading = len > 1
      ? Math.atan2(centers[0].y - centers[1].y, centers[0].x - centers[1].x)
      : Math.atan2(dir.y, dir.x);
    const dx = Math.cos(heading);
    const dy = Math.sin(heading);
    const sx = -dy;
    const sy = dx;

    if (len > 1) {
      const headBack = {
        x: centers[0].x - dx * CELL * 0.3,
        y: centers[0].y - dy * CELL * 0.3
      };
      const bodyControl = [headBack].concat(centers.slice(1));
      const spine = buildSnakeSpine(bodyControl, 4);
      if (spine.length > 1) {
        const left = [];
        const right = [];
        const normals = [];
        const radii = [];
        const last = spine.length - 1;
        const neckR = CELL * 0.34;
        const tailR = CELL * 0.11;

        for (let i = 0; i <= last; i++) {
          const prev = spine[Math.max(0, i - 1)];
          const next = spine[Math.min(last, i + 1)];
          let tx = next.x - prev.x;
          let ty = next.y - prev.y;
          const mag = Math.hypot(tx, ty) || 1;
          tx /= mag;
          ty /= mag;
          const nx = -ty;
          const ny = tx;
          const t = i / Math.max(1, last);
          const taper = Math.pow(1 - t, 0.72);
          const r = tailR + (neckR - tailR) * taper;
          normals.push({ x: nx, y: ny });
          radii.push(r);
          left.push({ x: spine[i].x + nx * r, y: spine[i].y + ny * r });
          right.push({ x: spine[i].x - nx * r, y: spine[i].y - ny * r });
        }

        ctx.fillStyle = "rgba(10, 5, 2, 0.3)";
        ctx.beginPath();
        ctx.moveTo(left[0].x + 2, left[0].y + 3);
        for (let i = 1; i < left.length; i++) ctx.lineTo(left[i].x + 2, left[i].y + 3);
        for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i].x + 2, right[i].y + 3);
        ctx.closePath();
        ctx.fill();

        const bodyGrad = ctx.createLinearGradient(spine[0].x, spine[0].y, spine[last].x, spine[last].y);
        bodyGrad.addColorStop(0, "#b89756");
        bodyGrad.addColorStop(0.35, "#9d7a3d");
        bodyGrad.addColorStop(1, "#714f23");
        ctx.fillStyle = bodyGrad;
        ctx.strokeStyle = "#4e3417";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(left[0].x, left[0].y);
        for (let i = 1; i < left.length; i++) ctx.lineTo(left[i].x, left[i].y);
        for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(spine[0].x, spine[0].y);
        for (let i = 1; i < spine.length; i++) ctx.lineTo(spine[i].x, spine[i].y);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "rgba(63, 35, 12, 0.64)";
        ctx.lineWidth = CELL * 0.14;
        ctx.stroke();
        ctx.strokeStyle = "rgba(229, 192, 127, 0.28)";
        ctx.lineWidth = CELL * 0.06;
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(left[0].x, left[0].y);
        for (let i = 1; i < left.length; i++) ctx.lineTo(left[i].x, left[i].y);
        for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
        ctx.closePath();
        ctx.clip();

        for (let i = 3; i < spine.length - 4; i += 3) {
          const n = normals[i];
          const r = radii[i];
          const prev = spine[i - 1];
          const next = spine[i + 1];
          let tx = next.x - prev.x;
          let ty = next.y - prev.y;
          const mag = Math.hypot(tx, ty) || 1;
          tx /= mag;
          ty /= mag;

          const phase = i / Math.max(1, last);
          const jitter = Math.sin(i * 1.73) * r * 0.22;
          const cx = spine[i].x + n.x * jitter;
          const cy = spine[i].y + n.y * jitter;
          const major = r * (0.96 - phase * 0.18);
          const minor = r * (0.5 + 0.1 * Math.sin(i * 0.77));

          ctx.fillStyle = "rgba(77, 46, 19, 0.34)";
          ctx.beginPath();
          ctx.moveTo(cx + tx * major, cy + ty * major);
          ctx.lineTo(cx + n.x * minor, cy + n.y * minor);
          ctx.lineTo(cx - tx * major, cy - ty * major);
          ctx.lineTo(cx - n.x * minor, cy - n.y * minor);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "rgba(168, 131, 74, 0.17)";
          ctx.beginPath();
          ctx.moveTo(cx + tx * major * 0.5, cy + ty * major * 0.5);
          ctx.lineTo(cx + n.x * minor * 0.45, cy + n.y * minor * 0.45);
          ctx.lineTo(cx - tx * major * 0.5, cy - ty * major * 0.5);
          ctx.lineTo(cx - n.x * minor * 0.45, cy - n.y * minor * 0.45);
          ctx.closePath();
          ctx.fill();

          for (let side = -1; side <= 1; side += 2) {
            if (((i + side) % 4) !== 0) continue;
            const bx = spine[i].x + n.x * side * r * 0.62 + tx * Math.sin(i * 0.9) * r * 0.14;
            const by = spine[i].y + n.y * side * r * 0.62 + ty * Math.sin(i * 1.1) * r * 0.12;
            ctx.fillStyle = "rgba(59, 34, 14, 0.25)";
            ctx.beginPath();
            ctx.ellipse(
              bx,
              by,
              r * 0.34,
              r * 0.18,
              Math.atan2(ty, tx) + side * 0.45,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }

        ctx.restore();

        const tail = spine[last];
        const tailPrev = spine[last - 1];
        const tailAngle = Math.atan2(tail.y - tailPrev.y, tail.x - tailPrev.x);
        const tx = Math.cos(tailAngle);
        const ty = Math.sin(tailAngle);
        const tnx = -ty;
        const tny = tx;
        const tailTipLen = CELL * 0.24;
        const tailBaseR = Math.max(CELL * 0.06, radii[last] * 0.75);
        ctx.fillStyle = "#6b4820";
        ctx.beginPath();
        ctx.moveTo(tail.x + tx * tailTipLen, tail.y + ty * tailTipLen);
        ctx.lineTo(tail.x + tnx * tailBaseR, tail.y + tny * tailBaseR);
        ctx.lineTo(tail.x - tnx * tailBaseR, tail.y - tny * tailBaseR);
        ctx.closePath();
        ctx.fill();
      }
    }

    const hx = centers[0].x;
    const hy = centers[0].y;
    const hrx = CELL * 0.5;
    const hry = CELL * 0.38;
    const snoutX = hx + dx * hrx * 0.55;
    const snoutY = hy + dy * hrx * 0.55;
    const headGrad = ctx.createRadialGradient(snoutX, snoutY, hrx * 0.12, hx, hy, hrx * 1.2);
    headGrad.addColorStop(0, "#d7bb7c");
    headGrad.addColorStop(0.55, "#b38b47");
    headGrad.addColorStop(1, "#805b29");
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(hx, hy, hrx, hry, heading, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#4c2f14";
    ctx.lineWidth = 1.15;
    ctx.stroke();

    ctx.fillStyle = "rgba(247, 230, 187, 0.34)";
    ctx.beginPath();
    ctx.ellipse(
      hx - dx * hrx * 0.15 + sx * hrx * 0.16,
      hy - dy * hrx * 0.15 + sy * hrx * 0.16,
      hrx * 0.25,
      hry * 0.17,
      heading - 0.3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    const eyeForward = 0.18;
    const eyeSide = 0.34;
    const eyeLift = 0.12;
    const eyeRadius = Math.max(2, CELL * 0.08);
    const pupilRadius = Math.max(1, eyeRadius * 0.48);
    ctx.fillStyle = "#f7efda";
    for (let side = -1; side <= 1; side += 2) {
      const ex = hx + dx * hrx * eyeForward + sx * hrx * eyeSide * side;
      const ey = hy + dy * hrx * eyeForward + sy * hrx * eyeSide * side - eyeLift;
      ctx.beginPath();
      ctx.arc(ex, ey, eyeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1e1308";
      ctx.beginPath();
      ctx.arc(ex + dx * pupilRadius * 0.8, ey + dy * pupilRadius * 0.8, pupilRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(ex + 0.45, ey - 0.8, Math.max(0.6, pupilRadius * 0.34), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f7efda";
    }

    const noseForward = hrx * 0.72;
    const noseSide = hrx * 0.12;
    ctx.fillStyle = "rgba(36, 20, 8, 0.7)";
    ctx.beginPath();
    ctx.arc(hx + dx * noseForward + sx * noseSide, hy + dy * noseForward + sy * noseSide, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hx + dx * noseForward - sx * noseSide, hy + dy * noseForward - sy * noseSide, 1.2, 0, Math.PI * 2);
    ctx.fill();

    if (frame % 18 < 7) {
      const tongueBaseX = hx + dx * hrx * 0.86;
      const tongueBaseY = hy + dy * hrx * 0.86;
      const tongueLen = CELL * 0.3 + Math.sin(frame * 0.75) * CELL * 0.03;
      const forkSpread = CELL * 0.08;
      ctx.strokeStyle = "#8f2f2b";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(tongueBaseX, tongueBaseY);
      ctx.lineTo(tongueBaseX + dx * tongueLen + sx * forkSpread, tongueBaseY + dy * tongueLen + sy * forkSpread);
      ctx.moveTo(tongueBaseX, tongueBaseY);
      ctx.lineTo(tongueBaseX + dx * tongueLen - sx * forkSpread, tongueBaseY + dy * tongueLen - sy * forkSpread);
      ctx.stroke();
    }
  }

  function drawParticles() {
    for (const p of particles) {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawDeathOverlay() {
    ctx.fillStyle = "rgba(80,10,0,0.6)";
    ctx.fillRect(0, PLAY_TOP, canvas.width, PLAY_HEIGHT);
    const midY = PLAY_TOP + PLAY_HEIGHT / 2;
    ctx.fillStyle = PALETTE.death;
    ctx.font = "bold 48px Trebuchet MS, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("DEAD", canvas.width / 2, midY - 24);
    ctx.fillStyle = PALETTE.textDim;
    ctx.font = "bold 20px Consolas, monospace";
    ctx.fillText("Score " + score, canvas.width / 2, midY + 26);
    renderPaperOverlay();
  }

  function drawIdle() {
    const modeConfig = getCharacterModeConfig();
    drawGrid();
    ctx.fillStyle = "rgba(30,17,8,0.72)";
    ctx.fillRect(0, PLAY_TOP, canvas.width, PLAY_HEIGHT);
    const midY = PLAY_TOP + PLAY_HEIGHT / 2;
    ctx.fillStyle = PALETTE.text;
    ctx.font = "bold 62px Trebuchet MS, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(modeConfig.idleTitle, canvas.width / 2, midY - 40);
    ctx.fillStyle = PALETTE.textDim;
    ctx.font = "bold 24px Consolas, monospace";
    ctx.fillText(modeConfig.idleSubtitle, canvas.width / 2, midY + 8);
    ctx.fillText("select and press start", canvas.width / 2, midY + 44);
    renderPaperOverlay();
  }

  function drawPauseOverlay() {
    ctx.fillStyle = "rgba(30,17,8,0.6)";
    ctx.fillRect(0, PLAY_TOP, canvas.width, PLAY_HEIGHT);
    const midY = PLAY_TOP + PLAY_HEIGHT / 2;
    ctx.fillStyle = PALETTE.text;
    ctx.font = "bold 42px Trebuchet MS, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PAUSED", canvas.width / 2, midY);
  }

  function drawPerkTutorialOverlay() {
    if (!tutorialPerkKey) return;
    const meta = perkMetaByKey(tutorialPerkKey);
    if (!meta) return;
    const panelW = Math.min(canvas.width * 0.78, 520);
    const panelH = Math.min(canvas.height * 0.5, 300);
    const x = (canvas.width - panelW) / 2;
    const y = PLAY_TOP + (PLAY_HEIGHT - panelH) / 2;
    ctx.fillStyle = "rgba(20, 10, 5, 0.76)";
    ctx.fillRect(0, PLAY_TOP, canvas.width, PLAY_HEIGHT);
    ctx.fillStyle = "rgba(32, 14, 7, 0.96)";
    ctx.strokeStyle = "rgba(255, 232, 193, 0.42)";
    ctx.lineWidth = 2;
    if (typeof ctx.roundRect === "function") {
      ctx.beginPath();
      ctx.roundRect(x, y, panelW, panelH, 14);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(x, y, panelW, panelH);
      ctx.strokeRect(x, y, panelW, panelH);
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = PALETTE.textDim;
    ctx.font = "bold 17px Consolas, monospace";
    ctx.fillText("NEW PERK DISCOVERED", canvas.width / 2, y + 34);
    ctx.font = "bold 54px serif";
    ctx.fillText(meta.icon, canvas.width / 2, y + 88);
    ctx.fillStyle = PALETTE.text;
    ctx.font = "bold 34px Trebuchet MS, sans-serif";
    ctx.fillText(meta.label, canvas.width / 2, y + 138);
    ctx.fillStyle = PALETTE.textDim;
    ctx.font = "bold 17px Consolas, monospace";
    ctx.fillText(meta.desc, canvas.width / 2, y + 178);
    ctx.fillText(meta.tip, canvas.width / 2, y + 208);
    ctx.fillStyle = "rgba(255, 232, 193, 0.85)";
    ctx.font = "bold 14px Consolas, monospace";
    ctx.fillText("Auto-resuming...", canvas.width / 2, y + panelH - 24);
  }

  function drawRoundIntroOverlay() {
    const now = Date.now();
    const seconds = Math.max(1, Math.ceil((roundIntroUntil - now) / 1000));
    if (seconds !== roundIntroLastSecond) {
      roundIntroLastSecond = seconds;
      playSfxCountdownBang(seconds);
    }
    const midY = PLAY_TOP + PLAY_HEIGHT / 2;
    ctx.fillStyle = "rgba(28, 10, 16, 0.72)";
    ctx.fillRect(0, PLAY_TOP, canvas.width, PLAY_HEIGHT);
    ctx.fillStyle = PALETTE.text;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 34px Trebuchet MS, sans-serif";
    ctx.fillText(roundIntroIsLevelUp ? "ROUND CLEAR" : "GET READY", canvas.width / 2, midY - 62);
    ctx.font = "bold 28px Consolas, monospace";
    ctx.fillText(roundIntroLabel, canvas.width / 2, midY - 20);
    ctx.font = "bold 72px Trebuchet MS, sans-serif";
    ctx.fillText(String(seconds), canvas.width / 2, midY + 52);
  }

  function draw() {
    drawGrid();
    drawFood();
    drawSnake();
    drawParticles();
    if (gameState === "paused") drawPauseOverlay();
    if (gameState === "round_intro") drawRoundIntroOverlay();
    if (gameState === "perk_tutorial") drawPerkTutorialOverlay();
    renderPaperOverlay();
  }

  btnStart.addEventListener("click", startGame);
  if (btnSelect) {
    btnSelect.addEventListener("click", function () {
      showCharacterSelect();
    });
  }
  if (btnLaunch) {
    btnLaunch.addEventListener("click", function () {
      startGame();
    });
  }
  btnPause.addEventListener("click", pauseGame);
  btnMode.addEventListener("click", function () {
    cycleControlMode(true);
  });
  btnHelp.addEventListener("click", function () {
    if (gameState === "help") closeHelpOverlay();
    else openHelpOverlay();
  });
  btnHelpClose.addEventListener("click", function () {
    closeHelpOverlay();
  });
  btnRestart.addEventListener("click", function () {
    resetGame();
    startGame();
  });

  startOptions.forEach(function (input) {
    input.addEventListener("change", function () {
      applyCharacterMode(input.value);
      if (gameState === "idle" || gameState === "dead") {
        drawIdle();
      }
    });
  });

  document.querySelectorAll(".dpad button[data-dir]").forEach(function (btn) {
    const press = function (event) {
      event.preventDefault();
      ensureAudio();
      btn.classList.add("is-active");
      const d = DIRS[btn.dataset.dir];
      applyDirectionalControl(d);
      setTimeout(function () {
        btn.classList.remove("is-active");
      }, 90);
    };
    btn.addEventListener("click", press);
    btn.addEventListener("touchstart", press, { passive: false });
  });

  let pointerStart = null;
  canvas.addEventListener("pointerdown", function (event) {
    ensureAudio();
    pointerStart = { x: event.clientX, y: event.clientY };
    if (gameState === "idle" || gameState === "dead") {
      startGame();
    }
  });
  canvas.addEventListener("pointerup", function (event) {
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) > 18) {
      if (absX > absY) applyDirectionalControl(dx > 0 ? DIRS.R : DIRS.L);
      else applyDirectionalControl(dy > 0 ? DIRS.D : DIRS.U);
    }
    pointerStart = null;
  });
  canvas.addEventListener("pointercancel", function () {
    pointerStart = null;
  });

  document.addEventListener("keydown", function (e) {
    ensureAudio();
    if (gameState === "help") {
      if (e.key === "Escape" || (e.key && e.key.toLowerCase() === "h")) {
        e.preventDefault();
        closeHelpOverlay();
      }
      return;
    }
    if (gameState === "perk_tutorial") {
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        dismissPerkTutorial();
      }
      return;
    }
    if (e.key && e.key.toLowerCase() === "h") {
      e.preventDefault();
      openHelpOverlay();
      return;
    }
    if (e.key === "1") {
      e.preventDefault();
      setControlMode("direct", true);
      return;
    }
    if (e.key === "2") {
      e.preventDefault();
      setControlMode("steer", true);
      return;
    }
    if (e.key && e.key.toLowerCase() === "c") {
      e.preventDefault();
      cycleControlMode(true);
      return;
    }
    if (!SHOW_DPAD_BY_DEFAULT && e.key && e.key.toLowerCase() === "v") {
      e.preventDefault();
      setDpadVisible(!dpadVisible, true);
      return;
    }
    const map = {
      ArrowUp: "U",
      ArrowDown: "D",
      ArrowLeft: "L",
      ArrowRight: "R",
      w: "U",
      s: "D",
      a: "L",
      d: "R",
    };
    if (map[e.key]) {
      e.preventDefault();
      applyDirectionalControl(DIRS[map[e.key]]);
    }
    if (e.code === "Space") {
      e.preventDefault();
      if (gameState === "idle" || gameState === "dead") startGame();
      else pauseGame();
    }
  });

  window.addEventListener("resize", function () {
    applyPerkHudLayout();
    if (paperRuntime) paperRuntime.onResize();
  });

  init();
})();
