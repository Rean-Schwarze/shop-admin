/* eslint-env node */
module.exports = {
  root: true,
  "env": {
    "node": true,
    "commonjs": true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/typescript/recommended'
  ],
  // "parser": "vue-eslint-parser",
  parserOptions: {
    sourceType:'module',
    ecmaVersion: 'latest',
    // parser: '@typescript-eslint/parser',
    "requireConfigFile": false,
  },
  plugins: ['vue','@typescript-eslint'],
  rules:{
    'vue/multi-word-component-names':0, // 不再强制要求组件命名
    '@typescript-eslint/no-unused-vars': 'error',
    // 允许非空断言
    '@typescript-eslint/no-non-null-assertion': 'off',
    // 允许自定义模块和命名空间
    '@typescript-eslint/no-namespace': 'off',
    // 允许对this设置alias
    '@typescript-eslint/no-this-alias': 'off',
    // 允许使用any类型
    '@typescript-eslint/no-explicit-any': ['off'],
  }
}
