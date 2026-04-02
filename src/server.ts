import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';
import {join} from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Proxy for PuRe Blog Feed and MPDL Services to avoid CORS issues
 */
app.use(
  '/pureblogfeed',
  createProxyMiddleware({
    target: 'https://blog.pure.mpg.de/json1',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/pureblogfeed': '',
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log(`[PROXY BLOG] Request: ${req.method} ${(req as any).originalUrl} -> ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
      },
      proxyRes: (proxyRes, req, res) => {
        console.log(`[PROXY BLOG] Response: ${proxyRes.statusCode} for ${(req as any).originalUrl}`);
      },
      error: (err, req, res) => {
        console.error(`[PROXY BLOG] Error: ${err.message} for ${(req as any).originalUrl}`);
        const response = res as any;
        if (response && response.headersSent === false && typeof response.writeHead === 'function') {
          response.writeHead(502, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ error: 'Proxy error', message: 'Target blog.pure.mpg.de is currently unreachable (DNS or Network issue).', details: err.message }));
        }
      },
    }
  })
);

app.use(
  createProxyMiddleware({
    pathFilter: ['/cone', '/rest'],
    target: 'https://qa.pure.mpdl.mpg.de',
    changeOrigin: true,
    secure: false,
    xfwd: false,
    logger: console,
    on: {
      proxyReq: (proxyReq, req, res) => {
        // Setze X-Forwarded-For auf die MPDL-Gateway-IP, um Listenbildung zu vermeiden
        proxyReq.setHeader('X-Forwarded-For', '130.183.252.19');
        console.log(`[PROXY] Request: ${req.method} ${(req as any).originalUrl} -> ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
      },
      proxyRes: (proxyRes, req, res) => {
        console.log(`[PROXY] Response: ${proxyRes.statusCode} for ${(req as any).originalUrl}`);
      },
      error: (err, req, res) => {
        console.error(`[PROXY] Error: ${err.message} for ${(req as any).originalUrl}`);
      },
    }
  })
);

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
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
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
