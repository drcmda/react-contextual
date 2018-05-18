import React from 'react'

const createContext = React.createContext
const providers = new Map()
const ProviderContext = createContext()

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

export function resolveContext(
  context,
  props,
  defaultContext = ProviderContext
) {
  if (context && context.Provider && context.Consumer) return context

  let result
  if (typeof context === 'function') {
    // Test against component-symbol first, then assume a user function
    result = getNamedContext(
      context
    ) /*|| resolveContext(context(props), props, defaultContext)*/
  } else if (typeof context === 'string') {
    result = getNamedContext(context)
  } else if (typeof context === 'object') {
    result = context.context
  }
  return result && result.Provider && result.Consumer ? result : defaultContext
}

export default ProviderContext
