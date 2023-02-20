const autoprefixer = require('autoprefixer');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');




module.exports = {

	mode: 'development',
	devtool: 'eval-source-map',
	stats: 'normal',
	context: path.resolve(__dirname, '../src/'),
	entry: {
		main: './assets/javascript/esm.entry.js'
	},
	output: {
		filename: 'assets/javascript/[name].dev.js',
		path: path.resolve(__dirname, '../src/'),
		publicPath: '/',
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
								corejs: 3,
								modules : false,
								useBuiltIns: 'usage',
							},
						],
					],
				},
			},
			{
				test: /\.(scss|sass|css)$/,
				use: [
					miniCssExtractPlugin.loader,
					{ loader: 'css-loader' },
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									[
										autoprefixer({
											remove: false,
										}),
										postcssPresetEnv({}),
									],
								],
							},
							sourceMap: true,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {},
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.(woff2|woff|ttf)$/,
				type: 'asset/inline',
			},
		]
	},




	plugins: [
		new miniCssExtractPlugin({
			filename: 'assets/styles/main.dev.css',
		}),
	],

};
