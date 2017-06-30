import Immutable from "immutable"
import React from "react"
import ReactDOM from "react-dom"

import Chart from "./chart/Chart"
import YAxis from "./chart/YAxis"
import XAxis from "./chart/XAxis"
import Line from "./chart/Line"
import Sensor from "./chart/Sensor"
import Focus from "./chart/Focus"
import Tooltip from "./chart/Tooltip"

function generatePointList(length) {
	return Immutable.List([...Array(length)])
		.map((undef, index) => {
			return Immutable.Map({
				x: index,
				y: 0.1 < Math.random()
					? (0.5 < Math.random() ? 1 : -1) * length * Math.random()
					: null
			})
		})
}

ReactDOM.render(
	<Chart width={700} height={360} padding="30px 50px">
		<YAxis />
		<XAxis />
		<Line name="first" pointList={generatePointList(100)} color="#3baeda" />
		<Line pointList={generatePointList(100)} color="#8cc054" />
		<Line pointList={generatePointList(100)} color="#f6bb43" />
		<Sensor>
			<Focus />
			<Tooltip />
		</Sensor>
	</Chart>,
	document.querySelector("#app")
)
