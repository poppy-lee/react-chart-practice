import * as d3 from "d3"

import React from "react"
import PropTypes from "prop-types"

import D3Component from "./D3Component"

class D3Root extends D3Component {

	static propTypes = {
		width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

		padding: PropTypes.string,
		paddingTop: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		paddingRight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		paddingBottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		paddingLeft: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

		style: PropTypes.object,
	}

	componentDidMount() {
		this.forceUpdate()
	}

	componentWillUpdate() {
		d3.select(this.refs.root).select(".html").remove()
		d3.select(this.refs.svg).selectAll("*").remove()
	}

	render() {
		const {
			width, height,
			children = []
		} = this.props

		const ChildComponents = this.injectProps(children, {
			root: d3.select(this.refs.root),
			svg: d3.select(this.refs.svg),
			width, height,
			padding: this.parsePadding(),
		})

		return (
			<div ref="root" style={Object.assign((this.props.style || {}), {position: "relative"})}>
				<svg ref="svg" width={width} height={height}>
					{ChildComponents}
				</svg>
			</div>
		)
	}

	parsePadding = () => {
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

}

export default D3Root
