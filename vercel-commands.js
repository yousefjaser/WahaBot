// Vercel build & development commands
module.exports = {
  builds: [
    {
      src: 'package.json',
      use: '@vercel/node',
      config: {
        distDir: 'dist',
        buildCommand: 'npm run build',
        installCommand: 'npm install',
      },
    },
  ],
  routes: [
    { handle: 'filesystem' },
    { src: '/api/(.*)', dest: 'dist/main.js' },
    { src: '/(.*)', dest: 'api/index.js' },
  ],
}; 