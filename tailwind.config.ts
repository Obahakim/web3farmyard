import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lime:   '#c8ff00',
        dark:   '#0a0a0a',
        bg:     '#eef0f4',
        red:    '#ff4d4d',
        amber:  '#ff9f00',
        cyan:   '#00ffe0',
      },
      fontFamily: {
        mono:  ['Space Mono', 'Courier New', 'monospace'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
}
export default config
