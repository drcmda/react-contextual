import React from 'react'
import uuid from 'tiny-uuid'
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

export function namedContext(name = uuid(), initialState) {
    return Wrapped => {
        const context = createNamedContext(name, initialState)
        const hoc = class extends React.PureComponent {
            componentWillUnmount() {
                removeNamedContext(Wrapped.Context)
            }
            render() {
                return <Wrapped {...this.props} context={context} />
            }
        }
        Wrapped.Context = hoc.Context = context
        return hoc
    }
}

export default Context