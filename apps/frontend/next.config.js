/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: false,
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
