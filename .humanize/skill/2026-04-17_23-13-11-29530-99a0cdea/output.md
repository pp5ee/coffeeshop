**CORE_RISKS**
- Scope creep vs. prototype timeline: pathing, pixel art, multi-step recipes, multiple customers, and UI polish together may exceed “prototype”.
- ES modules + local dev: importing modules via `file://` fails; needs a small local server despite “no heavy deps”.
- Concurrency complexity: simultaneous customers + multi-step crafting introduces overlapping timers, race conditions, and edge-case state bugs.
- Pathing/queue logic: collision and queue slot management can desync customers, causing stuck or overlapping sprites.
- UX friction: multi-step drink flow may feel tedious without affordances (clear feedback, cancel/undo, recipe hints).
- Balancing: spawn rate vs. station throughput, patience decay, and drink times can make the game trivially easy or impossible.
- Canvas scaling: maintaining crisp pixel art on different DPIs needs careful scaling and input mapping (hit detection).
- Performance spikes: many customers, animations, and text drawing can drop frames without batching or simple spritesheets.
- Input reliability: mapping click/touch to canvas coordinate system with scaling/letterboxing can misregister.
- Content creation: securing cohesive pixel art and sounds (style/attribution) is non-trivial for a prototype.

**MISSING_REQUIREMENTS**
- Target platforms/browsers and minimum resolution; desktop vs. mobile/touch.
- Exact drink recipes list and validation rules; what constitutes “correct”.
- Wrong-drink behavior: penalty, refund, or immediate unhappy exit?
- Day length, difficulty ramp (spawn rate, patience range), and win/lose conditions.
- Pause, restart, and tutorial/onboarding expectations.
- Audio/SFX and mute toggle.
- Accessibility: readable pixel font, color-safe UI, scaling options.
- Save/progress persistence across days or runs.
- Performance target (e.g., 60 fps on 1080p in Chrome).
- Asset plan: custom vs. CC0 packs; licensing constraints.
- Acceptance of minimal tooling (e.g., `http-server`) vs. strict “open `index.html`”.
- Testing approach: basic smoke tests or manual checklist.

**TECHNICAL_GAPS**
- Module loading strategy: ES modules require a local server; alternative is IIFE namespacing or a tiny build step.
- State architecture: need a clear finite state machine for Start → Playing → End-of-day, and substates for brewing/serving.
- Customer system: spawn scheduler, path along nav points, queue slot ownership, patience bars, and leaving flow.
- Crafting system: multi-step drink pipeline, intermediate states, timers (brew/steam), cancel/undo, and serve action.
- Timing model: fixed-step logic with `requestAnimationFrame`, dt clamping; avoid overlapping `setTimeout` logic.
- Rendering: pixel-perfect scaling (logical vs. physical canvas), `imageSmoothingEnabled = false`, `image-rendering: pixelated`, text layers.
- Input: centralized pointer manager translating screen→canvas coords; button hitboxes; debouncing.
- UI layering: Canvas HUD vs. DOM overlay; message log and panels; focus/keyboard handling.
- Data-driven config: recipes, customers, spawn curves as JSON or JS objects for easy tuning.
- Simultaneous customers capacity: define number of queue slots and whether multiple stations exist (throughput).
- End-of-day summary: data collection during play (served count, accuracy, tips, satisfaction).

**ALTERNATIVE_DIRECTIONS**
- Rendering approach
  - Canvas-only sprites + HUD text: maximum control, more code. Best for pixel-perfect style.
  - DOM/CSS for UI, Canvas for scene: simplifies buttons/menus, keeps pixel art crisp on canvas.
- Tooling
  - Plain ES modules + tiny static server (`python -m http.server` or `npx serve`): lightweight, modern structure.
  - Single-file IIFE modules: no server requirement; simpler, less modular.
- Movement
  - Grid/tile stepping along waypoints: simple, readable “tile-based” feel.
  - Tweened pixel movement with collision boxes: smoother but more logic.
- Libraries (optional)
  - Micro-engine like Kontra.js or tiny event emitter: speeds sprites/scenes without being “heavy”; confirm acceptability.
  - No libraries: leanest footprint, more custom code.
- Audio & assets
  - Use CC0 asset packs (e.g., Kenney) for speed.
  - Minimal placeholder art first; swap later.

**QUESTIONS_FOR_USER**
- Can we rely on a minimal local server (no heavy deps) to use ES modules, or do you require “open `index.html`” to work?
- Desktop-only first, or must support mobile/touch now?
- Preferred module style: ES modules with `import` or single bundled script without build tools?
- Are micro-dependencies like Kontra.js (~10–20KB) acceptable, or must this be vanilla JS?
- How many drink recipes, and what are the exact steps (e.g., cup → espresso → milk variants → toppings)? Provide a starter recipe list.
- What should happen on wrong drinks (money loss, redo, unhappy exit)?
- Maximum concurrent customers and queue length? One service station or multiple?
- Desired day length and difficulty curve (spawn rate, patience)?
- Include audio? If yes, SFX only or music too; need mute toggle?
- Asset strategy: use open assets now (CC0) or create original art later?
- Acceptance of a pixel font (e.g., Press Start 2P) and any branding constraints?
- Any nonfunctional targets (fps, load size, supported browsers)?

**CANDIDATE_CRITERIA**
- Runs locally with simple steps:
  - If ES modules: `npm run start` or `python -m http.server` serves `index.html` without CORS issues.
  - If single-file: opening `index.html` works in latest Chrome/Firefox.
- Game states:
  - Start screen with “Start Day”; transitions to active play; end-of-day summary with served/unserved, money, accuracy; replay button.
- Core loop:
  - Customers spawn, walk from door to queue, advance to counter, wait with visible patience bar, then leave via exit path.
- Crafting:
  - Multi-step pipeline (select cup → add espresso → add milk → serve) with clear UI, clickable buttons, step feedback, and cancel/clear.
- Outcomes:
  - Correct drink increases money and logs feedback; wrong/timeout causes unhappy leave with penalty or zero reward; counters update.
- UI/HUD:
  - Visible money, orders served, current order details; readable pixel font; message area for feedback.
- Visuals/animation:
  - Pixel-art style preserved with nearest-neighbor scaling; simple walking/idle animations or tile-step movement; 60 fps on target desktop.
- Concurrency:
  - At least 3 customers can queue simultaneously; patience decreases over time; service while next customers wait.
- Architecture:
  - Modular code separated by systems (state, customers, queue, drinks, UI, loop) with clear interfaces; no heavy dependencies.
- Quality:
  - Clean, commented code where needed; README includes prerequisites, run instructions, and configuration (day length, spawn rate, recipes).
- Edge cases:
  - Handles pausing or window blur by pausing timers; resilient to rapid clicks; prevents serving when no customer at counter.
