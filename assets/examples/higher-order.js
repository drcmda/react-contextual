import { Provider, subscribe } from 'react-contextual'

const store = {
    initialState: { count: 0 },
    actions: {
        up: () => state => ({ count: state.count + 1 }),
        down: () => state => ({ count: state.count - 1 }),
    },
}

const View = subscribe()(props => (
    <div>
        <h1>{props.count}</h1>
        <button onClick={props.actions.up}>Up</button>
        <button onClick={props.actions.down}>Down</button>
    </div>
))

ReactDOM.render(
    <Provider {...store}>
        <View />
    </Provider>,
    document.getElementById('root'),
)
