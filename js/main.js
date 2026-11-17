/**
 * MAIN.JS — Application Entry Point & Module Orchestrator
 * Coordinates the intro loader, adaptive quality detection, Lenis scroll,
 * Hero 3D skyline, and lazy-loads History, Economy, and Culture modules cleanly.
 */

import { detectQualityProfile } from './quality.js';
import { initScrollSystem } from './scroll.js';
import { initUIMicroInteractions } from './ui.js';
import { initHero3D } from './hero3d.js';

document.addEventListener('DOMContentLoaded', async () => {
  const loaderEl = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderPercent = document.getElementById('loader-percent');
  const loaderStatus = document.getElementById('loader-status');

  const setProgress = (pct, statusText) => {
    if (loaderBar) loaderBar.style.width = `${pct}%`;
    if (loaderPercent) loaderPercent.textContent = `${pct}%`;
    if (statusText && loaderStatus) loaderStatus.textContent = statusText;
  };

  // 1. Detect Hardware & Quality Profile
  setProgress(20, 'Calibrating Adaptive 3D Engine');
  const quality = detectQualityProfile();

  // 2. Initialize Smooth Scroll & Micro-Interactions
  setProgress(45, 'Configuring Scroll & Tactile UI');
  const scrollSystem = initScrollSystem(quality);
  initUIMicroInteractions(quality);

  // 3. Initialize Hero 3D Skyline
  setProgress(75, 'Building Marina Bay 3D Skyline');
  try {
    initHero3D(quality);
  } catch (err) {
    console.warn('[Hero3D] Initialization fallback:', err);
  }

  // 4. Dismiss Loader Immediately (Target <= 1.2s, hard cap 1.8s)
  // HTML/CSS and Hero 3D / first screen text are ready.
  let loaderDismissed = false;
  const dismissLoader = () => {
    if (loaderDismissed) return;
    loaderDismissed = true;
    setProgress(100, 'Welcome to Singapore');
    if (loaderEl) loaderEl.classList.add('is-complete');
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  };

  // Hard timeout failsafe ensures the loader never blocks the user
  const loaderTimer = setTimeout(dismissLoader, 1500);

  // Complete loader on next available frame
  requestAnimationFrame(() => {
    setTimeout(dismissLoader, 180);
  });

  // 5. Background Lazy Load Section Modules (Non-blocking for instant TTI)
  const loadOptionalModule = async (path, initFnName) => {
    try {
      const mod = await import(path);
      if (mod && typeof mod[initFnName] === 'function') {
        mod[initFnName](quality, scrollSystem);
      }
    } catch (err) {
      console.warn(`[Module] Deferred load ${path}:`, err);
    }
  };

  Promise.allSettled([
    loadOptionalModule('./history.js', 'initHistorySection'),
    loadOptionalModule('./economy.js', 'initEconomySection'),
    loadOptionalModule('./culture3d.js', 'initCultureSection')
  ]).then(() => {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  });
});