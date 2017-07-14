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

		label: PropTypes.string,
		tickFormat: PropTypes.func,
		tickValues: PropTypes.array,
		ticks: PropTypes.any,
	}

	draw = () => {
		const {
			svg, width, height, padding, domains, scales,
			label, tickFormat, tickValues, ticks,
		} = this.props

		const {allX} = domains
		const {xScale, yScale} = scales

		const xAxis = d3.axisBottom(xScale)
			.tickFormat(tickFormat || ((x) => x))
			.tickSizeOuter(0)
			.tickPadding(6)
			.tickValues(allX.length ? tickValues || (!ticks && allX.length <= 10 ? allX : null) : null)
			.ticks(ticks || 5)

		svg.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", `translate(0, ${height - padding.bottom})`)
			.call((g) => {
				g.call(xAxis)
				g.select("path").remove()

				g.append("line")
					.attr("x1", padding.left).attr("y1", yScale(0) - (height - padding.bottom))
					.attr("x2", width - padding.right).attr("y2", yScale(0) - (height - padding.bottom))
					.attr("stroke", "#67737e")
					.attr("stroke-width", "1.5px")

				g.append("text")
					.text(label)
					.attr("x", width / 2)
					.attr("y", 30)
					.attr("fill", "#434343")
					.attr("font-size", 12)
					.attr("text-anchor", "middle")
					.attr("dominant-baseline", "hanging")
			})
	}

}

export default XAxis
