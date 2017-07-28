import PropTypes from "prop-types"
import React from "react"

export default
class XAxis extends React.Component {

	static propTpyes = {
		width: PropTypes.number,
		height: PropTypes.number,
		padding: PropTypes.object,
		xScale: PropTypes.func,
		yScale: PropTypes.func,

		ticks: PropTypes.number,
		tickFormat: PropTypes.func,
	}

	render() {
		const {width, padding, xScale, yScale, ticks} = this.props
		const xTicks = xScale.ticks(Number.isFinite(ticks) ? ticks : 10)
		return (
			<g className="axis axis-x">
				<line stroke="#bbbbbb" strokeWidth="2"
					x1={padding.left} y1={yScale(0)}
					x2={width - padding.right} y2={yScale(0)}
				/>
				{xTicks.map(this.renderTick)}
			</g>
		)
	}

	renderTick = (x) => {
		const {height, padding, xScale, tickFormat} = this.props
		return (
			<g key={x}
				className="tick tick-x"
				transform={`translate(${xScale(x)}, ${height - padding.bottom})`}
			>
				<line stroke="#bbbbbb" x1="0" y1="0" x2="0" y2="5" />
				<text y="18">
					{typeof tickFormat === "function" ? tickFormat(x) : x}
				</text>
			</g>
		)
	}

}
