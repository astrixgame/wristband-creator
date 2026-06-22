import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/environments/RoomEnvironment.js";
import * as _ot from "https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.module.js";
import { PDFDocument, rgb } from "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.esm.js";
const opentype = _ot.default || _ot;

const DEFAULT_BEND_ANGLE = Number(((10 / 34) * (180 / Math.PI)).toFixed(2));
const FONT_OPTIONS = ["Orbitron", "Cinzel", "Rajdhani", "Montserrat", "Oswald", "Playfair Display", "Bebas Neue"];
const VALID_FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const MATERIAL_PRESETS = { silver: "#c6ccd1", gold: "#cda349" };
const CORNER_MODES = ["none", "all", "top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"];
const BG_SOLID = { black: "#000000", midnight: "#04080f", charcoal: "#1a1a1a", navy: "#050f1a", "warm-dark": "#100a03", "studio-gray": "#252525" };
const BG_PRESETS = ["black", "midnight", "charcoal", "navy", "warm-dark", "studio-gray", "gradient-dark", "gradient-warm", "gradient-cool", "marble", "grid", "custom"];

const PARAM_DEFAULTS = {
    plate: {
        materialPreset: "silver",
        color: MATERIAL_PRESETS.silver,
        shininess: 66,
        width: 10,
        height: 1,
        depth: 0.26,
        bendAngle: DEFAULT_BEND_ANGLE,
        cornerRadius: 0,
        cornerMode: "none"
    },
    front: { text: "FRONT TEXT", font: "Orbitron", fs: 124, ls: 2, fw: 700, fst: "normal", tt: "none", mt: 12, mr: 120, mb: 12, ml: 120 },
    back: { text: "BACK TEXT", font: "Cinzel", fs: 98, ls: 1, fw: 600, fst: "normal", tt: "none", mt: 12, mr: 120, mb: 12, ml: 120 },
    bg: { preset: "black", color: "#000000" },
    band: { visible: false, type: "band", color: "#222222", thickness: 0.22, length: 1.5, metalness: 0 }
};

const LIMITS = {
    fs: [32, 1120], ls: [-50, 300], fw: [100, 900], mt: [0, 180], mr: [0, 500], mb: [0, 180], ml: [0, 500],
    shininess: [0, 100], width: [4, 20], height: [0.4, 4], depth: [0.08, 1.2], bendAngle: [0, 120], cornerRadius: [0, 2],
    bandThickness: [0.05, 0.8], bandLength: [1.1, 2.5], bandMetalness: [0, 1]
};

const app = document.getElementById("app");
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.outputColorSpace = THREE.SRGBColorSpace;
app.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 3.2, 23);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 12;
controls.maxDistance = 40;
controls.target.set(0, 0, 0);

scene.add(new THREE.AmbientLight(0xffffff, 0.35));
scene.add(new THREE.HemisphereLight(0xdde7ff, 0x1c1c1c, 0.55));
const key = new THREE.DirectionalLight(0xffffff, 1.0); key.position.set(12, 7, 12); scene.add(key);
const lf = new THREE.DirectionalLight(0xe9f1ff, 0.85); lf.position.set(-14, 2, 8); scene.add(lf);
const rf = new THREE.DirectionalLight(0xfff7eb, 0.85); rf.position.set(14, 2, 8); scene.add(rf);
const tf = new THREE.DirectionalLight(0xffffff, 0.55); tf.position.set(0, 11, 2); scene.add(tf);
const rim = new THREE.DirectionalLight(0xffffff, 0.65); rim.position.set(0, 5, -11); scene.add(rim);

const ui = {
    plate: {
        materialPreset: document.getElementById("plateMaterialPreset"),
        color: document.getElementById("plateColor"),
        shininess: document.getElementById("plateShininess"), shininessOut: document.getElementById("plateShininessOut"),
        width: document.getElementById("plateWidth"), widthOut: document.getElementById("plateWidthOut"),
        height: document.getElementById("plateHeight"), heightOut: document.getElementById("plateHeightOut"),
        depth: document.getElementById("plateDepth"), depthOut: document.getElementById("plateDepthOut"),
        bendAngle: document.getElementById("plateBendAngle"), bendAngleOut: document.getElementById("plateBendAngleOut"),
        cornerRadius: document.getElementById("plateCornerRadius"), cornerRadiusOut: document.getElementById("plateCornerRadiusOut"),
        cornerMode: document.getElementById("plateCornerMode")
    },
    front: {
        text: document.getElementById("frontText"), fontPreset: document.getElementById("frontFontPreset"), fontFamily: document.getElementById("frontFontFamily"),
        fontSize: document.getElementById("frontFontSize"), fontSizeOut: document.getElementById("frontFontSizeOut"),
        letterSpacing: document.getElementById("frontLetterSpacing"), letterSpacingOut: document.getElementById("frontLetterSpacingOut"),
        fontWeight: document.getElementById("frontFontWeight"), fontWeightOut: document.getElementById("frontFontWeightOut"),
        fontStyle: document.getElementById("frontFontStyle"), textTransform: document.getElementById("frontTextTransform"),
        marginTop: document.getElementById("frontMarginTop"), marginTopOut: document.getElementById("frontMarginTopOut"),
        marginRight: document.getElementById("frontMarginRight"), marginRightOut: document.getElementById("frontMarginRightOut"),
        marginBottom: document.getElementById("frontMarginBottom"), marginBottomOut: document.getElementById("frontMarginBottomOut"),
        marginLeft: document.getElementById("frontMarginLeft"), marginLeftOut: document.getElementById("frontMarginLeftOut")
    },
    back: {
        text: document.getElementById("backText"), fontPreset: document.getElementById("backFontPreset"), fontFamily: document.getElementById("backFontFamily"),
        fontSize: document.getElementById("backFontSize"), fontSizeOut: document.getElementById("backFontSizeOut"),
        letterSpacing: document.getElementById("backLetterSpacing"), letterSpacingOut: document.getElementById("backLetterSpacingOut"),
        fontWeight: document.getElementById("backFontWeight"), fontWeightOut: document.getElementById("backFontWeightOut"),
        fontStyle: document.getElementById("backFontStyle"), textTransform: document.getElementById("backTextTransform"),
        marginTop: document.getElementById("backMarginTop"), marginTopOut: document.getElementById("backMarginTopOut"),
        marginRight: document.getElementById("backMarginRight"), marginRightOut: document.getElementById("backMarginRightOut"),
        marginBottom: document.getElementById("backMarginBottom"), marginBottomOut: document.getElementById("backMarginBottomOut"),
        marginLeft: document.getElementById("backMarginLeft"), marginLeftOut: document.getElementById("backMarginLeftOut")
    },
    bg: {
        preset: document.getElementById("bgPreset"),
        color: document.getElementById("bgColor"),
        colorLabel: document.getElementById("bgCustomColorLabel")
    },
    band: {
        visible: document.getElementById("bandVisible"),
        type: document.getElementById("bandType"),
        color: document.getElementById("bandColor"),
        thickness: document.getElementById("bandThickness"), thicknessOut: document.getElementById("bandThicknessOut"),
        length: document.getElementById("bandLength"), lengthOut: document.getElementById("bandLengthOut"),
        metalness: document.getElementById("bandMetalness"), metalnessOut: document.getElementById("bandMetalnessOut")
    }
};

const state = readStateFromUrl();
hydrateUiFromState();
loadGoogleFont(state.front.font, "front");
loadGoogleFont(state.back.font, "back");

let bandGroup = null;
let plateMesh = buildPlate();
updatePlateTextures();
rebuildBand();
applyBackground();
updateUrlFromState();

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
function toNumber(raw, fallback, min, max) {
    const n = parseFloat(raw);
    if (!Number.isFinite(n)) { return fallback; }
    return clamp(n, min, max);
}
function sanitizeFontFamily(v) {
    const clean = String(v || "").replace(/[^a-zA-Z0-9\s-]/g, "").trim();
    return clean || PARAM_DEFAULTS.front.font;
}
function sanitizeHex(v, fallback) {
    const c = String(v || "").trim();
    return /^#[0-9a-fA-F]{6}$/.test(c) ? c.toLowerCase() : fallback;
}
function format(n, decimals) {
    return Number(n).toFixed(decimals).replace(/\.0+$|(?<=\..*?)0+$/g, "");
}

function applyTextTransform(text, transform) {
    if (transform === "uppercase") { return text.toUpperCase(); }
    if (transform === "lowercase") { return text.toLowerCase(); }
    if (transform === "capitalize") { return text.replace(/\b(\w)/g, (m) => m.toUpperCase()); }
    return text;
}

function getMaxCornerRadius() {
    return Math.max(0, Math.min(state.plate.width, state.plate.height) / 2 - 0.001);
}

function syncCornerRadiusRange() {
    const max = getMaxCornerRadius();
    ui.plate.cornerRadius.max = String(max > 0 ? max : 0.01);
    state.plate.cornerRadius = clamp(state.plate.cornerRadius, 0, max);
    ui.plate.cornerRadius.value = String(state.plate.cornerRadius);
}

function normalizePlatePreset() {
    if (state.plate.materialPreset === "silver") { state.plate.color = MATERIAL_PRESETS.silver; }
    if (state.plate.materialPreset === "gold") { state.plate.color = MATERIAL_PRESETS.gold; }
}

function loadGoogleFont(fontFamily, side) {
    const fontId = `dynamic-google-font-${side}`;
    const encoded = fontFamily.trim().replace(/\s+/g, "+");
    const href = `https://fonts.googleapis.com/css2?family=${encoded}:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap`;
    let fontLink = document.getElementById(fontId);
    if (!fontLink) {
        fontLink = document.createElement("link");
        fontLink.id = fontId;
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);
    }
    if (fontLink.getAttribute("href") !== href) { fontLink.setAttribute("href", href); }
}

function colorLightened(hex, amount) {
    const color = new THREE.Color(hex);
    color.lerp(new THREE.Color("#ffffff"), amount);
    return `#${color.getHexString()}`;
}

function measureSpacedText(ctx, text, spacing) {
    if (!text.length) { return 0; }
    let width = 0;
    for (let i = 0; i < text.length; i += 1) {
        width += ctx.measureText(text[i]).width;
        if (i < text.length - 1) { width += spacing; }
    }
    return width;
}

function drawTextWithLetterSpacing(ctx, text, x, y, spacing) {
    let cursorX = x;
    for (let i = 0; i < text.length; i += 1) {
        const glyph = text[i];
        ctx.fillText(glyph, cursorX, y);
        cursorX += ctx.measureText(glyph).width + spacing;
    }
}

function createFaceTexture(side) {
    const canvas = document.createElement("canvas");
    canvas.width = 4096;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const s = state[side];
    const textColor = side === "front" ? "#111111" : "#1a1a1a";
    const faceColor = colorLightened(state.plate.color, 0.18);

    const usableWidth = Math.max(32, canvas.width - s.ml - s.mr);
    const usableHeight = Math.max(32, canvas.height - s.mt - s.mb);
    const centerX = s.ml + usableWidth / 2;
    const centerY = s.mt + usableHeight / 2;

    const text = applyTextTransform(s.text, s.tt);
    ctx.fillStyle = faceColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = textColor;
    ctx.font = `${s.fst} ${s.fw} ${s.fs}px "${s.font}"`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const textWidth = measureSpacedText(ctx, text, s.ls);
    drawTextWithLetterSpacing(ctx, text, centerX - textWidth / 2, centerY, s.ls);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
    return texture;
}

function getCornerRadii(mode, radius) {
    const r = { tl: 0, tr: 0, bl: 0, br: 0 };
    if (radius <= 0 || mode === "none") { return r; }
    if (mode === "all") { r.tl = r.tr = r.bl = r.br = radius; }
    if (mode === "top") { r.tl = r.tr = radius; }
    if (mode === "bottom") { r.bl = r.br = radius; }
    if (mode === "left") { r.tl = r.bl = radius; }
    if (mode === "right") { r.tr = r.br = radius; }
    if (mode === "top-left") { r.tl = radius; }
    if (mode === "top-right") { r.tr = radius; }
    if (mode === "bottom-left") { r.bl = radius; }
    if (mode === "bottom-right") { r.br = radius; }
    return r;
}

function applyCornerRadius(geometry, width, height, radius, mode) {
    const rr = getCornerRadii(mode, clamp(radius, 0, Math.min(width, height) / 2));
    if (rr.tl === 0 && rr.tr === 0 && rr.bl === 0 && rr.br === 0) { return; }

    const hw = width / 2;
    const hh = height / 2;
    const pos = geometry.attributes.position;

    const corners = [
        { key: "tl", cx: -hw + rr.tl, cy: hh - rr.tl, sx: -1, sy: 1 },
        { key: "tr", cx: hw - rr.tr, cy: hh - rr.tr, sx: 1, sy: 1 },
        { key: "bl", cx: -hw + rr.bl, cy: -hh + rr.bl, sx: -1, sy: -1 },
        { key: "br", cx: hw - rr.br, cy: -hh + rr.br, sx: 1, sy: -1 }
    ];

    for (let i = 0; i < pos.count; i += 1) {
        let x = pos.getX(i);
        let y = pos.getY(i);

        for (const c of corners) {
            const r = rr[c.key];
            if (r <= 0) { continue; }
            const inX = c.sx > 0 ? x > c.cx : x < c.cx;
            const inY = c.sy > 0 ? y > c.cy : y < c.cy;
            if (!inX || !inY) { continue; }

            const dx = x - c.cx;
            const dy = y - c.cy;
            const len = Math.hypot(dx, dy);
            if (len > r && len > 0) {
                const sc = r / len;
                x = c.cx + dx * sc;
                y = c.cy + dy * sc;
                pos.setX(i, x);
                pos.setY(i, y);
            }
            break;
        }
    }
    pos.needsUpdate = true;
}

function applyBend(geometry, width, angleDeg) {
    const angle = THREE.MathUtils.degToRad(angleDeg);
    if (Math.abs(angle) < 0.0001) {
        geometry.computeVertexNormals();
        return;
    }
    const radius = width / angle;
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const t = x / radius;
        pos.setX(i, Math.sin(t) * radius);
        pos.setZ(i, Math.cos(t) * radius - radius + z);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
}

function materialPropsFromShininess(sh) {
    const t = clamp(sh, 0, 100) / 100;
    return {
        roughness: clamp(0.92 - 0.82 * t, 0.08, 0.95),
        clearcoat: clamp(0.2 + 0.7 * t, 0, 1),
        clearcoatRoughness: clamp(0.5 - 0.4 * t, 0.04, 0.7),
        envMapIntensity: clamp(0.8 + 1.4 * t, 0.4, 3)
    };
}

function createPlateMaterials() {
    const props = materialPropsFromShininess(state.plate.shininess);
    const side = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(state.plate.color),
        metalness: 1,
        roughness: props.roughness,
        clearcoat: props.clearcoat,
        clearcoatRoughness: props.clearcoatRoughness,
        envMapIntensity: props.envMapIntensity
    });
    const front = side.clone();
    const back = side.clone();
    return [side, side, side, side, front, back];
}

function createPlateGeometry() {
    const g = new THREE.BoxGeometry(state.plate.width, state.plate.height, state.plate.depth, 140, 16, 8);
    applyCornerRadius(g, state.plate.width, state.plate.height, state.plate.cornerRadius, state.plate.cornerMode);
    applyBend(g, state.plate.width, state.plate.bendAngle);
    return g;
}

function buildPlate() {
    const mesh = new THREE.Mesh(createPlateGeometry(), createPlateMaterials());
    mesh.rotation.x = -0.22;
    mesh.rotation.y = 0.35;
    scene.add(mesh);
    return mesh;
}

function disposePlate(mesh) {
    if (!mesh) { return; }
    scene.remove(mesh);
    if (mesh.geometry) { mesh.geometry.dispose(); }
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m) => {
        if (m.map) { m.map.dispose(); }
        m.dispose();
    });
}

function rebuildPlate() {
    disposePlate(plateMesh);
    plateMesh = buildPlate();
}

function replaceMaterialMap(material, texture) {
    if (material.map) { material.map.dispose(); }
    material.map = texture;
    material.needsUpdate = true;
}

function updatePlateTextures() {
    replaceMaterialMap(plateMesh.material[4], createFaceTexture("front"));
    replaceMaterialMap(plateMesh.material[5], createFaceTexture("back"));
}

function readSide(search, side) {
    const prefix = side === "front" ? "f" : "b";
    const d = PARAM_DEFAULTS[side];
    const legacyText = side === "front" ? search.get("front") : search.get("back");
    const legacyFont = search.get("font");
    const legacyFs = search.get("fs");
    const legacyLs = search.get("ls");
    const legacyFw = search.get("fw");
    const legacyFst = search.get("fst");
    const legacyTt = search.get("tt");
    const legacyMt = search.get("mt");
    const legacyMr = search.get("mr");
    const legacyMb = search.get("mb");
    const legacyMl = search.get("ml");
    const tt = search.get(`${prefix}_tt`) || legacyTt;

    return {
        text: (search.get(`${prefix}_text`) || legacyText || d.text).slice(0, 40),
        font: sanitizeFontFamily(search.get(`${prefix}_font`) || legacyFont || d.font),
        fs: toNumber(search.get(`${prefix}_fs`) || legacyFs, d.fs, LIMITS.fs[0], LIMITS.fs[1]),
        ls: toNumber(search.get(`${prefix}_ls`) || legacyLs, d.ls, LIMITS.ls[0], LIMITS.ls[1]),
        fw: toNumber(search.get(`${prefix}_fw`) || legacyFw, d.fw, LIMITS.fw[0], LIMITS.fw[1]),
        fst: (search.get(`${prefix}_fst`) || legacyFst) === "italic" ? "italic" : "normal",
        tt: ["none", "uppercase", "lowercase", "capitalize"].includes(tt) ? tt : "none",
        mt: toNumber(search.get(`${prefix}_mt`) || legacyMt, d.mt, LIMITS.mt[0], LIMITS.mt[1]),
        mr: toNumber(search.get(`${prefix}_mr`) || legacyMr, d.mr, LIMITS.mr[0], LIMITS.mr[1]),
        mb: toNumber(search.get(`${prefix}_mb`) || legacyMb, d.mb, LIMITS.mb[0], LIMITS.mb[1]),
        ml: toNumber(search.get(`${prefix}_ml`) || legacyMl, d.ml, LIMITS.ml[0], LIMITS.ml[1])
    };
}

function readPlate(search) {
    const d = PARAM_DEFAULTS.plate;
    const materialPreset = ["silver", "gold", "custom"].includes(search.get("p_mat")) ? search.get("p_mat") : d.materialPreset;
    const color = sanitizeHex(search.get("p_col") || d.color, d.color);
    const cornerMode = CORNER_MODES.includes(search.get("p_cm")) ? search.get("p_cm") : d.cornerMode;
    const plate = {
        materialPreset,
        color,
        shininess: toNumber(search.get("p_sh"), d.shininess, LIMITS.shininess[0], LIMITS.shininess[1]),
        width: toNumber(search.get("p_w"), d.width, LIMITS.width[0], LIMITS.width[1]),
        height: toNumber(search.get("p_h"), d.height, LIMITS.height[0], LIMITS.height[1]),
        depth: toNumber(search.get("p_d"), d.depth, LIMITS.depth[0], LIMITS.depth[1]),
        bendAngle: toNumber(search.get("p_ba"), d.bendAngle, LIMITS.bendAngle[0], LIMITS.bendAngle[1]),
        cornerRadius: toNumber(search.get("p_cr"), d.cornerRadius, LIMITS.cornerRadius[0], LIMITS.cornerRadius[1]),
        cornerMode
    };
    if (plate.materialPreset === "silver") { plate.color = MATERIAL_PRESETS.silver; }
    if (plate.materialPreset === "gold") { plate.color = MATERIAL_PRESETS.gold; }
    plate.cornerRadius = clamp(plate.cornerRadius, 0, Math.max(0, Math.min(plate.width, plate.height) / 2 - 0.001));
    return plate;
}

function readBg(search) {
    const d = PARAM_DEFAULTS.bg;
    const preset = BG_PRESETS.includes(search.get("bg_p")) ? search.get("bg_p") : d.preset;
    return { preset, color: sanitizeHex(search.get("bg_c"), d.color) };
}

function readBand(search) {
    const d = PARAM_DEFAULTS.band;
    const type = ["band", "chain"].includes(search.get("bd_t")) ? search.get("bd_t") : d.type;
    return {
        visible: search.get("bd_v") === "1",
        type,
        color: sanitizeHex(search.get("bd_c"), d.color),
        thickness: toNumber(search.get("bd_th"), d.thickness, LIMITS.bandThickness[0], LIMITS.bandThickness[1]),
        length: toNumber(search.get("bd_ln"), d.length, LIMITS.bandLength[0], LIMITS.bandLength[1]),
        metalness: toNumber(search.get("bd_m"), d.metalness, LIMITS.bandMetalness[0], LIMITS.bandMetalness[1])
    };
}

function readStateFromUrl() {
    const search = new URLSearchParams(window.location.search);
    return { plate: readPlate(search), front: readSide(search, "front"), back: readSide(search, "back"), bg: readBg(search), band: readBand(search) };
}

function hydrateUiFromState() {
    const p = state.plate;
    ui.plate.materialPreset.value = p.materialPreset;
    ui.plate.color.value = p.color;
    ui.plate.shininess.value = String(p.shininess);
    ui.plate.width.value = String(p.width);
    ui.plate.height.value = String(p.height);
    ui.plate.depth.value = String(p.depth);
    ui.plate.bendAngle.value = String(p.bendAngle);
    ui.plate.cornerRadius.value = String(p.cornerRadius);
    ui.plate.cornerMode.value = p.cornerMode;

    ["front", "back"].forEach((side) => {
        const s = state[side];
        const u = ui[side];
        u.text.value = s.text;
        u.fontPreset.value = FONT_OPTIONS.includes(s.font) ? s.font : "";
        u.fontFamily.value = s.font;
        u.fontSize.value = String(s.fs);
        u.letterSpacing.value = String(s.ls);
        u.fontWeight.value = String(s.fw);
        u.fontStyle.value = s.fst;
        u.textTransform.value = s.tt;
        u.marginTop.value = String(s.mt);
        u.marginRight.value = String(s.mr);
        u.marginBottom.value = String(s.mb);
        u.marginLeft.value = String(s.ml);
    });

    syncCornerRadiusRange();
    syncOutputLabels();

    ui.bg.preset.value = state.bg.preset;
    ui.bg.color.value = state.bg.color;
    ui.bg.colorLabel.style.display = state.bg.preset === "custom" ? "" : "none";

    ui.band.visible.checked = state.band.visible;
    ui.band.type.value = state.band.type;
    ui.band.color.value = state.band.color;
    ui.band.thickness.value = String(state.band.thickness);
    ui.band.length.value = String(state.band.length);
    ui.band.metalness.value = String(state.band.metalness);
}

function readStateFromUi() {
    const p = state.plate;
    p.materialPreset = ["silver", "gold", "custom"].includes(ui.plate.materialPreset.value) ? ui.plate.materialPreset.value : "silver";
    p.color = sanitizeHex(ui.plate.color.value, PARAM_DEFAULTS.plate.color);
    p.shininess = toNumber(ui.plate.shininess.value, PARAM_DEFAULTS.plate.shininess, LIMITS.shininess[0], LIMITS.shininess[1]);
    p.width = toNumber(ui.plate.width.value, PARAM_DEFAULTS.plate.width, LIMITS.width[0], LIMITS.width[1]);
    p.height = toNumber(ui.plate.height.value, PARAM_DEFAULTS.plate.height, LIMITS.height[0], LIMITS.height[1]);
    p.depth = toNumber(ui.plate.depth.value, PARAM_DEFAULTS.plate.depth, LIMITS.depth[0], LIMITS.depth[1]);
    p.bendAngle = toNumber(ui.plate.bendAngle.value, PARAM_DEFAULTS.plate.bendAngle, LIMITS.bendAngle[0], LIMITS.bendAngle[1]);
    p.cornerRadius = toNumber(ui.plate.cornerRadius.value, PARAM_DEFAULTS.plate.cornerRadius, LIMITS.cornerRadius[0], LIMITS.cornerRadius[1]);
    p.cornerMode = CORNER_MODES.includes(ui.plate.cornerMode.value) ? ui.plate.cornerMode.value : "none";
    normalizePlatePreset();
    syncCornerRadiusRange();

    state.bg.preset = BG_PRESETS.includes(ui.bg.preset.value) ? ui.bg.preset.value : "black";
    state.bg.color = sanitizeHex(ui.bg.color.value, PARAM_DEFAULTS.bg.color);

    state.band.visible = ui.band.visible.checked;
    state.band.type = ["band", "chain"].includes(ui.band.type.value) ? ui.band.type.value : "band";
    state.band.color = sanitizeHex(ui.band.color.value, PARAM_DEFAULTS.band.color);
    state.band.thickness = toNumber(ui.band.thickness.value, PARAM_DEFAULTS.band.thickness, LIMITS.bandThickness[0], LIMITS.bandThickness[1]);
    state.band.length = toNumber(ui.band.length.value, PARAM_DEFAULTS.band.length, LIMITS.bandLength[0], LIMITS.bandLength[1]);
    state.band.metalness = toNumber(ui.band.metalness.value, PARAM_DEFAULTS.band.metalness, LIMITS.bandMetalness[0], LIMITS.bandMetalness[1]);

    ["front", "back"].forEach((side) => {
        const s = state[side];
        const u = ui[side];
        const d = PARAM_DEFAULTS[side];
        s.text = u.text.value.slice(0, 40);
        s.font = sanitizeFontFamily(u.fontFamily.value || u.fontPreset.value);
        s.fs = toNumber(u.fontSize.value, d.fs, LIMITS.fs[0], LIMITS.fs[1]);
        s.ls = toNumber(u.letterSpacing.value, d.ls, LIMITS.ls[0], LIMITS.ls[1]);
        s.fw = toNumber(u.fontWeight.value, d.fw, LIMITS.fw[0], LIMITS.fw[1]);
        s.fst = u.fontStyle.value === "italic" ? "italic" : "normal";
        s.tt = ["none", "uppercase", "lowercase", "capitalize"].includes(u.textTransform.value) ? u.textTransform.value : "none";
        s.mt = toNumber(u.marginTop.value, d.mt, LIMITS.mt[0], LIMITS.mt[1]);
        s.mr = toNumber(u.marginRight.value, d.mr, LIMITS.mr[0], LIMITS.mr[1]);
        s.mb = toNumber(u.marginBottom.value, d.mb, LIMITS.mb[0], LIMITS.mb[1]);
        s.ml = toNumber(u.marginLeft.value, d.ml, LIMITS.ml[0], LIMITS.ml[1]);
    });
}

function syncOutputLabels() {
    const p = state.plate;
    ui.plate.shininessOut.value = format(p.shininess, 0);
    ui.plate.widthOut.value = format(p.width, 2);
    ui.plate.heightOut.value = format(p.height, 2);
    ui.plate.depthOut.value = format(p.depth, 2);
    ui.plate.bendAngleOut.value = format(p.bendAngle, 2);
    ui.plate.cornerRadiusOut.value = format(p.cornerRadius, 2);
    ui.plate.color.value = p.color;

    ["front", "back"].forEach((side) => {
        const s = state[side];
        const u = ui[side];
        u.fontSizeOut.value = format(s.fs, 0);
        u.letterSpacingOut.value = format(s.ls, 1);
        u.fontWeightOut.value = format(s.fw, 0);
        u.marginTopOut.value = format(s.mt, 0);
        u.marginRightOut.value = format(s.mr, 0);
        u.marginBottomOut.value = format(s.mb, 0);
        u.marginLeftOut.value = format(s.ml, 0);
    });

    ui.band.thicknessOut.value = format(state.band.thickness, 2);
    ui.band.lengthOut.value = format(state.band.length, 2);
    ui.band.metalnessOut.value = format(state.band.metalness, 2);
    ui.bg.colorLabel.style.display = state.bg.preset === "custom" ? "" : "none";
}

function updateUrlFromState() {
    const p = state.plate;
    const params = new URLSearchParams();
    params.set("p_mat", p.materialPreset);
    params.set("p_col", p.color);
    params.set("p_sh", String(p.shininess));
    params.set("p_w", String(p.width));
    params.set("p_h", String(p.height));
    params.set("p_d", String(p.depth));
    params.set("p_ba", String(p.bendAngle));
    params.set("p_cr", String(p.cornerRadius));
    params.set("p_cm", p.cornerMode);

    params.set("bg_p", state.bg.preset);
    params.set("bg_c", state.bg.color);
    params.set("bd_v", state.band.visible ? "1" : "0");
    params.set("bd_t", state.band.type);
    params.set("bd_c", state.band.color);
    params.set("bd_th", String(state.band.thickness));
    params.set("bd_ln", String(state.band.length));
    params.set("bd_m", String(state.band.metalness));

    ["front", "back"].forEach((side) => {
        const prefix = side === "front" ? "f" : "b";
        const s = state[side];
        params.set(`${prefix}_text`, s.text);
        params.set(`${prefix}_font`, s.font);
        params.set(`${prefix}_fs`, String(s.fs));
        params.set(`${prefix}_ls`, String(s.ls));
        params.set(`${prefix}_fw`, String(s.fw));
        params.set(`${prefix}_fst`, s.fst);
        params.set(`${prefix}_tt`, s.tt);
        params.set(`${prefix}_mt`, String(s.mt));
        params.set(`${prefix}_mr`, String(s.mr));
        params.set(`${prefix}_mb`, String(s.mb));
        params.set(`${prefix}_ml`, String(s.ml));
    });

    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}

function applyAllParams() {
    readStateFromUi();
    loadGoogleFont(state.front.font, "front");
    loadGoogleFont(state.back.font, "back");
    syncOutputLabels();
    rebuildPlate();
    updatePlateTextures();
    rebuildBand();
    applyBackground();
    updateUrlFromState();
}

// ======== BACKGROUND ========
function makeBgCanvas(type) {
    const W = 512, H = 512;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    if (type === "gradient-dark") {
        const g = ctx.createRadialGradient(W * 0.35, H * 0.25, 0, W * 0.5, H * 0.5, W * 0.85);
        g.addColorStop(0, "#1c1c1c"); g.addColorStop(1, "#050505");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    } else if (type === "gradient-warm") {
        const g = ctx.createRadialGradient(W * 0.4, H * 0.3, 0, W * 0.5, H * 0.5, W * 0.85);
        g.addColorStop(0, "#201408"); g.addColorStop(1, "#060301");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    } else if (type === "gradient-cool") {
        const g = ctx.createRadialGradient(W * 0.4, H * 0.3, 0, W * 0.5, H * 0.5, W * 0.85);
        g.addColorStop(0, "#0b1325"); g.addColorStop(1, "#020408");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    } else if (type === "marble") {
        ctx.fillStyle = "#ddd6cc"; ctx.fillRect(0, 0, W, H);
        for (let i = 0; i < 14; i++) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${160 + Math.random() * 40 | 0},${150 + Math.random() * 40 | 0},${140 + Math.random() * 30 | 0},0.45)`;
            ctx.lineWidth = 1 + Math.random() * 2.5;
            let x = Math.random() * W, y = 0;
            ctx.moveTo(x, y);
            for (let j = 0; j < 10; j++) {
                x += (Math.random() - 0.5) * 90; y += H / 10;
                ctx.lineTo(Math.max(0, Math.min(W, x)), y);
            }
            ctx.stroke();
        }
    } else if (type === "grid") {
        ctx.fillStyle = "#0d0d0d"; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "rgba(55,55,55,0.7)"; ctx.lineWidth = 1;
        for (let x = 0; x <= W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (let y = 0; y <= H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    }
    return c;
}

function applyBackground() {
    const preset = state.bg.preset;
    if (BG_SOLID[preset]) {
        if (scene.background && scene.background.isTexture) { scene.background.dispose(); }
        scene.background = new THREE.Color(BG_SOLID[preset]);
    } else if (preset === "custom") {
        if (scene.background && scene.background.isTexture) { scene.background.dispose(); }
        scene.background = new THREE.Color(state.bg.color);
    } else {
        const tex = new THREE.CanvasTexture(makeBgCanvas(preset));
        if (scene.background && scene.background.isTexture) { scene.background.dispose(); }
        scene.background = tex;
    }
}

// ======== BAND / CHAIN ========

function disposeBand() {
    if (!bandGroup) { return; }
    scene.remove(bandGroup);
    bandGroup.traverse((obj) => {
        if (obj.isMesh) {
            if (obj.geometry) { obj.geometry.dispose(); }
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m) => m.dispose());
        }
    });
    bandGroup = null;
}

function getPlateArcEndpoints(width, angleRad) {
    const R = width / Math.max(0.0001, angleRad);
    const half = angleRad * 0.5;
    return {
        left: new THREE.Vector3(Math.sin(-half) * R, 0, Math.cos(-half) * R - R),
        right: new THREE.Vector3(Math.sin(half) * R, 0, Math.cos(half) * R - R)
    };
}

function createBandPath(width, angleRad, lengthFactor) {
    const { left, right } = getPlateArcEndpoints(width, angleRad);
    const spanX = Math.abs(right.x - left.x);
    const extra = Math.max(0, lengthFactor - 1);
    const backDepth = width * (0.24 + extra * 0.9);
    const sidePull = spanX * (0.22 + extra * 0.14);

    const p1 = left.clone();
    const p2 = new THREE.Vector3(left.x - sidePull, 0, left.z - backDepth * 0.42);
    const p3 = new THREE.Vector3(0, 0, left.z - backDepth);
    const p4 = new THREE.Vector3(right.x + sidePull, 0, right.z - backDepth * 0.42);
    const p5 = right.clone();
    return new THREE.CatmullRomCurve3([p1, p2, p3, p4, p5], false, "centripetal", 0.5);
}

function buildBandGeometry(path, s) {
    const geo = new THREE.TubeGeometry(path, 120, s.thickness, 18, false);
    const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(s.color),
        roughness: Math.max(0.25, 0.7 - s.metalness * 0.45),
        metalness: s.metalness,
        clearcoat: s.metalness * 0.6,
        clearcoatRoughness: 0.3
    });
    return new THREE.Mesh(geo, mat);
}

function buildChainGeometry(path, s) {
    const pathLen = Math.max(0.1, path.getLength());
    const linkPitch = Math.max(0.08, s.thickness * 2.05);
    const numLinks = Math.max(18, Math.floor(pathLen / linkPitch));
    const group = new THREE.Group();
    const linkGeo = new THREE.TorusGeometry(s.thickness * 1.55, s.thickness * 0.42, 8, 14);
    const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(s.color),
        metalness: Math.max(0.55, s.metalness),
        roughness: 0.3
    });
    for (let i = 0; i <= numLinks; i++) {
        const t = i / numLinks;
        const pos = path.getPoint(t);
        const tang = path.getTangent(t).normalize();
        const mesh = new THREE.Mesh(linkGeo, mat);
        mesh.position.copy(pos);
        const defAxis = new THREE.Vector3(0, 0, 1);
        mesh.quaternion.setFromUnitVectors(defAxis, tang);
        if (i % 2 === 0) {
            mesh.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(tang, Math.PI / 2));
        }
        group.add(mesh);
    }
    return group;
}

function buildBand() {
    const p = state.plate;
    const s = state.band;
    const angleRad = Math.max(0.05, THREE.MathUtils.degToRad(p.bendAngle));
    const path = createBandPath(p.width, angleRad, s.length);

    bandGroup = new THREE.Group();
    const content = s.type === "chain" ? buildChainGeometry(path, s) : buildBandGeometry(path, s);
    bandGroup.add(content);
    bandGroup.rotation.copy(plateMesh.rotation);
    bandGroup.visible = s.visible;
    scene.add(bandGroup);
}

function rebuildBand() {
    disposeBand();
    buildBand();
}

// ======== EXPORT ========
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 6000);
}

function downloadString(str, filename, mime) {
    downloadBlob(new Blob([str], { type: mime }), filename);
}

function createDepthMapCanvas(side) {
    const canvas = document.createElement("canvas");
    canvas.width = 4096; canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const s = state[side];
    const usableW = Math.max(32, canvas.width - s.ml - s.mr);
    const usableH = Math.max(32, canvas.height - s.mt - s.mb);
    const cx = s.ml + usableW / 2;
    const cy = s.mt + usableH / 2;
    const text = applyTextTransform(s.text, s.tt);
    ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = `${s.fst} ${s.fw} ${s.fs}px "${s.font}"`;
    ctx.textAlign = "left"; ctx.textBaseline = "middle";
    drawTextWithLetterSpacing(ctx, text, cx - measureSpacedText(ctx, text, s.ls) / 2, cy, s.ls);
    return canvas;
}

function exportDepthMap(side) {
    createDepthMapCanvas(side).toBlob((blob) => { if (blob) { downloadBlob(blob, `depth-map-${side}.png`); } }, "image/png");
}

async function preloadFontForCanvas(fontFamily, fontWeight, fontStyle) {
    if (!document.fonts?.load) { return; }
    const clean = sanitizeFontFamily(fontFamily);
    const descriptors = [
        `${fontStyle || "normal"} ${fontWeight || 400} 64px "${clean}"`,
        `normal ${fontWeight || 400} 64px "${clean}"`,
        `${fontStyle || "normal"} 400 64px "${clean}"`
    ];
    await Promise.all(descriptors.map((descriptor) => document.fonts.load(descriptor).catch((err) => {
        console.warn(`PDF fallback font preload failed for "${clean}" using descriptor "${descriptor}". PDF export will continue with the browser's current font state, which may reduce text fidelity.`, err);
        return undefined;
    })));
}

async function buildPdfFallbackImage(pdfDoc, side) {
    const s = state[side];
    await preloadFontForCanvas(s.font, s.fw, s.fst);
    const blob = await new Promise((resolve) => createDepthMapCanvas(side).toBlob(resolve, "image/png"));
    if (!blob) { throw new Error(`Canvas toBlob() returned null while building the fallback PDF image for ${side}. The browser could not encode the canvas as PNG.`); }
    return pdfDoc.embedPng(await blob.arrayBuffer());
}

// ---- Font-to-vector helpers ----
const _fontCache = {};

// Regex matching the first font file URL in a Google Fonts CSS response (woff2/woff/ttf/otf)
const GOOGLE_FONT_URL_RE = /url\(['"]?(https:\/\/fonts\.gstatic\.com[^'"\)]+\.(?:woff2|woff|ttf|otf))['"]?\)/i;

async function loadFontForExport(fontFamily, fontWeight) {
    const key = `${fontFamily}:${fontWeight}`;
    if (_fontCache[key]) { return _fontCache[key]; }
    const clean = sanitizeFontFamily(fontFamily);
    const weight = Number(fontWeight);
    const safeWeight = VALID_FONT_WEIGHTS.includes(weight) ? weight : 400;
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(clean)}:wght@${safeWeight}&display=swap`;
    const cssResp = await fetch(cssUrl);
    if (!cssResp.ok) { throw new Error(`Could not fetch font CSS for "${clean}"`); }
    const css = await cssResp.text();
    const match = css.match(GOOGLE_FONT_URL_RE);
    if (!match) { throw new Error(`No font file URL found in CSS for "${clean}"`); }
    const fontUrl = match[1];
    const fontResp = await fetch(fontUrl);
    if (!fontResp.ok) { throw new Error(`Could not fetch font file for "${clean}"`); }
    const buffer = await fontResp.arrayBuffer();
    const font = opentype.parse(buffer);
    _fontCache[key] = font;
    return font;
}

function buildTextPathData(font, text, cx, cy, fontSize, letterSpacing) {
    if (!text) { return ""; }
    const scale = fontSize / font.unitsPerEm;
    // Place the baseline so the text is vertically centered at cy.
    const baselineY = cy + ((font.ascender + font.descender) / 2) * scale;
    // opentype.js adds letterSpacing after every glyph (including the last), so the total
    // advance is: sum(advanceWidths)*scale + n*letterSpacing. Shift right by half a
    // letterSpacing to compensate for that trailing extra spacing and keep text centred.
    const glyphs = font.stringToGlyphs(text);
    const totalWidth = glyphs.reduce((sum, g) => sum + (g.advanceWidth || 0) * scale + letterSpacing, 0);
    const startX = cx - totalWidth / 2 + letterSpacing / 2;
    const path = font.getPath(text, startX, baselineY, fontSize, { letterSpacing });
    return path.toPathData(2);
}

async function buildSideForExport(side) {
    const s = state[side];
    const W = 4096, H = 512;
    const uw = Math.max(32, W - s.ml - s.mr);
    const uh = Math.max(32, H - s.mt - s.mb);
    const cx = s.ml + uw / 2;
    const cy = s.mt + uh / 2;
    const text = applyTextTransform(s.text, s.tt);
    const font = await loadFontForExport(s.font, s.fw);
    const pathData = buildTextPathData(font, text, cx, cy, s.fs, s.ls);
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttribute("width", String(W));
    svg.setAttribute("height", String(H));
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("width", String(W));
    rect.setAttribute("height", String(H));
    rect.setAttribute("fill", "black");
    svg.appendChild(rect);
    if (pathData) {
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", "white");
        svg.appendChild(path);
    }
    return svg;
}

async function exportSVG(side) {
    try {
        const svg = await buildSideForExport(side);
        downloadString(new XMLSerializer().serializeToString(svg), `cuts-${side}.svg`, "image/svg+xml");
    } catch (err) {
        console.error("SVG export failed:", err);
        alert(`SVG export failed: ${err.message}`);
    }
}

async function exportPDF() {
    try {
        const W = 4096, H = 512;
        const pdfDoc = await PDFDocument.create();

        for (const side of ["front", "back"]) {
            const page = pdfDoc.addPage([W, H]);
            try {
                const s = state[side];
                const uw = Math.max(32, W - s.ml - s.mr);
                const uh = Math.max(32, H - s.mt - s.mb);
                const cx = s.ml + uw / 2;
                const cy = s.mt + uh / 2;
                const text = applyTextTransform(s.text, s.tt);
                const font = await loadFontForExport(s.font, s.fw);
                const pathData = buildTextPathData(font, text, cx, cy, s.fs, s.ls);

                // Black background
                page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(0, 0, 0) });
                // Text as white vector paths.
                // pdf-lib uses bottom-left origin with y increasing upward; SVG uses top-left with
                // y increasing downward. Passing x:0, y:H flips the coordinate system to match SVG.
                if (pathData) {
                    page.drawSvgPath(pathData, { x: 0, y: H, color: rgb(1, 1, 1) });
                }
            } catch (fontErr) {
                console.warn(`Falling back to raster PDF export for ${side}:`, fontErr);
                page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(0, 0, 0) });
                const png = await buildPdfFallbackImage(pdfDoc, side);
                page.drawImage(png, { x: 0, y: 0, width: W, height: H });
            }
        }

        const bytes = await pdfDoc.save();
        downloadBlob(new Blob([bytes], { type: "application/pdf" }), "wristband.pdf");
    } catch (err) {
        console.error("PDF export failed:", err);
        alert(`PDF export failed: ${err.message}`);
    }
}

function bindSideEvents(side) {
    const u = ui[side];
    const controls = [u.text, u.fontPreset, u.fontFamily, u.fontSize, u.letterSpacing, u.fontWeight, u.fontStyle, u.textTransform, u.marginTop, u.marginRight, u.marginBottom, u.marginLeft];
    controls.forEach((el) => {
        const eventName = el.tagName === "INPUT" && el.type === "range" ? "input" : "change";
        el.addEventListener(eventName, () => {
            if (el === u.fontPreset && u.fontPreset.value) { u.fontFamily.value = u.fontPreset.value; }
            if (el === u.fontFamily) { u.fontPreset.value = FONT_OPTIONS.includes(u.fontFamily.value) ? u.fontFamily.value : ""; }
            applyAllParams();
        });
        if (el.tagName === "INPUT" && el.type === "text") {
            el.addEventListener("input", () => {
                if (el === u.fontFamily) { u.fontPreset.value = FONT_OPTIONS.includes(u.fontFamily.value) ? u.fontFamily.value : ""; }
                applyAllParams();
            });
        }
    });
}

function bindEvents() {
    const plateControls = [ui.plate.materialPreset, ui.plate.color, ui.plate.shininess, ui.plate.width, ui.plate.height, ui.plate.depth, ui.plate.bendAngle, ui.plate.cornerRadius, ui.plate.cornerMode];
    plateControls.forEach((el) => {
        const eventName = el.tagName === "INPUT" && el.type === "range" ? "input" : "change";
        el.addEventListener(eventName, () => {
            if (el === ui.plate.materialPreset && ui.plate.materialPreset.value !== "custom") {
                ui.plate.color.value = MATERIAL_PRESETS[ui.plate.materialPreset.value];
            }
            if (el === ui.plate.color && ui.plate.materialPreset.value !== "custom") {
                ui.plate.materialPreset.value = "custom";
            }
            applyAllParams();
        });
    });
    bindSideEvents("front");
    bindSideEvents("back");

    // Background
    [ui.bg.preset, ui.bg.color].forEach((el) => {
        const ev = el.tagName === "INPUT" ? "input" : "change";
        el.addEventListener(ev, applyAllParams);
    });

    // Band
    ui.band.visible.addEventListener("change", applyAllParams);
    [ui.band.type, ui.band.color].forEach((el) => el.addEventListener("change", applyAllParams));
    [ui.band.thickness, ui.band.length, ui.band.metalness].forEach((el) => el.addEventListener("input", applyAllParams));

    // Export buttons
    document.getElementById("exportDepthFront").addEventListener("click", () => exportDepthMap("front"));
    document.getElementById("exportDepthBack").addEventListener("click", () => exportDepthMap("back"));
    document.getElementById("exportSVGFront").addEventListener("click", () => exportSVG("front"));
    document.getElementById("exportSVGBack").addEventListener("click", () => exportSVG("back"));
    document.getElementById("exportPDF").addEventListener("click", exportPDF);
}

bindEvents();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();
