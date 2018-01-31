import React from 'react'

export default function context(consumers, mapContextToProps) {
    return Wrapped => props => {
        const isArray = Array.isArray(consumers)
        const array = isArray ? consumers : [consumers]
        const values = []
        return [...array, Wrapped].reduceRight((accumulator, Consumer) => (
            <Consumer>
                {value => {
                    isArray && values.push(value)
                    return accumulator !== Wrapped ? (
                        accumulator
                    ) : (
                        <Wrapped {...props} {...mapContextToProps(isArray ? values : value, props)} />
                    )
                }}
            </Consumer>
        ))
    }
}
