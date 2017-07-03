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
	return Immutable.List([...Array(length + 1)])
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
	<LinearChart width={700} height={360} padding="10px 30px 40px 50px">
		<YAxis />
		<XAxis />
		<Bar name="bar1" pointList={generatePointList(17)} color="#8cc054" />
		<Bar name="bar2" pointList={generatePointList(17)} color="#f66043" />
		<Line name="line1" pointList={generatePointList(17)} color="#3baeda" />
		<Line name="line2" pointList={generatePointList(50)} color="#f6bb43" />
		<Sensor>
			<Focus />
			<Tooltip />
		</Sensor>
	</LinearChart>,
	document.querySelector("#app")
)
