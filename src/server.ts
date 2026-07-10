import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine(
  {
    trustProxyHeaders: [
      'x-forwarded-for',
      'x-forwarded-host',
      'x-forwarded-port',
      'x-forwarded-proto',
      'x-forwarded-prefix',
      'x-forwarded-server'
    ] // Trust all X-Forwarded-* headers
  }
);

// Live-Check: check if the event loop is responsive.
app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Ready-Check: check if the server is ready to accept traffic. If the server is shutting down, return 503.
let isShuttingDown = false;
app.get('/readyz', (_req, res) => {
  if (isShuttingDown) {
    // Prozess fährt herunter — keinen neuen Traffic mehr annehmen.
    res.status(503).json({ status: 'shutting_down' });
    return;
  }
  res.status(200).json({ status: 'ready' });
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
    setHeaders: (res, filePath) => {
      if (/\.[0-9a-f]{8,}\.(js|css|woff2?)$/i.test(filePath)) {
        // Fingerprinted: ein Jahr, unveränderlich.
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        // Nicht gehashte Dateien (z. B. favicon, robots.txt): kurz cachen (10 Minuten), aber revalidieren lassen.
        res.setHeader('Cache-Control', 'public, max-age=600, must-revalidate');
      }
    },
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (!response) {
        next();
        return;
      }
      // HTML-Antworten kurz cachen und revalidieren lassen. 
      // No-cache means: revalidate before use, but not not to cache at all
      if (!res.headersSent) {
        res.setHeader(
          'Cache-Control',
          'no-cache, max-age=0, must-revalidate',
        );
      }
      return writeResponseToNodeResponse(response, res);
    })
    .catch(next);
});

/**
 * Error handler — must be the last middleware registered.
 * Four parameters are mandatory so Express recognises it as an error handler.
 * A single failed SSR render must never bring down the whole process.
 */
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error('SSR render failed:', err);
    if (res.headersSent) {
      // Response already started — just close the connection cleanly.
      res.end();
      return;
    }
    res.status(500).send('Internal Server Error');
  },
);

// Log unhandled promise rejections but keep the process alive.
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

// An uncaughtException leaves the process in an undefined state — exit so the
// process manager (PM2, Kubernetes, …) can restart it cleanly.
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception — shutting down:', err);
  process.exit(1);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
