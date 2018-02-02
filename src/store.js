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
        actions: PropTypes.object,
        renderOnce: PropTypes.bool,
    }
    static defaultProps = { renderOnce: true }
    constructor(props) {
        super()
        this.state = props.initialState || {}
        if (props.actions) {
            this.actions = Object.keys(props.actions).reduce(
                (acc, name) => ({ ...acc, [name]: (...args) => this.setState(props.actions[name](...args)) }),
                {},
            )
        }
    }
    render() {
        const { state, actions, props } = this
        const value = { ...state, ...(actions ? { actions } : {}) }
        return (
            <Context.Provider value={value}>
                {props.renderOnce ? <RenderOnce children={props.children} /> : props.children}
            </Context.Provider>
        )
    }
}