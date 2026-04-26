import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  rules: {
    'node/prefer-global/process': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/block-order': ['error', {
      order: ['script', 'template', 'style'],
    }],
  },
  overrides: [
    {
      files: ['*.config.*', '**/stores/**/*.ts', '**/app/**/*.ts'],
      rules: {
        'node/prefer-global/process': 'off',
      },
    },
  ],
})
