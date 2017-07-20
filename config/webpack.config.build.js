"use strict"

const path = require("path")

const webpack = require("webpack")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
	entry: [
		path.resolve("src/index.js")
	],
	output: {
		filename: "dist.[name].[hash].js",
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
          presets: [["es2015", {"modules": false}], "react", "stage-0"]
        }
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
		new CleanWebpackPlugin(path.resolve("build"), {root: path.resolve("/")}),
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve("src/index.html"),
		}),
	],
}
