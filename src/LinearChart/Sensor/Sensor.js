import "./Sensor.css"

import PropTypes from "prop-types"
import React from "react"

const initialState = {
	mouseX: undefined,
	mouseY: undefined,
	x: undefined,
	ys: undefined,
}

export default
class Sensor extends React.Component {

	static propTypes = {
		width: PropTypes.number,
		height: PropTypes.number,
		padding: PropTypes.object,
		xScale: PropTypes.func,
		yScale: PropTypes.func,
		y1Scale: PropTypes.func,

		xFormat: PropTypes.func,
		points: PropTypes.array,
	}

	state = initialState

	findPoint = (mouseX) => {
		const point = findClosestPoint(this.props.points, +this.props.xScale.invert(mouseX))
		return point && Number.isFinite(point.x) ? point : {}
	}

	onMouseEvent = ({clientX, clientY}) => {
		const mouseX = clientX - this.refs["sensor"].getBoundingClientRect().left
		const mouseY = clientY - this.refs["sensor"].getBoundingClientRect().top
		const {x, ys} = this.findPoint(mouseX)

		this.setState({mouseX, mouseY, x, ys})
	}

	render() {
		const {width, height} = this.props

		return (
			<g
				className="sensor"
				onMouseEnter={this.onMouseEvent}
				onMouseMove={this.onMouseEvent}
				onMouseLeave={() => this.setState(initialState)}
			>
				<rect ref="sensor" width={String(width)} height={String(height)} />
				{this.renderChildComponents({...this.props, ...this.state})}
			</g>
		)
	}

	shouldRenderChildComponents = () => {
		const {mouseX, mouseY, ys} = this.state
		return Number.isFinite(mouseX + mouseY) && ys && ys.length
	}

	renderChildComponents = (props) => {
		return this.shouldRenderChildComponents()
			? [].concat(this.props.children || [])
				.map((child, index) => {
					child = child || {type: () => null, props: {}}
					return <child.type key={`sensor-child-${index}`} {...{...props, ...child.props}} />
				})
			: null
	}

}

function findClosestPoint(points, x, closestPoint, leftIdx, rightIdx) {
	closestPoint = closestPoint || {index: -1, x: -Infinity}
	leftIdx = Number.isFinite(leftIdx) ? leftIdx : 0
	rightIdx = Number.isFinite(rightIdx) ?  rightIdx : points.length - 1

	const midIdx = Math.floor((rightIdx + leftIdx) / 2)
	const point = points[midIdx] || {}

	closestPoint = Math.abs(x - point.x) <= Math.abs(x - closestPoint.x)
		? point
		: closestPoint
	if (point.x === x) return point
	if (leftIdx >= rightIdx) return closestPoint
	if (point.x < x) return findClosestPoint(points, x, closestPoint, midIdx + 1, rightIdx)
	if (point.x > x) return findClosestPoint(points, x, closestPoint, leftIdx, midIdx)
}
