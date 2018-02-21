import React from 'react'
import { moduleContext, subscribe, Subscribe } from '../src/'

it('renders properly', async () => {
    const Provider = moduleContext()(({ context, children }) => <context.Provider value="1" children={children} />)
    const Test = subscribe(Provider, 'count')(props => props.count)
    await snapshot(
        <Provider>
            <Test />
            <Subscribe to={Provider} select="count" children={props => props.count} />
        </Provider>,
    )
})