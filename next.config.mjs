/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/my_site',
  assetPrefix: '/my_site/',
};
module.exports = {
  assetPrefix: process.env.NODE_ENV === 'production' ? '/my-site/' : '',
  images: {
    loader: 'imgix',
    path: '',
  },
};

export default nextConfig;
