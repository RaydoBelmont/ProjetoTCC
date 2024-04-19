import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation:{
        'fade-in': 'fadeIn 0.6s ease-out'
      },
      formControl: {
        base: 'border border-gray-300 rounded px-3 py-2 w-full mb-4',
      },
      
      keyframes:{
        fadeIn: {
          '0%': {opacity: '0'},
          '100%': {opacity: '1'},
        }
      }
    },
  },
  plugins: [],
};
export default config;
