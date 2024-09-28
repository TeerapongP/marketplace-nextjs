/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i1.sndcdn.com" },
      { protocol: "https", hostname: "cms.dmpcdn.com" },
      { protocol: "https", hostname: "png.pngtree.com" },
      { protocol: "https", hostname: "media.istockphoto.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "www.dailynews.co.th" },
      { protocol: "https", hostname: "today-obs.line-scdn.net" },
      { protocol: "https", hostname: "img.salehere.co.th" },
      { protocol: "https", hostname: "www.prachachat.net" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "img.wongnai.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "www.ryoiireview.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "static.thairath.co.th" },
      { protocol: "https", hostname: "images.deliveryhero.io" },
      { protocol: "https", hostname: "img.kapook.com" },
      { protocol: "https", hostname: "sharp-weeclub.com" },
      { protocol: "https", hostname: "image.makewebcdn.com" },
      { protocol: "https", hostname: "www.unileverfoodsolutions.co.th" },
      { protocol: "https", hostname: "d3h1lg3ksw6i6b.cloudfront.net" },
      { protocol: "https", hostname: "greatyeat.com" },
      { protocol: "https", hostname: "www.mfoodservice.com" },
      { protocol: "https", hostname: "ofarmorganic.com" },
      { protocol: "https", hostname: "static.wixstatic.com" },
      { protocol: "https", hostname: "mkunigroup.com" },
      { protocol: "https", hostname: "www.easycookingmenu.com" },
      { protocol: "https", hostname: "baansomtum.com" },
      { protocol: "http", hostname: "localhost" }, 
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
