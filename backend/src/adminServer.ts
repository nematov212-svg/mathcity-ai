import express, { Request, Response } from 'express';
import path from 'path';
import http from 'http';

const adminApp = express();
const ADMIN_PORT = process.env.ADMIN_PORT ? parseInt(process.env.ADMIN_PORT, 10) : 3001;
const adminStaticPath = path.resolve(process.cwd(), 'public/admin');

// Forward API requests to the main backend on port 4000
adminApp.use('/api', (req: Request, res: Response) => {
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
    console.error('⚠️ Admin proxy to backend:4000 error:', err.message);
    res.status(502).json({
      success: false,
      error: 'Backend API serveri (port 4000) bilan aloqa o‘rnatilmadi.',
    });
  });

  req.pipe(proxyReq, { end: true });
});

// Serve the admin portal static files
adminApp.use('/', express.static(adminStaticPath));
adminApp.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(adminStaticPath, 'index.html'));
});

adminApp.listen(ADMIN_PORT, () => {
  console.log(`🛡️ MathCity AI Standalone Admin Panel running on http://localhost:${ADMIN_PORT}`);
});
