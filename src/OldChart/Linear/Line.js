import * as d3 from "d3"

import React from "react"
import PropTypes from "prop-types"

import D3Component from "../D3Component"

class Line extends D3Component {

	static propTypes = {
		svg: PropTypes.object,
		scales: PropTypes.object,

		data: PropTypes.shape({
			hide: PropTypes.bool,
			color: PropTypes.string,
			gradient: PropTypes.bool,

			name: PropTypes.string,
			points: PropTypes.arrayOf(
				PropTypes.shape({
					x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
					y0: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
					y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				})
			)
		}),
	}

	draw = () => {
		const {svg, scales, data} = this.props

		const {xScale, yScale} = scales

		const lineGenerator = d3.line()
			.x(point => xScale(point.x))
			.y(point => yScale(point.y))

		const line = svg.append("g")
			.attr("class", "line")

		if (!data.points.length) return
		if (data.hide) return
		if (data.gradient) {
			this.appendGradient(line)
		}

		line.append("path")
			.datum(data.points)
			.attr("d", lineGenerator)
			.attr("stroke", data.color)
			.attr("stroke-width", "2.5px")
			.attr("fill", "none")

		if (data.points.length <= 1) {
			const {x, y} = data.points[0]

			line.append("circle")
				.attr("r", 4)
				.attr("cx", xScale(x))
				.attr("cy", yScale(y))
				.style("stroke", "none")
				.style("fill", data.color)
		}
	}

	appendGradient = (parent) => {
		const {scales, data} = this.props

		const {xScale, yScale} = scales

		const id = `gradient-${data.color.replace(/\s|#|\(|\)|,/g, "-")}`

		const areaGenerator = d3.area()
			.x(point => xScale(point.x))
			.y0(point => yScale(point.y0 || 0))
			.y1(point => yScale(point.y))

		const offsetMiddle = (yScale(0) - yScale.range()[1]) / (yScale.range()[0] - yScale.range()[1]) * 100
		const stops = [
			{ color: data.color, opacity: .3,  offset: "0%" },
			{ color: data.color, opacity: .03, offset: `${offsetMiddle}%` },
			{ color: data.color, opacity: .3,  offset: "100%" },
		]
		const linearGradient = parent.append("linearGradient")
			.attr("id", id)
			.attr("gradientUnits", "userSpaceOnUse")
			.attr("x1", 0).attr("y1", yScale.range()[1])
			.attr("x2", 0).attr("y2", yScale.range()[0])
		linearGradient.selectAll("stop")
			.data(stops).enter()
			.append("stop")
				.attr("offset", stop => stop.offset)
				.attr("stop-color", stop => stop.color)
				.attr("stop-opacity", stop => stop.opacity)

		parent.append("path")
			.datum(data.points).attr("d", areaGenerator)
			.attr("class", "area")
			.attr("fill", `url(#${id})`)
			.attr("stroke", "none")
	}

}

export default Line
