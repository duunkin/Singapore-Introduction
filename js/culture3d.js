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
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createVisibilityController } from './quality.js';
import { buildNyonyaCharacter, buildBabaCharacter } from './characters.js';

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
        focus: { y: 1.75, halfH: 1.45 },
        enter: { x: 0, y: 0.9, z: 0 }
      },
      {
        id: 'sarong',
        title: '2. Batik Sarong',
        what: 'A vibrant tubular length of hand-waxed Peranakan batik cotton featuring auspicious floral bouquets and pastel-vivid coastal dyes.',
        how: 'Wrapped around the waist, pleated neatly across the front panel, and secured firmly at the hip.',
        focus: { y: 1.15, halfH: 1.15 },
        enter: { x: -1.2, y: -0.2, z: 0.2 }
      },
      {
        id: 'kebaya',
        title: '3. Nyonya Kebaya & Selendang',
        what: 'A tailored, semi-sheer blouse bordered with intricate cutwork embroidery (sulam) paired with a draped shoulder shawl (selendang).',
        how: 'Worn open at the front over the sarong waist with scalloped lace hems resting gracefully over the hips.',
        focus: { y: 2.15, halfH: 1.0 },
        enter: { x: 1.2, y: 0.4, z: 0.2 }
      },
      {
        id: 'kerongsang',
        title: '4. Kerongsang Brooch Set',
        what: 'Three ornate gold-and-gemstone filigree brooches (ibu and anak) linked together by fine metallic chains.',
        how: 'Pinned vertically down the open front lapels of the kebaya—replacing buttons—to fasten the blouse securely.',
        focus: { y: 2.3, halfH: 0.55 },
        enter: { x: 0.9, y: 0.2, z: 0.4 }
      },
      {
        id: 'sanggul',
        title: '5. Sanggul Bun & Cucuk Sanggul',
        what: 'A sculpted chignon hairstyle crowned with three gold-plated decorative hairpins (cucuk sanggul) embossed with floral motifs.',
        how: 'Hair is coiled tightly at the crown and secured with the fan of gilded pins radiating from the bun.',
        focus: { y: 3.25, halfH: 0.5 },
        enter: { x: 0, y: 0.9, z: -0.5 }
      },
      {
        id: 'kasut',
        title: '6. Kasut Manek (Beaded Slippers)',
        what: 'Handcrafted velvet-backed slippers stitched with thousands of tiny faceted glass cut beads in Peranakan floral and geometric patterns.',
        how: 'Slipped onto the feet as the finishing jewel of the Nyonya ensemble for weddings and festive occasions.',
        focus: { y: 0.35, halfH: 0.55 },
        enter: { x: 0, y: 0.7, z: 0.6 }
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
        focus: { y: 1.8, halfH: 1.55 },
        enter: { x: 0, y: 0.9, z: 0 }
      },
      {
        id: 'trousers',
        title: '2. Silk Trousers & Batik Panel',
        what: 'Loose-cut traditional trousers paired with a batik waist wrap reflecting both Chinese tailoring and Malay textile heritage.',
        how: 'Fastened comfortably at the waist, allowing unrestricted airflow and ease of movement.',
        focus: { y: 1.0, halfH: 1.2 },
        enter: { x: 1.2, y: -0.1, z: 0.2 }
      },
      {
        id: 'baju',
        title: '3. Baju Panjang (Long Tunic)',
        what: 'A generous, knee-length tunic coat featuring wide sleeves and subtle brocade or batik-inspired trim.',
        how: 'Draped loosely over the undershirt and trousers for formal community gatherings and ancestral ceremonies.',
        focus: { y: 2.2, halfH: 1.15 },
        enter: { x: -1.2, y: 0.3, z: 0.2 }
      },
      {
        id: 'headwear',
        title: '4. Sash Belt & Songkok-Style Cap',
        what: 'An embroidered waist sash paired with a structured velvet songkok-style cap or traditional skullcap.',
        how: 'The sash cinches the waist over the tunic while the cap crowns the head as a mark of respect and dignity.',
        focus: { y: 2.65, halfH: 1.0 },
        enter: { x: 0, y: 0.9, z: 0.3 }
      },
      {
        id: 'footwear',
        title: '5. Embroidered Baba Footwear',
        what: 'Structured cloth and leather slippers adorned with auspicious gold-thread motifs.',
        how: 'Worn with light socks or bare ankles to complete the dignified Straits Chinese gentleman’s attire.',
        focus: { y: 0.35, halfH: 0.55 },
        enter: { x: 0, y: 0.7, z: 0.6 }
      }
    ]
  }
};
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
  renderer.shadowMap.enabled = !!quality.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
  controls.minDistance = 1.6;
  controls.maxDistance = 16;

  // Touch & Coarse Pointer Controls (P0-3)
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  if (isCoarse) {
    // Lock vertical orbit on touch screens so one-finger vertical swipe scrolls the page
    controls.minPolarAngle = 1.34;
    controls.maxPolarAngle = 1.36;
  } else {
    controls.minPolarAngle = Math.PI * 0.18;
    controls.maxPolarAngle = Math.PI * 0.52;
  }

  // Explicit touch configuration: 1-finger horizontal rotates, 2-finger pinches zoom
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  };

  canvas.style.touchAction = 'pan-y';

  controls.autoRotate = !quality.reducedMotion;
  controls.autoRotateSpeed = 0.65;

  // Pause auto-rotate when user interacts, resume softly after idle
  let idleTimer = null;
  controls.addEventListener('start', () => {
    controls.autoRotate = false;
    if (idleTimer) clearTimeout(idleTimer);
  });
  const resumeAutoRotate = () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!quality.reducedMotion && !exploreState.active) {
        controls.autoRotate = true;
      }
    }, 3500);
  };
  controls.addEventListener('end', resumeAutoRotate);
  canvas.addEventListener('pointercancel', resumeAutoRotate);

  // Studio Three-Point Lighting
  const hemiLight = new THREE.HemisphereLight(0xfaf8f5, 0x10162b, 1.35);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
  keyLight.position.set(5, 8, 6);
  keyLight.castShadow = !!quality.shadows;
  keyLight.shadow.mapSize.set(quality.shadowMapSize, quality.shadowMapSize);
  const sc = keyLight.shadow.camera;
  sc.left = -4.5; sc.right = 4.5; sc.top = 5; sc.bottom = -1; sc.near = 1; sc.far = 22;
  keyLight.shadow.bias = -0.0004;
  keyLight.shadow.normalBias = 0.02;
  scene.add(keyLight);

  const tealRimLight = new THREE.PointLight(0x2dd4bf, 3.2, 16);
  tealRimLight.position.set(-4.5, 4.2, -3.5);
  scene.add(tealRimLight);

  const pinkRimLight = new THREE.PointLight(0xef3340, 2.8, 16);
  pinkRimLight.position.set(4.5, 4.2, -3.5);
  scene.add(pinkRimLight);

  if (quality.tier !== 'LOW') {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    hemiLight.intensity = 0.55;
    keyLight.intensity = 1.9;
  }

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
    disc.receiveShadow = true;
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

  // Build Nyonya & Baba Characters Asynchronously Across Frames (P1-2)
  const characters = {
    female: null,
    male: null
  };

  let charactersBuilt = false;
  let charactersBuilding = false;

  const buildCharactersAsync = async () => {
    if (charactersBuilt || charactersBuilding) return;
    charactersBuilding = true;
    const t0 = performance.now();

    const nyonya = buildNyonyaCharacter(OUTFIT_DATA.female.baseX, quality.geometrySegments);
    stageGroup.add(nyonya.root);
    characters.female = nyonya;

    // Yield main thread to next frame so no task blocks > 50ms
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const baba = buildBabaCharacter(OUTFIT_DATA.male.baseX, quality.geometrySegments);
    stageGroup.add(baba.root);
    characters.male = baba;

    charactersBuilt = true;
    charactersBuilding = false;
    const t1 = performance.now();
    console.log(`[Culture3D] Characters constructed in ${(t1 - t0).toFixed(1)}ms across frames`);
  };

  // Schedule character construction when Culture section is within 800px
  const cultureSectionEl = document.getElementById('culture');
  if ('IntersectionObserver' in window && cultureSectionEl) {
    const buildObserver = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        buildCharactersAsync();
        buildObserver.disconnect();
      }
    }, { rootMargin: '800px 0px' });
    buildObserver.observe(cultureSectionEl);
  } else {
    buildCharactersAsync();
  }

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

  // ---- Framing: fit a region into the part of the canvas NOT covered by the inspector ----
  const viewShift = { b: 0, r: 0 };
  let lastFocus = null;

  const getCovered = () => {
    if (!inspectorEl || inspectorEl.classList.contains('is-hidden')) return { b: 0, r: 0 };
    // mobile: bottom sheet covers the bottom; desktop: side panel covers the right
    return window.innerWidth <= 640
      ? { b: inspectorEl.offsetHeight, r: 0 }
      : { b: 0, r: inspectorEl.offsetWidth + 24 };
  };

  const applyViewShift = () => {
    const w = canvasWrap.clientWidth;
    const h = canvasWrap.clientHeight;
    if (viewShift.b < 0.5 && viewShift.r < 0.5) camera.clearViewOffset();
    else camera.setViewOffset(w, h, viewShift.r / 2, viewShift.b / 2, w, h);
  };

  const fitDistance = (halfH, halfW) => {
    const w = canvasWrap.clientWidth;
    const h = canvasWrap.clientHeight;
    const c = getCovered();
    const fracH = Math.max(0.35, (h - c.b) / h);
    const fracW = Math.max(0.35, (w - c.r) / w);
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    return 1.08 * Math.max(halfH / (t * fracH), halfW / (t * camera.aspect * fracW));
  };

  const focusOn = (cx, cy, halfH, halfW, duration = 0.8, az = 0.1) => {
    const dist = fitDistance(halfH, halfW);
    moveCameraTo(
      new THREE.Vector3(cx + dist * az, cy + dist * 0.06, dist),
      new THREE.Vector3(cx, cy, 0),
      duration
    );
    const c = getCovered();
    if (window.gsap && !quality.reducedMotion && duration > 0) {
      window.gsap.to(viewShift, { b: c.b, r: c.r, duration, ease: 'power3.out', onUpdate: applyViewShift });
    } else {
      viewShift.b = c.b; viewShift.r = c.r; applyViewShift();
    }
    lastFocus = { cx, cy, halfH, halfW, az };
  };

  const refocus = (duration = 0) => {
    if (lastFocus) focusOn(lastFocus.cx, lastFocus.cy, lastFocus.halfH, lastFocus.halfW, duration, lastFocus.az);
  };

  if (inspectorEl && 'ResizeObserver' in window) {
    new ResizeObserver(() => refocus(0.3)).observe(inspectorEl);
  }

  // initial wide view of both characters (replaces the old defaultCamPos / defaultLookTarget framing)
  focusOn(0, 1.75, 1.95, 2.4, 0);

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
  const startExploreMode = async (charKey) => {
    if (!charactersBuilt) await buildCharactersAsync();
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
      if (window.gsap) window.gsap.killTweensOf(grp.position);
      grp.visible = false;
      grp.position.set(step.enter.x, step.enter.y, step.enter.z);
    });

    // Then: assemble Step 0 onto the character after brief exploded preview
    setTimeout(() => {
      goToAssemblyStep(0);
    }, quality.reducedMotion ? 10 : 250);
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

    config.steps.forEach((step, idx) => {
      const grp = charObj.layers[step.id];
      if (!grp) return;
      const assembled = idx <= clampedIdx;
      const isCurrent = idx === clampedIdx;
      const animate = window.gsap && !quality.reducedMotion;
      if (animate) window.gsap.killTweensOf(grp.position);

      if (assembled) {
        const wasHidden = !grp.visible;
        grp.visible = true;
        if (wasHidden) grp.position.set(step.enter.x, step.enter.y, step.enter.z);
        if (animate) {
          window.gsap.to(grp.position, { x: 0, y: 0, z: 0, duration: wasHidden ? 0.9 : 0.4, ease: 'power3.out' });
        } else {
          grp.position.set(0, 0, 0);
        }
      } else if (grp.visible) {
        if (animate) {
          window.gsap.to(grp.position, {
            x: step.enter.x, y: step.enter.y, z: step.enter.z, duration: 0.45, ease: 'power2.in',
            onComplete: () => { grp.visible = false; }
          });
        } else {
          grp.visible = false;
        }
      }

      setLayerHighlight(grp, isCurrent);
      if (isCurrent) setTimeout(() => setLayerHighlight(grp, false), 1100);
    });

    focusOn(
      config.baseX,
      currentStep.focus.y,
      currentStep.focus.halfH,
      Math.max(0.55, currentStep.focus.halfH * 0.9),
      0.8
    );
  };

  const resetToFullOutfits = async (focusMode = 'both') => {
    exploreState.active = false;
    if (!charactersBuilt) await buildCharactersAsync();

    // Reassemble all layers on both characters and clear highlights
    ['female', 'male'].forEach((key) => {
      const cfg = OUTFIT_DATA[key];
      const obj = characters[key];
      if (!obj) return;
      cfg.steps.forEach((step) => {
        const grp = obj.layers[step.id];
        if (!grp) return;
        setLayerHighlight(grp, false);
        grp.visible = true;
        if (window.gsap) window.gsap.killTweensOf(grp.position);
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

    if (focusMode === 'female') focusOn(-1.65, 1.75, 1.95, 0.95);
    else if (focusMode === 'male') focusOn(1.65, 1.75, 1.95, 0.95);
    else {
      focusOn(0, 1.75, 1.95, 2.4);
      if (!quality.reducedMotion) controls.autoRotate = true;
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

  // Mobile Bottom Sheet Expand / Collapse Toggle (P0-1)
  const detailToggleBtn = document.getElementById('inspector-detail-toggle');
  const toggleText = document.getElementById('inspector-toggle-text');
  const drawerHandle = document.querySelector('.inspector-drawer-handle');

  const toggleInspectorExpand = () => {
    if (!inspectorEl) return;
    const isExpanded = inspectorEl.classList.toggle('is-expanded');
    if (detailToggleBtn) detailToggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    if (toggleText) toggleText.textContent = isExpanded ? 'Hide Details' : 'Show Details';
    refocus(0.3);
  };

  detailToggleBtn?.addEventListener('click', toggleInspectorExpand);
  drawerHandle?.addEventListener('click', toggleInspectorExpand);

  // 44x44px Rotate Left / Right Controls for Coarse Pointers & Accessibility (P0-3)
  const rotateLeftBtn = document.getElementById('studio-rotate-left');
  const rotateRightBtn = document.getElementById('studio-rotate-right');

  const rotateStage = (angleDelta) => {
    controls.autoRotate = false;
    const offset = camera.position.clone().sub(controls.target);
    const radius = Math.sqrt(offset.x * offset.x + offset.z * offset.z);
    const curAngle = Math.atan2(offset.x, offset.z);
    const targetAngle = curAngle + angleDelta;
    const targetX = controls.target.x + radius * Math.sin(targetAngle);
    const targetZ = controls.target.z + radius * Math.cos(targetAngle);

    if (window.gsap && !quality.reducedMotion) {
      window.gsap.to(camera.position, {
        x: targetX,
        z: targetZ,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => controls.update()
      });
    } else {
      camera.position.x = targetX;
      camera.position.z = targetZ;
      controls.update();
    }
    resumeAutoRotate();
  };

  rotateLeftBtn?.addEventListener('click', () => rotateStage(Math.PI / 4));
  rotateRightBtn?.addEventListener('click', () => rotateStage(-Math.PI / 4));

  // Canvas Buffer Sizing with ResizeObserver on Canvas Wrapper (P1-3)
  const handleResize = () => {
    if (!canvasWrap || !renderer || !camera) return;
    const w = canvasWrap.clientWidth;
    const h = canvasWrap.clientHeight;
    if (w <= 0 || h <= 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const dpr = Math.min(window.devicePixelRatio || 1, quality.dpr);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    refocus(0);
  };
  window.addEventListener('resize', handleResize);
  if ('ResizeObserver' in window && canvasWrap) {
    new ResizeObserver(handleResize).observe(canvasWrap);
  }

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
      // Gentle breathing bob on both characters once constructed
      if (characters.female && characters.female.root) {
        characters.female.root.position.y = Math.sin(elapsed * 1.7) * 0.025;
      }
      if (characters.male && characters.male.root) {
        characters.male.root.position.y = Math.sin(elapsed * 1.7 + 1.2) * 0.025;
      }
    }

    renderer.render(scene, camera);
  };

  createVisibilityController(studioEl, (visible) => {
    isActive = visible;
    if (isActive) {
      handleResize();
      clock.start();
      animate();
    } else if (rafId) {
      cancelAnimationFrame(rafId);
    }
  });
}