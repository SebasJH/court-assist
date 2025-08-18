/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx,scss}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
                    light: 'rgb(var(--color-primary-light) / <alpha-value>)',
                    dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
                },
                secondary: {
                    DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
                    light: 'rgb(var(--color-secondary-light) / <alpha-value>)',
                    dark: 'rgb(var(--color-secondary-dark) / <alpha-value>)',
                },
                tertiary: {
                    DEFAULT: 'rgb(var(--color-tertiary) / <alpha-value>)',
                    light: 'rgb(var(--color-tertiary-light) / <alpha-value>)',
                    dark: 'rgb(var(--color-tertiary-dark) / <alpha-value>)',
                },
                accent: 'rgb(var(--color-accent) / <alpha-value>)',

                // keep existing semantic colors if used elsewhere
                success: 'rgb(var(--color-success) / <alpha-value>)',
                error: 'rgb(var(--color-error) / <alpha-value>)',
            },
        },
    },
    plugins: [],
}
