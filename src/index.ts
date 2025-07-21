import {
  App,
  Security,
  Cors,
  ConsoleExporter,
  JsonExporter,
  OtelHttpExporter,
  isDevMode,
} from '@trifrost/core';
import { css } from './css';
import { script } from './script';
import { type Env } from './types';
import { routes } from './routes';
import { notFoundHandler } from './routes/notfound';
import { errorHandler } from './routes/error';

const app = await new App<Env>({
  client: { css, script },
  tracing: {
    exporters: ({ env }) => {
      if (isDevMode(env)) return new ConsoleExporter();
      return [
        new JsonExporter(),
        new OtelHttpExporter({
          logEndpoint: 'https://ingest.trifrost.dev/v1/ingest/otel',
          spanEndpoint: 'https://ingest.trifrost.dev/v1/ingest/otel',
          headers: {
            'x-ingest-key': env.TRIFROST_INGESTOR_KEY,
            'x-ingest-client': env.TRIFROST_INGESTOR_CLIENT,
          },
        }),
      ];
    },
  },
})
  .use(
    Security({
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'nonce'",
          'https://cdn.jsdelivr.net',
          'https://static.cloudflareinsights.com',
          'https://unpkg.com',
        ],
        'style-src': [
          "'self'",
          "'nonce'",
          'https://unpkg.com',
          'https://cdn.jsdelivr.net',
          'https://fonts.googleapis.com',
        ],
        'font-src': ['https://fonts.gstatic.com', 'fonts.googleapis.com'],
        'frame-ancestors': 'none',
        'frame-src': 'none',
      },
    })
  )
  .use(Cors())
  .group('', routes)
  .onNotFound(notFoundHandler)
  .onError(errorHandler)
  .boot();

export default app;
