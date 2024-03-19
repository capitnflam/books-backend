/** @type {import("eslint").Linter.Config} */
// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  root: true,
  extends: [
    'plugin:@flaminc/recommended',
    'plugin:@flaminc/node',
    'plugin:@flaminc/vitest',
  ],
  parserOptions: {
    project: './tsconfig.lint.json',
  },
  rules: {
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-top-level-await': 'off',
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'unicorn/prefer-module': 'off',
      },
    },
  ],
}
