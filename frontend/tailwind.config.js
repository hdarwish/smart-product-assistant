/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "hsla(245, 100%, 98%, 1)",
                    200: "hsla(245, 95%, 92%, 1)",
                    500: "hsla(252, 92%, 66%, 1)",
                    600: "hsla(256, 85%, 58%, 1)",
                    700: "hsla(257, 72%, 50%, 1)",
                },
                error: {
                    100: "#FEE2E2",
                    500: "#EF4444",
                    600: "#DC2626",
                },
                background: "#F3F4F6",
            },
        },
    },
    plugins: [],
};
