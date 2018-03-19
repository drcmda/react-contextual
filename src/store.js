import React from 'react'
import PropTypes from 'prop-types'
import uuid from 'tiny-uuid'
import ProviderContext, { createNamedContext, removeNamedContext } from './context'

export function createStore(data, id = uuid()) {
    const { initialState, actions = { setState: props => props }, ...props } = data
    const result = {
        props,
        id,
        initialState,
        state: initialState,
        actions,
        subscriptions: new Set(),
        context: createNamedContext(id),
        destroy: () => {
            removeNamedContext(id)
            result.subscriptions.clear()
        },
        subscribe: callback => {
            result.subscriptions.add(callback)
            return () => result.subscriptions.delete(callback)
        },
        getState: () => result.state,
    }
    return result
}

export class RenderPure extends React.PureComponent {
    render() {
        return this.props.children
    }
}

export class Provider extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string,
        initialState: PropTypes.object,
        actions: PropTypes.object,
        store: PropTypes.object,
    }

    constructor(props) {
        super()
        const { store, children, id, actions, initialState, ...rest } = props
        this.store = store || createStore({ ...rest, initialState, actions }, id)
        // When no store is given, create context by id or refer to the default context
        if (!store) this.store.context = id ? createNamedContext(id) : ProviderContext
        // Bind actions to setState
        if (this.store.actions) {
            const actions = this.store.actions
            this.store.actions = Object.keys(actions).reduce(
                (acc, name) => ({
                    ...acc,
                    [name]: (...args) => {
                        let result = actions[name](...args)
                        if (typeof result === 'function') result = result(this.state)
                        return new Promise(res =>
                            Promise.resolve(result).then(state => {
                                // Update store
                                this.store.state = { ...this.store.state, ...state }
                                // Call subscribers
                                this.store.subscriptions.forEach(callback => callback(state))
                                // Update local state
                                this.setState(state, res)
                            }),
                        )
                    },
                }),
                {},
            )
        }
        this.state = this.store.initialState
    }
    componentWillUnmount() {
        if (this.props.id) removeNamedContext(this.props.id)
    }
    render() {
        const { actions, props } = this.store
        const value = { ...props, ...this.state, ...(actions ? { actions } : {}) }
        return <this.store.context.Provider value={value} children={<RenderPure children={this.props.children} />} />
    }
}
