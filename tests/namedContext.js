import React from 'react'
import { namedContext, subscribe, Subscribe } from '../src/'

test('keyed context', async () => {
    const Provider = namedContext('testKeyed')(({ context, children }) => <context.Provider value="1" children={children} />)
    const Test = subscribe('testKeyed', 'count')(props => props.count)
    await snapshot(
        <Provider>
            <Test />
            <Subscribe to="testKeyed" select="count" children={props => props.count} />
        </Provider>,
    )
})

test('functional context', async () => {
    const Provider = namedContext(props => props.id)(({ context, children }) => <context.Provider value="1" children={children} />)
    const Test = subscribe(props => props.id, 'count')(props => props.count)
    await snapshot(
        <Provider id="testFunc">
            <Test id="testFunc"/>
            <Subscribe to="testFunc" select="count" children={props => props.count} />
        </Provider>,
    )
})