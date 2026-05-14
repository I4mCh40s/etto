const sourceCanvas = document.querySelector("#sourceCanvas");
const outputCanvas = document.querySelector("#outputCanvas");
const soloCanvas = document.querySelector("#soloCanvas");
const sourceVideo = document.querySelector("#sourceVideo");
const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
const outputCtx = outputCanvas.getContext("2d", { willReadFrequently: true });
const soloCtx = soloCanvas.getContext("2d", { willReadFrequently: true });

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
  effectEditor: document.querySelector("#effectEditor"),
  selectedEffectName: document.querySelector("#selectedEffectName"),
  selectedEffectParam: document.querySelector("#selectedEffectParam"),
  selectedEffectValue: document.querySelector("#selectedEffectValue"),
  selectedEffectAmount: document.querySelector("#selectedEffectAmount"),
  resolution: document.querySelector("#resolution"),
  threshold: document.querySelector("#threshold"),
  patternSize: document.querySelector("#patternSize"),
  errorStrength: document.querySelector("#errorStrength"),
  phase: document.querySelector("#phase"),
  depth: document.querySelector("#depth"),
  brightness: document.querySelector("#brightness"),
  contrast: document.querySelector("#contrast"),
  textEnabled: document.querySelector("#textEnabled"),
  textControls: document.querySelector("#textControls"),
  textContent: document.querySelector("#textContent"),
  textFont: document.querySelector("#textFont"),
  textColor: document.querySelector("#textColor"),
  textSize: document.querySelector("#textSize"),
  textX: document.querySelector("#textX"),
  textY: document.querySelector("#textY"),
  textAlign: document.querySelector("#textAlign"),
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
};

function init() {
  populateSelects();
  bindEvents();
  drawSample();
  renderEffectStack();
  updatePalettePreview();
  scheduleRender();
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

function bindEvents() {
  controls.imageInput.addEventListener("change", handleImages);
  controls.videoInput.addEventListener("change", handleVideo);
  controls.invertButton.addEventListener("click", toggleInvert);
  controls.resetButton.addEventListener("click", resetWorkspace);
  controls.applyPreset.addEventListener("click", applyPreset);
  controls.selectedEffectAmount.addEventListener("input", updateSelectedEffectAmount);
  controls.textEnabled.addEventListener("input", updateTextControlsState);
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
    controls.textEnabled,
    controls.textContent,
    controls.textFont,
    controls.textColor,
    controls.textSize,
    controls.textX,
    controls.textY,
    controls.textAlign,
    controls.blur,
    controls.lossless,
  ].forEach((control) => {
    control.addEventListener("input", () => {
      updatePalettePreview();
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
  controls.textEnabled.checked = false;
  controls.textContent.value = "ETTO";
  controls.textFont.value = "Inter, Arial, sans-serif";
  controls.textColor.value = "#ffffff";
  controls.textSize.value = "14";
  controls.textX.value = "50";
  controls.textY.value = "50";
  controls.textAlign.value = "center";
  controls.animationDuration.value = "5";
  controls.lossless.checked = true;
  state.effects = [];
  state.selectedEffectIndex = -1;
  state.invertColors = false;
  updateInvertButton();
  updateTextControlsState();
  setView("compare");
  updatePalettePreview();
  renderEffectStack();
  controls.statusText.textContent = "Reset controls and removed effects.";
  scheduleRender();
}

function updateTextControlsState() {
  controls.textControls.classList.toggle("text-muted-controls", !controls.textEnabled.checked);
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
  }
  state.selectedEffectIndex = state.effects.length ? 0 : -1;
  updatePalettePreview();
  renderEffectStack();
  scheduleRender();
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
  scheduleRender();
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
  const fit = fullResolution ? 1 : Math.min(1, maxSide / Math.max(naturalWidth, naturalHeight));
  const width = Math.max(16, Math.round(naturalWidth * fit * scale));
  const height = Math.max(16, Math.round(naturalHeight * fit * scale));

  sourceCanvas.width = width;
  sourceCanvas.height = height;
  outputCanvas.width = width;
  outputCanvas.height = height;
  sourceCtx.drawImage(source, 0, 0, width, height);
  applySourceInvert(width, height);
  drawTextLayer(width, height);

  const imageData = sourceCtx.getImageData(0, 0, width, height);
  applyPreAdjustments(imageData);
  const processed = applyAlgorithm(imageData);
  const effected = applyEffects(processed);
  outputCtx.putImageData(effected, 0, 0);
  drawSolo();

  const elapsed = Math.round(performance.now() - started);
  controls.renderMeta.textContent = `${elapsed} ms`;
  controls.exportMeta.textContent = `${width} x ${height}`;
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

function drawTextLayer(width, height) {
  if (!controls.textEnabled.checked) return;
  const text = controls.textContent.value.trim();
  if (!text) return;

  const sizePercent = Number(controls.textSize.value);
  const fontSize = Math.max(8, Math.round((Math.min(width, height) * sizePercent) / 100));
  const x = (Number(controls.textX.value) / 100) * width;
  const y = (Number(controls.textY.value) / 100) * height;

  sourceCtx.save();
  sourceCtx.font = `700 ${fontSize}px ${controls.textFont.value}`;
  sourceCtx.fillStyle = controls.textColor.value;
  sourceCtx.textAlign = controls.textAlign.value;
  sourceCtx.textBaseline = "middle";
  sourceCtx.shadowColor = "rgba(0, 0, 0, 0.35)";
  sourceCtx.shadowBlur = Math.max(2, fontSize * 0.08);
  sourceCtx.shadowOffsetX = Math.max(1, fontSize * 0.03);
  sourceCtx.shadowOffsetY = Math.max(1, fontSize * 0.03);
  sourceCtx.fillText(text, x, y, width * 0.92);
  sourceCtx.restore();
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

function applyEffects(imageData) {
  const stacked = state.effects.reduce((current, effect) => {
    if (effect.type === "epsilon") return epsilonGlow(current, effect.amount);
    if (effect.type === "blur") return blurImage(current, effect.amount * 3);
    if (effect.type === "trail") return signalTrail(current, effect.amount);
    if (effect.type === "bloom") return phosphorBloom(current, effect.amount);
    if (effect.type === "jpeg") return jpegGlitch(current, effect.amount);
    if (effect.type === "chromatic") return chromaticAberration(current, effect.amount);
    if (effect.type === "scanlines") return scanlines(current, effect.amount);
    if (effect.type === "vignette") return vignette(current, effect.amount);
    if (effect.type === "noise") return signalNoise(current, effect.amount);
    if (effect.type === "cmyk") return cmykHalftone(current, effect.amount);
    return current;
  }, imageData);
  const blurAmount = Number(controls.blur.value);
  return blurAmount > 0 ? blurImage(stacked, blurAmount) : stacked;
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
  controls.statusText.textContent = "Palette extracted from the current source.";
  scheduleRender();
}

function addEffect() {
  state.effects.push({ type: controls.effectSelect.value, amount: 0.55 });
  state.selectedEffectIndex = state.effects.length - 1;
  renderEffectStack();
  scheduleRender();
}

function renderEffectStack() {
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
  scheduleRender();
}

function removeEffect(index) {
  state.effects.splice(index, 1);
  if (state.effects.length === 0) state.selectedEffectIndex = -1;
  else state.selectedEffectIndex = Math.min(index, state.effects.length - 1);
  renderEffectStack();
  scheduleRender();
}

function updateSelectedEffectAmount() {
  const effect = state.effects[state.selectedEffectIndex];
  if (!effect) return;
  effect.amount = Number(controls.selectedEffectAmount.value);
  updateEffectEditor();
  scheduleRender();
}

function updateEffectEditor() {
  const effect = state.effects[state.selectedEffectIndex];
  controls.effectEditor.classList.toggle("hidden", !effect);
  if (!effect) return;

  const meta = effectParamMeta(effect.type);
  controls.selectedEffectName.textContent = effectName(effect.type);
  controls.selectedEffectParam.textContent = meta.label;
  controls.selectedEffectAmount.min = meta.min;
  controls.selectedEffectAmount.max = meta.max;
  controls.selectedEffectAmount.step = meta.step;
  controls.selectedEffectAmount.value = String(effect.amount);
  controls.selectedEffectValue.textContent = meta.format(effect.amount);
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
  };
  return metas[type] || { label: "Strength", min: "0", max: "1.5", step: "0.01", format: percent };
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
  if (!outputCanvas.captureStream || typeof MediaRecorder === "undefined") {
    controls.statusText.textContent = "This browser cannot record canvas video exports.";
    return;
  }

  try {
    state.isExportingVideo = true;
    controls.exportVideo.disabled = true;
    controls.exportVideo.textContent = "Recording...";
    controls.statusText.textContent = "Preparing video export.";

    await ensureVideoReady();
    sourceVideo.pause();
    await seekSourceVideo(0);
    render();

    const mimeType = preferredVideoMimeType();
    const stream = outputCanvas.captureStream(30);
    const recorder = createVideoRecorder(stream, mimeType);
    const chunks = [];
    const startedAt = performance.now();

    recorder.addEventListener("dataavailable", (event) => {
      if (event.data && event.data.size > 0) chunks.push(event.data);
    });

    const stopped = new Promise((resolve, reject) => {
      recorder.addEventListener("stop", resolve, { once: true });
      recorder.addEventListener("error", () => reject(recorder.error), { once: true });
    });

    const stopRecording = () => {
      if (recorder.state !== "inactive") {
        recorder.requestData();
        recorder.stop();
      }
    };

    sourceVideo.addEventListener("ended", stopRecording, { once: true });
    recorder.start(250);
    await sourceVideo.play();
    controls.playButton.textContent = "||";
    controls.statusText.textContent = "Recording processed video in real time.";
    monitorVideoExport(startedAt);
    await stopped;
    stream.getTracks().forEach((track) => track.stop());

    const finalType = recorder.mimeType || mimeType || "video/webm";
    const extension = finalType.includes("mp4") ? "mp4" : "webm";
    controls.statusText.textContent = "Finalizing video duration metadata.";
    const blob = await finalizeRecordedVideo(chunks, finalType, sourceVideo.duration * 1000);
    downloadBlob(blob, `${state.sourceName || "etto"}-dither.${extension}`);
    controls.statusText.textContent = `Video export ready: ${extension.toUpperCase()}.`;
  } catch (error) {
    controls.statusText.textContent = `Video export failed: ${error.message || error}`;
  } finally {
    state.isExportingVideo = false;
    controls.exportVideo.disabled = false;
    controls.exportVideo.textContent = "Video";
    sourceVideo.pause();
  }
}

async function exportAnimation() {
  if (!state.sourceImage) {
    controls.statusText.textContent = "Import an image first, then animate it.";
    return;
  }
  if (state.isExportingAnimation) return;

  const duration = Number(controls.animationDuration.value) || 5;
  const fps = 12;
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
    render();

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

    controls.statusText.textContent = "Muxing deterministic AVI video.";
    const blob = createMjpegAvi(frames, outputCanvas.width, outputCanvas.height, fps);
    downloadBlob(blob, `${state.sourceName || "etto"}-animated-${duration}s.avi`);
    controls.statusText.textContent = `Still animation ready: ${duration}s AVI at ${outputCanvas.width} x ${outputCanvas.height}.`;
  } catch (error) {
    controls.statusText.textContent = `Still animation failed: ${error.message || error}`;
  } finally {
    state.isExportingAnimation = false;
    controls.exportAnimation.disabled = false;
    controls.exportAnimation.textContent = "Animate Still";
    controls.phase.value = String(originalPhase);
    setMode(originalMode);
    if (originalView !== state.view) setView(originalView);
    scheduleRender();
  }
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
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4;codecs=h264",
    "video/mp4",
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
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
  controls.statusText.textContent = `Recording video: ${percent}% (${elapsed}s).`;
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
