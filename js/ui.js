/**
 * ui.js — UI management and feedback system.
 *
 * Handles button interactions, HUD updates, and feedback messages.
 */

import { gameState, recordServed, recordFailed } from './state.js';
import { setCupSize, setShots, setMilk, resetDrink, tryServe } from './drink.js';
import { getCustomerAtCounter } from './customer.js';
import { SCREEN_PLAYING, SCREEN_SUMMARY } from './state.js';
import { CSTATE } from './constants.js';

// ── DOM Elements ───────────────────────────────────────────────────────────────
let hudMoney, hudTimer, hudServed;
let feedbackMsg;
let btnServe;
let cupButtons, espressoButtons, milkButtons;

// ── Feedback State ─────────────────────────────────────────────────────────────
let feedbackTimeout = null;

// ── Initialization ─────────────────────────────────────────────────────────────
export function initUI() {
  // HUD elements
  hudMoney = document.getElementById('hud-money');
  hudTimer = document.getElementById('hud-timer');
  hudServed = document.getElementById('hud-served');

  // Feedback
  feedbackMsg = document.getElementById('feedback-msg');

  // Drink panel buttons
  btnServe = document.getElementById('btn-serve');
  cupButtons = document.querySelectorAll('#btns-cup .btn-choice');
  espressoButtons = document.querySelectorAll('#btns-espresso .btn-choice');
  milkButtons = document.querySelectorAll('#btns-milk .btn-choice');

  // Wire up event listeners
  setupDrinkButtons();
}

function setGroupDisabled(buttons, disabled) {
  buttons.forEach(btn => {
    btn.disabled = disabled;
  });
}

function setupDrinkButtons() {
  // Enforce Cup → Espresso → Milk sequence:
  // Initially only Cup is enabled; subsequent groups unlock on prior selection.
  setGroupDisabled(espressoButtons, true);
  setGroupDisabled(milkButtons, true);

  // Cup size buttons
  cupButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.dataset.value;
      setCupSize(size);
      updateButtonSelection(cupButtons, size);
      // Unlock espresso once a cup is chosen
      setGroupDisabled(espressoButtons, false);
    });
  });

  // Espresso buttons
  espressoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const shots = parseInt(btn.dataset.value, 10);
      setShots(shots);
      updateButtonSelection(espressoButtons, btn.dataset.value);
      // Unlock milk once espresso shots are chosen
      setGroupDisabled(milkButtons, false);
    });
  });

  // Milk buttons
  milkButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const milk = btn.dataset.value;
      setMilk(milk);
      updateButtonSelection(milkButtons, milk);
    });
  });

  // Serve button
  btnServe.addEventListener('click', () => {
    onServeDrinkInternal();
    clearDrinkSelection();
  });
}

function updateButtonSelection(buttons, selectedValue) {
  buttons.forEach(btn => {
    if (btn.dataset.value === selectedValue) {
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('selected');
      btn.setAttribute('aria-pressed', 'false');
    }
  });
}

function clearDrinkSelection() {
  resetDrink();
  cupButtons.forEach(btn => {
    btn.classList.remove('selected');
    btn.setAttribute('aria-pressed', 'false');
  });
  espressoButtons.forEach(btn => {
    btn.classList.remove('selected');
    btn.setAttribute('aria-pressed', 'false');
  });
  milkButtons.forEach(btn => {
    btn.classList.remove('selected');
    btn.setAttribute('aria-pressed', 'false');
  });
  // Re-enforce step sequence: disable Espresso and Milk until Cup is chosen again
  setGroupDisabled(espressoButtons, true);
  setGroupDisabled(milkButtons, true);
}

// ── HUD Updates ────────────────────────────────────────────────────────────────

/**
 * Update the in-play HUD (money, timer, served counter).
 * Only runs while the playing screen is active.
 */
function updateHUD(state) {
  if (state.screen !== SCREEN_PLAYING) return;

  if (hudMoney) hudMoney.textContent = `$${state.money.toFixed(2)}`;
  if (hudTimer) hudTimer.textContent = `${Math.ceil(state.dayTime)}`;
  if (hudServed) hudServed.textContent = state.stats.served;
}

/**
 * Populate the end-of-day summary panel with final statistics.
 * Only runs while the summary screen is active.
 */
function updateSummary(state) {
  if (state.screen !== SCREEN_SUMMARY) return;

  const statServed = document.getElementById('stat-served');
  const statFailed = document.getElementById('stat-failed');
  const statMoney  = document.getElementById('stat-money');

  if (statServed) statServed.textContent = state.stats.served;
  if (statFailed) statFailed.textContent = state.stats.failed;
  if (statMoney)  statMoney.textContent  = `$${state.money.toFixed(2)}`;
}

/** Master UI update — delegates to the correct sub-updater for the active screen. */
export function updateUI(state) {
  updateHUD(state);
  updateSummary(state);
}

// ── Feedback System ────────────────────────────────────────────────────────────
export function showFeedback(message, type = 'info') {
  if (!feedbackMsg) return;

  feedbackMsg.textContent = message;
  feedbackMsg.className = type; // 'success', 'error', or ''
  feedbackMsg.style.opacity = '1';

  // Clear previous timeout if exists
  if (feedbackTimeout) {
    clearTimeout(feedbackTimeout);
  }

  // Auto-hide after 2 seconds
  feedbackTimeout = setTimeout(() => {
    feedbackMsg.style.opacity = '0';
  }, 2000);
}

// ── Utility ───────────────────────────────────────────────────────────────────
export function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}

// ── Internal Serve Handler ─────────────────────────────────────────────────────
function onServeDrinkInternal() {
  // Get customers from gameState
  const customers = gameState.customers;
  const customer = getCustomerAtCounter(customers);

  if (!customer) {
    showFeedback('No customer at counter!', 'error');
    return;
  }

  const result = tryServe(customer);
  if (result.success) {
    showFeedback(`Correct! +$${result.amount.toFixed(2)}`, 'success');
    customer.state = CSTATE.SERVED;
  } else {
    showFeedback('Wrong drink!', 'error');
    customer.state = CSTATE.ANGRY;
    recordFailed();
  }
}
