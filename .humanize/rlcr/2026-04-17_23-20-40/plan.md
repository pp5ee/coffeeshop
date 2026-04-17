# Pixel Coffee Shop Game Implementation Plan

## Goal Description

Create a complete browser-based coffee shop management game prototype called "Pixel Coffee Shop" using HTML5 Canvas, CSS, and vanilla JavaScript. The game features a pixel-art visual style where customers enter the shop, queue for service, place drink orders, and react based on the player's service speed and accuracy. The player prepares drinks through a multi-step interface (cup selection → espresso → milk → serve) while managing multiple simultaneous customers with patience timers.

## Acceptance Criteria

Following TDD philosophy, each criterion includes positive and negative tests for deterministic verification.

- AC-1: Game launches and displays start screen with "Start Day" button
  - Positive Tests (expected to PASS):
    - Opening index.html in Chrome/Firefox displays title, instructions, and clickable start button
    - Clicking start button transitions to active game state
  - Negative Tests (expected to FAIL):
    - Page loads with JavaScript errors in console
    - Start button is non-clickable or missing
    - Game auto-starts without user interaction

- AC-2: Game state machine manages Start → Playing → End-of-Day transitions
  - Positive Tests:
    - State transitions from 'start' to 'playing' on button click
    - State transitions to 'end-of-day' when timer reaches zero
    - End-of-day screen displays with replay option
  - Negative Tests:
    - State transitions occur without user trigger or timer completion
    - Multiple states are active simultaneously
    - Game crashes during state transition

- AC-3: Customers spawn, enter from door, and walk to queue positions
  - Positive Tests:
    - Customer appears at door position and moves toward first queue slot
    - Customer occupies queue slot when position is reached
    - Multiple customers can queue simultaneously (at least 3)
  - Negative Tests:
    - Customer spawns inside queue or at counter
    - Customer walks through walls or furniture
    - Two customers occupy the same queue slot

- AC-4: Queue system advances customers toward counter
  - Positive Tests:
    - Customer at front of queue advances to counter when space is free
    - Queue compresses (customers move up) when front customer leaves
    - Only one customer is "at counter" for ordering at a time
  - Negative Tests:
    - Customer jumps from back of queue directly to counter
    - Queue advances while customer is being served
    - Multiple customers simultaneously at counter

- AC-5: Customer displays order and patience timer
  - Positive Tests:
    - Customer at counter shows order bubble with drink name
    - Patience bar decreases over time (green → yellow → red)
    - Order and patience are visible and readable
  - Negative Tests:
    - Order displays before customer reaches counter
    - Patience increases instead of decreasing
    - Order text is truncated or unreadable

- AC-6: Multi-step drink preparation system works correctly
  - Positive Tests:
    - Player can select cup size (Small/Medium/Large)
    - Player can add espresso shots (1 or 2)
    - Player can add milk type (None/Steamed/Foam)
    - Serve button delivers drink to current customer
  - Negative Tests:
    - Drink steps can be selected in any order (violates sequence)
    - Serve button works when no customer at counter
    - Drink preparation persists after serving (should reset)

- AC-7: Drink validation and scoring system
  - Positive Tests:
    - Correct drink match increases money by base amount + tip
    - Wrong drink causes unhappy customer reaction (no payment)
    - Timeout causes angry customer to leave (no payment)
  - Negative Tests:
    - Wrong drink gives full payment
    - Timeout gives any payment
    - Money decreases on correct serve

- AC-8: UI displays game status and feedback
  - Positive Tests:
    - Money counter updates immediately on transaction
    - Day timer counts down visibly
    - Feedback messages appear for serve/timeout events
  - Negative Tests:
    - UI elements overlap or obscure game canvas
    - Text is illegible or uses non-pixel font
    - Counters show incorrect values

- AC-9: End-of-day summary displays statistics
  - Positive Tests:
    - Summary shows orders served count
    - Summary shows money earned
    - "Play Again" button resets game for new day
  - Negative Tests:
    - Summary shows statistics from previous day only
    - Play Again button does not reset game state
    - Summary displays before day actually ends

- AC-10: Visual style maintains pixel-art aesthetic
  - Positive Tests:
    - Canvas uses image-rendering: pixelated CSS
    - imageSmoothingEnabled is false on canvas context
    - Colors are limited palette (not gradients)
  - Negative Tests:
    - Canvas uses anti-aliasing or smooth scaling
    - UI uses system fonts instead of pixel font
    - Visual elements use photographic or vector art

- AC-11: Code organization follows modular structure
  - Positive Tests:
    - Separate files for state, customers, queue, drinks, UI, renderer
    - Clear interfaces between modules
    - No circular dependencies
  - Negative Tests:
    - All code in single file
    - Global variables pollute window scope
    - Functions longer than 50 lines without clear purpose

- AC-12: README documentation is complete
  - Positive Tests:
    - README includes project title and description
    - README includes prerequisites (browser requirements)
    - README includes how to run (open index.html)
    - README includes project structure overview
  - Negative Tests:
    - README is missing or empty
    - README contains incorrect run instructions
    - README lacks usage examples

## Path Boundaries

### Upper Bound (Maximum Acceptable Scope)
The implementation includes HTML5 Canvas rendering with pixel-perfect scaling, a complete game state machine (Start → Playing → End-of-Day), customer queue system with pathing and patience timers, multi-step drink preparation (cup → espresso → milk → serve), drink validation with money/scoring, day timer with configurable duration, end-of-day statistics summary, modular JavaScript architecture with separate system files, pixel-art visual style with CSS pixelated rendering, and a comprehensive README with setup instructions.

### Lower Bound (Minimum Acceptable Scope)
The implementation includes a single HTML file with embedded Canvas, basic game loop with start and play states, at least one customer that spawns and walks to counter, simple drink preparation (select and serve), basic money counter, and minimal pixel styling.

### Allowed Choices
- Can use: ES6 modules with import/export, vanilla JavaScript without frameworks, CSS for UI styling, Canvas API for rendering, requestAnimationFrame for game loop, simple geometric shapes for pixel art aesthetic, localStorage for optional persistence
- Cannot use: External game engines (Phaser, Three.js), build tools or bundlers (webpack, rollup), external image assets (must generate graphics via Canvas), audio libraries requiring heavy dependencies, frameworks (React, Vue, Angular)

> **Note on Deterministic Designs**: The draft specifies HTML5 Canvas and modular code structure. These choices are fixed per the draft specification.

## Feasibility Hints and Suggestions

> **Note**: This section is for reference and understanding only. These are conceptual suggestions, not prescriptive requirements.

### Conceptual Approach

The game follows a classic time-management pattern:

1. **Game Loop Structure**:
   ```
   requestAnimationFrame(loop)
   loop:
     update(dt)     // Update positions, timers, states
     render()       // Draw canvas
     updateUI()     // Update DOM elements
   ```

2. **Customer Lifecycle**:
   ```
   Spawn → Entering → Waiting → AtCounter → Ordering → Served/Timeout → Leaving → Remove
   ```

3. **Drink Preparation Pipeline**:
   ```
   Select Cup → Add Espresso → Add Milk → Serve
   ```

4. **Queue Management**:
   - Fixed queue positions: [(x1,y1), (x2,y2), (x3,y3)]
   - Customers move to next available position
   - Front position (closest to counter) triggers "at counter" state

5. **State Management**:
   ```javascript
   gameState = {
     screen: 'start' | 'playing' | 'summary',
     money: number,
     dayTime: number,
     customers: Customer[],
     currentDrink: Drink | null,
     stats: { served: number, failed: number }
   }
   ```

### Relevant References

- `index.html` - Main entry point with Canvas element and UI containers
- `style.css` - Pixel-art styling with `image-rendering: pixelated`
- `main.js` - Game loop initialization and orchestration
- `state.js` - Central game state object and state transitions
- `customer.js` - Customer class with position, patience, and order logic
- `queue.js` - Queue position management and customer advancement
- `drink.js` - Drink recipe definitions and preparation validation
- `ui.js` - DOM manipulation for buttons, counters, and messages
- `renderer.js` - Canvas drawing functions for scene and characters
- `constants.js` - Game configuration (colors, positions, timings)

## Dependencies and Sequence

### Milestones

1. **Milestone 1: Core Setup**: Basic HTML/CSS/JS structure with Canvas
   - Phase A: Create index.html with Canvas element
   - Phase B: Set up CSS for pixel-art rendering
   - Phase C: Initialize game loop with requestAnimationFrame

2. **Milestone 2: Game State**: State machine and transitions
   - Phase A: Implement state object (start, playing, summary)
   - Phase B: Create start screen with button
   - Phase C: Implement end-of-day summary screen

3. **Milestone 3: Customer System**: Customer spawning and movement
   - Phase A: Customer class with position and state
   - Phase B: Spawn timer and entrance animation
   - Phase C: Queue position management

4. **Milestone 4: Drink System**: Multi-step preparation
   - Phase A: Drink recipe definitions
   - Phase B: Step-by-step UI buttons
   - Phase C: Validation logic

5. **Milestone 5: Game Loop Integration**: Complete gameplay
   - Phase A: Patience timer countdown
   - Phase B: Money/scoring system
   - Phase C: Feedback messages

6. **Milestone 6: Polish**: Visuals and documentation
   - Phase A: Pixel-art styling
   - Phase B: Animations and effects
   - Phase C: README documentation

## Task Breakdown

| Task ID | Description | Target AC | Tag | Depends On |
|---------|-------------|-----------|-----|------------|
| task1 | Create HTML structure with Canvas and UI containers | AC-1 | coding | - |
| task2 | Implement CSS pixel-art styling | AC-10 | coding | task1 |
| task3 | Set up game loop with requestAnimationFrame | AC-1 | coding | task1 |
| task4 | Implement game state machine | AC-2 | coding | task3 |
| task5 | Create start screen UI | AC-1 | coding | task4 |
| task6 | Create end-of-day summary screen | AC-9 | coding | task4 |
| task7 | Implement Customer class | AC-3 | coding | task4 |
| task8 | Implement customer spawning system | AC-3 | coding | task7 |
| task9 | Implement queue position management | AC-4 | coding | task8 |
| task10 | Implement order display and patience timer | AC-5 | coding | task9 |
| task11 | Define drink recipes and validation | AC-6 | coding | task4 |
| task12 | Create drink preparation UI | AC-6 | coding | task11 |
| task13 | Implement serve and validation logic | AC-7 | coding | task12 |
| task14 | Implement money and scoring system | AC-7 | coding | task13 |
| task15 | Create game HUD (money, timer, counters) | AC-8 | coding | task4 |
| task16 | Implement feedback message system | AC-8 | coding | task15 |
| task17 | Create Canvas renderer for scene | AC-10 | coding | task2 |
| task18 | Implement customer animations | AC-3 | coding | task17 |
| task19 | Organize code into modular files | AC-11 | coding | task1-18 |
| task20 | Write comprehensive README | AC-12 | coding | task19 |

## Claude-Codex Deliberation

### Agreements
- ES6 modules with minimal local server is acceptable despite "no heavy dependencies"
- Canvas-only rendering with CSS pixelated scaling is the right approach for pixel art
- Multi-step drink preparation adds necessary depth without excessive complexity
- Modular code organization by systems (state, customers, queue, drinks, UI) is essential
- README with conventional commit prefix requirement is mandatory

### Resolved Disagreements
- **Module Loading Strategy**: Codex suggested ES modules require a server; Claude agreed and noted the draft's "no heavy dependencies" allows a minimal Python/http-server approach. Resolution: Use ES modules with clear instructions for `python -m http.server` or `npx serve`.
- **UI Implementation**: Codex suggested DOM/CSS for UI overlay; Claude prefers Canvas-only for consistency. Resolution: Use Canvas for game scene, DOM for buttons/menus (hybrid approach) as it simplifies interaction handling.
- **Customer Concurrency**: Codex raised concerns about simultaneous customers complexity. Resolution: Implement up to 3 concurrent customers for prototype, with queue slot management to prevent collision issues.

### Convergence Status
- Final Status: `partially_converged` (direct mode - no convergence rounds executed)

## Pending User Decisions

- DEC-1: Exact drink recipes and validation rules
  - Claude Position: Start with 5 recipes (Espresso, Americano, Latte, Cappuccino, Double Espresso)
  - Codex Position: Need explicit recipe list from user
  - Tradeoff Summary: Pre-defining allows immediate implementation; user-defined ensures requirements match expectations
  - Decision Status: PENDING

- DEC-2: Wrong drink behavior
  - Claude Position: Angry customer leaves, no payment, small reputation penalty
  - Codex Position: Clarify if money loss or just no payment
  - Tradeoff Summary: Penalty adds stakes but may frustrate; no penalty is forgiving but less engaging
  - Decision Status: PENDING

- DEC-3: Day duration and difficulty scaling
  - Claude Position: Day 1 = 60s, Day 2 = 90s, Day 3 = 120s with increasing spawn rate
  - Codex Position: Need explicit day length and customer spawn rate
  - Tradeoff Summary: Fixed values allow testing; configurable values allow tuning
  - Decision Status: PENDING

- DEC-4: Asset strategy for pixel art
  - Claude Position: Generate via Canvas API (rectangles, circles) for zero dependencies
  - Codex Position: Consider CC0 asset packs for better visuals
  - Tradeoff Summary: Procedural is dependency-free but limited; assets look better but require sourcing
  - Decision Status: PENDING

## Implementation Notes

### Code Style Requirements
- Implementation code and comments must NOT contain plan-specific terminology such as "AC-", "Milestone", "Step", "Phase", or similar workflow markers
- These terms are for plan documentation only, not for the resulting codebase
- Use descriptive, domain-appropriate naming in code instead

## Output File Convention

This template is used to produce the main output file (e.g., `plan.md`).

### Translated Language Variant

When `alternative_plan_language` resolves to a supported language name through merged config loading, a translated variant of the output file is also written after the main file. Humanize loads config from merged layers in this order: default config, optional user config, then optional project config; `alternative_plan_language` may be set at any of those layers. The variant filename is constructed by inserting `_<code>` (the ISO 639-1 code from the built-in mapping table) immediately before the file extension.

When `alternative_plan_language` is empty, absent, set to `"English"`, or set to an unsupported language, no translated variant is written.

---

## Original Design Draft Start

---

# Requirement

Create a complete browser game prototype called "Pixel Coffee Shop" using HTML, CSS, and JavaScript.

Requirements:
- Pixel-art inspired visual style
- Runs locally without heavy dependencies
- Modular code structure
- Charming coffee shop interior scene
- Customers visibly enter from the door, walk into a queue, move toward the counter, wait for service, then leave
- Each customer has a drink order and a patience value
- The player can prepare drinks through clickable buttons
- If the player serves the correct drink, money increases and the customer leaves happy
- If the player is too slow, the customer leaves unhappy
- Include score/money/order counters
- Include a start screen, active game state, and end-of-day summary
- Include clean UI panels and readable feedback messages
- Use simple animations or tile-based movement to make the scene feel alive
- Organize code by systems such as state, customers, queue, drinks, UI, and update loop
- Output complete runnable files and explain how to run them

HTML5 Canvas,Option B: Multi-step (select cup → add espresso → add milk → serve),A timer, more simultaneous customers

---

## Standard Deliverables (mandatory for every project)

- **README.md** — must be included at the project root with: project title & description, prerequisites, installation steps, usage examples with code snippets, configuration options, and project structure overview.
- **Git commits** — use conventional commit prefix `feat:` for all commits.

---

## Original Design Draft End
---
