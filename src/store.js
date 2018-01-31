import React from 'react'
import PropTypes from 'prop-types'  
import { createContext } from 'react-broadcast'
import context from './context'

export class RenderOnce extends React.Component {
    shouldComponentUpdate() {
        return false
    }
    render() {
        return this.props.children
    }
}

export const StoreContext = createContext({})

export const connectStore = mapContextToProps => context(StoreContext, mapContextToProps)

export class StoreProvider extends React.Component {
    propTypes = { initialState: PropTypes.object.isRequired, actions: PropTypes.object.isRequired }
    constructor(props) {
        super()
        this.state = props.initialState || {}
        this.actions = Object.keys(props.actions).reduce(
            (acc, name) => ({
                ...acc,
                [name]: (...args) => {
                    const result = props.actions[name](...args)
                    this.setState(typeof result === 'function' ? result(this.state) : result)
                },
            }),
            {},
        )
    }
    render() {
        const value = { state: this.state, actions: this.actions }
        return (
            <StoreContext.Provider value={value}>
                <RenderOnce children={this.props.children} />
            </StoreContext.Provider>
        )
    }
}
