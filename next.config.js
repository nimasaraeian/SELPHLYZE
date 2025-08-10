/** @type {import('next').NextConfig} */
const nextConfig = {
  // بهینه‌سازی برای سرعت development
  swcMinify: true,
  experimental: {
    // بهینه‌سازی chunk ها
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

module.exports = nextConfig