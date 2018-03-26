import React from 'react'
import PropTypes from 'prop-types'
import ProviderContext, { getNamedContext, resolveContext } from './context'

const toArray = obj => Array.isArray(obj) ? obj : [obj]

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
                    toArray(values).reduce((acc, key, index) => ({ ...acc, [key]: args[index] }), {})
            }
            contextRefs = toArray(contextRefs).map(context => resolveContext(context, props))
            let values = []
            return [...contextRefs, Wrapped].reduceRight((accumulator, Context, i) => (
                <Context.Consumer>
                    {value => {
                        values[i] = value
                        if (accumulator === Wrapped) {
                            let context = mapContextToProps(...values, props)
                            context = typeof context === 'object' ? context : { context }
                            values = []
                            return <Wrapped {...props} {...context} />
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
        const { to, select, children, ...rest } = this.props
        return React.createElement(subscribe(to, select)(props => children(props)), rest)
    }
}
