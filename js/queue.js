/**
 * queue.js — Queue position management.
 *
 * Handles queue slot assignments and customer advancement.
 */

import { QUEUE_SLOTS, CSTATE } from './constants.js';

// ── Queue Management ───────────────────────────────────────────────────────────

/**
 * Assign a customer to the next available queue slot.
 * Returns the assigned slot index or -1 if queue is full.
 */
export function assignQueueSlot(customer, customers) {
  const occupiedSlots = customers
    .filter(c => c !== customer && c.queueIndex >= 0)
    .map(c => c.queueIndex);

  for (let i = 0; i < QUEUE_SLOTS.length; i++) {
    if (!occupiedSlots.includes(i)) {
      return i;
    }
  }

  return -1; // Queue full
}

/**
 * Get the position for a queue slot.
 */
export function getQueuePosition(slotIndex) {
  if (slotIndex < 0 || slotIndex >= QUEUE_SLOTS.length) {
    return null;
  }
  return QUEUE_SLOTS[slotIndex];
}

/**
 * Check if a slot is occupied.
 */
export function isSlotOccupied(slotIndex, customers, excludeCustomer = null) {
  return customers.some(c =>
    c !== excludeCustomer &&
    c.queueIndex === slotIndex &&
    (c.state === CSTATE.QUEUED || c.state === CSTATE.AT_COUNTER)
  );
}

/**
 * Advance customers in the queue when the front customer leaves.
 */
export function advanceQueue(customers) {
  // Filter to only active queued customers
  const activeCustomers = customers.filter(c =>
    c.state === CSTATE.AT_COUNTER ||
    c.state === CSTATE.QUEUED ||
    c.state === CSTATE.ENTERING
  );

  // Sort by current queue index
  activeCustomers.sort((a, b) => a.queueIndex - b.queueIndex);

  // Reassign indices
  activeCustomers.forEach((c, i) => {
    c.queueIndex = i;
    if (i === 0) {
      c.state = CSTATE.AT_COUNTER;
    } else {
      c.state = CSTATE.QUEUED;
    }
  });
}

/**
 * Get the customer at the counter (queue index 0).
 */
export function getCustomerAtCounter(customers) {
  return customers.find(c => c.queueIndex === 0 && c.state === CSTATE.AT_COUNTER);
}

/**
 * Get the number of customers in queue (including at counter).
 */
export function getQueueLength(customers) {
  return customers.filter(c =>
    c.state === CSTATE.AT_COUNTER ||
    c.state === CSTATE.QUEUED ||
    c.state === CSTATE.ENTERING
  ).length;
}

/**
 * Check if queue has space for another customer.
 */
export function hasQueueSpace(customers, maxSize) {
  return getQueueLength(customers) < maxSize;
}
