/**
 * state.js — Central game state object and transition functions.
 *
 * Exports a single mutable `gameState` object and pure helper
 * functions that operate on it.  The game loop in main.js reads
 * from this object; UI modules write to it via the exported
 * transition helpers.
 */

// ── Screens ────────────────────────────────────────────────────────────────
const SCREEN_START   = 'start';
const SCREEN_PLAYING = 'playing';
const SCREEN_SUMMARY = 'summary';

export { SCREEN_START, SCREEN_PLAYING, SCREEN_SUMMARY };

// ── Default / Reset Values ─────────────────────────────────────────────────
const DAY_DURATION_SECONDS = 60;   // configurable constant

function createInitialState() {
  return {
    /** Which screen is currently shown. */
    screen: SCREEN_START,

    /** Player's money balance for the current day. */
    money: 0,

    /** Remaining day time in seconds (counts down during play). */
    dayTime: DAY_DURATION_SECONDS,

    /** Customer objects managed by the customer / queue systems. */
    customers: [],

    /** Drink currently being assembled by the player, or null. */
    currentDrink: null,

    /** Running tallies for the end-of-day summary. */
    stats: {
      served: 0,   // customers served correctly
      failed: 0,   // customers who left without being served
    },
  };
}

/**
 * The live game state shared across all modules.
 * Do NOT reassign this reference — mutate its properties instead.
 */
export const gameState = createInitialState();

// ── Transition Helpers ─────────────────────────────────────────────────────

/**
 * Transition from the start screen to active gameplay.
 * Resets all mutable state so each day starts fresh.
 */
export function transitionToPlaying() {
  if (gameState.screen !== SCREEN_START) return;

  const fresh = createInitialState();
  Object.assign(gameState, fresh);
  gameState.screen = SCREEN_PLAYING;
}

/**
 * Transition from active gameplay to the end-of-day summary.
 * Called when the day timer reaches zero.
 */
export function transitionToSummary() {
  if (gameState.screen !== SCREEN_PLAYING) return;
  gameState.screen = SCREEN_SUMMARY;
}

/**
 * Transition from the summary screen back to the start screen so
 * the player can begin a new day.
 */
export function transitionToStart() {
  if (gameState.screen !== SCREEN_SUMMARY) return;

  const fresh = createInitialState();
  Object.assign(gameState, fresh);
  // Keep on start screen (createInitialState already sets screen: SCREEN_START)
}

// ── Convenience Mutators ───────────────────────────────────────────────────

/** Add earnings and increment the served counter. */
export function recordServed(amount) {
  gameState.money  += amount;
  gameState.stats.served += 1;
}

/** Increment the failed/lost-customer counter. */
export function recordFailed() {
  gameState.stats.failed += 1;
}

/** Tick the day timer down by `dt` seconds. Returns remaining time. */
export function tickDayTimer(dt) {
  gameState.dayTime = Math.max(0, gameState.dayTime - dt);
  return gameState.dayTime;
}
