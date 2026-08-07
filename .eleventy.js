const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  const md = markdownIt({ html: true });
  const defaultImageRule = md.renderer.rules.image;
  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    token.attrSet("loading", "lazy");
    token.attrSet("decoding", "async");
    return defaultImageRule(tokens, idx, options, env, self);
  };
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPassthroughCopy("site/css");
  eleventyConfig.addPassthroughCopy("site/img");
  eleventyConfig.addPassthroughCopy("site/js");
  eleventyConfig.addPassthroughCopy({ "site/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "site/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "site/llms.txt": "llms.txt" });
  eleventyConfig.addPassthroughCopy({
    "site/blog/posts/remote-event-storming-assets": "blog/remote-event-storming",
  });

  eleventyConfig.addCollection("post", function (collectionApi) {
    return collectionApi.getFilteredByTag("post").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addFilter("readableDate", function (dateObj) {
    return dateObj.toISOString().slice(0, 10);
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
