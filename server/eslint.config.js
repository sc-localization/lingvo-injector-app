import globals from "globals";
import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      "prettier/prettier": "error",
      "no-unused-vars": "warn",
    },
  },
];
