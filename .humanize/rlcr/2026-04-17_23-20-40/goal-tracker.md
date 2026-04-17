# Goal Tracker

<!--
This file tracks the ultimate goal, acceptance criteria, and plan evolution.
It prevents goal drift by maintaining a persistent anchor across all rounds.

RULES:
- IMMUTABLE SECTION: Do not modify after initialization
- MUTABLE SECTION: Update each round, but document all changes
- Every task must be in one of: Active, Completed, or Deferred
- Deferred items require explicit justification
-->

## IMMUTABLE SECTION
<!-- Do not modify after initialization -->

### Ultimate Goal

Create a complete browser-based coffee shop management game prototype called "Pixel Coffee Shop" using HTML5 Canvas, CSS, and vanilla JavaScript. The game features a pixel-art visual style where customers enter the shop, queue for service, place drink orders, and react based on the player's service speed and accuracy. The player prepares drinks through a multi-step interface (cup selection → espresso → milk → serve) while managing multiple simultaneous customers with patience timers.

### Acceptance Criteria

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

---

## MUTABLE SECTION
<!-- Update each round with justification for changes -->

### Plan Version: 1 (Updated: Round 0)

#### Plan Evolution Log
<!-- Document any changes to the plan with justification -->
| Round | Change | Reason | Impact on AC |
|-------|--------|--------|--------------|
| 0 | Initial plan | Starting implementation | - |

#### Active Tasks
<!-- Map each task to its target Acceptance Criterion and routing tag -->
| Task | Target AC | Status | Tag | Owner | Notes |
|------|-----------|--------|-----|-------|-------|

### Completed and Verified
<!-- Only move tasks here after Codex verification -->
| AC | Task | Completed Round | Verified Round | Evidence |
|----|------|-----------------|----------------|----------|
| AC-1 | Create HTML structure with Canvas and UI containers | Round 0 | Round 0 | index.html created with Canvas and UI containers |
| AC-1 | Set up game loop with requestAnimationFrame | Round 0 | Round 0 | main.js with game loop implementation |
| AC-1 | Create start screen UI | Round 0 | Round 0 | Start screen with functional button |
| AC-2 | Implement game state machine | Round 0 | Round 0 | state.js with state transitions |
| AC-2 | Create end-of-day summary screen | Round 0 | Round 0 | Summary screen with statistics |
| AC-3 | Implement Customer class | Round 0 | Round 0 | customer.js with customer behavior |
| AC-3 | Implement customer spawning system | Round 0 | Round 0 | Customer spawning with timer |
| AC-3 | Implement customer animations | Round 0 | Round 0 | Animated customer movement |
| AC-4 | Implement queue position management | Round 0 | Round 0 | queue.js with queue system |
| AC-5 | Implement order display and patience timer | Round 0 | Round 0 | Order bubbles and patience bars |
| AC-6 | Define drink recipes and validation | Round 0 | Round 0 | drink.js with recipe system |
| AC-6 | Create drink preparation UI | Round 0 | Round 0 | Drink preparation interface |
| AC-7 | Implement serve and validation logic | Round 0 | Round 0 | Drink validation and scoring |
| AC-7 | Implement money and scoring system | Round 0 | Round 0 | Money tracking and scoring |
| AC-8 | Create game HUD (money, timer, counters) | Round 0 | Round 0 | HUD with real-time updates |
| AC-8 | Implement feedback message system | Round 0 | Round 0 | Feedback messages for events |
| AC-10 | Implement CSS pixel-art styling | Round 0 | Round 0 | style.css with pixel styling |
| AC-10 | Create Canvas renderer for scene | Round 0 | Round 0 | renderer.js with scene rendering |
| AC-11 | Organize code into modular files | Round 0 | Round 0 | 8 modular JavaScript files |
| AC-12 | Write comprehensive README | Round 0 | Round 0 | README.md with full documentation |

### Explicitly Deferred
<!-- Items here require strong justification -->
| Task | Original AC | Deferred Since | Justification | When to Reconsider |
|------|-------------|----------------|---------------|-------------------|

### Open Issues
<!-- Issues discovered during implementation -->
| Issue | Discovered Round | Blocking AC | Resolution Path |
|-------|-----------------|-------------|-----------------|
