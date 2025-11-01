const isVitest = Boolean(process.env.VITEST);

export default {
  plugins: isVitest ? [] : ["@tailwindcss/postcss"],
};
