import PropTypes from "prop-types"
import React from "react"

import humanize from "./lib/humanize"

export default
class YAxis extends React.Component {

	static propTpyes = {
		width: PropTypes.number,
		height: PropTypes.number,
		padding: PropTypes.object,
		xScale: PropTypes.func,
		yScale: PropTypes.func,
		y1Scale: PropTypes.func,

		typeIndex: PropTypes.number,
		typeCount: PropTypes.number,
		ticks: PropTypes.number,
		tickPrefix: PropTypes.string,
		tickPostfix: PropTypes.string,
	}

	getScales = () => {
		const {typeIndex, xScale, yScale, y1Scale} = this.props
		switch (typeIndex) {
			case 0: return {xScale, yScale}
			case 1: return {xScale, yScale: y1Scale}
		}
		return {xScale, yScale}
	}

	render() {
		const {ticks} = this.props
		const {yScale} = this.getScales()
		const yTicks = yScale.ticks(Number.isFinite(ticks) ? ticks : 10)
		return (
			<g className="axis axis-y">
				{yTicks.map(this.renderTick)}
			</g>
		)
	}

	renderTick = (y) => {
		const {
			width, height, padding,
			typeIndex, typeCount, tickPrefix, tickPostfix,
		} = this.props

		const {xScale, yScale} = this.getScales()
		const x1 = typeCount <= 1
			? padding.left
			: (!typeIndex ? padding.left : width - padding.right - 5)
		const x2 = typeCount <= 1
			? width - padding.right
			: (!typeIndex ? padding.left + 5 : width - padding.right)

		return (
			<g key={y} transform={`translate(0, ${yScale(y)})`} >
				<line stroke="#bbbbbb" x1={x1} y1="0" x2={x2} y2="0" />
				<text
					x={!typeIndex ? padding.left - 5 : width - padding.right + 5} y="3"
					textAnchor={!typeIndex ? "end" : "start"}
				>
					{y < 0 && "-"}{tickPrefix}{humanize(Math.abs(y))}{tickPostfix}
				</text>
			</g>
		)
	}

}
