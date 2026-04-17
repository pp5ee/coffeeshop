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
| task1 | AC-1 | pending | coding | claude | Create HTML structure with Canvas and UI containers |
| task2 | AC-10 | pending | coding | claude | Implement CSS pixel-art styling |
| task3 | AC-1 | pending | coding | claude | Set up game loop with requestAnimationFrame |
| task4 | AC-2 | pending | coding | claude | Implement game state machine |
| task5 | AC-1 | pending | coding | claude | Create start screen UI |
| task6 | AC-9 | pending | coding | claude | Create end-of-day summary screen |
| task7 | AC-3 | pending | coding | claude | Implement Customer class |
| task8 | AC-3 | pending | coding | claude | Implement customer spawning system |
| task9 | AC-4 | pending | coding | claude | Implement queue position management |
| task10 | AC-5 | pending | coding | claude | Implement order display and patience timer |
| task11 | AC-6 | pending | coding | claude | Define drink recipes and validation |
| task12 | AC-6 | pending | coding | claude | Create drink preparation UI |
| task13 | AC-7 | pending | coding | claude | Implement serve and validation logic |
| task14 | AC-7 | pending | coding | claude | Implement money and scoring system |
| task15 | AC-8 | pending | coding | claude | Create game HUD (money, timer, counters) |
| task16 | AC-8 | pending | coding | claude | Implement feedback message system |
| task17 | AC-10 | pending | coding | claude | Create Canvas renderer for scene |
| task18 | AC-3 | pending | coding | claude | Implement customer animations |
| task19 | AC-11 | pending | coding | claude | Organize code into modular files |
| task20 | AC-12 | pending | coding | claude | Write comprehensive README |

### Completed and Verified
<!-- Only move tasks here after Codex verification -->
| AC | Task | Completed Round | Verified Round | Evidence |
|----|------|-----------------|----------------|----------|

### Explicitly Deferred
<!-- Items here require strong justification -->
| Task | Original AC | Deferred Since | Justification | When to Reconsider |
|------|-------------|----------------|---------------|-------------------|

### Open Issues
<!-- Issues discovered during implementation -->
| Issue | Discovered Round | Blocking AC | Resolution Path |
|-------|-----------------|-------------|-----------------|
