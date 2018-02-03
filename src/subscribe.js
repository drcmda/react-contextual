import React from 'react'
import PropTypes from 'prop-types'
import DefaultContext, { getNamedContext } from './context'

export function subscribe(...args) {
    // Filter undefined args (can happen if Subscribe injects them)
    args = args.filter(a => a)
    // Get context refs
    const contextRefs = args.find(arg => typeof arg !== 'function') || DefaultContext
    // Get mapping function
    const mapContextToProps = args.find(arg => typeof arg === 'function') || (props => props)
    return Wrapped => props => {
        const isArray = Array.isArray(contextRefs)
        const array = (isArray ? contextRefs : [contextRefs]).map(
            context => (typeof context === 'string' ? getNamedContext(context) : context),
        )
        const values = []
        return [...array, Wrapped].reduceRight((accumulator, Context) => (
            <Context.Consumer>
                {value => {
                    isArray && values.push(value)
                    return accumulator !== Wrapped 
                        ? accumulator
                        : <Wrapped {...props} {...mapContextToProps(isArray ? values : value, props)} />
                }}
            </Context.Consumer>
        ))
    }
}

export class Subscribe extends React.PureComponent {
    static propTypes = {
        to: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])), 
            PropTypes.object, 
            PropTypes.string
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
