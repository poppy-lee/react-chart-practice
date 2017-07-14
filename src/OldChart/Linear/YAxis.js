import * as d3 from "d3"

import React from "react"
import PropTypes from "prop-types"

import D3Component from "../D3Component"

class XAxis extends D3Component {

	static propTypes = {
		svg: PropTypes.object,
		width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		padding: PropTypes.object,

		domains: PropTypes.object,
		scales: PropTypes.object,

		tickFormat: PropTypes.func,
		tickValues: PropTypes.array,
		ticks: PropTypes.number,
	}

	draw = () => {
		const {
			svg, width, height, padding, domains, scales,
			label, tickFormat, tickValues, ticks = 5,
		} = this.props

		const {allY} = domains
		const {yScale} = scales

		const yAxis = d3.axisLeft(yScale)
			.tickFormat(tickFormat || ((y) => y))
			.tickSizeInner(-(width - (padding.left + padding.right)))
			.tickSizeOuter(0)
			.tickPadding(6)
			.tickValues(allY.length ? tickValues : null)
			.ticks(ticks)

		svg.append("g")
			.attr("class", "axis axis--y")
			.attr("transform", `translate(${padding.left}, 0)`)
			.call((g) => {
				g.call(yAxis)
				g.select("path").remove()

				g.append("text")
					.text(label)
					.attr("transform", "rotate(270)")
					.attr("x", -height / 2)
					.attr("y", -55)
					.attr("fill", "#434343")
					.attr("font-size", 12)
					.attr("text-anchor", "middle")
					.attr("dominant-baseline", "hanging")
			})
	}

}

export default XAxis
