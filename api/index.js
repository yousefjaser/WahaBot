const { spawn } = require('child_process');
const path = require('path');

module.exports = (req, res) => {
  // توجيه كل الطلبات إلى تطبيق NestJS
  const entryPoint = path.join(__dirname, '../dist/main.js');
  
  res.setHeader('Content-Type', 'text/html');
  res.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>WahaBot - واجهة WhatsApp HTTP API</title>
  <meta http-equiv="refresh" content="0;url=/api">
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 50px;
      direction: rtl;
    }
    h1 {
      color: #4CAF50;
    }
  </style>
</head>
<body>
  <h1>جاري تحويلك إلى واجهة WahaBot...</h1>
  <p>إذا لم يتم التحويل تلقائيًا، <a href="/api">انقر هنا</a>.</p>
</body>
</html>`);
  
  res.end();
}; 