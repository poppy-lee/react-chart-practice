import PropTypes from "prop-types"
import React from "react"

import numeral from "numeral"

function humanize(number) {
	switch (typeof number) {
		case "number": {
			if (Math.abs(number) < 1000)
				return numeral(number).format("0.[0]a")
			return numeral(number).format("0.[0]a").toUpperCase()
		}
	}
}

export default
class YAxis extends React.Component {

	static propTpyes = {
		width: PropTypes.number,
		height: PropTypes.number,
		padding: PropTypes.object,
		xScale: PropTypes.func,
		yScale: PropTypes.func,

		tickPrefix: PropTypes.string,
		tickPostfix: PropTypes.string,
	}

	render() {
		const {
			width, height, padding, xScale, yScale,
			tickPrefix, tickPostfix,
		} = this.props

		const [startX, endX] = [padding.left, width - padding.right]
		const [startY, endY] = [height - padding.bottom, padding.top]

		const yTicks = yScale.ticks(6)

		return (
			<g className="axis axis-y">
				{yTicks.map((y) => (
					<g key={y}
						transform={`translate(0, ${yScale(y)})`}
					>
						<line
							stroke="#bbbbbb"
							x1={Math.min(startX, endX)} y1="0"
							x2={Math.max(startX, endX)} y2="0"
						/>
						<text x={Math.min(startX, endX) - 5}>
							{tickPrefix}{humanize(y)}{tickPostfix}
						</text>
					</g>
				))}
			</g>
		)
	}

}
