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

	const margin = parseMargin(window.getComputedStyle(document.body))
	const width = (window.innerWidth || 0) - (margin.left + margin.right)
	const height = (window.innerHeight || 0) - (margin.top + margin.bottom)
	const padding = "30px 60px 40px"

	ReactDOM.render(
		<div style={{fontSize: 0}}>
			<LinearChart
				width={width} height={height} padding={padding}
				colors={[
					"#3baeda", "#8cc054", "#f6bb43", "#f66043", "#8679c5",
					"#bfbfbf", "#235ef6", "#fa40a5", "#04a222", "#615d74",
				]}
			>
				<YAxis name="dollars" tickPrefix="$" />
				<YAxis name="percent" tickPostfix="%" />
				<XAxis ticks={10} tickFormat={(x) => `x=${x}`} />
				<Bar points={generatePoints(10, -1)} />
				<Bar points={generatePoints(20)} />
				<Bar points={generatePoints(30)} />
				<Line axis="percent" points={generatePoints(40)} />
				<Line axis="percent" points={generatePoints(50)} />
				<Sensor>
					<Focus />
					<Tooltip />
				</Sensor>
			</LinearChart>
		</div>,
		document.querySelector("#app")
	)
}

function generatePoints(length, sign = 1) {
	return [...Array(Math.abs(length) + 1)]
		.map((undef, index) => ({
			x: index - length / 2,
			y: (0.1 < Math.random())
				? Math.sign(sign) * length * Math.random()
				: null ,
		}))
}

function parseMargin({margin, marginTop, marginRight, marginBottom, marginLeft}) {
	const [top, right, bottom, left] = margin.split(" ")
	return {
		top: parseFloat(marginTop || top || 0 ),
		right: parseFloat(marginRight || right || top || 0),
		bottom: parseFloat(marginBottom || bottom || top || 0),
		left: parseFloat(marginLeft || left || right || top || 0),
	}
}
