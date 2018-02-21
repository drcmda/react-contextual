import React from 'react'
import PropTypes from 'prop-types'
import ProviderContext, { createNamedContext, removeNamedContext } from './context'

export class RenderPure extends React.PureComponent {
    render() {
        return this.props.children
    }
}

export class Provider extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string,
        initialState: PropTypes.object.isRequired,
        actions: PropTypes.object,
    }
    constructor(props) {
        super()
        this.state = props.initialState
        this.Context = props.id ? createNamedContext(props.id) : ProviderContext
        if (props.actions) {
            this.actions = Object.keys(props.actions).reduce(
                (acc, name) => ({
                    ...acc,
                    [name]: (...args) =>
                        new Promise(res => {
                            let result = props.actions[name](...args)
                            if (typeof result === 'function')
                                Promise.resolve(result(this.state)).then(state => this.setState(state, res))
                            else this.setState(result, res)
                        }),
                }),
                {},
            )
        }
    }
    componentWillUnmount() {
        if (this.props.id) removeNamedContext(this.props.id)
    }
    render() {
        const { state, actions, props, Context } = this
        const { children, id, actions: _, initialState, ...rest } = props
        const value = { ...state, ...(actions ? { actions } : {}), ...rest }
        return <Context.Provider value={value} children={<RenderPure children={children} />} />
    }
}
