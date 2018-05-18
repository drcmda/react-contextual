import React from 'react'
import {
  Provider,
  createStore,
  ProviderContext,
  Subscribe,
  subscribe,
  moduleContext,
} from '../src/'

Object.entries({
  'subscribe()': {},
  'subscribe(store => store)': { select: store => store },
  'subscribe(ProviderContext)': { to: ProviderContext },
  'subscribe(ProviderContext, context => context)': {
    to: ProviderContext,
    select: context => context,
  },
  'subscribe("key", store => store)': { id: 'key', select: store => store },
  'subscribe("key")': { id: 'key' },
}).forEach(([key, value]) =>
  test(key, async () => {
    let { id, to, select } = value
    const store = { message: 'success!' }
    const Test = subscribe(to || id, select)(props => props.message)
    await snapshot(
      <Provider id={id} {...store}>
        <Test id={id} />
        <Subscribe
          id={id}
          to={to || id}
          select={select}
          children={props => props.message}
        />
      </Provider>
    )
  })
)
Object.entries({
  'subscribe("state")': { select: 'state' },
  'subscribe(ProviderContext, "state")': {
    to: ProviderContext,
    select: 'state',
  },
  'subscribe("key", "state")': { id: 'key', select: 'state' },
}).forEach(([key, value]) =>
  test(key, async () => {
    let { id, to, select } = value
    const store = { message: 'success!' }
    const Test = subscribe(to || id, select)(props => props.state.message)
    await snapshot(
      <Provider id={id} {...store}>
        <Test id={id} />
        <Subscribe
          id={id}
          to={to || id}
          select={select}
          children={props => props.state.message}
        />
      </Provider>
    )
  })
)

const store = createStore({ message: 'success!' }, 'testStore')
Object.entries({
  'subscribe(store)': { store, to: store },
  'subscribe(store, context => context)': {
    store,
    to: store,
    select: context => context,
  },
}).forEach(([key, value]) =>
  test(key, async () => {
    let { to, select, store } = value
    const Test = subscribe(to, select)(props => props.message)
    await snapshot(
      <Provider store={store}>
        <Test />
        <Subscribe to={to} select={select} children={props => props.message} />
      </Provider>
    )
  })
)

Object.entries({
  'subscribe(store, "state")': { store, to: store, select: 'state' },
}).forEach(([key, value]) =>
  test(key, async () => {
    let { id, to, select, store } = value
    const Test = subscribe(to || id, select)(props => props.state.message)
    await snapshot(
      <Provider store={store}>
        <Test />
        <Subscribe
          to={to || id}
          select={select}
          children={props => props.state.message}
        />
      </Provider>
    )
  })
)

Object.entries({
  'subscribe(AnyContextObjectValue)': {},
  'subscribe(AnyContextSingleValue)': { state: 'success' },
  'subscribe(AnyContext, context => context)': { select: context => context },
  'subscribe(AnyContext, "context")': { select: 'context' },
}).forEach(([key, value]) =>
  test(key, async () => {
    let { state, select } = value
    state = state || { context: 'success!' }
    const AnyContext = moduleContext()(props => (
      <props.context.Provider value={state} children={props.children} />
    ))
    const Test = subscribe(AnyContext, select)(
      props => props.context.context || props.context
    )
    await snapshot(
      <AnyContext>
        <Test />
        <Subscribe
          to={AnyContext}
          select={select}
          children={props => props.context.context || props.context}
        />
      </AnyContext>
    )
  })
)

test('subscribe([a,b], (a,b) => props)', async () => {
  const store = { count: 0, up: () => state => ({ count: state.count + 1 }) }
  const Test = subscribe(['id1', 'id2'], (store1, store2) => ({
    store1,
    store2,
  }))(props => (
    <button onClick={() => props.store1.up() && props.store2.up()}>
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
    tree => tree.find('button').simulate('click')
  )
})

test('subscribe([a,b], [a,b])', async () => {
  const store = { count: 0, up: () => state => ({ count: state.count + 1 }) }
  const Test = subscribe(['id1', 'id2'], ['store1', 'store2'])(props => (
    <button onClick={() => props.store1.up() && props.store2.up()}>
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
    tree => tree.find('button').simulate('click')
  )
})
