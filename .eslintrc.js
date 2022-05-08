// to use airbnb-base
// npx install-peerdeps --dev eslint-config-airbnb-base

module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
    "prettier",
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  // parserOptions: {
  //   project: "./tsconfig.json",
  //   ecmaVersion: 2018,
  //   sourceType: "module",
  // },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'linebreak-style': 0,
    'import/prefer-default-export': 0,
    'prettier/prettier': 0,
    'import/extensions': 0,
    'no-use-before-define': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0, // 테스트 또는 개발환경을 구성하는 파일에서는 devDependency 사용을 허용
    'no-shadow': 0,
    'react/prop-types': 0,
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'jsx-a11y/no-noninteractive-element-interactions': 0,
  },
  ignorePatterns: ["dist/", "node_modules/"],
};
