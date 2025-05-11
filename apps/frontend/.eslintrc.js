const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    "@vercel/style-guide/eslint/node",
    "@vercel/style-guide/eslint/browser",
    "@vercel/style-guide/eslint/typescript",
    "@vercel/style-guide/eslint/react",
    "@vercel/style-guide/eslint/next",
  ].map(require.resolve),
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/", ".plop/"],
  // add rules configurations here
  rules: {
    "import/order": "off",
    "import/no-default-export": "off",
    "no-console": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "unicorn/filename-case": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "react/function-component-definition": [
      "error",
      { namedComponents: "arrow-function" },
    ],

    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@screens/[a-zA-Z]*/**"],
            message:
              "File not exposed from the module. Consider exporting it from an index",
          },
          {
            group: ["@screens/*"],
            message:
              "File not exposed from the module. Consider exporting it from an index",
          },
          // {
          //   group: ["@mantine/core/**"],
          //   message:
          //     "No need to use import from ui library - use alias instead - @ui",
          // },
          // {
          //   group: ["@mantine/core"],
          //   message:
          //     "No need to use import from ui library - use alias instead - @ui",
          // },
          {
            group: ["**/screens/**"],
            message:
              "No need to use relative imports, use aliases instead - @domains",
          },
          {
            group: ["**/shared/**"],
            message:
              "No need to use relative imports, use aliases instead - @shared",
          },
          {
            group: ["**/entities/**"],
            message:
              "No need to use relative imports, use aliases instead - @entities",
          },
          {
            group: ["**/features/**"],
            message:
              "No need to use relative imports, use aliases instead - @features",
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ["src/shared/uikit/**"],
      rules: { "no-restricted-imports": "off" },
    },
    {
      files: ["src/entities/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@entities/**"],
                message: "dont use another entities in entities",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["src/features/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@features/**"],
                message: "dont use another features in features",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["src/screens/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@screens/**"],
                message: "dont use another screen in screens",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["src/services/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@services/**"],
                message: "dont use another service in services",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["src/shared/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@shared/**"],
                message: "dont use any shared in shared",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["src/pages/**"],
      rules: { "no-restricted-imports": "off" },
    },
  ],
};
