![](contextual.jpg)

`react-contextual` is a tiny (~1KB) helper around [React 16's new context API](https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md).

It provides three things:

* a minimal redux-like store pattern with setState semantics and central actions
* consuming context with ease, every kind of context, no matter which or whose or how many providers
* dealing with render props without the deep nesting

# Why

Reacts new low-level API for dynamic context distribution is built on render props. While they are very powerful they can lead to unwieldy codebases. `react-contextual` can fix that by mapping context values to component props, similar to how Redux operates. It also provides a small store around context distribution. It could well be [the smallest flux-store yet](https://github.com/drcmda/react-contextual/blob/master/src/store.js).

# Installation

    npm install react-contextual

# How to use ...

```js
import { subscribe, Subscribe, Provider } from 'react-contextual'
```

1. `subscribe([providers,] [selector])(AnyComponent)`

    A higher order component. `providers` points to one or many contexts. `selector` maps the provider values into component props, if you ommit it it will default to `store => store`. The wrapped component will receive these in addition to its own. If you only supply `selector` it will use the Providers context (the one down below, number 3 in this list).

2. `<Subscribe [to={providers}] [select={selector}]>{renderFunction}</Subscribe>`

    The same as above as a component. You consume selected props via render function. As with `subscribe` you can ommit the providers (the `to` prop in this case) and the selector.

3. `<Provider initialState={state} [actions={actions}]>...</Provider>`

    A handy little store that you can use to propagate state. Central actions allow components to cause mutations. If you don't need a store and just consume context, don't import it and use `subscribe` or `<Subscribe/>`.

# If you just need a light-weight, no-frills store ...

Example: https://codesandbox.io/s/ywyr3q5n4z

Provide state and actions, wrap everything that is supposed to access or mutate it within.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, subscribe } from 'react-contextual'

// No selector, defaults to store => store, which inserts { ...state, actions } as props
const Test1 = subscribe()(
    ({ count, actions }) => <button onClick={() => actions.increaseCount()}>{count}</button>
)

// You can acces the components own props, as well as map context props
const Test2 = subscribe((store, props) => ({ year: store.year * props.factor }))(
    ({ year }) => <span>{year}</span>
)

ReactDOM.render(
    <Provider
        initialState={{ count: 0, year: 1009 }}
        actions={{
            increaseCount: () => state => ({ count: state.count + 1 }),
        }}>
        <Test1 />
        <Test2 factor={2} />
    </Provider>,
    document.getElementById('root'),
)
```

### With decorator

But use with care as the spec may still change any time!

```js
@subscribe()
class Test extends React.PureComponent {
    render() {
        ...
    }
}
```

# If you're dealing with context providers of any kind

Example: https://codesandbox.io/s/5v7n6k8j5p

Use `subscribe` to consume any React context provider (or several).

```js
const User = subscribe(UsersContext, ({ users }, props) => ({ user: users[props.id] }))(
    ({ user }) => <span>hi there user: {user}</span>
)

const Header = subscribe([ThemeContext, CounterContext], ([theme, count]) => ({ theme, count }))(
    ({ theme, count }) => (
        <h1 style={{ color: theme === 'light' ? '#000' : '#ddd' }}>
            Theme: {theme} Count: {count}
        </h1>
    )
)
```

### With decorator

```js
@subscribe([ThemeContext, CounterContext], ([theme, count]) => ({ theme, count }))
class Test extends React.PureComponent {
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
import { Provider as Store, Context as StoreContext } from 'react-contextual'
import { ThemeProvider, ThemeContext } from './theme'
import { TimeProvider, TimeContext } from './count'

ReactDOM.render(
    <ThemeProvider>
        <TimeProvider>
            <Store initialState={{ message: 'time' }}>
                <Subscribe
                    to={[ThemeContext, TimeContext, StoreContext]} 
                    select={([theme, time, store]) => ({ theme, time, message: store.message })}>
                    {({ theme, time, message }) => <h1 style={{ color: theme }}>{message}: {time}</h1>}
                </Subscribe>
            </Store>
        </TimeProvider>
    </ThemeProvider>,
    document.getElementById('root'),
)
```

# API

https://github.com/drcmda/react-contextual/blob/master/API.md
