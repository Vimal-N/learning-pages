module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/images");

  // When deploying to a subdirectory (e.g. GitHub Pages /learning-pages/),
  // set ELEVENTY_PATH_PREFIX=/learning-pages/ to rewrite all absolute paths.
  const prefix = (process.env.ELEVENTY_PATH_PREFIX || "").replace(/\/$/, "");
  if (prefix) {
    eleventyConfig.addTransform("prefix-abs-urls", function (content, outputPath) {
      if (!outputPath || !outputPath.endsWith(".html")) return content;
      return content.replace(/(href|src)="(\/[^"]*?)"/g, (_, attr, path) => {
        return `${attr}="${prefix}${path}"`;
      });
    });
  }

  return {
    dir: {
      input: "src",
      output: "_site",
      layouts: "_layouts",
    },
    htmlTemplateEngine: "njk",
  };
};
