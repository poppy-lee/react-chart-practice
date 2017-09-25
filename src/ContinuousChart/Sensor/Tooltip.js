import PropTypes from "prop-types"
import React from "react"

import format from "../../lib/format"

export default
class Tooltip extends React.Component {

	static propTypes = {
		width: PropTypes.number,
		height: PropTypes.number,
		padding: PropTypes.object,
		xFormat: PropTypes.func,

		mouseX: PropTypes.number,
		mouseY: PropTypes.number,
		x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		points: PropTypes.arrayOf(
			PropTypes.shape({
				color: PropTypes.string,
				name: PropTypes.string,
				x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				y0: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				y1: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				yPrefix: PropTypes.string,
				yPostfix: PropTypes.string,
			})
		),
	}

	padding = 10
	textY = 9
	lineCounts = 10
	lineHeight = 18

	componentDidMount() {
		this.updateTooltipPosition()
	}

	componentDidUpdate() {
		this.updateTooltipPosition()
	}

	render() {
		const {x, points} = this.props
		const xFormat = this.props.xFormat || ((x) => x)
		const shouldRenderEtc = !!points.slice(this.lineCounts).length
		return (
			<g ref="tooltip" className="tooltip">
				<rect ref="tooltip-bg" rx="5" ry="5" fill="black" opacity="0.75" />
				<text x={this.padding} y={this.padding + this.textY}>
					{xFormat(x)}
				</text>
				{points.slice(0, this.lineCounts - shouldRenderEtc).map(this.renderLine)}
				{shouldRenderEtc && (
					this.renderLine({
						color: "none",
						name: `그 외 ${points.length - 9}개`,
						y: points.slice(9).reduce((y, point) => y + (point.y || 0), 0)
					}, 9)
				)}
			</g>
		)
	}

	renderLine = ({color, name, x, y0, y1, yPrefix, yPostfix}, index) => {
		const isNumber = Number.isFinite(y1 - y0)
		const contentX = this.padding
		const contentY = this.padding + this.lineHeight * (index + 1)
		return (
			<g key={index} transform={`translate(${contentX}, ${contentY})`}>
				<circle r="5" cx="2.5" cy="6" stroke="none" fill={color} />
				<text className="name" x="13" y={this.textY}>{name}</text>
				<text className="value" y={this.textY} textAnchor="end">
					{(y1 - y0) < 0 && "-"}
					{isNumber && yPrefix}
					{format(Math.abs(y1 - y0))}
					{isNumber && yPostfix}
				</text>
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

		tooltipBg.setAttribute("display", "none")
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
		tooltipBg.removeAttribute("display")

		const tooltipX = mouseX + ((mouseX < (width + padding.left - padding.right) / 2) ? 20 : - 20 - bgWidth)
		const tooltipY = Math.max(0, Math.min(mouseY - bgHeight / 2, height - bgHeight))
		tooltip.setAttribute("transform", `translate(${tooltipX}, ${tooltipY})`)
	}

}

function wrapText(node, maxTextLength) {
	if (node.getComputedTextLength) {
		let text = node.innerHTML || ""
		let textLength = node.getComputedTextLength()
		while (text.length && 90 < textLength) {
			node.innerHTML = (text = text.slice(0, -1)) + "…"
			textLength = node.getComputedTextLength()
		}
	}
}
