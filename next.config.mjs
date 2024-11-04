/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  images: {
    unoptimized: true,
  },
  basePath: '/my_site',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/my_site/' : '',
  staticPageGenerationTimeout: 60,
};

export default nextConfig;
