import "./LinearChart.css"

import * as d3 from "d3"

import Immutable from "immutable"
import PropTypes from "prop-types"
import React from "react"

const MAX_VALUE = Number.MAX_VALUE / 2

export default
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

  render() {
		const {width, height} = this.props
		const commonProps = {
			width, height, padding: this.getPadding(),
			...this.getScales(),
		}

    return (
			<svg
				className="linear-chart"
				width={String(width)} height={String(height)}
			>
				{this.renderYAxes(commonProps)}
				{this.renderXAxes(commonProps)}
				{this.renderCharts(commonProps)}
				{this.renderSensor(commonProps)}
			</svg>
    )
	}

	renderXAxes = (props = {}) => {
		return this.getChildren("XAxis").slice(0, 1)
			.map((child, index) => (
				<child.type key={`axis-${index}`} {...{index, ...props, ...(child.props || {})}} />
			))
	}
	renderYAxes = (props = {}) => {
		return this.getChildren("YAxis").slice(0, 2)
			.map((child, index) => (
				<child.type key={`axis-y-${index}`} {...{index, ...props, ...(child.props || {})}} />
			))
	}
	renderCharts = (props = {}) => {
		const filtertedPointLists = this.getPointLists(true)
		const chartProps = this.getChartProps()
		const chartTypes = ["Bar", "Line"]
		return this.getChildren(chartTypes)
			.map((child, index) => (
				<child.type key={`chart-${index}`} {...{
					...chartProps[index], ...props, ...(child.props || {}),
					bandWidth: this.getBandWidth(),
					pointList: filtertedPointLists[index],
				}} />
			))
			.sort(({type: typeA}, {type: typeB}) => (
				chartTypes.indexOf(typeA.name) - chartTypes.indexOf(typeB.name)
			))
	}
	renderSensor = (props = {}) => {
		const axesProps = this.getChildren("YAxis").slice(0, 2).map(({props}) => props || {})
		return this.getChildren("Sensor")
			.map((child, index) => (
				<child.type key={`sensor-${index}`} {...{
					...props, ...(child.props || {}),
					...this.getXYs(),
					axesProps, chartProps: this.getChartProps(),
				}} />
			))
	}

	getChildren = (types = []) => {
		types = [].concat(types)
		return [].concat(this.props.children)
			.reduce((children, child) => children.concat(child || []), [])
			.filter(({type = () => null}) => !types.length || types.includes(type.name))
	}

	getPointLists = (filter = false) => {
		const {width} = this.props
		const padding = this.getPadding()

		const chartWidth = width - (padding.left + padding.right)
		const chartPixels = chartWidth * (window.devicePixelRatio || 1)

		return this.getChildren(["Bar", "Line"])
			.map(({props = {}}, index) => {
				return props.pointList
					.sort((pointA, pointB) => {
						if (pointA.get("x") > pointB.get("x")) return 1
						if (pointA.get("x") < pointB.get("x")) return -1
						return 0
					})
					.map((point) => {
						const y = point.get("y")
						return point.set("y", (Math.abs(y) < MAX_VALUE ? y : Math.sign(y) * Infinity))
					})
					.filter((point, index) => !(
						filter
						&& point && Number.isFinite(point.get("x")) && isFinite(point.get("y"))
						&& index && index !== props.pointList.size - 1
						&& Math.floor(Math.random() * (props.pointList.size / chartPixels))
					))
			})
	}

	getChartProps = () => {
		const {colorArray} = this.props
		const pointLists = this.getPointLists()
		const typeCounts = {}

		return this.getChildren(["Bar", "Line"])
			.map(({type = () => null, props = {}}, index) => ({
				name: `y${index + 1}`,
				color: colorArray[index % colorArray.length],
				...props,
				pointList: pointLists[index],
				type: type.name,
				typeIndex: (typeCounts[type.name] = (typeCounts[type.name] || 0) + 1) - 1,
			}))
			.map((props) => ({
				...props,
				typeCount: typeCounts[props.type],
			}))
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

	getBandWidth = () => {
		const {width} = this.props
		const {xScale} = this.getScales()
		const xs = [...new Set(
			this.getChartProps()
				.filter(({type}) => type === "Bar")
				.reduce((points, {pointList = Immutable.List()}) => points.concat(pointList.toJS()), [])
				.filter((point) => point && isFinite(point.y))
				.map(({x}) => x || 0)
		)]

		const min = Math.min(...xs)
		const max = Math.max(...xs)
		const intervals = xs
			.map((x, index, xs) => Math.abs(x - (xs[index - 1] || 0)))
			.filter((interval) => interval)

		return Math.min(
			Math.abs(xScale(max) - xScale(max - Math.min(...intervals))),
			2 * Math.abs(xScale(min) - xScale.range()[0]),
			2 * Math.abs(xScale(max) - xScale.range()[1]),
		)
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
				.range([height - padding.bottom, padding.top]),
		}
	}

	getDomains = () => {
		const {xs, ys} = this.getXYs()
		const xIntervals = xs
			.map((x, index, xs) => Math.abs(x - (xs[index - 1] || 0)))
			.filter((interval) => interval)

		return {
			xDomain: [
				Math.min(...xs) - Math.min(...xIntervals) / 2,
				Math.max(...xs) + Math.min(...xIntervals) / 2,
			],
			yDomain: [
				Math.max(Math.min(0, ...ys), -MAX_VALUE),
				Math.min(Math.max(0, ...ys), MAX_VALUE),
			],
		}
	}

	getXYs = () => {
		const points = this.getPointLists()
			.reduce((points, pointList = Immutable.List()) => points.concat(pointList.toJS()), [])
			.filter((point) => point && Number.isFinite(point.x) && !isNaN(point.y))

		const sort = (a, b) => {
			if (a > b) return 1
			if (a < b) return -1
			return 0
		}

		return {
			xs: [...new Set(points.map(({x}) => x))].sort(sort),
			ys: [...new Set(points.map(({y}) => y))].sort(sort),
		}
	}

}
