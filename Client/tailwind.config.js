/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                appear: {
                    "from": {
                        opacity: 0,
                        transform: "translateY(10px)"
                    },
                    "to": {
                        opacity: 1,
                        transform: "translateY(0px)"
                    }
                },

                loader: {
                    "from": {
                        opacity: 0.3,
                        transform: "translateY(10px)"
                    },
                    "to": {
                        opacity: 1,
                        transform: "translateY(0px)"
                    }
                }
            },
            animation: {
                'animate-appear': 'appear 0.5s ease-in-out',
                'animate-disappear': 'appear 0.5s ease-in-out reverse',
                'bounce-once': 'bounce 1s ease-in-out infinite 2s',
                'loader-animation': 'loader 1s linear infinite alternate'
            },
            colors: {
                "primary-color": "var(--primary-color)",
                "secondary-color": "var(--secondary-color)",
                "maroon": "var(--maroon)",
                "beige": "var(--beige)",
            },
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
                lato: ["Lato", "sans-serif"],
                heading: ["Fajalla One", "sans-serif"],
            }
        },
    },
    plugins: [],
}