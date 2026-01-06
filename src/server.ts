import { registerOTel } from '@vercel/otel';
import { context, propagation } from "@opentelemetry/api";
import handler from "@tanstack/react-start/server-entry";

registerOTel({
  serviceName: 'tanstack-start'
});

function withInboundContext(request: Request, fn: () => Response | Promise<Response>): Response | Promise<Response> {
  const extractedContext = propagation.extract(
    context.active(),
    Object.fromEntries(request.headers)
  );
  return context.with(extractedContext, fn);
}

export default {
  fetch(request: Request) {
    return withInboundContext(request, () => handler.fetch(request));
  },
};


