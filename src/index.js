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
				y: 0.5 < Math.random()
					? (0.5 < Math.random() ? 1 : -1) * length * Math.random()
					: null
			})
		})
		.filter((point) => point.get("y"))
}

ReactDOM.render(
	<LinearChart width={700} height={360} padding="30px 30px 40px 50px">
		<YAxis />
		<XAxis />
		<Bar pointList={generatePointList(10)} />
		<Bar pointList={generatePointList(10)} />
		<Line pointList={generatePointList(10)} />
		<Line pointList={generatePointList(50)} />
		<Sensor>
			<Focus />
			<Tooltip />
		</Sensor>
	</LinearChart>,
	document.querySelector("#app")
)
