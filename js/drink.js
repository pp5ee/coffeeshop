/**
 * drink.js — Drink preparation system and validation.
 *
 * Manages the current drink being prepared and validates against orders.
 */

import { gameState, recordServed } from './state.js';
import { DRINK_RECIPES, PERFECT_TIP } from './constants.js';
import { getCustomerAtCounter } from './customer.js';

// ── Current Drink State ────────────────────────────────────────────────────────
let currentDrink = {
  cupSize: null,  // 'small' | 'medium' | 'large'
  shots: 0,       // 0 | 1 | 2
  milk: null,     // 'none' | 'steamed' | 'foam'
};

// ── Initialization ─────────────────────────────────────────────────────────────
export function initDrinkSystem() {
  resetDrink();
}

// ── Drink Preparation ──────────────────────────────────────────────────────────
export function resetDrink() {
  currentDrink = {
    cupSize: null,
    shots: 0,
    milk: null,
  };
  updateServeButton();
}

export function setCupSize(size) {
  currentDrink.cupSize = size;
  updateServeButton();
}

export function setShots(count) {
  currentDrink.shots = count;
  updateServeButton();
}

export function setMilk(type) {
  currentDrink.milk = type;
  updateServeButton();
}

export function getCurrentDrink() {
  return { ...currentDrink };
}

// ── Validation ─────────────────────────────────────────────────────────────────
export function tryServe(customer) {
  if (!customer) {
    return { success: false, amount: 0 };
  }

  const order = customer.order;
  const prepared = currentDrink;

  // Check if drink matches order
  const cupMatch = prepared.cupSize === order.cupSize;
  const shotsMatch = prepared.shots === order.shots;
  const milkMatch = prepared.milk === order.milk;

  if (cupMatch && shotsMatch && milkMatch) {
    // Correct drink - calculate earnings
    const tip = PERFECT_TIP;
    const total = order.price + tip;
    recordServed(total);
    resetDrink();
    return { success: true, amount: total };
  } else {
    // Wrong drink - no payment
    return { success: false, amount: 0 };
  }
}

// ── Recipe Lookup ──────────────────────────────────────────────────────────────
export function findRecipe(cupSize, shots, milk) {
  return DRINK_RECIPES.find(r =>
    r.cupSize === cupSize &&
    r.shots === shots &&
    r.milk === milk
  );
}

export function getDrinkName(cupSize, shots, milk) {
  const recipe = findRecipe(cupSize, shots, milk);
  return recipe ? recipe.name : 'Custom Drink';
}

// ── UI Helpers ─────────────────────────────────────────────────────────────────
function updateServeButton() {
  const btn = document.getElementById('btn-serve');
  if (!btn) return;

  const { cupSize, shots, milk } = currentDrink;
  const isComplete = cupSize !== null && shots > 0 && milk !== null;
  btn.disabled = !isComplete;
}

export function isDrinkComplete() {
  const { cupSize, shots, milk } = currentDrink;
  return cupSize !== null && shots > 0 && milk !== null;
}

// ── Drink Preview ──────────────────────────────────────────────────────────────
export function getDrinkPreview() {
  return {
    ...currentDrink,
    name: currentDrink.cupSize && currentDrink.shots > 0 && currentDrink.milk !== null
      ? getDrinkName(currentDrink.cupSize, currentDrink.shots, currentDrink.milk)
      : '...'
  };
}
