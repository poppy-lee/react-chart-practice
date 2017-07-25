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

		index: PropTypes.number,
		ticks: PropTypes.number,
		tickPrefix: PropTypes.string,
		tickPostfix: PropTypes.string,
	}

	render() {
		const {xScale, yScale, ticks} = this.props
		const yTicks = yScale.ticks(Number.isFinite(ticks) ? ticks : 10)
		return (
			<g className="axis axis-y">
				{yTicks.map(this.renderTick)}
			</g>
		)
	}

	renderTick = (y) => {
		const {
			width, height, padding, xScale, yScale,
			index, tickPrefix, tickPostfix,
		} = this.props

		return (
			<g key={y} transform={`translate(0, ${yScale(y)})`} >
				<line stroke="#bbbbbb"
					x1={padding.left} y1="0"
					x2={width - padding.right} y2="0"
				/>
				<text
					x={!index ? padding.left - 5 : width - padding.right + 5}
					textAnchor={!index ? "end" : "start"}
				>
					{y < 0 && "-"}{tickPrefix}{humanize(Math.abs(y))}{tickPostfix}
				</text>
			</g>
		)
	}

}
