"use strict"

const path = require("path")

const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
	mode: "production",
	entry: [
		"@babel/polyfill",
		path.resolve("src/index.js")
	],
	optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
	output: {
		filename: "dist.[name].js",
		path: path.resolve("build"),
		pathinfo: true,
		publicPath: "/",
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: path.resolve("src"),
				loader: "babel-loader",
				options: {
          presets: [
						"@babel/preset-env",
						"@babel/preset-stage-3",
						"@babel/preset-react",
					]
        },
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve("src/index.html"),
		}),
	],

	devtool: "source-map",
	devServer: {
		compress: true,
		disableHostCheck: true,
		host: "0.0.0.0",
		publicPath: "/",
		historyApiFallback: true,
	},
}
