import { App, Security, Cors } from '@trifrost/core';
import { css } from './css';
import { script } from './script';
import { type Env } from './types';
import { routes } from './routes';
import { notFoundHandler } from './routes/notfound';
import { errorHandler } from './routes/error';

const app = await new App<Env>({
  client: { css, script },
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
