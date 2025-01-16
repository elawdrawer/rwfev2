/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    images: {
      domains: ['rewardwale.com','d2c97t3k1om0pj.cloudfront.net','d1scqik6tlhrr8.cloudfront.net','github.com'],
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    env: {
      AUTH_KEY: process.env.AUTH_SECRET,
      API_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    },
};

export default nextConfig;
