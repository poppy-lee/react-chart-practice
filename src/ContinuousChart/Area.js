import * as d3 from "d3"

import PropTypes from "prop-types"
import React from "react"

export default
class Area extends React.Component {

	static propTypes = {
		xScale: PropTypes.func,
		yScale: PropTypes.func,
		y1Scale: PropTypes.func,

		points: PropTypes.arrayOf(
			PropTypes.shape({
				x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				y0: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				y1: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			})
		).isRequired,

		name: PropTypes.string,
		color: PropTypes.string,
		opacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		line: PropTypes.bool,
		lineColor: PropTypes.string,
		lineOpacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		lineWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

		axix: PropTypes.string,
		axisIndex: PropTypes.number,
	}

	static defaultProps = {
		lineWidth: 2.5,
	}

	getScales = (axisIndex = this.props.axisIndex) => {
		const {xScale, yScale, y1Scale} = this.props
		switch (axisIndex) {
			case 0: return {xScale, yScale}
			case 1: return {xScale, yScale: y1Scale}
		}
		return {xScale, yScale}
	}

	render() {
		const {
			color, opacity,
			line, lineColor, lineOpacity, lineWidth,
		} = this.props

		return (
			<g className="line">
				<path
					stroke="none"
					fill={color}
					opacity={opacity || 0.3}
					d={this.getAreaDescription()}
				/>
				{line && (
					<path
						stroke={lineColor || color}
						strokeWidth={lineWidth}
						opacity={lineOpacity || null}
						fill="none"
						d={this.getLineDescription()}
					/>
				)}
				{this.renderCircles()}
			</g>
		)
	}

	renderCircles = () => {
		const {color, lineWidth} = this.props
		const {xScale, yScale} = this.getScales()

		return this.props.points
			.filter(({x, y1}, index) => {
				const {y1: prevY1} = (this.props.points[index - 1] || {})
				const {y1: nextY1} = (this.props.points[index + 1] || {})
				return Number.isFinite(y1) && !(Number.isFinite(prevY1) || Number.isFinite(nextY1))
			})
			.map(({x, y1}, index) => (
				<circle key={index}
					r={lineWidth} cx={xScale(x)} cy={yScale(y1)}
					stroke="none" fill={color}
				/>
			))
	}

	getAreaDescription = (points = this.props.points) => {
		const {xScale, yScale} = this.getScales()
		return (
			d3.area()
				.defined((point) => point && Number.isFinite(point.y1))
				.x(({x}) => xScale(x))
				.y0(({y0}) => yScale(y0 || 0))
				.y1(({y, y1}) => yScale(y1))
		) (points)
	}

	getLineDescription = (points = this.props.points) => {
		const {xScale, yScale} = this.getScales()
		return (
			d3.line()
				.defined((point) => point && Number.isFinite(point.y1))
				.x(({x}) => xScale(x))
				.y(({y1}) => yScale(y1))
		) (points)
	}

}
