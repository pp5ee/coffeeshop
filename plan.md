# Pixel Coffee Shop - Implementation Plan

## Overview
A browser-based pixel art coffee shop game with multi-step drink preparation, customer queue management, and day-based progression.

## Tech Stack
- HTML5 Canvas for rendering
- Vanilla JavaScript (ES6+ modules)
- CSS for UI styling
- No external dependencies

## File Structure
```
/
├── index.html          # Main HTML file
├── style.css           # Styles and UI panels
├── main.js             # Entry point, game loop
├── state.js            # Game state management
├── canvas.js           # Canvas setup and utilities
├── customer.js         # Customer class and behavior
├── queue.js            # Customer queue management
├── drink.js            # Drink preparation system
├── ui.js               # UI rendering and DOM updates
├── renderer.js         # Canvas drawing functions
└── constants.js        # Game constants and config
```

## Core Systems

### 1. Game State (state.js)
- `gameState`: 'start', 'playing', 'end-of-day'
- `money`: player's earnings
- `day`: current day number
- `timer`: countdown timer for day duration
- `customers[]`: array of active customer objects
- `currentDrink`: the drink being prepared
- `stats`: orders completed, customers lost, accuracy

### 2. Canvas & Rendering (canvas.js, renderer.js)
- Canvas size: 800x600 pixels
- Pixel art style via CSS image-rendering: pixelated
- Render layers: background → furniture → queue area → customers → counter → UI overlays
- Simple sprite system using canvas draw calls (rectangles, circles) for pixel aesthetic

### 3. Customer System (customer.js)
Customer properties:
- `id`, `position` (x, y coordinates)
- `state`: 'entering', 'waiting', 'ordering', 'served', 'leaving', 'angry'
- `order`: required drink type
- `patience`: countdown timer (decreases over time)
- `happiness`: affects tip amount

Customer behavior:
- Enter from door, walk to queue position
- Progress through queue toward counter
- At counter: display order bubble, patience bar
- On correct serve: happy leave animation, money + tip
- On timeout: angry leave animation, reputation penalty

### 4. Queue System (queue.js)
- Fixed queue positions (x, y coordinates leading to counter)
- Customers advance when space ahead is free
- Counter position: one customer can be "at counter" to order
- Max queue size increases with day number (difficulty scaling)

### 5. Drink Preparation (drink.js)
Multi-step system:
1. Select cup size (Small, Medium, Large)
2. Add espresso shot(s)
3. Add milk type (None, Steamed, Foam)
4. Serve to current customer

Drink validation:
- Compare prepared drink against customer order
- Exact match = full payment + tip
- Wrong drink = angry customer (no payment)

### 6. UI System (ui.js)
Screen states:
- **Start Screen**: Title, instructions, "Start Day 1" button
- **Active Game**: Score/money display, timer, preparation buttons, customer orders
- **End-of-Day**: Summary stats, money earned, continue button

UI panels:
- Top bar: Money, Day, Timer
- Left side: Drink preparation controls
- Center: Canvas (game view)
- Bottom: Feedback messages

### 7. Game Loop (main.js)
```javascript
function gameLoop() {
  update();      // Update positions, timers, states
  render();      // Draw canvas
  updateUI();    // Update DOM elements
  requestAnimationFrame(gameLoop);
}
```

## Visual Design

### Color Palette (Pixel Art Style)
- Background walls: #8B7355 (warm brown)
- Floor: #5C4033 (dark wood)
- Counter: #4A4A4A (dark gray)
- Customer skin: #FFD4A3
- Customer clothes: random bright colors
- Coffee cups: #F5F5DC (beige)
- Coffee liquid: #3D2314 (dark brown)
- UI panels: #2C2C2C with #FFFFFF text

### Scene Layout (800x600)
```
+----------------------------------------+
|  [Money: $50]  [Day 1]  [Time: 2:34]   |  <- Top UI bar
+----------------------------------------+
|                                        |
|     Door                               |
|     [>]                                |
|          Queue        Counter          |
|     . . . . . .        [====]          |
|                        [====]          |
|                                        |
|  [Cup] [Espresso] [Milk] [Serve]       |  <- Drink controls
|                                        |
|  "Customer wants: Latte"               |  <- Order display
|                                        |
+----------------------------------------+
```

### Animations
- Customer walk: simple horizontal/vertical movement (2-3 pixels/frame)
- Patience bar: shrinks as patience decreases (green → yellow → red)
- Order bubble: bobs up/down gently
- Money popup: floats up and fades when earning
- Happy/Angry face: briefly appears above customer

## Game Balance

### Day Configuration
| Day | Duration | Max Queue | Customer Spawn Rate | Patience Base |
|-----|----------|-----------|---------------------|---------------|
| 1   | 60s      | 3         | Every 8s           | 20s           |
| 2   | 90s      | 4         | Every 6s           | 18s           |
| 3   | 120s     | 5         | Every 5s           | 15s           |

### Drink Types & Recipes
- **Espresso**: Small cup + 1 espresso + no milk
- **Americano**: Medium cup + 1 espresso + no milk
- **Latte**: Medium cup + 1 espresso + steamed milk
- **Cappuccino**: Medium cup + 1 espresso + foam
- **Double Espresso**: Small cup + 2 espresso + no milk

### Economics
- Base payment: $5 per drink
- Perfect serve bonus: +$2 tip
- Failed order penalty: -$1 reputation (visual only)

## Implementation Order
1. `constants.js` - Configuration values
2. `state.js` - Game state object
3. `canvas.js` - Canvas initialization
4. `customer.js` - Customer class with movement
5. `queue.js` - Queue position management
6. `drink.js` - Drink preparation logic
7. `renderer.js` - Drawing functions
8. `ui.js` - DOM UI updates
9. `main.js` - Game loop and initialization
10. `index.html` + `style.css` - Page structure

## How to Run
1. Save all files in the same directory
2. Open `index.html` in any modern browser
3. No server or build step required
4. Works offline
