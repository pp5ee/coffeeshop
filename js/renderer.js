/**
 * renderer.js — Canvas rendering functions.
 *
 * Draws the coffee shop scene, customers, and UI overlays on the canvas.
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, SCENE, QUEUE_SLOTS, CSTATE, FONT_MONO } from './constants.js';

// ── Canvas Context ─────────────────────────────────────────────────────────────
let ctx = null;
let canvasWidth = CANVAS_WIDTH;
let canvasHeight = CANVAS_HEIGHT;

// ── Initialization ─────────────────────────────────────────────────────────────
export function initRenderer(context, width, height) {
  ctx = context;
  canvasWidth = width;
  canvasHeight = height;

  // Ensure pixelated rendering
  ctx.imageSmoothingEnabled = false;
}

// ── Main Render Function ───────────────────────────────────────────────────────
export function render(context, gameState) {
  if (!ctx) ctx = context;

  // Clear canvas
  ctx.fillStyle = COLORS.BG;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw scene
  drawBackground();
  drawDoor();
  drawCounter();
  drawQueueMarkers();

  // Draw customers
  if (gameState.customers) {
    gameState.customers.forEach(customer => drawCustomer(customer));
  }

  // Draw current drink preview
  if (gameState.currentDrink) {
    drawDrinkPreview(gameState.currentDrink);
  }
}

// ── Scene Drawing ───────────────────────────────────────────────────────────────
function drawBackground() {
  // Floor
  ctx.fillStyle = COLORS.FLOOR;
  ctx.fillRect(0, SCENE.FLOOR_Y - 40, canvasWidth, canvasHeight - SCENE.FLOOR_Y + 40);

  // Wall
  ctx.fillStyle = COLORS.WALL;
  ctx.fillRect(0, 0, canvasWidth, SCENE.WALL_TOP_Y);

  // Floor/Wall border
  ctx.fillStyle = COLORS.BORDER || '#5c3d1e';
  ctx.fillRect(0, SCENE.WALL_TOP_Y - 5, canvasWidth, 5);
}

function drawDoor() {
  const { DOOR_X, DOOR_Y, DOOR_W, DOOR_H } = SCENE;

  // Door frame
  ctx.fillStyle = COLORS.DOOR;
  ctx.fillRect(DOOR_X, DOOR_Y, DOOR_W, DOOR_H);

  // Door inner (darker)
  ctx.fillStyle = '#3d2314';
  ctx.fillRect(DOOR_X + 5, DOOR_Y + 5, DOOR_W - 10, DOOR_H - 10);

  // Door window
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(DOOR_X + 15, DOOR_Y + 15, DOOR_W - 30, DOOR_H - 50);

  // Door handle
  ctx.fillStyle = '#f5a623';
  ctx.fillRect(DOOR_X + DOOR_W - 12, DOOR_Y + DOOR_H / 2, 8, 4);
}

function drawCounter() {
  const { COUNTER_X, COUNTER_Y, COUNTER_W, COUNTER_H } = SCENE;

  // Counter base
  ctx.fillStyle = COLORS.COUNTER;
  ctx.fillRect(COUNTER_X, COUNTER_Y, COUNTER_W, COUNTER_H);

  // Counter top
  ctx.fillStyle = COLORS.COUNTER_TOP;
  ctx.fillRect(COUNTER_X - 10, COUNTER_Y, COUNTER_W + 20, 20);

  // Coffee machine (simple representation)
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(COUNTER_X + 20, COUNTER_Y - 40, 60, 40);
  ctx.fillStyle = '#34495e';
  ctx.fillRect(COUNTER_X + 25, COUNTER_Y - 35, 50, 25);

  // Espresso group heads
  ctx.fillStyle = '#95a5a6';
  ctx.fillRect(COUNTER_X + 30, COUNTER_Y - 10, 8, 10);
  ctx.fillRect(COUNTER_X + 45, COUNTER_Y - 10, 8, 10);
  ctx.fillRect(COUNTER_X + 60, COUNTER_Y - 10, 8, 10);
}

function drawQueueMarkers() {
  // Draw subtle markers for queue positions
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  QUEUE_SLOTS.forEach((slot, i) => {
    const width = i === 0 ? 60 : 50;
    ctx.fillRect(slot.x - width / 2, slot.y - 10, width, 20);
  });
}

// ── Customer Drawing ───────────────────────────────────────────────────────────
function drawCustomer(customer) {
  const { x, y, color, walkFrame, state, order, patience, maxPatience } = customer;

  if (state === CSTATE.GONE) return;

  // Body (rectangle)
  const bodyW = 30;
  const bodyH = 40;
  const bodyX = x - bodyW / 2;
  const bodyY = y - bodyH;

  // Walking bob animation and leg frame
  let bobOffset = 0;
  let legFrame = 0;

  if (state === CSTATE.ENTERING || state === CSTATE.QUEUED) {
    bobOffset = Math.sin(walkFrame) * 3;
    legFrame = Math.floor(walkFrame * 2) % 4; // 4-frame walking cycle
  }

  // Body
  ctx.fillStyle = color;
  ctx.fillRect(bodyX, bodyY + bobOffset, bodyW, bodyH);

  // Head
  const headSize = 20;
  ctx.fillStyle = COLORS.CUSTOMER_SKIN;
  ctx.fillRect(x - headSize / 2, bodyY - headSize + bobOffset + 5, headSize, headSize);

  // Eyes (pixel-art style)
  ctx.fillStyle = '#000';
  if (state === CSTATE.ANGRY) {
    // Angry eyes (slanted pixels)
    ctx.fillRect(x - 6, bodyY - headSize + bobOffset + 10, 3, 3);
    ctx.fillRect(x + 3, bodyY - headSize + bobOffset + 10, 3, 3);
  } else if (state === CSTATE.SERVED) {
    // Happy eyes (closed/smiling)
    ctx.fillRect(x - 6, bodyY - headSize + bobOffset + 10, 3, 1);
    ctx.fillRect(x + 3, bodyY - headSize + bobOffset + 10, 3, 1);
  } else {
    // Normal eyes (pixel dots)
    ctx.fillRect(x - 6, bodyY - headSize + bobOffset + 10, 2, 2);
    ctx.fillRect(x + 4, bodyY - headSize + bobOffset + 10, 2, 2);
  }

  // Walking legs animation (pixel-art style)
  if (state === CSTATE.ENTERING || state === CSTATE.QUEUED) {
    drawWalkingLegs(x, bodyY + bodyH + bobOffset, legFrame);
  }

  // Order bubble (only at counter)
  if (state === CSTATE.AT_COUNTER && order) {
    drawOrderBubble(x, bodyY - headSize - 30 + bobOffset, order, patience, maxPatience);
  }
}

function drawWalkingLegs(x, y, frame) {
  // Draw pixel-art walking legs based on frame
  ctx.fillStyle = '#000';

  switch (frame) {
    case 0: // Frame 1: legs together
      ctx.fillRect(x - 6, y - 10, 3, 10);
      ctx.fillRect(x + 3, y - 10, 3, 10);
      break;
    case 1: // Frame 2: left leg forward
      ctx.fillRect(x - 8, y - 12, 3, 12);
      ctx.fillRect(x + 1, y - 8, 3, 8);
      break;
    case 2: // Frame 3: legs together
      ctx.fillRect(x - 6, y - 10, 3, 10);
      ctx.fillRect(x + 3, y - 10, 3, 10);
      break;
    case 3: // Frame 4: right leg forward
      ctx.fillRect(x - 1, y - 12, 3, 12);
      ctx.fillRect(x - 6, y - 8, 3, 8);
      break;
  }
}

function drawOrderBubble(x, y, order, patience, maxPatience) {
  const bubbleW = 100;
  const bubbleH = 50;
  const bubbleX = x - bubbleW / 2;
  const bubbleY = y - bubbleH;

  // Bubble background
  ctx.fillStyle = COLORS.ORDER_BUBBLE;
  ctx.fillRect(bubbleX, bubbleY, bubbleW, bubbleH);

  // Bubble border
  ctx.strokeStyle = COLORS.ACCENT;
  ctx.lineWidth = 2;
  ctx.strokeRect(bubbleX, bubbleY, bubbleW, bubbleH);

  // Order text
  ctx.fillStyle = COLORS.TEXT;
  ctx.font = `12px ${FONT_MONO}`;
  ctx.textAlign = 'center';
  ctx.fillText(order.name, x, bubbleY + 20);

  // Patience bar background
  const barW = 80;
  const barH = 8;
  const barX = x - barW / 2;
  const barY = bubbleY + 30;

  ctx.fillStyle = '#333';
  ctx.fillRect(barX, barY, barW, barH);

  // Patience bar fill
  const patienceRatio = Math.max(0, patience / maxPatience);
  const fillW = barW * patienceRatio;

  if (patienceRatio > 0.5) {
    ctx.fillStyle = COLORS.PATIENCE_HI;
  } else if (patienceRatio > 0.25) {
    ctx.fillStyle = COLORS.PATIENCE_MID;
  } else {
    ctx.fillStyle = COLORS.PATIENCE_LO;
  }

  ctx.fillRect(barX, barY, fillW, barH);
}

// ── Drink Preview Drawing ──────────────────────────────────────────────────────
function drawDrinkPreview(drink) {
  if (!drink || !drink.cupSize) return;

  const previewX = SCENE.COUNTER_X + 120;
  const previewY = SCENE.COUNTER_Y + 20;

  // Cup size determines cup dimensions
  let cupW = 20;
  let cupH = 25;

  if (drink.cupSize === 'medium') {
    cupW = 25;
    cupH = 30;
  } else if (drink.cupSize === 'large') {
    cupW = 30;
    cupH = 35;
  }

  // Draw cup
  ctx.fillStyle = COLORS.CUP;
  ctx.fillRect(previewX - cupW / 2, previewY, cupW, cupH);

  // Draw coffee fill
  if (drink.shots > 0) {
    ctx.fillStyle = COLORS.COFFEE;
    const fillH = cupH * 0.6;
    ctx.fillRect(previewX - cupW / 2 + 2, previewY + cupH - fillH, cupW - 4, fillH - 2);
  }

  // Draw milk foam
  if (drink.milk === 'foam') {
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(previewX - cupW / 2 + 2, previewY + 5, cupW - 4, 8);
  } else if (drink.milk === 'steamed') {
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(previewX - cupW / 2 + 2, previewY + 8, cupW - 4, 6);
  }
}

// ── Utility ───────────────────────────────────────────────────────────────────
function getPatienceColor(ratio) {
  if (ratio > 0.5) return COLORS.PATIENCE_HI;
  if (ratio > 0.25) return COLORS.PATIENCE_MID;
  return COLORS.PATIENCE_LO;
}
