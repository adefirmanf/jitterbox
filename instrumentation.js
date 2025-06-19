const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base')
const { NodeSDK } = require('@opentelemetry/sdk-node')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const {
  ExpressInstrumentation,
} = require('@opentelemetry/instrumentation-express')

const exporter = new OTLPTraceExporter({})

const bsp = new BatchSpanProcessor(exporter, {
  maxExportBatchSize: 1000,
  maxQueueSize: 1000,
})

const sdk = new NodeSDK({
  spanProcessor: bsp,
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
})

sdk.start()
