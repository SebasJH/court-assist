/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx,scss}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',     // je $primary-color
                secondary: '#64748b',   // je $secondary-color
                accent: '#f59e0b',      // je $accent-color
                success: '#10b981',     // je $success-color
                error: '#ef4444',       // je $error-color
            },
        },
    },
    plugins: [],
}
