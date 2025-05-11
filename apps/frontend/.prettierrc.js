const vercelPrettierConfig = require("@vercel/style-guide/prettier");

module.exports = {
  singleQuote: false,
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    ...vercelPrettierConfig.plugins,
  ],

  importOrder: [
    "^react",
    "^next",
    "^node",
    "<TYPES>^(react|next|node)",
    "<TYPES>",
    "<BUILTIN_MODULES>",
    "<THIRD_PARTY_MODULES>",
    "^(@shared|@screens|@entities)(/.*)$",
    "<TYPES>^(@shared|@screens|@entities)(/.*)$",
    "^[.]",
    "<TYPES>^[.]",
  ],
  importOrderParserPlugins: ["typescript", "jsx"],
  importOrderTypeScriptVersion: "5.0.0",
  tabWidth: 2,
};
