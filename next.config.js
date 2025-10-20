/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // Configure ONNX runtime for client-side with optimizations
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
      });
      
      // Note: Removed ONNX runtime alias to fix build error
      
      // Ignore ONNX runtime warnings and optimize performance
      config.ignoreWarnings = [
        {
          module: /node_modules\/onnxruntime-web/,
          message: /Critical dependency: require function/,
        },
        {
          module: /node_modules\/@ricky0123\/vad-web/,
          message: /Critical dependency/,
        },
      ];
      
      // Performance optimizations for ONNX runtime
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            onnx: {
              test: /[\\/]node_modules[\\/](onnxruntime-web|@ricky0123\/vad-web)[\\/]/,
              name: 'onnx',
              chunks: 'all',
              priority: 20,
            },
          },
        },
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/animations/:path*',
        destination: '/public/animations/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
