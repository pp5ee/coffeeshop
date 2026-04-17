/**
 * customer.js — Customer class and queue management.
 *
 * Handles customer spawning, movement, state transitions, and patience.
 */

import { CSTATE, QUEUE_SLOTS, WALK_SPEED, DRINK_RECIPES, SCENE } from './constants.js';
import { assignQueueSlot } from './queue.js';

// ── Customer Class ─────────────────────────────────────────────────────────────
export class Customer {
  constructor() {
    // Start at door
    this.x = SCENE.DOOR_X + 20;
    this.y = SCENE.FLOOR_Y - 40;
    this.targetX = this.x;
    this.targetY = this.y;

    // State
    this.state = CSTATE.ENTERING;
    this.queueIndex = -1; // -1 = not in queue yet

    // Appearance
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.walkFrame = 0;

    // Order
    const recipe = DRINK_RECIPES[Math.floor(Math.random() * DRINK_RECIPES.length)];
    this.order = { ...recipe };

    // Patience (seconds)
    this.maxPatience = 20;
    this.patience = this.maxPatience;
    this.failedRecorded = false;
  }

  update(dt, patienceBase, customers) {
    // Update walk animation
    if (this.isMoving()) {
      this.walkFrame += dt * 8;
    }

    // State-specific updates
    switch (this.state) {
      case CSTATE.ENTERING:
        this.updateEntering(dt, customers);
        break;
      case CSTATE.QUEUED:
        this.updateQueued(dt, patienceBase);
        break;
      case CSTATE.AT_COUNTER:
        this.updateAtCounter(dt, patienceBase);
        break;
      case CSTATE.SERVED:
        this.updateLeaving(dt, 1);
        break;
      case CSTATE.ANGRY:
        this.updateLeaving(dt, -1);
        break;
    }
  }

  updateEntering(dt, customers) {
    // Move toward assigned queue slot
    if (this.queueIndex === -1) {
      // Assign to next available queue slot
      this.queueIndex = assignQueueSlot(this, customers);
    }

    if (this.queueIndex >= 0) {
      const targetSlot = this.getQueueSlot(this.queueIndex);
      this.moveToward(targetSlot.x, targetSlot.y, dt);

      if (this.hasReachedTarget()) {
        this.state = CSTATE.QUEUED;
      }
    }
  }

  updateQueued(dt, patienceBase) {
    // Move toward assigned queue slot
    const slot = this.getQueueSlot(this.queueIndex);
    this.moveToward(slot.x, slot.y, dt);

    if (this.hasReachedTarget()) {
      if (this.queueIndex === 0) {
        this.state = CSTATE.AT_COUNTER;
      }
    }
  }

  updateAtCounter(dt, patienceBase) {
    // Decrease patience
    this.patience -= dt;
    this.maxPatience = patienceBase;

    // Check for timeout
    if (this.patience <= 0) {
      this.state = CSTATE.ANGRY;
      // Failed will be recorded in main.js update loop
    }
  }

  updateLeaving(dt, direction) {
    // Walk off screen
    this.moveToward(this.x + direction * 200, this.y, dt);

    if (this.x < -50 || this.x > 900) {
      this.state = CSTATE.GONE;
    }
  }

  moveToward(tx, ty, dt) {
    this.targetX = tx;
    this.targetY = ty;

    const dx = tx - this.x;
    const dy = ty - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 1) {
      const moveDist = WALK_SPEED * dt;
      if (moveDist >= dist) {
        this.x = tx;
        this.y = ty;
      } else {
        this.x += (dx / dist) * moveDist;
        this.y += (dy / dist) * moveDist;
      }
    }
  }

  hasReachedTarget() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    return Math.sqrt(dx * dx + dy * dy) < 5;
  }

  isMoving() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    return Math.sqrt(dx * dx + dy * dy) > 1;
  }

  getQueueSlot(index) {
    if (index < QUEUE_SLOTS.length) {
      return QUEUE_SLOTS[index];
    }
    return QUEUE_SLOTS[QUEUE_SLOTS.length - 1];
  }

  getPatienceRatio() {
    return Math.max(0, this.patience / this.maxPatience);
  }
}

// ── Spawning ───────────────────────────────────────────────────────────────────
export function spawnCustomer() {
  return new Customer();
}

// ── Queue Management ───────────────────────────────────────────────────────────
export function updateCustomers(customers, dt, patienceBase) {
  // Sort by queue index (those at counter first)
  customers.sort((a, b) => a.queueIndex - b.queueIndex);

  // Update each customer
  customers.forEach(c => c.update(dt, patienceBase, customers));

  // Advance queue: if front customer is gone, move everyone up
  const frontCustomer = customers.find(c => c.queueIndex === 0);
  if (frontCustomer && (frontCustomer.state === CSTATE.SERVED || frontCustomer.state === CSTATE.ANGRY || frontCustomer.state === CSTATE.GONE)) {
    // Remove customers that are no longer active
    const activeCustomers = customers.filter(c =>
      c.state === CSTATE.AT_COUNTER ||
      c.state === CSTATE.QUEUED ||
      c.state === CSTATE.ENTERING
    );

    // Reassign queue indices
    activeCustomers.forEach((c, i) => {
      c.queueIndex = i;
      if (i === 0) {
        c.state = CSTATE.AT_COUNTER;
      } else {
        c.state = CSTATE.QUEUED;
      }
    });

    // Update the array in place
    customers.length = 0;
    activeCustomers.forEach(c => customers.push(c));
  }
}

// ── Helper Functions ───────────────────────────────────────────────────────────
export function getCustomerAtCounter(customers) {
  return customers.find(c => c.state === CSTATE.AT_COUNTER);
}

export function getQueueLength(customers) {
  return customers.filter(c =>
    c.state === CSTATE.AT_COUNTER ||
    c.state === CSTATE.QUEUED ||
    c.state === CSTATE.ENTERING
  ).length;
}
