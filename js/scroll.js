/**
 * SCROLL.JS — Smooth Inertia Scroll (Lenis) + GSAP ScrollTrigger Orchestration
 * Handles global progress bar, active nav anchors, and editorial reveals.
 */

export function initScrollSystem(quality) {
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (hasGSAP) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  let lenis = null;

  // Initialize Lenis smooth scroll unless reduced motion is requested
  if (typeof window.Lenis !== 'undefined' && !quality.reducedMotion) {
    lenis = new window.Lenis({
      duration: 1.12,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false, // Preserve native crisp touch inertia on mobile phones
      touchMultiplier: 1.5
    });

    if (hasGSAP) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  // Smooth anchor navigation clicks
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(targetEl, { offset: -20, duration: 1.2 });
      } else {
        targetEl.scrollIntoView({ behavior: quality.reducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // Scroll Progress Bar & Active Section Highlighting
  const progressBar = document.getElementById('scroll-progress-bar');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = ['history', 'economy', 'culture']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const updateScrollHUD = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

    if (progressBar) {
      progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;
    }

    // Highlight current chapter in nav
    const viewportCenter = scrollTop + window.innerHeight * 0.38;
    let activeId = '';
    for (const sec of sections) {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (viewportCenter >= top && viewportCenter < bottom) {
        activeId = sec.id;
        break;
      }
    }

    navLinks.forEach((link) => {
      const isMatch = link.getAttribute('data-section') === activeId;
      link.classList.toggle('is-active', isMatch);
    });
  };

  window.addEventListener('scroll', updateScrollHUD, { passive: true });
  updateScrollHUD();

  // Scroll-Driven Editorial Reveals & Animated Counters
  if (hasGSAP && !quality.reducedMotion) {
    const revealEls = document.querySelectorAll('[data-reveal]');
    revealEls.forEach((el) => {
      window.gsap.fromTo(
        el,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Numeric Counter (e.g., 80%+ HDB)
    const counterEls = document.querySelectorAll('[data-count-target]');
    counterEls.forEach((el) => {
      const targetVal = parseFloat(el.getAttribute('data-count-target')) || 80;
      const suffix = el.getAttribute('data-count-suffix') || '';
      const state = { val: 0 };

      window.gsap.to(state, {
        val: targetVal,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        },
        onUpdate: () => {
          el.textContent = `${Math.round(state.val)}${suffix}`;
        }
      });
    });
  }

  return { lenis };
}