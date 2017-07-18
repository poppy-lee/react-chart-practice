import PropTypes from "prop-types"
import React from "react"

class Tooltip extends React.Component {

	static propTypes = {
		width: PropTypes.number,
		height: PropTypes.number,
		padding: PropTypes.object,
		xScale: PropTypes.func,
		yScale: PropTypes.func,

		sticky: PropTypes.bool,
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

	componentDidMount() {
		this.updateTooltipBg()
	}

	componentDidUpdate() {
		this.updateTooltipBg()
	}

	updateTooltipBg = () => {
		const tooltip = this.refs["tooltip"]
		const tooltipBg = this.refs["tooltip-bg"]

		tooltipBg.removeAttribute("width", 0)
		tooltipBg.removeAttribute("height", 0)

		const {top, right, bottom, left} = tooltip.getBoundingClientRect()
		const width = right - left + 20
		const height = bottom - top + 20

		tooltipBg.setAttribute("width", width)
		tooltipBg.setAttribute("height", height)
	}

	render() {
		const {sticky, mouseX, mouseY, x, ys} = this.props

		return (
			<g ref="tooltip"
				transform={`translate(${mouseX}, ${mouseY})`}
				style={{pointerEvents: "none"}}
			>
				<rect ref="tooltip-bg"
					x="10" y="0"
					rx="5" ry="5"
					fill="#ffffff"
					opacity="0.85"
				/>
				{!sticky && (
					<text
						x="20" y="10"
						dominantBaseline="hanging"
					>
						x: {x}
					</text>
				)}
				{ys.map(({color, name, x, y}, index) => (
					<text key={index}
						x="20" y={20 * (index + (!sticky ? 1 : 0)) + 10}
						dominantBaseline="hanging"
						fill={color}
					>
						{sticky && `x${index + 1}: ${x}, `}
						{name}: {y}
					</text>
				))}
			</g>
		)
	}

}

export default Tooltip
