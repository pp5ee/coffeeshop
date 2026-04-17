# ☕ Pixel Coffee Shop

A complete browser-based coffee shop management game prototype built with HTML5 Canvas, CSS, and vanilla JavaScript. Features pixel-art visual style, customer queue management, multi-step drink preparation, and real-time gameplay.

## 🎮 Game Overview

Pixel Coffee Shop is a time-management game where you run a coffee shop. Customers enter, queue for service, place drink orders, and react based on your service speed and accuracy. Prepare drinks through a multi-step interface while managing multiple customers with patience timers.

### Game Features

- **Pixel-art aesthetic** with smooth animations
- **Customer queue system** with realistic movement and patience timers
- **Multi-step drink preparation** (cup → espresso → milk → serve)
- **Drink validation** with scoring and money system
- **Day timer** with end-of-day summary statistics
- **Responsive UI** with real-time feedback messages

## 🚀 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Local web server (required for ES6 module loading)

## 📥 Installation & Setup

### Option 1: Python Simple HTTP Server

```bash
# Navigate to project directory
cd pixel-coffee-shop

# Start local server (Python 3)
python -m http.server 8000

# Open browser to http://localhost:8000
```

### Option 2: Node.js Serve

```bash
# Install serve globally (if not already installed)
npm install -g serve

# Serve the project
serve -s . -p 8000

# Open browser to http://localhost:8000
```

### Option 3: Live Server (VS Code Extension)

1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` and select "Open with Live Server"
3. Browser will open automatically

## 🎯 How to Play

1. **Start the Day**: Click "Start Day" on the welcome screen
2. **Serve Customers**:
   - Customers enter from the door and queue at the counter
   - Each customer displays their drink order and patience timer
   - Prepare drinks using the three-step process:
     - Select cup size (Small/Medium/Large)
     - Add espresso shots (1 or 2)
     - Choose milk type (None/Steamed/Foam)
   - Click "Serve" when drink is complete
3. **Earn Money**:
   - Correct drinks earn base price + tip
   - Wrong drinks or timeouts result in unhappy customers
4. **End of Day**: Game ends when timer reaches zero
5. **Play Again**: Review statistics and start a new day

## 🏗️ Project Structure

```
pixel-coffee-shop/
├── index.html          # Main HTML file with game structure
├── css/
│   └── style.css       # Pixel-art styling and UI layout
├── js/
│   ├── main.js         # Game loop orchestration and initialization
│   ├── state.js        # Game state management and transitions
│   ├── customer.js     # Customer class and queue system
│   ├── queue.js        # Queue position management
│   ├── drink.js        # Drink preparation and validation
│   ├── ui.js           # UI interactions and feedback
│   ├── renderer.js     # Canvas rendering functions
│   └── constants.js    # Game configuration and constants
└── README.md           # This file
```

## 🔧 Technical Architecture

### Core Systems

- **Game Loop**: `requestAnimationFrame`-based loop with update/render phases
- **State Machine**: Start → Playing → End-of-Day transitions
- **Customer System**: Spawning, movement, queue management, patience timers
- **Drink System**: Multi-step preparation with validation logic
- **UI System**: HUD updates, feedback messages, button interactions
- **Renderer**: Canvas-based pixel-art rendering

### Module Dependencies

```
main.js (orchestrator)
├── state.js (game state)
├── customer.js (customers & queue)
├── drink.js (drink preparation)
├── ui.js (UI interactions)
├── renderer.js (canvas drawing)
└── constants.js (configuration)
```

## 🎨 Visual Design

### Pixel Art Aesthetic
- Canvas rendering with `imageSmoothingEnabled: false`
- CSS `image-rendering: pixelated` for crisp scaling
- Limited color palette with consistent pixel dimensions
- Geometric shapes and block-based character design

### Color Scheme
- Warm coffee shop tones (browns, creams, wood colors)
- High contrast for readability
- Color-coded patience bars (green → yellow → red)

## 🎮 Game Mechanics

### Customer Behavior
- **Spawning**: Random intervals based on day configuration
- **Movement**: Smooth walking animation to queue positions
- **Patience**: Timer decreases while waiting at counter
- **States**: Entering → Queued → At Counter → Served/Angry → Gone

### Drink Preparation
- **Step 1**: Cup Size (Small/Medium/Large)
- **Step 2**: Espresso Shots (1 or 2)
- **Step 3**: Milk Type (None/Steamed/Foam)
- **Serve**: Validate against customer order

### Scoring System
- **Base Price**: Varies by drink complexity
- **Perfect Tip**: Bonus for exact order match
- **No Payment**: Wrong drinks or timeouts

## 🔧 Configuration

Game balance and settings are centralized in `js/constants.js`:

- **Day Configurations**: Timer duration, max customers, spawn rates
- **Drink Recipes**: Name, ingredients, pricing
- **Visual Layout**: Canvas dimensions, scene coordinates
- **Game Balance**: Patience timers, walking speeds, scoring

## 🐛 Troubleshooting

### Common Issues

**"Failed to load module" error**
- Ensure you're using a local web server, not opening HTML file directly

**Canvas rendering issues**
- Check browser console for JavaScript errors
- Verify browser supports HTML5 Canvas

**Game not starting**
- Check that all JavaScript files are loading correctly
- Verify ES6 module support in browser

### Browser Compatibility

- ✅ Chrome 61+ (recommended)
- ✅ Firefox 60+
- ✅ Safari 11+
- ✅ Edge 79+

## 🚀 Development

### Adding New Features

1. **New Drink Recipes**: Add to `DRINK_RECIPES` in `constants.js`
2. **UI Elements**: Modify `index.html` and corresponding CSS/JS
3. **Game Mechanics**: Extend existing systems in modular files
4. **Visual Elements**: Add rendering functions in `renderer.js`

### Code Style
- ES6 modules with clear imports/exports
- Modular organization by system responsibility
- Immutable configuration in `constants.js`
- Consistent naming conventions

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 🎉 Credits

Built with vanilla JavaScript, HTML5 Canvas, and CSS. No external frameworks or libraries used.

---

**Enjoy running your Pixel Coffee Shop! ☕**