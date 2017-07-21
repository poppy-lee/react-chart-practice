import ImmutablePropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"
import React from "react"

export default
class Bar extends React.Component {

	static propTypes = {
		xScale: PropTypes.func,
		yScale: PropTypes.func,

		chartIndex: PropTypes.number,
		type: PropTypes.string,
		typeIndex: PropTypes.number,
		typeCount: PropTypes.number,
		bandWidth: PropTypes.number,
		pointList: ImmutablePropTypes.list.isRequired,

		name: PropTypes.string,
		color: PropTypes.string,
		barPadding: PropTypes.number,
	}

	getPointList = () => {
		return this.props.pointList
			.filter((point) => Number.isFinite(point.get("y")))
			.sort((pointA, pointB) => {
				if (pointA.get("x") < pointB.get("x")) return -1
				if (pointA.get("x") > pointB.get("x")) return 1
				return 0
			})
	}

	render() {
		const {
			xScale, yScale,
			typeIndex, typeCount, bandWidth, color,
		} = this.props

		const barPadding = bandWidth * (this.props.barPadding || 0)
		const barWidth = Math.max(
			1 / (window.devicePixelRatio || 1),
			(bandWidth / typeCount) - 2 * barPadding,
		)

		return (
			<g>
				{this.getPointList()
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
