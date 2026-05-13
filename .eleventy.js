module.exports = function (eleventyConfig) {
  // Pass styles.css straight through without processing
  eleventyConfig.addPassthroughCopy("src/styles.css");

  // Pass any future assets (images, fonts, etc.) through unchanged
  eleventyConfig.addPassthroughCopy("src/assets");

  // Pass images through unchanged
  eleventyConfig.addPassthroughCopy("src/images");

  return {
    dir: {
      input: "src",
      output: "_site",
      layouts: "_layouts",
    },
    // Allow HTML files to use Nunjucks templating
    htmlTemplateEngine: "njk",
  };
};
