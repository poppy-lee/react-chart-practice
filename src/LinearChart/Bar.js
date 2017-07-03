import ImmutablePropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"
import React from "react"

class Bar extends React.Component {

	static propTypes = {
		width: PropTypes.number,
		height: PropTypes.number,
		padding: PropTypes.object,
		barProps: PropTypes.array,
		xScale: PropTypes.func,
		yScale: PropTypes.func,

		pointList: ImmutablePropTypes.list.isRequired,
		color: PropTypes.string,
	}

	static defaultProps = {
		color: "#333333",
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
			barProps,
			xScale, yScale,
			color,
		} = this.props

		const width = xScale.bandwidth ? xScale.bandwidth() : 5

		return (
			<g>
				{this.getPointList().map((point) => {
					const height = yScale(point.get("y")) - yScale(0)
					return (
						<rect key={point.get("x")}
							fill={color}
							width={width} height={Math.abs(height)}
							x={xScale(point.get("x"))}
							y={height < 0 ? yScale(point.get("y")) : yScale(0)}
						/>
					)
				})}
			</g>
		)
	}

}

export default Bar
