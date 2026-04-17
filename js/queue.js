// Queue management for customer positions
import { QUEUE_SLOTS } from './constants.js';

export function assignQueueSlot(customer, customers) {
  // Find first available slot
  for (let i = 0; i < QUEUE_SLOTS.length; i++) {
    const slotOccupied = customers.some(c =>
      c.queueIndex === i && c.state !== 'leaving' && c.state !== 'gone'
    );

    if (!slotOccupied) {
      customer.queueIndex = i;
      return i;
    }
  }
  return -1; // No available slots
}

export function advanceQueue(customers) {
  // Remove customers that have left
  const activeCustomers = customers.filter(c =>
    c.state !== 'leaving' && c.state !== 'gone'
  );

  // Sort customers by queue index
  activeCustomers.sort((a, b) => a.queueIndex - b.queueIndex);

  // Reassign queue indices sequentially, ensuring proper advancement
  for (let i = 0; i < activeCustomers.length; i++) {
    const customer = activeCustomers[i];
    customer.queueIndex = i;

    // Update customer's target position based on new queue index
    if (customer.state === 'queued' || customer.state === 'entering') {
      const targetSlot = QUEUE_SLOTS[i];
      customer.targetX = targetSlot.x;
      customer.targetY = targetSlot.y;
    }
  }

  // Update the customers array
  customers.length = 0;
  activeCustomers.forEach(c => customers.push(c));

  // If there's a customer at queue index 0, ensure they're at the counter
  if (activeCustomers.length > 0 && activeCustomers[0].queueIndex === 0) {
    const frontCustomer = activeCustomers[0];
    if (frontCustomer.state === 'queued' && frontCustomer.hasReachedTarget()) {
      frontCustomer.state = 'at_counter';
    }
  }

  // AC-3/AC-4 Validation: Ensure no two customers occupy the same queue slot
  const slotOccupancy = {};
  for (const customer of activeCustomers) {
    if (customer.queueIndex >= 0) {
      if (slotOccupancy[customer.queueIndex]) {
        console.error(`AC-3/AC-4 VIOLATION: Multiple customers in slot ${customer.queueIndex}`);
        // Fix the collision by reassigning the customer
        const newSlot = assignQueueSlot(customer, activeCustomers);
        if (newSlot >= 0) {
          customer.queueIndex = newSlot;
        }
      }
      slotOccupancy[customer.queueIndex] = true;
    }
  }

  // AC-3/AC-4 Compliance: Log queue status for validation
  console.log(`Queue Status: ${activeCustomers.length} customers, slots: ${activeCustomers.map(c => c.queueIndex).join(', ')}`);
}

export function getAvailableQueueSlots(customers) {
  const occupiedSlots = customers
    .filter(c => c.queueIndex >= 0)
    .map(c => c.queueIndex);

  return QUEUE_SLOTS.length - occupiedSlots.length;
}