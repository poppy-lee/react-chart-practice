import PropTypes from "prop-types"
import React from "react"

import numeral from "numeral"

function humanize(number) {
	switch (typeof number) {
		case "number": {
			if (!number || 1e-2 <= Math.abs(number) && Math.abs(number) < 1e+15)
				return numeral(number).format("0,.[00]a").toUpperCase()
			else {
				const [fraction, exponent] = numeral(number).format("0.[00]e+0").split("e")
				const [fixedFraction, fixedExponent] = numeral(fraction).format("0.[00]e+0").split("e")
				return (
					<tspan>
						{numeral(fixedFraction).format("0.00")}
						x10<tspan fontSize="8" baselineShift="super">{Number(exponent) + Number(fixedExponent)}</tspan>
					</tspan>
				)
			}
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
