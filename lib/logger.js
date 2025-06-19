const pino = require("pino")

const logger = pino({
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
});

module.exports = logger.child({ service_name: "jitterbox-app" })

