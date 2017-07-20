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

const LENGTH = 20

const width = 700
const height = 360
const padding = "30px 30px 40px 50px"

ReactDOM.render(
	<div>
		<LinearChart
			width={width} height={height} padding={padding}
			colorArray={[
				"#3baeda", "#8cc054", "#f6bb43", "#f66043", "#8679c5",
				"#bfbfbf", "#235ef6", "#fa40a5", "#04a222", "#615d74",
			]}
		>
			<YAxis />
			<XAxis />
			{[...Array(11)]
				.map(() => generatePointList(LENGTH))
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

function generatePointList(length) {
	return Immutable.List([...Array(length + 1)])
		.map((undef, index) => {
			const x = index - length / 2
			const y = Math.log(x)
			return Immutable.Map({x, y})
		})
}
