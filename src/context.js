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

export function namedContext(getName, initialState) {
    return Wrapped =>
        class extends React.PureComponent {
            constructor(props) {
                super()
                const name = getName(props)
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

export default Context
