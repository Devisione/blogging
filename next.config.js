// next.config.js
module.exports = {
  assetPrefix: './', // Это добавит относительный путь для статических файлов
  trailingSlash: true,

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  output: "export", // Указываем, что проект будет статическим
  distDir: "docs", // Папка, куда будет собран статический сайт
};
