import ImmutablePropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"
import React from "react"

class Bar extends React.Component {

	static propTypes = {
		xScale: PropTypes.func,
		yScale: PropTypes.func,

		index: PropTypes.number,
		pointList: ImmutablePropTypes.list.isRequired,
		type: PropTypes.string,
		typeIndex: PropTypes.number,
		typeCount: PropTypes.number,
		barWidth: PropTypes.number,
		color: PropTypes.string,
	}

	getPointList = () => {
		return this.props.pointList
			.sort((pointA, pointB) => {
				if (pointA.get("x") < pointB.get("x")) return -1
				if (pointA.get("x") > pointB.get("x")) return 1
				return 0
			})
	}

	render() {
		const {
			xScale, yScale,
			typeIndex, typeCount, barWidth, color,
		} = this.props

		return (
			<g>
				{this.getPointList().map((point) => {
					const height = yScale(point.get("y")) - yScale(0)
					return (
						<rect key={point.get("x")}
							fill={color}
							width={barWidth / typeCount} height={Math.abs(height)}
							x={xScale(point.get("x")) - barWidth / 2 + barWidth / typeCount * typeIndex}
							y={height < 0 ? yScale(point.get("y")) : yScale(0)}
						/>
					)
				})}
			</g>
		)
	}

}

export default Bar
