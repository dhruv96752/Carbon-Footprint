/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Verdant brand palette — leaf greens + warm amber + earthy ink
        leaf: {
          50: '#f1fcf1',
          100: '#dff6df',
          200: '#bdecbd',
          300: '#8fd993',
          400: '#58bd61',
          500: '#2fa039',
          600: '#1f8128',
          700: '#1c6623',
          800: '#1b5121',
          900: '#18431e',
          950: '#07260c',
        },
        amber2: {
          50: '#fff8eb',
          100: '#ffedc6',
          200: '#ffd988',
          300: '#ffbf4a',
          400: '#ffa31f',
          500: '#f97a07',
          600: '#dc5602',
          700: '#b73a06',
          800: '#942e0c',
          900: '#7a280d',
        },
        earth: {
          50: '#f7f6f3',
          100: '#edebe4',
          200: '#dad6c8',
          300: '#bdb6a0',
          400: '#9b927a',
          500: '#7e7560',
          600: '#645c4b',
          700: '#504a3d',
          800: '#403b32',
          900: '#2a2722',
          950: '#181612',
        },
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(31, 129, 40, 0.08), 0 4px 24px -8px rgba(31, 129, 40, 0.12)',
        lift: '0 12px 40px -12px rgba(31, 129, 40, 0.25), 0 4px 12px -4px rgba(0,0,0,0.08)',
        glow: '0 0 0 1px rgba(47, 160, 57, 0.1), 0 8px 30px -6px rgba(47, 160, 57, 0.35)',
        amber: '0 8px 30px -8px rgba(249, 122, 7, 0.45)',
      },
      backgroundImage: {
        'mesh-light':
          'radial-gradient(at 12% 8%, rgba(88,189,97,0.20) 0px, transparent 50%), radial-gradient(at 88% 12%, rgba(255,163,31,0.14) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(31,129,40,0.12) 0px, transparent 50%)',
        'mesh-dark':
          'radial-gradient(at 12% 8%, rgba(31,129,40,0.22) 0px, transparent 50%), radial-gradient(at 88% 12%, rgba(249,122,7,0.10) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(88,189,97,0.10) 0px, transparent 50%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        grow: {
          '0%': { transform: 'scale(0.85)', opacity: '0.4' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4,0,0.2,1) infinite',
        sway: 'sway 5s ease-in-out infinite',
        grow: 'grow 0.8s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
};
