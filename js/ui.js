/**
 * UI.JS — Tactile Micro-Interactions
 * Desktop cursor glow, mobile touch ripples, magnetic buttons, and 3D tilt cards.
 */

export function initUIMicroInteractions(quality) {
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  // 1. Desktop Ambient Cursor Glow
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && !isCoarsePointer && !quality.reducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let hasMoved = false;

    window.addEventListener(
      'pointermove',
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!hasMoved) {
          hasMoved = true;
          cursorGlow.style.opacity = '1';
        }
      },
      { passive: true }
    );

    const tickGlow = () => {
      currentX += (mouseX - currentX) * 0.14;
      currentY += (mouseY - currentY) * 0.14;
      cursorGlow.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;
      requestAnimationFrame(tickGlow);
    };
    requestAnimationFrame(tickGlow);
  }

  // 2. Mobile / Pointer Touch Ripples
  window.addEventListener(
    'pointerdown',
    (e) => {
      if (quality.reducedMotion) return;
      // Only spawn ripple on touch or primary click outside 3D orbit drags
      if (e.target.closest('canvas')) return;

      const ripple = document.createElement('span');
      ripple.className = 'touch-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 560);
    },
    { passive: true }
  );

  // 3. Magnetic Buttons (Desktop Pointer Only)
  if (!isCoarsePointer && !quality.reducedMotion) {
    const magneticButtons = document.querySelectorAll('[data-magnetic]');
    magneticButtons.forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = `translate3d(${(relX * 0.22).toFixed(1)}px, ${(relY * 0.28).toFixed(1)}px, 0)`;
      });

      btn.addEventListener('pointerleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  // 4. Subtle 3D Tilt Cards (Desktop Pointer Only)
  if (!isCoarsePointer && !quality.reducedMotion) {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        const rotX = (-normY * 6).toFixed(2);
        const rotY = (normX * 6).toFixed(2);
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      });
    });
  }
}