/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lmipnlxdpnktheahopee.supabase.co'],
  },
  webpack: (config, { isServer }) => {
    // クライアントサイドのみの設定
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
      };
    }
    
    config.externals = [...(config.externals || []), {
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    }];
    
    return config;
  },
};

module.exports = nextConfig;
