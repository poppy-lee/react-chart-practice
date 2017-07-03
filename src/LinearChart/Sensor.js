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
		chartProps: PropTypes.array,
		xScale: PropTypes.func,
		yScale: PropTypes.func,
	}

	state = initialState

	shouldRenderChildComponents() {
		const {mouseX, mouseY, ys} = this.state
		return Number.isFinite(mouseX + mouseY) && ys
	}

	setChildProps = (children, props, _keyPrefix = "") => {
		return [].concat(children || [])
			.map((child, index) => {
				child = child || {type: () => null, props: null}

				const _key = _keyPrefix ? `${_keyPrefix}-${index}` : index
				const _props = Object.assign({}, props, child.props)
				const _children = _props.children

				switch (true) {
					case _children:
						return this.injectProps(_children, _props, _key)
					case child instanceof Array:
						return this.injectProps(child, _props, _key)
				}

				return <child.type key={_key} {..._props} />
			})
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

		const ChildComponents = this.setChildProps(this.props.children, {
			...this.props,
			...this.state,
		})

		return (
			<g>
				<rect ref="sensor"
					width={String(width)} height={String(height)}
					style={{fill: "none", pointerEvents: "all"}}
					onMouseEnter={this.onMouseEvent}
					onMouseMove={this.onMouseEvent}
					onMouseLeave={() => this.setState(initialState)}
				/>
				{this.shouldRenderChildComponents()
					? ChildComponents
					: null
				}
			</g>
		)
	}

	getX = (mouseX) => {
		const {xScale} = this.props

		const xDomain = xScale.domain()
		const step = xScale.step()
		const [minRange, maxRange] = xScale.range()

		const index = Math.round((mouseX - minRange - xScale.bandwidth() / 2) / step)

		return xDomain[Math.max(0, Math.min(index, xDomain.length - 1))]
	}

	getYs = (mouseX) => {
		const x = this.getX(mouseX)
		return this.props.chartProps
			.map((props, index) => {
				const pointList = props.pointList || Immutable.List()
				const point = pointList.find((point) => Immutable.Map(point).get("x") === x)
				return {...props, ...Immutable.Map(point).toObject()}
			})
			.filter(({x, y}) => Number.isFinite(x) && Number.isFinite(y))
	}

	getClosestElement = (iteratable, targetValue) => {
		return iteratable.reduce((closest, current) => {
			return Math.abs(current - targetValue) < Math.abs(closest - targetValue) ? current : closest
		})
	}

}

export default Sensor
