/**
 * HERO3D.JS — Full-Screen WebGL Singapore Skyline
 * Builds an architectural Marina Bay Sands silhouette (3 towers + SkyPark cantilever),
 * illuminated Supertrees, CBD skyscrapers, water reflection grid, and floating lanterns.
 */

import * as THREE from 'three';
import { createVisibilityController } from './quality.js';

export function initHero3D(quality) {
  const canvas = document.getElementById('hero-canvas');
  const section = document.getElementById('hero');
  if (!canvas || !section || !quality.webglSupported) return null;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: quality.antialias,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(quality.dpr);
  renderer.setSize(section.clientWidth, section.clientHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060811, 0.032);

  const camera = new THREE.PerspectiveCamera(
    45,
    section.clientWidth / section.clientHeight,
    0.1,
    150
  );
  camera.position.set(0, 4.2, 22);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x1e295b, 1.4);
  scene.add(ambientLight);

  const redRimLight = new THREE.DirectionalLight(0xef3340, 2.8);
  redRimLight.position.set(14, 18, -10);
  scene.add(redRimLight);

  const cyanKeyLight = new THREE.DirectionalLight(0x2dd4bf, 1.6);
  cyanKeyLight.position.set(-16, 12, 10);
  scene.add(cyanKeyLight);

  const cityGroup = new THREE.Group();
  scene.add(cityGroup);

  // Shared Materials
  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x0d1326,
    roughness: 0.25,
    metalness: 0.8,
    emissive: 0x070b18,
    emissiveIntensity: 0.5
  });

  const edgeLineMat = new THREE.LineBasicMaterial({
    color: 0xef3340,
    transparent: true,
    opacity: 0.45
  });

  const tealLineMat = new THREE.LineBasicMaterial({
    color: 0x2dd4bf,
    transparent: true,
    opacity: 0.4
  });

  // 1. Marina Bay Sands Silhouette (3 Slanted Towers + Cantilever SkyPark)
  const mbsGroup = new THREE.Group();
  mbsGroup.position.set(3.2, 0, -2);

  const towerGeo = new THREE.BoxGeometry(1.15, 6.8, 0.75);
  [-2.1, 0, 2.1].forEach((xOffset, idx) => {
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.set(xOffset, 3.4, 0);
    tower.rotation.z = -0.045 + idx * 0.015;
    mbsGroup.add(tower);

    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(towerGeo), edgeLineMat);
    edges.position.copy(tower.position);
    edges.rotation.copy(tower.rotation);
    mbsGroup.add(edges);
  });

  // SkyPark Hull on Top of the Three Towers
  const skyParkGeo = new THREE.CylinderGeometry(0.45, 0.45, 6.8, 16);
  skyParkGeo.rotateZ(Math.PI / 2);
  skyParkGeo.scale(1, 0.38, 1.35);
  const skyParkMat = new THREE.MeshStandardMaterial({
    color: 0x161f3d,
    roughness: 0.2,
    metalness: 0.9,
    emissive: 0xef3340,
    emissiveIntensity: 0.25
  });
  const skyPark = new THREE.Mesh(skyParkGeo, skyParkMat);
  skyPark.position.set(0.35, 6.95, 0);
  mbsGroup.add(skyPark);

  cityGroup.add(mbsGroup);

  // 2. CBD Financial District Skyline Cluster (Left & Background)
  const cbdLayout = [
    { x: -6.5, z: -4, w: 1.5, h: 7.8, d: 1.5 },
    { x: -4.6, z: -3.2, w: 1.2, h: 6.2, d: 1.2 },
    { x: -3.0, z: -5.0, w: 1.6, h: 8.6, d: 1.4 },
    { x: -8.2, z: -5.5, w: 1.3, h: 5.4, d: 1.3 },
    { x: -1.2, z: -6.2, w: 1.4, h: 6.5, d: 1.4 },
    { x: 7.4, z: -5.2, w: 1.3, h: 4.8, d: 1.2 }
  ];

  cbdLayout.forEach((b, idx) => {
    const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
    const mesh = new THREE.Mesh(geo, towerMat);
    mesh.position.set(b.x, b.h / 2, b.z);
    cityGroup.add(mesh);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      idx % 2 === 0 ? tealLineMat : edgeLineMat
    );
    edges.position.copy(mesh.position);
    cityGroup.add(edges);
  });

  // 3. Gardens by the Bay Supertrees (Right Foreground)
  const createSupertree = (x, z, scale) => {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.scale.setScalar(scale);

    const trunkGeo = new THREE.CylinderGeometry(0.14, 0.35, 2.6, 8);
    const canopyGeo = new THREE.ConeGeometry(1.35, 0.9, 10, 1, true);
    canopyGeo.rotateX(Math.PI);

    const trunk = new THREE.Mesh(trunkGeo, towerMat);
    trunk.position.y = 1.3;
    group.add(trunk);

    const canopy = new THREE.Mesh(canopyGeo, tealLineMat);
    canopy.position.y = 2.85;
    group.add(canopy);

    const canopyWire = new THREE.LineSegments(new THREE.EdgesGeometry(canopyGeo), edgeLineMat);
    canopyWire.position.y = 2.85;
    group.add(canopyWire);

    return group;
  };

  cityGroup.add(createSupertree(-2.2, 1.2, 0.85));
  cityGroup.add(createSupertree(-0.4, 2.0, 1.05));
  cityGroup.add(createSupertree(1.2, 1.5, 0.78));

  // 4. Marina Bay Water Grid Plane
  const gridHelper = new THREE.GridHelper(60, 48, 0xef3340, 0x162042);
  gridHelper.position.y = 0.01;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.25;
  scene.add(gridHelper);

  // 5. Floating Lanterns & Light Dust
  const lanternsGroup = new THREE.Group();
  scene.add(lanternsGroup);

  const lanternGeo = new THREE.SphereGeometry(0.09, 8, 8);
  const lanternMat = new THREE.MeshBasicMaterial({ color: 0xff6b6b });
  const lanterns = [];

  for (let i = 0; i < quality.heroLanterns; i++) {
    const mesh = new THREE.Mesh(lanternGeo, lanternMat);
    mesh.position.set(
      (Math.random() - 0.5) * 24,
      0.6 + Math.random() * 9,
      (Math.random() - 0.5) * 16
    );
    lanterns.push({
      mesh,
      speed: 0.25 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2
    });
    lanternsGroup.add(mesh);
  }

  // Star/Dust Particle Field
  const pCount = quality.heroParticles;
  const pPositions = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 38;
    pPositions[i * 3 + 1] = Math.random() * 16;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 26;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xfaf8f5,
    size: 0.065,
    transparent: true,
    opacity: 0.65
  });
  const particleSystem = new THREE.Points(pGeo, pMat);
  scene.add(particleSystem);

  // Pointer & Scroll Camera Parallax
  let targetCamX = 0;
  let targetCamY = 4.2;
  let scrollProgress = 0;

  window.addEventListener(
    'pointermove',
    (e) => {
      if (quality.reducedMotion) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetCamX = nx * 1.4;
      targetCamY = 4.2 - ny * 0.6;
    },
    { passive: true }
  );

  window.addEventListener(
    'scroll',
    () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height || window.innerHeight;
      scrollProgress = Math.min(1, Math.max(0, -rect.top / total));
    },
    { passive: true }
  );

  // Resize Handler
  const handleResize = () => {
    const w = section.clientWidth;
    const h = section.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  window.addEventListener('resize', handleResize);

  // Render Loop Controlled by Viewport Visibility
  let isActive = true;
  let rafId = null;
  const clock = new THREE.Clock();

  const animate = () => {
    if (!isActive) return;
    rafId = requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Smooth camera dolly with scroll + subtle pointer parallax
    camera.position.x += (targetCamX - camera.position.x) * 0.05;
    camera.position.y += (targetCamY + scrollProgress * 2.2 - camera.position.y) * 0.05;
    camera.position.z = 22 - scrollProgress * 6.5;
    camera.lookAt(0, 2.8, -2);

    if (!quality.reducedMotion) {
      cityGroup.rotation.y = Math.sin(elapsed * 0.14) * 0.08;
      particleSystem.rotation.y = elapsed * 0.02;

      lanterns.forEach((l) => {
        l.mesh.position.y += l.speed * 0.015;
        l.mesh.position.x += Math.sin(elapsed + l.phase) * 0.004;
        if (l.mesh.position.y > 11) {
          l.mesh.position.y = 0.4;
        }
      });
    }

    renderer.render(scene, camera);
  };

  createVisibilityController(section, (visible) => {
    isActive = visible;
    if (isActive) {
      clock.start();
      animate();
    } else if (rafId) {
      cancelAnimationFrame(rafId);
    }
  });

  return { renderer, scene, camera };
}