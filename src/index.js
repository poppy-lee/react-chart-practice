import React from "react"
import ReactDOM from "react-dom"

import {
	ContinuousChart,
		XAxis, YAxis,
		Area, Line,
		Sensor,
			Focus, Tooltip
} from "./ContinuousChart"

window.onresize = (() => render())
render()

function render() {

	const margin = parseMargin(window.getComputedStyle(document.body))
	const width = (window.innerWidth || 0) - (margin.left + margin.right)
	const height = (window.innerHeight || 0) - (margin.top + margin.bottom)
	const padding = "30px 60px 40px"

	ReactDOM.render(
		<div style={{fontSize: 0}}>
			<ContinuousChart
				width={width} height={height} padding={padding}
				colors={[
					"#3baeda", "#8cc054", "#f6bb43", "#f66043", "#8679c5",
					"#bfbfbf", "#235ef6", "#fa40a5", "#04a222", "#615d74",
				]}
			>
				<XAxis ticks={10} tickFormat={(x) => `x=${x}`} />
				<YAxis name="percent" tickPostfix="%" />
				<YAxis name="dollars" tickPrefix="$" />
				{/* <YAxis name="dollars" tickValues={[-50, 0, 50]} tickPrefix="$" /> */}

				<Line background name="default1" points={generatePoints(20, -1)} />
				<Line background name="default2" points={generatePoints(20, -1)} />
				<Line background name="default3" points={generatePoints(20, -1)} />

				<Line background axis="dollars" name="dollars"
					points={[...new Array(21)].map((undef, index) => ({x: index, y: index}))}
				/>

				<Area line axis="dollars" group="dollars-area" name="dollars1"
					points={[...new Array(21)].map((undef, index) => ({x: index, y: index / 3}))}
					points={generatePoints(20)}
				/>
				<Area line axis="dollars" group="dollars-area" name="dollars2"
					points={[...new Array(21)].map((undef, index) => ({x: index, y: index / 3}))}
					points={generatePoints(20)}
				/>
				<Area line axis="dollars" group="dollars-area" name="dollars3"
					points={[...new Array(21)].map((undef, index) => ({x: index, y: index / 3}))}
					points={generatePoints(20)}
				/>

				<Area line axis="percent" group name="percent1"
					points={[...new Array(21)].map((undef, index) => ({x: index, y: -index / 3}))}
				/>
				<Area line axis="percent" group name="percent2"
					points={[...new Array(21)].map((undef, index) => ({x: index, y: -index / 3}))}
				/>
				<Area line axis="percent" group name="percent3"
					points={[...new Array(21)].map((undef, index) => ({x: index, y: -index / 3}))}
				/>

				<Sensor>
					<Focus />
					<Tooltip />
				</Sensor>
			</ContinuousChart>
		</div>,
		document.querySelector("#app")
	)
}

function generatePoints(length, sign = 1) {
	return [...new Array(Math.abs(length) + 1)]
		.map((undef, index) => (
			(0.1 < Math.random())
			// (0.0 < Math.random())
			? {
				x: index - length / 2,
				// x: Math.random() * length,
				// y: Math.sign(sign) * length * Math.random(),
				y: (0.1 < Math.random())
					? Math.sign(sign) * length * Math.random()
					: null
					// : Math.sign(sign) * Infinity,
			}
			: null
		)
	)
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
