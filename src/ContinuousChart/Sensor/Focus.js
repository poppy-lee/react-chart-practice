import PropTypes from "prop-types"
import React from "react"

export default
class Focus extends React.Component {

	static propTypes = {
		width: PropTypes.number,
		height: PropTypes.number,
		padding: PropTypes.object,
		xScale: PropTypes.func,
		yScale: PropTypes.func,
		y1Scale: PropTypes.func,

		mouseX: PropTypes.number,
		mouseY: PropTypes.number,
		x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		points: PropTypes.arrayOf(
			PropTypes.shape({
				color: PropTypes.string,
				x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				y0: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				y1: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				axisIndex: PropTypes.number,
			})
		),
	}

	getScales = (axisIndex) => {
		const {xScale, yScale, y1Scale} = this.props
		switch (axisIndex) {
			case 0: return {xScale, yScale}
			case 1: return {xScale, yScale: y1Scale}
		}
		return {xScale, yScale}
	}

	render() {
		const {
			width, height, padding, xScale,
			mouseX, mouseY, x, points
		} = this.props

		return (
			<g className="focus">
				<line
					stroke="#777777"
					strokeDasharray="3,3"
					x1={xScale(x)} y1={padding.top}
					x2={xScale(x)} y2={height - padding.bottom}
				/>
				{points
					.filter(({y1}) => Number.isFinite(y1))
					.map((point, index) => {
						const {color, axisIndex, x, y0, y1} = point
						const {xScale, yScale} = this.getScales(axisIndex)
						return (
							<circle key={index}
								r="4"
								cx={xScale(x) || xScale(this.props.x)}
								cy={yScale(y1)}
								stroke="#ffffff"
								fill={color}
							/>
						)
					})
				}
			</g>
		)
	}

}
