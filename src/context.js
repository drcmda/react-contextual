import React from 'react'

export default function context(contexts, mapContextToProps) {
    return Wrapped => props => {
        const isArray = Array.isArray(contexts)
        const array = isArray ? contexts : [contexts]
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
