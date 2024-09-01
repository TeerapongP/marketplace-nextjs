/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
        'i1.sndcdn.com',
        'cms.dmpcdn.com',
        'png.pngtree.com',
        'media.istockphoto.com',
        'images.pexels.com',
        'www.dailynews.co.th',
        'today-obs.line-scdn.net',
        'img.salehere.co.th',
        'www.prachachat.net',
        'encrypted-tbn0.gstatic.com',
        'img.wongnai.com',
        'i.ytimg.com',
        'www.ryoiireview.com',
        'lh5.googleusercontent.com'
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
