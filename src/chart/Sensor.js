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
		childProps: PropTypes.array,
		xScale: PropTypes.func,
		yScale: PropTypes.func,
	}

	state = initialState

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

	setData = ({mouseX, mouseY, x, ys} = initialState) => {
		if (this.prevX !== x) {
			this.prevX = x
			this.setState({mouseX, mouseY, x, ys})
		}
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
					onMouseEnter={this.onMouseEvent(this.setData)}
					onMouseMove={this.onMouseEvent(this.setData)}
					onMouseLeave={() => this.setData()}
				/>
				{ChildComponents}
			</g>
		)
	}

	onMouseEvent = (callback) => {
		return ({clientX, clientY}) => {
			const mouseX = clientX - this.refs["sensor"].getBoundingClientRect().left
			const mouseY = clientY - this.refs["sensor"].getBoundingClientRect().top
			const x = this.getClosestX(mouseX)
			const ys = this.getPoints(mouseX)

			callback({mouseX, mouseY, x, ys})
		}
	}

	getPoints = (mouseX) => {
		const {childProps} = this.props
		return childProps
			.map((props, index) => {
				const pointList = props.pointList || Immutable.List()
				const point = pointList.find((point) => Immutable.Map(point).get("x") === this.getClosestX(mouseX))
				return {...props, ...Immutable.Map(point).toObject()}
			})
			.filter(({x, y}) => isFinite(x) && isFinite(y))
	}

	getClosestX = (mouseX) => {
		const {xScale, childProps} = this.props
		const xs = [...new Set(
			childProps
				.reduce((points, {pointList = Immutable.List()}) => points.concat(pointList.toJS()), [])
				.filter(({y}) => y)
				.map(({x}) => x || 0)
				.sort((xA, xB) => xA - xB)
		)]

		return this.getClosestElement(xs, +xScale.invert(mouseX))
	}

	getClosestElement = (iteratable, targetValue) => {
		return iteratable.reduce((closest, current) => {
			return Math.abs(current - targetValue) < Math.abs(closest - targetValue) ? current : closest
		})
	}

}

export default Sensor
