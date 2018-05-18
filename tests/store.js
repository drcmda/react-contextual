import React from 'react'
import delay from 'delay'
import {
  createStore,
  Provider,
  ProviderContext,
  Subscribe,
  subscribe,
  getNamedContext,
} from '../src/'

const store = {
  count: 0,
  simple: arg => ({ count: arg }),
  functional: arg => state => ({ count: state.count + arg }),
  async: arg => async state => {
    await delay(1)
    return { count: state.count + arg }
  },
}

it('renders properly', async () => {
  const Test = subscribe()(props => props.count)
  await snapshot(
    <Provider count={0}>
      <Test />
    </Provider>
  )
})

test('mount/unmount', async () => {
  const Test = subscribe('store', props => props)(props => props.count)
  const App = class extends React.PureComponent {
    state = { show: true }
    componentDidMount() {
      expect(getNamedContext('store')).toBeTruthy()
      this.setState({ show: false })
    }
    componentDidUpdate() {
      expect(getNamedContext('store')).toBe(undefined)
    }
    render() {
      return this.state.show ? (
        <Provider {...store}>
          <Provider id="store" {...store}>
            <Test />
          </Provider>
        </Provider>
      ) : null
    }
  }
  await snapshot(<App />)
})

test('no actions, setState', async () => {
  const Test = subscribe()(props => (
    <button
      onClick={() => props.setState(state => ({ count: state.count + 1 }))}>
      {props.count}
    </button>
  ))
  await snapshot(
    <Provider count={0}>
      <Test />
    </Provider>,
    tree => tree.find('button').simulate('click')
  )
})

test('simple action', async () => {
  const Test = subscribe()(props => (
    <button onClick={() => props.simple(1)}>{props.count}</button>
  ))
  await snapshot(
    <Provider {...store}>
      <Test />
    </Provider>,
    tree => tree.find('button').simulate('click')
  )
})

test('functional action', async () => {
  const Test = subscribe()(props => (
    <button onClick={() => props.functional(1)}>{props.count}</button>
  ))
  await snapshot(
    <Provider {...store}>
      <Test />
    </Provider>,
    tree => tree.find('button').simulate('click')
  )
})

test('async action', async () => {
  const Test = subscribe()(props => (
    <button onClick={() => props.async(1)}>{props.count}</button>
  ))
  await snapshot(
    <Provider {...store}>
      <Test />
    </Provider>,
    tree => tree.find('button').simulate('click')
  )
})

test('await actions & access state', async () => {
  const Test = subscribe()(
    class extends React.PureComponent {
      render() {
        return (
          <div>
            {this.props.count}
            <button
              onClick={async () => {
                await this.props.simple(this.props.count + 1)
                await this.props.functional(this.props.count)
                await this.props.async(this.props.count)
              }}
            />
          </div>
        )
      }
    }
  )
  await snapshot(
    <Provider {...store}>
      <Test />
    </Provider>,
    tree => tree.find('button').simulate('click')
  )
})

test('external store', async () => {
  const externalStore = createStore(store, 'externalTest')
  const Test = subscribe(externalStore)(props => (
    <button onClick={() => props.async(1)}>{props.count}</button>
  ))
  await snapshot(
    <Provider store={externalStore}>
      <Test />
    </Provider>,
    async () => {
      await externalStore.getState().async(1)
      expect(externalStore.getState().count).toBe(1)
      const remove = externalStore.subscribe(state =>
        expect(state.count).toBe(2)
      )
      await externalStore.getState().async(1)
      remove()
      externalStore.destroy()
      expect(externalStore.subscriptions.size).toBe(0)
      expect(getNamedContext('externalTest')).toBeUndefined()
    }
  )
})

test('external store, setState', async () => {
  const externalStore = createStore({ count: 0 }, 'externalTest2')
  const Test = subscribe(externalStore)(props => (
    <button
      onClick={() => props.setState(state => ({ count: state.count + 1 }))}>
      {props.count}
    </button>
  ))
  await snapshot(
    <Provider store={externalStore}>
      <Test />
    </Provider>,
    tree => tree.find('button').simulate('click')
  )
})
