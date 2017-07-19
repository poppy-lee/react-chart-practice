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

const LENGTH = 30

const width = 700
const height = 360
const padding = "30px 30px 40px 50px"

ReactDOM.render(
	<div>
		<LinearChart width={width} height={height} padding={padding}>
			<YAxis />
			<XAxis />
			{[
				generatePointList(LENGTH), generatePointList(LENGTH),
				generatePointList(LENGTH), generatePointList(LENGTH),
			].map((pointList, index) => {
				const Component = index % 2 ? Line : Bar
				return <Component key={index} pointList={pointList} />
			})}
			<Line pointList={generatePointList(LENGTH)} />
			<Bar pointList={generatePointList(LENGTH)} />
			<Sensor>
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
				y: 0.01 < Math.random()
					? length * Math.random()
					: 0.5 < Math.random() ? 0 : null,
			})
		})
		.filter((point = Immutable.Map()) => {
			// allow null and number
			return !point.isEmpty() && isFinite(point.get("y"))
		})
}
