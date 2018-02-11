import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, subscribe } from 'react-contextual'

const mapContextToProps = store => ({ reverse: store.message.split('').reverse().join('') })
const Hello = subscribe('store-1', mapContextToProps)(store => <h1>{store.reverse}</h1>)
const World = subscribe('store-2', mapContextToProps)(store => <h2>{store.reverse}</h2>)
const Greet = subscribe(['store-1', 'store-2'], ['store1', 'store2'])(
    ({ store1, store2 }) => <h3>{store1.message} {store2.message}</h3>
)

ReactDOM.render(
    <Provider id="store-1" initialState={{ message: 'hello' }}>
        <Provider id="store-2" initialState={{ message: 'world' }}>
            <Hello />
            <World />
            <Greet />
        </Provider>
    </Provider>,
    document.getElementById('root'),
)