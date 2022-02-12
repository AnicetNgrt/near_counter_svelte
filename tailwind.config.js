const colors = require('tailwindcss/colors')

module.exports = {
    content: [
        "./src/**/*.{html,js,svelte}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Cabinet Grotesk', 'sans-serif'],
                'serif': ['Stardom', 'serif'],
                'mono': ['RX100', 'monospace']
            },
        },
        // colors: {
        //     primary: colors.stone,
        //     green: colors.green,
        //     negative: colors.red
        // }
    },
    plugins: [],
    mode: "jit"
}