import * as d3 from "d3"

import React from "react"
import PropTypes from "prop-types"

import D3Component from "../D3Component"

class Tooltip extends D3Component {

	static propTypes = {
		root: PropTypes.object,
		width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		padding: PropTypes.object,

		domains: PropTypes.object,
		scales: PropTypes.object,

		registerEventListener: PropTypes.func,

		tooltipWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		total: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
		xTickFormat: PropTypes.func,
		yTickFormat: PropTypes.func,
	}

	static defaultProps = {
		xTickFormat: (x) => x,
		yTickFormat: (y) => y,
	}

	componentWillUpdate(nextProps) {
		const {root} = nextProps
		root.select(".tooltip").remove()
	}

	draw = () => {
		const {
			root,
			hover, registerEventListener,
			tooltipWidth,
		} = this.props

		if (!hover) return

		let tooltip = root.select(".tooltip")
		if (tooltip.empty()) {
			tooltip = root.append("div")
				.attr("class", "tooltip")
				.style("position", "absolute")
				.style("width", `${tooltipWidth || 250}px`)
				.style("pointer-events", "none")
		}

		tooltip.append("p").attr("class", "title")
		tooltip.append("ul")

		registerEventListener("mousemove", this.setPosition)
	}

	setPosition = ({mouseX, mouseY, x, yPoints}) => {
		const {
			root, width, height, padding, domains, scales,
			total, xTickFormat, yTickFormat,
		} = this.props

		const {allX} = domains
		const {xScale, yScale} = scales

		const tooltip = root.select(".tooltip")
		if (tooltip.empty()) return

		const duration = Math.max(200, Math.min(500, 3500 / allX.length))
		const useTransition = 35 < 3500 / allX.length

		yPoints = yPoints.filter(({hide, y}) => !hide && isFinite(y))

		const yPoints10 = yPoints.slice(0, 10)
		const yPointsEtc = yPoints.slice(10)

		yPoints = yPoints10.concat(yPointsEtc.length ? {
			color: "none",
			name: `외 ${yPointsEtc.length}개`,
			x, y: yPointsEtc.reduce((y, yPoint) => y + yPoint.y, 0)
		} : [])

		tooltip.style("display", yPoints.length ? null : "none")

		if (tooltip.style("transform") !== "none") {
			tooltip.style("transition", useTransition ? `transform ${duration}ms ease` : "none")
		}

		tooltip.select(".title").text(xTickFormat(x))

		tooltip.select("ul").remove()
		const ul = tooltip.append("ul")

		const li = ul.selectAll("li")
			.data(yPoints).enter()
			.append("li")
		li.append("div").attr("class", "circle")
			.style("background-color", ({color}) => color)
		li.append("span").attr("class", "name")
			.text(({name}) => name)
		li.append("span").attr("class", "value")
			.text(({y, y0 = 0}) => yTickFormat(y - y0))

		if (total) {
			ul.select(".total").remove()

			if (1 < yPoints.length) {
				const totalColor = total.color || "none"
				const totalName = total.name || "총합"
				const totalValue = yPoints.reduce((totalValue, {y, y0 = 0}) => totalValue + y - y0, 0)

				const liTotal = ul.append("li").attr("class", "total")
				liTotal.append("div").attr("class", "circle").style("background-color", totalColor)
				liTotal.append("span").attr("class", "name").text(totalName)
				liTotal.append("span").attr("class", "value").text(totalValue)
			}
		}

		const meanY = yPoints.reduce((prev, point) => prev + point.y, 0) / yPoints.length

		const tooltipWidth = parseFloat(tooltip.style("width"))
		const tooltipHeight = parseFloat(tooltip.style("height"))

		// xPosition에는 boundary 처리를 하지 않았다
		const xPosition = xScale(x) + (xScale(x) <= width / 2 ? 15 : -tooltipWidth - 15)
		let yPosition = (useTransition ? yScale(meanY) : mouseY) - tooltipHeight / 2
		yPosition = Math.max(Math.min(yPosition, height - tooltipHeight), 0)

		tooltip.style("transform", `translate3d(${xPosition}px, ${yPosition}px, 0)`)
	}

}

export default Tooltip
