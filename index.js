require("dotenv").config()

const express = require('express');
const logger = require("./lib/logger.js")

const app = express();
const promMid = require('express-prometheus-middleware');

const loggerMw = require("pino-http")({
  transport: {
    targets: [
      {
        target: "pino-opentelemetry-transport",
        options: {
          resourceAttributes: {
            "service.name": "order-service",
          },
        },
      },
      {
        target: "pino-pretty",
        level: "info",
        options: { colorize: true },
      },
    ],
  }
})

const port = 3000;
const query = require("./mock/query.js")
const paymentGateway = require("./mock/payment-gateway.js")

const orders = new Map();

const { metrics } = require('@opentelemetry/api');
const meter = metrics.getMeter('jitterbox');

app.use(loggerMw)
app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
  requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
}))


app.get("/data", async (req, res) => {
  const histogram = meter.createHistogram('task.duration')
  const startTime = new Date().getTime();

  const list = orders.values()
  res.send({ data: list })

  const endTime = new Date().getTime()
  histogram.record(endTime - startTime)
})

app.post("/order", async (req, res) => {
  const orderId = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  orders.set(orderId, { status: 'created' });
  await query({ orderId });
  res.send({ message: 'Order placed', orderId });
})

app.post('/pay', async (req, res) => {
  const { orderId } = req.body;

  if (!orderId || !orders.has(orderId)) {
    return res.status(400).send({ error: 'Invalid order ID' });
  }

  const order = orders.get(orderId);

  if (order.status === 'paid') {
    return res.status(400).send({ error: 'Order already paid' });
  }

  try {
    const paymentResult = await paymentGateway(orderId);
    await query({ orderId, paid: true });
    order.status = 'paid';
    orders.set(orderId, order);
    res.send({ message: 'Payment successful', orderId, via: paymentResult.provider });
  } catch (err) {
    res.status(500).send({ error: `Payment failed: ${err.message}` });
  }
});


app.listen(port, () => {
  logger.info("Port is listening on 3000")
});
