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
    return result || context || Context
}

export default Context