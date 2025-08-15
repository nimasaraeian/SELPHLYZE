/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'times': ['Times New Roman', 'serif'],
        'sans': ['var(--font-sans)'],
        'serif': ['var(--font-serif)'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        'elevate': '0 15px 35px rgba(2, 6, 23, 0.06), 0 5px 15px rgba(2, 6, 23, 0.08)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}