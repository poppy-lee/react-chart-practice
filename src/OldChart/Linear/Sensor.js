import * as d3 from "d3"

import React from "react"
import PropTypes from "prop-types"

import D3Component from "../D3Component"

class Sensor extends D3Component {

	static propTypes = {
		root: PropTypes.object,
		svg: PropTypes.object,
		width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		padding: PropTypes.object,
		dataList: PropTypes.array,

		domains: PropTypes.object,
		scales: PropTypes.object
	}

	isUnmounted = false
	state = {
		hover: false,
	}

	componentWillReceiveProps(nextProps) {
		const sensor = this.props.root.selectAll(".sensor")
		if (this.props.dataList !== nextProps.dataList) {
			this.setState({hover: false})
			sensor.remove()
		}
	}

	componentDidUpdate() {
		const sensor = this.props.root.selectAll(".sensor")
		if (sensor.empty()) {
			this.draw()
		}
	}

	componentWillUnmount() {
		this.props.root.selectAll(".sensor").remove()
	}

	registerEventListener = (eventName, callback) => {
		if (!this.eventListeners) {
			this.eventListeners = {}
		}
		if (!this.eventListeners[eventName]) {
			this.eventListeners[eventName] = []
		}

		return {
			eventName,
			index: this.eventListeners[eventName].push(callback) - 1
		}
	}

	unregisterEventListener = ({eventName, index}) => {
		this.eventListeners[eventName] = this.eventListeners[eventName].splice(index, 1)
	}

	render() {
		const {
			root, svg, width, height, padding, dataList,
			domains, scales,
			children = []
		} = this.props

		const {hover} = this.state

		const ChildComponents = this.injectProps(children, {
			root, svg, width, height, padding, dataList,
			domains, scales,
			hover,
			registerEventListener: this.registerEventListener,
			unregisterEventListener: this.unregisterEventListener,
		})

		return <g>{ChildComponents}</g>
	}

	draw = () => {
		const {root, width, height, dataList} = this.props

		if (dataList.every(({points}) => !points.length)) return

		const sensor = root.append("div")
			.attr("class", "sensor")
			.style("position", "absolute")
			.style("width", `${width}px`)
			.style("height", `${height}px`)
			.style("top", 0).style("left", 0)
			.style("pointer-events", "all")

		const dragBehavior = d3.drag()

		let prevX
		const onMouseEnter = this.onMouseEvent(({mouseX, mouseY}) => {
			this.eventListeners = {}
			this.setState({hover: true})
			const eventListeners = this.eventListeners["mousemove"] || []
			const x = this.getXFromMouseX(mouseX)
			const yPoints = this.getYPointsFromX(x)

			prevX = x
			eventListeners.forEach((callback) => callback({mouseX, mouseY, x, yPoints}))
		})
		const onMouseMove = this.onMouseEvent(({mouseX, mouseY}) => {
			const eventListeners = this.eventListeners["mousemove"] || []
			const x = this.getXFromMouseX(mouseX)
			const yPoints = this.getYPointsFromX(x)

			if (prevX !== x) {
				prevX = x
				eventListeners.forEach((callback) => callback({mouseX, mouseY, x, yPoints}))
			}
		})
		const onMouseLeave = () => {
			this.eventListeners = {}
			this.setState({hover: false})
		}

		sensor.on("mouseenter", onMouseEnter)
		sensor.on("mousemove", onMouseMove)
		sensor.on("mouseleave", onMouseLeave)

		sensor.call(
			dragBehavior
			.on("start", this.onMouseEvent(({mouseX, mouseY}) => {
				const eventListeners = this.eventListeners["dragStart"] || []
				const x = this.getXFromMouseX(mouseX)
				const yPoints = this.getYPointsFromX(x)

				eventListeners.forEach((callback) => callback({mouseX, mouseY, x, yPoints}))
			}))
			.on("drag", this.onMouseEvent(({mouseX, mouseY}) => {
				sensor.on("mouseenter", null)
				sensor.on("mouseleave", null)

				const eventListeners = this.eventListeners["drag"] || []
				const x = this.getXFromMouseX(mouseX)
				const yPoints = this.getYPointsFromX(x)

				eventListeners.forEach((callback) => callback({mouseX, mouseY, x, yPoints}))
			}))
			.on("end", this.onMouseEvent(({mouseX, mouseY}) => {
				sensor.on("mouseenter", onMouseEnter)
				sensor.on("mouseleave", onMouseLeave)

				const eventListeners = this.eventListeners["dragEnd"] || []
				const x = this.getXFromMouseX(mouseX)
				const yPoints = this.getYPointsFromX(x)

				eventListeners.forEach((callback) => callback({mouseX, mouseY, x, yPoints}))
			}))
		)
	}

	onMouseEvent(callback) {
		return function () {
			const [mouseX, mouseY] = d3.mouse(this)
			callback({mouseX, mouseY})
		}
	}

	getClosestElement = (array, number) => {
		return array.reduce((closest, current) => {
			return Math.abs(current - number) < Math.abs(closest - number) ? current : closest
		})
	}

	getXFromMouseX = (mouseX) => {
		const {domains, scales} = this.props
		const {allX} = domains
		const {xScale} = scales

		const x = this.getClosestElement(allX, +xScale.invert(mouseX))

		return x
	}

	getYPointsFromX = (x) => {
		const {dataList} = this.props

		const points = dataList.map(({name, color, hide, points}) => {
			const point = points.find(point => point.x === x)
			return {name, color, hide, ...point}
		})

		return points
	}

}

export default Sensor
