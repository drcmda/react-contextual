import React from 'react'
import PropTypes from 'prop-types'
import DefaultContext, { getNamedContext, resolveContext } from './context'

export function subscribe(...args) {
    // Filter undefined args (can happen if Subscribe injects them)
    args = args.filter(a => a)
    let contextRefs = DefaultContext,
        mapContextToProps = props => props
    if (args.length === 1) {
        // subscribe(mapContextToProps): default context, custom mapContextToProps
        mapContextToProps = args[0]
    } else if (args.length === 2) {
        // subscribe(Context, mapContextToProps): custom context, custom mapContextToProps
        contextRefs = args[0]
        mapContextToProps = args[1]
    }
    return Wrapped => props => {
        const isArray = Array.isArray(contextRefs)
        const array = (isArray ? contextRefs : [contextRefs]).map(context => resolveContext(context, props))
        let result, values = []
        return [...array, Wrapped].reduceRight((accumulator, Context) => (
            <Context.Consumer>
                {value => {
                    isArray && values.push(value)
                    result = accumulator === Wrapped 
                        ? <Wrapped {...props} {...mapContextToProps(isArray ? values : value, props)} />
                        : accumulator
                    if (isArray && accumulator === Wrapped) values = []
                    return result
                }}
            </Context.Consumer>
        ))
    }
}

export class Subscribe extends React.PureComponent {
    static propTypes = {
        to: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func])),
            PropTypes.object,
            PropTypes.string,
            PropTypes.func,
        ]),
        select: PropTypes.func,
        children: PropTypes.func.isRequired,
    }
    static defaultProps = { to: DefaultContext, select: props => props }
    render() {
        const { to, select, children } = this.props
        const Sub = subscribe(to, select)(props => children(props))
        return <Sub />
    }
}
