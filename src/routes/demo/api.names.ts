import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { trace, SpanStatusCode } from '@opentelemetry/api'

const tracer = trace.getTracer('otel-demo-app')

export const Route = createFileRoute('/demo/api/names')({
  server: {
    handlers: {
      GET: async () => {
        return tracer.startActiveSpan('fetch-user-data', async (span) => {
          try {
            span.setAttribute('user.operation', 'fetch')
            span.setAttribute('user.source', 'database')

            // Simulate database query
            await tracer.startActiveSpan('database.query', async (dbSpan) => {
              dbSpan.setAttribute('db.operation', 'SELECT')
              dbSpan.setAttribute('db.table', 'users')

              await new Promise((resolve) => setTimeout(resolve, 50))

              dbSpan.end()
            })

            span.setStatus({ code: SpanStatusCode.OK })
            span.end()

            return json({
              success: true,
              users: [
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' },
              ],
            })
          } catch (error) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: String(error) })
            span.end()
            throw error
          }
        })
      },
    },
  },
})
