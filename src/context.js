import React from 'react'
import { createContext } from 'react-broadcast'

const providers = new Map()
const Context = createContext()

export function createNamedContext(name, initialState) {
    const context = createContext(initialState)
    providers.set(name, context)
    return context
}

export function getNamedContext(name) {
    return providers.get(name)
}

export function removeNamedContext(name) {
    providers.delete(name)
}

export function resolveContext(context, props) {
    let result
    if (typeof context === 'function') {
        // Test against component-symbol first, then assume a user function
        result = getNamedContext(context) || resolveContext(context(props))
    } else if (typeof context === 'string') {
        result = getNamedContext(context)
    }
    return result || context
}

export function namedContext(contextName, initialState) {
    return Wrapped =>
        class extends React.PureComponent {
            constructor(props) {
                super()
                const name = resolveContext(contextName, props)
                this.state = { context: createNamedContext(name, initialState), name }
            }
            componentWillUnmount() {
                removeNamedContext(this.state.name)
            }
            render() {
                return <Wrapped {...this.props} context={this.state.context} />
            }
        }
}

export function moduleContext(initialState) {
    return Wrapped => {
        let context = undefined
        const Hoc = class extends React.PureComponent {
            render() {
                return <Wrapped {...this.props} context={context} />
            }
        }
        context = createNamedContext(Hoc, initialState)
        return Hoc
    }
}

export default Context
