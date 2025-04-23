const { spawn } = require('child_process');
const path = require('path');

module.exports = (req, res) => {
  // تحديد المسار المطلوب
  const path = req.url;
  
  // إذا كان المسار هو /api بالضبط (بدون أي إضافات)
  if (path === '/' || path === '') {
    res.setHeader('Content-Type', 'text/html');
    res.write(`<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="utf-8">
  <title>WahaBot - واجهة WhatsApp HTTP API</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 50px;
      direction: rtl;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #4CAF50;
    }
    .links {
      margin-top: 30px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 15px;
    }
    .link-btn {
      display: inline-block;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      transition: background-color 0.3s;
    }
    .link-btn:hover {
      background-color: #388E3C;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>مرحبًا بك في WahaBot</h1>
    <h2>واجهة WhatsApp HTTP API</h2>
    <p>هذه هي واجهة برمجة تطبيقات HTTP لواتساب تتيح لك التحكم في واتساب من خلال طلبات HTTP</p>
    
    <div class="links">
      <a class="link-btn" href="/">الصفحة الرئيسية</a>
      <a class="link-btn" href="/swagger">سواجر API</a>
      <a class="link-btn" href="/docs">توثيق API</a>
    </div>

    <div style="margin-top: 30px;">
      <p>للبدء في استخدام API، قم بإرسال طلب POST إلى المسار التالي:</p>
      <code>POST /api/sessions</code>
      <p>متبوعًا بـ:</p>
      <code>GET /api/sessions/qr</code>
      <p>لمسح رمز QR بتطبيق واتساب الخاص بك.</p>
    </div>
  </div>
</body>
</html>`);
    
    return res.end();
  }
  
  // إذا لم يكن المسار هو /api تماماً، نعيد توجيهه للصفحة الرئيسية
  res.writeHead(302, { 'Location': '/' });
  res.end();
}; 