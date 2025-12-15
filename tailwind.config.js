/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_posts/**/*.{html,md}',
    './_products/**/*.{html,md}',
    './markdown/**/*.{html,md}',
    './blog/**/*.html',
    './*.{html,md}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Cypherpunk 色彩系統
      colors: {
        // 主色 - 柔和駭客綠（降低飽和度，更護眼）
        'cp-green': {
          DEFAULT: '#4ade80',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // 背景色系
        'cp-dark': {
          DEFAULT: '#0a0a0a',
          50: '#1a1a1a',
          100: '#0d1117',
          200: '#161b22',
          300: '#21262d',
          400: '#30363d',
          500: '#484f58',
          600: '#6e7681',
          700: '#8b949e',
          800: '#c9d1d9',
          900: '#f0f6fc',
        },
        // 強調色
        'cp-accent': {
          red: '#ff6b6b',
          orange: '#ffa500',
          cyan: '#00ffff',
          purple: '#bf00ff',
        },
      },
      // 字體
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
        'sans': ['Inter', 'Noto Sans TC', 'system-ui', 'sans-serif'],
      },
      // 動畫
      animation: {
        'matrix-rain': 'matrix-rain 20s linear infinite',
        'typewriter': 'typewriter 3s steps(40) 1s forwards',
        'cursor-blink': 'cursor-blink 1s step-end infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        'matrix-rain': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'typewriter': {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'glow': {
          'from': {
            textShadow: '0 0 4px rgba(74, 222, 128, 0.4)',
          },
          'to': {
            textShadow: '0 0 8px rgba(74, 222, 128, 0.5)',
          },
        },
        'scanline': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'flicker': {
          '0%': { opacity: '0.97' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.98' },
        },
      },
      // 陰影 - 柔和光暈
      boxShadow: {
        'glow-green': '0 0 6px rgba(74, 222, 128, 0.3), 0 0 12px rgba(74, 222, 128, 0.15)',
        'glow-green-lg': '0 0 10px rgba(74, 222, 128, 0.4), 0 0 20px rgba(74, 222, 128, 0.2)',
      },
      // 背景
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(74, 222, 128, 0.03) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(74, 222, 128, 0.03) 1px, transparent 1px)`,
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      // 排版
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.cp-dark.800'),
            a: {
              color: theme('colors.cp-green.500'),
              '&:hover': {
                color: theme('colors.cp-green.400'),
              },
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        // 深色模式排版
        invert: {
          css: {
            color: theme('colors.cp-dark.800'),
            a: {
              color: theme('colors.cp-green.500'),
              '&:hover': {
                color: theme('colors.cp-green.400'),
                textShadow: '0 0 6px rgba(74, 222, 128, 0.3)',
              },
            },
            strong: {
              color: theme('colors.cp-green.400'),
            },
            h1: {
              color: theme('colors.cp-green.500'),
            },
            h2: {
              color: theme('colors.cp-green.500'),
            },
            h3: {
              color: theme('colors.cp-green.400'),
            },
            h4: {
              color: theme('colors.cp-green.400'),
            },
            code: {
              color: theme('colors.cp-green.400'),
              backgroundColor: theme('colors.cp-dark.200'),
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },
            pre: {
              backgroundColor: theme('colors.cp-dark.100'),
              border: `1px solid ${theme('colors.cp-dark.400')}`,
            },
            blockquote: {
              borderLeftColor: theme('colors.cp-green.600'),
              color: theme('colors.cp-dark.700'),
            },
            hr: {
              borderColor: theme('colors.cp-dark.400'),
            },
            'ul > li::marker': {
              color: theme('colors.cp-green.500'),
            },
            'ol > li::marker': {
              color: theme('colors.cp-green.500'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
