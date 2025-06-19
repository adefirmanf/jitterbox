const delay = require("../lib/delay.js")

const simulatePaymentGateway = async (orderId) => {
  const chance = Math.random();
  const delayMs = Math.floor(Math.random() * 4000);

  await delay(delayMs);

  if (chance < 0.2) {
    throw new Error('Payment gateway error');
  } else if (delayMs > 3000) {
    throw new Error('Payment gateway timeout');
  }

  return { status: 'success', provider: 'MockStripe' };
}

module.exports = simulatePaymentGateway
