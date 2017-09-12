import * as d3 from "d3"

import PropTypes from "prop-types"
import React from "react"

export default
class Line extends React.Component {

	static propTypes = {
		xScale: PropTypes.func,
		yScale: PropTypes.func,
		y1Scale: PropTypes.func,

		points: PropTypes.arrayOf(
			PropTypes.shape({
				x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			})
		).isRequired,

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

		return this.props.points
			.filter(({x, y}, index) => {
				const {y: prevY} = (this.props.points[index - 1] || {})
				const {y: nextY} = (this.props.points[index + 1] || {})
				return Number.isFinite(y) && !(Number.isFinite(prevY) || Number.isFinite(nextY))
			})
			.map(({x, y}, index) => (
				<circle key={index}
					r={lineWidth} cx={xScale(x)} cy={yScale(y)}
					stroke="none" fill={color}
				/>
			))
	}

	getDescription = (points = this.props.points) => {
		const {xScale, yScale} = this.getScales()
		return (
			d3.line()
				.defined((point) => point && Number.isFinite(point.y))
				.x(({x}) => xScale(x))
				.y(({y}) => yScale(y))
		) (points)
	}

}
