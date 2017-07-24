import React from "react"
import numeral from "numeral"

export default
function format(number) {
	switch (typeof number) {
		case "number": {
			if (!Number.isFinite(number)) return number
			if (!number || 1e-2 <= Math.abs(number) && Math.abs(number) < 1e+15)
				return numeral(number).format("0,.[00]")
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
