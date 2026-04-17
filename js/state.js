// Game state management
const gameState = {
  screen: 'start', // start, playing, summary
  money: 0,
  dayTime: 60, // seconds
  customers: [],
  currentDrink: null,
  stats: {
    served: 0,
    failed: 0
  }
};

// Queue positions (x, y coordinates)
const QUEUE_POSITIONS = [
  { x: 150, y: 300 },
  { x: 200, y: 300 },
  { x: 250, y: 300 }
];

// Screen management
function showScreen(screenName) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  // Show target screen
  const targetScreen = document.getElementById(`${screenName}-screen`);
  if (targetScreen) {
    targetScreen.classList.add('active');
    gameState.screen = screenName;
  }
}

function assignQueueSlot(customer) {
  // Find first available slot
  for (let i = 0; i < QUEUE_POSITIONS.length; i++) {
    const slotOccupied = gameState.customers.some(c =>
      c.queuePosition === i && c.state !== 'leaving'
    );

    if (!slotOccupied) {
      customer.queuePosition = i;
      customer.targetX = QUEUE_POSITIONS[i].x;
      customer.targetY = QUEUE_POSITIONS[i].y;
      return true;
    }
  }
  return false; // No available slots
}

function advanceQueue() {
  // Move customers forward in queue
  for (let i = 0; i < gameState.customers.length; i++) {
    const customer = gameState.customers[i];
    if (customer.queuePosition > 0) {
      // Check if slot in front is empty
      const slotInFrontOccupied = gameState.customers.some(c =>
        c.queuePosition === customer.queuePosition - 1 && c.state !== 'leaving'
      );

      if (!slotInFrontOccupied) {
        customer.queuePosition--;
        customer.targetX = QUEUE_POSITIONS[customer.queuePosition].x;
        customer.targetY = QUEUE_POSITIONS[customer.queuePosition].y;
      }
    }
  }
}

function resetGame() {
  gameState.money = 0;
  gameState.dayTime = 60;
  gameState.customers = [];
  gameState.currentDrink = null;
  gameState.stats.served = 0;
  gameState.stats.failed = 0;
}

export { gameState, QUEUE_POSITIONS, showScreen, assignQueueSlot, advanceQueue, resetGame };