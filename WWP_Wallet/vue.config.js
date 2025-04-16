const { defineConfig } = require('@vue/cli-service');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = defineConfig({
	transpileDependencies: true,
	publicPath: '',

	pluginOptions: {
		cordovaPath: 'src-cordova'
	},

	devServer: {
		// allowedHosts: 'auto',
		historyApiFallback: true
	},

	// filenameHashing: false, // 파일명 해싱 안함.
	productionSourceMap: false, // 프로덕션 빌드 소스맵 생성 안함.

	chainWebpack: config => {
		config.optimization.delete('splitChunks');
		config.module
			.rule('md')
			.test(/\.md?$/)
			.use('raw-loader')
			.loader('raw-loader')
			.end();
	},
	configureWebpack: config => {
		if (process.env.NODE_ENV == 'development') {
			config.devtool = 'source-map';
		}
		config.plugins = [
			...config.plugins, // this is important !
			new NodePolyfillPlugin({ excludeAliases: [process.env.NODE_ENV == 'development' ? '' : 'console'] })
		];
		config.optimization = {
			runtimeChunk: true,
			splitChunks: false,
			minimize: true,
			minimizer: [
				new TerserPlugin({
					parallel: true,
					terserOptions: {
						ecma: 6,
						compress: { drop_console: true },
						output: { comments: false }
					}
				})
			]
		};
	}
});
