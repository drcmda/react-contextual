import React from 'react'
import PropTypes from 'prop-types'
import Context from './context'

export function subscribe(...args) {
    let contextRefs = Context, mapContextToProps = store => store
    if (args.length === 1) {
        args[0] && (mapContextToProps = args[0])
    } else if (args.length === 2) {
        contextRefs = args[0]
        args[1] && (mapContextToProps = args[1])
    }
    return Wrapped => props => {
        const isArray = Array.isArray(contextRefs)
        const array = isArray ? contextRefs : [contextRefs]
        const values = []
        return [...array, Wrapped].reduceRight((accumulator, Context) => (
            <Context.Consumer>
                {value => {
                    isArray && values.push(value)
                    return accumulator !== Wrapped ? (
                        accumulator
                    ) : (
                        <Wrapped {...props} {...mapContextToProps(isArray ? values : value, props)} />
                    )
                }}
            </Context.Consumer>
        ))
    }
}

export class Subscribe extends React.PureComponent {
    static propTypes = {
        to: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
        select: PropTypes.func,
        children: PropTypes.func.isRequired,
    }
    static defaultProps = { to: Context, select: store => store }
    render() {
        const { to, select, children } = this.props
        const Sub = subscribe(to, select)(props => children(props))
        return <Sub />
    }
}
