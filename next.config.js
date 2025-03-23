// next.config.js
module.exports = {
  basePath: "/blogging",
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  output: "export", // Указываем, что проект будет статическим
};
