/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true, // Habilita minificação com SWC para melhor performance
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx', 'tsx', 'ts', 'js', 'jsx'],
  reactRefresh:false,
    api: {
    bodyParser: {
      sizeLimit: '500mb', // Definindo o limite para 500 MB
    },
  },
};

module.exports = nextConfig;
