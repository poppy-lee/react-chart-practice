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

// import D3Root from "./OldChart/D3Root"
// import {
// 	ScaleLinear,
// 	XAxis as OldXAxis, YAxis as OldYAxis, Line as OldLine,
// 	Sensor as OldSensor, Focus as OldFocus, Tooltip as OldTooltip,
// } from "./OldChart/Linear"

const LENGTH = 10000

const width = 700
const height = 360
const padding = "30px 30px 40px 50px"

ReactDOM.render(
	<div>
		<h1>dev</h1>
		<LinearChart width={width} height={height} padding={padding}>
			<YAxis />
			<XAxis />
			<Bar pointList={generatePointList(LENGTH)} />
			<Bar pointList={generatePointList(LENGTH)} />
			<Line pointList={generatePointList(LENGTH)} lineWidth={1} />
			<Line pointList={generatePointList(LENGTH)} lineWidth={1} />
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
				y: 0.1 < Math.random()
					? length * Math.random()
					: null
			})
		})
		.filter((point) => Number.isFinite(point.get("y")))
}

// const dataList = [
// 	{color: "#3baeda", name: "y1", points: generatePointList(LENGTH).toJS()},
// 	{color: "#8cc054", name: "y2", points: generatePointList(LENGTH).toJS()},
// 	{color: "#f6bb43", name: "y3", points: generatePointList(LENGTH).toJS()},
// 	{color: "#f66043", name: "y4", points: generatePointList(LENGTH).toJS()},
// ]

// <h1>old 1</h1>
// <D3Root width={width} height={height} padding={padding}>
// 	<ScaleLinear dataList={dataList}>
// 		<OldYAxis />
// 		<OldXAxis />
// 		{dataList.map((data, index) => <OldLine key={index} data={data} />)}
// 		<OldSensor>
// 			<OldFocus />
// 			<OldTooltip />
// 		</OldSensor>
// 	</ScaleLinear>
// </D3Root>
