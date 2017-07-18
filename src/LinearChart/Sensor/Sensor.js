import Immutable from "immutable"
import ImmutablePropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"
import React from "react"
import ReactDOM from "react-dom"

const initialState = {
	mouseX: undefined,
	mouseY: undefined,
	x: undefined,
	ys: undefined,
}

class Sensor extends React.Component {

	static propTypes = {
		width: PropTypes.number,
		height: PropTypes.number,
		padding: PropTypes.object,
		xScale: PropTypes.func,
		yScale: PropTypes.func,
		xs: PropTypes.array,
		ys: PropTypes.array,
		chartProps: PropTypes.array,

		sticky: PropTypes.bool,
	}

	state = initialState

	getX = (mouseX) => {
		const {xScale, xs} = this.props
		return findClosest(xs, +xScale.invert(mouseX))
	}

	getYs = (mouseX) => {
		const {chartProps} = this.props
		const x = this.getX(mouseX)

		return chartProps
			.map((props, index) => {
				const point = this.props.sticky
					? findClosestPoint(props.pointList || Immutable.List(), x)
					: findPoint(props.pointList || Immutable.List(), x)
				return {...props, ...Immutable.Map(point).toObject()}
			})
			.filter(({x, y}) => Number.isFinite(x) && Number.isFinite(y))
	}

	onMouseEvent = ({clientX, clientY}) => {
		const mouseX = clientX - this.refs["sensor"].getBoundingClientRect().left
		const mouseY = clientY - this.refs["sensor"].getBoundingClientRect().top
		const x = this.getX(mouseX)
		const ys = this.getYs(mouseX)

		this.setState({mouseX, mouseY, x, ys})
	}

	render() {
		const {width, height} = this.props

		return (
			<g
				style={{pointerEvents: "all"}}
				onMouseEnter={this.onMouseEvent}
				onMouseMove={this.onMouseEvent}
				onMouseLeave={() => this.setState(initialState)}
			>
				<rect ref="sensor"
					width={String(width)} height={String(height)}
					style={{fill: "none"}}
				/>
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

export default Sensor

function findClosest(array, target, closest, leftIdx, rightIdx) {
	closest = Number.isFinite(closest) ? closest : -Infinity
	leftIdx = Number.isFinite(leftIdx) ? leftIdx : 0
	rightIdx = Number.isFinite(rightIdx) ?  rightIdx : array.length - 1

	const midIdx = Math.floor((rightIdx + leftIdx) / 2)
	const current = array[midIdx]

	if (current === target) return current

	closest = Math.abs(target - current) <= Math.abs(target - closest) ? current : closest
	if (leftIdx >= rightIdx) return closest
	if (current < target) return findClosest(array, target, closest, midIdx + 1, rightIdx)
	if (current > target) return findClosest(array, target, closest, leftIdx, midIdx)
}

function findPoint(pointList, x, leftIdx, rightIdx) {
	leftIdx = Number.isFinite(leftIdx) ? leftIdx : 0
	rightIdx = Number.isFinite(rightIdx) ?  rightIdx : pointList.size - 1

	const midIdx = Math.floor((rightIdx + leftIdx) / 2)
	const point = pointList.get(midIdx) || Immutable.Map()

	if (point.get("x") === x) return point
	if (leftIdx >= rightIdx) return undefined
	if (point.get("x") < x) return findPoint(pointList, x, midIdx + 1, rightIdx)
	if (point.get("x") > x) return findPoint(pointList, x, leftIdx, midIdx)
}

function findClosestPoint(pointList, x, closestPoint, leftIdx, rightIdx) {
	closestPoint = closestPoint || Immutable.Map({index: -1, x: -Infinity})
	leftIdx = Number.isFinite(leftIdx) ? leftIdx : 0
	rightIdx = Number.isFinite(rightIdx) ?  rightIdx : pointList.size - 1

	const midIdx = Math.floor((rightIdx + leftIdx) / 2)
	const point = pointList.get(midIdx) || Immutable.Map()

	if (point.get("x") === x) return point

	closestPoint = Math.abs(x - point.get("x")) <= Math.abs(x - closestPoint.get("x")) ? point : closestPoint
	if (leftIdx >= rightIdx) return closestPoint
	if (point.get("x") < x) return findClosestPoint(pointList, x, closestPoint, midIdx + 1, rightIdx)
	if (point.get("x") > x) return findClosestPoint(pointList, x, closestPoint, leftIdx, midIdx)
}
