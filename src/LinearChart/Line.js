import * as d3 from "d3"

import Immutable from "immutable"
import ImmutablePropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"
import React from "react"

export default
class Line extends React.Component {

	static propTypes = {
		xScale: PropTypes.func,
		yScale: PropTypes.func,
		y1Scale: PropTypes.func,

		pointList: ImmutablePropTypes.list.isRequired,
		name: PropTypes.string,
		color: PropTypes.string,
		lineWidth: PropTypes.number,

		axix: PropTypes.string,
		axisIndex: PropTypes.number,
		axisCount: PropTypes.number,
		type: PropTypes.string,
		typeIndex: PropTypes.number,
		typeCount: PropTypes.number,
	}

	static defaultProps = {
		lineWidth: 2.5,
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
		const {color, lineWidth} = this.props

		return (
			<g className="line">
				<path
					stroke={color}
					strokeWidth={lineWidth}
					fill="none"
					d={this.getDescription()}
				/>
				{this.renderCircles()}
			</g>
		)
	}

	renderCircles = () => {
		const {color, lineWidth, axisIndex} = this.props
		const {xScale, yScale} = this.getScales()

		return this.props.pointList
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

	getDescription = (pointList = this.props.pointList) => {
		const {xScale, yScale} = this.getScales()

		return (
			d3.line()
				.defined((point) => point && Number.isFinite(point.y))
				.x(({x}) => xScale(x))
				.y(({y}) => yScale(y))
		) (pointList.toJS())
	}

}
