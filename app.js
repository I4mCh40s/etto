const sourceCanvas = document.querySelector("#sourceCanvas");
const outputCanvas = document.querySelector("#outputCanvas");
const soloCanvas = document.querySelector("#soloCanvas");
const sourceVideo = document.querySelector("#sourceVideo");
const watermarkImage = new Image();
const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
const outputCtx = outputCanvas.getContext("2d", { willReadFrequently: true });
const soloCtx = soloCanvas.getContext("2d", { willReadFrequently: true });
let shaderRenderer = null;

const controls = {
  imageInput: document.querySelector("#imageInput"),
  videoInput: document.querySelector("#videoInput"),
  imageModeButton: document.querySelector("#imageModeButton"),
  videoModeButton: document.querySelector("#videoModeButton"),
  invertButton: document.querySelector("#invertButton"),
  resetButton: document.querySelector("#resetButton"),
  presetSelect: document.querySelector("#presetSelect"),
  applyPreset: document.querySelector("#applyPreset"),
  algorithmSelect: document.querySelector("#algorithmSelect"),
  paletteSelect: document.querySelector("#paletteSelect"),
  effectSelect: document.querySelector("#effectSelect"),
  addEffect: document.querySelector("#addEffect"),
  effectStack: document.querySelector("#effectStack"),
  effectEditorsPanel: document.querySelector("#effectEditorsPanel"),
  effectEditors: document.querySelector("#effectEditors"),
  resolution: document.querySelector("#resolution"),
  threshold: document.querySelector("#threshold"),
  patternSize: document.querySelector("#patternSize"),
  errorStrength: document.querySelector("#errorStrength"),
  phase: document.querySelector("#phase"),
  depth: document.querySelector("#depth"),
  brightness: document.querySelector("#brightness"),
  contrast: document.querySelector("#contrast"),
  seedInput: document.querySelector("#seedInput"),
  randomizeButton: document.querySelector("#randomizeButton"),
  applySeedButton: document.querySelector("#applySeedButton"),
  copySeedButton: document.querySelector("#copySeedButton"),
  seedTools: document.querySelector("#seedTools"),
  seedHistory: document.querySelector("#seedHistory"),
  seedHistoryEmpty: document.querySelector("#seedHistoryEmpty"),
  clearSeedHistory: document.querySelector("#clearSeedHistory"),
  blur: document.querySelector("#blur"),
  extractPalette: document.querySelector("#extractPalette"),
  exportPng: document.querySelector("#exportPng"),
  exportJpg: document.querySelector("#exportJpg"),
  exportSvg: document.querySelector("#exportSvg"),
  batchExport: document.querySelector("#batchExport"),
  exportVideo: document.querySelector("#exportVideo"),
  exportAnimation: document.querySelector("#exportAnimation"),
  animationDuration: document.querySelector("#animationDuration"),
  lossless: document.querySelector("#lossless"),
  compareButton: document.querySelector("#compareButton"),
  processedButton: document.querySelector("#processedButton"),
  sourceButton: document.querySelector("#sourceButton"),
  compareWrap: document.querySelector("#compareWrap"),
  playButton: document.querySelector("#playButton"),
  timeline: document.querySelector("#timeline"),
  timecode: document.querySelector("#timecode"),
  sourceMeta: document.querySelector("#sourceMeta"),
  palettePreview: document.querySelector("#palettePreview"),
  statusText: document.querySelector("#statusText"),
  renderMeta: document.querySelector("#renderMeta"),
  exportMeta: document.querySelector("#exportMeta"),
};

const algorithms = [
  ["floyd", "Floyd-Steinberg", "Error Diffusion"],
  ["jarvis", "Jarvis-Judice-Ninke", "Error Diffusion"],
  ["stucki", "Stucki", "Error Diffusion"],
  ["atkinson", "Atkinson", "Error Diffusion"],
  ["burkes", "Burkes", "Error Diffusion"],
  ["sierra", "Sierra", "Error Diffusion"],
  ["two-row-sierra", "Two-Row Sierra", "Error Diffusion"],
  ["sierra-lite", "Sierra Lite", "Error Diffusion"],
  ["false-floyd", "False Floyd-Steinberg", "Error Diffusion"],
  ["fan", "Fan", "Error Diffusion"],
  ["shiau-fan", "Shiau-Fan", "Error Diffusion"],
  ["stevenson-arce", "Stevenson-Arce", "Error Diffusion"],
  ["simple", "Simple Diffusion", "Error Diffusion"],
  ["diagonal", "Diagonal Diffusion", "Error Diffusion"],
  ["serpentine", "Serpentine Floyd", "Error Diffusion"],
  ["bayer2", "Bayer 2x2", "Ordered"],
  ["bayer4", "Bayer 4x4", "Ordered"],
  ["bayer8", "Bayer 8x8", "Ordered"],
  ["cluster", "Cluster Dot", "Ordered"],
  ["blue-noise", "Blue Noise", "Ordered"],
  ["dots", "Dot Pattern", "Pattern"],
  ["brick", "Brick Pattern", "Pattern"],
  ["cross", "Cross Hatch", "Pattern"],
  ["waves", "Wave Pattern", "Pattern"],
  ["rings", "Ring Pattern", "Pattern"],
  ["stairs", "Stair Pattern", "Pattern"],
  ["mesh", "Mesh Pattern", "Pattern"],
  ["weave", "Weave Pattern", "Pattern"],
  ["jpeg-shift", "JPEG Shift", "Glitch"],
  ["rgb-split", "RGB Split Dither", "Glitch"],
  ["column-drift", "Column Drift", "Glitch"],
  ["row-tear", "Row Tear", "Glitch"],
  ["datamosh", "Datamosh Blocks", "Glitch"],
  ["bitcrush", "Bitcrush", "Glitch"],
  ["xor", "XOR Scramble", "Glitch"],
  ["moire", "Moire Crawl", "Glitch"],
  ["scan-drift", "Scan Drift", "Glitch"],
  ["poster-jump", "Poster Jump", "Glitch"],
  ["channel-sort", "Channel Sort", "Glitch"],
  ["raster-slip", "Raster Slip", "Glitch"],
  ["pixel-storm", "Pixel Storm", "Glitch"],
  ["burn", "Signal Burn", "Glitch"],
  ["phase-crush", "Phase Crush", "Glitch"],
  ["block-wave", "Block Wave", "Glitch"],
  ["tape-warp", "Tape Warp", "Glitch"],
  ["halftone", "CMYK Halftone", "Special"],
  ["newspaper", "Newspaper", "Special"],
  ["lcd", "LCD Grid", "Special"],
  ["handheld", "Handheld Green", "Special"],
  ["threshold", "Hard Threshold", "Special"],
  ["poster", "Poster Levels", "Special"],
  ["solar", "Solar Dither", "Special"],
  ["duotone", "Duotone Grain", "Special"],
  ["contour", "Contour Bands", "Special"],
  ["stipple", "Stipple", "Special"],
  ["ascii", "Glyph Block", "Special"],
  ["embroidery", "Embroidery Black", "Special"],
  ["print-plate", "Print Plate", "Special"],
  ["radial", "Radial Shade", "Special"],
  ["slab", "Slab Bitmap", "Special"],
  ["ghost-grid", "Ghost Grid", "Special"],
  ["poster-noise", "Poster Noise", "Special"],
  ["epsilon", "Epsilon Glow Dither", "Epsilon Glow"],
];

const palettes = {
  "Game Console": ["#0f0f1a", "#31405f", "#698c6d", "#d9cb8d", "#fff7d6"],
  "Handheld Green": ["#081820", "#346856", "#88c070", "#e0f8d0"],
  "Arcade Pop": ["#10131f", "#eb3b5a", "#fa8231", "#f7d794", "#45aaf2", "#26de81", "#f8f8f2"],
  "Mono Ink": ["#0b0d0e", "#393f45", "#87919a", "#f8f5eb"],
  "Bubblegum CRT": ["#17111f", "#6d3b9c", "#e86aa8", "#ffc6df", "#f7f1ff"],
  "Reference CRT": ["#050408", "#160b24", "#241636", "#0d2a4b", "#25b8d7", "#f24ba8", "#fff8fb"],
  "VHS Ghost": ["#05040a", "#17112c", "#262053", "#0f6a88", "#e24486", "#73f7e6", "#fff7fb"],
  "Amber Terminal": ["#050300", "#1d1100", "#5a3200", "#b86d13", "#ffd37a", "#fff4d1"],
  "Arcade Poster": ["#050814", "#13213f", "#ff2d55", "#ffcc00", "#00d084", "#00a8ff", "#fff8e8"],
  "Print CMYK": ["#0c1012", "#00aeef", "#ec008c", "#fff200", "#f7f5ed"],
  "Warm Poster": ["#141414", "#703c32", "#c65f46", "#f0b46f", "#fff0c2"],
  "Extracted": ["#101311", "#3a443f", "#9ade67", "#ff7ab6"],
};

const bayer2 = [
  [0, 2],
  [3, 1],
];
const bayer4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];
const bayer8 = [
  [0, 48, 12, 60, 3, 51, 15, 63],
  [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55],
  [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61],
  [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53],
  [42, 26, 38, 22, 41, 25, 37, 21],
];

let state = {
  mode: "image",
  view: "compare",
  sourceImage: null,
  sourceName: "sample",
  imageFiles: [],
  videoUrl: null,
  effects: [{ type: "epsilon", amount: 0.55 }],
  selectedEffectIndex: 0,
  raf: null,
  isExportingVideo: false,
  isExportingAnimation: false,
  invertColors: false,
  isApplyingRecipe: false,
  seedHistory: [],
  pendingSeedHistoryLabel: "",
  supporterUnlocked: true,
  currentRecipeSeed: "",
  watermarkReady: false,
  videoExportSize: null,
};

const recipePrefix = "ETTO1-";
const seedHistoryLimit = 8;
const seedHistoryStorageKey = "etto.seedHistory";
const panelStorageKey = "etto.collapsedPanels";
const videoExportMaxLandscape = { width: 1280, height: 720 };
const videoExportMaxPortrait = { width: 720, height: 1280 };
const videoExportFps = 12;
const defaultCollapsedPanels = new Set(["preset", "algorithm", "color"]);
const shaderEffectTypes = new Set(["film", "gradient", "ascii-shader", "light-leak", "prism"]);

function init() {
  populateSelects();
  bindEvents();
  initCollapsiblePanels();
  loadSeedHistory();
  loadWatermark();
  drawSample();
  renderEffectStack();
  renderSeedHistory();
  updatePalettePreview();
  syncSeedToSettings();
  updateSeedGate();
  scheduleRender();
}

function loadWatermark() {
  watermarkImage.onload = () => {
    state.watermarkReady = true;
  };
  watermarkImage.src = "etto.png";
}

function populateSelects() {
  const groups = new Map();
  algorithms.forEach(([value, label, group]) => {
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push({ value, label });
  });

  groups.forEach((items, label) => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = label;
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.label;
      optgroup.append(option);
    });
    controls.algorithmSelect.append(optgroup);
  });

  Object.keys(palettes).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    controls.paletteSelect.append(option);
  });
}

function initCollapsiblePanels() {
  const saved = readJson(panelStorageKey, {});
  document.querySelectorAll(".sidebar > .panel").forEach((panel) => {
    const heading = panel.querySelector(":scope > .panel-heading");
    const title = heading?.querySelector("h2")?.textContent?.trim() || "Panel";
    if (!heading) return;

    const key = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "collapse-toggle";
    button.title = `Collapse ${title}`;
    button.setAttribute("aria-label", `Collapse ${title}`);
    heading.append(button);
    panel.classList.add("collapsible-panel");
    panel.dataset.panelKey = key;

    const savedValue = saved[key];
    const collapsed = typeof savedValue === "boolean" ? savedValue : defaultCollapsedPanels.has(key);
    setPanelCollapsed(panel, collapsed, false);

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      setPanelCollapsed(panel, !panel.classList.contains("collapsed-panel"));
    });

    heading.addEventListener("click", (event) => {
      if (event.target.closest("button, input, select, label, a")) return;
      setPanelCollapsed(panel, !panel.classList.contains("collapsed-panel"));
    });
  });
}

function setPanelCollapsed(panel, collapsed, persist = true) {
  const button = panel.querySelector(":scope > .panel-heading .collapse-toggle");
  const title = panel.querySelector(":scope > .panel-heading h2")?.textContent?.trim() || "Panel";
  panel.classList.toggle("collapsed-panel", collapsed);
  if (button) {
    button.textContent = collapsed ? "+" : "-";
    button.title = `${collapsed ? "Expand" : "Collapse"} ${title}`;
    button.setAttribute("aria-label", `${collapsed ? "Expand" : "Collapse"} ${title}`);
    button.setAttribute("aria-expanded", String(!collapsed));
  }
  if (!persist) return;

  const saved = readJson(panelStorageKey, {});
  saved[panel.dataset.panelKey] = collapsed;
  writeJson(panelStorageKey, saved);
}

function bindEvents() {
  controls.imageInput.addEventListener("change", handleImages);
  controls.videoInput.addEventListener("change", handleVideo);
  controls.invertButton.addEventListener("click", toggleInvert);
  controls.resetButton.addEventListener("click", resetWorkspace);
  controls.applyPreset.addEventListener("click", applyPreset);
  controls.randomizeButton.addEventListener("click", randomizeSeed);
  controls.applySeedButton.addEventListener("click", () => applySeedRecipe(controls.seedInput.value));
  controls.copySeedButton.addEventListener("click", copySeed);
  controls.clearSeedHistory.addEventListener("click", clearSeedHistory);
  controls.seedInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") applySeedRecipe(controls.seedInput.value);
  });
  controls.imageModeButton.addEventListener("click", () => setMode("image"));
  controls.videoModeButton.addEventListener("click", () => setMode("video"));
  controls.extractPalette.addEventListener("click", extractPalette);
  controls.addEffect.addEventListener("click", addEffect);
  controls.exportPng.addEventListener("click", () => exportRaster("image/png"));
  controls.exportJpg.addEventListener("click", () => exportRaster("image/jpeg"));
  controls.exportSvg.addEventListener("click", exportSvg);
  controls.batchExport.addEventListener("click", batchExport);
  controls.exportVideo.addEventListener("click", exportVideo);
  controls.exportAnimation.addEventListener("click", exportAnimation);
  controls.compareButton.addEventListener("click", () => setView("compare"));
  controls.processedButton?.addEventListener("click", () => setView("processed"));
  controls.sourceButton?.addEventListener("click", () => setView("source"));
  controls.playButton.addEventListener("click", togglePlayback);
  controls.timeline.addEventListener("input", seekVideo);
  sourceVideo.addEventListener("loadedmetadata", updateVideoMeta);
  sourceVideo.addEventListener("timeupdate", updateVideoMeta);
  sourceVideo.addEventListener("play", videoLoop);
  sourceVideo.addEventListener("pause", () => {
    controls.playButton.textContent = ">";
  });

  [
    controls.algorithmSelect,
    controls.paletteSelect,
    controls.resolution,
    controls.threshold,
    controls.patternSize,
    controls.errorStrength,
    controls.phase,
    controls.depth,
    controls.brightness,
    controls.contrast,
    controls.blur,
    controls.lossless,
  ].forEach((control) => {
    control.addEventListener("input", () => {
      updatePalettePreview();
      syncSeedToSettings();
      scheduleRender();
    });
  });
}

function drawSample() {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#241536");
  gradient.addColorStop(0.42, "#267b87");
  gradient.addColorStop(1, "#f1cf73");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += 18) {
    ctx.fillStyle = `rgba(255,255,255,${0.03 + (y / canvas.height) * 0.08})`;
    ctx.fillRect(0, y, canvas.width, 3);
  }

  ctx.fillStyle = "#ef476f";
  ctx.beginPath();
  ctx.arc(250, 230, 130, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#06d6a0";
  ctx.fillRect(500, 160, 260, 260);
  ctx.fillStyle = "#f8ffe5";
  ctx.font = "900 116px system-ui";
  ctx.fillText("ETTO", 278, 385);
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 16;
  ctx.strokeRect(96, 82, 760, 470);

  const image = new Image();
  image.onload = () => {
    state.sourceImage = image;
    state.sourceName = "sample";
    controls.sourceMeta.textContent = "960 x 640 sample";
    scheduleRender();
  };
  image.src = canvas.toDataURL("image/png");
}

function setMode(mode) {
  state.mode = mode;
  controls.imageModeButton.classList.toggle("active", mode === "image");
  controls.videoModeButton.classList.toggle("active", mode === "video");
  controls.statusText.textContent = mode === "video" ? "Video mode uses the current frame for live preview." : "Image mode ready.";
  scheduleRender();
}

function setView(view) {
  state.view = view;
  controls.compareButton.classList.toggle("active", view === "compare");
  controls.processedButton?.classList.toggle("active", view === "processed");
  controls.sourceButton?.classList.toggle("active", view === "source");
  controls.compareWrap.classList.toggle("hidden", view !== "compare");
  soloCanvas.classList.toggle("hidden", view === "compare");
  drawSolo();
}

function handleImages(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  state.imageFiles = files;
  loadImageFile(files[0]);
  setMode("image");
}

function loadImageFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      state.sourceImage = image;
      state.sourceName = file.name.replace(/\.[^.]+$/, "");
      controls.sourceMeta.textContent = `${image.naturalWidth} x ${image.naturalHeight}`;
      scheduleRender();
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function handleVideo(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (state.videoUrl) URL.revokeObjectURL(state.videoUrl);
  state.videoUrl = URL.createObjectURL(file);
  sourceVideo.src = state.videoUrl;
  state.sourceName = file.name.replace(/\.[^.]+$/, "");
  setMode("video");
  sourceVideo.load();
}

function toggleInvert() {
  state.invertColors = !state.invertColors;
  updateInvertButton();
  controls.statusText.textContent = state.invertColors ? "Invert colors enabled." : "Invert colors disabled.";
  syncSeedToSettings();
  scheduleRender();
}

function updateInvertButton() {
  controls.invertButton.classList.toggle("active-toggle", state.invertColors);
}

function resetWorkspace() {
  if (sourceVideo && !sourceVideo.paused) sourceVideo.pause();
  controls.algorithmSelect.value = "floyd";
  controls.paletteSelect.value = "Game Console";
  controls.effectSelect.value = "epsilon";
  controls.resolution.value = "0.65";
  controls.threshold.value = "132";
  controls.patternSize.value = "1";
  controls.errorStrength.value = "0.95";
  controls.phase.value = "0";
  controls.depth.value = "4";
  controls.brightness.value = "0";
  controls.contrast.value = "18";
  controls.blur.value = "0.75";
  controls.animationDuration.value = "5";
  controls.lossless.checked = true;
  state.effects = [];
  state.selectedEffectIndex = -1;
  state.invertColors = false;
  updateInvertButton();
  setView("compare");
  updatePalettePreview();
  renderEffectStack();
  syncSeedToSettings();
  controls.statusText.textContent = "Reset controls and removed effects.";
  scheduleRender();
}

function applyPreset() {
  const preset = controls.presetSelect.value;
  if (preset === "reference-crt") {
    controls.algorithmSelect.value = "bayer8";
    controls.paletteSelect.value = "Reference CRT";
    controls.resolution.value = "0.75";
    controls.threshold.value = "76";
    controls.patternSize.value = "0.65";
    controls.errorStrength.value = "0.7";
    controls.phase.value = "24";
    controls.depth.value = "7";
    controls.brightness.value = "-26";
    controls.contrast.value = "68";
    controls.blur.value = "1.25";
    state.effects = [
      { type: "trail", amount: 0.82 },
      { type: "bloom", amount: 0.95 },
      { type: "chromatic", amount: 0.72 },
      { type: "scanlines", amount: 0.62 },
      { type: "noise", amount: 0.28 },
      { type: "vignette", amount: 0.78 },
    ];
    controls.statusText.textContent = "Applied Reference CRT Trail preset.";
  } else if (preset === "handheld-crt") {
    controls.algorithmSelect.value = "handheld";
    controls.paletteSelect.value = "Handheld Green";
    controls.resolution.value = "0.62";
    controls.threshold.value = "112";
    controls.patternSize.value = "1.15";
    controls.errorStrength.value = "0.9";
    controls.depth.value = "4";
    controls.brightness.value = "-8";
    controls.contrast.value = "42";
    controls.blur.value = "0.5";
    state.effects = [
      { type: "epsilon", amount: 0.5 },
      { type: "scanlines", amount: 0.5 },
      { type: "vignette", amount: 0.42 },
    ];
    controls.statusText.textContent = "Applied Handheld CRT preset.";
  } else if (preset === "vhs-ghost") {
    controls.algorithmSelect.value = "row-tear";
    controls.paletteSelect.value = "VHS Ghost";
    controls.resolution.value = "0.78";
    controls.threshold.value = "88";
    controls.patternSize.value = "0.8";
    controls.errorStrength.value = "1.25";
    controls.phase.value = "38";
    controls.depth.value = "7";
    controls.brightness.value = "-18";
    controls.contrast.value = "55";
    controls.blur.value = "1";
    state.effects = [
      { type: "trail", amount: 0.68 },
      { type: "chromatic", amount: 0.92 },
      { type: "jpeg", amount: 0.42 },
      { type: "scanlines", amount: 0.54 },
      { type: "noise", amount: 0.36 },
      { type: "vignette", amount: 0.58 },
    ];
    controls.statusText.textContent = "Applied VHS Ghost preset.";
  } else if (preset === "amber-terminal") {
    controls.algorithmSelect.value = "ascii";
    controls.paletteSelect.value = "Amber Terminal";
    controls.resolution.value = "0.7";
    controls.threshold.value = "118";
    controls.patternSize.value = "1.35";
    controls.errorStrength.value = "0.55";
    controls.phase.value = "12";
    controls.depth.value = "5";
    controls.brightness.value = "-34";
    controls.contrast.value = "84";
    controls.blur.value = "0.65";
    state.effects = [
      { type: "bloom", amount: 0.58 },
      { type: "scanlines", amount: 0.72 },
      { type: "noise", amount: 0.18 },
      { type: "vignette", amount: 0.82 },
    ];
    controls.statusText.textContent = "Applied Amber Terminal preset.";
  } else if (preset === "arcade-poster") {
    controls.algorithmSelect.value = "poster";
    controls.paletteSelect.value = "Arcade Poster";
    controls.resolution.value = "0.9";
    controls.threshold.value = "164";
    controls.patternSize.value = "2.2";
    controls.errorStrength.value = "0.35";
    controls.phase.value = "0";
    controls.depth.value = "7";
    controls.brightness.value = "6";
    controls.contrast.value = "76";
    controls.blur.value = "0";
    state.effects = [
      { type: "cmyk", amount: 0.38 },
      { type: "epsilon", amount: 0.28 },
      { type: "noise", amount: 0.08 },
    ];
    controls.statusText.textContent = "Applied Arcade Poster preset.";
  } else if (preset === "analog-dream") {
    controls.algorithmSelect.value = "solar";
    controls.paletteSelect.value = "Warm Poster";
    controls.resolution.value = "0.82";
    controls.threshold.value = "146";
    controls.patternSize.value = "1.4";
    controls.errorStrength.value = "0.4";
    controls.phase.value = "64";
    controls.depth.value = "5";
    controls.brightness.value = "2";
    controls.contrast.value = "46";
    controls.blur.value = "0.25";
    state.effects = [
      { type: "film", amount: 0.82 },
      { type: "light-leak", amount: 0.56 },
      { type: "bloom", amount: 0.35 },
      { type: "noise", amount: 0.18 },
    ];
    controls.statusText.textContent = "Applied Analog Dream preset.";
  } else if (preset === "gradient-oracle") {
    controls.algorithmSelect.value = "contour";
    controls.paletteSelect.value = "Bubblegum CRT";
    controls.resolution.value = "0.88";
    controls.threshold.value = "118";
    controls.patternSize.value = "1.8";
    controls.errorStrength.value = "0.25";
    controls.phase.value = "112";
    controls.depth.value = "5";
    controls.brightness.value = "-6";
    controls.contrast.value = "72";
    controls.blur.value = "0";
    state.effects = [
      { type: "gradient", amount: 0.9 },
      { type: "prism", amount: 0.42 },
      { type: "vignette", amount: 0.35 },
    ];
    controls.statusText.textContent = "Applied Gradient Oracle preset.";
  } else if (preset === "matrix-bloom") {
    controls.algorithmSelect.value = "ascii";
    controls.paletteSelect.value = "Handheld Green";
    controls.resolution.value = "0.72";
    controls.threshold.value = "96";
    controls.patternSize.value = "1";
    controls.errorStrength.value = "0.62";
    controls.phase.value = "20";
    controls.depth.value = "4";
    controls.brightness.value = "-18";
    controls.contrast.value = "88";
    controls.blur.value = "0.2";
    state.effects = [
      { type: "ascii-shader", amount: 0.88 },
      { type: "gradient", amount: 0.38 },
      { type: "bloom", amount: 0.58 },
      { type: "scanlines", amount: 0.5 },
    ];
    controls.statusText.textContent = "Applied Matrix Bloom preset.";
  }
  state.selectedEffectIndex = state.effects.length ? 0 : -1;
  updatePalettePreview();
  renderEffectStack();
  syncSeedToSettings();
  scheduleRender();
}

function randomizeSeed() {
  const seed = createReadableSeed();
  state.pendingSeedHistoryLabel = "Randomized";
  applySeedRecipe(seed);
}

function applySeedRecipe(seedValue) {
  const seed = normalizeSeed(seedValue);
  const recipe = decodeRecipeSeed(seed);
  state.isApplyingRecipe = true;

  if (recipe) {
    applySettingsRecipe(recipe);
    state.isApplyingRecipe = false;
    updateInvertButton();
    updatePalettePreview();
    renderEffectStack();
    syncSeedToSettings();
    controls.statusText.textContent = "Applied recipe seed.";
    state.pendingSeedHistoryLabel ||= "Applied";
    scheduleRender();
    return;
  }

  if (seed.startsWith(recipePrefix)) {
    state.isApplyingRecipe = false;
    controls.statusText.textContent = "That recipe seed could not be read.";
    return;
  }

  const rng = mulberry32(hashSeed(seed));
  const paletteNames = Object.keys(palettes).filter((name) => name !== "Extracted");
  const algorithmIds = algorithms.map(([id]) => id);
  const effectTypes = [
    "epsilon",
    "blur",
    "trail",
    "bloom",
    "jpeg",
    "chromatic",
    "scanlines",
    "vignette",
    "noise",
    "cmyk",
    "film",
    "gradient",
    "ascii-shader",
    "light-leak",
    "prism",
  ];

  controls.algorithmSelect.value = pick(rng, algorithmIds);
  controls.paletteSelect.value = pick(rng, paletteNames);
  controls.resolution.value = fixed(0.52 + rng() * 0.43, 2);
  controls.threshold.value = String(Math.round(48 + rng() * 154));
  controls.patternSize.value = fixed(0.55 + rng() * 2.85, 1);
  controls.errorStrength.value = fixed(0.2 + rng() * 1.12, 2);
  controls.phase.value = String(Math.round(rng() * 360));
  controls.depth.value = String(2 + Math.floor(rng() * 7));
  controls.brightness.value = String(Math.round(-42 + rng() * 70));
  controls.contrast.value = String(Math.round(18 + rng() * 82));
  controls.blur.value = fixed(rng() * 1.75, 2);
  state.invertColors = rng() > 0.78;

  const shuffledEffects = shuffle(effectTypes, rng);
  const count = 3 + Math.floor(rng() * 4);
  state.effects = shuffledEffects.slice(0, count).map((type) => ({
    type,
    amount: Number(fixed(0.18 + rng() * 1.05, 2)),
    params: randomEffectParams(type, rng),
  }));
  state.selectedEffectIndex = state.effects.length ? 0 : -1;
  state.isApplyingRecipe = false;

  updateInvertButton();
  updatePalettePreview();
  renderEffectStack();
  syncSeedToSettings();
  controls.statusText.textContent = `Randomized from ${seed}.`;
  state.pendingSeedHistoryLabel ||= "Randomized";
  scheduleRender();
}

async function copySeed() {
  syncSeedToSettings();
  const seed = state.currentRecipeSeed;
  try {
    await navigator.clipboard.writeText(seed);
    controls.statusText.textContent = "Copied recipe seed.";
  } catch {
    controls.statusText.textContent = "Recipe seed is ready to copy.";
  }
  addSeedHistoryFromCanvas("Copied");
}

function updateSeedGate(message) {
  controls.seedTools.classList.remove("locked-tools");
  controls.seedInput.disabled = false;
  controls.applySeedButton.disabled = false;
  controls.copySeedButton.disabled = false;
  controls.clearSeedHistory.disabled = false;
  updateSeedInputDisplay();
  renderSeedHistory();
}

function updateSeedInputDisplay() {
  controls.seedInput.value = state.currentRecipeSeed;
}

function loadSeedHistory() {
  const saved = readJson(seedHistoryStorageKey, []);
  state.seedHistory = Array.isArray(saved)
    ? saved.filter((entry) => entry?.seed && entry?.preview).slice(0, seedHistoryLimit)
    : [];
}

function clearSeedHistory() {
  state.seedHistory = [];
  writeJson(seedHistoryStorageKey, state.seedHistory);
  renderSeedHistory();
  controls.statusText.textContent = "Seed history cleared.";
}

function capturePendingSeedHistory() {
  if (!state.pendingSeedHistoryLabel) return;
  if (!outputCanvas.width || state.isExportingAnimation || state.isExportingVideo) return;
  addSeedHistoryFromCanvas(state.pendingSeedHistoryLabel);
  state.pendingSeedHistoryLabel = "";
}

function addSeedHistoryFromCanvas(label) {
  const seed = state.currentRecipeSeed;
  if (!seed || !outputCanvas.width) return;

  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    seed,
    label,
    source: state.sourceName || "sample",
    preview: createSeedPreview(),
    createdAt: Date.now(),
  };

  state.seedHistory = [entry, ...state.seedHistory.filter((item) => item.seed !== seed)].slice(0, seedHistoryLimit);
  writeJson(seedHistoryStorageKey, state.seedHistory);
  renderSeedHistory();
}

function createSeedPreview() {
  const preview = document.createElement("canvas");
  const maxWidth = 120;
  const maxHeight = 78;
  const scale = Math.min(maxWidth / outputCanvas.width, maxHeight / outputCanvas.height);
  const width = Math.max(1, Math.round(outputCanvas.width * scale));
  const height = Math.max(1, Math.round(outputCanvas.height * scale));
  preview.width = maxWidth;
  preview.height = maxHeight;
  const ctx = preview.getContext("2d");
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, preview.width, preview.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(outputCanvas, Math.round((maxWidth - width) / 2), Math.round((maxHeight - height) / 2), width, height);
  return preview.toDataURL("image/jpeg", 0.72);
}

function renderSeedHistory() {
  controls.seedHistory.innerHTML = "";
  controls.seedHistoryEmpty.textContent = "Randomize or copy a seed to save a preview.";
  controls.seedHistoryEmpty.classList.toggle("hidden", state.seedHistory.length > 0);

  state.seedHistory.forEach((entry, index) => {
    const item = document.createElement("article");
    item.className = "seed-history-item";
    item.title = "Apply this seed";
    item.addEventListener("click", () => {
      controls.seedInput.value = entry.seed;
      state.pendingSeedHistoryLabel = "";
      applySeedRecipe(entry.seed);
    });

    const image = document.createElement("img");
    image.src = entry.preview;
    image.alt = "";

    const meta = document.createElement("div");
    meta.className = "seed-history-meta";
    const title = document.createElement("strong");
    title.textContent = entry.label || `Seed ${index + 1}`;
    const detail = document.createElement("span");
    detail.textContent = seedSummary(entry.seed);
    meta.append(title, detail);

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "mini-button";
    copy.textContent = "Copy";
    copy.addEventListener("click", async (event) => {
      event.stopPropagation();
      controls.seedInput.value = entry.seed;
      try {
        await navigator.clipboard.writeText(entry.seed);
        controls.statusText.textContent = "Copied history seed.";
      } catch {
        controls.statusText.textContent = "History seed is ready to copy.";
      }
    });

    item.append(image, meta, copy);
    controls.seedHistory.append(item);
  });
}

function seedSummary(seed) {
  if (seed.startsWith(recipePrefix)) return `${seed.slice(0, 18)}...`;
  return seed;
}

function syncSeedToSettings() {
  if (state.isApplyingRecipe) return;
  state.currentRecipeSeed = encodeRecipeSeed(readSettingsRecipe());
  updateSeedInputDisplay();
}

function readSettingsRecipe() {
  const recipe = {
    v: 1,
    a: controls.algorithmSelect.value,
    p: controls.paletteSelect.value,
    r: controls.resolution.value,
    t: controls.threshold.value,
    z: controls.patternSize.value,
    e: controls.errorStrength.value,
    h: controls.phase.value,
    d: controls.depth.value,
    b: controls.brightness.value,
    c: controls.contrast.value,
    g: controls.blur.value,
    i: state.invertColors ? 1 : 0,
    o: controls.lossless.checked ? 1 : 0,
    fx: state.effects.map((effect) => [effect.type, Number(effect.amount), effect.params || {}]),
  };

  if (recipe.p === "Extracted") {
    recipe.x = palettes.Extracted;
  }

  return recipe;
}

function applySettingsRecipe(recipe) {
  if (Array.isArray(recipe.x)) {
    palettes.Extracted = recipe.x.filter((color) => /^#[0-9a-f]{6}$/i.test(color)).slice(0, 8);
  }

  setSelectValue(controls.algorithmSelect, recipe.a, "floyd");
  setSelectValue(controls.paletteSelect, recipe.p, "Game Console");
  setControlValue(controls.resolution, recipe.r);
  setControlValue(controls.threshold, recipe.t);
  setControlValue(controls.patternSize, recipe.z);
  setControlValue(controls.errorStrength, recipe.e);
  setControlValue(controls.phase, recipe.h);
  setControlValue(controls.depth, recipe.d);
  setControlValue(controls.brightness, recipe.b);
  setControlValue(controls.contrast, recipe.c);
  setControlValue(controls.blur, recipe.g);
  controls.lossless.checked = recipe.o !== 0;
  state.invertColors = recipe.i === 1;

  const validEffectTypes = new Set([
    "epsilon",
    "blur",
    "trail",
    "bloom",
    "jpeg",
    "chromatic",
    "scanlines",
    "vignette",
    "noise",
    "cmyk",
    "film",
    "gradient",
    "ascii-shader",
    "light-leak",
    "prism",
  ]);
  state.effects = Array.isArray(recipe.fx)
    ? recipe.fx
        .map(([type, amount, params]) => ({
          type,
          amount: Number(amount),
          params: sanitizeEffectParams(type, params),
        }))
        .filter((effect) => validEffectTypes.has(effect.type) && Number.isFinite(effect.amount))
    : [];
  state.selectedEffectIndex = state.effects.length ? 0 : -1;
}

function setSelectValue(control, value, fallback) {
  const hasValue = Array.from(control.options).some((option) => option.value === value);
  control.value = hasValue ? value : fallback;
}

function setControlValue(control, value) {
  if (value === undefined || value === null) return;
  control.value = String(value);
}

function encodeRecipeSeed(recipe) {
  return `${recipePrefix}${base64UrlEncode(JSON.stringify(recipe))}`;
}

function decodeRecipeSeed(seed) {
  if (!seed.startsWith(recipePrefix)) return null;
  try {
    return JSON.parse(base64UrlDecode(seed.slice(recipePrefix.length)));
  } catch {
    controls.statusText.textContent = "That recipe seed could not be read.";
    return null;
  }
}

function base64UrlEncode(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can fail in private windows or when thumbnails fill the quota.
  }
}

function createReadableSeed() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let seed = "ETTO-";
  for (let i = 0; i < 8; i++) {
    seed += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return seed;
}

function normalizeSeed(seedValue) {
  const raw = String(seedValue || "").trim();
  if (raw.startsWith(recipePrefix)) return raw;
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9-]/g, "");
  return cleaned || createReadableSeed();
}

function hashSeed(seed) {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  return () => {
    let value = seed += 0x6d2b79f5;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function pick(rng, items) {
  return items[Math.floor(rng() * items.length)];
}

function shuffle(items, rng) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function fixed(value, places) {
  return value.toFixed(places).replace(/\.?0+$/, "");
}

function updateVideoMeta() {
  if (!Number.isFinite(sourceVideo.duration)) return;
  controls.timeline.value = String((sourceVideo.currentTime / sourceVideo.duration) * 1000 || 0);
  controls.timecode.textContent = formatTime(sourceVideo.currentTime);
  controls.sourceMeta.textContent = `${sourceVideo.videoWidth || 0} x ${sourceVideo.videoHeight || 0}`;
  scheduleRender();
}

function togglePlayback() {
  if (state.mode !== "video" || !sourceVideo.src) return;
  if (sourceVideo.paused) {
    sourceVideo.play();
    controls.playButton.textContent = "||";
  } else {
    sourceVideo.pause();
  }
}

function seekVideo() {
  if (!Number.isFinite(sourceVideo.duration)) return;
  sourceVideo.currentTime = (Number(controls.timeline.value) / 1000) * sourceVideo.duration;
}

function videoLoop() {
  if (sourceVideo.paused || sourceVideo.ended) return;
  controls.phase.value = String((Number(controls.phase.value) + 2) % 361);
  if (state.isExportingVideo) {
    render({ fullResolution: true });
  } else {
    scheduleRender();
  }
  requestAnimationFrame(videoLoop);
}

function scheduleRender() {
  if (state.raf) cancelAnimationFrame(state.raf);
  state.raf = requestAnimationFrame(render);
}

function render(options = {}) {
  const started = performance.now();
  state.raf = null;
  const source = getDrawableSource();
  if (!source) return;

  const fullResolution = options.fullResolution ?? (state.isExportingVideo || state.isExportingAnimation);
  const maxSide = controls.lossless.checked ? 1200 : 900;
  const scale = fullResolution ? 1 : Number(controls.resolution.value);
  const naturalWidth = source.videoWidth || source.naturalWidth || source.width;
  const naturalHeight = source.videoHeight || source.naturalHeight || source.height;
  const videoExportSize = (state.isExportingVideo || state.isExportingAnimation) ? state.videoExportSize : null;
  const fit = fullResolution ? 1 : Math.min(1, maxSide / Math.max(naturalWidth, naturalHeight));
  const width = videoExportSize?.width || Math.max(16, Math.round(naturalWidth * fit * scale));
  const height = videoExportSize?.height || Math.max(16, Math.round(naturalHeight * fit * scale));

  sourceCanvas.width = width;
  sourceCanvas.height = height;
  outputCanvas.width = width;
  outputCanvas.height = height;
  sourceCtx.drawImage(source, 0, 0, width, height);
  applySourceInvert(width, height);

  const imageData = sourceCtx.getImageData(0, 0, width, height);
  applyPreAdjustments(imageData);
  const processed = applyAlgorithm(imageData);
  applyEffectStackToOutput(processed, width, height);
  drawSolo();

  const elapsed = Math.round(performance.now() - started);
  controls.renderMeta.textContent = `${elapsed} ms`;
  controls.exportMeta.textContent = `${width} x ${height}`;
  capturePendingSeedHistory();
}

function getVideoExportSize(naturalWidth, naturalHeight) {
  const width = Math.max(16, Number(naturalWidth) || 16);
  const height = Math.max(16, Number(naturalHeight) || 16);
  const limit = height > width ? videoExportMaxPortrait : videoExportMaxLandscape;
  const scale = Math.min(1, limit.width / width, limit.height / height);
  return {
    width: evenVideoDimension(width * scale),
    height: evenVideoDimension(height * scale),
  };
}

function evenVideoDimension(value) {
  const dimension = Math.max(16, Math.floor(value));
  return dimension % 2 === 0 ? dimension : dimension - 1;
}

function describeVideoExportSize(size) {
  return `${size.width} x ${size.height}`;
}

function getDrawableSource() {
  if (state.mode === "video" && sourceVideo.readyState >= 2) return sourceVideo;
  return state.sourceImage;
}

function applySourceInvert(width, height) {
  if (!state.invertColors) return;
  const imageData = sourceCtx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  sourceCtx.putImageData(imageData, 0, 0);
}

function applyPreAdjustments(imageData) {
  const data = imageData.data;
  const brightness = Number(controls.brightness.value);
  const contrast = Number(controls.contrast.value);
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(factor * (data[i] - 128) + 128 + brightness);
    data[i + 1] = clamp(factor * (data[i + 1] - 128) + 128 + brightness);
    data[i + 2] = clamp(factor * (data[i + 2] - 128) + 128 + brightness);
  }
}

function applyAlgorithm(imageData) {
  const id = controls.algorithmSelect.value;
  if (id.startsWith("bayer") || ["cluster", "blue-noise"].includes(id)) return orderedDither(imageData, id);
  if (["dots", "brick", "cross", "waves", "rings", "stairs", "mesh", "weave", "halftone", "newspaper", "lcd", "handheld", "threshold", "poster", "solar", "duotone", "contour", "stipple", "ascii", "embroidery", "print-plate", "radial", "slab", "ghost-grid", "poster-noise", "epsilon"].includes(id)) {
    return patternDither(imageData, id);
  }
  if (["jpeg-shift", "rgb-split", "column-drift", "row-tear", "datamosh", "bitcrush", "xor", "moire", "scan-drift", "poster-jump", "channel-sort", "raster-slip", "pixel-storm", "burn", "phase-crush", "block-wave", "tape-warp"].includes(id)) {
    return glitchDither(imageData, id);
  }
  return diffusionDither(imageData, id);
}

function diffusionDither(imageData, id) {
  const { width, height } = imageData;
  const source = new Float32Array(imageData.data.length);
  for (let i = 0; i < imageData.data.length; i++) source[i] = imageData.data[i];
  const out = new ImageData(width, height);
  const palette = activePalette();
  const kernel = diffusionKernel(id);
  const strength = Number(controls.errorStrength.value);
  const serpentine = id === "serpentine";

  for (let y = 0; y < height; y++) {
    const reverse = serpentine && y % 2 === 1;
    for (let xx = 0; xx < width; xx++) {
      const x = reverse ? width - 1 - xx : xx;
      const idx = (y * width + x) * 4;
      const oldColor = [source[idx], source[idx + 1], source[idx + 2]];
      const next = nearestPalette(oldColor, palette);
      out.data[idx] = next[0];
      out.data[idx + 1] = next[1];
      out.data[idx + 2] = next[2];
      out.data[idx + 3] = imageData.data[idx + 3];
      const error = [oldColor[0] - next[0], oldColor[1] - next[1], oldColor[2] - next[2]];

      kernel.forEach(([dx, dy, weight]) => {
        const tx = reverse ? x - dx : x + dx;
        const ty = y + dy;
        if (tx < 0 || tx >= width || ty < 0 || ty >= height) return;
        const t = (ty * width + tx) * 4;
        source[t] += error[0] * weight * strength;
        source[t + 1] += error[1] * weight * strength;
        source[t + 2] += error[2] * weight * strength;
      });
    }
  }
  return out;
}

function diffusionKernel(id) {
  const kernels = {
    floyd: [[1, 0, 7 / 16], [-1, 1, 3 / 16], [0, 1, 5 / 16], [1, 1, 1 / 16]],
    jarvis: [[1, 0, 7 / 48], [2, 0, 5 / 48], [-2, 1, 3 / 48], [-1, 1, 5 / 48], [0, 1, 7 / 48], [1, 1, 5 / 48], [2, 1, 3 / 48], [-2, 2, 1 / 48], [-1, 2, 3 / 48], [0, 2, 5 / 48], [1, 2, 3 / 48], [2, 2, 1 / 48]],
    stucki: [[1, 0, 8 / 42], [2, 0, 4 / 42], [-2, 1, 2 / 42], [-1, 1, 4 / 42], [0, 1, 8 / 42], [1, 1, 4 / 42], [2, 1, 2 / 42], [-2, 2, 1 / 42], [-1, 2, 2 / 42], [0, 2, 4 / 42], [1, 2, 2 / 42], [2, 2, 1 / 42]],
    atkinson: [[1, 0, 1 / 8], [2, 0, 1 / 8], [-1, 1, 1 / 8], [0, 1, 1 / 8], [1, 1, 1 / 8], [0, 2, 1 / 8]],
    burkes: [[1, 0, 8 / 32], [2, 0, 4 / 32], [-2, 1, 2 / 32], [-1, 1, 4 / 32], [0, 1, 8 / 32], [1, 1, 4 / 32], [2, 1, 2 / 32]],
    sierra: [[1, 0, 5 / 32], [2, 0, 3 / 32], [-2, 1, 2 / 32], [-1, 1, 4 / 32], [0, 1, 5 / 32], [1, 1, 4 / 32], [2, 1, 2 / 32], [-1, 2, 2 / 32], [0, 2, 3 / 32], [1, 2, 2 / 32]],
    "two-row-sierra": [[1, 0, 4 / 16], [2, 0, 3 / 16], [-2, 1, 1 / 16], [-1, 1, 2 / 16], [0, 1, 3 / 16], [1, 1, 2 / 16], [2, 1, 1 / 16]],
    "sierra-lite": [[1, 0, 2 / 4], [-1, 1, 1 / 4], [0, 1, 1 / 4]],
    "false-floyd": [[1, 0, 3 / 8], [0, 1, 3 / 8], [1, 1, 2 / 8]],
    fan: [[1, 0, 6 / 16], [-1, 1, 3 / 16], [0, 1, 5 / 16], [1, 1, 2 / 16]],
    "shiau-fan": [[1, 0, 4 / 8], [-1, 1, 1 / 8], [0, 1, 2 / 8], [1, 1, 1 / 8]],
    "stevenson-arce": [[2, 0, 32 / 200], [-3, 1, 12 / 200], [-1, 1, 26 / 200], [1, 1, 30 / 200], [3, 1, 16 / 200], [-2, 2, 12 / 200], [0, 2, 26 / 200], [2, 2, 12 / 200], [-3, 3, 5 / 200], [-1, 3, 12 / 200], [1, 3, 12 / 200], [3, 3, 5 / 200]],
    simple: [[1, 0, 1 / 2], [0, 1, 1 / 2]],
    diagonal: [[1, 1, 1]],
  };
  return kernels[id] || kernels.floyd;
}

function orderedDither(imageData, id) {
  const { width, height, data } = imageData;
  const out = new ImageData(width, height);
  const palette = activePalette();
  const matrix = id === "bayer2" ? bayer2 : id === "bayer8" || id === "blue-noise" ? bayer8 : bayer4;
  const size = matrix.length;
  const max = size * size;
  const threshold = Number(controls.threshold.value);
  const phase = Number(controls.phase.value) / 360;
  const patternScale = Number(controls.patternSize.value);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const px = Math.floor(x / patternScale);
      const py = Math.floor(y / patternScale);
      const noise = id === "blue-noise" ? seededNoise(px, py, phase) * 255 : ((matrix[py % size][px % size] + 0.5) / max - 0.5) * threshold;
      const color = [data[idx] + noise, data[idx + 1] + noise, data[idx + 2] + noise];
      const next = nearestPalette(color, palette);
      writePixel(out.data, idx, next, data[idx + 3]);
    }
  }
  return out;
}

function patternDither(imageData, id) {
  const { width, height, data } = imageData;
  const out = new ImageData(width, height);
  const palette = activePalette();
  const threshold = Number(controls.threshold.value);
  const phase = Number(controls.phase.value) * Math.PI / 180;
  const patternScale = Number(controls.patternSize.value);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const lum = luminance(data[idx], data[idx + 1], data[idx + 2]);
      const pattern = patternValue(id, x / patternScale, y / patternScale, phase, width / patternScale, height / patternScale);
      const adjusted = lum + (pattern - 0.5) * threshold;
      const shade = clamp(adjusted);
      const base = [shade, shade, shade];
      const color = id === "handheld" ? nearestPalette(base, hexPalette(palettes["Handheld Green"])) : nearestPalette(base, palette);
      writePixel(out.data, idx, color, data[idx + 3]);
    }
  }
  return out;
}

function patternValue(id, x, y, phase, width = 800, height = 520) {
  switch (id) {
    case "dots":
    case "halftone":
    case "newspaper":
      return (Math.sin(x * 0.45 + phase) + Math.sin(y * 0.45 - phase) + 2) / 4;
    case "brick":
      return ((Math.floor(x / 9) + Math.floor((y + (Math.floor(x / 18) % 2) * 8) / 16)) % 2) ? 0.72 : 0.28;
    case "cross":
      return (Math.sin((x + y) * 0.28 + phase) + Math.sin((x - y) * 0.28 - phase) + 2) / 4;
    case "waves":
    case "moire":
      return (Math.sin(x * 0.12 + Math.sin(y * 0.08 + phase) * 4) + 1) / 2;
    case "rings":
    case "radial": {
      const dx = x - width / 2;
      const dy = y - height / 2;
      return (Math.sin(Math.sqrt(dx * dx + dy * dy) * 0.13 + phase) + 1) / 2;
    }
    case "mesh":
      return ((x % 12 < 2) || (y % 12 < 2)) ? 0.2 : 0.7;
    case "weave":
      return ((x + Math.floor(y / 6) * 3) % 18 < 9) ? 0.35 : 0.65;
    case "lcd":
      return ((x % 3) / 3) * 0.7 + 0.15;
    case "poster":
      return Math.floor(((x + y) % 48) / 12) / 4;
    case "solar":
      return (Math.sin((x * y) * 0.0009 + phase) + 1) / 2;
    case "contour":
      return Math.floor((Math.sin((x + y) * 0.04) + 1) * 4) / 8;
    case "stipple":
      return seededNoise(x, y, phase);
    case "ascii":
    case "slab":
      return ((Math.floor(x / 8) + Math.floor(y / 12)) % 2) ? 0.22 : 0.78;
    case "embroidery":
    case "print-plate":
      return (Math.sin(x * 0.3 + phase) > Math.cos(y * 0.3 - phase)) ? 0.3 : 0.8;
    case "ghost-grid":
      return (((x + 3) % 18 < 3) || ((y + 7) % 18 < 3)) ? 0.18 : (Math.sin((x + y) * 0.06 + phase) + 1) / 2;
    case "poster-noise":
      return Math.floor((seededNoise(x, y, phase) + Math.sin((x - y) * 0.05)) * 3) / 4;
    case "epsilon":
      return (Math.sin(x * 0.22 + phase) * Math.cos(y * 0.2 - phase) + 1) / 2;
    default:
      return ((x + y) % 2) ? 0.35 : 0.65;
  }
}

function glitchDither(imageData, id) {
  const base = orderedDither(imageData, id === "rgb-split" ? "bayer4" : "blue-noise");
  const { width, height, data } = base;
  const copy = new Uint8ClampedArray(data);
  const phase = Number(controls.phase.value) / 18;
  const strength = Number(controls.errorStrength.value);

  for (let y = 0; y < height; y++) {
    const drift = Math.round(Math.sin(y * 0.08 + phase) * 18 * strength);
    const tear = id === "row-tear" || id === "raster-slip" ? (y % 31 < 4 ? drift * 3 : drift) : drift;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const sx = wrap(x + tear + glitchOffset(id, x, y, phase, strength), width);
      const sidx = (y * width + sx) * 4;
      data[idx] = copy[sidx];
      data[idx + 1] = copy[id === "rgb-split" ? (y * width + wrap(sx + 5, width)) * 4 + 1 : sidx + 1];
      data[idx + 2] = copy[id === "rgb-split" ? (y * width + wrap(sx - 5, width)) * 4 + 2 : sidx + 2];
      data[idx + 3] = copy[sidx + 3];
      if (id === "bitcrush" || id === "poster-jump") {
        data[idx] = data[idx] & 224;
        data[idx + 1] = data[idx + 1] & 224;
        data[idx + 2] = data[idx + 2] & 224;
      }
      if (id === "xor") {
        data[idx] = data[idx] ^ (x & 32);
        data[idx + 1] = data[idx + 1] ^ (y & 64);
      }
    }
  }
  return base;
}

function glitchOffset(id, x, y, phase, strength) {
  if (id === "datamosh" || id === "block-wave") return Math.floor(Math.sin(Math.floor(y / 16) + phase) * 20 * strength);
  if (id === "pixel-storm") return Math.floor((seededNoise(x, y, phase) - 0.5) * 20 * strength);
  if (id === "tape-warp") return Math.floor(Math.sin(y * 0.025 + phase) * Math.sin(y * 0.007) * 34 * strength);
  if (id === "column-drift" || id === "channel-sort") return Math.floor(Math.sin(x * 0.04 + phase) * 10 * strength);
  if (id === "burn" || id === "phase-crush") return Math.floor(Math.cos((x + y) * 0.03 + phase) * 8 * strength);
  return 0;
}

function applyEffectStackToOutput(imageData, width, height) {
  outputCtx.putImageData(imageData, 0, 0);
  const context = effectControlContext();

  state.effects.forEach((effect) => {
    if (shaderEffectTypes.has(effect.type)) {
      applySingleShaderEffectToOutput(width, height, effect, context);
      return;
    }

    const current = outputCtx.getImageData(0, 0, width, height);
    const effected = applyCpuEffect(current, effect, context);
    if (effected !== current) outputCtx.putImageData(effected, 0, 0);
  });

  const blurAmount = Number(controls.blur.value);
  if (blurAmount > 0) {
    outputCtx.putImageData(blurImage(outputCtx.getImageData(0, 0, width, height), blurAmount), 0, 0);
  }
}

function applyCpuEffect(imageData, effect, context) {
  const amount = adjustedEffectAmount(effect, context);
  if (effect.type === "epsilon") return epsilonGlow(imageData, amount);
  if (effect.type === "blur") return blurImage(imageData, amount * 3 * context.patternSizeScale);
  if (effect.type === "trail") return signalTrail(imageData, amount);
  if (effect.type === "bloom") return phosphorBloom(imageData, amount);
  if (effect.type === "jpeg") return jpegGlitch(imageData, amount);
  if (effect.type === "chromatic") return chromaticAberration(imageData, amount);
  if (effect.type === "scanlines") return scanlines(imageData, amount);
  if (effect.type === "vignette") return vignette(imageData, amount);
  if (effect.type === "noise") return signalNoise(imageData, amount);
  if (effect.type === "cmyk") return cmykHalftone(imageData, amount);
  return imageData;
}

function applySingleShaderEffectToOutput(width, height, effect, context) {
  const amounts = shaderEffectAmounts(effect, context);
  if (!amounts.active) return;

  const renderer = getShaderRenderer();
  if (!renderer) return;

  const phase = Number(controls.phase.value) * Math.PI / 180;
  renderer.canvas.width = width;
  renderer.canvas.height = height;
  renderer.render(outputCanvas, sourceCanvas, width, height, phase, amounts, context);
  outputCtx.clearRect(0, 0, width, height);
  outputCtx.drawImage(renderer.canvas, 0, 0, width, height);
}

function shaderEffectAmounts(effect, context) {
  const amounts = {
    active: false,
    film: 0,
    gradient: 0,
    ascii: 0,
    leak: 0,
    prism: 0,
    asciiDensity: 0.75,
    asciiTileAspect: 0.58,
    asciiCharacterColor: [1, 1, 1],
    asciiBackgroundColor: [0, 0, 0],
    asciiInvert: 0,
    asciiOverlay: 0,
    asciiCutDarks: 0.03,
    asciiCutLights: 0,
    filmGrain: 0.55,
    filmWarmth: 0.45,
    gradientBias: 0.5,
    leakPosition: 0.5,
    prismDirection: 0.5,
  };

  const amount = adjustedEffectAmount(effect, context);
  if (effect.type === "film") {
    const params = sanitizeEffectParams(effect.type, effect.params);
    amounts.film = amount;
    amounts.filmGrain = params.grain;
    amounts.filmWarmth = params.warmth;
  } else if (effect.type === "gradient") {
    const params = sanitizeEffectParams(effect.type, effect.params);
    amounts.gradient = amount;
    amounts.gradientBias = params.bias;
  }
  else if (effect.type === "ascii-shader") {
    const params = sanitizeEffectParams(effect.type, effect.params);
    amounts.ascii = amount;
    amounts.asciiDensity = params.density;
    amounts.asciiTileAspect = params.tileAspect;
    amounts.asciiCharacterColor = hexToUnitRgb(params.characterColor);
    amounts.asciiBackgroundColor = hexToUnitRgb(params.backgroundColor);
    amounts.asciiInvert = params.invert ? 1 : 0;
    amounts.asciiOverlay = params.overlay ? 1 : 0;
    amounts.asciiCutDarks = params.cutDarks;
    amounts.asciiCutLights = params.cutLights;
  }
  else if (effect.type === "light-leak") {
    const params = sanitizeEffectParams(effect.type, effect.params);
    amounts.leak = amount;
    amounts.leakPosition = params.position;
  } else if (effect.type === "prism") {
    const params = sanitizeEffectParams(effect.type, effect.params);
    amounts.prism = amount;
    amounts.prismDirection = params.direction;
  }

  amounts.film = Math.min(1.5, amounts.film);
  amounts.gradient = Math.min(1.5, amounts.gradient);
  amounts.ascii = Math.min(1.5, amounts.ascii);
  amounts.leak = Math.min(1.5, amounts.leak);
  amounts.prism = Math.min(1.5, amounts.prism);
  amounts.active = amounts.film + amounts.gradient + amounts.ascii + amounts.leak + amounts.prism > 0;
  return amounts;
}

function effectControlContext() {
  const patternSize = Number(controls.patternSize.value) || 1;
  const threshold = Number(controls.threshold.value) || 132;
  const errorStrength = Number(controls.errorStrength.value) || 0.95;
  const depth = Number(controls.depth.value) || 4;
  const brightness = Number(controls.brightness.value) || 0;
  const contrast = Number(controls.contrast.value) || 0;
  return {
    patternSize,
    patternSizeScale: Math.max(0.25, Math.min(4, patternSize)),
    threshold,
    thresholdNorm: threshold / 255,
    errorStrength,
    depth,
    brightness,
    brightnessNorm: brightness / 100,
    contrast,
    contrastNorm: contrast / 100,
  };
}

function adjustedEffectAmount(effect, context) {
  const base = Math.max(0, Number(effect.amount) || 0);
  const params = sanitizeEffectParams(effect.type, effect.params);
  const detail = Number(params.detail) || 1;
  const byType = {
    epsilon: 0.82 + context.depth * 0.035 + Math.max(0, context.brightnessNorm) * 0.25,
    blur: 0.55 + context.patternSizeScale * 0.32,
    trail: 0.55 + context.errorStrength * 0.55 + context.patternSizeScale * 0.08,
    bloom: 0.75 + context.depth * 0.04 + Math.max(0, context.contrastNorm) * 0.18,
    jpeg: 0.48 + context.patternSizeScale * 0.26 + context.errorStrength * 0.24,
    chromatic: 0.58 + context.patternSizeScale * 0.22 + Math.max(0, context.contrastNorm) * 0.16,
    scanlines: 0.62 + context.patternSizeScale * 0.12 + Math.max(0, context.contrastNorm) * 0.18,
    vignette: 0.72 + Math.max(0, context.contrastNorm) * 0.24,
    noise: 0.35 + context.errorStrength * 0.7,
    cmyk: 0.52 + context.patternSizeScale * 0.2 + context.depth * 0.025,
    film: 0.65 + context.errorStrength * 0.28 + Math.max(0, context.contrastNorm) * 0.18,
    gradient: 0.7 + context.depth * 0.035 + Math.abs(context.brightnessNorm) * 0.1,
    "ascii-shader": 0.72 + context.errorStrength * 0.18 + Math.max(0, context.contrastNorm) * 0.12,
    "light-leak": 0.6 + Math.max(0, context.brightnessNorm) * 0.35,
    prism: 0.58 + context.patternSizeScale * 0.16 + context.errorStrength * 0.12,
  };
  return Math.max(0, Math.min(1.5, base * (byType[effect.type] || 1) * detail));
}

function getShaderRenderer() {
  if (shaderRenderer) return shaderRenderer;

  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
  });
  if (!gl) {
    controls.statusText.textContent = "WebGL effects are unavailable in this browser.";
    return null;
  }

  const program = createShaderProgram(gl, shaderVertexSource(), shaderFragmentSource());
  if (!program) return null;

  const position = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, position);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
  ]), gl.STATIC_DRAW);

  const texCoord = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoord);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 1,
    1, 1,
    0, 0,
    0, 0,
    1, 1,
    1, 0,
  ]), gl.STATIC_DRAW);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const sourceTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, sourceTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const asciiAtlas = createAsciiAtlas();
  const asciiTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, asciiTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asciiAtlas.canvas);

  shaderRenderer = {
    canvas,
    gl,
    program,
    texture,
    sourceTexture,
    asciiTexture,
    asciiCharCount: asciiAtlas.charCount,
    attributes: {
      position: gl.getAttribLocation(program, "a_position"),
      texCoord: gl.getAttribLocation(program, "a_texCoord"),
    },
    uniforms: {
      texture: gl.getUniformLocation(program, "u_texture"),
      sourceTexture: gl.getUniformLocation(program, "u_sourceTexture"),
      asciiAtlas: gl.getUniformLocation(program, "u_asciiAtlas"),
      asciiCharCount: gl.getUniformLocation(program, "u_asciiCharCount"),
      resolution: gl.getUniformLocation(program, "u_resolution"),
      phase: gl.getUniformLocation(program, "u_phase"),
      patternSize: gl.getUniformLocation(program, "u_patternSize"),
      threshold: gl.getUniformLocation(program, "u_threshold"),
      errorStrength: gl.getUniformLocation(program, "u_errorStrength"),
      depth: gl.getUniformLocation(program, "u_depth"),
      brightness: gl.getUniformLocation(program, "u_brightness"),
      contrast: gl.getUniformLocation(program, "u_contrast"),
      film: gl.getUniformLocation(program, "u_film"),
      filmGrain: gl.getUniformLocation(program, "u_filmGrain"),
      filmWarmth: gl.getUniformLocation(program, "u_filmWarmth"),
      gradient: gl.getUniformLocation(program, "u_gradient"),
      gradientBias: gl.getUniformLocation(program, "u_gradientBias"),
      ascii: gl.getUniformLocation(program, "u_ascii"),
      asciiDensity: gl.getUniformLocation(program, "u_asciiDensity"),
      asciiTileAspect: gl.getUniformLocation(program, "u_asciiTileAspect"),
      asciiCharacterColor: gl.getUniformLocation(program, "u_asciiCharacterColor"),
      asciiBackgroundColor: gl.getUniformLocation(program, "u_asciiBackgroundColor"),
      asciiInvert: gl.getUniformLocation(program, "u_asciiInvert"),
      asciiOverlay: gl.getUniformLocation(program, "u_asciiOverlay"),
      asciiCutDarks: gl.getUniformLocation(program, "u_asciiCutDarks"),
      asciiCutLights: gl.getUniformLocation(program, "u_asciiCutLights"),
      leak: gl.getUniformLocation(program, "u_leak"),
      leakPosition: gl.getUniformLocation(program, "u_leakPosition"),
      prism: gl.getUniformLocation(program, "u_prism"),
      prismDirection: gl.getUniformLocation(program, "u_prismDirection"),
    },
    render(processedSource, cleanSource, width, height, phase, amounts, context) {
      gl.viewport(0, 0, width, height);
      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, position);
      gl.enableVertexAttribArray(this.attributes.position);
      gl.vertexAttribPointer(this.attributes.position, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, texCoord);
      gl.enableVertexAttribArray(this.attributes.texCoord);
      gl.vertexAttribPointer(this.attributes.texCoord, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, processedSource);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, sourceTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cleanSource);

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, asciiTexture);

      gl.uniform1i(this.uniforms.texture, 0);
      gl.uniform1i(this.uniforms.sourceTexture, 1);
      gl.uniform1i(this.uniforms.asciiAtlas, 2);
      gl.uniform1f(this.uniforms.asciiCharCount, this.asciiCharCount);
      gl.uniform2f(this.uniforms.resolution, width, height);
      gl.uniform1f(this.uniforms.phase, phase);
      gl.uniform1f(this.uniforms.patternSize, context.patternSizeScale);
      gl.uniform1f(this.uniforms.threshold, context.thresholdNorm);
      gl.uniform1f(this.uniforms.errorStrength, context.errorStrength);
      gl.uniform1f(this.uniforms.depth, context.depth);
      gl.uniform1f(this.uniforms.brightness, context.brightnessNorm);
      gl.uniform1f(this.uniforms.contrast, context.contrastNorm);
      gl.uniform1f(this.uniforms.film, amounts.film);
      gl.uniform1f(this.uniforms.filmGrain, amounts.filmGrain);
      gl.uniform1f(this.uniforms.filmWarmth, amounts.filmWarmth);
      gl.uniform1f(this.uniforms.gradient, amounts.gradient);
      gl.uniform1f(this.uniforms.gradientBias, amounts.gradientBias);
      gl.uniform1f(this.uniforms.ascii, amounts.ascii);
      gl.uniform1f(this.uniforms.asciiDensity, amounts.asciiDensity);
      gl.uniform1f(this.uniforms.asciiTileAspect, amounts.asciiTileAspect);
      gl.uniform3f(this.uniforms.asciiCharacterColor, amounts.asciiCharacterColor[0], amounts.asciiCharacterColor[1], amounts.asciiCharacterColor[2]);
      gl.uniform3f(this.uniforms.asciiBackgroundColor, amounts.asciiBackgroundColor[0], amounts.asciiBackgroundColor[1], amounts.asciiBackgroundColor[2]);
      gl.uniform1f(this.uniforms.asciiInvert, amounts.asciiInvert);
      gl.uniform1f(this.uniforms.asciiOverlay, amounts.asciiOverlay);
      gl.uniform1f(this.uniforms.asciiCutDarks, amounts.asciiCutDarks);
      gl.uniform1f(this.uniforms.asciiCutLights, amounts.asciiCutLights);
      gl.uniform1f(this.uniforms.leak, amounts.leak);
      gl.uniform1f(this.uniforms.leakPosition, amounts.leakPosition);
      gl.uniform1f(this.uniforms.prism, amounts.prism);
      gl.uniform1f(this.uniforms.prismDirection, amounts.prismDirection);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
  };

  return shaderRenderer;
}

function createShaderProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    controls.statusText.textContent = `WebGL shader link failed: ${gl.getProgramInfoLog(program)}`;
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    controls.statusText.textContent = `WebGL shader compile failed: ${gl.getShaderInfoLog(shader)}`;
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createAsciiAtlas() {
  const chars = " .:-=+*#%@";
  const cellWidth = 28;
  const cellHeight = 36;
  const canvas = document.createElement("canvas");
  canvas.width = cellWidth * chars.length;
  canvas.height = cellHeight;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 27px Consolas, Monaco, 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  chars.split("").forEach((char, index) => {
    ctx.fillText(char, index * cellWidth + cellWidth / 2, cellHeight * 0.55);
  });
  return { canvas, charCount: chars.length };
}

function shaderVertexSource() {
  return `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_uv;
void main() {
  v_uv = a_texCoord;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
}

function shaderFragmentSource() {
  return `
precision mediump float;
uniform sampler2D u_texture;
uniform sampler2D u_sourceTexture;
uniform sampler2D u_asciiAtlas;
uniform float u_asciiCharCount;
uniform vec2 u_resolution;
uniform float u_phase;
uniform float u_patternSize;
uniform float u_threshold;
uniform float u_errorStrength;
uniform float u_depth;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_film;
uniform float u_filmGrain;
uniform float u_filmWarmth;
uniform float u_gradient;
uniform float u_gradientBias;
uniform float u_ascii;
uniform float u_asciiDensity;
uniform float u_asciiTileAspect;
uniform vec3 u_asciiCharacterColor;
uniform vec3 u_asciiBackgroundColor;
uniform float u_asciiInvert;
uniform float u_asciiOverlay;
uniform float u_asciiCutDarks;
uniform float u_asciiCutLights;
uniform float u_leak;
uniform float u_leakPosition;
uniform float u_prism;
uniform float u_prismDirection;
varying vec2 v_uv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float luminance3(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

vec3 readSource(vec2 uv) {
  return texture2D(u_texture, clamp(uv, 0.0, 1.0)).rgb;
}

vec3 readCleanSource(vec2 uv) {
  return texture2D(u_sourceTexture, clamp(uv, 0.0, 1.0)).rgb;
}

vec3 gradientMap(float luma) {
  vec3 dark = vec3(0.035, 0.02, 0.09);
  vec3 mid = vec3(0.02, 0.82, 0.88);
  vec3 hot = vec3(1.0, 0.22, 0.72);
  vec3 high = vec3(1.0, 0.92, 0.64);
  vec3 a = mix(dark, mid, smoothstep(0.0, 0.58, luma));
  vec3 b = mix(hot, high, smoothstep(0.58, 1.0, luma));
  return mix(a, b, smoothstep(0.42, 0.88, luma));
}

float asciiGlyph(vec2 local, float luma, float variant) {
  float charIndex = floor(clamp(luma + (variant - 0.5) * 0.08, 0.0, 0.999) * u_asciiCharCount);
  vec2 atlasUv = vec2((charIndex + local.x) / u_asciiCharCount, local.y);
  return texture2D(u_asciiAtlas, atlasUv).a;
}

void main() {
  vec2 uv = v_uv;
  float t = u_phase;
  float prismSign = mix(-1.0, 1.0, step(0.5, u_prismDirection));
  float wave = sin((uv.y + u_prismDirection * 0.35) * 55.0 + t * 2.0) * 0.0065 * u_prism * (0.6 + u_patternSize * 0.28) * prismSign;
  float breathe = sin(t + uv.y * 5.0) * 0.0018 * u_prism * (0.8 + u_errorStrength * 0.25);
  vec3 color;
  color.r = readSource(uv + vec2(wave + breathe + 0.006 * u_prism, 0.0)).r;
  color.g = readSource(uv + vec2(wave * 0.35, 0.0)).g;
  color.b = readSource(uv - vec2(wave + 0.006 * u_prism, 0.0)).b;

  float luma = luminance3(color);
  vec2 pixel = uv * u_resolution;
  float grain = hash(pixel + vec2(t * 37.0, t * 19.0)) - 0.5;

  vec3 filmTone = color;
  filmTone = (filmTone - 0.5) * (1.0 + u_contrast * 0.42) + 0.5 + u_brightness * 0.12;
  filmTone = pow(max(filmTone, vec3(0.0)), vec3(0.92, 0.86, 0.8));
  filmTone *= vec3(1.0 + u_filmWarmth * 0.18 + u_depth * 0.004, 0.98, 1.0 - u_filmWarmth * 0.22 - u_depth * 0.004);
  filmTone += grain * (0.02 + u_filmGrain * 0.12 + u_errorStrength * 0.05 + luma * 0.08);
  float scratch = step(0.992 - u_errorStrength * 0.002, hash(vec2(floor(pixel.x / 2.0), floor(t * 18.0)))) * (1.0 - smoothstep(0.0, 0.95, uv.y));
  filmTone += scratch * vec3(0.16, 0.12, 0.08);
  color = mix(color, filmTone, clamp(u_film, 0.0, 1.0));

  float gradedLuma = smoothstep(max(0.0, u_threshold - 0.38), min(1.0, u_threshold + 0.38), luma + u_brightness * 0.14 + (u_gradientBias - 0.5) * 0.22);
  vec3 mapped = gradientMap(gradedLuma);
  color = mix(color, mapped * (0.62 + luma * 0.72), clamp(u_gradient, 0.0, 1.0));

  if (u_ascii > 0.001) {
    float density = clamp(u_ascii * u_asciiDensity, 0.0, 1.35);
    float cellHeight = mix(22.0, 9.0, density) * clamp(u_patternSize, 0.5, 4.0);
    vec2 cellSize = vec2(cellHeight * clamp(u_asciiTileAspect, 0.35, 1.2), cellHeight);
    vec2 cellId = floor(pixel / cellSize);
    vec2 local = fract(pixel / cellSize);
    vec2 sampleUv = (cellId * cellSize + cellSize * 0.5) / u_resolution;
    vec3 sampled = readCleanSource(sampleUv);
    float sampledLuma = luminance3(sampled);
    sampledLuma = (sampledLuma - u_threshold) * (1.25 + u_contrast * 0.75) + 0.5 + u_brightness * 0.16;
    sampledLuma = mix(sampledLuma, 1.0 - sampledLuma, step(0.5, u_asciiInvert));
    sampledLuma = smoothstep(u_asciiCutDarks, 1.0 - u_asciiCutLights, sampledLuma);
    sampledLuma = smoothstep(0.035, 0.96, pow(clamp(sampledLuma, 0.0, 1.0), 0.82));
    float cellNoise = hash(cellId + floor(t * 3.0));
    float mask = asciiGlyph(local, sampledLuma, cellNoise);
    float paper = smoothstep(0.03, 0.18 + (1.0 - u_errorStrength) * 0.12, sampledLuma);
    float ink = mask * paper * (0.64 + sampledLuma * 0.56 + u_depth * 0.012);
    vec3 glyphColor = mix(u_asciiBackgroundColor, u_asciiCharacterColor, clamp(ink, 0.0, 1.0));
    glyphColor += u_asciiCharacterColor * 0.08 * mask * cellNoise;
    float asciiMix = smoothstep(0.06, 0.72, u_ascii);
    vec3 overlayColor = mix(color, glyphColor, clamp(ink * 1.2, 0.0, 1.0));
    color = mix(mix(color, glyphColor, asciiMix), overlayColor, u_asciiOverlay);
  }

  vec2 leakCenter = vec2(0.08 + 0.84 * u_leakPosition, 0.14 + 0.72 * (0.5 + 0.5 * cos(t * 0.53 + u_leakPosition * 6.283)));
  float leak = 1.0 - smoothstep(0.0, 0.9, distance(uv, leakCenter));
  vec3 leakColor = mix(vec3(1.0, 0.18, 0.04), vec3(0.0, 0.72, 1.0), smoothstep(0.2, 0.9, uv.x));
  color += leakColor * leak * leak * (0.38 + max(0.0, u_brightness) * 0.22 + u_errorStrength * 0.12) * u_leak;

  float vignette = 1.0 - smoothstep(0.22, 0.92, distance(uv, vec2(0.5)));
  color *= mix(1.0, 0.72 + vignette * 0.42, clamp(u_film + u_leak, 0.0, 1.0));
  color += grain * 0.045 * max(max(u_film, u_gradient), u_ascii);

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;
}

function blurImage(imageData, radius) {
  const passes = Math.max(0, Math.round(radius));
  if (passes === 0) return imageData;
  let current = imageData;
  for (let pass = 0; pass < passes; pass++) {
    current = boxBlurOnce(current);
  }
  return current;
}

function boxBlurOnce(imageData) {
  const { width, height, data } = imageData;
  const out = new ImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;
      for (let yy = -1; yy <= 1; yy++) {
        const sy = y + yy;
        if (sy < 0 || sy >= height) continue;
        for (let xx = -1; xx <= 1; xx++) {
          const sx = x + xx;
          if (sx < 0 || sx >= width) continue;
          const idx = (sy * width + sx) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          a += data[idx + 3];
          count++;
        }
      }
      const idx = (y * width + x) * 4;
      out.data[idx] = r / count;
      out.data[idx + 1] = g / count;
      out.data[idx + 2] = b / count;
      out.data[idx + 3] = a / count;
    }
  }
  return out;
}

function epsilonGlow(imageData, amount) {
  const { width, height, data } = imageData;
  const out = new ImageData(new Uint8ClampedArray(data), width, height);
  for (let i = 0; i < data.length; i += 4) {
    const glow = Math.max(data[i], data[i + 1], data[i + 2]) * amount * 0.22;
    out.data[i] = clamp(data[i] + glow * 0.7);
    out.data[i + 1] = clamp(data[i + 1] + glow);
    out.data[i + 2] = clamp(data[i + 2] + glow * 1.2);
  }
  return out;
}

function signalTrail(imageData, amount) {
  const { width, height, data } = imageData;
  const out = new ImageData(new Uint8ClampedArray(data), width, height);
  const steps = Math.max(3, Math.round(12 * amount));
  const phase = Number(controls.phase.value) * Math.PI / 180;
  const spacing = Math.max(4, Math.round(width * (0.011 + Math.sin(phase) * 0.002)));
  for (let y = 0; y < height; y++) {
    const wobble = Math.round(Math.sin(y * 0.035 + phase) * 4 * amount);
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      for (let step = 1; step <= steps; step++) {
        const sx = x + step * spacing + wobble;
        if (sx >= width) break;
        const sidx = (y * width + sx) * 4;
        const lum = luminance(data[sidx], data[sidx + 1], data[sidx + 2]) / 255;
        const fade = amount * lum * Math.pow(0.72, step);
        out.data[idx] = clamp(out.data[idx] + data[sidx] * fade * 0.45);
        out.data[idx + 1] = clamp(out.data[idx + 1] + data[sidx + 1] * fade * 0.55);
        out.data[idx + 2] = clamp(out.data[idx + 2] + data[sidx + 2] * fade * 0.75);
      }
    }
  }
  return out;
}

function phosphorBloom(imageData, amount) {
  const blurred = blurImage(imageData, Math.max(1, Math.round(amount * 4)));
  const { width, height, data } = imageData;
  const out = new ImageData(new Uint8ClampedArray(data), width, height);
  for (let i = 0; i < data.length; i += 4) {
    const lum = luminance(data[i], data[i + 1], data[i + 2]) / 255;
    const glow = Math.pow(lum, 1.35) * amount;
    out.data[i] = clamp(data[i] + blurred.data[i] * glow * 0.3 + 10 * glow);
    out.data[i + 1] = clamp(data[i + 1] + blurred.data[i + 1] * glow * 0.5 + 24 * glow);
    out.data[i + 2] = clamp(data[i + 2] + blurred.data[i + 2] * glow * 0.9 + 46 * glow);
  }
  return out;
}

function jpegGlitch(imageData, amount) {
  const { width, height, data } = imageData;
  const out = new ImageData(new Uint8ClampedArray(data), width, height);
  const block = Math.max(4, Math.round(18 * amount));
  for (let y = 0; y < height; y += block) {
    const shift = Math.round((seededNoise(y, block, amount) - 0.5) * 34 * amount);
    for (let yy = y; yy < Math.min(height, y + block); yy++) {
      for (let x = 0; x < width; x++) {
        const idx = (yy * width + x) * 4;
        const sx = wrap(x + shift, width);
        const sidx = (yy * width + sx) * 4;
        out.data[idx] = data[sidx];
        out.data[idx + 1] = data[sidx + 1];
        out.data[idx + 2] = data[sidx + 2];
      }
    }
  }
  return out;
}

function chromaticAberration(imageData, amount) {
  const { width, height, data } = imageData;
  const out = new ImageData(new Uint8ClampedArray(data), width, height);
  const phase = Number(controls.phase.value) * Math.PI / 180;
  const offset = Math.round((7 + Math.sin(phase * 2) * 3) * amount);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      out.data[idx] = data[(y * width + wrap(x + offset, width)) * 4];
      out.data[idx + 2] = data[(y * width + wrap(x - offset, width)) * 4 + 2];
    }
  }
  return out;
}

function scanlines(imageData, amount) {
  const { width, height, data } = imageData;
  const out = new ImageData(new Uint8ClampedArray(data), width, height);
  const roll = Math.floor(Number(controls.phase.value) / 18) % 3;
  for (let y = 0; y < height; y++) {
    const shade = (y + roll) % 3 === 0 ? 1 - amount * 0.45 : 1;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const mask = x % 3 === 1 ? 1 - amount * 0.18 : 1;
      out.data[idx] *= shade * mask;
      out.data[idx + 1] *= shade * (x % 3 === 0 ? 1 - amount * 0.14 : 1);
      out.data[idx + 2] *= shade * mask;
    }
  }
  return out;
}

function vignette(imageData, amount) {
  const { width, height, data } = imageData;
  const out = new ImageData(new Uint8ClampedArray(data), width, height);
  const phase = Number(controls.phase.value) * Math.PI / 180;
  const cx = width * (0.56 + Math.sin(phase) * 0.015);
  const cy = height * (0.5 + Math.cos(phase * 0.7) * 0.012);
  const maxDistance = Math.sqrt(cx * cx + cy * cy);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x - cx;
      const dy = (y - cy) * 1.2;
      const distance = Math.sqrt(dx * dx + dy * dy) / maxDistance;
      const shade = 1 - Math.pow(distance, 1.55) * amount * 1.18;
      out.data[idx] = clamp(data[idx] * shade + 5 * amount);
      out.data[idx + 1] = clamp(data[idx + 1] * shade);
      out.data[idx + 2] = clamp(data[idx + 2] * shade + 18 * amount * (1 - distance));
    }
  }
  return out;
}

function signalNoise(imageData, amount) {
  const { width, height, data } = imageData;
  const out = new ImageData(new Uint8ClampedArray(data), width, height);
  const phase = Number(controls.phase.value) / 31;
  for (let y = 0; y < height; y++) {
    const rowNoise = (seededNoise(y, 12, phase) - 0.5) * 22 * amount;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const block = seededNoise(Math.floor(x / 12), Math.floor(y / 10), phase) - 0.5;
      const fine = seededNoise(x, y, phase) - 0.5;
      const noise = rowNoise + block * 26 * amount + fine * 18 * amount;
      out.data[idx] = clamp(data[idx] + noise * 0.75);
      out.data[idx + 1] = clamp(data[idx + 1] + noise * 0.55);
      out.data[idx + 2] = clamp(data[idx + 2] + noise);
    }
  }
  return out;
}

function cmykHalftone(imageData, amount) {
  const { width, height, data } = imageData;
  const out = new ImageData(new Uint8ClampedArray(data), width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dot = (Math.sin((x + y) * 0.24) + Math.sin((x - y) * 0.18) + 2) / 4;
      const mul = 1 + (dot - 0.5) * amount;
      out.data[idx] = clamp(data[idx] * mul);
      out.data[idx + 1] = clamp(data[idx + 1] * (1 + (0.5 - dot) * amount * 0.5));
      out.data[idx + 2] = clamp(data[idx + 2] * (1 + Math.sin(x * 0.12) * amount * 0.25));
    }
  }
  return out;
}

function activePalette() {
  const colors = palettes[controls.paletteSelect.value] || palettes["Game Console"];
  return hexPalette(colors).slice(0, Number(controls.depth.value));
}

function hexPalette(colors) {
  return colors.map((hex) => {
    const clean = hex.replace("#", "");
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  });
}

function nearestPalette(color, palette) {
  let best = palette[0];
  let bestDistance = Infinity;
  for (const candidate of palette) {
    const dr = color[0] - candidate[0];
    const dg = color[1] - candidate[1];
    const db = color[2] - candidate[2];
    const distance = dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = candidate;
    }
  }
  return best;
}

function extractPalette() {
  const imageData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  const buckets = new Map();
  for (let i = 0; i < imageData.data.length; i += 32) {
    const r = Math.round(imageData.data[i] / 32) * 32;
    const g = Math.round(imageData.data[i + 1] / 32) * 32;
    const b = Math.round(imageData.data[i + 2] / 32) * 32;
    const key = `${r},${g},${b}`;
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }
  palettes.Extracted = Array.from(buckets.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key]) => {
      const [r, g, b] = key.split(",").map(Number);
      return rgbToHex(r, g, b);
    });
  controls.paletteSelect.value = "Extracted";
  updatePalettePreview();
  syncSeedToSettings();
  controls.statusText.textContent = "Palette extracted from the current source.";
  scheduleRender();
}

function addEffect() {
  const type = controls.effectSelect.value;
  state.effects.push({ type, amount: 0.55, params: effectDefaultParams(type) });
  state.selectedEffectIndex = state.effects.length - 1;
  renderEffectStack();
  syncSeedToSettings();
  scheduleRender();
}

function renderEffectStack() {
  state.effects.forEach((effect) => {
    if (!effect.params) effect.params = effectDefaultParams(effect.type);
  });
  controls.effectStack.innerHTML = "";
  if (!state.effects.length) {
    state.selectedEffectIndex = -1;
    const empty = document.createElement("div");
    empty.className = "effect-row";
    empty.innerHTML = "<strong>No effects</strong>";
    controls.effectStack.append(empty);
    updateEffectEditor();
    return;
  }

  if (state.selectedEffectIndex < 0 || state.selectedEffectIndex >= state.effects.length) {
    state.selectedEffectIndex = 0;
  }

  state.effects.forEach((effect, index) => {
    const row = document.createElement("div");
    row.className = `effect-row${index === state.selectedEffectIndex ? " selected" : ""}`;
    row.addEventListener("click", () => selectEffect(index));
    const label = document.createElement("strong");
    label.textContent = effectName(effect.type);
    const up = stackButton("^", "Move effect up", () => moveEffect(index, -1));
    const down = stackButton("v", "Move effect down", () => moveEffect(index, 1));
    const remove = stackButton("x", "Remove effect", () => removeEffect(index));
    row.append(label, up, down, remove);
    controls.effectStack.append(row);
  });
  updateEffectEditor();
}

function stackButton(text, title, handler) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.title = title;
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    handler();
  });
  return button;
}

function selectEffect(index) {
  state.selectedEffectIndex = index;
  renderEffectStack();
}

function moveEffect(index, delta) {
  const next = index + delta;
  if (next < 0 || next >= state.effects.length) return;
  const [effect] = state.effects.splice(index, 1);
  state.effects.splice(next, 0, effect);
  state.selectedEffectIndex = next;
  renderEffectStack();
  syncSeedToSettings();
  scheduleRender();
}

function removeEffect(index) {
  state.effects.splice(index, 1);
  if (state.effects.length === 0) state.selectedEffectIndex = -1;
  else state.selectedEffectIndex = Math.min(index, state.effects.length - 1);
  renderEffectStack();
  syncSeedToSettings();
  scheduleRender();
}

function updateEffectAmount(index, value) {
  const effect = state.effects[index];
  if (!effect) return;
  effect.amount = Number(value);
  syncSeedToSettings();
  scheduleRender();
}

function updateEffectParam(index, key, value) {
  const effect = state.effects[index];
  if (!effect) return;
  effect.params = { ...effectDefaultParams(effect.type), ...(effect.params || {}) };
  effect.params[key] = value;
  syncSeedToSettings();
  scheduleRender();
}

function updateEffectEditor() {
  controls.effectEditors.innerHTML = "";

  if (!state.effects.length) {
    const note = document.createElement("p");
    note.className = "empty-note";
    note.textContent = "Add an effect to edit its layer controls here.";
    controls.effectEditors.append(note);
    return;
  }

  state.effects.forEach((effect, index) => {
    effect.params = sanitizeEffectParams(effect.type, effect.params);
    controls.effectEditors.append(createEffectEditorCard(effect, index));
  });
}

function createEffectEditorCard(effect, index) {
  const card = document.createElement("article");
  card.className = `effect-editor-card${index === state.selectedEffectIndex ? " selected" : ""}`;

  const heading = document.createElement("div");
  heading.className = "effect-editor-heading";
  heading.addEventListener("click", () => {
    if (index !== state.selectedEffectIndex) selectEffect(index);
  });
  const title = document.createElement("h3");
  title.textContent = effectName(effect.type);
  const layer = document.createElement("span");
  layer.textContent = `Layer ${index + 1}`;
  heading.append(title, layer);

  const meta = effectParamMeta(effect.type);
  const strength = document.createElement("label");
  strength.className = "control";
  const strengthText = document.createElement("span");
  const strengthName = document.createElement("span");
  strengthName.textContent = meta.label;
  const strengthValue = document.createElement("em");
  strengthValue.textContent = meta.format(effect.amount);
  strengthText.append(strengthName, strengthValue);
  const strengthInput = document.createElement("input");
  strengthInput.type = "range";
  strengthInput.min = meta.min;
  strengthInput.max = meta.max;
  strengthInput.step = meta.step;
  strengthInput.value = String(effect.amount);
  strengthInput.addEventListener("input", () => {
    effect.amount = Number(strengthInput.value);
    strengthValue.textContent = meta.format(effect.amount);
    updateEffectAmount(index, effect.amount);
  });
  strength.append(strengthText, strengthInput);

  const customControls = document.createElement("div");
  customControls.className = "custom-controls";
  renderEffectCustomControls(effect, index, customControls);
  card.append(heading, strength, customControls);
  return card;
}

function renderEffectCustomControls(effect, index, target) {
  const definitions = effectParamDefinitions(effect.type);
  if (!definitions.length) {
    const note = document.createElement("p");
    note.className = "empty-note";
    note.textContent = "This layer uses the global controls above plus strength.";
    target.append(note);
    return;
  }

  definitions.forEach((definition) => {
    const value = effect.params?.[definition.key] ?? definition.value;
    const label = document.createElement("label");
    label.className = definition.type === "checkbox" ? "toggle" : "control";

    if (definition.type === "checkbox") {
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = Boolean(value);
      input.addEventListener("change", () => updateEffectParam(index, definition.key, input.checked));
      const span = document.createElement("span");
      span.textContent = definition.label;
      label.append(input, span);
      target.append(label);
      return;
    }

    const labelText = document.createElement("span");
    const labelName = document.createElement("span");
    labelName.textContent = definition.label;
    labelText.append(labelName);
    const input = document.createElement("input");
    input.type = definition.type;
    if (definition.type === "range") {
      input.min = definition.min;
      input.max = definition.max;
      input.step = definition.step;
      const valueText = document.createElement("em");
      valueText.textContent = formatCustomParamValue(definition, value);
      labelText.append(valueText);
      input.addEventListener("input", () => {
        const nextValue = Number(input.value);
        valueText.textContent = formatCustomParamValue(definition, nextValue);
        updateEffectParam(index, definition.key, nextValue);
      });
    } else {
      input.addEventListener("input", () => updateEffectParam(index, definition.key, input.value));
    }
    input.value = String(value);
    label.append(labelText, input);
    target.append(label);
  });
}

function formatCustomParamValue(definition, value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  if (definition.max === "1" || definition.max === "1.2" || definition.max === "1.4") return number.toFixed(2);
  return `${Math.round(number * 100)}%`;
}

function effectParamMeta(type) {
  const percent = (value) => `${Math.round(value * 100)}%`;
  const metas = {
    epsilon: { label: "Glow", min: "0", max: "1.5", step: "0.01", format: percent },
    blur: { label: "Blur Radius", min: "0", max: "1.5", step: "0.01", format: percent },
    trail: { label: "Trail Length", min: "0", max: "1.5", step: "0.01", format: percent },
    bloom: { label: "Bloom", min: "0", max: "1.5", step: "0.01", format: percent },
    jpeg: { label: "Block Shift", min: "0", max: "1.5", step: "0.01", format: percent },
    chromatic: { label: "Split Size", min: "0", max: "1.5", step: "0.01", format: (value) => `${Math.round(value * 10)} px` },
    scanlines: { label: "Line Strength", min: "0", max: "1.5", step: "0.01", format: percent },
    vignette: { label: "Falloff", min: "0", max: "1.5", step: "0.01", format: percent },
    noise: { label: "Noise", min: "0", max: "1.5", step: "0.01", format: percent },
    cmyk: { label: "Plate Offset", min: "0", max: "1.5", step: "0.01", format: percent },
    film: { label: "Film Response", min: "0", max: "1.5", step: "0.01", format: percent },
    gradient: { label: "Gradient Mix", min: "0", max: "1.5", step: "0.01", format: percent },
    "ascii-shader": { label: "Glyph Density", min: "0", max: "1.5", step: "0.01", format: percent },
    "light-leak": { label: "Leak Intensity", min: "0", max: "1.5", step: "0.01", format: percent },
    prism: { label: "Smear Width", min: "0", max: "1.5", step: "0.01", format: percent },
  };
  return metas[type] || { label: "Strength", min: "0", max: "1.5", step: "0.01", format: percent };
}

function effectDefaultParams(type) {
  const defaults = {
    "ascii-shader": {
      density: 0.75,
      tileAspect: 0.58,
      characterColor: "#ffffff",
      backgroundColor: "#000000",
      invert: false,
      overlay: false,
      cutDarks: 0.03,
      cutLights: 0,
    },
    film: { grain: 0.55, warmth: 0.45 },
    gradient: { bias: 0.5 },
    "light-leak": { position: 0.5 },
    prism: { direction: 0.5 },
  };
  const detailLabels = effectDetailLabels();
  if (detailLabels[type]) return { detail: 1 };
  return { ...(defaults[type] || {}) };
}

function effectParamDefinitions(type) {
  const definitions = {
    "ascii-shader": [
      { key: "density", label: "Density", type: "range", min: "0.15", max: "1.4", step: "0.01", value: 0.75 },
      { key: "tileAspect", label: "Tile Aspect", type: "range", min: "0.35", max: "1.2", step: "0.01", value: 0.58 },
      { key: "characterColor", label: "Character Color", type: "color", value: "#ffffff" },
      { key: "backgroundColor", label: "Background Color", type: "color", value: "#000000" },
      { key: "invert", label: "Invert", type: "checkbox", value: false },
      { key: "overlay", label: "Overlay On Image", type: "checkbox", value: false },
      { key: "cutDarks", label: "Cut Darks", type: "range", min: "0", max: "0.35", step: "0.01", value: 0.03 },
      { key: "cutLights", label: "Cut Lights", type: "range", min: "0", max: "0.35", step: "0.01", value: 0 },
    ],
    film: [
      { key: "grain", label: "Grain", type: "range", min: "0", max: "1", step: "0.01", value: 0.55 },
      { key: "warmth", label: "Warmth", type: "range", min: "0", max: "1", step: "0.01", value: 0.45 },
    ],
    gradient: [
      { key: "bias", label: "Tone Bias", type: "range", min: "0", max: "1", step: "0.01", value: 0.5 },
    ],
    "light-leak": [
      { key: "position", label: "Position", type: "range", min: "0", max: "1", step: "0.01", value: 0.5 },
    ],
    prism: [
      { key: "direction", label: "Direction", type: "range", min: "0", max: "1", step: "0.01", value: 0.5 },
    ],
  };
  const detailLabels = effectDetailLabels();
  if (!definitions[type] && detailLabels[type]) {
    return [{ key: "detail", label: detailLabels[type], type: "range", min: "0.35", max: "2", step: "0.01", value: 1 }];
  }
  return definitions[type] || [];
}

function effectDetailLabels() {
  return {
    epsilon: "Glow Scale",
    blur: "Radius Scale",
    trail: "Trail Scale",
    bloom: "Bloom Scale",
    jpeg: "Block Scale",
    chromatic: "Split Scale",
    scanlines: "Line Scale",
    vignette: "Falloff Scale",
    noise: "Noise Scale",
    cmyk: "Plate Scale",
  };
}

function sanitizeEffectParams(type, params) {
  const clean = effectDefaultParams(type);
  const definitions = effectParamDefinitions(type);
  const incoming = params && typeof params === "object" ? params : {};

  definitions.forEach((definition) => {
    if (!(definition.key in incoming)) return;
    if (definition.type === "checkbox") {
      clean[definition.key] = Boolean(incoming[definition.key]);
    } else if (definition.type === "range") {
      const value = Number(incoming[definition.key]);
      const min = Number(definition.min);
      const max = Number(definition.max);
      clean[definition.key] = Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : definition.value;
    } else if (definition.type === "color") {
      clean[definition.key] = normalizeColor(incoming[definition.key], definition.value);
    }
  });

  return clean;
}

function randomEffectParams(type, rng) {
  const params = effectDefaultParams(type);
  if (type === "ascii-shader") {
    params.density = Number(fixed(0.45 + rng() * 0.65, 2));
    params.tileAspect = Number(fixed(0.48 + rng() * 0.28, 2));
    params.invert = rng() > 0.82;
    params.overlay = rng() > 0.75;
    params.cutDarks = Number(fixed(rng() * 0.12, 2));
    params.cutLights = Number(fixed(rng() * 0.08, 2));
  }
  if (type === "film") {
    params.grain = Number(fixed(0.25 + rng() * 0.65, 2));
    params.warmth = Number(fixed(0.2 + rng() * 0.65, 2));
  }
  if (type === "gradient") params.bias = Number(fixed(0.2 + rng() * 0.65, 2));
  if (type === "light-leak") params.position = Number(fixed(rng(), 2));
  if (type === "prism") params.direction = Number(fixed(rng(), 2));
  if ("detail" in params) params.detail = Number(fixed(0.65 + rng() * 0.75, 2));
  return params;
}

function normalizeColor(value, fallback) {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

function hexToUnitRgb(hex) {
  const color = normalizeColor(hex, "#ffffff").slice(1);
  return [
    parseInt(color.slice(0, 2), 16) / 255,
    parseInt(color.slice(2, 4), 16) / 255,
    parseInt(color.slice(4, 6), 16) / 255,
  ];
}

function effectName(type) {
  return {
    epsilon: "Epsilon Glow",
    blur: "CRT Blur",
    trail: "Signal Trail",
    bloom: "Phosphor Bloom",
    jpeg: "JPEG Glitch",
    chromatic: "Chromatic Aberration",
    scanlines: "Scanlines",
    vignette: "Vignette",
    noise: "Signal Noise",
    cmyk: "CMYK Halftone",
    film: "Analog Film",
    gradient: "Gradient Map",
    "ascii-shader": "ASCII Matrix",
    "light-leak": "Light Leak",
    prism: "Prism Smear",
  }[type] || type;
}

async function exportRaster(type) {
  render({ fullResolution: true });
  const blob = await canvasToBlob(outputCanvas, type, controls.lossless.checked ? 1 : 0.86);
  if (blob) {
    downloadBlob(blob, `${state.sourceName || "etto"}-${Date.now()}.${type === "image/png" ? "png" : "jpg"}`);
  }
  scheduleRender();
}

function exportSvg() {
  render({ fullResolution: true });
  const imageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
  const step = Math.max(1, Math.round(outputCanvas.width / 180));
  const rects = [];
  for (let y = 0; y < outputCanvas.height; y += step) {
    for (let x = 0; x < outputCanvas.width; x += step) {
      const idx = (y * outputCanvas.width + x) * 4;
      const lum = luminance(imageData.data[idx], imageData.data[idx + 1], imageData.data[idx + 2]);
      if (lum < 130) rects.push(`<rect x="${x}" y="${y}" width="${step}" height="${step}"/>`);
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${outputCanvas.width} ${outputCanvas.height}" width="${outputCanvas.width}" height="${outputCanvas.height}"><g fill="#000">${rects.join("")}</g></svg>`;
  downloadBlob(new Blob([svg], { type: "image/svg+xml" }), `${state.sourceName || "etto"}-black-vector.svg`);
  scheduleRender();
}

async function batchExport() {
  if (!state.imageFiles.length) {
    controls.statusText.textContent = "Import multiple images first, then batch export.";
    return;
  }
  controls.statusText.textContent = `Batch exporting ${state.imageFiles.length} images.`;
  for (const file of state.imageFiles) {
    await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          state.sourceImage = image;
          state.sourceName = file.name.replace(/\.[^.]+$/, "");
          render({ fullResolution: true });
          outputCanvas.toBlob((blob) => {
            if (blob) downloadBlob(blob, `${state.sourceName}-dither.png`);
            setTimeout(resolve, 120);
          }, "image/png");
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  controls.statusText.textContent = "Batch export finished.";
  scheduleRender();
}

async function exportVideo() {
  if (state.mode !== "video" || !sourceVideo.src) {
    controls.statusText.textContent = "Import a video first, then export it.";
    return;
  }
  if (state.isExportingVideo) return;

  const originalPhase = Number(controls.phase.value);
  const originalTime = Number.isFinite(sourceVideo.currentTime) ? sourceVideo.currentTime : 0;
  try {
    state.isExportingVideo = true;
    controls.exportVideo.disabled = true;
    controls.exportVideo.textContent = "Rendering...";
    controls.statusText.textContent = "Preparing video export.";

    await ensureVideoReady();
    if (!Number.isFinite(sourceVideo.duration) || sourceVideo.duration <= 0) {
      throw new Error("The source video duration is unavailable.");
    }
    state.videoExportSize = getVideoExportSize(sourceVideo.videoWidth, sourceVideo.videoHeight);
    const duration = sourceVideo.duration;
    const fps = videoExportFps;
    const totalFrames = Math.max(1, Math.ceil(duration * fps));
    sourceVideo.pause();

    let mp4Ready = false;
    if (typeof VideoEncoder !== "undefined" && typeof VideoFrame !== "undefined") {
      try {
        controls.statusText.textContent = `Encoding fixed-FPS video at ${fps} fps, ${describeVideoExportSize(state.videoExportSize)}.`;
        const blob = await encodeSourceVideoMp4(duration, fps, totalFrames, originalPhase);
        downloadBlob(blob, `${state.sourceName || "etto"}-dither.mp4`);
        controls.statusText.textContent = `Video export ready: MP4 at ${fps} fps, ${describeVideoExportSize(state.videoExportSize)}.`;
        mp4Ready = true;
      } catch (error) {
        controls.statusText.textContent = `MP4 encoder unavailable: ${error.message || error}. Falling back to AVI.`;
      }
    }

    if (!mp4Ready) {
      const frames = [];
      for (let frame = 0; frame < totalFrames; frame++) {
        const progress = totalFrames <= 1 ? 1 : frame / (totalFrames - 1);
        const phase = (originalPhase + progress * 720) % 361;
        const frameTime = Math.min(frame / fps, Math.max(0, duration - 0.001));
        controls.phase.value = String(Math.round(phase));
        await seekSourceVideo(frameTime);
        render({ fullResolution: true });
        frames.push(await canvasToJpegBytes(outputCanvas, 0.9));
        controls.statusText.textContent = `Rendering fixed-FPS AVI fallback: ${Math.round(progress * 100)}%.`;
        await nextBrowserFrame();
      }

      controls.statusText.textContent = "Muxing AVI fallback.";
      const blob = createMjpegAvi(frames, outputCanvas.width, outputCanvas.height, fps);
      downloadBlob(blob, `${state.sourceName || "etto"}-dither.avi`);
      controls.statusText.textContent = `Video export ready: AVI at ${fps} fps, ${outputCanvas.width} x ${outputCanvas.height}.`;
    }
  } catch (error) {
    controls.statusText.textContent = `Video export failed: ${error.message || error}`;
  } finally {
    state.isExportingVideo = false;
    state.videoExportSize = null;
    controls.exportVideo.disabled = false;
    controls.exportVideo.textContent = "Video";
    controls.phase.value = String(originalPhase);
    sourceVideo.pause();
    await seekSourceVideo(Math.min(originalTime, Math.max(0, (sourceVideo.duration || originalTime) - 0.001))).catch(() => {});
    controls.playButton.textContent = ">";
    scheduleRender();
  }
}

async function exportAnimation() {
  if (!state.sourceImage) {
    controls.statusText.textContent = "Import an image first, then animate it.";
    return;
  }
  if (state.isExportingAnimation) return;

  const duration = Number(controls.animationDuration.value) || 5;
  const fps = videoExportFps;
  const totalFrames = duration * fps;
  const originalMode = state.mode;
  const originalPhase = Number(controls.phase.value);
  const originalView = state.view;

  try {
    state.isExportingAnimation = true;
    controls.exportAnimation.disabled = true;
    controls.exportAnimation.textContent = "Animating...";
    controls.statusText.textContent = `Rendering ${duration}s animation from still image.`;
    state.mode = "image";
    state.videoExportSize = getVideoExportSize(state.sourceImage.naturalWidth, state.sourceImage.naturalHeight);
    render();

    let mp4Ready = false;
    if (typeof VideoEncoder !== "undefined" && typeof VideoFrame !== "undefined") {
      try {
        controls.statusText.textContent = `Encoding fixed-FPS MP4 animation at ${describeVideoExportSize(state.videoExportSize)}.`;
        const blob = await encodeStillAnimationMp4(duration, fps, totalFrames, originalPhase);
        downloadBlob(blob, `${state.sourceName || "etto"}-animated-${duration}s.mp4`);
        controls.statusText.textContent = `Still animation ready: ${duration}s MP4 at ${fps} fps, ${describeVideoExportSize(state.videoExportSize)}.`;
        mp4Ready = true;
      } catch (error) {
        controls.statusText.textContent = `MP4 encoder unavailable: ${error.message || error}. Falling back to AVI.`;
      }
    }

    if (!mp4Ready) {
      const frames = [];
      for (let frame = 0; frame < totalFrames; frame++) {
        const progress = totalFrames <= 1 ? 1 : frame / (totalFrames - 1);
        const phase = (originalPhase + progress * 720) % 361;
        controls.phase.value = String(Math.round(phase));
        render({ fullResolution: true });
        frames.push(await canvasToJpegBytes(outputCanvas, 0.9));
        const percent = Math.round(progress * 100);
        controls.statusText.textContent = `Rendering still animation: ${percent}%.`;
        await nextBrowserFrame();
      }

      controls.statusText.textContent = "Muxing AVI fallback.";
      const blob = createMjpegAvi(frames, outputCanvas.width, outputCanvas.height, fps);
      downloadBlob(blob, `${state.sourceName || "etto"}-animated-${duration}s.avi`);
      controls.statusText.textContent = `Still animation ready: ${duration}s AVI fallback at ${outputCanvas.width} x ${outputCanvas.height}.`;
    }
  } catch (error) {
    controls.statusText.textContent = `Still animation failed: ${error.message || error}`;
  } finally {
    state.isExportingAnimation = false;
    state.videoExportSize = null;
    controls.exportAnimation.disabled = false;
    controls.exportAnimation.textContent = "Animate Still";
    controls.phase.value = String(originalPhase);
    setMode(originalMode);
    if (originalView !== state.view) setView(originalView);
    scheduleRender();
  }
}

async function encodeStillAnimationMp4(duration, fps, totalFrames, originalPhase) {
  render({ fullResolution: true });
  const width = outputCanvas.width;
  const height = outputCanvas.height;
  const config = await supportedH264EncoderConfig(width, height, fps);
  const chunks = [];
  let decoderConfig = null;
  let encodeError = null;

  const encoder = new VideoEncoder({
    output: (chunk, metadata) => {
      if (metadata?.decoderConfig?.description) decoderConfig = metadata.decoderConfig;
      const data = new Uint8Array(chunk.byteLength);
      chunk.copyTo(data);
      chunks.push({
        data,
        duration: Math.round(1000000 / fps),
        key: chunk.type === "key",
        timestamp: chunk.timestamp,
      });
    },
    error: (error) => {
      encodeError = error;
    },
  });

  encoder.configure(config);
  for (let frame = 0; frame < totalFrames; frame++) {
    const progress = totalFrames <= 1 ? 1 : frame / (totalFrames - 1);
    const phase = (originalPhase + progress * 720) % 361;
    controls.phase.value = String(Math.round(phase));
    render({ fullResolution: true });

    const videoFrame = new VideoFrame(outputCanvas, {
      timestamp: Math.round((frame * 1000000) / fps),
      duration: Math.round(1000000 / fps),
    });
    encoder.encode(videoFrame, { keyFrame: frame === 0 || frame % fps === 0 });
    videoFrame.close();

    controls.statusText.textContent = `Encoding fixed-FPS MP4: ${Math.round(progress * 100)}%.`;
    if (frame % 3 === 0) await nextBrowserFrame();
  }

  await encoder.flush();
  encoder.close();

  if (encodeError) throw encodeError;

  if (!chunks.length || !decoderConfig?.description) {
    throw new Error("H.264 encoder did not return MP4 decoder metadata.");
  }

  chunks.sort((a, b) => a.timestamp - b.timestamp);
  const timescale = 90000;
  const sampleDelta = Math.round(timescale / fps);
  const mp4Bytes = createH264Mp4({
    chunks,
    width,
    height,
    timescale,
    sampleDelta,
    avcConfig: new Uint8Array(decoderConfig.description),
  });
  return new Blob([mp4Bytes], { type: "video/mp4" });
}

async function encodeSourceVideoMp4(duration, fps, totalFrames, originalPhase) {
  await seekSourceVideo(0);
  render({ fullResolution: true });
  const width = outputCanvas.width;
  const height = outputCanvas.height;
  const config = await supportedH264EncoderConfig(width, height, fps);
  const chunks = [];
  let decoderConfig = null;
  let encodeError = null;

  const encoder = new VideoEncoder({
    output: (chunk, metadata) => {
      if (metadata?.decoderConfig?.description) decoderConfig = metadata.decoderConfig;
      const data = new Uint8Array(chunk.byteLength);
      chunk.copyTo(data);
      chunks.push({
        data,
        duration: Math.round(1000000 / fps),
        key: chunk.type === "key",
        timestamp: chunk.timestamp,
      });
    },
    error: (error) => {
      encodeError = error;
    },
  });

  encoder.configure(config);
  for (let frame = 0; frame < totalFrames; frame++) {
    const progress = totalFrames <= 1 ? 1 : frame / (totalFrames - 1);
    const phase = (originalPhase + progress * 720) % 361;
    const frameTime = Math.min(frame / fps, Math.max(0, duration - 0.001));
    controls.phase.value = String(Math.round(phase));
    await seekSourceVideo(frameTime);
    render({ fullResolution: true });

    const videoFrame = new VideoFrame(outputCanvas, {
      timestamp: Math.round((frame * 1000000) / fps),
      duration: Math.round(1000000 / fps),
    });
    encoder.encode(videoFrame, { keyFrame: frame === 0 || frame % fps === 0 });
    videoFrame.close();

    controls.statusText.textContent = `Encoding fixed-FPS video: ${Math.round(progress * 100)}%.`;
    if (frame % 3 === 0) await nextBrowserFrame();
  }

  await encoder.flush();
  encoder.close();

  if (encodeError) throw encodeError;

  if (!chunks.length || !decoderConfig?.description) {
    throw new Error("H.264 encoder did not return MP4 decoder metadata.");
  }

  chunks.sort((a, b) => a.timestamp - b.timestamp);
  const timescale = 90000;
  const sampleDelta = Math.round(timescale / fps);
  const mp4Bytes = createH264Mp4({
    chunks,
    width,
    height,
    timescale,
    sampleDelta,
    avcConfig: new Uint8Array(decoderConfig.description),
  });
  return new Blob([mp4Bytes], { type: "video/mp4" });
}

async function supportedH264EncoderConfig(width, height, fps) {
  const base = {
    width,
    height,
    framerate: fps,
    bitrate: Math.round(Math.max(4000000, Math.min(20000000, width * height * fps * 0.16))),
    avc: { format: "avc" },
  };
  const codecs = ["avc1.42E01E", "avc1.4D401E", "avc1.64001F"];

  for (const codec of codecs) {
    const config = { ...base, codec };
    const support = await VideoEncoder.isConfigSupported(config).catch(() => null);
    if (support?.supported) return support.config;
  }

  throw new Error("H.264 WebCodecs support was not found.");
}

async function finalizeRecordedVideo(chunks, mimeType, durationMs) {
  const blob = new Blob(chunks, { type: mimeType });
  if (!mimeType.includes("webm") || !Number.isFinite(durationMs) || durationMs <= 0) return blob;
  try {
    return await addWebmDuration(blob, durationMs);
  } catch {
    return blob;
  }
}

function createH264Mp4({ chunks, width, height, timescale, sampleDelta, avcConfig }) {
  const sampleCount = chunks.length;
  const duration = sampleCount * sampleDelta;
  const ftyp = mp4Box("ftyp", asciiBytes("isom"), mp4U32(512), asciiBytes("isom"), asciiBytes("iso2"), asciiBytes("avc1"), asciiBytes("mp41"));
  const mdatSize = chunks.reduce((total, chunk) => total + chunk.data.length, 8);
  const mdatHeader = concatBytes([mp4U32(mdatSize), asciiBytes("mdat")]);
  const sampleSizes = chunks.map((chunk) => chunk.data.length);
  const syncSamples = chunks.map((chunk, index) => chunk.key ? index + 1 : null).filter(Boolean);
  let moov = createMp4MovieBox({
    width,
    height,
    timescale,
    duration,
    sampleDelta,
    sampleCount,
    sampleSizes,
    firstSampleOffset: 0,
    syncSamples,
    avcConfig,
  });
  const firstSampleOffset = ftyp.length + moov.length + 8;
  moov = createMp4MovieBox({
    width,
    height,
    timescale,
    duration,
    sampleDelta,
    sampleCount,
    sampleSizes,
    firstSampleOffset,
    syncSamples,
    avcConfig,
  });

  return concatBytes([ftyp, moov, mdatHeader, ...chunks.map((chunk) => chunk.data)]);
}

function createMp4MovieBox({ width, height, timescale, duration, sampleDelta, sampleCount, sampleSizes, firstSampleOffset, syncSamples, avcConfig }) {
  const mvhd = mp4FullBox("mvhd", 0, 0, concatBytes([
    mp4U32(0), mp4U32(0), mp4U32(timescale), mp4U32(duration),
    mp4U32(0x00010000), mp4U16(0x0100), mp4U16(0), mp4U32(0), mp4U32(0),
    mp4Matrix(), mp4U32(0), mp4U32(0), mp4U32(0), mp4U32(0), mp4U32(0), mp4U32(0), mp4U32(2),
  ]));
  const trak = createMp4VideoTrackBox({
    width,
    height,
    timescale,
    duration,
    sampleDelta,
    sampleCount,
    sampleSizes,
    firstSampleOffset,
    syncSamples,
    avcConfig,
  });
  return mp4Box("moov", mvhd, trak);
}

function createMp4VideoTrackBox({ width, height, timescale, duration, sampleDelta, sampleCount, sampleSizes, firstSampleOffset, syncSamples, avcConfig }) {
  const tkhd = mp4FullBox("tkhd", 0, 0x000007, concatBytes([
    mp4U32(0), mp4U32(0), mp4U32(1), mp4U32(0), mp4U32(duration),
    mp4U32(0), mp4U32(0), mp4U16(0), mp4U16(0), mp4U16(0), mp4U16(0),
    mp4Matrix(), mp4U32(width << 16), mp4U32(height << 16),
  ]));
  const mdia = createMp4MediaBox({
    width,
    height,
    timescale,
    duration,
    sampleDelta,
    sampleCount,
    sampleSizes,
    firstSampleOffset,
    syncSamples,
    avcConfig,
  });
  return mp4Box("trak", tkhd, mdia);
}

function createMp4MediaBox({ width, height, timescale, duration, sampleDelta, sampleCount, sampleSizes, firstSampleOffset, syncSamples, avcConfig }) {
  const mdhd = mp4FullBox("mdhd", 0, 0, concatBytes([
    mp4U32(0), mp4U32(0), mp4U32(timescale), mp4U32(duration), mp4U16(0x55c4), mp4U16(0),
  ]));
  const hdlr = mp4FullBox("hdlr", 0, 0, concatBytes([
    mp4U32(0), asciiBytes("vide"), mp4U32(0), mp4U32(0), mp4U32(0), asciiBytes("VideoHandler\0"),
  ]));
  const minf = createMp4VideoMediaInfoBox({
    width,
    height,
    sampleDelta,
    sampleCount,
    sampleSizes,
    firstSampleOffset,
    syncSamples,
    avcConfig,
  });
  return mp4Box("mdia", mdhd, hdlr, minf);
}

function createMp4VideoMediaInfoBox({ width, height, sampleDelta, sampleCount, sampleSizes, firstSampleOffset, syncSamples, avcConfig }) {
  const vmhd = mp4FullBox("vmhd", 0, 1, concatBytes([mp4U16(0), mp4U16(0), mp4U16(0), mp4U16(0)]));
  const url = mp4FullBox("url ", 0, 1, new Uint8Array());
  const dref = mp4FullBox("dref", 0, 0, concatBytes([mp4U32(1), url]));
  const dinf = mp4Box("dinf", dref);
  const stbl = createMp4SampleTableBox({
    width,
    height,
    sampleDelta,
    sampleCount,
    sampleSizes,
    firstSampleOffset,
    syncSamples,
    avcConfig,
  });
  return mp4Box("minf", vmhd, dinf, stbl);
}

function createMp4SampleTableBox({ width, height, sampleDelta, sampleCount, sampleSizes, firstSampleOffset, syncSamples, avcConfig }) {
  const avc1 = createAvc1SampleEntry(width, height, avcConfig);
  const stsd = mp4FullBox("stsd", 0, 0, concatBytes([mp4U32(1), avc1]));
  const stts = mp4FullBox("stts", 0, 0, concatBytes([mp4U32(1), mp4U32(sampleCount), mp4U32(sampleDelta)]));
  const stsc = mp4FullBox("stsc", 0, 0, concatBytes([mp4U32(1), mp4U32(1), mp4U32(sampleCount), mp4U32(1)]));
  const stsz = mp4FullBox("stsz", 0, 0, concatBytes([mp4U32(0), mp4U32(sampleCount), ...sampleSizes.map(mp4U32)]));
  const stco = mp4FullBox("stco", 0, 0, concatBytes([mp4U32(1), mp4U32(firstSampleOffset)]));
  const boxes = [stsd, stts, stsc, stsz, stco];
  if (syncSamples.length && syncSamples.length < sampleCount) {
    boxes.push(mp4FullBox("stss", 0, 0, concatBytes([mp4U32(syncSamples.length), ...syncSamples.map(mp4U32)])));
  }
  return mp4Box("stbl", ...boxes);
}

function createAvc1SampleEntry(width, height, avcConfig) {
  const compressorName = new Uint8Array(32);
  const name = asciiBytes("Etto H.264");
  compressorName[0] = name.length;
  compressorName.set(name, 1);
  return mp4Box("avc1", concatBytes([
    new Uint8Array(6), mp4U16(1), mp4U16(0), mp4U16(0), mp4U32(0), mp4U32(0), mp4U32(0),
    mp4U16(width), mp4U16(height), mp4U32(0x00480000), mp4U32(0x00480000), mp4U32(0), mp4U16(1),
    compressorName, mp4U16(0x0018), mp4U16(0xffff), mp4Box("avcC", avcConfig),
  ]));
}

function mp4Box(type, ...payloads) {
  const size = 8 + payloads.reduce((total, payload) => total + payload.length, 0);
  return concatBytes([mp4U32(size), asciiBytes(type), ...payloads]);
}

function mp4FullBox(type, version, flags, payload) {
  return mp4Box(type, concatBytes([new Uint8Array([version, (flags >> 16) & 255, (flags >> 8) & 255, flags & 255]), payload]));
}

function mp4Matrix() {
  return concatBytes([
    mp4U32(0x00010000), mp4U32(0), mp4U32(0),
    mp4U32(0), mp4U32(0x00010000), mp4U32(0),
    mp4U32(0), mp4U32(0), mp4U32(0x40000000),
  ]);
}

function mp4U16(value) {
  const bytes = new Uint8Array(2);
  new DataView(bytes.buffer).setUint16(0, value, false);
  return bytes;
}

function mp4U32(value) {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, value >>> 0, false);
  return bytes;
}

function createMjpegAvi(frames, width, height, fps) {
  const maxFrameSize = frames.reduce((max, frame) => Math.max(max, frame.length), 0);
  const frameChunksSize = frames.reduce((total, frame) => total + 8 + evenSize(frame.length), 0);
  const moviListSize = 4 + frameChunksSize;
  const hdrl = createAviHeaderList(width, height, fps, frames.length, maxFrameSize);
  const idx1 = createAviIndex(frames);
  const riffSize = 4 + hdrl.length + 8 + moviListSize + idx1.length;

  const parts = [
    asciiBytes("RIFF"),
    u32(riffSize),
    asciiBytes("AVI "),
    hdrl,
    asciiBytes("LIST"),
    u32(moviListSize),
    asciiBytes("movi"),
  ];

  for (const frame of frames) {
    parts.push(asciiBytes("00dc"), u32(frame.length), frame);
    if (frame.length % 2) parts.push(new Uint8Array([0]));
  }

  parts.push(idx1);
  return new Blob(parts, { type: "video/x-msvideo" });
}

function createAviHeaderList(width, height, fps, frameCount, maxFrameSize) {
  const avih = createChunk("avih", concatBytes([
    u32(Math.round(1000000 / fps)),
    u32(Math.max(1, maxFrameSize * fps)),
    u32(0),
    u32(0x10),
    u32(frameCount),
    u32(0),
    u32(1),
    u32(maxFrameSize),
    u32(width),
    u32(height),
    u32(0), u32(0), u32(0), u32(0),
  ]));

  const strh = createChunk("strh", concatBytes([
    asciiBytes("vids"),
    asciiBytes("MJPG"),
    u32(0),
    u16(0), u16(0),
    u32(0),
    u32(1),
    u32(fps),
    u32(0),
    u32(frameCount),
    u32(maxFrameSize),
    u32(0xffffffff),
    u32(0),
    i16(0), i16(0), i16(width), i16(height),
  ]));

  const strf = createChunk("strf", concatBytes([
    u32(40),
    i32(width),
    i32(height),
    u16(1),
    u16(24),
    asciiBytes("MJPG"),
    u32(maxFrameSize),
    i32(0),
    i32(0),
    u32(0),
    u32(0),
  ]));

  const strlBody = concatBytes([asciiBytes("strl"), strh, strf]);
  const strl = concatBytes([asciiBytes("LIST"), u32(strlBody.length), strlBody]);
  const hdrlBody = concatBytes([asciiBytes("hdrl"), avih, strl]);
  return concatBytes([asciiBytes("LIST"), u32(hdrlBody.length), hdrlBody]);
}

function createAviIndex(frames) {
  const entries = [];
  let offset = 4;
  for (const frame of frames) {
    entries.push(asciiBytes("00dc"), u32(0x10), u32(offset), u32(frame.length));
    offset += 8 + evenSize(frame.length);
  }
  return createChunk("idx1", concatBytes(entries));
}

function createChunk(id, payload) {
  const padding = payload.length % 2 ? new Uint8Array([0]) : new Uint8Array();
  return concatBytes([asciiBytes(id), u32(payload.length), payload, padding]);
}

function canvasToJpegBytes(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error("Could not encode animation frame."));
        return;
      }
      resolve(new Uint8Array(await blob.arrayBuffer()));
    }, "image/jpeg", quality);
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

function nextBrowserFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function concatBytes(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function asciiBytes(value) {
  const bytes = new Uint8Array(value.length);
  for (let i = 0; i < value.length; i++) bytes[i] = value.charCodeAt(i);
  return bytes;
}

function evenSize(value) {
  return value + (value % 2);
}

function u16(value) {
  const bytes = new Uint8Array(2);
  const view = new DataView(bytes.buffer);
  view.setUint16(0, value, true);
  return bytes;
}

function i16(value) {
  const bytes = new Uint8Array(2);
  const view = new DataView(bytes.buffer);
  view.setInt16(0, value, true);
  return bytes;
}

function u32(value) {
  const bytes = new Uint8Array(4);
  const view = new DataView(bytes.buffer);
  view.setUint32(0, value >>> 0, true);
  return bytes;
}

function i32(value) {
  const bytes = new Uint8Array(4);
  const view = new DataView(bytes.buffer);
  view.setInt32(0, value, true);
  return bytes;
}

async function addWebmDuration(blob, durationMs) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const segment = findEbmlElement(bytes, 0, bytes.length, "18538067");
  if (!segment) return blob;

  const segmentEnd = segment.dataEnd ?? bytes.length;
  const info = findEbmlElement(bytes, segment.dataStart, segmentEnd, "1549A966");
  if (!info || info.dataEnd === null) return blob;

  const timecodeScaleElement = findEbmlElement(bytes, info.dataStart, info.dataEnd, "2AD7B1");
  const timecodeScale = timecodeScaleElement ? readUnsignedEbmlValue(bytes, timecodeScaleElement.dataStart, timecodeScaleElement.dataEnd) : 1000000;
  const durationValue = durationMs * 1000000 / timecodeScale;
  const durationElement = findEbmlElement(bytes, info.dataStart, info.dataEnd, "4489");

  if (durationElement) {
    const durationBytes = encodeEbmlFloat(durationValue, durationElement.dataEnd - durationElement.dataStart);
    if (!durationBytes) return blob;
    const patched = new Uint8Array(bytes);
    patched.set(durationBytes, durationElement.dataStart);
    return new Blob([patched], { type: blob.type });
  }

  const durationBytes = new Uint8Array([0x44, 0x89, 0x88, ...encodeEbmlFloat(durationValue, 8)]);
  const newInfoSize = info.size + durationBytes.length;
  const newInfoSizeBytes = encodeEbmlSize(newInfoSize, info.sizeLength);
  if (!newInfoSizeBytes) return blob;

  let newSegmentSizeBytes = null;
  if (!segment.unknownSize) {
    newSegmentSizeBytes = encodeEbmlSize(segment.size + durationBytes.length, segment.sizeLength);
    if (!newSegmentSizeBytes) return blob;
  }

  const patched = new Uint8Array(bytes.length + durationBytes.length);
  patched.set(bytes.slice(0, info.dataEnd), 0);
  patched.set(durationBytes, info.dataEnd);
  patched.set(bytes.slice(info.dataEnd), info.dataEnd + durationBytes.length);
  patched.set(newInfoSizeBytes, info.sizeStart);
  if (newSegmentSizeBytes) patched.set(newSegmentSizeBytes, segment.sizeStart);
  return new Blob([patched], { type: blob.type });
}

function findEbmlElement(bytes, start, end, wantedId) {
  let offset = start;
  while (offset < end) {
    const element = readEbmlElement(bytes, offset, end);
    if (!element) return null;
    if (element.id === wantedId) return element;
    const next = element.dataEnd ?? end;
    if (next <= offset) return null;
    offset = next;
  }
  return null;
}

function readEbmlElement(bytes, offset, end) {
  const id = readEbmlId(bytes, offset, end);
  if (!id) return null;
  const size = readEbmlSize(bytes, id.next, end);
  if (!size) return null;
  const dataStart = size.next;
  const dataEnd = size.unknown ? null : dataStart + size.value;
  if (dataStart > end || (dataEnd !== null && dataEnd > end)) return null;
  return {
    id: id.value,
    idStart: offset,
    idLength: id.length,
    sizeStart: id.next,
    sizeLength: size.length,
    size: size.value,
    unknownSize: size.unknown,
    dataStart,
    dataEnd,
  };
}

function readEbmlId(bytes, offset, end) {
  if (offset >= end) return null;
  const length = ebmlVintLength(bytes[offset]);
  if (!length || offset + length > end) return null;
  let value = "";
  for (let i = 0; i < length; i++) value += bytes[offset + i].toString(16).padStart(2, "0");
  return { value: value.toUpperCase(), length, next: offset + length };
}

function readEbmlSize(bytes, offset, end) {
  if (offset >= end) return null;
  const length = ebmlVintLength(bytes[offset]);
  if (!length || offset + length > end) return null;
  const marker = 1 << (8 - length);
  let value = BigInt(bytes[offset] & (marker - 1));
  for (let i = 1; i < length; i++) value = (value << 8n) + BigInt(bytes[offset + i]);
  const unknown = value === ((1n << BigInt(7 * length)) - 1n);
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) return null;
  return { value: Number(value), length, next: offset + length, unknown };
}

function ebmlVintLength(firstByte) {
  for (let length = 1; length <= 8; length++) {
    if (firstByte & (1 << (8 - length))) return length;
  }
  return 0;
}

function encodeEbmlSize(value, length) {
  const maxValue = (1n << BigInt(7 * length)) - 2n;
  let remaining = BigInt(value);
  if (remaining < 0 || remaining > maxValue) return null;
  const bytes = new Uint8Array(length);
  for (let i = length - 1; i >= 0; i--) {
    bytes[i] = Number(remaining & 0xffn);
    remaining >>= 8n;
  }
  bytes[0] |= 1 << (8 - length);
  return bytes;
}

function encodeEbmlFloat(value, length) {
  if (length !== 4 && length !== 8) return null;
  const bytes = new Uint8Array(length);
  const view = new DataView(bytes.buffer);
  if (length === 4) view.setFloat32(0, value, false);
  else view.setFloat64(0, value, false);
  return bytes;
}

function readUnsignedEbmlValue(bytes, start, end) {
  let value = 0;
  for (let offset = start; offset < end; offset++) value = value * 256 + bytes[offset];
  return value || 1000000;
}

function preferredVideoMimeType() {
  const candidates = [
    ...mp4MimeCandidates(),
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function mp4MimeCandidates() {
  return [
    "video/mp4;codecs=avc1.42E01E",
    "video/mp4;codecs=avc1.4D401E",
    "video/mp4;codecs=avc1.64001F",
    "video/mp4;codecs=avc1",
    "video/mp4;codecs=h264",
    "video/mp4",
  ];
}

function createVideoRecorder(stream, mimeType) {
  const options = { videoBitsPerSecond: 14000000 };
  if (mimeType) options.mimeType = mimeType;
  return new MediaRecorder(stream, options);
}

function ensureVideoReady() {
  if (sourceVideo.readyState >= 2 && Number.isFinite(sourceVideo.duration)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const onReady = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("The video could not be loaded."));
    };
    const cleanup = () => {
      sourceVideo.removeEventListener("loadedmetadata", onReady);
      sourceVideo.removeEventListener("canplay", onReady);
      sourceVideo.removeEventListener("error", onError);
    };
    sourceVideo.addEventListener("loadedmetadata", onReady);
    sourceVideo.addEventListener("canplay", onReady);
    sourceVideo.addEventListener("error", onError);
    sourceVideo.load();
  });
}

function seekSourceVideo(time) {
  if (sourceVideo.readyState >= 2 && Math.abs(sourceVideo.currentTime - time) < 0.01) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      sourceVideo.removeEventListener("seeked", done);
      resolve();
    };
    sourceVideo.addEventListener("seeked", done, { once: true });
    sourceVideo.currentTime = time;
  });
}

function monitorVideoExport(startedAt) {
  if (!state.isExportingVideo || sourceVideo.paused || sourceVideo.ended) return;
  const percent = Number.isFinite(sourceVideo.duration)
    ? Math.round((sourceVideo.currentTime / sourceVideo.duration) * 100)
    : 0;
  const elapsed = Math.round((performance.now() - startedAt) / 1000);
  const size = state.videoExportSize ? ` at ${describeVideoExportSize(state.videoExportSize)}` : "";
  controls.statusText.textContent = `Recording video${size}: ${percent}% (${elapsed}s).`;
  requestAnimationFrame(() => monitorVideoExport(startedAt));
}

function drawSolo() {
  if (state.view === "compare" || !outputCanvas.width) return;
  const source = state.view === "source" ? sourceCanvas : outputCanvas;
  soloCanvas.width = source.width;
  soloCanvas.height = source.height;
  soloCtx.clearRect(0, 0, soloCanvas.width, soloCanvas.height);
  soloCtx.drawImage(source, 0, 0);
}

function updatePalettePreview() {
  const colors = palettes[controls.paletteSelect.value] || [];
  controls.palettePreview.innerHTML = "";
  colors.slice(0, Number(controls.depth.value)).forEach((color) => {
    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.background = color;
    controls.palettePreview.append(swatch);
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function writePixel(data, idx, color, alpha) {
  data[idx] = clamp(color[0]);
  data[idx + 1] = clamp(color[1]);
  data[idx + 2] = clamp(color[2]);
  data[idx + 3] = alpha;
}

function luminance(r, g, b) {
  return r * 0.299 + g * 0.587 + b * 0.114;
}

function seededNoise(x, y, seed = 0) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function clamp(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function wrap(value, max) {
  return ((value % max) + max) % max;
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("")}`;
}

function formatTime(value) {
  const minutes = Math.floor(value / 60).toString().padStart(2, "0");
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

init();
