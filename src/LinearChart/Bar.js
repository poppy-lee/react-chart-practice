import ImmutablePropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"
import React from "react"

export default
class Bar extends React.Component {

	static propTypes = {
		xScale: PropTypes.func,
		yScale: PropTypes.func,
		y1Scale: PropTypes.func,

		pointList: ImmutablePropTypes.list.isRequired,
		name: PropTypes.string,
		color: PropTypes.string,
		barPadding: PropTypes.number,

		bandWidth: PropTypes.number,
		axix: PropTypes.string,
		axisIndex: PropTypes.number,
		axisCount: PropTypes.number,
		type: PropTypes.string,
		typeIndex: PropTypes.number,
		typeCount: PropTypes.number,
	}

	getScales = () => {
		const {axisIndex, xScale, yScale, y1Scale} = this.props
		switch (axisIndex) {
			case 0: return {xScale, yScale}
			case 1: return {xScale, yScale: y1Scale}
		}
	}

	render() {
		const {color, bandWidth, axisIndex, typeIndex, typeCount,} = this.props
		const {xScale, yScale} = this.getScales()

		const barPadding = bandWidth * (this.props.barPadding || 0)
		const barWidth = Math.max(
			1 / (window.devicePixelRatio || 1),
			(bandWidth / typeCount) - 2 * barPadding,
		)

		return (
			<g>
				{this.props.pointList
					.map((point) => {
						const height = yScale(point.get("y")) - yScale(0)
						return (
							<rect key={point.get("x")}
								fill={color}
								width={barWidth}
								height={Math.abs(height)}
								x={(xScale(point.get("x")) - bandWidth / 2) + (bandWidth / typeCount * typeIndex) + barPadding}
								y={height < 0 ? yScale(point.get("y")) : yScale(0)}
							/>
						)
					})
				}
			</g>
		)
	}

}
