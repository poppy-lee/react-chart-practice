import PropTypes from "prop-types"
import React from "react"

class XAxis extends React.Component {

	static propTpyes = {
		width: PropTypes.number,
		height: PropTypes.number,
		padding: PropTypes.object,
		xScale: PropTypes.func,
		yScale: PropTypes.func,
	}

	getXTicks = (ticks = 7) => {
		return this.props.xScale.domain()
			.filter((x, index, xDomain) => {
				return !(index % Math.round(xDomain.length / ticks))
			})
	}

	render() {
		const {xScale, yScale} = this.props

		const [x1, x2] = xScale.range()
		const [y1, y2] = yScale.range()

		const xAlign = xScale.bandwidth() / 2
		const xTicks = this.getXTicks()

		return (
			<g className="axis axis-x">
				<line
					stroke="#bbbbbb"
					strokeWidth="2"
					x1={x1} y1={yScale(0)}
					x2={x2} y2={yScale(0)}
				/>
				{xTicks.map((x) => (
					<g key={x}>
						<line
							stroke="#bbbbbb"
							x1={xScale(x) + xAlign} y1={Math.max(y1, y2)}
							x2={xScale(x) + xAlign} y2={Math.max(y1, y2) + 5}
						/>
						<text
							x={xScale(x) + xAlign}
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
