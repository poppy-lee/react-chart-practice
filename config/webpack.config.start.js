"use strict"

const path = require("path")

const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
	entry: [
		path.resolve("src/index.js")
	],
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
          presets: [["env", {"modules": false}], "react", "stage-0"]
        },
			},
			{
        test: /\.css$/,
        use: [
          {loader: "style-loader"},
          {loader: "css-loader"},
        ]
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
		stats: {
			colors: true,
			timings: true, version: true,
			errors: true, warnings: true,
			assets: true, modules: false,
			cached: true, cachedAssets: false,
			chunks: false, chunkModules: false, chunkOrigins: false,
			usedExports: false,
		},
	},
}
