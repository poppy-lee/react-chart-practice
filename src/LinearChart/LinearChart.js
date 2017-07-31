import "babel-polyfill"
import "./LinearChart.css"

import * as d3 from "d3"

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
		colors: PropTypes.array,
	}

	static defaultProps = {
		width: 0,
		height: 0,
		colors: d3.schemeCategory10,
	}

	componentDidMount() {
		enableNodeListForEach()
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
				<child.type key={`axis-${index}`} {...{...props, ...(child.props || {})}} />
			))
	}
	renderYAxes = (props = {}) => {
		return this.getChildren("YAxis").slice(0, 2)
			.map((child, index, yAxes) => (
				<child.type key={`axis-y-${index}`} {...{
					typeIndex: index, typeCount: yAxes.length,
					...props, ...(child.props || {})
				}} />
			))
	}
	renderCharts = (props = {}) => {
		const chartProps = this.getChartProps(true)
		const chartTypes = ["Bar", "Line"]
		return this.getChildren(chartTypes)
			.map((child, index) => (
				<child.type key={`chart-${index}`} {...{
					...chartProps[index], ...props, ...(child.props || {}),
					points: chartProps[index].points,
				}} />
			))
			.sort(({type: typeA}, {type: typeB}) => (
				chartTypes.indexOf(typeA.name) - chartTypes.indexOf(typeB.name)
			))
	}
	renderSensor = (props = {}) => {
		const chartProps = this.getChartProps()
		const [xFormat] = this.getChildren("XAxis")
			.map(({props = {}}) => props.tickFormat)
		return this.getChildren("Sensor")
			.map((child, index) => (
				<child.type key={`sensor-${index}`} {...{
					...props, ...(child.props || {}),
					xFormat,
					xPoints: this.getXYs().xs.map((x) => ({x})),
					chartProps,
				}} />
			))
	}

	getChildren = (types = []) => {
		types = [].concat(types)
		return [].concat(this.props.children)
			.reduce((children, child) => children.concat(child || []), [])
			.filter(({type = () => null}) => !types.length || types.includes(type.name))
	}

	getChartProps = (filter = false) => {
		const {colors} = this.props
		const bandWidth = this.getBandWidth()
		const pointsArray = this.getPointsArray(filter)
		const axisProps = this.getChildren("YAxis").slice(0, 2)
			.map(({props = {}}, index, axes) => ({
				axis: props.name, axisIndex: index, axisCount: axes.length,
				yPrefix: props.tickPrefix,
				yPostfix: props.tickPostfix,
			}))
		const typeCounts = {}

		return this.getChildren(["Bar", "Line"])
			.map(({type = () => null, props = {}}, index) => Object.assign({
				name: `y${index + 1}`,
				color: colors[index % colors.length],
				bandWidth,
				...props,
				points: pointsArray[index],
				type: type.name,
				typeIndex: (typeCounts[type.name] = (typeCounts[type.name] || 0) + 1) - 1,
			}))
			.map((props) => ({
				...props,
				typeCount: typeCounts[props.type],
				...(axisProps.find(({axis}) => props.axis === axis) || axisProps[0] || {}),
			}))
	}
	getPointsArray = (filter = false) => {
		const {width} = this.props
		const padding = this.getPadding()

		const chartWidth = width - (padding.left + padding.right)
		const chartPixels = 2 * chartWidth * (window.devicePixelRatio || 1)

		return this.getChildren(["Bar", "Line"])
			.map(({type = () => null, props = {}}, index) => (
				props.points
					.filter((point) => point instanceof Object)
					.filter(({x, y}) => Number.isFinite(x))
					.map(({x, y}) => ({x, y: (Math.abs(y) < MAX_VALUE ? y : Math.sign(y) * Infinity)}))
					.sort(({x: xA}, {x: xB}) => {
						if (xA > xB) return 1
						if (xA < xB) return -1
						return 0
					})
					.filter((point, index) => !(
						filter && type.name === "Line" && isFinite(point.y)
						&& index && index !== props.points.length - 1
						&& Math.floor(Math.random() * (props.points.length / chartPixels))
					))
			))
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
		const {xScale} = this.getScales()
		const xs = [...new Set(
			this.getChildren("Bar")
				.reduce((points, {props = {}}) => points.concat(props.points), [])
				.filter((point) => point && Number.isFinite(point.x) && !isNaN(point.y))
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
		const {xDomain, yDomain, y1Domain} = this.getDomains()

		return {
			xScale: d3.scaleLinear()
				.domain(xDomain)
				.range([padding.left + 10, width - (padding.right + 10)]),
			yScale: d3.scaleLinear()
				.domain(yDomain)
				.range([height - padding.bottom, padding.top]),
			y1Scale: d3.scaleLinear()
				.domain(y1Domain)
				.range([height - padding.bottom, padding.top]),
		}
	}

	getDomains = () => {
		const {xs, ys, y1s} = this.getXYs()
		const intervals = xs
			.map((x, index, xs) => Math.abs(x - (xs[index - 1] || 0)))
			.filter((interval) => interval)

		const yMin = Math.max(Math.min(0, ...ys), -MAX_VALUE)
		const yMax = Math.min(Math.max(0, ...ys), MAX_VALUE)
		const y1Min = Math.max(Math.min(0, ...y1s), -MAX_VALUE)
		const y1Max = Math.min(Math.max(0, ...y1s), MAX_VALUE)

		const yRatio = Math.min(-yMin, yMax) / Math.max(-yMin, yMax)
		const y1Ratio = Math.min(-y1Min, y1Max) / Math.max(-y1Min, y1Max)

		const xDomain = [
			Math.min(...xs) - Math.min(...intervals) / 2,
			Math.max(...xs) + Math.min(...intervals) / 2,
		]

		switch (true) {
			case (!y1s || !y1s.length || (!y1Min && !y1Max)):
				return {xDomain, yDomain: [yMin, yMax], y1Domain: [0, 0]}
			case (-yMin < yMax && -y1Min >= y1Max):
			case (-yMin >= yMax && -y1Min < y1Max):
				return {
					xDomain,
					yDomain: [-Math.max(-yMin, yMax), Math.max(-yMin, yMax)],
					y1Domain: [-Math.max(-y1Min, y1Max), Math.max(-y1Min, y1Max)],
				}
			case (-yMin < yMax && -y1Min < y1Max):
			case (-yMin >= yMax && -y1Min >= y1Max):
				return {
					xDomain,
					yDomain: (yRatio >= y1Ratio)
						? [yMin, yMax]
						: [
							-(-y1Min < y1Max ? y1Ratio : 1) * Math.max(-yMin, yMax),
							(-y1Min >= y1Max ? y1Ratio : 1) * Math.max(-yMin, yMax),
						],
					y1Domain: (yRatio >= y1Ratio)
						? [
							-(-yMin < yMax ? yRatio : 1) * Math.max(-y1Min, y1Max),
							(-yMin >= yMax ? yRatio : 1) * Math.max(-y1Min, y1Max),
						]
						: [y1Min, y1Max],
				}
		}
	}

	getXYs = () => {
		const yAxes = this.getChildren("YAxis").slice(0, 2)
		const chartProps = this.getChildren(["Bar", "Line"])
			.map(({props}) => (props || {}))

		const points = chartProps
			.reduce((points, props) => points.concat(props.points), [])
			.filter((point) => point && Number.isFinite(point.x) && Number.isFinite(point.y))
		const [yPoints, y1Points] = (yAxes.length === 2)
			? yAxes.reduce((points, {props}, index) => {
				points[index] = chartProps
					.filter(({axis}) => (!index && !axis) || (props.name === axis))
					.reduce((points, props) => points.concat(props.points), [])
					.filter((point) => point && Number.isFinite(point.x) && Number.isFinite(point.y))
				return points
			}, [])
			: [points, []]

		const sort = (a, b) => {
			if (a > b) return 1
			if (a < b) return -1
			return 0
		}

		return {
			xs: [...new Set(points.map(({x}) => x))].sort(sort),
			ys: [...new Set(yPoints.map(({y}) => y))].sort(sort),
			y1s: [...new Set(y1Points.map(({y}) => y))].sort(sort),
		}
	}

}

function enableNodeListForEach() {
	// https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
	// for MS IE and Edge
	if (window.NodeList && !NodeList.prototype.forEach) {
		NodeList.prototype.forEach = function (callback, thisArg) {
			thisArg = thisArg || window;
			for (var i = 0; i < this.length; i++) {
				callback.call(thisArg, this[i], i, this);
			}
		};
	}
}
