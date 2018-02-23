import React from 'react'
import { Provider, createStore, ProviderContext, Subscribe, subscribe, moduleContext } from '../src/'

const store = createStore({ initialState: { message: 'success!' } }, 'testStore')

Object.entries({
    'subscribe()': {},
    'subscribe(store => store)': { select: store => store },
    'subscribe("state")': { select: 'state' },
    'subscribe(ProviderContext)': { to: ProviderContext },
    'subscribe(ProviderContext, context => context)': { to: ProviderContext, select: context => context },
    'subscribe(ProviderContext, "state")': { to: ProviderContext, select: 'state' },
    'subscribe("key")': { id: 'key', select: 'state' },
    'subscribe("key", store => store)': { id: 'key', select: store => store },
    'subscribe("key", "state")': { id: 'key', select: 'state' },
    'subscribe(store)': { store, to: store },
    'subscribe(store, context => context)': { store, to: store, select: context => context },
    'subscribe(store, "state")': { store, to: store, select: 'state' },
    'subscribe(props => props.id)': { id: 'key', to: props => props.id, select: 'state' },
    'subscribe(props => props.id, store => store)': { id: 'key', to: props => props.id, select: store => store },
    'subscribe(props => props.id, "state")': { id: 'key', to: props => props.id, select: 'state' },
}).forEach(([key, value]) =>
    test(key, async () => {
        let { id, to, select, ...rest } = value
        const store = { initialState: { message: 'success!' } }
        const Test = subscribe(to || id, select)(props => props.message || props.state.message)
        await snapshot(
            <Provider id={id} {...store} {...rest}>
                <Test id={id} />
                <Subscribe
                    id={id}
                    to={to || id}
                    select={select}
                    children={props => props.message || props.state.message}
                />
            </Provider>,
        )
    }),
)

Object.entries({
    'subscribe(AnyContextObjectValue)': {},
    'subscribe(AnyContextSingleValue)': { state: 'success' },
    'subscribe(AnyContext, context => context)': { select: context => context },
    'subscribe(AnyContext, "context")': { select: 'context' },
}).forEach(([key, value]) =>
    test(key, async () => {
        let { state, select } = value
        state = state || { context: 'success!' }
        const AnyContext = moduleContext()(props => <props.context.Provider value={state} children={props.children} />)
        const Test = subscribe(AnyContext, select)(props => props.context.context || props.context)
        await snapshot(
            <AnyContext>
                <Test />
                <Subscribe to={AnyContext} select={select} children={props => props.context.context || props.context} />
            </AnyContext>,
        )
    }),
)
