import React from 'react'
import delay from 'delay'
import { Provider, ProviderContext, Subscribe, subscribe, getNamedContext } from '../src/'

const store = {
    initialState: { count: 0 },
    actions: {
        simple: arg => ({ count: arg }),
        functional: arg => state => ({ count: state.count + arg }),
        async: arg => async state => {
            await delay(1)
            return { count: state.count + arg }
        },
    },
}

it('renders properly', async () => {
    const Test = subscribe()(props => props.count)
    await snapshot(
        <Provider initialState={{ count: 0 }}>
            <Test />
        </Provider>,
    )
})

test('mount/unmount', async () => {
    const Test = subscribe('store', props => props)(props => props.count)
    const App = class extends React.PureComponent {
        state = { show: true }
        componentDidMount() {
            expect(getNamedContext("store")).toBeTruthy()
            this.setState({ show: false })
        }
        componentDidUpdate() {
            expect(getNamedContext("store")).toBe(undefined)
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

test('simple action', async () => {
    const Test = subscribe()(props => <button onClick={() => props.actions.simple(1)}>{props.count}</button>)
    await snapshot(
        <Provider {...store}>
            <Test />
        </Provider>,
        tree => tree.find('button').simulate('click'),
    )
})

test('functional action', async () => {
    const Test = subscribe()(props => <button onClick={() => props.actions.functional(1)}>{props.count}</button>)
    await snapshot(
        <Provider {...store}>
            <Test />
        </Provider>,
        tree => tree.find('button').simulate('click'),
    )
})

test('async action', async () => {
    const Test = subscribe()(props => <button onClick={() => props.actions.async(1)}>{props.count}</button>)
    await snapshot(
        <Provider {...store}>
            <Test />
        </Provider>,
        tree => tree.find('button').simulate('click'),
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
                                await this.props.actions.simple(this.props.count + 1)
                                await this.props.actions.functional(this.props.count)
                                await this.props.actions.async(this.props.count)
                            }}
                        />
                    </div>
                )
            }
        },
    )
    await snapshot(
        <Provider {...store}>
            <Test />
        </Provider>,
        tree => tree.find('button').simulate('click'),
    )
})
