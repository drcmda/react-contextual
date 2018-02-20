import React from 'react'
import { subscribe } from './subscribe'
import { resolveContext } from './context'

export default function transformContext(context, transform) {
    return Wrapped => {
        return subscribe(context, transform)(class extends React.PureComponent {
            render() {
                const context = resolveContext(context, this.props)
                return <Wrapped {...this.props} context={context} />
            }
        })
    }
}