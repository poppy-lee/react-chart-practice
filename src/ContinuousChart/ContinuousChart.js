import "babel-polyfill"
import "./ContinuousChart.css"

import * as d3 from "d3"

import PropTypes from "prop-types"
import React from "react"

const MAX_VALUE = Number.MAX_VALUE / 2

export default
class ContinuousChart extends React.Component {

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

	componentWillMount() {
		enableNodeListForEach()
	}

  render() {
		const {width, height} = this.props
		const commonProps = {
			width, height, padding: this.getPadding(),
			...this.getScales()
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

	renderXAxes = (commonProps = {}) => {
		return this.getChildren("XAxis").slice(0, 1)
			.map((child, index) => (
				<child.type key={`axis-x-${index}`} {...{
					...commonProps,
					...(child.props || {}),
				}} />
			))
	}
	renderYAxes = (commonProps = {}) => {
		return this.getChildren("YAxis").slice(0, 2)
			.map((child, index, yAxes) => (
				<child.type key={`axis-y-${index}`} {...{
					axisIndex: index,
					axisCount: yAxes.length,
					...commonProps,
					...(child.props || {}),
				}} />
			))
	}
	renderCharts = (commonProps = {}) => {
		return this.getChartProps()
			.map(({Component, ...chartProps}, index) => (
				<Component key={`chart${index}`} {...{
					...commonProps,
					...chartProps,
				}} />
			))
	}
	renderSensor = (commonProps = {}) => {
		return this.getChildren("Sensor")
			.map((child, index) => (
				<child.type key={`sensor-${index}`} {...{
					...commonProps,
					...(child.props || {}),
					points: this.getSensorPoints(),
				}} />
			))
	}

	getChildren = (types = []) => {
		types = [].concat(types)
		return [].concat(this.props.children)
			.reduce((children, child) => children.concat(child || []), [])
			.filter(({type = () => null}) => !types.length || types.includes(type.name))
	}

	getYAxisProps = (axisName) => {
		const yAxisProps = this.getChildren("YAxis").slice(0, 2)
			.map(({props}) => props || {})
			.map(({name: axis, ...yAxisProps}, axisIndex, axes) => ({
				axis, axisIndex,
				yPrefix: yAxisProps.tickPrefix,
				yPostfix: yAxisProps.tickPostfix,
			}))
		const useFirstYAxis = !(axisName && yAxisProps.some((({axis}) => axis === axisName)))
		return yAxisProps.find(({axis}) => (useFirstYAxis || axis === axisName))
	}

	getChartProps = () => {
		return this.getChildren(["Area", "Line"])
			.map((child, index) => {
				const {type, props} = child
				const {axis, points, ...otherProps} = (props || {})
				return {
					Component: type,
					name: `y${index + 1}`,
					color: this.props.colors[index % this.props.colors.length],
					points: (points || [])
						.filter((point) => point instanceof Object)
						.filter(({x, y}) => Number.isFinite(x))
						.map(({x, y}) => ({x, y: (Math.abs(y) < MAX_VALUE ? y : Math.sign(y) * Infinity)}))
						.sort(({x: xA}, {x: xB}) => xA - xB),
					...this.getYAxisProps(axis),
					...otherProps,
				}
			})
	}

	getSensorPoints = () => {
		const chartProps = this.getChartProps()
		const points = chartProps.reduce((points, props) => points.concat(props.points || []), [])
		return [...new Set(points.map(({x}) => x))]
			.sort((a, b) => (a - b))
			.map((x) => ({
				x,
				ys: chartProps
					.reduce((ys, {points, ...chartProps}, index) => {
						const point = findPoint(points, x) || {}
						return [...ys, {...chartProps, ...point}].filter(({x}) => Number.isFinite(x))
					}, [])
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

	getScales = () => {
		const {width, height} = this.props

		const padding = this.getPadding()
		const {xDomain, yDomain, y1Domain} = this.getDomains()

		const {xs} = this.getXYs()
		const dayInterval = 1000 * 60 * 60 * 24
		const intervals = xs
			.map((x, index, xs) => Math.abs(x - (xs[index - 1] || 0)))
			.filter((interval) => interval)

		return {
			xScale: ((Math.min(...intervals) % dayInterval) ? d3.scaleLinear() : d3.scaleUtc())
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

		const yMin = Math.max(Math.min(0, ...ys), -MAX_VALUE)
		const yMax = Math.min(Math.max(0, ...ys), MAX_VALUE)
		const y1Min = Math.max(Math.min(0, ...y1s), -MAX_VALUE)
		const y1Max = Math.min(Math.max(0, ...y1s), MAX_VALUE)

		const yRatio = Math.min(-yMin, yMax) / Math.max(-yMin, yMax)
		const y1Ratio = Math.min(-y1Min, y1Max) / Math.max(-y1Min, y1Max)

		const xDomain = [Math.min(...xs), Math.max(...xs)]
		switch (true) {
			case (!y1s || !y1s.length || (!y1Min && !y1Max)):
				return {
					xDomain,
					yDomain: [yMin, yMax],
					y1Domain: [0, 0]
				}
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
					yDomain: (yRatio >= y1Ratio) ? [yMin, yMax]
						: [
							-(-y1Min < y1Max ? y1Ratio : 1) * Math.max(-yMin, yMax),
							(-y1Min >= y1Max ? y1Ratio : 1) * Math.max(-yMin, yMax),
						],
					y1Domain: (yRatio < y1Ratio) ? [y1Min, y1Max]
						: [
							-(-yMin < yMax ? yRatio : 1) * Math.max(-y1Min, y1Max),
							(-yMin >= yMax ? yRatio : 1) * Math.max(-y1Min, y1Max),
						]
				}
		}
	}
	getXYs = () => {
		const chartProps = this.getChartProps()
		const points = chartProps.reduce((points, props) => points.concat(props.points), [])

		const xAxes = this.getChildren("XAxis").slice(0, 1)
		const yAxes = this.getChildren("YAxis").slice(0, 2)

		const [xs] = !xAxes.length ? [points.map(({x}) => x)]
			: xAxes.reduce((xsArray, {props: axisProps = {}}, index) => [
				...xsArray,
				chartProps.reduce((xs, {points}) => [
					...xs, ...points.map(({x, y}) => x),
					...(axisProps.tickValues || []),
				], [])
			], [])
		const [ys, y1s] = !yAxes.length ? [points.map(({y}) => y), []]
			: yAxes.reduce((ysArray, {props: axisProps = {}}, index) => [
				...ysArray,
				chartProps
					.filter(({axis}) => (!index && !axis) || (axisProps.name === axis))
					.reduce((ys, {points}) => [
						...ys,
						...points.map(({x, y}) => y),
						...(axisProps.tickValues || []),
					], [])
			], [])

		return {
			xs: [...new Set(xs)].sort((a, b) => (a - b)),
			ys: [...new Set(ys)].sort((a, b) => (a - b)),
			y1s: [...new Set(y1s)].sort((a, b) => (a - b)),
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

function findPoint(points, x, leftIdx, rightIdx) {
	leftIdx = Number.isFinite(leftIdx) ? leftIdx : 0
	rightIdx = Number.isFinite(rightIdx) ?  rightIdx : points.length - 1

	const midIdx = Math.floor((rightIdx + leftIdx) / 2)
	const point = points[midIdx] || {}

	if (point.x === x) return point
	if (leftIdx >= rightIdx) return undefined
	if (point.x < x) return findPoint(points, x, midIdx + 1, rightIdx)
	if (point.x > x) return findPoint(points, x, leftIdx, midIdx)
}
