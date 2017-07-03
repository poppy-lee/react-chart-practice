import PropTypes from "prop-types"
import React from "react"

class YAxis extends React.Component {

	static propTpyes = {
		width: PropTypes.number,
		height: PropTypes.number,
		padding: PropTypes.object,
		xScale: PropTypes.func,
		yScale: PropTypes.func,
	}

	render() {
		const {
			width, height, padding,
			xScale, yScale
		} = this.props

		const [startX, endX] = [padding.left, width - padding.right]
		const [startY, endY] = [height - padding.bottom, padding.top]

		const yTicks = yScale.ticks(6)

		return (
			<g className="axis axis-y">
				<line
					stroke="#bbbbbb"
					strokeWidth="2"
					x1={Math.min(startX, endX)} y1={startY}
					x2={Math.min(startX, endX)} y2={endY}
				/>
				{yTicks.map((y) => (
					<g key={y}
						transform={`translate(0, ${yScale(y)})`}
					>
						<line
							stroke="#bbbbbb"
							x1={Math.min(startX, endX) - 5} y1="0" x2={Math.max(startX, endX)} y2="0"
						/>
						<text
							x={Math.min(startX, endX) - 10}
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
