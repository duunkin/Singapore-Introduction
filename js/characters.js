/**
 * CHARACTERS.JS — Procedural 3D Peranakan Mannequins & Garment Builders
 * Contains procedural CanvasTextures and modular geometric layers for Nyonya & Baba.
 */

import * as THREE from 'three';

/* ==========================================================================
   PROCEDURAL PERANAKAN CANVAS TEXTURE GENERATORS
   ========================================================================== */
function createBatikTexture(bgHex, primaryHex, secondaryHex, goldHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 512, 512);

  // Diagonal Peranakan lattice (pucuk rebung / geometric batik grid)
  ctx.strokeStyle = goldHex;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.35;
  for (let i = -512; i < 1024; i += 48) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 512, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i + 512, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
  }

  // Floral Rosettes & Foliage Dots
  ctx.globalAlpha = 0.92;
  for (let y = 48; y < 512; y += 96) {
    for (let x = 48; x < 512; x += 96) {
      // Petals
      for (let p = 0; p < 6; p++) {
        const angle = (p * Math.PI) / 3;
        const px = x + Math.cos(angle) * 16;
        const py = y + Math.sin(angle) * 16;
        ctx.fillStyle = p % 2 === 0 ? primaryHex : secondaryHex;
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      // Gold stamen center
      ctx.fillStyle = goldHex;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Bottom Tumpal Border Triangles
  ctx.fillStyle = goldHex;
  ctx.globalAlpha = 0.65;
  for (let x = 0; x < 512; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 500);
    ctx.lineTo(x + 16, 440);
    ctx.lineTo(x + 32, 500);
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1.5);
  return tex;
}

function createKebayaLaceTexture(baseHex, embroideryHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Semi-sheer fabric body
  ctx.fillStyle = baseHex;
  ctx.globalAlpha = 0.88;
  ctx.fillRect(0, 0, 512, 460);

  // Scalloped cutwork lace hem at bottom
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = embroideryHex;
  for (let x = 16; x < 512; x += 32) {
    ctx.beginPath();
    ctx.arc(x, 456, 16, 0, Math.PI);
    ctx.fill();
  }

  // Sulam floral vine embroidery along front & hem
  ctx.strokeStyle = embroideryHex;
  ctx.lineWidth = 4;
  for (let y = 60; y < 440; y += 64) {
    for (let x = 40; x < 512; x += 80) {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/* ==========================================================================
   MODULAR PROCEDURAL CHARACTER BUILDERS
   ========================================================================== */
export function buildNyonyaCharacter(xPos, segments) {
  const root = new THREE.Group();
  root.position.set(xPos, 0, 0);

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xe8be9e,
    roughness: 0.55,
    metalness: 0.05
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x17141d,
    roughness: 0.4,
    metalness: 0.2
  });

  // Base Mannequin Body (Head, Neck, Arms, Torso Form, Legs — always visible)
  const mannequin = new THREE.Group();
  mannequin.name = 'mannequin_female';

  const formMat = new THREE.MeshStandardMaterial({
    color: 0x1f293d,
    roughness: 0.65,
    metalness: 0.1
  });
  const torsoForm = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 1.85, segments), formMat);
  torsoForm.position.set(0, 1.65, 0);
  torsoForm.scale.set(1.02, 1, 0.76);
  mannequin.add(torsoForm);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.29, segments, segments), skinMat);
  head.position.set(0, 3.05, 0);
  head.scale.set(0.92, 1.08, 0.95);
  mannequin.add(head);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.28, 14), skinMat);
  neck.position.set(0, 2.72, 0);
  mannequin.add(neck);

  // Forearms & Hands
  [-0.48, 0.48].forEach((ax, idx) => {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.95, 12), skinMat);
    arm.position.set(ax, 2.08, 0.04);
    arm.rotation.z = idx === 0 ? 0.16 : -0.16;
    mannequin.add(arm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), skinMat);
    hand.position.set(ax * 1.15, 1.58, 0.08);
    mannequin.add(hand);
  });

  // Lower Ankles
  [-0.17, 0.17].forEach((lx) => {
    const ankle = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.65, 12), skinMat);
    ankle.position.set(lx, 0.42, 0);
    mannequin.add(ankle);
  });

  root.add(mannequin);

  // Map of Modular Outfit Layer Groups (replaceable by .glb nodes later)
  const layers = {};

  // LAYER 1: Base Undergarment Camisole
  const baseGroup = new THREE.Group();
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0xfdfbf7,
    roughness: 0.6,
    metalness: 0.05
  });
  const camisole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.28, 0.88, segments),
    baseMat
  );
  camisole.position.set(0, 2.18, 0);
  camisole.scale.set(1.05, 1, 0.78);
  baseGroup.add(camisole);
  layers.base = baseGroup;
  root.add(baseGroup);

  // LAYER 2: Batik Sarong
  const sarongGroup = new THREE.Group();
  const sarongTex = createBatikTexture('#115e59', '#f472b6', '#2dd4bf', '#fbbf24');
  const sarongMat = new THREE.MeshStandardMaterial({
    map: sarongTex,
    roughness: 0.5,
    metalness: 0.12
  });
  const sarongSkirt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.31, 0.42, 1.48, segments),
    sarongMat
  );
  sarongSkirt.position.set(0, 1.12, 0);
  sarongSkirt.scale.set(1.04, 1, 0.84);
  sarongGroup.add(sarongSkirt);

  // Front Batik Pleat Panel (Kepala Sarong)
  const pleatPanel = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.49, 0.04), sarongMat);
  pleatPanel.position.set(0, 1.12, 0.34);
  sarongGroup.add(pleatPanel);
  layers.sarong = sarongGroup;
  root.add(sarongGroup);

  // LAYER 3: Embroidered Nyonya Kebaya + Draped Selendang Shawl
  const kebayaGroup = new THREE.Group();
  const kebayaTex = createKebayaLaceTexture('#fbcfe8', '#f43f5e');
  const kebayaMat = new THREE.MeshStandardMaterial({
    map: kebayaTex,
    color: 0xffd6e7,
    roughness: 0.42,
    metalness: 0.1,
    transparent: true,
    opacity: 0.94,
    side: THREE.DoubleSide
  });

  const kebayaBodice = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.41, 0.96, segments, 1, true),
    kebayaMat
  );
  kebayaBodice.position.set(0, 2.12, 0);
  kebayaBodice.scale.set(1.06, 1, 0.84);
  kebayaGroup.add(kebayaBodice);

  // Kebaya Long Sleeves
  [-0.46, 0.46].forEach((sx, idx) => {
    const sleeve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.115, 0.13, 0.72, 16),
      kebayaMat
    );
    sleeve.position.set(sx, 2.18, 0.03);
    sleeve.rotation.z = idx === 0 ? 0.16 : -0.16;
    kebayaGroup.add(sleeve);
  });

  // Embroidered V-Lapel Collar
  const lapelMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    roughness: 0.35,
    metalness: 0.25
  });
  [-0.09, 0.09].forEach((lx, idx) => {
    const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.85, 0.03), lapelMat);
    lapel.position.set(lx, 2.15, 0.31);
    lapel.rotation.z = idx === 0 ? -0.08 : 0.08;
    kebayaGroup.add(lapel);
  });

  // Selendang (Turquoise Shoulder Shawl)
  const shawlMat = new THREE.MeshStandardMaterial({
    color: 0x2dd4bf,
    roughness: 0.45,
    metalness: 0.15
  });
  const shawl = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.055, 10, 24, Math.PI * 1.15), shawlMat);
  shawl.position.set(-0.12, 2.48, 0.05);
  shawl.rotation.set(1.3, 0.3, -0.4);
  kebayaGroup.add(shawl);

  layers.kebaya = kebayaGroup;
  root.add(kebayaGroup);

  // LAYER 4: Kerongsang (Three Linked Gold Brooches)
  const kerongsangGroup = new THREE.Group();
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.18,
    metalness: 0.92,
    emissive: 0x78350f,
    emissiveIntensity: 0.2
  });

  [2.42, 2.22, 2.02].forEach((by, idx) => {
    const brooch = new THREE.Mesh(
      new THREE.OctahedronGeometry(idx === 0 ? 0.065 : 0.05, 1),
      goldMat
    );
    brooch.position.set(0, by, 0.35);
    brooch.scale.set(1.2, 1.2, 0.45);
    kerongsangGroup.add(brooch);
  });

  // Fine Linking Chain
  const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.42, 8), goldMat);
  chain.position.set(0.035, 2.22, 0.35);
  kerongsangGroup.add(chain);

  layers.kerongsang = kerongsangGroup;
  root.add(kerongsangGroup);

  // LAYER 5: Sanggul Bun & Cucuk Sanggul Gold Hairpins
  const sanggulGroup = new THREE.Group();
  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.305, segments, segments, 0, Math.PI * 2, 0, Math.PI * 0.62),
    hairMat
  );
  hairCap.position.set(0, 3.07, -0.02);
  sanggulGroup.add(hairCap);

  const bun = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), hairMat);
  bun.position.set(0, 3.36, -0.1);
  bun.scale.set(1.15, 0.85, 1.1);
  sanggulGroup.add(bun);

  // Three Radiating Gold Hairpins (Cucuk Sanggul)
  [-0.38, 0, 0.38].forEach((angle) => {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.004, 0.34, 8), goldMat);
    pin.position.set(Math.sin(angle) * 0.16, 3.48, -0.1);
    pin.rotation.z = -angle;
    sanggulGroup.add(pin);

    const pinHead = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), goldMat);
    pinHead.position.set(Math.sin(angle) * 0.25, 3.62, -0.1);
    sanggulGroup.add(pinHead);
  });

  layers.sanggul = sanggulGroup;
  root.add(sanggulGroup);

  // LAYER 6: Kasut Manek (Beaded Slippers)
  const kasutGroup = new THREE.Group();
  const kasutMat = new THREE.MeshStandardMaterial({
    color: 0x2dd4bf,
    roughness: 0.3,
    metalness: 0.35
  });

  [-0.17, 0.17].forEach((kx) => {
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.09, 0.34), kasutMat);
    shoe.position.set(kx, 0.08, 0.06);
    kasutGroup.add(shoe);

    const beadTop = new THREE.Mesh(new THREE.BoxGeometry(0.155, 0.03, 0.18), goldMat);
    beadTop.position.set(kx, 0.13, 0.09);
    kasutGroup.add(beadTop);
  });

  layers.kasut = kasutGroup;
  root.add(kasutGroup);

  return { root, layers, mannequin };
}

export function buildBabaCharacter(xPos, segments) {
  const root = new THREE.Group();
  root.position.set(xPos, 0, 0);

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xe2b492,
    roughness: 0.55,
    metalness: 0.05
  });

  // Base Mannequin
  const mannequin = new THREE.Group();
  mannequin.name = 'mannequin_male';

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, segments, segments), skinMat);
  head.position.set(0, 3.12, 0);
  head.scale.set(0.94, 1.08, 0.96);
  mannequin.add(head);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.28, 14), skinMat);
  neck.position.set(0, 2.78, 0);
  mannequin.add(neck);

  [-0.54, 0.54].forEach((ax, idx) => {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.08, 0.98, 12), skinMat);
    arm.position.set(ax, 2.1, 0.03);
    arm.rotation.z = idx === 0 ? 0.14 : -0.14;
    mannequin.add(arm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), skinMat);
    hand.position.set(ax * 1.12, 1.56, 0.06);
    mannequin.add(hand);
  });

  const formMat = new THREE.MeshStandardMaterial({
    color: 0x1f293d,
    roughness: 0.65,
    metalness: 0.1
  });
  const torsoForm = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 1.85, segments), formMat);
  torsoForm.position.set(0, 1.68, 0);
  torsoForm.scale.set(1.04, 1, 0.8);
  mannequin.add(torsoForm);

  [-0.19, 0.19].forEach((lx) => {
    const ankle = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.65, 12), skinMat);
    ankle.position.set(lx, 0.42, 0);
    mannequin.add(ankle);
  });

  root.add(mannequin);

  const layers = {};

  // LAYER 1: Cotton Undershirt Base
  const baseGroup = new THREE.Group();
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.65,
    metalness: 0.05
  });
  const undershirt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.34, 0.96, segments),
    baseMat
  );
  undershirt.position.set(0, 2.22, 0);
  undershirt.scale.set(1.08, 1, 0.82);
  baseGroup.add(undershirt);
  layers.base = baseGroup;
  root.add(baseGroup);

  // LAYER 2: Silk Trousers & Batik Panel
  const trousersGroup = new THREE.Group();
  const trouserTex = createBatikTexture('#1e1b4b', '#38bdf8', '#f59e0b', '#fde68a');
  const trouserMat = new THREE.MeshStandardMaterial({
    map: trouserTex,
    roughness: 0.48,
    metalness: 0.15
  });

  [-0.19, 0.19].forEach((tx) => {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.165, 0.145, 1.48, 16),
      trouserMat
    );
    leg.position.set(tx, 0.92, 0);
    trousersGroup.add(leg);
  });

  const waistWrap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.37, 0.39, 0.55, segments),
    trouserMat
  );
  waistWrap.position.set(0, 1.55, 0);
  waistWrap.scale.set(1.06, 1, 0.84);
  trousersGroup.add(waistWrap);

  layers.trousers = trousersGroup;
  root.add(trousersGroup);

  // LAYER 3: Baju Panjang (Long Loose Tunic)
  const bajuGroup = new THREE.Group();
  const bajuTex = createBatikTexture('#0f2942', '#2dd4bf', '#f59e0b', '#fbbf24');
  const bajuMat = new THREE.MeshStandardMaterial({
    map: bajuTex,
    color: 0xe2e8f0,
    roughness: 0.42,
    metalness: 0.18
  });

  const tunic = new THREE.Mesh(
    new THREE.CylinderGeometry(0.41, 0.48, 1.46, segments),
    bajuMat
  );
  tunic.position.set(0, 1.96, 0);
  tunic.scale.set(1.08, 1, 0.86);
  bajuGroup.add(tunic);

  // Wide Tunic Sleeves
  [-0.52, 0.52].forEach((sx, idx) => {
    const sleeve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.135, 0.16, 0.78, 16),
      bajuMat
    );
    sleeve.position.set(sx, 2.2, 0.03);
    sleeve.rotation.z = idx === 0 ? 0.15 : -0.15;
    bajuGroup.add(sleeve);
  });

  layers.baju = bajuGroup;
  root.add(bajuGroup);

  // LAYER 4: Embroidered Sash Belt & Songkok-Style Cap
  const headwearGroup = new THREE.Group();
  const velvetMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.7,
    metalness: 0.1
  });
  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.25,
    metalness: 0.85
  });

  // Songkok Cap
  const songkok = new THREE.Mesh(
    new THREE.CylinderGeometry(0.27, 0.29, 0.26, 20),
    velvetMat
  );
  songkok.position.set(0, 3.4, 0);
  songkok.scale.set(0.92, 1, 1.04);
  headwearGroup.add(songkok);

  const capBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.285, 0.292, 0.045, 20),
    goldTrimMat
  );
  capBand.position.set(0, 3.3, 0);
  capBand.scale.set(0.92, 1, 1.04);
  headwearGroup.add(capBand);

  // Waist Sash Belt
  const sash = new THREE.Mesh(
    new THREE.CylinderGeometry(0.435, 0.445, 0.18, segments),
    goldTrimMat
  );
  sash.position.set(0, 1.92, 0);
  sash.scale.set(1.08, 1, 0.87);
  headwearGroup.add(sash);

  layers.headwear = headwearGroup;
  root.add(headwearGroup);

  // LAYER 5: Baba Embroidered Footwear
  const footwearGroup = new THREE.Group();
  const shoeMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
    metalness: 0.3
  });

  [-0.19, 0.19].forEach((fx) => {
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.11, 0.38), shoeMat);
    shoe.position.set(fx, 0.09, 0.07);
    footwearGroup.add(shoe);

    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.16), goldTrimMat);
    crest.position.set(fx, 0.15, 0.11);
    footwearGroup.add(crest);
  });

  layers.footwear = footwearGroup;
  root.add(footwearGroup);

  return { root, layers, mannequin };
}
