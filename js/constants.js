/**
 * constants.js — Immutable game configuration values.
 *
 * All magic numbers live here so that tweaking balance or layout
 * only requires touching this one file.
 */

// ── Canvas ─────────────────────────────────────────────────────────────────
export const CANVAS_WIDTH  = 800;
export const CANVAS_HEIGHT = 600;

// ── Colour Palette (mirrors CSS custom properties for canvas draws) ────────
export const COLORS = Object.freeze({
  BG:           '#1a0a00',
  FLOOR:        '#3d2b1f',
  WALL:         '#5c3d1e',
  COUNTER:      '#4a3728',
  COUNTER_TOP:  '#6b4c35',
  TEXT:         '#f0d9b5',
  TEXT_DIM:     '#8b7355',
  ACCENT:       '#f5a623',
  ACCENT2:      '#e04040',
  GREEN:        '#5aad5a',
  CUSTOMER_SKIN:'#ffd4a3',
  CUP:          '#f5f5dc',
  COFFEE:       '#3d2314',
  PATIENCE_HI:  '#5aad5a',
  PATIENCE_MID: '#f5a623',
  PATIENCE_LO:  '#e04040',
  ORDER_BUBBLE: '#2d1b00',
  DOOR:         '#8b5e3c',
});

// ── Pixel-art font stack (for canvas fillText) ─────────────────────────────
export const FONT_MONO = '"Courier New", Courier, monospace';

// ── Scene Layout ───────────────────────────────────────────────────────────
export const SCENE = Object.freeze({
  /** Pixel y-coordinate of the floor line (where customers stand). */
  FLOOR_Y:       460,
  /** Pixel y-coordinate of the top of the back wall. */
  WALL_TOP_Y:    180,
  /** x range for the door sprite. */
  DOOR_X:        60,
  DOOR_Y:        280,
  DOOR_W:        60,
  DOOR_H:        120,
  /** Counter position. */
  COUNTER_X:     530,
  COUNTER_Y:     340,
  COUNTER_W:     220,
  COUNTER_H:     120,
});

// ── Queue ──────────────────────────────────────────────────────────────────
/** X positions (left → right) where queued customers stand. */
export const QUEUE_SLOTS = Object.freeze([
  { x: 500, y: 430 },   // at-counter slot (index 0)
  { x: 400, y: 430 },
  { x: 300, y: 430 },
  { x: 200, y: 430 },
  { x: 130, y: 430 },
]);

/** Pixels per second customers walk. */
export const WALK_SPEED = 80;

// ── Timing ─────────────────────────────────────────────────────────────────
export const DAY_CONFIGS = Object.freeze([
  // index 0 = Day 1
  { duration: 60, maxQueue: 3, spawnInterval: 8,  patienceBase: 20 },
  { duration: 90, maxQueue: 4, spawnInterval: 6,  patienceBase: 18 },
  { duration: 120, maxQueue: 5, spawnInterval: 5, patienceBase: 15 },
]);

/** Default config if day number exceeds DAY_CONFIGS length. */
export const DEFAULT_DAY_CONFIG = Object.freeze(
  { duration: 120, maxQueue: 5, spawnInterval: 5, patienceBase: 15 },
);

// ── Customer States ─────────────────────────────────────────────────────────
export const CSTATE = Object.freeze({
  ENTERING:  'entering',
  QUEUED:    'queued',
  AT_COUNTER:'at_counter',
  SERVED:    'served',
  LEAVING:   'leaving',
  ANGRY:     'angry',
});

// ── Drink Recipes ──────────────────────────────────────────────────────────
/**
 * Each entry: { name, cupSize, shots, milk, price }
 * cupSize: 'small' | 'medium' | 'large'
 * shots:   1 | 2
 * milk:    'none' | 'steamed' | 'foam'
 */
export const DRINK_RECIPES = Object.freeze([
  { name: 'Espresso',        cupSize: 'small',  shots: 1, milk: 'none',    price: 3.00 },
  { name: 'Double Espresso', cupSize: 'small',  shots: 2, milk: 'none',    price: 4.00 },
  { name: 'Americano',       cupSize: 'medium', shots: 1, milk: 'none',    price: 4.00 },
  { name: 'Latte',           cupSize: 'medium', shots: 1, milk: 'steamed', price: 5.00 },
  { name: 'Cappuccino',      cupSize: 'medium', shots: 1, milk: 'foam',    price: 5.00 },
  { name: 'Large Latte',     cupSize: 'large',  shots: 2, milk: 'steamed', price: 6.00 },
]);

// ── Economics ──────────────────────────────────────────────────────────────
export const PERFECT_TIP     = 2.00;   // bonus for exact match
export const WRONG_DRINK_FEE = 0.00;   // no payment on wrong order

// ── UI / Feedback ──────────────────────────────────────────────────────────
/** How long (ms) a feedback message stays visible. */
export const FEEDBACK_DURATION_MS = 2000;

/** How long (ms) a floating money popup lives. */
export const MONEY_POPUP_DURATION_MS = 1200;

// ── Canvas Rendering ────────────────────────────────────────────────────────
/** Disable image smoothing on the canvas context (set after getContext). */
export const IMAGE_SMOOTHING = false;
