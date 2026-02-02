export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'chore',
        'feat',
        'fix',
        'perf',
        'refactor',
        'docs',
        'ci',
        'style',
        'test',
        'revert',
      ],
    ],
    'scope-empty': [0, 'never'], // scope is optional
    'subject-case': [0], // disable subject case check for more flexibility
  },
};