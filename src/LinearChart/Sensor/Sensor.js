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

		xPoints: PropTypes.array,
		chartProps: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string,
				color: PropTypes.string,
				bandWidth: PropTypes.number,
				points: PropTypes.array.isRequired,

				axix: PropTypes.string,
				axisIndex: PropTypes.number,
				axisCount: PropTypes.number,
				yPrefix: PropTypes.any,
				yPostfix: PropTypes.any,

				type: PropTypes.string,
				typeIndex: PropTypes.number,
				typeCount: PropTypes.number,
			})
		),

		sticky: PropTypes.bool,
	}

	state = initialState

	getX = (mouseX) => {
		const {x} = findClosestPoint(this.props.xPoints, +this.props.xScale.invert(mouseX))
		return Number.isFinite(x) ? x : undefined
	}

	getYs = (mouseX) => {
		const {chartProps} = this.props
		const x = this.getX(mouseX)
		return chartProps
			.map((props, index) => {
				const point = this.props.sticky
					? findClosestPoint(props.points, x)
					: findPoint(props.points, x)
				return {...props, ...(point || {})}
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
