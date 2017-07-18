import * as d3 from "d3"

import Immutable from "immutable"
import PropTypes from "prop-types"
import React from "react"

class LinearChart extends React.Component {

	static propTypes = {
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		padding: PropTypes.string,
		paddingTop: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		paddingRight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		paddingBottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		paddingLeft: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		colorArray: PropTypes.array,
	}

	static defaultProps = {
		width: 0,
		height: 0,
		colorArray: d3.schemeCategory10,
	}

	pixelRatio = (window.devicePixelRatio || 1)

	getChartProps = (children = this.props.children) => {
		const {colorArray} = this.props
		const typeCounts = {}
		return [].concat(children || [])
			.filter(({props = {}}) => props.pointList)
			.map(({type = () => null, props = {}}, index) => {
				if (!typeCounts[type.name]) typeCounts[type.name] = 0
				return {
					index, type: type.name, typeIndex: typeCounts[type.name]++,
					color: colorArray[index % colorArray.length],
					name: `y${index + 1}`,
					...props,
					pointList: props.pointList.sort(sortPoint),
				}
			})
	}

  render() {
		const {width, height} = this.props

    return (
			<svg
				width={String(width)} height={String(height)}
				style={{border: "1px solid black"}}
			>
				{this.renderAxes({
					width, height, padding: this.getPadding(),
					...this.getScales(),
				})}
				{this.renderCharts({
					barWidth: 0.8 * this.getBarWidth(),
					...this.getScales(),
				})}
				{this.renderSensor({
					width, height, padding: this.getPadding(),
					...this.getScales(),
					...this.getXYs(),
					chartProps: this.getChartProps(),
				})}
			</svg>
    )
	}

	renderAxes = (props) => {
		return [].concat(this.props.children || [])
			.filter(({type}) => ["XAxis", "YAxis"].includes(type.name))
			.map((child, index) => {
				child = child || {type: () => null, props: {}}
				return <child.type key={`axis-${index}`} {...{...props, ...child.props}} />
			})
	}

	renderCharts = (props) => {
		const {width} = this.props
		const {colorArray} = this.props

		const padding = this.getPadding()

		const chartWidth = width - (padding.left + padding.right)
		const chartPixels = chartWidth * this.pixelRatio
		const chartProps = this.getChartProps()

		return [].concat(this.props.children || [])
			.filter(({props = {}}) => props.pointList)
			.map((child, index) => {
				child = child || {type: () => null, props: {}}
				return <child.type key={`chart-${index}`} {...{
					...chartProps[index], ...props, ...child.props,
					typeCount: Math.max(...chartProps.map(({type, typeIndex}) => type === child.type.name && typeIndex + 1)),
					pointList: child.props.pointList.sort(sortPoint)
						.filter((point, index) => !(index % Math.round(child.props.pointList.size / chartPixels)))
				}} />
			})
	}

	renderSensor = (props) => {
		return [].concat(this.props.children || [])
			.filter(({type}) => ["Sensor"].includes(type.name))
			.map((child, index) => {
				child = child || {type: () => null, props: {}}
				return <child.type key={`sensor-${index}`} {...{...props, ...child.props}} />
			})
	}

	getPadding = () => {
		const {
			padding = "",
			paddingTop, paddingRight, paddingBottom, paddingLeft
		} = this.props

		const [top, right, bottom, left] = padding.split(" ")

		return {
			top: parseFloat(paddingTop || top || 0 ),
			right: parseFloat(paddingRight || right || top || 0),
			bottom: parseFloat(paddingBottom || bottom || top || 0),
			left: parseFloat(paddingLeft || left || right || top || 0),
		}
	}

	getBarWidth = () => {
		const {width} = this.props
		const {xScale} = this.getScales()
		const xs = [...new Set(
			this.getChartProps()
			.filter(({type}) => type === "Bar")
			.reduce((points, {pointList = Immutable.List()}) => points.concat(pointList.toJS()), [])
			.filter((point) => point && Number.isFinite(point.y))
			.map(({x}) => x || 0)
		)]

		const minX = Math.min(...xs)
		const maxX = Math.max(...xs)
		const interval = Math.min(...xs
			.map((x, index, xs) => Math.abs(x - (xs[index - 1]) || 0))
			.filter((interval) => interval)
		)

		return Math.max(1 / this.pixelRatio, Math.min(...[
			Math.abs(xScale(maxX) - xScale(maxX - interval)),
			2 * Math.abs(xScale(minX) - xScale.range()[0]),
			2 * Math.abs(xScale(maxX) - xScale.range()[1]),
		]))
	}

	getScales = () => {
		const {width, height} = this.props

		const padding = this.getPadding()
		const {xDomain, yDomain} = this.getDomains()

		return {
			xScale: d3.scaleLinear()
				.domain(xDomain)
				.range([padding.left + 10, width - (padding.right + 10)]),
			yScale: d3.scaleLinear()
				.domain(yDomain)
				.range([height - padding.bottom, padding.top])
				.nice(),
		}
	}

	getDomains = () => {
		const {xs, ys} = this.getXYs()

		const xInterval = Math.min(...xs
			.map((x, index, xs) => x - (xs[index - 1] || 0))
			.filter((interval) => interval)
		)

		return {
			xDomain: [
				Math.min(...xs) - xInterval / 2,
				Math.max(...xs) + xInterval / 2,
			],
			yDomain: d3.extent([0, ...ys]),
		}
	}

	getXYs = () => {
		const points = this.getChartProps()
			.reduce((points, {pointList = Immutable.List()}) => points.concat(pointList.toJS()), [])
			.filter((point) => point && Number.isFinite(point.y))

		return {
			xs: [...new Set(points.map(({x}) => x || 0))].sort(sort),
			ys: [...new Set(points.map(({y}) => y || 0))].sort(sort),
		}
	}

}

export default LinearChart


function sort(a, b) {
	if (a > b) return 1
	if (a < b) return -1
	return 0
}

function sortPoint(pointA, pointB) {
	if (pointA.get("x") > pointB.get("x")) return 1
	if (pointA.get("x") < pointB.get("x")) return -1
	return 0
}
