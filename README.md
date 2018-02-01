![](contextual.jpg)

`react-contextual` is a tiny (~1KB) store/higher-order pattern around [React 16's new context API](https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md).

It provides three things:

1. a minimal redux-like store pattern with setState semantics and central actions
2. consuming context with ease, every kind of context, no matter which or whose or how many providers
3. dealing with render props without the deep nesting

Currently it relies on [react-trainings polyfill](https://github.com/ReactTraining/react-broadcast/tree/next), which will be removed once React 16.3.0 is out.

# Why

In the upcoming version React is going to have a new low-level API for dynamic context distribution. The API is built on render props. While they are very powerful they can make the codebase unwieldy, especially when multiple providers cover context-consumers in scores of nested blobs. `react-contextual` can fix that by mapping context values to component props, similar to how Redux operates. It also allows consumers to listen to multiple providers.

Likewise, context makes flux patterns possible that previously would have meant larger dependencies and boilerplate. Context can carry setState to new heights by allowing it to freely distribute. `react-contextual` builds a small flux pattern around that premise but lets React do all the work, which perhaps leads to what could well be [the smallest flux-store yet](https://github.com/drcmda/react-contextual/blob/master/src/store.js).

# Installation

    npm install react-contextual

# 1. If you just need a simple, no-nonsense, light-weight store ...

Example: https://codesandbox.io/s/ko1nz4j2r

Provide state and actions, wrap everything that is supposed to access or mutate it within.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-contextual'
import TestStore from './TestStore.js'

ReactDOM.render(
    <Provider
        initialState={{ name: 'max', count: 0 }}
        actions={{
            setName: name => ({ name }), // simple merge
            increaseCount: factor => state => ({ count: state.count + factor }), // functional merge
        }}>
        <TestStore />
    </Provider>,
    document.getElementById('app'),
)
```

Consume anywhere within the provider, as deeply nested as you wish. The semantics are similar to Redux.

```js
import React from 'react'
import { subscribe } from 'react-contextual'

class TestStore extends React.PureComponent {
    render() {
        const { name, count, actions } = this.props
        return (
            <div>
                <input type="text" value={name} onChange={e => actions.setName(e.target.value)} />
                <button onClick={() => actions.increaseCount(1)}>{name}: {count}</button>
            </div>
        )
    }
}

// Pick your state, map it to the components props, provide actions ...
export default subscribe(store => 
    ({ name: store.state.name, count: store.state.count, actions: store.actions }))(TestStore)
```

### Making it a little shorter using the es-next decorator

But use with care as the spec may still change any time!

```js
@subscribe(({ state, actions }) => ({ name: state.name, count: state.count, actions }))
export default class TestStore extends React.PureComponent {
    render() {
        ...
    }
}
```

# 2. If you're dealing with context providers of any kind

Example: https://codesandbox.io/s/5v7n6k8j5p

You can use the `subscribe` higher-order-component to listen to any one or multiple React context providers. Their values will be mapped to regular props. You provide context as you normally would, look into Reacts [latest RFC](https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md) for more details.

Make the consuming component a PureComponent and you get shallowEqual prop-checking for free, in other words, it only renders when the props you have mapped change.

```js
import React from 'react'
import { subscribe } from 'react-contextual'

class Test extends React.PureComponent {
    render() {
        const { theme, count } = this.props
        return (
            <h1 style={{ color: theme === 'light' ? '#000' : '#ddd' }}>
                Theme: {theme} Count: {count}
            </h1>
        )
    }
}

// Pick one or several contexts, then map the values to the components props ...
export default subscribe([ThemeContext, CounterContext], ([theme, count]) => ({ theme, count }))(Test)
```

### With decorator

```js
@subscribe([ThemeContext, CounterContext], ([theme, count]) => ({ theme, count }))
export default class Test extends React.PureComponent {
    render() {
        ...
    }
}
```

# 3. If you like render props, but want to avoid the nesting

Example 1: https://codesandbox.io/s/wo28o5y1y5 (Multiple providers)

Example 2: https://codesandbox.io/s/ko1nz4j2r (Store as default provider)

`subscribe` can be used as a component in the form of `<Subscribe to={} select={}/>`. The semantics are the same, it can digest any one or several contexts. The context that you have selected will be passed as a render prop. This allows you to react to providers without having to create a component for it.

```js
ReactDOM.render(
    <ThemeProvider>
        <CounterProvider>
            <Subscribe to={[ThemeContext, CounterContext]} select={([theme, count]) => ({ theme, count })}>
                {({ theme, count }) => <h1 style={{ color: theme }}>{count}</h1>}
            </Subscribe>
        </CounterProvider>
    </ThemeProvider>,
  document.getElementById('root'),
)
```

# API

https://github.com/drcmda/react-contextual/blob/master/API.md
