import React from 'react'
import PropTypes from 'prop-types'
import ProviderContext, { getNamedContext, resolveContext } from './context'

export function subscribe(...args) {
    return Wrapped =>
        function SubscribeWrap(props) {
            // Filter undefined args (can happen if Subscribe injects them)
            args = args.filter(a => a)
            let contextRefs = ProviderContext,
                mapContextToProps = props => props
            if (args.length === 1) {
                // Check if the argument is a valid context first, if not, assume mapContextToProps
                if (resolveContext(args[0], props, null)) contextRefs = args[0]
                else mapContextToProps = args[0]
            } else if (args.length === 2) {
                // subscribe(Context, mapContextToProps)
                contextRefs = args[0]
                mapContextToProps = args[1]
            }
            if (typeof mapContextToProps !== 'function') {
                // 'theme' or ['theme', 'user', 'language']
                const values = mapContextToProps
                mapContextToProps = (...args) =>
                    Array.isArray(values)
                        ? values.reduce((acc, key, index) => ({ ...acc, [key]: args[index] }), {})
                        : { [values]: args[0] }
            }
            contextRefs = (Array.isArray(contextRefs) ? contextRefs : [contextRefs]).map(context =>
                resolveContext(context, props),
            )
            let values = []
            return [...contextRefs, Wrapped].reduceRight((accumulator, Context) => (
                <Context.Consumer>
                    {value => {
                        values.push(value)
                        if (accumulator === Wrapped) {
                            const wrap = <Wrapped {...props} {...mapContextToProps(...values, props)} />
                            return (values = []) && wrap
                        } else return accumulator
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
        select: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        children: PropTypes.func.isRequired,
    }
    static defaultProps = { to: ProviderContext, select: props => props }
    render() {
        const { to, select, children } = this.props
        const Sub = subscribe(to, select)(props => children(props))
        return <Sub />
    }
}
