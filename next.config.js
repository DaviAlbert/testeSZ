/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true, // Habilita minificação com SWC para melhor performance
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx', 'tsx', 'ts', 'js', 'jsx'],
  reactRefresh:false,
};

module.exports = nextConfig;
