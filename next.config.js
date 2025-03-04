/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true, // Habilita minificação com SWC para melhor performance
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx', 'tsx', 'ts', 'js', 'jsx'], // Extensões suportadas para páginas e APIs
};

module.exports = nextConfig;
