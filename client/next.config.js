/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["im1.dineout.co.in", "res.cloudinary.com", "images.unsplash.com"],
  },
};

module.exports = nextConfig;
