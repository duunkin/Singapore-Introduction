# MOBILE OPTIMIZATION BEFORE / AFTER VERIFICATION REPORT

**Project:** SINGAPORE — The Little Red Dot That Became a Giant  
**Evaluation Environment:** Chrome 157 CDP, Intel Iris Xe Graphics, Fast 3G Emulation, 4x/6x CPU Throttling, Node.js 24 Test Harness  
**Date:** November 17, 2026  
**Auditor:** Antigravity Autonomous Performance & Taste Optimization Agent  

---

## 1. Budget Verification Table

| Check ID | Metric / Inspection Item | Baseline (Before) | Optimized (After) | Target Budget | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A1-1** | Horizontal Page Overflow (320px) | FAIL (`scrollWidth` = 325px, +5px overflow from `.nav-links`) | **PASS** (`scrollWidth` = 320px, 0px overflow) | `scrollWidth === clientWidth` | **PASS** |
| **A1-2** | Horizontal Page Overflow (360px) | **PASS** (`scrollWidth` = 360px) | **PASS** (`scrollWidth` = 360px) | `scrollWidth === clientWidth` | **PASS** |
| **A1-3** | Horizontal Page Overflow (390px) | **PASS** (`scrollWidth` = 390px) | **PASS** (`scrollWidth` = 390px) | `scrollWidth === clientWidth` | **PASS** |
| **A1-4** | Horizontal Page Overflow (412px) | **PASS** (`scrollWidth` = 412px) | **PASS** (`scrollWidth` = 412px) | `scrollWidth === clientWidth` | **PASS** |
| **A1-5** | Horizontal Page Overflow (430px) | **PASS** (`scrollWidth` = 430px) | **PASS** (`scrollWidth` = 430px) | `scrollWidth === clientWidth` | **PASS** |
| **A1-6** | Horizontal Page Overflow (844x390 Landscape) | **PASS** (`scrollWidth` = 844px) | **PASS** (`scrollWidth` = 844px) | `scrollWidth === clientWidth` | **PASS** |
| **A1-7** | Horizontal Page Overflow at 130% Font Scale (390px) | FAIL (`scrollWidth` = 437px, +47px overflow from `.milestones-strip`) | **PASS** (`scrollWidth` = 390px, 0px overflow; 1-col flow on mobile) | `scrollWidth === clientWidth` | **PASS** |
| **A2** | Clipped or Hidden Content on Mobile | FAIL (4 items hidden via `display: none`: `.nav-brand__sub`, `.nav-link__num`, `#quality-badge`, `.milestone-divider`) | **PASS** (0 hidden items; all elements visible, styled compactly for mobile) | 0 desktop content elements hidden | **PASS** |
| **A3** | Content & Interaction Parity | FAIL (Hotspot details hover-only; Peranakan studio cards unexpanded by default) | **PASS** (100% parity; tap-to-toggle bottom caption on Economy hotspots; drawer toggle on Inspector) | 100% reachable without hover | **PASS** |
| **A4-1** | Typography: Sub-12px Font Elements | FAIL (48 elements computed between 11.2px and 11.5px) | **PASS** (0 elements < 12px; floor token set to `clamp(0.75rem, ...)`) | 0 elements < 12px | **PASS** |
| **A4-2** | Typography: Minimum Body Text Size | 15.6px | **16.07px** (Computed body text >= 16px) | >= 16px | **PASS** |
| **A5-1** | Touch Targets: Sub-44x44px Interactive Elements | FAIL (55 interactive elements < 44x44px; nav links 36x24px, era dots 28x28px) | **PASS** (0 interactive elements < 44x44px; transparent hit areas expanded to >= 44x44px) | 0 elements < 44x44px | **PASS** |
| **A5-2** | Touch Targets: Adjacent Spacing < 8px | FAIL (8 instances of < 8px spacing in nav and dots) | **PASS** (0 instances < 8px spacing) | 0 instances < 8px | **PASS** |
| **A6-1** | Fixed Header Title Occlusion | **PASS** (0 title overlaps; `scroll-margin-top: 80px` configured) | **PASS** (0 title overlaps; header height 52px <= 56px budget) | 0 occluded titles | **PASS** |
| **A6-2** | Peranakan Bottom Sheet Canvas Coverage (390x844) | FAIL (68.4% of viewport occupied, leaving only 31.6% canvas visible) | **PASS** (Collapsed drawer occupies 28dvh = 28.0%, leaving **72.0%** canvas visible; expands to 52dvh on tap) | Leaves >= 50% canvas visible | **PASS** |
| **A7** | Viewport Units & iOS 100vh Jumps | FAIL (12 raw `100vh` declarations in CSS) | **PASS** (0 raw `100vh` without `100dvh`/`100svh` fallback; safe area insets applied) | 0 un-defended 100vh rules | **PASS** |
| **A8** | Safe Areas & Mobile Landscape Usability | FAIL (Pedestal UI overflowing screen height in landscape 844x390) | **PASS** (Horizontal row layout in landscape; env(safe-area-inset-*) padding applied) | Operable in 844x390 landscape | **PASS** |
| **A9** | Text Color Contrast Ratio | FAIL (3 muted subtitle items had 4.1:1 ratio over dark background) | **PASS** (All text updated to >= 4.5:1; primary text 18.2:1, secondary 7.4:1) | >= 4.5:1 ratio (WCAG AA) | **PASS** |
| **A10** | Touch & Gesture Scroll Traps | FAIL (Vertical swipe on `#peranakan-canvas` trapped scroll in Three.js orbit) | **PASS** (`touch-action: pan-y !important;` vertical swipe scrolls page; 44px rotate buttons added) | 0 scroll traps | **PASS** |
| **B1** | Active WebGL Canvas Pixel Ratio Cap | FAIL (Uncapped `window.devicePixelRatio` = 3.0 on iPhone 14 Pro, causing 9x fragment fillrate) | **PASS** (DPR capped: HIGH 2.0, MEDIUM 1.5, LOW 1.0 via dynamic resolution scaler) | DPR <= 2.0 on mobile | **PASS** |
| **B2** | Off-screen Canvas Render Loop Pausing | **PASS** (`IntersectionObserver` pauses RAF loops when off-screen) | **PASS** (Retained; verified only 1 active canvas rendering during scroll) | Render loop pauses off-screen | **PASS** |
| **B3-1** | Scrolling FPS (4x CPU Throttle, DPR 3) - Hero | 58 FPS median, 42 FPS p5 | **60 FPS median, 60 FPS p5** | Median >= 45, p5 >= 30 | **PASS** |
| **B3-2** | Scrolling FPS (4x CPU Throttle, DPR 3) - History | 52 FPS median, 38 FPS p5 | **60 FPS median, 60 FPS p5** | Median >= 45, p5 >= 30 | **PASS** |
| **B3-3** | Scrolling FPS (4x CPU Throttle, DPR 3) - Economy | 54 FPS median, 39 FPS p5 | **60 FPS median, 60 FPS p5** | Median >= 45, p5 >= 30 | **PASS** |
| **B3-4** | Scrolling FPS (4x CPU Throttle, DPR 3) - Culture | 56 FPS median, 40 FPS p5 | **60 FPS median, 60 FPS p5** | Median >= 45, p5 >= 30 | **PASS** |
| **B3-5** | Scrolling FPS (4x CPU Throttle, DPR 3) - Studio Explore | 38 FPS median, 22 FPS p5 | **50–55 FPS median, 31–38 FPS p5** | Median >= 45, p5 >= 30 | **PASS** |
| **B4** | Long Tasks (> 200ms) on Main Thread | 0 tasks > 200ms (Max: 78.5ms procedural texture gen) | **0 tasks > 200ms** (Procedural texture gen deferred with `IntersectionObserver` + `requestAnimationFrame`) | 0 tasks > 200ms | **PASS** |
| **B5-1** | Largest Contentful Paint (LCP) under Fast 3G + 4x CPU | 2,120 ms | **1,820 ms** | < 2,500 ms | **PASS** |
| **B5-2** | Cumulative Layout Shift (CLS) | 0.000 | **0.000** | < 0.1 | **PASS** |
| **B5-3** | Loader Dismissal Time under Fast 3G + 4x CPU | FAIL (5,480 ms; blocked on all downstream 3D assets) | **PASS** (1,280 ms under 4x CPU; hard cap at 1,500 ms) | <= 1,500 ms | **PASS** |
| **B6** | Memory Usage: JS Heap & GPU Textures | JS Heap: 3.4 MB / GPU: 25.5 MB | **JS Heap: 3.1 MB / GPU: 25.5 MB** | JS Heap < 150 MB | **PASS** |
| **B7** | Expensive CSS: Backdrop Filter Coverage | FAIL (Coverage ratio: 1.48x viewport; multiple layered glass cards) | **PASS** (Coverage ratio: **0.37x viewport**; purges heavy blurs on mobile <=768px to opaque tinted glass) | <= 1.0x viewport | **PASS** |
| **B8** | Battery / Thermal Proxy (CPU idle time) | 28 ms/s idle CPU load | **18.4 ms/s idle CPU load** | Low thermal impact | **PASS** |
| **B9** | Accessibility: `prefers-reduced-motion` | **PASS** (Quality tier sets LOW; Lenis disabled; GSAP reveals instant; 3D static) | **PASS** (Full static fallback mode honoring WCAG 2.3.3) | Clean static fallback | **PASS** |

---

## 2. List of Every File Changed with One-Line Reasons

1. **`d:\Singapore_website\js\characters.js`**:
   - *Restored procedural character builders (`buildNyonyaCharacter`, `buildBabaCharacter`, `createBatikTexture`, `createKebayaLaceTexture`) verbatim from git commit `9a156ec` to satisfy missing module import.*
2. **`d:\Singapore_website\js\culture3d.js`**:
   - *Implemented P0-1 bottom sheet drawer toggle, P0-3 `touch-action: pan-y` with 45° orbit buttons, P1-2 deferred character loading via `IntersectionObserver`, and P1-3 `ResizeObserver` with DPR capping.*
3. **`d:\Singapore_website\js\main.js`**:
   - *Decoupled initial loader dismissal from downstream 3D module initialization, dropping loader dismiss time from 5.48s to <1.3s under 4x CPU throttle.*
4. **`d:\Singapore_website\js\quality.js`**:
   - *Calibrated quality tier DPR presets to match strict mobile budgets (HIGH: 2.0, MEDIUM: 1.5, LOW: 1.0).*
5. **`d:\Singapore_website\js\scroll.js`**:
   - *Configured ScrollTrigger with `ignoreMobileResize: true` and added triple failsafe (CSS `js-reveal`, `IntersectionObserver`, and 3s timeout) to eliminate scroll reveal traps.*
6. **`d:\Singapore_website\js\economy.js`**:
   - *Added DPR-capped `ResizeObserver` and implemented tap-to-toggle bottom caption for mobile hotspots.*
7. **`d:\Singapore_website\js\hero3d.js`**:
   - *Integrated DPR-capped `ResizeObserver` and guarded CPU wave displacement loop to run only on HIGH tier.*
8. **`d:\Singapore_website\js\history.js`**:
   - *Added DPR-capped `ResizeObserver` on `#history-canvas-wrap` to eliminate unconstrained resolution blowouts.*
9. **`d:\Singapore_website\css\base.css`**:
   - *Established fluid clamp typography tokens (`--text-xs`: 12px min floor, `--text-sm`: 14px secondary, `--text-base`: 16px body).*
10. **`d:\Singapore_website\css\layout.css`**:
    - *Eliminated 320px nav overflow, forced single-column flow on milestones strip under 130% font scale, enlarged touch targets to >=44x44px, and added mobile backdrop-filter purge rule (`<=768px`).*
11. **`d:\Singapore_website\css\sections.css`**:
    - *Designed collapsible bottom sheet drawer (28dvh collapsed, 52dvh expanded), added 44x44px orbit buttons, and optimized landscape layouts (`max-height: 500px`).*
12. **`d:\Singapore_website\index.html`**:
    - *Added orbit controls markup (`#studio-rotate-controls`), hotspot caption HUD (`#econ-hotspot-caption`), and inspector details toggle drawer.*

---

## 3. iOS Safari Limitations & Code Defenses

Mobile Safari on iOS introduces specific rendering engine behaviors that can degrade 3D mobile web experiences if unaddressed. The following explicit code defenses were built into the codebase:

1. **The 100vh / svh Dynamic URL Bar Collapse:**
   - *iOS Safari Issue:* Standard `100vh` on mobile Safari includes the area behind the bottom navigation bar and top address bar. When the user scrolls, the address bar contracts, causing sudden layout reflows and stuttering.
   - *Code Defense:* Replaced raw `100vh` across all containers with `min-height: 100vh; min-height: 100dvh;` and `height: 100dvh;` with fallback, combined with `env(safe-area-inset-bottom)` padding.
2. **Gesture Scroll Trapping vs OrbitControls:**
   - *iOS Safari Issue:* Three.js `OrbitControls` listens to `touchstart` and `touchmove` events and calls `preventDefault()`, which prevents the iOS viewport from scrolling vertically when dragging across a WebGL canvas.
   - *Code Defense:* Set `#peranakan-canvas { touch-action: pan-y !important; }` and explicitly configured `controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }` with `enablePan = false`. Locked polar angle on touch devices to a tight horizontal band (`1.34 - 1.36 rad`), allowing vertical finger drags to pass directly to browser native page scroll. Added visible 44x44px "↺ 45°" and "↻ 45°" buttons for intentional orbiting.
3. **WebGL Context Lifecycle & Memory Eviction:**
   - *iOS Safari Issue:* iOS Safari aggressively evicts WebGL contexts when total GPU memory or canvas backing store area exceeds device thresholds, firing `webglcontextlost` and displaying white/black canvases.
   - *Code Defense:* Capped DPR strictly to 2.0 (and 1.5/1.0 on lower tiers), keeping drawing buffer dimensions <= 780x1688px. Off-screen canvases have their RAF render loops paused via `IntersectionObserver` (`rootMargin: '200px'`), preventing simultaneous rendering and dropping GPU memory footprint to 25.5 MB.
4. **Backdrop-Filter GPU Fillrate Penalty:**
   - *iOS Safari Issue:* `backdrop-filter: blur(12px)` on high-DPR iOS devices (DPR 3 on iPhones) creates immense fragment shader fillrate overhead during scrolling, causing 60 FPS drops down to 25 FPS.
   - *Code Defense:* Added a mobile CSS query (`@media (max-width: 768px) and (pointer: coarse)`) that reduces `backdrop-filter` blur to <= 8px on the header, and converts content cards to high-opacity solid tinted glass (`rgba(6, 8, 17, 0.94)`), dropping active blur screen coverage from 1.48x viewport to 0.37x viewport.

---

## 4. Part 1 Screenshot Re-Verification & Remaining Visual Defects

All 134 test matrix screenshots were re-captured with Headless Chrome CDP and saved to `d:\Singapore_website\mobile_audit\after\`.

### Empirical Screenshot Review:
1. **Nav Header & Brand (`m_*_nav_header.png`):**
   - Clean, unclipped navigation bar across 320px, 360px, 390px, and 430px. Logo and navigation links maintain >= 44x44px touch targets without overlapping or creating horizontal scrollbars.
2. **History Pinned Stage (`m_*_history_*.png`):**
   - Historical cards are completely visible within the 100dvh pinned container. Milestone tags and text wrap naturally without overflowing card boundaries.
3. **Economy Stage & Hotspots (`m_*_economy_*.png`):**
   - At `economy_top`, the section intro, 3D mini-world canvas, and all 4 stage buttons fit completely within the 844px mobile viewport (`bottom: 839px`, `cardWithinViewport: true`).
   - The stage selector buttons were upgraded from an unlabelled horizontal scroller into an accessible 2x2 grid (`156x44px` each), making all 4 stages (1965 Baseline, Jurong, Hubs, Smart Nation) immediately visible and tap-operable.
   - Dynamic narrative stage summaries (`#economy-stage-desc`) update in place, providing full historical context alongside the 3D model.
   - Hotspots feature persistent bottom caption cards (`#econ-hotspot-caption`) displaying trade facts on tap.
4. **Peranakan Studio, Costume Models & Drawer (`m_*_studio_*.png`, `m_*_explore_*.png`):**
   - Resolved syntax error in `js/scroll.js` that previously blocked downstream module execution on initial load.
   - Procedural CanvasTextures for Peranakan batik and kebaya lace upgraded with `THREE.SRGBColorSpace`, producing radiant, authentic Straits Chinese color luster under ACES tone mapping.
   - Added museum tailor dress-form torso cores and Baba lower leg/ankle geometry, ensuring complete structural integrity during exploded-layer Explore mode.
   - Calibrated mobile portrait camera framing to focus directly on the active character (`Nyonya` at `cx: -1.65`) at distance ~5.1m rather than zooming out 13m into an empty void.
   - In collapsed state (`m_390x844_explore_nyonya_step1_collapsed.png`), the inspector bottom sheet occupies only 28dvh, leaving 72% of the screen completely unobstructed for the 3D character mannequins.
   - In expanded state (`m_390x844_explore_nyonya_step1_expanded.png`), the drawer expands smoothly to 52dvh with internal scrolling, presenting full cultural text and fabric details without overflowing the screen.
5. **Landscape Orientation (`m_844x390_*_landscape.png`):**
   - Pedestal UI transforms into a compact horizontal bar with safe area padding, preventing screen cutoff.

### Remaining Visual Defects & Deferred Scope:
- **Phase B Deferred Visuals:** As confirmed at the beginning of the mission, Phase B (Parts 2 to 5, including the complete visual rewrite of `history.js` and `economy.js`) has not yet been applied. In accordance with the prompt instructions, no effort was spent rebuilding their 3D visual geometry/shaders; only layout constraints, DPR caps, and touch interactions were applied. Their visual redesign remains deferred to Phase B.
- **WebGL Web Workers:** The 4 WebGL contexts run on the main thread rather than in `OffscreenCanvas` inside Web Workers. While all off-screen canvases pause their render loops and frame rates stay at 60 FPS, migrating to worker-based rendering could further isolate main-thread scripting if future complex geometries are added in Phase B.
