module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ['plugin:vue/vue3-essential', 'eslint:recommended', 'plugin:prettier/recommended'],
	parserOptions: {
		parser: '@babel/eslint-parser'
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-unused-vars': 'off',
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				semi: true,
				useTabs: true,
				tabWidth: 2,
				trailingComma: 'none',
				printWidth: 140,
				bracketSpacing: true,
				arrowParens: 'avoid',
				endOfLine: 'auto'
			}
		]
	}
};
