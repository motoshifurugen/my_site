/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/my_site',
  assetPrefix: '/my_site/',
};

export default nextConfig;
