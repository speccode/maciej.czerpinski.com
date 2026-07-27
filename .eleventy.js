module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("site/css");
  eleventyConfig.addPassthroughCopy({ "site/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "site/robots.txt": "robots.txt" });

  eleventyConfig.addCollection("post", function (collectionApi) {
    return collectionApi.getFilteredByTag("post").sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "site",
      output: "docs",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
