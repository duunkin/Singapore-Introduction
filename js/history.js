/**
 * HISTORY.JS — Section 1: Scroll-Driven 3D Timeline
 * Pins the History stage while cards fly through 3D Z-space, morphing the
 * HUD year counter and blending the Three.js scene across 5 historical eras:
 *   0: 1819 — Raffles & the Free Port (Maritime Teal)
 *   1: 1819–1941 — Crown Jewel of the British Empire (Imperial Gold)
 *   2: 1942 — Fall of Singapore (Wartime Crimson & Ash)
 *   3: 1963 — Merger with Malaysia (Turbulent Indigo/Violet)
 *   4: 9 August 1965 — Expulsion & Sovereign Republic (Singapore Red & Dawn White)
 */

import * as THREE from 'three';
import { createVisibilityController } from './quality.js';

const ERA_MOODS = [
  {
    year: '1819',
    tag: 'ERA 01 / 05 — MARITIME FOUNDATION',
    fogColor: new THREE.Color(0x06141f),
    primaryColor: new THREE.Color(0x2dd4bf),
    accentColor: new THREE.Color(0x38bdf8),
    ringScale: 1.0,
    waveSpeed: 0.9,
    rotSpeed: 0.18
  },
  {
    year: '1819–1941',
    tag: 'ERA 02 / 05 — IMPERIAL ZENITH',
    fogColor: new THREE.Color(0x141008),
    primaryColor: new THREE.Color(0xf59e0b),
    accentColor: new THREE.Color(0xfde68a),
    ringScale: 1.28,
    waveSpeed: 1.1,
    rotSpeed: 0.26
  },
  {
    year: '1942',
    tag: 'ERA 03 / 05 — SHATTERED MYTHS',
    fogColor: new THREE.Color(0x170608),
    primaryColor: new THREE.Color(0xdc2626),
    accentColor: new THREE.Color(0x7f1d1d),
    ringScale: 0.72,
    waveSpeed: 2.1,
    rotSpeed: -0.45
  },
  {
    year: '1963',
    tag: 'ERA 04 / 05 — TURBULENT UNION',
    fogColor: new THREE.Color(0x0e0b24),
    primaryColor: new THREE.Color(0x818cf8),
    accentColor: new THREE.Color(0xf43f5e),
    ringScale: 1.12,
    waveSpeed: 1.65,
    rotSpeed: 0.35
  },
  {
    year: '9 AUG 1965',
    tag: 'ERA 05 / 05 — SOVEREIGN REPUBLIC',
    fogColor: new THREE.Color(0x16070c),
    primaryColor: new THREE.Color(0xef3340),
    accentColor: new THREE.Color(0xfaf8f5),
    ringScale: 1.42,
    waveSpeed: 1.25,
    rotSpeed: 0.22
  }
];

export function initHistorySection(quality, scrollSystem) {
  const pinWrapper = document.getElementById('history-pin-wrapper');
  const stageEl = document.getElementById('history-stage');
  const canvas = document.getElementById('history-canvas');
  const yearDisplay = document.getElementById('history-year-display');
  const eraTagDisplay = document.getElementById('history-era-tag');
  const cards = Array.from(document.querySelectorAll('.history-card'));
  const navDots = Array.from(document.querySelectorAll('.history-dot'));

  if (!pinWrapper || !stageEl || cards.length === 0) return;

  let currentEraIndex = 0;
  let timelineProgress = 0; // 0 to 1 across all 5 eras
  let pinScrollTrigger = null;

  // -------------------------------------------------------------------------
  // 1. HUD Year Morphing & Active Era State
  // -------------------------------------------------------------------------
  const setActiveEra = (index) => {
    if (index === currentEraIndex) return;
    currentEraIndex = index;
    const mood = ERA_MOODS[index] || ERA_MOODS[0];

    // Morph the year display with a snappy vertical flip
    if (yearDisplay) {
      if (!quality.reducedMotion && window.gsap) {
        window.gsap.fromTo(
          yearDisplay,
          { y: -14, opacity: 0.25, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.28,
            ease: 'power2.out',
            onStart: () => {
              yearDisplay.textContent = mood.year;
            }
          }
        );
      } else {
        yearDisplay.textContent = mood.year;
      }
    }

    if (eraTagDisplay) {
      eraTagDisplay.textContent = mood.tag;
    }

    navDots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === index);
    });
  };

  // -------------------------------------------------------------------------
  // 2. 3D Card Depth Flight Positioning
  // -------------------------------------------------------------------------
  const updateCardsDepth = (progress) => {
    if (quality.reducedMotion) return;

    const totalIntervals = cards.length - 1; // 4 intervals for 5 cards
    const floatIndex = progress * totalIntervals;
    const nearestIndex = Math.min(
      cards.length - 1,
      Math.max(0, Math.round(floatIndex))
    );

    setActiveEra(nearestIndex);

    cards.forEach((card, i) => {
      // offset < 0 means card has already flown past camera
      // offset > 0 means card is still approaching from deep Z-space
      const offset = i - floatIndex;
      const absOffset = Math.abs(offset);

      if (absOffset > 1.85) {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.style.visibility = 'hidden';
        return;
      }

      card.style.visibility = 'visible';

      let translateZ = 0;
      let translateY = 0;
      let rotateX = 0;
      let opacity = 1;
      let blur = 0;

      if (offset < 0) {
        // Card flying toward/past the viewer
        translateZ = Math.min(260, -offset * 290);
        translateY = offset * 75;
        rotateX = offset * 8;
        opacity = Math.max(0, 1 - absOffset * 1.35);
        blur = Math.min(10, absOffset * 8);
      } else {
        // Card emerging from deep background
        translateZ = -offset * 380;
        translateY = offset * 48;
        rotateX = -offset * 6;
        opacity = Math.max(0, 1 - absOffset * 0.92);
        blur = Math.min(8, absOffset * 5);
      }

      card.style.opacity = opacity.toFixed(3);
      card.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, ${translateZ.toFixed(1)}px) rotateX(${rotateX.toFixed(2)}deg)`;
      card.style.filter = blur > 0.35 ? `blur(${blur.toFixed(1)}px)` : 'none';
      card.style.pointerEvents = absOffset < 0.45 ? 'auto' : 'none';
    });
  };

  // Initialize starting positions
  updateCardsDepth(0);

  // -------------------------------------------------------------------------
  // 3. GSAP ScrollTrigger Pinned Timeline + Interactive Era Dot Navigation
  // -------------------------------------------------------------------------
  if (window.gsap && window.ScrollTrigger && !quality.reducedMotion) {
    pinScrollTrigger = window.ScrollTrigger.create({
      trigger: pinWrapper,
      start: 'top top',
      end: () => `+=${window.innerHeight * 3.8}`,
      pin: stageEl,
      scrub: 0.65,
      anticipatePin: 1,
      onUpdate: (self) => {
        timelineProgress = self.progress;
        updateCardsDepth(timelineProgress);
      }
    });
  }

  // Clicking an Era Dot smoothly scrolls to that exact era
  navDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      const targetProgress = idx / (cards.length - 1);
      if (pinScrollTrigger && !quality.reducedMotion) {
        const targetScrollY =
          pinScrollTrigger.start +
          (pinScrollTrigger.end - pinScrollTrigger.start) * targetProgress;

        if (scrollSystem && scrollSystem.lenis) {
          scrollSystem.lenis.scrollTo(targetScrollY, { duration: 1.05 });
        } else {
          window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
        }
      } else {
        setActiveEra(idx);
        cards[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // -------------------------------------------------------------------------
  // 4. Three.js Era Mood Background (Compass Rings + Maritime/Historical Wave)
  // -------------------------------------------------------------------------
  if (!canvas || !quality.webglSupported) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: quality.antialias,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(quality.dpr);
  renderer.setSize(stageEl.clientWidth, stageEl.clientHeight, false);

  const scene = new THREE.Scene();
  const currentFogColor = ERA_MOODS[0].fogColor.clone();
  scene.fog = new THREE.FogExp2(currentFogColor, 0.045);

  const camera = new THREE.PerspectiveCamera(
    50,
    stageEl.clientWidth / stageEl.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.8, 12);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0x2dd4bf, 3.2, 35);
  pointLight.position.set(0, 4, 4);
  scene.add(pointLight);

  // Central Astrolabe / Chronometer Rings representing historical turning points
  const coreGroup = new THREE.Group();
  coreGroup.position.set(0, 1.2, -2);
  scene.add(coreGroup);

  const ringMat = new THREE.MeshStandardMaterial({
    color: ERA_MOODS[0].primaryColor,
    emissive: ERA_MOODS[0].primaryColor,
    emissiveIntensity: 0.35,
    roughness: 0.3,
    metalness: 0.8,
    wireframe: true
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: ERA_MOODS[0].accentColor,
    emissive: ERA_MOODS[0].accentColor,
    emissiveIntensity: 0.25,
    roughness: 0.4,
    metalness: 0.7
  });

  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(4.2, 0.06, 12, quality.geometrySegments * 2),
    ringMat
  );
  coreGroup.add(outerRing);

  const midRing = new THREE.Mesh(
    new THREE.TorusGeometry(3.1, 0.045, 10, quality.geometrySegments * 2),
    accentMat
  );
  midRing.rotation.x = Math.PI / 3;
  coreGroup.add(midRing);

  const innerCrystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(1.35, 1),
    ringMat
  );
  coreGroup.add(innerCrystal);

  // Undulating Maritime / Topographic Wireframe Terrain
  const planeSegs = quality.tier === 'HIGH' ? 36 : 20;
  const waveGeo = new THREE.PlaneGeometry(34, 24, planeSegs, planeSegs);
  waveGeo.rotateX(-Math.PI / 2);
  const baseWavePos = waveGeo.attributes.position.array.slice();

  const waveMat = new THREE.MeshBasicMaterial({
    color: ERA_MOODS[0].primaryColor,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const waveMesh = new THREE.Mesh(waveGeo, waveMat);
  waveMesh.position.y = -2.4;
  scene.add(waveMesh);

  // Floating Era Dust Particles
  const pCount = quality.historyParticles;
  const pPositions = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 26;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 18;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({
    color: ERA_MOODS[0].accentColor,
    size: 0.08,
    transparent: true,
    opacity: 0.65
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Resize Listener
  const handleResize = () => {
    const w = stageEl.clientWidth;
    const h = stageEl.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  window.addEventListener('resize', handleResize);

  // Render Loop with Smooth Era Mood Interpolation
  let isActive = false;
  let rafId = null;
  const clock = new THREE.Clock();

  const animate = () => {
    if (!isActive) return;
    rafId = requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();
    const targetMood = ERA_MOODS[currentEraIndex] || ERA_MOODS[0];

    // Smoothly blend colors & scale toward current historical era
    ringMat.color.lerp(targetMood.primaryColor, 0.05);
    ringMat.emissive.lerp(targetMood.primaryColor, 0.05);
    waveMat.color.lerp(targetMood.primaryColor, 0.05);
    accentMat.color.lerp(targetMood.accentColor, 0.05);
    accentMat.emissive.lerp(targetMood.accentColor, 0.05);
    pMat.color.lerp(targetMood.accentColor, 0.05);
    pointLight.color.lerp(targetMood.primaryColor, 0.05);
    scene.fog.color.lerp(targetMood.fogColor, 0.05);

    const currentScale = coreGroup.scale.x;
    const nextScale = currentScale + (targetMood.ringScale - currentScale) * 0.05;
    coreGroup.scale.setScalar(nextScale);

    if (!quality.reducedMotion) {
      outerRing.rotation.z += 0.004 * targetMood.rotSpeed;
      outerRing.rotation.y = Math.sin(elapsed * 0.3) * 0.35;
      midRing.rotation.x += 0.006 * targetMood.rotSpeed;
      midRing.rotation.y -= 0.004 * targetMood.rotSpeed;
      innerCrystal.rotation.y += 0.01 * targetMood.rotSpeed;
      innerCrystal.rotation.x = elapsed * 0.2;

      // Animate maritime/historical wave vertices
      const posAttr = waveGeo.attributes.position;
      const arr = posAttr.array;
      for (let i = 0; i < arr.length; i += 3) {
        const bx = baseWavePos[i];
        const bz = baseWavePos[i + 2];
        arr[i + 1] =
          Math.sin(bx * 0.35 + elapsed * targetMood.waveSpeed) * 0.42 +
          Math.cos(bz * 0.35 + elapsed * targetMood.waveSpeed * 0.8) * 0.32;
      }
      posAttr.needsUpdate = true;

      particles.rotation.y = elapsed * 0.03;
    }

    // Subtle camera push along timeline progress
    camera.position.z = 12 - timelineProgress * 2.2;
    camera.lookAt(0, 0.8, -2);

    renderer.render(scene, camera);
  };

  createVisibilityController(stageEl, (visible) => {
    isActive = visible;
    if (isActive) {
      clock.start();
      animate();
    } else if (rafId) {
      cancelAnimationFrame(rafId);
    }
  });
}