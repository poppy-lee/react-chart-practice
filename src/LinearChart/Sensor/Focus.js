import ImmutablePropTypes from "react-immutable-proptypes"
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

		sticky: PropTypes.bool,
		mouseX: PropTypes.number,
		mouseY: PropTypes.number,
		x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		ys: PropTypes.arrayOf(
			PropTypes.shape({
				color: PropTypes.string,
				type: PropTypes.string,
				x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			})
		),
	}

	render() {
		const {
			width, height, padding, xScale, yScale,
			sticky, mouseX, mouseY, x, ys
		} = this.props

		return (
			<g style={{pointerEvents: "none"}}>
				{!sticky && (
					<line
						stroke="#777777"
						strokeDasharray="3,3"
						x1={xScale(x)} y1={padding.top}
						x2={xScale(x)} y2={height - padding.bottom}
					/>
				)}
				{ys
					//.filter(({type}) => type === "Line")
					.filter(({y}) => Number.isFinite(y))
					.map(({color, x, y}, index) => (
						<circle key={index}
							r="4"
							cx={xScale(x)} cy={yScale(y)}
							stroke="#ffffff"
							fill={color}
						/>
					))
				}
			</g>
		)
	}

}
