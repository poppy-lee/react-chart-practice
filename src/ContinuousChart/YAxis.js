import PropTypes from "prop-types"
import React from "react"

import humanize from "../lib/humanize"

export default
class YAxis extends React.Component {

	static propTpyes = {
		width: PropTypes.number,
		height: PropTypes.number,
		padding: PropTypes.object,
		xScale: PropTypes.func,
		yScale: PropTypes.func,
		y1Scale: PropTypes.func,

		axisIndex: PropTypes.number,
		axisCount: PropTypes.number,
		ticks: PropTypes.number,
		tickValues: PropTypes.array,
		tickPrefix: PropTypes.string,
		tickPostfix: PropTypes.string,
	}

	getScales = () => {
		const {axisIndex, xScale, yScale, y1Scale} = this.props
		switch (axisIndex) {
			case 0: return {xScale, yScale}
			case 1: return {xScale, yScale: y1Scale}
		}
		return {xScale, yScale}
	}

	render() {
		const {ticks, tickValues} = this.props
		const {yScale} = this.getScales()
		const yTicks = tickValues || yScale.ticks(Number.isFinite(ticks) ? ticks : 10)
		return (
			<g className="axis axis-y">
				{yTicks.map(this.renderTick)}
			</g>
		)
	}

	renderTick = (y) => {
		const {
			width, height, padding,
			axisIndex, axisCount, tickPrefix, tickPostfix,
		} = this.props

		const {xScale, yScale} = this.getScales()
		const x1 = axisCount <= 1
			? padding.left
			: (!axisIndex ? padding.left : width - padding.right - 5)
		const x2 = axisCount <= 1
			? width - padding.right
			: (!axisIndex ? padding.left + 5 : width - padding.right)

		return (
			<g key={y}
				className="tick tick-y"
				transform={`translate(0, ${yScale(y)})`}
			>
				<line stroke="#bbbbbb" x1={x1} y1="0" x2={x2} y2="0" />
				<text
					x={!axisIndex ? padding.left - 5 : width - padding.right + 5} y="3"
					textAnchor={!axisIndex ? "end" : "start"}
				>
					{y < 0 && "-"}{tickPrefix}{humanize(Math.abs(y))}{tickPostfix}
				</text>
			</g>
		)
	}

}
