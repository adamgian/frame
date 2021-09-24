const autoprefixer = require('autoprefixer');
const ChunksWebpackPlugin = require('chunks-webpack-plugin');
const cssnano = require('cssnano');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');




// ES5 bundle
// Creates polyfilled ES5 JS
const es5 = {

	mode: 'production',
	stats: 'normal',
	context: path.resolve(__dirname, '../src/'),
	entry: {
		main: './assets/javascript/main-es5.js'
	},
	output: {
		filename: 'assets/javascript/es5/[name].min.js',
		path: path.resolve(__dirname, '../src/'),
		publicPath: '/',
	},




	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: false,
				parallel: true,
				terserOptions: {
					format: {
						comments: false
					},
				},
			}),
		],
	},




	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					ignore: [ /\/core-js/ ],
					sourceType: 'unambiguous',
					presets: [
						[
							'@babel/preset-env',
							{
								corejs: 3,
								useBuiltIns: 'usage',
							}
						]
					],
				},
			},
			{
				test: /\.(scss|sass|css)$/,
				use: 'ignore-loader',
			},
			{
				test: /\.(woff2|woff|ttf)$/,
				loader: 'ignore-loader',
			},
		]
	},

};


// ESM bundle
// Creates ESM JS + minified CSS
const esm = {

	mode: 'production',
	stats: 'verbose',
	context: path.resolve(__dirname, '../src/'),
	entry: {
		main: './assets/javascript/main-esm.js',
		'service-worker': {
			import: './assets/javascript/components/service-worker.js',
			filename: 'service-worker.js',
		},
	},
	output: {
		// Leave CDN (ie. Netlify) to handle cache invalidation
		// If not possible you can do something like:
		// 'assets/javascript/esm/[name]-[contenthash:8].min.js'
		filename: 'assets/javascript/esm/[name].min.js',
		path: path.resolve(__dirname, '../src/'),
		publicPath: '/',
	},




	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: false,
				parallel: true,
				terserOptions: {
					compress: true,
					ecma: 8,
					format: {
						comments: false,
					},
					safari10: true,
				},
			}),
		],
	},




	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					ignore: [/\/core-js/],
					sourceType: 'unambiguous',
					presets: [
						[
							'@babel/preset-env',
							{
								targets: {
									esmodules: true,
								},
							},
						],
					],
				},
			},
			{
				test: /\.scss$/,
				use: [
					miniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							url: false,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									[
										autoprefixer({
											remove: false,
										}),
										cssnano({
											preset: ['default'],
										}),
										postcssPresetEnv({}),
									],
								],
							},
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.(woff2|woff|ttf)$/,
				loader: 'ignore-loader',
			},
		],
	},




	plugins: [
		new miniCssExtractPlugin({
			// Leave CDN (ie. Netlify) to handle cache invalidation
			// If not possible you can do something like:
			// 'assets/styles/main-[contenthash:8].min.css'
			filename: 'assets/styles/main.min.css',
		}),
		new ChunksWebpackPlugin({
			customFormatTags: (chunksSorted, Entrypoint) => {
				const styles = chunksSorted.styles
					.map((chunkCSS) => `<link rel="stylesheet" href="${chunkCSS}">`)
					.join('');

				const scripts = chunksSorted.scripts
					.map((chunkJS) => `
						<script>
							var script = document.createElement('script');
							script.src = (!('noModule' in script))
								? "${chunkJS.replace('assets/javascript/esm', 'assets/javascript/es5')}"
								: "${chunkJS}";
							script.defer = true;
							document.head.appendChild(script);
						</script>
					`)
					.join('');

				return { styles, scripts };
			},
			filename: '_includes/partials/[name]-[type].temp.html',
		}),
		new webpack.DefinePlugin({
			VERSION: JSON.stringify(process.env.npm_package_version),
		}),
	],

};


module.exports = [es5, esm];
