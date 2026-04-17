/**
 * main.js — Game loop and orchestration.
 *
 * Initializes the canvas, wires up event listeners, and runs the
 * requestAnimationFrame loop that drives updates and rendering.
 */

import { gameState, transitionToPlaying, transitionToSummary, transitionToStart, tickDayTimer, recordFailed } from './state.js';
import { SCREEN_START, SCREEN_PLAYING, SCREEN_SUMMARY } from './state.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, DAY_CONFIGS, CSTATE, FEEDBACK_DURATION_MS } from './constants.js';
import { Customer, spawnCustomer, updateCustomers } from './customer.js';
import { initDrinkSystem, resetDrink } from './drink.js';
import { initUI, updateUI, showFeedback } from './ui.js';
import { initRenderer, render } from './renderer.js';

// ── Canvas Setup ─────────────────────────────────────────────────────────────
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Disable image smoothing for pixel-art look
ctx.imageSmoothingEnabled = false;

// ── DOM Elements ─────────────────────────────────────────────────────────────
const screenStart = document.getElementById('screen-start');
const screenSummary = document.getElementById('screen-summary');
const gameWrapper = document.getElementById('game-wrapper');
const btnStartDay = document.getElementById('btn-start-day');
const btnPlayAgain = document.getElementById('btn-play-again');

// ── Game Loop Variables ──────────────────────────────────────────────────────
let lastTime = 0;
let spawnTimer = 0;
let dayConfig = DAY_CONFIGS[0];

// ── Initialization ────────────────────────────────────────────────────────────
function init() {
  initRenderer(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
  initUI();
  initDrinkSystem();

  // Wire up screen buttons
  btnStartDay.addEventListener('click', onStartDay);
  btnPlayAgain.addEventListener('click', onPlayAgain);

  // Initial screen state
  showScreen(SCREEN_START);

  // Start the loop
  requestAnimationFrame(loop);
}

// ── Screen Management ────────────────────────────────────────────────────────
function showScreen(screen) {
  screenStart.classList.remove('active');
  screenSummary.classList.remove('active');
  gameWrapper.classList.add('hidden');

  if (screen === SCREEN_START) {
    screenStart.classList.add('active');
  } else if (screen === SCREEN_PLAYING) {
    gameWrapper.classList.remove('hidden');
  } else if (screen === SCREEN_SUMMARY) {
    screenSummary.classList.add('active');
  }
}

// ── Event Handlers ────────────────────────────────────────────────────────────
function onStartDay() {
  transitionToPlaying();
  resetDrink();
  spawnTimer = 0;
  dayConfig = DAY_CONFIGS[0];
  showScreen(SCREEN_PLAYING);
}

function onPlayAgain() {
  transitionToStart();
  showScreen(SCREEN_START);
}

// ── Game Loop ─────────────────────────────────────────────────────────────────
function loop(timestamp) {
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  if (gameState.screen === SCREEN_PLAYING) {
    update(dt);
  }

  render(ctx, gameState);
  updateUI(gameState);

  requestAnimationFrame(loop);
}

// ── Update Logic ──────────────────────────────────────────────────────────────
function update(dt) {
  // Tick day timer
  const remaining = tickDayTimer(dt);

  // Check for end of day
  if (remaining <= 0) {
    transitionToSummary();
    showScreen(SCREEN_SUMMARY);
    return;
  }

  // Spawn customers
  spawnTimer -= dt;
  if (spawnTimer <= 0 && gameState.customers.length < dayConfig.maxQueue) {
    const customer = spawnCustomer();
    if (customer) {
      gameState.customers.push(customer);
      spawnTimer = dayConfig.spawnInterval + (Math.random() * 2 - 1);
    }
  }

  // Update customers
  updateCustomers(gameState.customers, dt, dayConfig.patienceBase);

  // Check for timeouts (angry customers)
  gameState.customers.forEach(c => {
    if (c.state === CSTATE.ANGRY && !c.failedRecorded) {
      c.failedRecorded = true;
      recordFailed();
      showFeedback('Customer left angry!', 'error');
    }
  });

  // Remove gone customers
  gameState.customers = gameState.customers.filter(c => c.state !== CSTATE.GONE);
}

// ── Serve Drink Handler ───────────────────────────────────────────────────────
// Note: Serve logic moved to ui.js to avoid circular dependencies

// ── Start ─────────────────────────────────────────────────────────────────────
init();
