import 'raf/polyfill'
import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import Enzyme, { shallow, mount } from 'enzyme'
import delay from 'delay'
import { Provider, Context, Subscribe, subscribe } from '../src/'

Enzyme.configure({ adapter: new Adapter() })

const store = {
    initialState: { count: 0 },
    actions: { up: () => state => ({ count: state.count + 1 }) },
}

async function snapshot(Root, mutation) {
    const tree = mount(Root)
    expect(tree).toMatchSnapshot()
    if (mutation) {
        mutation(tree)
        await delay(30)
        tree.update()
        expect(tree).toMatchSnapshot()
    }
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

test('subscribe(Context, props => props)', async () => {
    const Test = subscribe(Context, props => props)(props => <button onClick={props.actions.up}>{props.count}</button>)
    await snapshot(
        <Provider {...store}>
            <Test />
            <Subscribe to={Context} select={props => props} children={props => props.count} />
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
                    children={props => props.store1.count + " " + props.store2.count}
                />
            </Provider>
        </Provider>,
        tree => tree.find('button').simulate('click'),
    )
})
