import * as d3 from "d3"

import React from "react"
import PropTypes from "prop-types"

import D3Component from "../D3Component"

class ScaleLinear extends D3Component {

	static propTypes = {
		root: PropTypes.object,
		svg: PropTypes.object,
		width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		padding: PropTypes.object,

		dataList: PropTypes.array,
		xDomain: PropTypes.array,
		yDomain: PropTypes.array,
		zDomain: PropTypes.array,
	}

	render() {
		const {
			root, svg, width, height, padding,
			dataList,
			children = []
		} = this.props

		const domains = this.getDomains()
		const scales = this.getScales()

		const ChildComponents = this.injectProps(children, {
			root, svg, width, height, padding, dataList,
			domains, scales
		})

		return dataList.length ? (
			<g>{ChildComponents}</g>
		) : null
	}

	getDomains = () => {
		const {
			dataList,
			xDomain, yDomain, zDomain,
		} = this.props

		const allPoints = dataList
			.filter((data) => !data.hide)
			.reduce((allPoints, {points}) => allPoints.concat(points || []), [])

		const allX = [...new Set(allPoints.map(({x}) => x))].sort()
		const allY = [...new Set(allPoints.map(({y}) => y))].sort()
		const allZ = [...new Set(allPoints.map(({z}) => z))].sort()

		return {
			allX, allY, allZ,
			xDomain: xDomain || (1 < allX.length ? d3.extent(allX) : [allX[0] - 1, allX[0] + 1]),
			yDomain: yDomain || [Math.min(0, ...allY), Math.max(0, ...allY)],
			zDomain: zDomain || d3.extent(allZ),
		}
	}

	getScales = () => {
		const {width, height, padding} = this.props
		const {xDomain, yDomain, zDomain} = this.getDomains()

		return {
			xScale: d3.scaleLinear()
				.domain(xDomain)
				.rangeRound([padding.left + 10, width - padding.right - 10]),
			yScale: d3.scaleLinear()
				.domain(yDomain)
				.rangeRound([height - padding.bottom, padding.top])
				.nice(),
			zScale: d3.scaleSqrt()
				.domain(zDomain)
				.rangeRound([1, 50]),
		}
	}

}

export default ScaleLinear
