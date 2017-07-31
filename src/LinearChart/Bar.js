import PropTypes from "prop-types"
import React from "react"

export default
class Bar extends React.Component {

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
		barPadding: PropTypes.number,
		bandWidth: PropTypes.number,

		axix: PropTypes.string,
		axisIndex: PropTypes.number,
		axisCount: PropTypes.number,
		type: PropTypes.string,
		typeIndex: PropTypes.number,
		typeCount: PropTypes.number,
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

		return (
			<g className="bar">
				{this.props.points
					.filter(({y}) => Number.isFinite(y))
					.map(this.renderBar)
				}
			</g>
		)
	}

	renderBar = ({x, y}) => {
		const {color, bandWidth, axisIndex, typeIndex, typeCount} = this.props
		const {xScale, yScale} = this.getScales()

		const padding = bandWidth * (this.props.barPadding || 0)
		const width = Math.max(
			1 / (window.devicePixelRatio || 1),
			(bandWidth / typeCount) - 2 * padding,
		)
		const height = yScale(y) - yScale(0)

		return (
			<rect key={x}
				fill={color}
				width={width}
				height={Math.abs(height)}
				x={(xScale(x) - bandWidth / 2) + (bandWidth / typeCount * typeIndex) + padding}
				y={height < 0 ? yScale(y) : yScale(0)}
			/>
		)
	}

}
