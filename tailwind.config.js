/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        }
      },
      backdropBlur: {
        xs: '2px',
      },

      colors: {
        // Custom brand palette — 500 is the base. Higher = darker, lower = lighter.
        // Primary (Blue)
        blue: {
          50:  '#EBF2FE',
          100: '#D7E6FD',
          200: '#D7E6FD', // fallback to nearest
          300: '#75A7F8',
          400: '#75A7F8', // fallback to nearest
          500: '#3B82F6',
          600: '#2F68C4',
          700: '#2F68C4', // fallback to nearest
          800: '#173462',
          900: '#112749'
        },
        // Secondary (Green / Success)
        green: {
          50:  '#E7F8F2',
          100: '#CFF1E5',
          200: '#CFF1E5', // fallback to nearest
          300: '#57CEA6',
          400: '#57CEA6', // fallback to nearest
          500: '#10B981',
          600: '#0C9467',
          700: '#0C9467', // fallback to nearest
          800: '#064A33',
          900: '#043726'
        },
        // Accent / Warning (Orange)
        orange: {
          50:  '#FEF5E6',
          100: '#FDEBCE',
          200: '#FDEBCE', // fallback to nearest
          300: '#F8BB54',
          400: '#F8BB54', // fallback to nearest
          500: '#F59E0B',
          600: '#C47E08',
          700: '#C47E08', // fallback to nearest
          800: '#623F04',
          900: '#492F03'
        },
        // Map yellow to the Accent palette for compatibility with existing classes like text-yellow-500
        yellow: {
          50:  '#FEF5E6',
          100: '#FDEBCE',
          200: '#FDEBCE',
          300: '#F8BB54',
          400: '#F8BB54',
          500: '#F59E0B',
          600: '#C47E08',
          700: '#C47E08',
          800: '#623F04',
          900: '#492F03'
        },
        // Error (Red)
        red: {
          50:  '#FDECEC',
          100: '#FBD9D9',
          200: '#FBD9D9', // fallback to nearest
          300: '#F37C7C',
          400: '#F37C7C', // fallback to nearest
          500: '#EF4444',
          600: '#BF3636',
          700: '#BF3636', // fallback to nearest
          800: '#5F1B1B',
          900: '#471414'
        },
        // Neutral (Gray)
        gray: {
          50:  '#F2F2F2',
          100: '#D8D8D8',
          200: '#C5C5C5', // nieuw
          300: '#B2B2B2',
          400: '#999999', // nieuw
          500: '#7F7F7F',
          600: '#4C4C4C',
          700: '#333333', // nieuw
          800: '#191919',
          900: '#000000'
        },
        // Aliases — optional to use (bg-primary-500 etc.)
        primary: {
          50:  '#EBF2FE', 100: '#D7E6FD', 200: '#D7E6FD', 300: '#75A7F8', 400: '#75A7F8', 500: '#3B82F6', 600: '#2F68C4', 700: '#2F68C4', 800: '#173462', 900: '#112749'
        },
        secondary: {
          50:  '#E7F8F2', 100: '#CFF1E5', 200: '#CFF1E5', 300: '#57CEA6', 400: '#57CEA6', 500: '#10B981', 600: '#0C9467', 700: '#0C9467', 800: '#064A33', 900: '#043726'
        },
        accent: {
          50:  '#FEF5E6', 100: '#FDEBCE', 200: '#FDEBCE', 300: '#F8BB54', 400: '#F8BB54', 500: '#F59E0B', 600: '#C47E08', 700: '#C47E08', 800: '#623F04', 900: '#492F03'
        },
        error: {
          50:  '#FDECEC', 100: '#FBD9D9', 200: '#FBD9D9', 300: '#F37C7C', 400: '#F37C7C', 500: '#EF4444', 600: '#BF3636', 700: '#BF3636', 800: '#5F1B1B', 900: '#471414'
        },
        neutral: {
          50:  '#F2F2F2', 100: '#D8D8D8', 200: '#C5C5C5', 300: '#B2B2B2', 400: '#999999', 500: '#7F7F7F', 600: '#4C4C4C', 700: '#333333', 800: '#191919', 900: '#000000'
        }
      }
    },
  },
  plugins: [],
}
