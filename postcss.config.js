module.exports = {
  plugins: Object.assign({
    "tailwindcss": {},
    "autoprefixer": {},
  }, (process.env.NODE_ENV === "production") ? {
    cssnano: {
      "preset": ["default", {"discardComments": {"removeAll": true}}]
    }
  } : {})
};
