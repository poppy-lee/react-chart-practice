import Immutable from "immutable"
import React from "react"
import ReactDOM from "react-dom"

import LinearChart from "./LinearChart/LinearChart"
import YAxis from "./LinearChart/YAxis"
import XAxis from "./LinearChart/XAxis"
import Line from "./LinearChart/Line"
import Bar from "./LinearChart/Bar"
import Sensor from "./LinearChart/Sensor"
import Focus from "./LinearChart/Focus"
import Tooltip from "./LinearChart/Tooltip"

const LENGTH = 20

const width = 700
const height = 360
const padding = "30px 30px 40px 50px"

ReactDOM.render(
	<div>
		<LinearChart width={width} height={height} padding={padding}>
			<YAxis />
			<XAxis />
			<Bar pointList={generatePointList(LENGTH)} />
			<Bar pointList={generatePointList(LENGTH)} />
			<Line pointList={generatePointList(LENGTH)} />
			<Line pointList={generatePointList(LENGTH)} />
			<Sensor sticky>
				<Focus />
				<Tooltip />
			</Sensor>
		</LinearChart>
	</div>,
	document.querySelector("#app")
)

function generatePointList(length) {
	return Immutable.List([...Array(length + 1)])
		.map((undef, index) => {
			return Immutable.Map({
				x: index,
				x: length * Math.random(),
				y: 0.1 < Math.random()
					? length * Math.random()
					: null,
				// y: 0.99 < Math.random()
				// 	? length * Math.random()
				// 	: null,
			})
		})
		.filter((point) => Number.isFinite(point.get("y")))
}
