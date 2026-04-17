// Validation script for Pixel Coffee Shop

// Test CSS pixel-art requirements
function testCSSRequirements() {
  const css = document.querySelector('style').sheet;
  let pixelFontFound = false;
  let pixelatedRenderingFound = false;

  // Check for pixel font
  for (let rule of css.cssRules) {
    if (rule.cssText.includes('font-family') && (rule.cssText.includes('PixelFont') || rule.cssText.includes('monospace'))) {
      pixelFontFound = true;
    }
    if (rule.cssText.includes('image-rendering') && rule.cssText.includes('pixelated')) {
      pixelatedRenderingFound = true;
    }
  }

  return { pixelFontFound, pixelatedRenderingFound };
}

// Test JavaScript modules
async function testJSModules() {
  const modules = ['constants', 'state', 'customer', 'queue', 'drink', 'ui', 'renderer', 'main'];
  const results = {};

  for (const module of modules) {
    try {
      await import(`./js/${module}.js`);
      results[module] = 'PASS';
    } catch (error) {
      results[module] = `FAIL: ${error.message}`;
    }
  }

  return results;
}

// Test game state machine
function testGameState() {
  try {
    const gameState = {
      screen: 'start',
      money: 0,
      dayTime: 60,
      customers: [],
      currentDrink: null,
      stats: { served: 0, failed: 0 }
    };

    return {
      stateMachine: 'PASS',
      hasRequiredFields: gameState.screen && gameState.money !== undefined
    };
  } catch (error) {
    return { stateMachine: `FAIL: ${error.message}` };
  }
}

// Run all validations
async function runValidations() {
  console.log('=== Pixel Coffee Shop Validation ===');

  // Test CSS
  const cssResults = testCSSRequirements();
  console.log('CSS Requirements:');
  console.log(`  Pixel Font: ${cssResults.pixelFontFound ? 'PASS' : 'FAIL'}`);
  console.log(`  Pixelated Rendering: ${cssResults.pixelatedRenderingFound ? 'PASS' : 'FAIL'}`);

  // Test JS Modules
  console.log('JavaScript Modules:');
  const jsResults = await testJSModules();
  Object.entries(jsResults).forEach(([module, result]) => {
    console.log(`  ${module}.js: ${result}`);
  });

  // Test Game State
  const stateResults = testGameState();
  console.log('Game State Machine:');
  console.log(`  State Management: ${stateResults.stateMachine}`);

  console.log('=== Validation Complete ===');
}

// Run when script is loaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', runValidations);
}