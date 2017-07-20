import "./Tooltip.css"

import PropTypes from "prop-types"
import React from "react"

import numeral from "numeral"

function format(number) {
	switch (typeof number) {
		case "number":
			return numeral(number).format("0,0.[00]")
	}
}

export default
class Tooltip extends React.Component {

	static propTypes = {
		width: PropTypes.number,
		height: PropTypes.number,
		padding: PropTypes.object,
		xScale: PropTypes.func,
		yScale: PropTypes.func,

		sticky: PropTypes.bool,
		mouseX: PropTypes.number,
		mouseY: PropTypes.number,
		x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		ys: PropTypes.arrayOf(
			PropTypes.shape({
				color: PropTypes.string,
				type: PropTypes.string,
				x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			})
		),
	}

	padding = 10
	lineCounts = 10
	lineHeight = 18

	componentDidMount() {
		this.updateTooltipPosition()
	}

	componentDidUpdate() {
		this.updateTooltipPosition()
	}

	render() {
		const {sticky, x, ys} = this.props
		const shouldRenderEtc = !!ys.slice(this.lineCounts).length
		return (
			<g ref="tooltip" className="tooltip">
				<rect ref="tooltip-bg" rx="5" ry="5" fill="black" opacity="0.75" />
				{!sticky && <text x={this.padding} y={this.padding}>{x}</text>}
				{ys.slice(0, this.lineCounts - shouldRenderEtc).map(this.renderLine)}
				{shouldRenderEtc && (
					this.renderLine({
						color: "none",
						name: `그 외 ${ys.length - 9}개`,
						y: ys.slice(9).reduce((y, point) => y + (point.y || 0), 0)
					}, 9)
				)}
			</g>
		)
	}

	renderLine = ({color, name, x, y}, index) => {
		const contentX = this.padding
		const contentY = this.padding + this.lineHeight * (index + 1)
		return (
			<g key={index} transform={`translate(${contentX}, ${contentY})`}>
				<circle r="5" cx="2.5" cy="6" stroke="none" fill={color} />
				<text className="name" x="13">{name}</text>
				<text className="value" textAnchor="end">{format(y)}</text>
			</g>
		)
	}

	updateTooltipPosition = () => {
		const {
			width, height, padding,
			mouseX, mouseY
		} = this.props

		const tooltip = this.refs["tooltip"]
		const tooltipBg = this.refs["tooltip-bg"]
		const tooltipNames = tooltip.querySelectorAll(".name")
		const tooltipValues = tooltip.querySelectorAll(".value")

		tooltipBg.setAttribute("width", 0)
		tooltipBg.setAttribute("height", 0)
		tooltipNames.forEach((node) => wrapText(node, 90))

		const maxNameLength = Math.max(...[...tooltipNames].map((node) => node.getComputedTextLength()))
		const maxValueLength = Math.max(...[...tooltipValues].map((node) => node.getComputedTextLength()))
		this.maxValueX = Math.max((this.maxValueX || 0), 150, 13 + maxNameLength + 10 + maxValueLength)
		tooltipValues.forEach((node) => node.setAttribute("x", this.maxValueX))

		const {top, right, bottom, left} = tooltip.getBoundingClientRect()
		const bgWidth = right - left + 20
		const bgHeight = bottom - top + 20
		tooltipBg.setAttribute("width", bgWidth)
		tooltipBg.setAttribute("height", bgHeight)

		const tooltipX = mouseX + ((mouseX < (width + padding.left - padding.right) / 2) ? 20 : - 20 - bgWidth)
		const tooltipY = Math.max(0, Math.min(mouseY - bgHeight / 2, height - bgHeight))
		tooltip.setAttribute("transform", `translate(${tooltipX}, ${tooltipY})`)
	}

}

function wrapText(node, maxTextLength) {
	if (node.getComputedTextLength) {
		let text = node.innerHTML
		let textLength = node.getComputedTextLength()
		while (text.length && 90 < textLength) {
			node.innerHTML = (text = text.slice(0, -1)) + "…"
			textLength = node.getComputedTextLength()
		}
	}
}
