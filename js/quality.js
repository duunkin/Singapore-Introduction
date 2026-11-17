/**
 * QUALITY.JS — Adaptive Hardware Tier Detection & WebGL Preset System
 * Evaluates screen size, concurrency, device memory, and prefers-reduced-motion
 * to guarantee smooth 60fps performance on mobile phones and full fidelity on desktop.
 */

export function detectQualityProfile() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobileViewport = window.innerWidth < 768;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4; // GB (Chromium)
  const rawDpr = window.devicePixelRatio || 1;

  // Test basic WebGL support cleanly
  let webglSupported = false;
  let rendererInfo = '';
  try {
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (gl) {
      webglSupported = true;
      const debugExt = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugExt) {
        rendererInfo = gl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL) || '';
      }
    }
  } catch (err) {
    webglSupported = false;
  }

  const isLowEndGPU = /Mali-4|Mali-T|Adreno \(TM\) [345]|PowerVR|Intel.*HD Graphics [45]/i.test(rendererInfo);

  let tier = 'HIGH';
  if (prefersReducedMotion || isLowEndGPU || cores <= 2 || memory <= 2) {
    tier = 'LOW';
  } else if (isMobileViewport || isTouchDevice || cores <= 4 || memory <= 4) {
    tier = 'MEDIUM';
  }

  const presets = {
    HIGH: {
      tier: 'HIGH',
      label: 'HIGH 3D',
      dpr: Math.min(rawDpr, 2),
      antialias: true,
      shadows: true,
      shadowMapSize: 1024,
      heroParticles: 420,
      heroLanterns: 28,
      historyParticles: 240,
      geometrySegments: 28,
      reducedMotion: prefersReducedMotion,
      webglSupported
    },
    MEDIUM: {
      tier: 'MEDIUM',
      label: 'MOBILE 60FPS',
      dpr: Math.min(rawDpr, 1.5),
      antialias: true,
      shadows: false,
      shadowMapSize: 512,
      heroParticles: 180,
      heroLanterns: 14,
      historyParticles: 110,
      geometrySegments: 18,
      reducedMotion: prefersReducedMotion,
      webglSupported
    },
    LOW: {
      tier: 'LOW',
      label: 'ECO 3D',
      dpr: Math.min(rawDpr, 1.0),
      antialias: false,
      shadows: false,
      shadowMapSize: 256,
      heroParticles: 75,
      heroLanterns: 6,
      historyParticles: 45,
      geometrySegments: 12,
      reducedMotion: prefersReducedMotion,
      webglSupported
    }
  };

  const activeProfile = presets[tier];

  // Update Navigation Quality Pill
  const badgeEl = document.getElementById('quality-badge');
  if (badgeEl) {
    badgeEl.textContent = activeProfile.label;
  }

  return activeProfile;
}

/**
 * Helper to observe when a 3D section is in or near the viewport,
 * pausing its render loop when off-screen or when the browser tab is hidden.
 */
export function createVisibilityController(element, onChange) {
  let isIntersecting = false;
  let isTabVisible = !document.hidden;

  const notify = () => {
    onChange(isIntersecting && isTabVisible);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isIntersecting = entry.isIntersecting;
        notify();
      });
    },
    { rootMargin: '200px 0px 200px 0px', threshold: 0.01 }
  );

  if (element) {
    observer.observe(element);
  }

  const handleVisibilityChange = () => {
    isTabVisible = !document.hidden;
    notify();
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return {
    destroy() {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  };
}