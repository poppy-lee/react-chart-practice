import * as d3 from "d3"

import Immutable from "immutable"
import ImmutablePropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"
import React from "react"

class Line extends React.Component {

	static propTypes = {
		xScale: PropTypes.func,
		yScale: PropTypes.func,

		index: PropTypes.number,
		pointList: ImmutablePropTypes.list.isRequired,
		type: PropTypes.string,
		typeIndex: PropTypes.number,
		typeCount: PropTypes.number,
		lineWidth: PropTypes.number,
		color: PropTypes.string,
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
			.filter((point, index, pointList) => {
				return point.get("y") && !(index && pointList.getIn([index - 1, "y"]) && pointList.getIn([index + 1, "y"]))
			})
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
				.defined((point) => point && point.y)
				.x(({x}) => xScale(x))
				.y(({y}) => yScale(y))
		) (pointList.toJS())
	}

}

export default Line
