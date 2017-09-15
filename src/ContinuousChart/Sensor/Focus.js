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

		sticky: PropTypes.bool,
		mouseX: PropTypes.number,
		mouseY: PropTypes.number,
		x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		ys: PropTypes.arrayOf(
			PropTypes.shape({
				color: PropTypes.string,
				x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				axisIndex: PropTypes.number,
			})
		),
	}

	getScales = () => {
		const {axisIndex, xScale, yScale, y1Scale} = this.props
		switch (axisIndex) {
			case 0: return {xScale, yScale}
			case 1: return {xScale, yScale: y1Scale}
		}
		return {xScale, yScale}
	}

	render() {
		const {
			width, height, padding,
			sticky, mouseX, mouseY, x, ys
		} = this.props
		const {xScale, yScale} = this.getScales()

		return (
			<g className="focus">
				{!sticky && (
					<line
						stroke="#777777"
						strokeDasharray="3,3"
						x1={xScale(x)} y1={padding.top}
						x2={xScale(x)} y2={height - padding.bottom}
					/>
				)}
				{ys
					.filter(({y}) => Number.isFinite(y))
					.map((point, index) => {
						const {
							axisIndex, type, typeCount, typeIndex, bandWidth,
							color, x: pointX, y: pointY,
						} = point
						return (
							<circle key={index}
								r="4"
								cx={xScale(pointX || x)}
								cy={yScale(pointY)}
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
