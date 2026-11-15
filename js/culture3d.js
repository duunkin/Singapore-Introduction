/**
 * CULTURE3D.JS — Section 3: 3D Peranakan Outfit Studio (Nyonya & Baba)
 * - Builds stylized, modular low/mid-poly Female (Nyonya) and Male (Baba)
 *   characters on a glowing dual studio stage.
 * - Generates procedural CanvasTextures for Peranakan batik sarongs,
 *   embroidered kebaya lace cutwork (alpha), and beaded kasut manek slippers.
 * - Implements the "EXPLORE" exploded-view disassembly & step-by-step
 *   layer assembly system with GSAP transitions, camera focus targets,
 *   active layer emissive glow highlighting, and OrbitControls (touch + mouse).
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createVisibilityController } from './quality.js';

/* ==========================================================================
   1. CULTURAL LAYER DATA (NYONYA 6 STEPS, BABA 5 STEPS)
   ========================================================================== */
const OUTFIT_DATA = {
  female: {
    label: 'NYONYA ATTIRE (FEMALE)',
    baseX: -1.65,
    steps: [
      {
        id: 'base',
        title: '1. Base Undergarment Layer',
        what: 'A fitted, breathable cotton inner camisole and petticoat that form a modest, smooth foundation beneath the sheer outer blouse.',
        how: 'Worn snugly against the torso before wrapping the sarong or draping the delicate kebaya.',
        camTarget: { x: -1.65, y: 2.25, z: 0 },
        camOffset: { x: 0.15, y: 2.4, z: 3.4 },
        explodedOffset: { x: 0, y: 0, z: -0.9 }
      },
      {
        id: 'sarong',
        title: '2. Batik Sarong',
        what: 'A vibrant tubular length of hand-waxed Peranakan batik cotton featuring auspicious floral bouquets and pastel-vivid coastal dyes.',
        how: 'Wrapped around the waist, pleated neatly across the front panel, and secured firmly at the hip.',
        camTarget: { x: -1.65, y: 1.25, z: 0 },
        camOffset: { x: 0.2, y: 1.45, z: 3.3 },
        explodedOffset: { x: -1.1, y: -0.25, z: 0.4 }
      },
      {
        id: 'kebaya',
        title: '3. Nyonya Kebaya & Selendang',
        what: 'A tailored, semi-sheer blouse bordered with intricate cutwork embroidery (sulam) paired with a draped shoulder shawl (selendang).',
        how: 'Worn open at the front over the sarong waist with scalloped lace hems resting gracefully over the hips.',
        camTarget: { x: -1.65, y: 2.35, z: 0 },
        camOffset: { x: 0.25, y: 2.5, z: 3.1 },
        explodedOffset: { x: 1.15, y: 0.35, z: 0.45 }
      },
      {
        id: 'kerongsang',
        title: '4. Kerongsang Brooch Set',
        what: 'Three ornate gold-and-gemstone filigree brooches (ibu and anak) linked together by fine metallic chains.',
        how: 'Pinned vertically down the open front lapels of the kebaya—replacing buttons—to fasten the blouse securely.',
        camTarget: { x: -1.65, y: 2.38, z: 0.25 },
        camOffset: { x: 0.05, y: 2.45, z: 2.25 },
        explodedOffset: { x: 0, y: 0.25, z: 1.35 }
      },
      {
        id: 'sanggul',
        title: '5. Sanggul Bun & Cucuk Sanggul',
        what: 'A sculpted chignon hairstyle crowned with three gold-plated decorative hairpins (cucuk sanggul) embossed with floral motifs.',
        how: 'Hair is coiled tightly at the crown and secured with the fan of gilded pins radiating from the bun.',
        camTarget: { x: -1.65, y: 3.35, z: 0 },
        camOffset: { x: 0.15, y: 3.5, z: 2.35 },
        explodedOffset: { x: 0, y: 1.15, z: 0 }
      },
      {
        id: 'kasut',
        title: '6. Kasut Manek (Beaded Slippers)',
        what: 'Handcrafted velvet-backed slippers stitched with thousands of tiny faceted glass cut beads in Peranakan floral and geometric patterns.',
        how: 'Slipped onto the feet as the finishing jewel of the Nyonya ensemble for weddings and festive occasions.',
        camTarget: { x: -1.65, y: 0.3, z: 0.2 },
        camOffset: { x: 0.2, y: 0.75, z: 2.45 },
        explodedOffset: { x: 0, y: -0.85, z: 1.1 }
      }
    ]
  },
  male: {
    label: 'BABA ATTIRE (MALE)',
    baseX: 1.65,
    steps: [
      {
        id: 'base',
        title: '1. Undershirt Base Layer',
        what: 'A crisp, collarless white cotton undershirt engineered for tropical comfort in the Straits climate.',
        how: 'Worn beneath the outer tunic to absorb moisture and preserve the structure of fine silk or cotton outerwear.',
        camTarget: { x: 1.65, y: 2.35, z: 0 },
        camOffset: { x: -0.15, y: 2.5, z: 3.4 },
        explodedOffset: { x: 0, y: 0, z: -0.9 }
      },
      {
        id: 'trousers',
        title: '2. Silk Trousers & Batik Panel',
        what: 'Loose-cut traditional trousers paired with a batik waist wrap reflecting both Chinese tailoring and Malay textile heritage.',
        how: 'Fastened comfortably at the waist, allowing unrestricted airflow and ease of movement.',
        camTarget: { x: 1.65, y: 1.25, z: 0 },
        camOffset: { x: -0.2, y: 1.45, z: 3.35 },
        explodedOffset: { x: 1.1, y: -0.25, z: 0.35 }
      },
      {
        id: 'baju',
        title: '3. Baju Panjang (Long Tunic)',
        what: 'A generous, knee-length tunic coat featuring wide sleeves and subtle brocade or batik-inspired trim.',
        how: 'Draped loosely over the undershirt and trousers for formal community gatherings and ancestral ceremonies.',
        camTarget: { x: 1.65, y: 2.2, z: 0 },
        camOffset: { x: -0.25, y: 2.4, z: 3.25 },
        explodedOffset: { x: -1.15, y: 0.3, z: 0.45 }
      },
      {
        id: 'headwear',
        title: '4. Sash Belt & Songkok-Style Cap',
        what: 'An embroidered waist sash paired with a structured velvet songkok-style cap or traditional skullcap.',
        how: 'The sash cinches the waist over the tunic while the cap crowns the head as a mark of respect and dignity.',
        camTarget: { x: 1.65, y: 2.95, z: 0 },
        camOffset: { x: -0.15, y: 3.15, z: 2.85 },
        explodedOffset: { x: 0, y: 1.1, z: 0.55 }
      },
      {
        id: 'footwear',
        title: '5. Embroidered Baba Footwear',
        what: 'Structured cloth and leather slippers adorned with auspicious gold-thread motifs.',
        how: 'Worn with light socks or bare ankles to complete the dignified Straits Chinese gentleman’s attire.',
        camTarget: { x: 1.65, y: 0.3, z: 0.2 },
        camOffset: { x: -0.2, y: 0.75, z: 2.5 },
        explodedOffset: { x: 0, y: -0.85, z: 1.1 }
      }
    ]
  }
};

/* ==========================================================================
   2. PROCEDURAL PERANAKAN CANVAS TEXTURE GENERATORS
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
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/* ==========================================================================
   3. MODULAR PROCEDURAL CHARACTER BUILDERS
   ========================================================================== */
function buildNyonyaCharacter(xPos, segments) {
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

  // Base Mannequin Body (Head, Neck, Arms, Legs — always visible)
  const mannequin = new THREE.Group();
  mannequin.name = 'mannequin_female';

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
    color: 0xfdfBF7,
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

function buildBabaCharacter(xPos, segments) {
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

/* ==========================================================================
   4. MAIN STUDIO INITIALIZATION & EXPLORE ASSEMBLY CONTROLLER
   ========================================================================== */
export function initCultureSection(quality) {
  const canvas = document.getElementById('peranakan-canvas');
  const canvasWrap = document.getElementById('peranakan-canvas-wrap');
  const studioEl = document.getElementById('peranakan-studio');
  if (!canvas || !canvasWrap || !studioEl || !quality.webglSupported) return;

  // UI Elements
  const charTabs = Array.from(document.querySelectorAll('.char-tab[data-char-select]'));
  const exploreBtns = Array.from(document.querySelectorAll('[data-explore-trigger]'));
  const pedestalUI = document.getElementById('studio-pedestal-ui');
  const inspectorEl = document.getElementById('outfit-inspector');
  const inspectorCharLabel = document.getElementById('inspector-char-label');
  const inspectorStepCounter = document.getElementById('inspector-step-counter');
  const inspectorProgressFill = document.getElementById('inspector-progress-fill');
  const inspectorTitle = document.getElementById('inspector-layer-title');
  const inspectorWhat = document.getElementById('inspector-what');
  const inspectorHow = document.getElementById('inspector-how');
  const inspectorDotsWrap = document.getElementById('inspector-dots');
  const prevBtn = document.getElementById('inspector-prev-btn');
  const nextBtn = document.getElementById('inspector-next-btn');
  const resetBtn = document.getElementById('inspector-reset-btn');

  // Three.js Renderer & Studio Scene
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: quality.antialias,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(quality.dpr);
  renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    38,
    canvasWrap.clientWidth / canvasWrap.clientHeight,
    0.1,
    60
  );

  const isNarrowMobile = window.innerWidth < 680;
  const defaultCamPos = new THREE.Vector3(0, 2.25, isNarrowMobile ? 9.8 : 7.8);
  const defaultLookTarget = new THREE.Vector3(0, 1.85, 0);
  camera.position.copy(defaultCamPos);

  // OrbitControls for Drag Rotation & Pinch/Scroll Zoom
  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(defaultLookTarget);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 2.1;
  controls.maxDistance = 12.0;
  controls.minPolarAngle = Math.PI * 0.18;
  controls.maxPolarAngle = Math.PI * 0.52;
  controls.autoRotate = !quality.reducedMotion;
  controls.autoRotateSpeed = 0.65;

  // Pause auto-rotate when user interacts, resume softly after idle
  let idleTimer = null;
  controls.addEventListener('start', () => {
    controls.autoRotate = false;
    if (idleTimer) clearTimeout(idleTimer);
  });
  controls.addEventListener('end', () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!quality.reducedMotion && !exploreState.active) {
        controls.autoRotate = true;
      }
    }, 3500);
  });

  // Studio Three-Point Lighting
  const hemiLight = new THREE.HemisphereLight(0xfaf8f5, 0x10162b, 1.35);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
  keyLight.position.set(5, 8, 6);
  scene.add(keyLight);

  const tealRimLight = new THREE.PointLight(0x2dd4bf, 3.2, 16);
  tealRimLight.position.set(-4.5, 4.2, -3.5);
  scene.add(tealRimLight);

  const pinkRimLight = new THREE.PointLight(0xef3340, 2.8, 16);
  pinkRimLight.position.set(4.5, 4.2, -3.5);
  scene.add(pinkRimLight);

  // Studio Stage Floor & Glowing Pedestal Rings
  const stageGroup = new THREE.Group();
  scene.add(stageGroup);

  const createPedestal = (x, ringHex) => {
    const pGroup = new THREE.Group();
    pGroup.position.set(x, 0, 0);

    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.18, 1.28, 0.08, 32),
      new THREE.MeshStandardMaterial({
        color: 0x0b1021,
        roughness: 0.3,
        metalness: 0.8
      })
    );
    disc.position.y = -0.04;
    pGroup.add(disc);

    const glowRing = new THREE.Mesh(
      new THREE.RingGeometry(1.12, 1.22, 48),
      new THREE.MeshBasicMaterial({
        color: ringHex,
        side: THREE.DoubleSide
      })
    );
    glowRing.rotation.x = -Math.PI / 2;
    glowRing.position.y = 0.01;
    pGroup.add(glowRing);

    return pGroup;
  };

  stageGroup.add(createPedestal(OUTFIT_DATA.female.baseX, 0x2dd4bf));
  stageGroup.add(createPedestal(OUTFIT_DATA.male.baseX, 0xef3340));

  // Build Nyonya & Baba Characters
  const nyonya = buildNyonyaCharacter(OUTFIT_DATA.female.baseX, quality.geometrySegments);
  const baba = buildBabaCharacter(OUTFIT_DATA.male.baseX, quality.geometrySegments);
  stageGroup.add(nyonya.root);
  stageGroup.add(baba.root);

  const characters = {
    female: nyonya,
    male: baba
  };

  // -------------------------------------------------------------------------
  // Highlighting Helper (Emissive Glow Outline on Active Layer)
  // -------------------------------------------------------------------------
  const setLayerHighlight = (layerGroup, isHighlighted) => {
    if (!layerGroup) return;
    layerGroup.traverse((child) => {
      if (child.isMesh && child.material) {
        if (!child.userData.origEmissive) {
          child.userData.origEmissive = child.material.emissive
            ? child.material.emissive.clone()
            : new THREE.Color(0x000000);
          child.userData.origEmissiveIntensity = child.material.emissiveIntensity || 0;
        }
        if (isHighlighted) {
          child.material.emissive = new THREE.Color(0xef3340);
          child.material.emissiveIntensity = 0.55;
        } else {
          child.material.emissive.copy(child.userData.origEmissive);
          child.material.emissiveIntensity = child.userData.origEmissiveIntensity;
        }
      }
    });
  };

  // -------------------------------------------------------------------------
  // Smooth Camera Focus Mover
  // -------------------------------------------------------------------------
  const moveCameraTo = (posVec, targetVec, duration = 0.85) => {
    if (window.gsap && !quality.reducedMotion) {
      window.gsap.to(camera.position, {
        x: posVec.x,
        y: posVec.y,
        z: posVec.z,
        duration,
        ease: 'power3.out'
      });
      window.gsap.to(controls.target, {
        x: targetVec.x,
        y: targetVec.y,
        z: targetVec.z,
        duration,
        ease: 'power3.out'
      });
    } else {
      camera.position.copy(posVec);
      controls.target.copy(targetVec);
    }
  };

  // -------------------------------------------------------------------------
  // Explore / Layer-by-Layer Assembly State Machine
  // -------------------------------------------------------------------------
  const exploreState = {
    active: false,
    charKey: 'female',
    stepIndex: 0
  };

  const renderStepDots = (steps, currentIdx) => {
    if (!inspectorDotsWrap) return;
    inspectorDotsWrap.innerHTML = '';
    steps.forEach((step, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `inspector-dot${idx === currentIdx ? ' is-active' : ''}`;
      btn.textContent = String(idx + 1);
      btn.setAttribute('aria-label', `Step ${idx + 1}: ${step.title}`);
      btn.addEventListener('click', () => {
        goToAssemblyStep(idx);
      });
      inspectorDotsWrap.appendChild(btn);
    });
  };

  /**
   * Starts the Explore sequence for 'female' (Nyonya) or 'male' (Baba):
   * 1) Disassembles all garments outward into an exploded floating view
   * 2) Assembles Step 1 into place and focuses the camera + inspector card
   */
  const startExploreMode = (charKey) => {
    exploreState.active = true;
    exploreState.charKey = charKey;
    exploreState.stepIndex = 0;
    controls.autoRotate = false;

    // Highlight matching top tab
    charTabs.forEach((tab) => {
      const match = tab.getAttribute('data-char-select') === charKey;
      tab.classList.toggle('is-active', match);
      tab.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    pedestalUI?.classList.add('is-hidden');
    inspectorEl?.classList.remove('is-hidden');

    const config = OUTFIT_DATA[charKey];
    const charObj = characters[charKey];

    // First: explode all layers outward smoothly
    config.steps.forEach((step) => {
      const grp = charObj.layers[step.id];
      if (!grp) return;
      setLayerHighlight(grp, false);
      if (window.gsap && !quality.reducedMotion) {
        window.gsap.to(grp.position, {
          x: step.explodedOffset.x,
          y: step.explodedOffset.y,
          z: step.explodedOffset.z,
          duration: 0.42,
          ease: 'power2.out'
        });
      }
    });

    // Then: assemble Step 0 onto the character after brief exploded preview
    setTimeout(() => {
      goToAssemblyStep(0);
    }, quality.reducedMotion ? 10 : 360);
  };

  const goToAssemblyStep = (stepIdx) => {
    const config = OUTFIT_DATA[exploreState.charKey];
    const charObj = characters[exploreState.charKey];
    const clampedIdx = Math.min(config.steps.length - 1, Math.max(0, stepIdx));
    exploreState.stepIndex = clampedIdx;

    const currentStep = config.steps[clampedIdx];

    // Update Inspector UI Copy
    if (inspectorCharLabel) inspectorCharLabel.textContent = config.label;
    if (inspectorStepCounter) {
      inspectorStepCounter.textContent = `STEP ${clampedIdx + 1} / ${config.steps.length}`;
    }
    if (inspectorProgressFill) {
      const pct = ((clampedIdx + 1) / config.steps.length) * 100;
      inspectorProgressFill.style.width = `${pct.toFixed(1)}%`;
    }
    if (inspectorTitle) inspectorTitle.textContent = currentStep.title;
    if (inspectorWhat) inspectorWhat.textContent = currentStep.what;
    if (inspectorHow) inspectorHow.textContent = currentStep.how;

    if (prevBtn) prevBtn.disabled = clampedIdx === 0;
    if (nextBtn) {
      nextBtn.textContent =
        clampedIdx === config.steps.length - 1 ? 'Finish Outfit ✓' : 'Next Layer →';
    }

    renderStepDots(config.steps, clampedIdx);

    // Animate each layer:
    // - Layers <= clampedIdx assemble onto the body (0,0,0)
    // - Layers > clampedIdx stay floating in exploded positions
    config.steps.forEach((step, idx) => {
      const grp = charObj.layers[step.id];
      if (!grp) return;

      const isAssembled = idx <= clampedIdx;
      const isCurrentActive = idx === clampedIdx;

      const targetPos = isAssembled
        ? { x: 0, y: 0, z: 0 }
        : step.explodedOffset;

      if (window.gsap && !quality.reducedMotion) {
        window.gsap.to(grp.position, {
          x: targetPos.x,
          y: targetPos.y,
          z: targetPos.z,
          duration: 0.65,
          ease: 'back.out(1.25)'
        });
      } else {
        grp.position.set(targetPos.x, targetPos.y, targetPos.z);
      }

      // Highlight the newly added layer with a brief pulse glow
      setLayerHighlight(grp, isCurrentActive);
      if (isCurrentActive) {
        setTimeout(() => {
          setLayerHighlight(grp, false);
        }, 1100);
      }
    });

    // Focus Camera on the relevant body area for this step
    moveCameraTo(
      new THREE.Vector3(
        config.baseX + currentStep.camOffset.x,
        currentStep.camOffset.y,
        currentStep.camOffset.z
      ),
      new THREE.Vector3(
        currentStep.camTarget.x,
        currentStep.camTarget.y,
        currentStep.camTarget.z
      ),
      0.8
    );
  };

  const resetToFullOutfits = (focusMode = 'both') => {
    exploreState.active = false;

    // Reassemble all layers on both characters and clear highlights
    ['female', 'male'].forEach((key) => {
      const cfg = OUTFIT_DATA[key];
      const obj = characters[key];
      cfg.steps.forEach((step) => {
        const grp = obj.layers[step.id];
        if (!grp) return;
        setLayerHighlight(grp, false);
        if (window.gsap && !quality.reducedMotion) {
          window.gsap.to(grp.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.55,
            ease: 'power3.out'
          });
        } else {
          grp.position.set(0, 0, 0);
        }
      });
    });

    inspectorEl?.classList.add('is-hidden');
    pedestalUI?.classList.remove('is-hidden');

    if (focusMode === 'female') {
      moveCameraTo(
        new THREE.Vector3(-1.65, 2.1, 4.8),
        new THREE.Vector3(-1.65, 1.85, 0)
      );
    } else if (focusMode === 'male') {
      moveCameraTo(
        new THREE.Vector3(1.65, 2.1, 4.8),
        new THREE.Vector3(1.65, 1.85, 0)
      );
    } else {
      const wideZ = window.innerWidth < 680 ? 9.8 : 7.8;
      moveCameraTo(new THREE.Vector3(0, 2.25, wideZ), defaultLookTarget);
      if (!quality.reducedMotion) {
        controls.autoRotate = true;
      }
    }
  };

  // Wire UI Events
  exploreBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-explore-trigger') || 'female';
      startExploreMode(key);
    });
  });

  prevBtn?.addEventListener('click', () => {
    if (exploreState.stepIndex > 0) {
      goToAssemblyStep(exploreState.stepIndex - 1);
    }
  });

  nextBtn?.addEventListener('click', () => {
    const config = OUTFIT_DATA[exploreState.charKey];
    if (exploreState.stepIndex < config.steps.length - 1) {
      goToAssemblyStep(exploreState.stepIndex + 1);
    } else {
      resetToFullOutfits('both');
    }
  });

  resetBtn?.addEventListener('click', () => {
    resetToFullOutfits('both');
  });

  charTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const mode = tab.getAttribute('data-char-select') || 'both';
      charTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      if (mode === 'both') {
        resetToFullOutfits('both');
      } else {
        resetToFullOutfits(mode);
      }
    });
  });

  // Resize Listener
  const handleResize = () => {
    const w = canvasWrap.clientWidth;
    const h = canvasWrap.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  window.addEventListener('resize', handleResize);

  // Render Loop with Subtle Idle Breathing Animation
  let isActive = false;
  let rafId = null;
  const clock = new THREE.Clock();

  const animate = () => {
    if (!isActive) return;
    rafId = requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();
    controls.update();

    if (!quality.reducedMotion) {
      // Gentle breathing bob on both characters
      nyonya.root.position.y = Math.sin(elapsed * 1.7) * 0.025;
      baba.root.position.y = Math.sin(elapsed * 1.7 + 1.2) * 0.025;
    }

    renderer.render(scene, camera);
  };

  createVisibilityController(studioEl, (visible) => {
    isActive = visible;
    if (isActive) {
      clock.start();
      animate();
    } else if (rafId) {
      cancelAnimationFrame(rafId);
    }
  });
}