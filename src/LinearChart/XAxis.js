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
	}

	render() {
		const {
			width, height, padding,
			xScale, yScale
		} = this.props

		const [startX, endX] = [padding.left, width - padding.right]
		const [startY, endY] = [height - padding.bottom, padding.top]

		const xTicks = xScale.ticks()

		return (
			<g className="axis axis-x">
				<line
					stroke="#bbbbbb"
					strokeWidth="2"
					x1={startX} y1={yScale(0)}
					x2={endX} y2={yScale(0)}
				/>
				{xTicks.map((x) => (
					<g key={x}
						transform={`translate(${xScale(x)}, ${Math.max(startY, endY)})`}
					>
						<line
							stroke="#bbbbbb"
							x1="0" y1="0" x2="0" y2="5"
						/>
						<text y="10">{x}</text>
					</g>
				))}
			</g>
		)
	}

}
