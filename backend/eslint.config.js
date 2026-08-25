const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: ['node_modules/**', 'coverage/**'],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // Express error middleware must accept (err, req, res, next)
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^next$',
          caughtErrors: 'none',
        },
      ],
      'no-console': 'off',
    },
  },
];
