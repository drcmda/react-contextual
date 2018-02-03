![](contextual.jpg)

`react-contextual` is a tiny (~1KB) helper around [React 16's new context API](https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md).

It provides two things:

* consuming context with ease, every kind of context, no matter which or whose or how many providers
* a minimal redux-like store pattern with setState semantics and central actions

# Why

Reacts new API for dynamic context distribution is built on render props. While it is very powerful it may be a little too low-level depending on how many consumers you deal with due to the nesting. `react-contextual` can fix that by mapping context values to component props, similar to how Redux operates. It also provides a small store for state distribution. It could well be [the smallest flux-store yet](https://github.com/drcmda/react-contextual/blob/master/src/store.js).

# Installation

    npm install react-contextual

# How to use ...

```js
import { subscribe, Subscribe, Provider } from 'react-contextual'
```

1. `subscribe([providers,] [selector])(AnyComponent)`

    Higher-order component to consume context. `providers` points to one or many contexts. `selector` maps the provider values into component props. Ommit `providers` and it will use `react-contextual`'s own context for the store (the one down below, number 3 in this list). Ommit `selector` and it will default to `props => props`, so all the contexts props will be merged to the wrapped components props.

2. `<Subscribe [to={providers}] [select={selector}]>{renderFunction}</Subscribe>`

    The same as above as a component that passes selected props via render function.

3. `<Provider initialState={state} [actions={actions}]>...</Provider>`

    A small store with central actions.

# If you just need a light-weight, no-frills store ...

Provide state and actions, wrap everything that is supposed to access or mutate it within.

Example: https://codesandbox.io/s/ywyr3q5n4z

```js
import { Provider, subscribe } from 'react-contextual'

// No selector, defaults to props => props
const Counter = subscribe()(
    ({ count, actions }) => <button onClick={() => actions.increaseCount()}>Click {count}</button>
)

// You can map context to props any way you like ...
const Message = subscribe(({ message, actions }) => ({ message, set: actions.setMessage }))(
    ({ message, set }) => (
        <span>
            <input value={message} onChange={e => set(e.target.value)} />
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
@subscribe(({ message, actions }) => ({ message, set: actions.setMessage }))
class Message extends React.PureComponent {
    render() {
        ...
    }
}
```

### What about multiple stores?

You can have as many as you like, just name them. `subscribe` also accepts your keys.

Example: https://codesandbox.io/s/p9p6jq60lx

```js
const Reverse = subscribe("myKey", store => ({ reverse: store.message.split('').reverse().join('') }))(
    ({ reverse }) => <span>{reverse}</span>
)

ReactDOM.render(
    <Provider id="myKey" initialState={{ message: 'hello' }}>
        <Reverse/>
    </Provider>,
    document.getElementById('root'),
)
```

# If you're dealing with context providers of any kind

Use `subscribe` to consume any React context provider (or several).

Example: https://codesandbox.io/s/5v7n6k8j5p

```js
const User = subscribe(UsersContext, ({ users }, props) => ({ user: users[props.id] }))(
    ({ user }) => <span>hi there user: {user}</span>
)

const Header = subscribe([ThemeContext, CounterContext], ([theme, count]) => ({ theme, count }))(
    ({ theme, count }) => <h1 style={{ color: theme }}>{count}</h1>
)
```

### With decorator

```js
@subscribe([ThemeContext, CounterContext], ([theme, count]) => ({ theme, count }))
class Header extends React.PureComponent {
    render() {
        ...
    }
}
```

# If you like to consume context but dislike HOC's

Example 1: https://codesandbox.io/s/wo28o5y1y5 (Multiple providers)

Example 2: https://codesandbox.io/s/ko1nz4j2r (Store as default provider)

Use `<Subscribe to={} select={}/>` to do the same as above with render props.

```js
import { Provider as Store, Subscribe } from 'react-contextual'
import { ThemeProvider, ThemeContext } from './theme'
import { TimeProvider, TimeContext } from './time'

ReactDOM.render(
    <ThemeProvider>
        <TimeProvider>
            <Store id="testStore" initialState={{ message: 'the time is:' }}>
                <Subscribe
                    to={[ThemeContext, TimeContext, "testStore"]} 
                    select={([theme, time, store]) => ({ theme, time, message: store.message })}>
                    {({ theme, time, message }) =>
                        <h1 style={{ color: theme }}>{message} {time}</h1>
                    }
                </Subscribe>
            </Store>
        </TimeProvider>
    </ThemeProvider>,
    document.getElementById('root'),
)
```

# API

https://github.com/drcmda/react-contextual/blob/master/API.md
