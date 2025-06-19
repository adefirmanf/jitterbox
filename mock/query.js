const delay = require("../lib/delay.js")
// Simulated DB function with random delay
const queryDB = async () => {
  // More realistic delay distribution
  let delayMs;
  const random = Math.random();

  if (random < 0.7) {
    // 70% fast queries (10-50ms)
    delayMs = 10 + Math.random() * 40;
  } else if (random < 0.95) {
    // 25% medium queries (50-200ms)
    delayMs = 50 + Math.random() * 150;
  } else {
    // 5% slow queries (200-500ms) - much better than 2000ms!
    delayMs = 200 + Math.random() * 300;
  }

  await delay(delayMs);
  return { status: 'success', queryTime: delayMs };

}

module.exports = queryDB

