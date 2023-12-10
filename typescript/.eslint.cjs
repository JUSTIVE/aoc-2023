module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',

  // prettier 추가
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // prettier 삭제
    // 'prettier'

    // plugin:prettier/recommended 추가
    'plugin:prettier/recommended',
  ],

  rules: {
    //prettier/prettier rule 추가
    'prettier/prettier': 'error',
    semi: 'error',
    '@typescript-eslint/no-unused-vars': 'error',
  },
};
