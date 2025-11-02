const isVitest = Boolean(process.env.VITEST);

const plugins = isVitest ? [] : ["@tailwindcss/postcss"];

const config = {
  plugins,
};

export default config;
