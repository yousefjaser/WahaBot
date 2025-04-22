// vercel-build.js
const { execSync } = require('child_process');

try {
  // حذف مجلد dist إذا كان موجودًا
  console.log('🔄 جاري حذف مجلد dist...');
  execSync('rm -rf dist');
  
  // بناء المشروع
  console.log('🔨 جاري بناء المشروع...');
  execSync('npx @nestjs/cli build');
  
  console.log('✅ تم بناء المشروع بنجاح!');
} catch (error) {
  console.error('❌ حدث خطأ أثناء البناء:', error.toString());
  process.exit(1);
} 