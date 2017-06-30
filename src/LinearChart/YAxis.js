import PropTypes from "prop-types"
import React from "react"

class YAxis extends React.Component {

	static propTpyes = {
		width: PropTypes.number,
		height: PropTypes.number,
		padding: PropTypes.object,
		lineProps: PropTypes.array,
		xScale: PropTypes.func,
		yScale: PropTypes.func,
	}

	render() {
		const {xScale, yScale} = this.props

		const [x1, x2] = xScale.range()
		const [y1, y2] = yScale.range()
		const yTicks = yScale.ticks(6)

		return (
			<g className="axis axis-y">
				<line
					stroke="#bbbbbb"
					x1={Math.min(x1, x2)} y1={y1}
					x2={Math.min(x1, x2)} y2={y2}
				/>
				{yTicks.map((y) => (
					<g key={y}>
						<line
							stroke="#bbbbbb"
							x1={Math.min(x1, x2) - 5} y1={yScale(y)}
							x2={Math.max(x1, x2)} y2={yScale(y)}
						/>
						<text
							x={Math.min(x1, x2) - 5}
							y={yScale(y)}
							textAnchor="end"
							dominantBaseline="middle"
						>
							{y}
						</text>
					</g>
				))}
			</g>
		)
	}

}

export default YAxis
