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
	<LinearChart width={700} height={360} padding="30px 50px">
		<YAxis />
		<XAxis />
		<Line name="first" pointList={generatePointList(100)} color="#3baeda" />
		<Bar pointList={generatePointList(100)} color="#8cc054" />
		<Line pointList={generatePointList(100)} color="#f6bb43" />
		<Sensor>
			<Focus />
			<Tooltip />
		</Sensor>
	</LinearChart>,
	document.querySelector("#app")
)
