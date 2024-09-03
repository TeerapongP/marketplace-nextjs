/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i1.sndcdn.com' },
      { protocol: 'https', hostname: 'cms.dmpcdn.com' },
      { protocol: 'https', hostname: 'png.pngtree.com' },
      { protocol: 'https', hostname: 'media.istockphoto.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'www.dailynews.co.th' },
      { protocol: 'https', hostname: 'today-obs.line-scdn.net' },
      { protocol: 'https', hostname: 'img.salehere.co.th' },
      { protocol: 'https', hostname: 'www.prachachat.net' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'img.wongnai.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'www.ryoiireview.com' },
      { protocol: 'https', hostname: 'lh5.googleusercontent.com' },
    ],
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
