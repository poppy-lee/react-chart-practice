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
				axix: PropTypes.string,
				axisIndex: PropTypes.number,
				axisCount: PropTypes.number,
			})
		),
	}

	render() {
		const {
			width, height, padding, xScale, yScale, y1Scale,
			sticky, mouseX, mouseY, x, ys
		} = this.props

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
						const cx = xScale(pointX || x)
						const barX = (type === "Bar") ? (bandWidth / typeCount) * (typeIndex + 0.5) - bandWidth / 2 : 0
						return (
							<circle key={index}
								r="4"
								cx={cx + barX}
								cy={!axisIndex ? yScale(pointY) : y1Scale(pointY)}
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
