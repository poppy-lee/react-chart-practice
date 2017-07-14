import * as d3 from "d3"

import React from "react"
import PropTypes from "prop-types"

import D3Component from "../D3Component"

class Focus extends D3Component {

	static propTypes = {
		svg: PropTypes.object,
		width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		padding: PropTypes.object,

		scales: PropTypes.object,

		hover: PropTypes.bool,
		registerEventListener: PropTypes.func,
	}

	componentWillUpdate(nextProps) {
		const {svg} = nextProps
		svg.select(".focus").remove()
	}

	draw = () => {
		const {
			svg, height, padding, scales,
			hover, registerEventListener,
		} = this.props

		if (!hover) return

		const focus = svg.append("g")
			.attr("class", "focus")
		focus.append("line")
			.attr("class", "focus-x")
			.style("stroke-dasharray", "3, 3")
			.attr("y1", padding.top)
			.attr("y2", height - padding.bottom)

		registerEventListener("mousemove", this.setPosition)
	}

	setPosition = ({x, yPoints}) => {
		const {svg, scales} = this.props

		const {xScale, yScale} = scales

		yPoints = yPoints.filter(({hide, y}) => !hide && isFinite(y))

		const focus = svg.select(".focus")

		focus.style("display", yPoints.length ? null : "none")

		focus.attr("transform", `translate(${xScale(x)}, 0)`)
		focus.selectAll(".focus-y").remove()
		focus.selectAll(".focus-y")
			.data(yPoints).enter()
			.append("circle")
				.attr("class", "focus-y")
				.attr("r", 5)
				.attr("cy", point => yScale(point.y))
				.attr("fill", point => point.color)
	}

}

export default Focus
