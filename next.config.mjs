/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      domains: ['i1.sndcdn.com'], // Add your allowed image domains here
  },
  webpack(config) {
      config.module.rules.push({
          test: /\.svg$/,
          use: ['@svgr/webpack'],
      });
      return config;
  },
};

export default nextConfig;
