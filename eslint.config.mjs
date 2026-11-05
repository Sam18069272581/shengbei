import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'unpackage/**', 'src/generated/**', 'node_modules/**'] },
  js.configs.recommended,
  ...vue.configs['flat/essential'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node, uni: 'readonly', getCurrentPages: 'readonly' },
    },
    rules: {
      // 规则：禁止空 catch 掩盖错误
      'no-empty': ['error', { allowEmptyCatch: false }],
      // uni-app 页面用目录名作组件名（index、result…），不适用多词组件名规则
      'vue/multi-word-component-names': 'off',
    },
  },
]
