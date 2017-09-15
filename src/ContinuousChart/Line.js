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
				{this.props.background && this.renderBackground()}
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

	renderBackground = () => {
		const {xScale, yScale} = this.getScales()

		const offsetMiddle = (yScale(0) - yScale.range()[1]) / (yScale.range()[0] - yScale.range()[1]) * 100
		const stopColor = this.props.color
		const stops = [
			{ stopColor, stopOpacity: .3,  offset: "0%" },
			{ stopColor, stopOpacity: .03, offset: `${offsetMiddle}%` },
			{ stopColor, stopOpacity: .3,  offset: "100%" },
		]

		const backgroundId = `background-${stopColor.replace(/\s|#|\(|\)|,/g, "-")}`

		return [
			<linearGradient key="linearGradient"
				id={backgroundId}
				gradientUnits="userSpaceOnUse"
				x1={0} y1={yScale.range()[1]}
				x2={0} y2={yScale.range()[0]}
			>
				{stops.map((props, index) => <stop key={index} {...props} />)}
			</linearGradient>,
			<path key="path"
				stroke="none"
				fill={`url(#${backgroundId})`}
				d={this.getBackgroundDescription()}
			/>
		]
	}

	renderCircles = () => {
		const {color, lineWidth} = this.props
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

	getBackgroundDescription = (points = this.props.points) => {
		const {xScale, yScale} = this.getScales()
		return (
			d3.area()
				.defined((point) => point && Number.isFinite(point.y))
				.x(({x}) => xScale(x))
				.y0((point) => yScale(0))
				.y1(({y}) => yScale(y))
		) (points)
	}

}