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
	getLineProps = (children = this.props.children) => {
		return this.getChartProps(children)
			.filter(({type}) => type === "Line")
	}
	getBarProps = (children = this.props.children) => {
		return this.getChartProps(children)
			.filter(({type}) => type === "Bar")
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
			width, height,
			padding: this.getPadding(),
			chartProps: this.getChartProps(),
			lineProps: this.getLineProps(),
			barProps: this.getBarProps(),
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
			xScale: d3.scaleBand()
				.domain(xDomain)
				.range([padding.left, width - padding.right])
				.padding(this.getBarProps().length ? 0.2 : 0)
				.align(0.5),
			yScale: d3.scaleLinear()
				.domain(yDomain)
				.range([height - padding.bottom, padding.top])
				.nice(),
		}
	}
	getDomains = () => {
		const points = this.getChartProps()
			.reduce((points, {pointList = Immutable.List()}) => points.concat(pointList.toJS()), [])
			.filter((point) => point)

		const xs = [...new Set(
			points
				.filter(({y}) => Number.isFinite(y))
				.map(({x}) => x || 0)
				.sort((xA, xB) => {
					if (xA > xB) return 1
					if (xA < xB) return -1
					return 0
				})
		)]
		const ys = points.map(({y}) => y || 0)

		return {
			xDomain: xs,
			yDomain: d3.extent([0, ...ys]),
		}
	}

}

export default LinearChart
