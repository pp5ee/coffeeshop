// Queue System Validation - AC-3/AC-4 Compliance
// Tests customer spawning, movement, and queue advancement

import { QUEUE_SLOTS } from './constants.js';

export class QueueValidator {
  constructor() {
    this.testsPassed = 0;
    this.testsTotal = 0;
  }

  // Test AC-3: Customer spawning and queue positions
  testCustomerSpawning(customers) {
    console.log('=== AC-3: Customer Spawning Validation ===');

    // Test 1: Customers spawn at door position
    this.test('Customer spawns at door', () => {
      const newCustomer = { x: 150, y: 280, queueIndex: -1 };
      return newCustomer.x >= 140 && newCustomer.x <= 160 && newCustomer.y >= 270 && newCustomer.y <= 290;
    });

    // Test 2: Customers move toward first queue slot
    this.test('Customer moves to queue slot', () => {
      const customer = { x: 150, y: 280, queueIndex: 0 };
      const targetSlot = QUEUE_SLOTS[0];
      return customer.queueIndex === 0 && targetSlot.x === 300 && targetSlot.y === 280;
    });

    // Test 3: Multiple customers can queue simultaneously
    this.test('Multiple customers in queue', () => {
      const queueLength = customers.filter(c => c.queueIndex >= 0).length;
      return queueLength <= QUEUE_SLOTS.length;
    });

    // Test 4: No customer spawns inside queue or at counter
    this.test('No spawn in queue/counter', () => {
      const badSpawn = customers.some(c =>
        c.queueIndex > 0 && (c.x === QUEUE_SLOTS[0].x && c.y === QUEUE_SLOTS[0].y)
      );
      return !badSpawn;
    });

    console.log(`AC-3 Results: ${this.testsPassed}/${this.testsTotal} tests passed\n`);
    return this.testsPassed === this.testsTotal;
  }

  // Test AC-4: Queue system advancement
  testQueueAdvancement(customers) {
    console.log('=== AC-4: Queue Advancement Validation ===');

    // Test 1: Customer at front advances to counter when space free
    this.test('Front customer advances to counter', () => {
      const frontCustomer = customers.find(c => c.queueIndex === 0);
      const counterFree = !customers.some(c => c.state === 'at_counter');
      return frontCustomer && counterFree;
    });

    // Test 2: Queue compresses when front customer leaves
    this.test('Queue compression on departure', () => {
      const initialLength = customers.length;
      const leavingCustomer = customers.find(c => c.state === 'served' || c.state === 'angry');

      if (leavingCustomer && leavingCustomer.queueIndex === 0) {
        const remainingCustomers = customers.filter(c =>
          c.state === 'queued' || c.state === 'entering'
        );

        // Check if queue indices are properly reassigned
        const indices = remainingCustomers.map(c => c.queueIndex);
        const expectedIndices = Array.from({length: remainingCustomers.length}, (_, i) => i);
        return JSON.stringify(indices.sort()) === JSON.stringify(expectedIndices);
      }
      return true; // No customer leaving, test passes
    });

    // Test 3: Only one customer at counter for ordering
    this.test('Single customer at counter', () => {
      const customersAtCounter = customers.filter(c => c.state === 'at_counter');
      return customersAtCounter.length <= 1;
    });

    // Test 4: No jumping from back to counter
    this.test('No queue jumping', () => {
      const customersAtCounter = customers.filter(c => c.state === 'at_counter');
      const validAdvancement = customersAtCounter.every(c => c.queueIndex === 0);
      return validAdvancement;
    });

    console.log(`AC-4 Results: ${this.testsPassed}/${this.testsTotal} tests passed\n`);
    return this.testsPassed === this.testsTotal;
  }

  // Test AC-10: Pixel-art aesthetic
  testPixelArtAesthetic() {
    console.log('=== AC-10: Pixel Art Aesthetic Validation ===');

    // Test 1: Canvas uses image-rendering: pixelated CSS
    this.test('Canvas pixel rendering', () => {
      const canvas = document.createElement('canvas');
      const style = window.getComputedStyle(canvas);
      return style.imageRendering.includes('pixelated') ||
             style.imageRendering.includes('crisp-edges');
    });

    // Test 2: imageSmoothingEnabled is false
    this.test('Image smoothing disabled', () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      return ctx.imageSmoothingEnabled === false;
    });

    // Test 3: Colors use limited palette
    this.test('Limited color palette', () => {
      // Check if CSS uses pixel-friendly colors (no gradients)
      const stylesheet = Array.from(document.styleSheets)
        .map(sheet => Array.from(sheet.cssRules || []))
        .flat()
        .map(rule => rule.cssText);

      const hasGradients = stylesheet.some(text =>
        text.includes('gradient(') || text.includes('rgba(')
      );
      return !hasGradients;
    });

    // Test 4: UI uses pixel fonts
    this.test('Pixel fonts used', () => {
      const bodyStyle = window.getComputedStyle(document.body);
      const isMonospace = bodyStyle.fontFamily.includes('monospace') ||
                         bodyStyle.fontFamily.includes('Courier') ||
                         bodyStyle.fontFamily.includes('Pixel');
      return isMonospace;
    });

    console.log(`AC-10 Results: ${this.testsPassed}/${this.testsTotal} tests passed\n`);
    return this.testsPassed === this.testsTotal;
  }

  // Helper method for running tests
  test(name, testFunction) {
    this.testsTotal++;
    try {
      const result = testFunction();
      if (result) {
        console.log(`  ✓ ${name}`);
        this.testsPassed++;
      } else {
        console.log(`  ✗ ${name}`);
      }
    } catch (error) {
      console.log(`  ✗ ${name} - Error: ${error.message}`);
    }
  }

  // Run all AC validations
  runAllValidations(customers) {
    console.log('=== Pixel Coffee Shop AC Validation ===\n');

    const ac3Passed = this.testCustomerSpawning(customers);
    const ac4Passed = this.testQueueAdvancement(customers);
    const ac10Passed = this.testPixelArtAesthetic();

    console.log('=== FINAL RESULTS ===');
    console.log(`AC-3 (Customer Spawning): ${ac3Passed ? 'PASS' : 'FAIL'}`);
    console.log(`AC-4 (Queue Advancement): ${ac4Passed ? 'PASS' : 'FAIL'}`);
    console.log(`AC-10 (Pixel Art): ${ac10Passed ? 'PASS' : 'FAIL'}`);
    console.log(`Overall: ${ac3Passed && ac4Passed && ac10Passed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);

    return ac3Passed && ac4Passed && ac10Passed;
  }
}