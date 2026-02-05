// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    settings: {
      "import/resolver": {
        node: {
          paths: ["."],
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
          moduleDirectory: ["node_modules", "."],
        },
        alias: {
          map: [["@", "."]],
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      },
    },
  },
]);
