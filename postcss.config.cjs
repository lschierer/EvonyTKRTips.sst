module.exports = {
  plugins: [
    require("autoprefixer"),
    require("postcss-import"),
    require("postcss-varfallback"),
    require("postcss-dropunusedvars"),
    require("cssnano"),
  ],
};