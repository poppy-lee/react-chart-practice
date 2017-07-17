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
		chartProps: PropTypes.array,
	}

	state = initialState

	getClosestElement = (iteratable = [], targetValue = 0) => {
		return iteratable.reduce((closest, current) => {
			return Math.abs(current - targetValue) < Math.abs(closest - targetValue) ? current : closest
		})
	}

	getX = (mouseX) => {
		const {xScale, xs} = this.props
		return this.getClosestElement(xs, +xScale.invert(mouseX))
	}

	getYs = (mouseX) => {
		const {chartProps} = this.props
		const x = this.getX(mouseX)

		return chartProps
			.map((props, index) => {
				const pointList = props.pointList || Immutable.List()
				const point = pointList.find((point) => Immutable.Map(point).get("x") === x)
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
		return Number.isFinite(mouseX + mouseY) && ys
	}

	renderChildComponents = (props) => {
		return this.shouldRenderChildComponents()
			? [].concat(this.props.children || [])
				.map((child, index) => {
					child = child || {type: () => null, props: null}
					return <child.type key={`sensor-child-${index}`} {...Object.assign({}, props, child.props)} />
				})
			: null
	}

}

export default Sensor
