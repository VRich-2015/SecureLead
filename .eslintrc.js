module.exports = {
  root: true,
  extends: ['next', 'next/core-web-vitals'],
  rules: {
    'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
  },
};
