import React from 'react'
import { subscribe } from './subscribe'
import { resolveContext } from './context'

export default function transformContext(context, transform) {
  return Wrapped => {
    return subscribe(context, transform)(
      class TransformContext extends React.PureComponent {
        render() {
          return (
            <Wrapped
              {...this.props}
              context={resolveContext(context, this.props)}
            />
          )
        }
      }
    )
  }
}
