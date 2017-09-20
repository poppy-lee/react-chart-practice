import * as d3 from "d3"

import PropTypes from "prop-types"
import React from "react"

export default
class Path extends React.Component {

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

		stroke: PropTypes.bool,
		fill: PropTypes.bool,
		fillGradient: PropTypes.bool,
		strokeWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		fillOpacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

		axix: PropTypes.string,
		axisIndex: PropTypes.number,
	}

	static defaultProps = {
		stroke: true,
		fill: false,
		fillGradient: false,
		strokeWidth: 2.5,
		fillOpacity: 0.3,
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
		const {stroke, fill, fillGradient} = this.props
		return (
			<g className="line">
				{fill && this.renderArea()}
				{fillGradient && this.renderAreaWithGradient()}
				{stroke && this.renderLine()}
				{this.renderCircles()}
			</g>
		)
	}

	renderArea = () => {
		const {color, fillOpacity} = this.props
		return (
			<path
				stroke="none"
				fill={color}
				opacity={fillOpacity}
				d={this.getAreaDescription()}
			/>
		)
	}

	renderAreaWithGradient = () => {
		const {color, fillOpacity} = this.props
		const backgroundId = `background-${color.replace(/\s|#|\(|\)|,/g, "-")}`

		const {xScale, yScale} = this.getScales()
		const offsetMiddle = (yScale(0) - yScale.range()[1]) / (yScale.range()[0] - yScale.range()[1]) * 100
		const stopProps = [
			{ stopColor: color, stopOpacity: fillOpacity,       offset: "0%" },
			{ stopColor: color, stopOpacity: 0.1 * fillOpacity, offset: `${offsetMiddle}%` },
			{ stopColor: color, stopOpacity: fillOpacity,       offset: "100%" },
		]

		return [
			<linearGradient key="linearGradient"
				id={backgroundId}
				gradientUnits="userSpaceOnUse"
				x1={0} y1={yScale.range()[1]}
				x2={0} y2={yScale.range()[0]}
			>
				{stopProps.map((props, index) => <stop key={index} {...props} />)}
			</linearGradient>,
			<path key="path"
				stroke="none"
				fill={`url(#${backgroundId})`}
				d={this.getAreaDescription()}
			/>
		]
	}

	renderLine = () => {
		return (
			<path
				stroke={this.props.color}
				strokeWidth={this.props.strokeWidth}
				fill="none"
				d={this.getLineDescription()}
			/>
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
				.y0(({y0}) => yScale(y0))
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
