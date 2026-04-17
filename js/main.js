// Import modules
import { gameState, showScreen, resetGame } from './state.js';
import { Customer, updateCustomers, getCustomerAtCounter } from './customer.js';
import { prepareDrink, validateDrink, resetDrink } from './drink.js';
import { updateUI, showFeedback } from './ui.js';
import { renderScene } from './renderer.js';

// Game initialization
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set pixelated rendering
ctx.imageSmoothingEnabled = false;

// Game loop
let lastTime = 0;
function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  // Update game state
  update(deltaTime);

  // Render
  renderScene(ctx, gameState);

  // Update UI
  updateUI(gameState);

  // Continue loop
  requestAnimationFrame(gameLoop);
}

// Update game logic
function update(deltaTime) {
  if (gameState.screen !== 'playing') return;

  // Update day timer
  gameState.dayTime -= deltaTime / 1000;
  if (gameState.dayTime <= 0) {
    gameState.dayTime = 0;
    endDay();
  }

  // Spawn customers
  if (Math.random() < 0.005 && gameState.customers.length < 3) {
    const customer = new Customer();
    gameState.customers.push(customer);
  }

  // Update customers with proper patience base
  updateCustomers(gameState.customers, deltaTime / 1000, 20);

  // Handle customer timeout
  const customerAtCounter = getCustomerAtCounter(gameState.customers);
  if (customerAtCounter && customerAtCounter.patience <= 0 && !customerAtCounter.failedRecorded) {
    customerAtCounter.failedRecorded = true;
    gameState.stats.failed++;
    showFeedback('Customer left angry!', 'error');
  }
}

function startGame() {
  resetGame();
  showScreen('playing');
}

function endDay() {
  showScreen('summary');
  // Update summary stats
  document.getElementById('served-count').textContent = gameState.stats.served;
  document.getElementById('money-earned').textContent = gameState.money.toFixed(2);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Start button
  document.getElementById('start-btn').addEventListener('click', startGame);

  // Play again button
  document.getElementById('play-again-btn').addEventListener('click', startGame);

  // Cup size buttons
  document.querySelectorAll('[data-cup]').forEach(button => {
    button.addEventListener('click', (e) => {
      prepareDrink('cup', e.target.dataset.cup);
    });
  });

  // Espresso buttons
  document.querySelectorAll('[data-shots]').forEach(button => {
    button.addEventListener('click', (e) => {
      prepareDrink('shots', parseInt(e.target.dataset.shots));
    });
  });

  // Milk buttons
  document.querySelectorAll('[data-milk]').forEach(button => {
    button.addEventListener('click', (e) => {
      prepareDrink('milk', e.target.dataset.milk);
    });
  });

  // Serve button
  document.getElementById('serve-btn').addEventListener('click', () => {
    const customerAtCounter = getCustomerAtCounter(gameState.customers);

    if (customerAtCounter && gameState.currentDrink) {
      const isValid = validateDrink(customerAtCounter.order, gameState.currentDrink);

      if (isValid) {
        gameState.money += 5; // Base price
        gameState.money += 2; // Tip
        gameState.stats.served++;
        customerAtCounter.state = 'served'; // Use proper state constant
        showFeedback('Correct! +$7', 'success');
      } else {
        showFeedback('Wrong drink!', 'error');
        customerAtCounter.state = 'angry'; // Use proper state constant
      }

      resetDrink();
    }
  });

  // Start game loop
  requestAnimationFrame(gameLoop);
});