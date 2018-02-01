import React from 'react'
import PropTypes from 'prop-types'
import Context from './context'

export class RenderOnce extends React.Component {
    shouldComponentUpdate() {
        return false
    }
    render() {
        return this.props.children
    }
}

export class Provider extends React.Component {
    static propTypes = {
        initialState: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        renderOnce: PropTypes.bool,
    }
    static defaultProps = { renderOnce: true }
    constructor(props) {
        super()
        this.state = props.initialState || {}
        this.actions = Object.keys(props.actions).reduce(
            (accumulator, action) => ({
                ...accumulator,
                [action]: (...args) => {
                    const result = props.actions[action](...args)
                    this.setState(typeof result === 'function' ? result(this.state) : result)
                },
            }),
            {},
        )
    }
    render() {
        const value = { ...this.state, actions: this.actions }
        return (
            <Context.Provider value={value}>
                {this.props.renderOnce ? <RenderOnce children={this.props.children} /> : this.props.children}
            </Context.Provider>
        )
    }
}
