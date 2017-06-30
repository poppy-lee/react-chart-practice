import PropTypes from "prop-types"
import React from "react"

class XAxis extends React.Component {

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
		const xTicks = xScale.ticks(6)

		return (
			<g className="axis axis-x">
				<line
					stroke="#333"
					x1={x1} y1={yScale(0)}
					x2={x2} y2={yScale(0)}
				/>
				{xTicks.map((x) => (
					<g key={x}>
						<line
							stroke="#333"
							x1={xScale(x)} y1={Math.max(y1, y2)}
							x2={xScale(x)} y2={Math.max(y1, y2) + 5}
						/>
						<text
							x={xScale(x)}
							y={Math.max(y1, y2) + 5}
							textAnchor="middle"
							dominantBaseline="text-before-edge"
						>
							{x}
						</text>
					</g>
				))}
			</g>
		)
	}

}

export default XAxis
