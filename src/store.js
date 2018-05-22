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
    state: {
      setState: props => props,
      ...state,
    },
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
    setState: changes => {
      result.state = { ...result.state, ...changes }
      result.subscriptions.forEach(callback => callback(result.state))
    },
    wrapActions: next => {
      result.state = {
        ...result.state,
        ...wrapStateUpdateFunctions(result.state, result, next),
      }
    },
  }

  result.wrapActions(result.setState)

  return result
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
    acc[name] = (...args) => {
      let result = actions[name](...args)
      let isFunc = typeof result === 'function'
      if (isFunc) result = result(store.state)
      if (result.then) {
        return new Promise(res =>
          Promise.resolve(result)
            .then(value => callback(value, name))
            .then(res)
        )
      } else {
        return callback(result, name)
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

    let internalState = this.store.state

    // When a store was given
    // additional state is a different "initialState"
    if (store) {
      internalState = {
        ...internalState,
        ...state,
      }
    }

    // Changes to shadowed values in internal state will still propagate
    // to the external store
    const boundActions = wrapStateUpdateFunctions(
      internalState,
      this,
      changes => this.setState(changes)
    )

    this.state = {
      ...internalState,
      ...boundActions,
    }
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
