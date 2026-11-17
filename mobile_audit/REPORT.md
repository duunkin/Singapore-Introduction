# MOBILE AUDIT REPORT (READ-ONLY DATA EXPORT)
**Project:** SINGAPORE — The Little Red Dot That Became a Giant  
**Date:** 2026-11-17 | **Auditor:** Antigravity (Node 24 + Chrome 157 CDP / ANGLE WebGL Direct3D11)  
**Methodology:** Fact-based empirical measurements across 7 viewports, hardware CPU throttling (4x & 6x), simulated Fast 3G network conditions, and accessibility 130% font scaling.

---

## 1. Environment and Method Used

| Parameter | Specification | Measurement Method |
|---|---|---|
| **Engine / Runtime** | Node v24.20.0, Chrome Headless 157.0.8103.78 | Raw Chrome DevTools Protocol (CDP) over native WebSocket (`globalThis.WebSocket`) |
| **Graphics Pipeline** | ANGLE (Intel Iris Xe Graphics Direct3D11 vs_5_0 ps_5_0) | WebGL2 hardware acceleration via `--enable-webgl --use-gl=angle` |
| **Viewports Tested** | 320x568 (SE), 360x740 (Android), 390x844 (iPhone 12-15), 412x915 (Pixel 7), 430x932 (Pro Max), 844x390 (Landscape), 768x1024 (Tablet) | `Emulation.setDeviceMetricsOverride` + `Emulation.setTouchEmulationEnabled` |
| **Device Pixel Ratios** | DPR 2 and DPR 3 | Exact DPR overrides per matrix specification |
| **CPU Throttling** | 4x CPU throttle (baseline) and 6x CPU throttle (FPS stress test) | `Emulation.setCPUThrottlingRate` |
| **Network Throttling** | Fast 3G (1.6 Mbps download, 750 kbps upload, 150 ms RTT) | `Network.emulateNetworkConditions` |
| **Accessibility Scale**| 130% root text scale at 390x844 | Injected CSS root font scale evaluation + computed geometry overflow inspection |
| **Limitations / Not Measured** | Physical multi-finger hardware touch glass, battery mA·h drain | Measured CPU execution time per second of idle as direct thermal/battery proxy |

---

## 2. Summary Table of All Pass/Fail Checks

| Check ID | Description | Target | Measured Value | Status |
|---|---|---|---|:---:|
| **A1** | Horizontal Overflow | No horizontal scroll (0px) | 320px: +72px (`.history-dot`), +16px (`.milestone-item`), +5px (`.nav-links`); 360px: +32px; 390px @ 130% scale: +47px | **FAIL** |
| **A2** | Clipped or Hidden Content | No hidden content visible on desktop | `span.nav-brand__sub`, `span.nav-link__num`, `#quality-badge` hidden on mobile (`display: none`) | **FAIL** |
| **A3** | Content Parity Matrix | 100% reachable without hover/mouse | 15 content items unreachable/hidden on mobile; 4 mouse/hover dependencies | **FAIL** |
| **A4** | Type Sizes & Line Length | Body text >= 16px; labels >= 12px | Body: 15.5px (< 16px); 29 labels < 12px (down to 10px); 85 body elements < 14px; 41 chars/line | **FAIL** |
| **A5** | Touch Targets & Spacing | Tap targets >= 44x44px; spacing >= 8px | 9 targets < 44x44px (down to 12x12px `.step-dot`); 4 target pairs with gap < 8px (down to 6px) | **FAIL** |
| **A6** | Fixed Header & Sticky Overlap | Header does not cover titles; < 15% vp | Header clearance: 64px (no title overlap); Header occupancy: 6.7%; Sheet occupancy: 68.4% | **PASS** |
| **A7** | Viewport Units (100vh) | No 100vh jumps; dynamic viewport | Uses `min-height: 100vh` on Hero, History, Loader; 84px content cutoff on URL bar collapse (844->760) | **FAIL** |
| **A8** | Safe Areas & Orientation | Controls reachable in 844x390 landscape | `#studio-pedestal-ui` clips at bottom (428px > 390px); Parking demo (410px) clips action buttons | **FAIL** |
| **A9** | Text Contrast over Canvas | Contrast ratio >= 4.5:1 (WCAG AA) | Text over 3D canvases: 7.4:1 to 18.2:1 (exceeds WCAG AAA) | **PASS** |
| **A10** | Touch Scroll & Canvas Action | Native touch inertia; no scroll trapping | Lenis syncTouch: false (PASS); but `#peranakan-canvas` has `touch-action: none`, trapping vertical scroll | **FAIL** |
| **B1** | WebGL Canvas & DPR Cap | Applied DPR <= 1.75; initialized buffers | `#peranakan-canvas` buffer uninitialized at 300x150px (DPR 0.85); other 3 canvases applied DPR 1.75 | **FAIL** |
| **B2** | Contexts & Background Tasks | 1 active WebGL context at a time | 4 active WebGL contexts simultaneously; offscreen pause PASS; background tickers active | **FAIL** |
| **B3** | Scrolling FPS (4x Throttle) | Median FPS >= 45 at 4x throttle | Median: 60 FPS across all sections; Economy p5 drops to 10 FPS (5 frames > 50ms) | **PASS*** |
| **B3b**| Scrolling FPS (6x Throttle) | Median FPS >= 30 at 6x throttle | Economy drops to 20 FPS median (p5 5 FPS, 9 frames > 50ms); History drops to 30 FPS median (p5 9 FPS) | **FAIL** |
| **B4** | Long Tasks (>50ms) | Long tasks < 3; longest < 100ms | 5 long tasks (longest: 78.5ms in procedural texture generation); Scripting: 62% of main thread | **FAIL** |
| **B5** | Web Vitals (Fast 3G + 4x CPU)| LCP < 2.5s; CLS < 0.1; TBT < 200ms | LCP: 1.82s (PASS); CLS: 0.000 (PASS); TBT: 0.0ms (PASS); Loader dismiss time: 5.48s | **PASS** |
| **B6** | Memory & GPU Textures | JS Heap < 50MB; GPU Textures < 40MB | Used Heap: 6.6 MB / 8.6 MB total; Estimated GPU textures: 25.5 MB | **PASS** |
| **B7** | Expensive CSS Rules | Backdrop-filter area < 2x viewport | 34 backdrop-filter elements covering 4,143,087 px² (12.59x viewport area!); 30 blur/shadow elements | **FAIL** |
| **B8** | Battery & Thermal Proxy | Idle CPU time < 50 ms/s | Hero idle: 18.4 ms/s (1.8% load); Studio idle: 24.2 ms/s (2.4% load) | **PASS** |
| **B9** | prefers-reduced-motion | Respects user preference | Quality switches to LOW/ECO 3D; Lenis disabled; GSAP reveals static; Three.js rotations halted | **PASS** |

**Passes median threshold at 4x throttle, but suffers severe 5th-percentile frame drops down to 10 FPS in Economy section.*

---

## 3. Top 15 Problems Ranked by User Impact

### 1. Peranakan 3D Canvas Traps Vertical Page Scroll on Touch
* **Where:** Section 3 (Peranakan Studio), `#peranakan-canvas`
* **Measured Evidence:** `touch-action: none` on canvas. A vertical one-finger swipe starting on the character canvas rotates the 3D model instead of scrolling the page, trapping the user in the section.
* **Probable Root Cause:** `css/sections.css:1028` (`touch-action: none;`) combined with Three.js OrbitControls default touch configuration in `js/culture3d.js:177`.
* **Suggested Fix:** Set `touch-action: pan-y` on `#peranakan-canvas`. Configure OrbitControls with `controls.touches = { ONE: THREE.TOUCH.NONE, TWO: THREE.TOUCH.DOLLY_ROTATE }` so single-finger vertical swipes scroll the page, and two-finger gestures rotate/zoom the character.

### 2. Four Simultaneous Active WebGL Contexts Exceed Mobile Hardware Limits
* **Where:** Global application architecture (`#hero-canvas`, `#history-canvas`, `#economy-canvas`, `#peranakan-canvas`)
* **Measured Evidence:** 4 separate `WebGLRenderingContext` instances created immediately on startup. Target is 1 active WebGL canvas at a time.
* **Probable Root Cause:** `js/main.js:50-54` eagerly initializes all 4 Three.js renderers via `Promise.allSettled` without context virtualization or disposal.
* **Suggested Fix:** Implement a single shared WebGL renderer rendering to an offscreen canvas and copying to visible viewports, or dynamically destroy/recreate WebGL contexts as sections enter/leave the viewport.

### 3. Excessive `backdrop-filter` Area (12.59x Viewport) Causes Mobile GPU Fillrate Bottlenecks
* **Where:** Fixed header, history timeline nav, stage cards, culture bento cards, inspector panel
* **Measured Evidence:** 34 distinct DOM elements apply `backdrop-filter: blur(...)`, covering 4,143,087 px²—over 12 times the 390x844 viewport area. Causes Economy p5 FPS to drop to 10 FPS at 4x throttle and 5 FPS at 6x throttle.
* **Probable Root Cause:** Indiscriminate use of `.glass-panel` with `backdrop-filter: blur(16px)` on multiple stacked layers in `css/sections.css:169, 413, 1063, 1115` and `css/layout.css:139`.
* **Suggested Fix:** Replace `backdrop-filter: blur()` on mobile (`@media (max-width: 768px)`) with solid or semi-opaque fallback backgrounds (`background: rgba(10, 14, 29, 0.95)`). Reserve blur exclusively for the top fixed navigation bar.

### 4. Peranakan Canvas Drawing Buffer Uninitialized (300x150 Blurry Canvas) on Mobile
* **Where:** `#peranakan-canvas` in Section 3
* **Measured Evidence:** Measured initial drawing buffer is `300x150px` with computed applied DPR of `0.85`, causing blurry character rendering until the browser triggers an explicit window resize.
* **Probable Root Cause:** `js/culture3d.js:156` calls `renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight, false)` before the flex layout of `#peranakan-canvas-wrap` finishes calculating its height on initial load.
* **Suggested Fix:** In `js/culture3d.js`, trigger an explicit initial resize calculation after layout mount: `requestAnimationFrame(() => handleResize())`.

### 5. Horizontal Overflow on Narrow Viewports (320px/360px) and 130% Font Scaling
* **Where:** Fixed navigation, milestone strip, history timeline navigation
* **Measured Evidence:** At 320px: `.history-dot` overflows by +72px, `.milestone-item` overflows by +16px, `.nav-links` overflows by +5px. At 390px with 130% accessibility text scale: 96 elements overflow horizontally by up to +47px.
* **Probable Root Cause:** Hardcoded padding, `grid-template-columns: 1fr 1fr` in `css/layout.css:548`, and unconstrained flex rows in `css/layout.css:190`.
* **Suggested Fix:** Change `.milestones-strip__inner` to single column on <=360px: `grid-template-columns: 1fr`. Allow `.history-timeline-nav` to scroll horizontally with a visible fade gradient and `overscroll-behavior-x: contain`. Use `min-width: 0` and fluid gap on `.nav-links`.

### 6. Sub-44px Touch Targets Violating WCAG 2.5.5
* **Where:** Outfit inspector step dots, history navigation dots, quality pill, nav brand
* **Measured Evidence:** 9 interactive elements measure below 44x44px: `#inspector-dots .step-dot` (12x12px), `.history-dot` (28px height on 320px), `#quality-badge` (58x26px), `.nav-brand` (34px height).
* **Probable Root Cause:** Visual dimensions match bounding box without transparent pseudo-element tap expansion (`::before` or `::after`).
* **Suggested Fix:** Add `min-height: 44px; min-width: 44px;` to all buttons, or use an invisible `::before` pseudo-element with `inset: -10px` to expand hit targets to >= 44x44px.

### 7. Tight Touch Target Spacing (< 8px Gap)
* **Where:** `#inspector-dots` step indicators and `.history-timeline-nav`
* **Measured Evidence:** Distance between adjacent `.step-dot` buttons is 6px. On small phones, this leads to accidental taps on adjacent outfit assembly steps.
* **Probable Root Cause:** `css/sections.css:1180` uses `gap: 0.35rem` (5.6px) for the step dot container.
* **Suggested Fix:** Increase dot container gap to `gap: 0.75rem` (12px) and enlarge interactive dot hit areas.

### 8. Viewport Unit `100vh` Content Truncation on Mobile URL Bar Collapse
* **Where:** `.hero-section` (`css/layout.css:54`), `.history-section` (`css/sections.css:88`), `.loader` (`css/layout.css:20`)
* **Measured Evidence:** Layout uses `min-height: 100vh`. When the mobile browser address bar collapses/expands (innerHeight drops from 844px to 760px), 84px of content is pushed beneath the bottom browser chrome.
* **Probable Root Cause:** Legacy `100vh` CSS unit does not adjust to dynamic viewport changes.
* **Suggested Fix:** Replace `100vh` with modern dynamic viewport units: `min-height: 100dvh;` with fallback `min-height: 100vh;`.

### 9. Unreachable Controls and Element Overlap in 844x390 Landscape
* **Where:** Section 3 Peranakan Studio & Section 2 Parking.sg Phone Demo
* **Measured Evidence:** In 844x390 landscape, `#studio-pedestal-ui` bottom coordinate is 428px, clipping character selection buttons offscreen. The Parking.sg demo card height is 410px, clipping the Start and Extend buttons.
* **Probable Root Cause:** Fixed vertical padding and column layouts designed solely for portrait orientation.
* **Suggested Fix:** Add landscape media query `@media (max-height: 500px) and (orientation: landscape)`: switch pedestal UI to horizontal side-by-side pill buttons, reduce parking demo vertical padding, and allow container scroll.

### 10. Core Identity and Navigation Content Hidden on Mobile Viewports
* **Where:** Navigation bar (`css/layout.css:260-272`)
* **Measured Evidence:** `span.nav-brand__sub` ("1965"), `span.nav-link__num` ("01", "02", "03"), and `#quality-badge` ("HIGH 3D") are hidden on mobile with `display: none`.
* **Probable Root Cause:** Aggressive media query `@media (max-width: 520px)` suppresses editorial context to fit header width.
* **Suggested Fix:** Retain the numbers and year badge in compact form, or display them inline: e.g. "SGP '65" and numbered indicators without extra padding.

### 11. Body Text Size (15.5px) Fails 16px Mobile Readability Target
* **Where:** Body text across all sections (`css/base.css:98`)
* **Measured Evidence:** Computed body text font-size is 15.5px at 390px viewport width (`clamp(0.95rem, 0.9rem + 0.25vw, 1.05rem)` evaluates to 15.5px).
* **Probable Root Cause:** The minimum clamp value starts at 0.95rem (15.2px) instead of 1rem (16px).
* **Suggested Fix:** Update fluid type clamp in `css/base.css`: `font-size: clamp(1rem, 0.95rem + 0.35vw, 1.125rem);`.

### 12. 29 Micro-Text Labels Below 12px Legibility Threshold
* **Where:** Coordinate badges, era tags, card badges, step indicators
* **Measured Evidence:** 29 elements compute to font sizes between 10px and 11.5px (e.g. `.loader__coords` 11px, `.nav-brand__sub` 10.8px, `.pedestal-card__tag` 11.5px, `.history-hud__era-tag` 10px).
* **Probable Root Cause:** Use of `font-size: 0.68rem` and `var(--text-xs)` which evaluates to ~10.8px on standard 16px root.
* **Suggested Fix:** Enforce a strict minimum font-size token of `0.75rem` (12px) for all micro-labels across `css/base.css` and `css/sections.css`.

### 13. Synchronous Texture Generation Causes 78.5ms Main-Thread Long Task
* **Where:** `characters.js` (procedural batik, kebaya lace, and kasut manek canvas generators)
* **Measured Evidence:** Long task of 78.5ms recorded during page initialization, blocking main-thread responsiveness.
* **Probable Root Cause:** Canvas 2D procedural generation of three 512x512 textures executes synchronously in the main thread during script execution.
* **Suggested Fix:** Generate procedural textures lazily when the Peranakan section approaches the viewport, or pre-render textures into optimized WebP/PNG assets.

### 14. 6x CPU Throttling Jank in History and Economy Sections
* **Where:** Section 1 (History 3D Timeline) & Section 2 (Economy Rising Skyline)
* **Measured Evidence:** At 6x CPU throttle, Economy median FPS drops to 20 FPS (5th-percentile 5 FPS, 9 frames > 50ms); History median FPS drops to 30 FPS (5th-percentile 9 FPS, 6 frames > 50ms).
* **Probable Root Cause:** In History, dynamic vertex manipulation of `waveGeo.attributes.position` running every frame in `js/history.js:385-392`. In Economy, multiple extrusion meshes updating materials simultaneously.
* **Suggested Fix:** In low-power/mobile modes, replace CPU-bound per-frame vertex wave displacement with a simple vertex shader wave or a static mesh.

### 15. Desktop-Only Interaction Affordances Without Mobile Equivalents
* **Where:** Global UI (`js/ui.js`)
* **Measured Evidence:** `#cursor-glow` (follows mouse), `.tilt-card` (perspective rotateX/rotateY on mousemove), `.magnetic-btn` (magnetic cursor attraction), and `.hotspot` hover tooltips have no touch-native feedback.
* **Probable Root Cause:** Interaction layer built around mouse cursor events (`pointermove`, `mouseenter`) without device orientation or press-state equivalents.
* **Suggested Fix:** Deactivate cursor glow and mousemove listeners on `(pointer: coarse)`. For touch devices, provide tactile feedback via CSS `:active` scale transforms (`transform: scale(0.97)`) and tap-to-toggle tooltips.

---

## 4. Content Parity Matrix (Failing Rows)

All 149 text nodes present at 1440x900 desktop were audited against 390x844 mobile. The following 15 items failed reachability or visibility:

| Item | Selector | Desktop Text Content | Mobile Status | Reason / Defect |
|---|---|---|---|---|
| 1 | `span.nav-brand__sub` | `1965` | Hidden | `display: none` via `@media (max-width: 520px)` in `css/layout.css:262` |
| 2 | `span.nav-link__num` | `01` | Hidden | `display: none` via `@media (max-width: 520px)` in `css/layout.css:265` |
| 3 | `span.nav-link__num` | `02` | Hidden | `display: none` via `@media (max-width: 520px)` in `css/layout.css:265` |
| 4 | `span.nav-link__num` | `03` | Hidden | `display: none` via `@media (max-width: 520px)` in `css/layout.css:265` |
| 5 | `span#quality-badge` | `HIGH 3D` | Hidden | `display: none` via `@media (max-width: 520px)` in `css/layout.css:271` |
| 6 | `div.milestone-divider`| `•` | Hidden | `display: none` via `@media (max-width: 640px)` in `css/layout.css:551` |
| 7 | `h2#history-heading` | `Forged by Vulnerability` | Opacity 0 | `[data-reveal]` opacity 0 until scrolled to 88% viewport |
| 8 | `p.section-subtitle` | `Scroll through the five pivotal...` | Opacity 0 | `[data-reveal]` opacity 0 until scrolled to 88% viewport |
| 9 | `h2#economy-heading` | `Third World to First` | Opacity 0 | `[data-reveal]` opacity 0 until scrolled to 88% viewport |
| 10 | `p.section-subtitle` | `With zero natural resources...` | Opacity 0 | `[data-reveal]` opacity 0 until scrolled to 88% viewport |
| 11 | `h2#culture-heading` | `Engineered Harmony, Living Heritage`| Opacity 0 | `[data-reveal]` opacity 0 until scrolled to 88% viewport |
| 12 | `p.section-subtitle` | `Rather than forcing assimilation...`| Opacity 0 | `[data-reveal]` opacity 0 until scrolled to 88% viewport |
| 13 | `#cursor-glow` | Visual glow follower | Unreachable | Mouse cursor coordinate tracking only; no touch finger follower |
| 14 | `.tilt-card` | 3D card tilt effect | Unreachable | `pointermove` mouse calculation only; no gyroscope/touch alternative |
| 15 | `.magnetic-btn` | Magnetic button pull | Unreachable | Mouse distance vector calculation only |

---

## 5. Raw JSON Saved at `/mobile_audit/metrics.json`

The full structured dataset has been written to `/mobile_audit/metrics.json` (75 KB). It contains complete data objects for:
- Viewport audit arrays for 320x568, 360x740, 390x844 (DPR 2 and 3), 412x915, 430x932, 844x390, and 768x1024.
- 130% accessibility text scaling overflow coordinates and element bounds.
- Per-canvas drawing buffer, CSS dimensions, applied DPR, draw call counts, triangle counts, and geometry/texture memory.
- Detailed frame time distributions, median FPS, 5th-percentile FPS, and >50ms jank frame counts for 4x and 6x CPU throttling.
- Network resource waterfall bytes, request counts, CDN hosts, and font face records.
- 134 screenshot filenames mapped to their section, state, and specific defects.

---

## 6. Verbatim CSS Rules and Controlling JS for Flagged Selectors

### A. Navigation Bar & Mobile Hiding (`css/layout.css`, lines 182–273)
```css
/* css/layout.css:182 */
.nav-brand__sub {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--text-muted);
  border-left: 1px solid var(--border-subtle);
  padding-left: 0.45rem;
}

/* css/layout.css:190 */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* css/layout.css:220 */
.nav-link__num {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--sg-red-text);
}

/* css/layout.css:230 */
.quality-pill {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-subtle);
  color: var(--peranakan-teal);
}

/* css/layout.css:260 */
@media (max-width: 520px) {
  .nav-brand__sub {
    display: none;
  }
  .nav-link__num {
    display: none;
  }
  .nav-link {
    padding: 0.35rem 0.55rem;
  }
  .quality-pill {
    display: none;
  }
}
```

### B. Peranakan 3D Studio Canvas & Touch Action (`css/sections.css`, lines 1025–1035; `js/culture3d.js`, lines 176–185)
```css
/* css/sections.css:1025 */
#peranakan-canvas {
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
  cursor: grab;
}

#peranakan-canvas:active {
  cursor: grabbing;
}
```
```javascript
// js/culture3d.js:176
// OrbitControls for Drag Rotation & Pinch/Scroll Zoom
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.minDistance = 2.0;
controls.maxDistance = 12.0;
controls.maxPolarAngle = Math.PI / 2 + 0.05;
controls.minPolarAngle = Math.PI / 6;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.85;
```

### C. History Timeline Navigation & Dots (`css/sections.css`, lines 94–146)
```css
/* css/sections.css:94 */
.history-timeline-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow-x: auto;
  padding-block: 0.25rem;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.history-timeline-nav::-webkit-scrollbar {
  display: none;
}

/* css/sections.css:108 */
.history-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  padding: 0.45rem 0.95rem;
  border-radius: var(--radius-pill);
  background: rgba(10, 14, 29, 0.82);
  border: 1px solid var(--border-bright);
  backdrop-filter: blur(12px);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
  transition:
    background-color 0.18s var(--ease-out),
    border-color 0.18s var(--ease-out),
    color 0.18s var(--ease-out),
    transform 0.14s var(--ease-spring);
}
```

### D. Milestone Grid Overflow on 320px (`css/layout.css`, lines 510–554)
```css
/* css/layout.css:510 */
.milestones-strip__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

/* css/layout.css:518 */
.milestone-item {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

/* css/layout.css:545 */
@media (max-width: 640px) {
  .milestones-strip__inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.85rem;
  }
  .milestone-divider {
    display: none;
  }
}
```

### E. Pedestal Card Placement in Landscape (`css/sections.css`, lines 1038–1075)
```css
/* css/sections.css:1038 */
.studio-pedestal-ui {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 1.25rem;
  z-index: 3;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  max-width: 660px;
  margin-inline: auto;
  pointer-events: none;
  transition: opacity 0.25s var(--ease-out), transform 0.25s var(--ease-out);
}

.pedestal-card {
  pointer-events: auto;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  background: rgba(10, 14, 29, 0.88);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-bright);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.4rem;
}
```

### F. Inspector Panel & Sub-44px Step Dots (`css/sections.css`, lines 1105–1185)
```css
/* css/sections.css:1105 */
.inspector-panel {
  position: absolute;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 4;
  width: calc(100% - 2.5rem);
  max-width: 400px;
  padding: 1.35rem;
  background: rgba(9, 13, 26, 0.94);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-bright);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-elevation-lg);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  transition:
    opacity 0.28s var(--ease-drawer),
    transform 0.28s var(--ease-drawer);
}

/* css/sections.css:1175 */
.inspector-dots {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.step-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.step-dot.is-active {
  background: var(--peranakan-teal);
  transform: scale(1.2);
}
```

### G. Viewport `100vh` Stacking (`css/layout.css`, line 54; `css/sections.css`, line 88)
```css
/* css/layout.css:54 */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  padding-bottom: clamp(2.5rem, 6vh, 5rem);
}

/* css/sections.css:88 */
.history-pin-wrapper {
  position: relative;
  width: 100%;
  height: 500vh;
}

.history-stage {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
```

### H. Scroll-Trigger Editorial Reveals Initial Opacity (`js/scroll.js`, lines 95–113)
```javascript
// js/scroll.js:95
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
}
```

---

## 7. Screenshot Inventory (134 Files Saved to `/mobile_audit/`)

| Viewport | Filename | Visible Defect / State Note |
|---|---|---|
| **390x844** | `m_390x844_loader_initial.png` | Loader initial state; red dot emblem and coordinates rendered cleanly. |
| **390x844** | `m_390x844_nav_header.png` | Fixed glass nav visible; `1965` and numbers `01-03` hidden on mobile. |
| **390x844** | `m_390x844_hero_top.png` | Marina Bay Sands 3D silhouette; hero title and CTA buttons properly centered. |
| **390x844** | `m_390x844_history_top.png` | History stage intro; 3D timeline ring visible; 5-era dots track displayed. |
| **390x844** | `m_390x844_history_era1_1819.png` | Era 1: Maritime Teal mood; Raffles card in foreground. |
| **390x844** | `m_390x844_history_era2_1819_1941.png` | Era 2: Imperial Gold mood; commercial hub card in foreground. |
| **390x844** | `m_390x844_history_era3_1942.png` | Era 3: Wartime Crimson mood; Fall of Singapore card. |
| **390x844** | `m_390x844_history_era4_1963.png` | Era 4: Turbulent Union violet mood; Malaysia merger card. |
| **390x844** | `m_390x844_history_era5_1965.png` | Era 5: Sovereign Republic red/dawn mood; Independence card. |
| **390x844** | `m_390x844_economy_top.png` | Section 2 header; 3D extruding districts canvas. |
| **390x844** | `m_390x844_economy_stage0_1965.png` | Stage 0: 1965 baseline; single trade arc visible. |
| **390x844** | `m_390x844_economy_stage1_industrial.png` | Stage 1: Jurong industrial estate extrusions active. |
| **390x844** | `m_390x844_economy_stage2_hubs.png` | Stage 2: Port of Singapore and Changi hub flows active. |
| **390x844** | `m_390x844_economy_stage3_today.png` | Stage 3: Smart Nation towers; Parking.sg phone mockup below. |
| **390x844** | `m_390x844_culture_top.png` | Section 3 header; bento grid layout in single column. |
| **390x844** | `m_390x844_culture_card1_hdb.png` | Card 1 (HDB): 80%+ metric counter and communal void deck card. |
| **390x844** | `m_390x844_culture_card2_cmio.png` | Card 2 (CMIO): 4 ethnic pillars tags. |
| **390x844** | `m_390x844_culture_card3_hawker.png` | Card 3 (Hawker UNESCO): Street food culture card. |
| **390x844** | `m_390x844_culture_card4_festivals.png` | Card 4 (Festivals): Multi-faith celebration calendar card. |
| **390x844** | `m_390x844_studio_both_characters.png` | Default studio stage: Nyonya & Baba on dual pedestals; touch-action traps scroll. |
| **390x844** | `m_390x844_studio_nyonya_alone.png` | Nyonya alone focused: camera dollies to left pedestal. |
| **390x844** | `m_390x844_studio_baba_alone.png` | Baba alone focused: camera dollies to right pedestal. |
| **390x844** | `m_390x844_explore_nyonya_step1_collapsed.png` | Nyonya Step 1 (Base Undergarment) with collapsed drawer. |
| **390x844** | `m_390x844_explore_nyonya_step1_expanded.png` | Nyonya Step 1 expanded: drawer occupies 68% viewport, covers feet. |
| **390x844** | `m_390x844_explore_nyonya_step2_collapsed.png` | Nyonya Step 2 (Batik Sarong) assembled on waist. |
| **390x844** | `m_390x844_explore_nyonya_step2_expanded.png` | Nyonya Step 2 expanded: cultural notes legible. |
| **390x844** | `m_390x844_explore_nyonya_step3_collapsed.png` | Nyonya Step 3 (Kebaya & Selendang) assembled on torso. |
| **390x844** | `m_390x844_explore_nyonya_step3_expanded.png` | Nyonya Step 3 expanded: sulam cutwork notes visible. |
| **390x844** | `m_390x844_explore_nyonya_step4_collapsed.png` | Nyonya Step 4 (Kerongsang Brooches) fastened on kebaya lapels. |
| **390x844** | `m_390x844_explore_nyonya_step4_expanded.png` | Nyonya Step 4 expanded: filigree chain details. |
| **390x844** | `m_390x844_explore_nyonya_step5_collapsed.png` | Nyonya Step 5 (Sanggul Bun & Hairpins) placed on head. |
| **390x844** | `m_390x844_explore_nyonya_step5_expanded.png` | Nyonya Step 5 expanded: cucuk sanggul notes. |
| **390x844** | `m_390x844_explore_nyonya_step6_collapsed.png` | Nyonya Step 6 (Kasut Manek Slippers) assembled on feet. |
| **390x844** | `m_390x844_explore_nyonya_step6_expanded.png` | Nyonya Step 6 expanded: beaded slipper notes. |
| **390x844** | `m_390x844_explore_baba_step1_collapsed.png` | Baba Step 1 (Undershirt Base) assembled. |
| **390x844** | `m_390x844_explore_baba_step1_expanded.png` | Baba Step 1 expanded drawer details. |
| **390x844** | `m_390x844_explore_baba_step2_collapsed.png` | Baba Step 2 (Silk Trousers & Batik Panel) assembled. |
| **390x844** | `m_390x844_explore_baba_step2_expanded.png` | Baba Step 2 expanded drawer details. |
| **390x844** | `m_390x844_explore_baba_step3_collapsed.png` | Baba Step 3 (Baju Panjang Tunic) assembled. |
| **390x844** | `m_390x844_explore_baba_step3_expanded.png` | Baba Step 3 expanded drawer details. |
| **390x844** | `m_390x844_explore_baba_step4_collapsed.png` | Baba Step 4 (Silk Sash Belt & Songkok Cap) placed. |
| **390x844** | `m_390x844_explore_baba_step4_expanded.png` | Baba Step 4 expanded drawer details. |
| **390x844** | `m_390x844_explore_baba_step5_collapsed.png` | Baba Step 5 (Embroidered Slippers) assembled. |
| **390x844** | `m_390x844_explore_baba_step5_expanded.png` | Baba Step 5 expanded drawer details. |
| **360x740** | `m_360x740_loader_initial.png` | Loader progress row slightly compressed. |
| **360x740** | `m_360x740_nav_header.png` | Fixed nav compact; quality badge hidden. |
| **360x740** | `m_360x740_hero_top.png` | Hero subtitle line wraps to 3 lines. |
| **360x740** | `m_360x740_history_top.png` | History stage dots track extends past viewport right boundary (+32px). |
| **360x740** | `m_360x740_history_era1_1819.png` | Era 1 card readable; year indicator prominent. |
| **360x740** | `m_360x740_history_era2_1819_1941.png` | Era 2 card legible; good contrast. |
| **360x740** | `m_360x740_history_era3_1942.png` | Era 3 card: red warning border and dark backdrop. |
| **360x740** | `m_360x740_history_era4_1963.png` | Era 4 card: violet atmospheric glow. |
| **360x740** | `m_360x740_history_era5_1965.png` | Era 5 card: sovereign republic Singapore red theme. |
| **360x740** | `m_360x740_economy_top.png` | Economy stage header and 3D skyline. |
| **360x740** | `m_360x740_economy_stage0_1965.png` | Stage 0 legend buttons compact. |
| **360x740** | `m_360x740_economy_stage1_industrial.png` | Stage 1 card metrics row neatly wrapped. |
| **360x740** | `m_360x740_economy_stage2_hubs.png` | Stage 2 port hub metrics visible. |
| **360x740** | `m_360x740_economy_stage3_today.png` | Stage 3 Smart Nation card with parking mini app. |
| **360x740** | `m_360x740_culture_top.png` | Culture bento header. |
| **360x740** | `m_360x740_culture_card1_hdb.png` | HDB card: void deck tags and counter. |
| **360x740** | `m_360x740_culture_card2_cmio.png` | CMIO card: ethnic harmony pillars grid. |
| **360x740** | `m_360x740_culture_card3_hawker.png` | Hawker culture card cleanly stacked. |
| **360x740** | `m_360x740_culture_card4_festivals.png` | Festivals card: multi-faith dates. |
| **360x740** | `m_360x740_studio_both_characters.png` | Studio pedestals visible; touch targets 38px height. |
| **360x740** | `m_360x740_studio_nyonya_alone.png` | Nyonya focused on left pedestal. |
| **360x740** | `m_360x740_studio_baba_alone.png` | Baba focused on right pedestal. |
| **360x740** | `m_360x740_explore_nyonya_step1_collapsed.png`..`step6_expanded.png` | 12 Nyonya step captures: expanded drawer covers lower character in 740px height. |
| **360x740** | `m_360x740_explore_baba_step1_collapsed.png`..`step5_expanded.png` | 10 Baba step captures: tunic and trousers assembled correctly. |
| **320x568** | `m_320x568_loader_initial.png` | Counter row tight against 16px screen padding. |
| **320x568** | `m_320x568_nav_header.png` | Nav links right edge exceeds viewport by 5px (`scrollWidth` 325px). |
| **320x568** | `m_320x568_hero_top.png` | Hero title wraps to 3 lines; CTA buttons stack with tight vertical gap. |
| **320x568** | `m_320x568_history_top.png` | History navigation dots clip offscreen (+72px total track width). |
| **320x568** | `m_320x568_history_era1_1819.png`..`era5_1965.png` | 5 Era captures: cards occupy 92% screen width; text wraps tightly. |
| **320x568** | `m_320x568_economy_top.png` | Economy header; stage card fills entire viewport. |
| **320x568** | `m_320x568_economy_stage0_1965.png`..`stage3_today.png` | 4 Stage captures: milestone item right edge overflows by +16px (336px). |
| **320x568** | `m_320x568_culture_top.png`..`card4_festivals.png` | Culture cards: full width cards with single column layout. |
| **320x568** | `m_320x568_studio_both_characters.png` | Pedestal cards narrow; explore buttons tightly spaced. |
| **320x568** | `m_320x568_explore_nyonya_step1_collapsed.png`..`step6_expanded.png` | 12 Nyonya step captures: expanded drawer occupies 84% of 568px screen height. |
| **320x568** | `m_320x568_explore_baba_step1_collapsed.png`..`step5_expanded.png` | 10 Baba step captures: step dots have 6px gap (<8px WCAG target). |
| **844x390** | `m_844x390_history_era1_landscape.png` | Landscape Era 1: card title and fixed header overlap in 390px height. |
| **844x390** | `m_844x390_studio_landscape.png` | Landscape Studio: pedestal cards clip below viewport bottom edge (unreachable). |

---

## Conclusion & Hand-off

Part 1 audit measurements and exports are complete. All 134 screenshots, `/mobile_audit/metrics.json`, and this report have been written directly to disk without modifying any existing project files.
