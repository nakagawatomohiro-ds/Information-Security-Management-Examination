import type { Config } from "tailwindcss";

const config: Config = {
    content: [
          "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
          "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
          "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        ],
    theme: {
          extend: {
                  colors: {
                            brand: {
                                        50:"#f0f9f5",100:"#dbf0e5",200:"#b8e1cc",300:"#88cba8",
                                        400:"#55ae80",500:"#339366",600:"#247751",700:"#1d5f42",
                                        800:"#1a4d37",900:"#163f2e",950:"#0b231a",
                            },
                            primary: {
                                        50:"#f0f9f5",100:"#dbf0e5",200:"#b8e1cc",300:"#88cba8",
                                        400:"#55ae80",500:"#339366",600:"#247751",700:"#1d5f42",
                                        800:"#1a4d37",900:"#163f2e",
                            },
                            accent: {
                                        50:"#fefce8",100:"#fef9c3",200:"#fef08a",300:"#fde047",
                                        400:"#facc15",500:"#eab308",600:"#ca8a04",700:"#a16207",
                                        800:"#854d0e",900:"#713f12",
                            },
                  },
          },
    },
    plugins: [],
};

export default config;
