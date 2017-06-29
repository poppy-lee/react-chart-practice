import ImmutablePropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"
import React from "react"

class Focus extends React.Component {

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
		const {
			width, height, padding,
			xScale, yScale,
			x, ys
		} = this.props

		return this.couldRender() ? (
			<g style={{pointerEvents: "none"}}>
				<line
					stroke="#777"
					strokeDasharray="3,3"
					x1={xScale(x)} y1={padding.top}
					x2={xScale(x)} y2={height - padding.bottom}
				/>
				{ys.map(({color, y}, index) => (
					<circle key={index}
						r="5"
						cx={xScale(x)} cy={yScale(y)}
						fill={color}
					/>
				))}
			</g>
		) : null
	}

}

export default Focus
