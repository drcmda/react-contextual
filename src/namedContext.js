import React from 'react'
import {
  resolveContext,
  createNamedContext,
  removeNamedContext,
} from './context'

export default function namedContext(contextName, initialState) {
  return Wrapped =>
    class NamedContext extends React.PureComponent {
      constructor(props) {
        super()
        this.name =
          typeof contextName === 'function' ? contextName(props) : contextName
        this.state = { context: createNamedContext(this.name, initialState) }
      }
      componentWillUnmount() {
        removeNamedContext(this.name)
      }
      render() {
        return <Wrapped {...this.props} context={this.state.context} />
      }
    }
}
