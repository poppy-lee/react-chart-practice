import * as d3 from "d3"

import Immutable from "immutable"
import PropTypes from "prop-types"
import React from "react"

class LinearChart extends React.Component {

	static propTypes = {
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		padding: PropTypes.string,
		paddingTop: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		paddingRight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		paddingBottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		paddingLeft: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
	}

	static defaultProps = {
		width: 0,
		height: 0,
	}

	getChartProps = (children = this.props.children) => {
		return [].concat(children || [])
			.filter(({props = {}}) => props.pointList)
			.map(({type, props = {}}, index) => ({type: type.name, name: `y${index + 1}`, ...props}))
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

  render() {
		const {width, height} = this.props

		const ChildComponents = this.setChildProps(this.props.children, {
			width, height, padding: this.getPadding(),
			getX: this.getX,
			getYs: this.getYs,
			...this.getScales(),
		})

    return (
			<svg
				width={String(width)} height={String(height)}
				style={{border: "1px solid black"}}
			>
				{ChildComponents}
			</svg>
    )
  }

	getX = (mouseX) => {
		const {xScale} = this.getScales()
		return this.getClosestElement(this.getUniqueXs(), +xScale.invert(mouseX))
	}
	getYs = (mouseX) => {
		const x = this.getX(mouseX)
		return this.getChartProps()
			.map((props, index) => {
				const pointList = props.pointList || Immutable.List()
				const point = pointList.find((point) => Immutable.Map(point).get("x") === x)
				return {...props, ...Immutable.Map(point).toObject()}
			})
			.filter(({x, y}) => Number.isFinite(x) && Number.isFinite(y))
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
		const {xDomain, yDomain} = this.getDomains()

		return {
			xScale: d3.scaleLinear()
				.domain(xDomain)
				.range([padding.left + 10, width - padding.right - 10]),
			yScale: d3.scaleLinear()
				.domain(yDomain)
				.range([height - padding.bottom, padding.top])
				.nice(),
		}
	}

	getDomains = () => {
		return {
			xDomain: d3.extent(this.getUniqueXs()),
			yDomain: d3.extent([0, ...this.getUniqueYs()]),
		}
	}

	getUniqueXs = () => {
		const points = this.getChartProps()
			.reduce((points, {pointList = Immutable.List()}) => points.concat(pointList.toJS()), [])
			.filter((point) => point && Number.isFinite(point.y))
		return [...new Set(points.map(({x}) => x || 0))]
			.sort((a, b) => {
				if (a > b) return 1
				if (a < b) return -1
				return 0
			})
	}
	getUniqueYs = () => {
		const points = this.getChartProps()
			.reduce((points, {pointList = Immutable.List()}) => points.concat(pointList.toJS()), [])
			.filter((point) => point && Number.isFinite(point.y))
		return [...new Set(points.map(({y}) => y || 0))]
			.sort((a, b) => {
				if (a > b) return 1
				if (a < b) return -1
				return 0
			})
	}

	getClosestElement = (iteratable, targetValue) => {
		return iteratable.reduce((closest, current) => {
			return Math.abs(current - targetValue) < Math.abs(closest - targetValue) ? current : closest
		})
	}

}

export default LinearChart
