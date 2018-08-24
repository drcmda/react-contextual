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

  result.state = createState(result, {
    setState: props => props,
    ...state,
  })

  return result
}

function createState(store, initialState) {
  const setState = changes => {
    store.state = { ...store.state, ...changes }
    store.subscriptions.forEach(callback => callback(changes))
    return true
  }

  return {
    ...initialState,
    ...wrapStateUpdateFunctions(initialState, store, setState),
  }
}

function getStateUpdateFunctions(state) {
  return Object.keys(state)
    .filter(name => typeof state[name] === 'function')
    .reduce((acc, name) => {
      acc[name] = state[name]
      return acc
    }, {})
}

function wrapStateUpdateFunctions(state, store, callback) {
  const actions = getStateUpdateFunctions(state)
  return Object.keys(actions).reduce((acc, name) => {
    const wrapped = actions[name]
    acc[name] = (...args) => {
      let result = wrapped(...args)
      let isFunc = typeof result === 'function'
      if (isFunc) result = result(store.state)
      if (result.then) {
        return Promise.resolve(result).then(callback)
      } else {
        return callback(result)
      }
    }

    return acc
  }, {})
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

    // When no store is given,
    // create context by id or refer to the default context
    if (!store) {
      this.store.context = id ? createNamedContext(id) : ProviderContext
    }

    // When a store was given,
    // additional state could be different "initialState"

    this.state = this.store.state
    this.unsubscribe = this.store.subscribe(state => this.setState(state))
  }

  componentWillUnmount() {
    this.unsubscribe()
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
