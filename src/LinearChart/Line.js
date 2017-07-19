import * as d3 from "d3"

import Immutable from "immutable"
import ImmutablePropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"
import React from "react"

class Line extends React.Component {

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
		lineWidth: PropTypes.number,
	}

	static defaultProps = {
		lineWidth: 2.5,
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
		const {color, lineWidth} = this.props

		return (
			<g className="line">
				<path
					stroke={color}
					strokeWidth={lineWidth}
					fill="none"
					d={this.getDescription(this.getPointList())}
				/>
				{this.renderCircles()}
			</g>
		)
	}

	renderCircles = () => {
		const {
			xScale, yScale, index,
			color, lineWidth,
		} = this.props

		return this.getPointList()
			.filter((point, index, pointList) => (
				Number.isFinite(point.get("y")) && !(
					index
					&& Number.isFinite(pointList.getIn([index - 1, "y"]))
					&& Number.isFinite(pointList.getIn([index + 1, "y"]))
				)
			))
			.map((point, index) => (
				<circle key={index}
					fill={color}
					r={lineWidth}
					cx={xScale(point.get("x"))}
					cy={yScale(point.get("y"))}
				/>
			))
	}

	getDescription = (pointList = Immutable.List()) => {
		const {xScale, yScale} = this.props
		return (
			d3.line()
				.defined((point) => point && Number.isFinite(point.y))
				.x(({x}) => xScale(x))
				.y(({y}) => yScale(y))
		) (pointList.toJS())
	}

}

export default Line
