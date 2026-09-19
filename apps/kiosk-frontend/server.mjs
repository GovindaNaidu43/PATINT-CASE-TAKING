import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT || 5173);
const apiUrl = process.env.API_URL || 'http://localhost:8000';
const kioskApiKey = process.env.KIOSK_API_KEY;
const root = path.dirname(fileURLToPath(import.meta.url));

if (!kioskApiKey && process.env.NODE_ENV === 'production') {
  throw new Error('KIOSK_API_KEY must be configured on the kiosk server');
}

app.use(express.static(path.join(root, 'dist')));

app.use('/api', async (request, response) => {
  const target = new URL(request.originalUrl.replace(/^\/api/, '') || '/', apiUrl);
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (name !== 'host' && name !== 'content-length' && typeof value === 'string') headers.set(name, value);
  }
  headers.set('X-Kiosk-Key', kioskApiKey || 'local-development-kiosk-key');

  const body = ['GET', 'HEAD'].includes(request.method) ? undefined : request;
  const upstream = await fetch(target, { method: request.method, headers, body, duplex: body ? 'half' : undefined });
  response.status(upstream.status);
  upstream.headers.forEach((value, name) => response.setHeader(name, value));
  response.send(Buffer.from(await upstream.arrayBuffer()));
});

app.use((_request, response) => response.sendFile(path.join(root, 'dist', 'index.html')));
app.listen(port, '0.0.0.0', () => console.log(`Kiosk server listening on ${port}`));