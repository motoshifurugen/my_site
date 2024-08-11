/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/my_site',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/my_site/' : '',
};

export default nextConfig;
