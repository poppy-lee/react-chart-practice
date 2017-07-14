import React from "react"

class D3Component extends React.Component {

	componentDidMount() {
		this.draw()
	}

	componentDidUpdate() {
		this.draw()
	}

	render() {
		return null
	}

	// abstract method
	draw = () => {}

	injectProps = (children, props, keyPrefix = "") => {
		const ChildComponents = [].concat(children || []).map((child, index) => {
			child = child || {type: () => null, props: null}

			const _key = keyPrefix ? `${keyPrefix}-${index}` : index
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

		return ChildComponents
	}

}

export default D3Component
