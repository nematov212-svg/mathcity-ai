const path = require('path');

console.log('=================================================');
console.log('🚀 [Render Startup] MathCity AI Backend Bootstrapping');
console.log('=================================================');
console.log('✨ Starting server process immediately for port binding...');

require(path.join(__dirname, '..', 'dist', 'server.js'));
