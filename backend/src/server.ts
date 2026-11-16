import { app } from './app.js';
import { config } from './config/env.js';

app.listen(config.port, () => {
  console.log(`🚀 MathCity AI Backend is running on http://localhost:${config.port}`);
  console.log(`✨ Environment: ${config.nodeEnv}`);
});
