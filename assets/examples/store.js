import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, subscribe } from 'react-contextual'

const Counter = subscribe()(
    ({ count, actions }) => <button onClick={() => actions.increaseCount()}>Click {count}</button>
)

const Message = subscribe(({ message, actions }) => ({ message, setMessage: actions.setMessage }))(
    ({ message, setMessage }) => (
        <span>
            <input value={message} onChange={e => setMessage(e.target.value)} />
            {message}
        </span>
    ),
)

ReactDOM.render(
    <Provider
        initialState={{ message: 'hello', count: 0 }}
        actions={{
            setMessage: message => ({ message }),
            increaseCount: () => state => ({ count: state.count + 1 }),
        }}>
        <Counter />
        <Message />
    </Provider>,
    document.getElementById('root'),
)