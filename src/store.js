import React from 'react'
import PropTypes from 'prop-types'
import uuid from 'tiny-uuid'
import ProviderContext, { createNamedContext, removeNamedContext } from './context'

export function createStore(data, id = uuid()) {
    const { initialState, actions, ...props } = data
    const subscriptions = new Set()
    const result = {
        subscriptions,
        initialState,
        state: initialState,
        actions,
        props,
        id,
        context: createNamedContext(id),
        destroy: () => {
            removeNamedContext(id)
            subscriptions.clear()
        },
        subscribe: callback => {
            subscriptions.add(callback)
            return () => subscriptions.delete(callback)
        },
        getState: () => result.state
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

    update = done => {
        // Update store
        this.store.state = this.state
        // Call subscribers
        this.store.subscriptions.forEach(value => value(this.store.state))
        // Resolve
        done()
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
                    [name]: (...args) =>
                        new Promise(res => {
                            let result = actions[name](...args)
                            if (typeof result === 'function')
                                Promise.resolve(result(this.state)).then(state =>
                                    this.setState(state, () => this.update(res)),
                                )
                            else this.setState(result, () => this.update(res))
                        }),
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
