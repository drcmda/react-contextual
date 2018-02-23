import React from 'react'
import { createNamedContext } from './context'

export default function moduleContext(initialState) {
    return Wrapped => {
        let context = undefined
        const ModuleContext = class extends React.PureComponent {
            render() {
                return <Wrapped {...this.props} context={context} />
            }
        }
        context = createNamedContext(ModuleContext, initialState)
        return ModuleContext
    }
}