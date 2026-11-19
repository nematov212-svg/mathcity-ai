import express, { Request, Response } from 'express';
import path from 'path';
import http from 'http';

const app = express();
const WEB_PORT = process.env.WEB_PORT ? parseInt(process.env.WEB_PORT, 10) : 8085;
const flutterWebPath = path.resolve(process.cwd(), '../frontend/build/web');

// Proxy API calls to backend port 4000 if called locally
app.use('/api', (req: Request, res: Response) => {
  const options: http.RequestOptions = {
    hostname: '127.0.0.1',
    port: 4000,
    path: `/api${req.url}`,
    method: req.method,
    headers: {
      ...req.headers,
      host: '127.0.0.1:4000',
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error('⚠️ Web proxy to backend:4000 error:', err.message);
    res.status(502).json({
      success: false,
      error: 'Backend API serveri (port 4000) bilan aloqa o‘rnatilmadi.',
    });
  });

  req.pipe(proxyReq, { end: true });
});

// Serve Flutter Web static files
app.use(express.static(flutterWebPath));

// Fallback to index.html for Flutter Web SPA routes (/login, /kids/home, /complete-profile, etc.)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(flutterWebPath, 'index.html'));
});

app.listen(WEB_PORT, () => {
  console.log(`📱 MathCity AI Flutter Web running on http://localhost:${WEB_PORT}`);
});
