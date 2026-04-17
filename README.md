# Pixel Coffee Shop

A charming browser-based coffee shop management game built with HTML5 Canvas, CSS, and vanilla JavaScript. Experience the pixel-art aesthetic as you serve customers, prepare drinks, and manage your coffee shop!

## Features

- **Pixel-Art Visual Style**: Authentic pixel-art rendering with crisp, non-aliased graphics
- **Customer Management**: Customers enter, queue, order drinks, and react to your service
- **Multi-Step Drink Preparation**: Select cup size → add espresso shots → choose milk type → serve
- **Real-Time Gameplay**: Manage multiple customers simultaneously with patience timers
- **Scoring System**: Earn money for correct orders, lose customers for mistakes or delays
- **Complete Game Flow**: Start screen → active gameplay → end-of-day summary → replay

## Prerequisites

- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- JavaScript enabled
- Local web server (for ES6 module support)

## How to Run

### Option 1: Using Python (Recommended)
```bash
# Navigate to the project directory
cd pixel-coffee-shop

# Start local server
python3 -m http.server 8000

# Open browser to http://localhost:8000
```

### Option 2: Using Node.js (if you have it installed)
```bash
# Install serve globally (if not already installed)
npm install -g serve

# Start server
serve -s . -p 8000

# Open browser to http://localhost:8000
```

### Option 3: Direct File Access (Limited Functionality)
```bash
# Open index.html directly in browser
# Note: Some features may not work due to CORS restrictions with ES6 modules
open index.html
```

## Game Controls

### Drink Preparation Sequence
1. **Select Cup Size**: Small, Medium, or Large
2. **Add Espresso Shots**: 1 or 2 shots
3. **Choose Milk Type**: None, Steamed, or Foam
4. **Serve**: Deliver the completed drink

### Game Mechanics
- **Customers**: Appear at the door and walk to queue positions
- **Patience Timer**: Each customer has a decreasing patience bar (green → yellow → red)
- **Order Matching**: Serve the correct drink to earn money and tips
- **Time Management**: Serve customers before their patience runs out
- **Day Timer**: Each day lasts for a set duration (adjustable in settings)

## Project Structure

```
pixel-coffee-shop/
├── index.html              # Main HTML file
├── css/
│   └── game.css            # Pixel-art styling and layout
├── js/
│   ├── main.js             # Game loop and orchestration
│   ├── state.js            # Game state management
│   ├── customer.js         # Customer class and queue management
│   ├── queue.js            # Queue position system
│   ├── drink.js            # Drink recipes and validation
│   ├── ui.js               # UI interactions and feedback
│   ├── renderer.js         # Canvas rendering functions
│   └── constants.js        # Game configuration and constants
└── README.md               # This file
```

## Technical Implementation

### Architecture
- **Modular ES6**: Clean separation of concerns with import/export modules
- **Canvas Rendering**: Pixel-perfect graphics with `imageSmoothingEnabled = false`
- **State Machine**: Clear game state transitions (start → playing → summary)
- **Event-Driven**: Button interactions and game events handled through listeners

### Key Systems
- **Game Loop**: `requestAnimationFrame` for smooth 60fps updates
- **Customer System**: Spawning, movement, queue management, and state transitions
- **Drink System**: Recipe validation, step-by-step preparation, and scoring
- **UI System**: Real-time HUD updates, feedback messages, and screen transitions
- **Rendering System**: Pixel-art drawing with proper scaling and anti-aliasing disabled

## Customization

### Game Constants
Modify `js/constants.js` to adjust:
- Day duration and difficulty scaling
- Customer spawn rates and patience levels
- Drink prices and recipe definitions
- Visual colors and scene layout
- Queue positions and movement speeds

### Visual Style
Customize `css/game.css` for:
- Color schemes and pixel-art aesthetics
- Font choices and text rendering
- Layout dimensions and responsive design

## Browser Compatibility

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome  | 80+     | ✅ Full | Best performance |
| Firefox | 75+     | ✅ Full | Excellent support |
| Safari  | 13+     | ✅ Full | Good performance |
| Edge    | 80+     | ✅ Full | Chromium-based |
| IE      | Any     | ❌ None | No ES6 module support |

## Development

### Adding New Features
1. Follow the modular architecture pattern
2. Add new constants to `constants.js`
3. Implement functionality in dedicated module files
4. Update UI interactions in `ui.js`
5. Add rendering support in `renderer.js`
6. Test thoroughly across different browsers

### Code Style Guidelines
- Use descriptive, domain-appropriate naming
- Keep functions focused and under 50 lines
- Document complex logic with clear comments
- Follow existing patterns for consistency
- Test all state transitions and edge cases

## Troubleshooting

### Common Issues

**Game won't start**
- Ensure you're using a local web server, not opening the file directly
- Check browser console for JavaScript errors
- Verify all module files are present and accessible

**Graphics look blurry**
- Browser may be applying anti-aliasing
- Ensure `imageSmoothingEnabled = false` is set
- Check CSS `image-rendering: pixelated` is applied

**Customers not moving**
- Check game loop is running (FPS counter should show activity)
- Verify customer state transitions are working
- Check queue position assignments

### Debug Mode
Add `?debug=true` to the URL to enable:
- Console logging of game events
- Visual debug overlays
- Performance metrics display

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across browsers
5. Submit a pull request

## Acknowledgments

Built with vanilla JavaScript, HTML5 Canvas, and CSS. No external frameworks or libraries used to maintain the lightweight, dependency-free experience.

---

**Enjoy brewing!** ☕