/**
 * ECONOMY.JS — Section 2: "Third World to First"
 * 1) Interactive 3D rising skyline & trade-flow visualization that extrudes
 *    buildings and activates shipping/aviation flow lines across 4 stages:
 *      Stage 0: 1965 Starting Point (Low-rise baseline, resource scarcity)
 *      Stage 1: Export-Oriented Industrialization (Jurong Industrial Estate)
 *      Stage 2: 1980s–90s Upgrade (Port of Singapore & Changi Airport hubs)
 *      Stage 3: Today (Premier wealth-management, AI & Smart Nation skyline)
 * 2) Interactive Parking.sg phone mini-demo (zone rate selector, remote +30m
 *    extension, and early-end automatic refund simulation).
 */

import * as THREE from 'three';
import { createVisibilityController } from './quality.js';

const ECON_STAGES = [
  {
    index: 0,
    yearText: '1965',
    title: '1965: Starting Point',
    cameraPos: { x: 8.5, y: 7.2, z: 12.5 },
    gridColor: new THREE.Color(0xf59e0b),
    flowSpeed: 0.15,
    activeArcs: 1
  },
  {
    index: 1,
    yearText: 'STAGE 1',
    title: 'Stage 1: Jurong Industrialization',
    cameraPos: { x: 9.8, y: 8.0, z: 13.0 },
    gridColor: new THREE.Color(0x38bdf8),
    flowSpeed: 0.45,
    activeArcs: 3
  },
  {
    index: 2,
    yearText: '1980s–90s',
    title: 'Stage 2: Global Port & Aviation Hubs',
    cameraPos: { x: 10.5, y: 8.8, z: 13.5 },
    gridColor: new THREE.Color(0x2dd4bf),
    flowSpeed: 0.8,
    activeArcs: 5
  },
  {
    index: 3,
    yearText: 'TODAY',
    title: 'Stage 3: Smart Nation & Finance Hub',
    cameraPos: { x: 11.2, y: 9.6, z: 14.2 },
    gridColor: new THREE.Color(0xef3340),
    flowSpeed: 1.15,
    activeArcs: 7
  }
];

export function initEconomySection(quality) {
  initParkingSgDemo();
  initEconomy3DStage(quality);
}

/* ==========================================================================
   PART 1 — INTERACTIVE PARKING.SG PHONE MINI-DEMO
   ========================================================================== */
function initParkingSgDemo() {
  const zoneSelect = document.getElementById('parking-zone-select');
  const durationValEl = document.getElementById('parking-duration-val');
  const costValEl = document.getElementById('parking-cost-val');
  const sessionBox = document.getElementById('parking-session-box');
  const sessionText = document.getElementById('parking-session-text');
  const startBtn = document.getElementById('parking-start-btn');
  const extendBtn = document.getElementById('parking-extend-btn');
  const endBtn = document.getElementById('parking-end-btn');

  if (!zoneSelect || !startBtn || !extendBtn || !endBtn) return;

  let isSessionActive = false;
  let halfHourBlocks = 2; // Default 1.0 hour (2 x 30m blocks)

  const getRatePerHalfHour = () => {
    const selectedOption = zoneSelect.options[zoneSelect.selectedIndex];
    return parseFloat(selectedOption?.getAttribute('data-rate') || '1.20');
  };

  const getZoneCode = () => zoneSelect.value || 'MB01';

  const updateDisplay = () => {
    const hours = (halfHourBlocks * 0.5).toFixed(1);
    const totalCost = (halfHourBlocks * getRatePerHalfHour()).toFixed(2);
    if (durationValEl) durationValEl.textContent = `${hours} hr`;
    if (costValEl) costValEl.textContent = `S$${totalCost}`;
  };

  zoneSelect.addEventListener('change', () => {
    if (!isSessionActive) {
      halfHourBlocks = 2;
    }
    updateDisplay();
    if (isSessionActive && sessionText) {
      sessionText.textContent = `Active at ${getZoneCode()} · Remote telemetry synced.`;
    }
  });

  // Start Digital Parking Session
  startBtn.addEventListener('click', () => {
    isSessionActive = true;
    halfHourBlocks = 2;
    updateDisplay();

    sessionBox?.classList.remove('is-refunded');
    sessionBox?.classList.add('is-active');

    const totalCost = (halfHourBlocks * getRatePerHalfHour()).toFixed(2);
    if (sessionText) {
      sessionText.textContent = `Session active in zone ${getZoneCode()} (S$${totalCost} paid digitally).`;
    }

    startBtn.textContent = 'Session Active';
    startBtn.disabled = true;
    extendBtn.disabled = false;
    endBtn.disabled = false;
  });

  // Extend Remotely (+30 mins)
  extendBtn.addEventListener('click', () => {
    if (!isSessionActive) return;
    halfHourBlocks = Math.min(10, halfHourBlocks + 1);
    updateDisplay();

    const hours = (halfHourBlocks * 0.5).toFixed(1);
    if (sessionText) {
      sessionText.textContent = `Extended remotely to ${hours} hr from your phone.`;
    }
  });

  // End Early & Calculate Per-Minute Refund
  endBtn.addEventListener('click', () => {
    if (!isSessionActive) return;
    isSessionActive = false;

    const rate = getRatePerHalfHour();
    const billedAmount = halfHourBlocks * rate;
    // Simulate ending with ~35% unused time refunded automatically
    const refundedAmount = Math.max(0.3, billedAmount * 0.35).toFixed(2);
    const finalCharge = Math.max(0.3, billedAmount - parseFloat(refundedAmount)).toFixed(2);

    if (costValEl) {
      costValEl.textContent = `S$${finalCharge}`;
    }

    sessionBox?.classList.remove('is-active');
    sessionBox?.classList.add('is-refunded');

    if (sessionText) {
      sessionText.textContent = `Ended early · S$${refundedAmount} unused time refunded automatically!`;
    }

    startBtn.textContent = 'Book Again';
    startBtn.disabled = false;
    extendBtn.disabled = true;
    endBtn.disabled = true;
  });

  updateDisplay();
}

/* ==========================================================================
   PART 2 — 3D RISING CITY SKYLINE & PORT TRADE FLOW STAGE
   ========================================================================== */
function initEconomy3DStage(quality) {
  const canvas = document.getElementById('economy-canvas');
  const stageCard = document.getElementById('economy-stage-card');
  const stageLabelEl = document.getElementById('economy-stage-label');
  const yearCounterEl = document.getElementById('economy-year-counter');
  const stageButtons = Array.from(document.querySelectorAll('.econ-stage-btn'));
  const narrativeCards = Array.from(document.querySelectorAll('.econ-card[data-econ-card]'));

  if (!canvas || !stageCard || !quality.webglSupported) return;

  const canvasWrap = canvas.parentElement;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: quality.antialias,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(quality.dpr);
  renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070f, 0.038);

  const camera = new THREE.PerspectiveCamera(
    42,
    canvasWrap.clientWidth / canvasWrap.clientHeight,
    0.1,
    100
  );
  camera.position.set(8.5, 7.2, 12.5);

  // Lighting
  const ambient = new THREE.AmbientLight(0x1e295b, 1.5);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xfaf8f5, 2.2);
  dirLight.position.set(10, 18, 12);
  scene.add(dirLight);

  const redRim = new THREE.PointLight(0xef3340, 3.0, 26);
  redRim.position.set(-6, 8, -4);
  scene.add(redRim);

  const worldGroup = new THREE.Group();
  scene.add(worldGroup);

  // Base Island Grid Platform
  const gridHelper = new THREE.GridHelper(18, 18, 0xf59e0b, 0x162042);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.35;
  worldGroup.add(gridHelper);

  // -------------------------------------------------------------------------
  // Procedural City Districts (Extrude height per economic stage 0..3)
  // -------------------------------------------------------------------------
  // District A: West / Jurong Industrial Estate (rises strongly in Stage 1)
  // District B: Southern Port Cranes & East Changi Hub (rises in Stage 2)
  // District C: Central Financial & Smart Tech Towers (soars in Stage 3)
  const buildingSpecs = [
    // Jurong Industrial Blocks (West / Left)
    { x: -4.2, z: -1.8, w: 1.3, d: 1.3, heights: [0.25, 1.8, 2.3, 2.6], color: 0x38bdf8 },
    { x: -2.6, z: -2.4, w: 1.4, d: 1.1, heights: [0.2, 2.1, 2.5, 2.8], color: 0x38bdf8 },
    { x: -4.0, z: 0.2, w: 1.2, d: 1.4, heights: [0.3, 1.6, 2.1, 2.4], color: 0x38bdf8 },
    { x: -2.4, z: -0.5, w: 1.1, d: 1.1, heights: [0.2, 1.5, 2.0, 2.5], color: 0x38bdf8 },

    // Port of Singapore & Changi Infrastructure (South & East / Front & Right)
    { x: -0.6, z: 2.4, w: 1.6, d: 0.9, heights: [0.35, 0.9, 2.8, 3.2], color: 0x2dd4bf },
    { x: 1.4, z: 2.2, w: 1.5, d: 0.9, heights: [0.3, 0.8, 3.1, 3.5], color: 0x2dd4bf },
    { x: 3.6, z: 1.4, w: 1.4, d: 1.4, heights: [0.25, 0.7, 2.9, 3.6], color: 0x2dd4bf },
    { x: 4.2, z: -0.8, w: 1.6, d: 1.2, heights: [0.2, 0.6, 2.6, 3.3], color: 0x2dd4bf },

    // Central Banking, Wealth Management & Smart-City Skyline (Center Core)
    { x: -0.8, z: -0.6, w: 1.1, d: 1.1, heights: [0.4, 1.1, 2.8, 5.4], color: 0xef3340 },
    { x: 0.6, z: -1.2, w: 1.2, d: 1.2, heights: [0.45, 1.2, 3.2, 6.4], color: 0xef3340 },
    { x: 0.5, z: 0.5, w: 1.05, d: 1.05, heights: [0.35, 1.0, 2.5, 4.9], color: 0xef3340 },
    { x: 2.0, z: -0.4, w: 1.15, d: 1.15, heights: [0.3, 0.9, 2.7, 5.8], color: 0xef3340 },
    { x: -0.4, z: -2.4, w: 1.2, d: 1.0, heights: [0.3, 1.0, 2.4, 4.6], color: 0xfaf8f5 },
    { x: 1.9, z: -2.2, w: 1.1, d: 1.1, heights: [0.25, 0.85, 2.2, 4.3], color: 0xfaf8f5 }
  ];

  // Unit Box Geometry shifted so y=0 is at the bottom face for clean y-scale extrusion
  const unitBoxGeo = new THREE.BoxGeometry(1, 1, 1);
  unitBoxGeo.translate(0, 0.5, 0);
  const unitEdgesGeo = new THREE.EdgesGeometry(unitBoxGeo);

  const buildings = buildingSpecs.map((spec) => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0d152c,
      roughness: 0.25,
      metalness: 0.78,
      emissive: spec.color,
      emissiveIntensity: 0.14
    });

    const mesh = new THREE.Mesh(unitBoxGeo, mat);
    mesh.position.set(spec.x, 0, spec.z);
    mesh.scale.set(spec.w, spec.heights[0], spec.d);

    const wireMat = new THREE.LineBasicMaterial({
      color: spec.color,
      transparent: true,
      opacity: 0.55
    });
    const wire = new THREE.LineSegments(unitEdgesGeo, wireMat);
    mesh.add(wire);

    worldGroup.add(mesh);

    return {
      mesh,
      mat,
      wireMat,
      heights: spec.heights,
      targetHeight: spec.heights[0]
    };
  });

  // -------------------------------------------------------------------------
  // Animated Trade Route Flow Arcs (Maritime & Global Aviation Corridors)
  // -------------------------------------------------------------------------
  const arcDefinitions = [
    { start: [-7.5, 0.1, 4.5], mid: [-2.5, 2.2, 3.0], end: [-0.6, 0.4, 2.4], color: 0x2dd4bf },
    { start: [-6.8, 0.1, -3.5], mid: [-5.2, 2.0, -2.2], end: [-3.8, 0.5, -1.6], color: 0x38bdf8 },
    { start: [7.2, 0.1, 4.2], mid: [4.2, 2.6, 2.8], end: [1.4, 0.5, 2.2], color: 0x2dd4bf },
    { start: [7.8, 0.1, -2.5], mid: [5.5, 3.2, -0.5], end: [3.6, 0.6, 1.4], color: 0x38bdf8 },
    { start: [-5.5, 0.1, 6.2], mid: [0.0, 3.8, 3.5], end: [0.6, 1.2, -1.2], color: 0xef3340 },
    { start: [6.0, 0.1, -5.5], mid: [3.2, 4.2, -3.0], end: [0.6, 1.5, -1.2], color: 0xef3340 },
    { start: [-6.2, 0.1, -5.8], mid: [-2.0, 4.5, -3.2], end: [2.0, 1.4, -0.4], color: 0xfaf8f5 }
  ];

  const pulseGeo = new THREE.SphereGeometry(0.14, 10, 10);
  const tradeArcs = arcDefinitions.map((def, idx) => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...def.start),
      new THREE.Vector3(...def.mid),
      new THREE.Vector3(...def.end)
    );

    const points = curve.getPoints(32);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
      color: def.color,
      transparent: true,
      opacity: idx === 0 ? 0.55 : 0.08
    });
    const line = new THREE.Line(lineGeo, lineMat);
    worldGroup.add(line);

    const pulseMat = new THREE.MeshBasicMaterial({
      color: def.color,
      transparent: true,
      opacity: idx === 0 ? 1 : 0
    });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    worldGroup.add(pulseMesh);

    return {
      curve,
      lineMat,
      pulseMesh,
      pulseMat,
      progress: (idx * 0.27) % 1
    };
  });

  // -------------------------------------------------------------------------
  // Stage Switching State & ScrollTrigger Binding
  // -------------------------------------------------------------------------
  let activeStageIdx = 0;

  const setEconomyStage = (stageIdx) => {
    const clamped = Math.min(ECON_STAGES.length - 1, Math.max(0, stageIdx));
    activeStageIdx = clamped;
    const stageData = ECON_STAGES[clamped];

    if (stageLabelEl) stageLabelEl.textContent = stageData.title;
    if (yearCounterEl) yearCounterEl.textContent = stageData.yearText;

    stageButtons.forEach((btn, idx) => {
      btn.classList.toggle('is-active', idx === clamped);
    });

    narrativeCards.forEach((card) => {
      const cardStage = parseInt(card.getAttribute('data-econ-card') || '0', 10);
      card.classList.toggle('is-current', cardStage === clamped);
    });

    // Update target building heights for smooth extrusion
    buildings.forEach((b) => {
      b.targetHeight = b.heights[clamped];
    });

    // Update active trade route arcs
    tradeArcs.forEach((arc, idx) => {
      const isVisible = idx < stageData.activeArcs;
      arc.lineMat.opacity = isVisible ? 0.58 : 0.06;
      arc.pulseMat.opacity = isVisible ? 1 : 0;
    });
  };

  // Manual Stage Button Clicks
  stageButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-econ-stage') || '0', 10);
      setEconomyStage(idx);
    });
  });

  // Scroll-Driven Narrative Card Triggers
  if (window.gsap && window.ScrollTrigger) {
    narrativeCards.forEach((card) => {
      const stageIdx = parseInt(card.getAttribute('data-econ-card') || '0', 10);
      window.ScrollTrigger.create({
        trigger: card,
        start: 'top 62%',
        end: 'bottom 45%',
        onEnter: () => setEconomyStage(stageIdx),
        onEnterBack: () => setEconomyStage(stageIdx)
      });
    });
  }

  // Resize Handling with ResizeObserver & DPR Cap (P1-3)
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
  };
  window.addEventListener('resize', handleResize);
  if ('ResizeObserver' in window && canvasWrap) {
    new ResizeObserver(handleResize).observe(canvasWrap);
  }

  // Interactive Tap-to-Toggle Hotspots & Readable Bottom Caption (P2)
  const hotspotEls = document.querySelectorAll('.econ-hotspot');
  const captionEl = document.getElementById('econ-hotspot-caption');

  hotspotEls.forEach((spot) => {
    const btn = spot.querySelector('.econ-hotspot__btn');
    const card = spot.querySelector('.econ-hotspot__card');
    if (!btn || !card) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isAlreadyActive = spot.classList.contains('is-active');
      hotspotEls.forEach((s) => s.classList.remove('is-active'));

      if (!isAlreadyActive) {
        spot.classList.add('is-active');
        if (captionEl) {
          const title = card.querySelector('strong')?.textContent || '';
          const desc = card.querySelector('p')?.textContent || '';
          captionEl.innerHTML = `<strong>${title}</strong> — ${desc}`;
          captionEl.classList.add('is-visible');
        }
      } else {
        if (captionEl) captionEl.classList.remove('is-visible');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.econ-hotspot') && !e.target.closest('.econ-hotspot-caption')) {
      hotspotEls.forEach((s) => s.classList.remove('is-active'));
      if (captionEl) captionEl.classList.remove('is-visible');
    }
  });

  // Render Loop Controlled by Viewport Visibility
  let isActive = false;
  let rafId = null;
  const clock = new THREE.Clock();

  const animate = () => {
    if (!isActive) return;
    rafId = requestAnimationFrame(animate);

    const delta = Math.min(0.05, clock.getDelta());
    const elapsed = clock.getElapsedTime();
    const stageData = ECON_STAGES[activeStageIdx];

    // Smoothly extrude building heights toward active stage targets
    buildings.forEach((b) => {
      const currentH = b.mesh.scale.y;
      const nextH = currentH + (b.targetHeight - currentH) * 0.08;
      b.mesh.scale.y = nextH;
      b.mat.emissiveIntensity = 0.1 + (nextH / 6.5) * 0.28;
    });

    // Camera & Grid Transition
    camera.position.x += (stageData.cameraPos.x - camera.position.x) * 0.04;
    camera.position.y += (stageData.cameraPos.y - camera.position.y) * 0.04;
    camera.position.z += (stageData.cameraPos.z - camera.position.z) * 0.04;
    camera.lookAt(0, 1.6, 0);

    if (!quality.reducedMotion) {
      worldGroup.rotation.y = Math.sin(elapsed * 0.22) * 0.18;

      // Move cargo / data packets along active bezier trade routes
      tradeArcs.forEach((arc, idx) => {
        if (idx < stageData.activeArcs) {
          arc.progress = (arc.progress + delta * stageData.flowSpeed * 0.55) % 1;
          const pt = arc.curve.getPointAt(arc.progress);
          arc.pulseMesh.position.copy(pt);
        }
      });
    }

    renderer.render(scene, camera);
  };

  createVisibilityController(stageCard, (visible) => {
    isActive = visible;
    if (isActive) {
      clock.start();
      animate();
    } else if (rafId) {
      cancelAnimationFrame(rafId);
    }
  });
}