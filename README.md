![](contextual.jpg)

`react-contextual` is a tiny (~1KB) helper around [React 16's new context API](https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md).

It provides two things:

* consuming context with ease, every kind of context, no matter which or whose or how many providers
* a minimal redux-like store pattern with setState semantics and central actions

# Why

Reacts new low-level API for dynamic context distribution is built on render props. While they are very powerful they can lead to unwieldy codebases. `react-contextual` can fix that by mapping context values to component props, similar to how Redux operates. It also provides a small store for context distribution. It could well be [the smallest flux-store yet](https://github.com/drcmda/react-contextual/blob/master/src/store.js).

# Installation

    npm install react-contextual

# How to use ...

```js
import { subscribe, Subscribe, Provider } from 'react-contextual'
```

1. `subscribe([providers,] [selector])(AnyComponent)`

    Higher-order component to consume context. `providers` points to one or many contexts. `selector` maps the provider values into component props. Ommit `providers` and it will use the Stores context (the one down below, number 3 in this list). Ommit `selector` and it will default to `props => props`.

2. `<Subscribe [to={providers}] [select={selector}]>{renderFunction}</Subscribe>`

    The same as above as a component that passes selected props via render function.

3. `<Provider initialState={state} [actions={actions}]>...</Provider>`

    A small store with central actions.

# If you just need a light-weight, no-frills store ...

Example: https://codesandbox.io/s/ywyr3q5n4z

Provide state and actions, wrap everything that is supposed to access or mutate it within.

```js
import { Provider, subscribe } from 'react-contextual'

// No selector, defaults to props => props
const Test1 = subscribe()(
    ({ count, actions }) => <button onClick={() => actions.increaseCount()}>{count}</button>
)

// You can acces the components own props, as well as map context props
const Test2 = subscribe((store, props) => ({ year: store.year * props.factor + store.count }))(
    ({ year }) => <span>{year}</span>
)

ReactDOM.render(
    <Provider
        initialState={{ count: 0, year: 1000 }}
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
import { Provider as Store, Context as StoreContext } from 'react-contextual'
import { ThemeProvider, ThemeContext } from './theme'
import { TimeProvider, TimeContext } from './time'

ReactDOM.render(
    <ThemeProvider>
        <TimeProvider>
            <Store initialState={{ message: 'the time is:' }}>
                <Subscribe
                    to={[ThemeContext, TimeContext, StoreContext]} 
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
