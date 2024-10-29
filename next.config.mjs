/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'export',
  basePath: '/my_site',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/my_site/' : '',
  staticPageGenerationTimeout: 60,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    // APIルートを除外
    const pathMap = { ...defaultPathMap }
    delete pathMap['/api/blog/[slug]']
    return pathMap
  },
};

export default nextConfig;
