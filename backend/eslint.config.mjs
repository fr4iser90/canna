import eslintPluginImport from "eslint-plugin-import";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import eslintPluginPrettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: ["node_modules/**"],
  },
  {
    languageOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
    plugins: {
      import: eslintPluginImport,
      "unused-imports": eslintPluginUnusedImports,
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
      indent: ["error", 2],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "no-unused-vars": "warn",
      "unused-imports/no-unused-imports": "error",
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/namespace": "error",
      "import/default": "error",
      "import/export": "error",
    },
  },
  prettierConfig,
];
