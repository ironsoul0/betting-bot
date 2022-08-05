module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    node: true,
  },
  plugins: ["import", "simple-import-sort"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "prettier/prettier": ["error", {}, { usePrettierrc: true }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "@typescript-eslint/no-var-requires": "off",
    "jsx-a11y/no-static-element-interactions": "off",
  },
};
