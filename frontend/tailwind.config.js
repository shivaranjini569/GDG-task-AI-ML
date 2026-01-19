module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f172a',
        secondary: '#1e293b',
        accent: '#0ea5e9',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['dark'],
  },
};
