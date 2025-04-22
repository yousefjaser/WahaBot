// api/server.js
const { spawn } = require('child_process');
const path = require('path');

// تشغيل تطبيق NestJS
const app = spawn('node', [path.join(__dirname, '../dist/main.js')], {
  stdio: 'inherit',
});

// معالجة الإنهاء
process.on('SIGTERM', () => {
  console.log('تم استلام إشارة SIGTERM، إيقاف التطبيق...');
  app.kill();
  process.exit(0);
});

app.on('close', (code) => {
  console.log(`تم إغلاق تطبيق NestJS برمز الخروج ${code}`);
  process.exit(code);
}); 