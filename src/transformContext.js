import React from 'react'
import { subscribe } from './subscribe'
import { getNamedContext } from './context'

export default function transformContext(context, transform) {
    return Wrapped => {
        return subscribe(context, transform)(class extends React.PureComponent {
            render() {
                return <Wrapped {...this.props} context={getNamedContext(context)} />
            }
        })
    }
}