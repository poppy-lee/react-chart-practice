import Immutable from "immutable"
import React from "react"
import ReactDOM from "react-dom"

import {
	LinearChart,
		XAxis, YAxis,
		Bar, Line,
		Sensor,
			Focus, Tooltip
} from "./LinearChart"

window.onresize = (() => render())
render()

function render() {
	const margin = parseMargin(window.getComputedStyle(document.body).margin)
	const width = (window.innerWidth || 0) - (margin.left + margin.right)
	const height = (window.innerHeight || 0) - (margin.top + margin.bottom)
	const padding = "30px 30px 40px 50px"

	ReactDOM.render(
		<div style={{fontSize: 0}}>
			<LinearChart
				width={width} height={height} padding={padding}
				colorArray={[
					"#3baeda", "#8cc054", "#f6bb43", "#f66043", "#8679c5",
					"#bfbfbf", "#235ef6", "#fa40a5", "#04a222", "#615d74",
				]}
			>
				<YAxis />
				<XAxis />
				{[...Array(4)]
					.map(() => generatePointList(1000))
					.map((pointList, index) => {
						const Component = index % 2 ? Line : Bar
						const name = index % 2 ? "Line" : "Bar"
						return <Component key={index} name={name} pointList={pointList} />
					})
				}
				<Sensor>
					<Focus />
					<Tooltip />
				</Sensor>
			</LinearChart>
		</div>,
		document.querySelector("#app")
	)
}

function generatePointList(length) {
	return Immutable.List([...Array(Math.abs(length) + 1)])
		.map((undef, index) => {
			const x = index - length / 2
			const y = (x * x * x * 1e+300) * Math.random()
			return Immutable.Map({x, y})
		})
}

function parseMargin(margin = "") {
	const [top, right, bottom, left] = margin.split(" ")
	return {
		top: parseFloat(top || 0 ),
		right: parseFloat(right || top || 0),
		bottom: parseFloat(bottom || top || 0),
		left: parseFloat(left || right || top || 0),
	}
}
