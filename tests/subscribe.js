import React from 'react'
import { Provider, ProviderContext, Subscribe, subscribe } from '../src/'

const store = {
    initialState: { count: 0 },
    actions: { up: () => state => ({ count: state.count + 1 }) },
}

test('subscribe()', async () => {
    const Test = subscribe()(props => <button onClick={props.actions.up}>{props.count}</button>)
    await snapshot(
        <Provider {...store}>
            <Test />
            <Subscribe children={props => props.count} />
        </Provider>,
        tree => tree.find('button').simulate('click'),
    )
})

test('subscribe(props => props)', async () => {
    const Test = subscribe(props => props)(props => <button onClick={props.actions.up}>{props.count}</button>)
    await snapshot(
        <Provider {...store}>
            <Test />
            <Subscribe select={props => props} children={props => props.count} />
        </Provider>,
        tree => tree.find('button').simulate('click'),
    )
})

test('subscribe(id, props => props)', async () => {
    const Test = subscribe('id', props => props)(props => <button onClick={props.actions.up}>{props.count}</button>)
    await snapshot(
        <Provider id="id" {...store}>
            <Test />
            <Subscribe to="id" select={props => props} children={props => props.count} />
        </Provider>,
        tree => tree.find('button').simulate('click'),
    )
})

test('subscribe(id, name)', async () => {
    const Test = subscribe('id', 'store')(props => (
        <button onClick={props.store.actions.up}>{props.store.count}</button>
    ))
    await snapshot(
        <Provider id="id" {...store}>
            <Test />
            <Subscribe to="id" select={'store'} children={props => props.store.count} />
        </Provider>,
        tree => tree.find('button').simulate('click'),
    )
})

test('subscribe(props => props.id, props => props)', async () => {
    const Test = subscribe(props => props.id, props => props)(props => (
        <button onClick={props.actions.up}>{props.count}</button>
    ))
    await snapshot(
        <Provider id="id" {...store}>
            <Test id="id" />
            <Subscribe to="id" select={props => props} children={props => props.count} />
        </Provider>,
        tree => tree.find('button').simulate('click'),
    )
})

test('subscribe(ProviderContext, props => props)', async () => {
    const Test = subscribe(ProviderContext, props => props)(props => (
        <button onClick={props.actions.up}>{props.count}</button>
    ))
    await snapshot(
        <Provider {...store}>
            <Test />
            <Subscribe to={ProviderContext} select={props => props} children={props => props.count} />
        </Provider>,
        tree => tree.find('button').simulate('click'),
    )
})

test('subscribe([a,b], (a,b) => props)', async () => {
    const Test = subscribe(['id1', 'id2'], (store1, store2) => ({ store1, store2 }))(props => (
        <button onClick={() => props.store1.actions.up() && props.store2.actions.up()}>
            {props.store1.count} {props.store2.count}
        </button>
    ))
    await snapshot(
        <Provider id="id1" {...store}>
            <Provider id="id2" {...store}>
                <Test />
                <Subscribe
                    to={['id1', 'id2']}
                    select={(store1, store2) => ({ store1, store2 })}
                    children={props => props.store1.count + ' ' + props.store2.count}
                />
            </Provider>
        </Provider>,
        tree => tree.find('button').simulate('click'),
    )
})

test('subscribe([a,b], [a,b])', async () => {
    const Test = subscribe(['id1', 'id2'], ['store1', 'store2'])(props => (
        <button onClick={() => props.store1.actions.up() && props.store2.actions.up()}>
            {props.store1.count} {props.store2.count}
        </button>
    ))
    await snapshot(
        <Provider id="id1" {...store}>
            <Provider id="id2" {...store}>
                <Test />
                <Subscribe
                    to={['id1', 'id2']}
                    select={['store1', 'store2']}
                    children={props => props.store1.count + ' ' + props.store2.count}
                />
            </Provider>
        </Provider>,
        tree => tree.find('button').simulate('click'),
    )
})
