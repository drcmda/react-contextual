import React from 'react'
import { ProviderContext, getNamedContext, createNamedContext, removeNamedContext, resolveContext } from '../src/'

function isValidContext(context) {
    expect(Object.keys(context)).toEqual(expect.arrayContaining(['Provider', 'Consumer']))
}

it('should always create a valid default context', () => {
    isValidContext(ProviderContext)
})

it('should create and remove a named context', () => {
    const name = 'test'
    createNamedContext(name)
    isValidContext(getNamedContext(name))
    removeNamedContext(name)
    expect(getNamedContext(name)).toBeUndefined()
})

it('should resolve', () => {
    // undefined into the default context
    expect(resolveContext()).toBe(ProviderContext)

    // string keys
    const stringKey = 'test'
    createNamedContext(stringKey)
    isValidContext(resolveContext(stringKey))

    // function keys
    const functionKey = () => stringKey
    isValidContext(resolveContext(functionKey))
    removeNamedContext(stringKey)

    // Stateless components
    const StatelessComponent = props => props.children
    createNamedContext(StatelessComponent)
    isValidContext(resolveContext(StatelessComponent))
    removeNamedContext(StatelessComponent)

    // Stateful components
    const StatefullComponent = class extends React.Component {}
    createNamedContext(StatefullComponent)
    isValidContext(resolveContext(StatefullComponent))
    removeNamedContext(StatefullComponent)
})
