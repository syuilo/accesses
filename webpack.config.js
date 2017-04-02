module.exports = {
	entry: './src/web/script.js',
	module: {
		rules: [
			{
				test: /\.tag$/,
				exclude: /node_modules/,
				loader: 'riot-tag-loader',
				query: {
					hot: false,
					style: 'stylus',
					expr: false,
					compact: true,
					parserOptions: {
						style: {
							compress: true
						}
					}
				}
			},
			{
				test: /\.styl$/,
				exclude: /node_modules/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader' },
					{ loader: 'stylus-loader' }
				]
			}
		]
	},
	output: {
		filename: 'script.js'
	}
};
