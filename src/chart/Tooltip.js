import PropTypes from "prop-types"
import React from "react"

class Tooltip extends React.Component {

	static propTypes = {
		width: PropTypes.number,
		height: PropTypes.number,
		padding: PropTypes.object,
		xScale: PropTypes.func,
		yScale: PropTypes.func,

		mouseX: PropTypes.number,
		mouseY: PropTypes.number,
		x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		ys: PropTypes.arrayOf(
			PropTypes.shape({
				color: PropTypes.string,
				x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			})
		),
	}

	couldRender = () => {
		return this.props.ys
	}

	render() {
		const {mouseX, mouseY, x, ys} = this.props

		return this.couldRender() ? (
			<g
				transform={`translate(${mouseX}, ${mouseY})`}
				style={{
					pointerEvents: "none",
					// transition: "transform 0.15s ease-in-out",
				}}
			>
				<text x="10" y="20">x: {x}</text>
				{ys.map(({color, name, y}, index) => (
					<text key={index}
						x="10" y={20 * (index + 2)}
						fill={color}
					>
						{name}: {y}
					</text>
				))}
			</g>
		) : null
	}

}

export default Tooltip
