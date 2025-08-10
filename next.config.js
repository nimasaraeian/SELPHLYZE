/** @type {import('next').NextConfig} */
const nextConfig = {
  // بهینه‌سازی برای سرعت development
  swcMinify: true,
  experimental: {
    // بهینه‌سازی chunk ها
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // کاهش bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig