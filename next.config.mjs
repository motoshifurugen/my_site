/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  basePath: '/my_site',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/my_site/' : '',
  staticPageGenerationTimeout: 60,
};

export default nextConfig;
