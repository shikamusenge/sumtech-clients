/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Added for class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'primary-lighter': 'var(--primary-lighter)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        accent: 'var(--accent)', // Now references the CSS variable (blue in light theme)
        'accent-dark': '#1d4ed8', // Tailwind's blue-700 for a darker shade of blue
      },
    },
  },
  plugins: [],
}
