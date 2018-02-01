![](contextual.jpg)

`react-contextual` is a tiny (~1KB*) helper around [React 16's new context API](https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md). *relies on a [polyfill] until React 16.3.0(https://github.com/ReactTraining/react-broadcast/tree/next).

It provides three things:

* a minimal redux-like store pattern with setState semantics and central actions
* consuming context with ease, every kind of context, no matter which or whose or how many providers
* dealing with render props without the deep nesting

# Why

React new low-level API for dynamic context distribution is built on render props. While they are very powerful they often lead to unwieldy codebases when multiple providers cover consumers in scores of nested blobs. `react-contextual` can fix that by mapping context values to component props, similar to how Redux operates. It also allows consumers to listen to multiple providers.

Likewise, context can carry setState to new heights by allowing it to freely distribute. `react-contextual` builds a small store around that premise but lets React do all the work. It could well be [the smallest flux-store yet](https://github.com/drcmda/react-contextual/blob/master/src/store.js).

# Installation

    npm install react-contextual

# How to use ...

There are basically three things you might want to fetch from the default export:

```js
import { subscribe, Provider, Subscribe } from 'react-contextual'
```

1. `subscribe([providers,] selector)(AnyComponent)`

   A higher order component. `providers` points to one or many contexts (in that case as an array). `selector` maps the values it gets from these providers into component props. The wrapped component will receive these in addition to its own. 
   
   If you only supply `selector` it will fetch `react-contextuals` default Provider Context (the one below, number 3. in this list).

2. `<Subscribe [to={providers}] select={selector}>{state => <h>{state}</h> }</Subscribe>`

   The same as above as a component. You consume selected props via render prop. As with `subscribe` you can ommit the providers, or the `to` prop in this case.

3. `<Provider initialState={state} actions={actions}>...</Provider>`

   A handy little store that you can use to propagate state. Central actions allow components to cause mutations.

# If you just need a simple, no-nonsense, light-weight store ...

Example: https://codesandbox.io/s/ywyr3q5n4z

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

# If you're dealing with context providers of any kind

Example: https://codesandbox.io/s/5v7n6k8j5p

You can use the `subscribe` higher-order component to listen to any one or multiple React context providers. Their values will be mapped to regular props. You provide context as you normally would, look into Reacts [latest RFC](https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md) for more details.

Make the consuming component a PureComponent and you get shallowEqual prop-checking for free, in other words, it only renders when the props you have mapped change.

If you listen to multiple providers using an array as the first argument, then the props you receive in the selector (the 2nd argument) will also be wrapped as an array, where the order of props matches the order of the providers. 

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

# If you like render props, but want to avoid the nesting

Example 1: https://codesandbox.io/s/wo28o5y1y5 (Multiple providers)

Example 2: https://codesandbox.io/s/ko1nz4j2r (Store as default provider)

`subscribe` can be used as a component in the form of `<Subscribe to={} select={}/>`. The semantics are the same, it can digest any one or several contexts. The context that you have selected will be passed as a render prop. This allows you to react to providers without having to create a component for it.

```js
ReactDOM.render(
    <ThemeProvider>
        <CounterProvider>
            <Subscribe to={[ThemeCtx, CountCtx]} select={([theme, count]) => ({ theme, count })}>
                {({ theme, count }) => <h1 style={{ color: theme }}>{count}</h1>}
            </Subscribe>
        </CounterProvider>
    </ThemeProvider>,
    document.getElementById('root'),
)
```

# API

https://github.com/drcmda/react-contextual/blob/master/API.md
