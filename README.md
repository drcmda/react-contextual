![](assets/logo.jpg)

`react-contextual` is a tiny (less than 1KB) helper around [React 16s new context api](https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md).

It provides two things:

* consuming (and creating) context with ease, every kind of context, no matter which or whose or how many providers
* a minimal redux-like store pattern with setState semantics and central actions

# Why

Reacts new context api is very powerful albeit very low-level as it does not prescribe patterns and can cause [some issues](https://github.com/drcmda/react-contextual/blob/master/PITFALLS.md) if used naively. `react-contextual` makes creating, sharing and consuming context easier, maps context values to component props similar to how redux operates, takes care of nesting, renders only when necessary and provides a small store for state distribution.

# Installation

    npm install react-contextual

# If you just need a light-weight no-frills store

Use the [Provider](https://github.com/drcmda/react-contextual/blob/master/API.md#provider) to distribute state and actions, wrap consumers within, use [subscribe](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe) to connect components.

Example 1: https://codesandbox.io/s/ywyr3q5n4z (basic example)

Example 2: https://codesandbox.io/s/lxly45lvkl (async actions)

```js
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
    )
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
```

### With decorator

But use with care as the spec may still change any time!

```js
@subscribe(({ message, actions }) => ({ message, setMessage: actions.setMessage }))
class Message extends React.PureComponent {
    //...
}
```

### What about multiple stores?

You can have as many as you like, just name them. [subscribe](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe) also accepts your keys.

Example: https://codesandbox.io/s/p9p6jq60lx

```js
import { Provider, subscribe } from 'react-contextual'

const mapContextToProps = store => ({ reverse: store.message.split('').reverse().join('') })
const Hello = subscribe('store-1', mapContextToProps)(store => <h1>{store.reverse}</h1>)
const World = subscribe('store-2', mapContextToProps)(store => <h2>{store.reverse}</h2>)
const Greet = subscribe(['store-1', 'store-2'], ['a', 'b'])(({ a, b }) => <h3>{a} {b}</h3>)

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
```

# If you are dealing with context providers of any kind

[subscribe](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe) helps you to consume *any* React context. Soon libs like react-router, redux, etc. will likely start serving context. Look into the examples to see how easy it is to create a context provider in order to distribute dynamic data.

Example: https://codesandbox.io/s/5v7n6k8j5p

```js
import { subscribe } from 'react-contextual'

const Test = subscribe([ThemeContext, TimeContext], ['theme', 'time'])(
    ({ theme, time }) => (
      <h1 style={{ color: theme === 'light' ? '#000' : '#ddd' }}>
        {time}
      </h1>
    )
)

ReactDOM.render(
    <ThemeProvider>
        <TimeProvider>
            <Test />
        </TimeProvider>
    </ThemeProvider>,
    document.getElementById('root'),
)
```

### With decorator

```js
@subscribe([ThemeContext, TimeContext], ['theme', 'time'])
class Test extends React.PureComponent {
    //...
}
```

# If you like to create context providers

Reacts default api works with singletons, that makes it tough to create multi-purpose, nestable providers. Use [namedContext](https://github.com/drcmda/react-contextual/blob/master/API.md#namedcontext) to create unique context bound to a components lifecycle and [moduleContext](https://github.com/drcmda/react-contextual/blob/master/API.md#modulecontext) for module-scoped context. Use [helper functions](https://github.com/drcmda/react-contextual/blob/master/API.md#imperative-context-handling) if you want to control the lifecycle of a context by yourself.

Example1: https://codesandbox.io/s/m7q5z407p9 (namedContext)

Example2: https://codesandbox.io/s/v8pn13nq77 (moduleContext)

Example3: https://codesandbox.io/s/30ql1rxzlq (imperate API)

```js
import { subscribe, namedContext } from 'react-contextual'

const NamedProvider = namedContext(props => props.id)(
    ({ context: Context, text, children }) => <Context.Provider value={text} children={children} />
)

const ReadNamedProvider = subscribe(props => props.id, text => ({ text }))(
    ({ text }) => <span>{this.props.text}</span>
)

ReactDOM.render(
    <NamedProvider id="context-1" text="hello">
        <NamedProvider id="context-2" text="world">
            <ReadNamedProvider id="context-1" />
            <ReadNamedProvider id="context-2" />
        </NamedProvider>
    </NamedProvider>,
    document.getElementById('root'),
)
```

### With decorator

```js
@namedContext(props => props.id)
class NamedProvider extends React.PureComponent {
    //...
}
```


# If you like to consume context but dislike HOCs

Use [Subscribe](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe-as-a-component) (a component) to do the same as above with render props.

Example 1: https://codesandbox.io/s/wo28o5y1y5 (Multiple providers)

Example 2: https://codesandbox.io/s/ko1nz4j2r (Store as default provider)

```js
import { Provider as Store, Subscribe } from 'react-contextual'

ReactDOM.render(
    <ThemeProvider>
        <TimeProvider>
            <Store id="store" initialState={{ message: 'the time is:' }}>
                <Subscribe to={[Theme, Time, 'store']} select={['theme', 'time', 'store']}>
                    {({ theme, time, store }) => (
                        <h1 style={{ color: theme === 'light' ? '#000' : '#ddd' }}>
                            {store.message} {time}
                        </h1>
                    )}
                </Subscribe>
            </Store>
        </TimeProvider>
    </ThemeProvider>,
    document.getElementById('root'),
)
```

# API

https://github.com/drcmda/react-contextual/blob/master/API.md

# Changelog

https://github.com/drcmda/react-contextual/blob/master/CHANGELOG.md

# Pitfalls when using the context api raw

https://github.com/drcmda/react-contextual/blob/master/PITFALLS.md

