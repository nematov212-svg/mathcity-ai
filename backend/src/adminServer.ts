import express from 'express';
import path from 'path';

const adminApp = express();
const ADMIN_PORT = process.env.ADMIN_PORT ? parseInt(process.env.ADMIN_PORT, 10) : 3001;
const adminStaticPath = path.resolve(process.cwd(), 'public/admin');

// Serve the admin portal
adminApp.use('/', express.static(adminStaticPath));
adminApp.get('*', (req, res) => {
  res.sendFile(path.join(adminStaticPath, 'index.html'));
});

adminApp.listen(ADMIN_PORT, () => {
  console.log(`🛡️ MathCity AI Standalone Admin Panel running on http://localhost:${ADMIN_PORT}`);
});
