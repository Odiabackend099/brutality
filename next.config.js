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
      
      // Configure ONNX runtime for client-side
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
      });
      
      // Ignore ONNX runtime warnings
      config.ignoreWarnings = [
        {
          module: /node_modules\/onnxruntime-web/,
          message: /Critical dependency: require function/,
        },
      ];
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
