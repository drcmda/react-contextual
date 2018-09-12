import React from 'react'
import PropTypes from 'prop-types'
import uuid from 'tiny-uuid'
import ProviderContext, {
  createNamedContext,
  removeNamedContext,
} from './context'

export function createStore(state, id = uuid()) {
  const result = {
    id,
    initialState: { ...state },
    state,
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

function getStateUpdateFunctions(state) {
  return Object.keys(state)
    .filter(name => typeof state[name] === 'function')
    .reduce(
      (acc, name) => {
        acc[name] = state[name]
        return acc
      },
      {
        setState: props => props,
      }
    )
}

export class RenderPure extends React.PureComponent {
  render() {
    return this.props.children
  }
}

export class Provider extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    state: PropTypes.object,
    store: PropTypes.object,
  }

  constructor(props) {
    super()
    const { store, children, id, ...state } = props
    this.store = store || createStore(state, id)
    // When no store is given, create context by id or refer to the default context
    if (!store)
      this.store.context = id ? createNamedContext(id) : ProviderContext
    // Overwrite the functions in store.state to update the state of this Provider
    const actions = getStateUpdateFunctions(this.store.initialState)
    Object.assign(
      this.store.state,
      Object.keys(actions).reduce(
        (acc, name) => ({
          ...acc,
          [name]: (...args) => {
            let result = actions[name](...args)
            let isFunc = typeof result === 'function'
            if (isFunc) result = result(this.state)
            if (result.then) {
              return new Promise((res, rej) =>
                Promise.resolve(result).then(state => {
                  // Update store
                  this.store.state = { ...this.store.state, ...state }
                  // Call subscribers
                  this.store.subscriptions.forEach(callback => callback(state))
                  // Update local state
                  this.setState(state, res)
                }).catch(rej)
              )
            } else {
              // Update store in sync
              this.store.state = { ...this.store.state, ...result }
              this.store.subscriptions.forEach(callback => callback(result))
              this.setState(result)
              return true
            }
          },
        }),
        {}
      )
    )
    this.state = this.store.state
  }

  componentWillUnmount() {
    if (this.props.id) removeNamedContext(this.props.id)
  }
  render() {
    return (
      <this.store.context.Provider
        value={this.state}
        children={<RenderPure children={this.props.children} />}
      />
    )
  }
}
