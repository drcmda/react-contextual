![](logo.jpg)

react-contextual is a tiny store/hoc pattern around [React 16's new context API](https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md). It currently relies on [ReactTraining/react-broadcast](https://github.com/ReactTraining/react-broadcast/tree/next) until the official API is published.

* Very small (~1KB), [at least when React 16.3.0 drops]
* Makes dealing with Reacts new context straight forward
* Listening to multiple providers without nesting or render props
* Powerful Redux-like store pattern without any boilerplate

# Installation

    npm install react-contextual

# How to use ...

Using react-contextual is very simple. It provides two things:

1. [a minimal flux store with setState semantics](https://codesandbox.io/s/ko1nz4j2r)
2. [helping you to deal with context in general](https://codesandbox.io/s/5v7n6k8j5p)

## 1. If you just need a light-weight store ...

Provide state:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { StoreProvider } from 'react-contextual'
import TestStore from './TestStore.js'

ReactDOM.render(
    <StoreProvider
        initialState={{ name: 'max', age: 99,  }}
        actions={{
            setName: name => ({ name }), // simple merge
            setAge: age => state => ({ age: state.age + 1 }), // functional merge with more access
        }}>
        <TestStore />
    </StoreProvider>,
    document.getElementById('app'),
)
```

Now consume anywhere within the provider, as deeply nested as you wish. The semantics are very similar to Redux.

```js
import React from 'react'
import { connectStore } from 'react-contextual'

class TestStore extends React.PureComponent {
    render() {
        const { name, age, actions } = this.props
        return (
            <div>
                <button onClick={() => actions.setName('paul')}>{name}</button>
                <button onClick={() => actions.setAge(28)}>{age}</button>
            </div>
        )
    }
}

export default connectStore(
    // Pick your state, map it to the components props, provide actions ...
    ({ state, actions }) => ({ name: state.name, age: state.age, actions })
)(TestStore)
```

The es-next `@` decorator works like in react-redux. Be careful as the spec can still change any time!

```js
@connectStore(({ state, actions }) => ({ name: state.name, age: state.age, actions }))
export default class extends React.PureComponent {
    render() {
        ...
    }
}
```

Example: https://codesandbox.io/s/ko1nz4j2r

## 2. Dealing with raw context providers of any kind

You can use contextuals `context` HOC to listen to one or multiple React context providers. Their values will be mapped to regular props, similar to how Redux operates. You provide context as you normally would, look into Reacts [latest RFC](https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md) for more details.

Make the consuming component a PureComponent and you get shallowEqual prop-checking for free, in other words, it only renders when the props you have mapped change.

```js
import React from 'react'
import { context } from 'react-contextual'

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

export default context(
    // Pick one or several contexts, then map the values to the components props ...
    [ThemeContext, CounterContext], ([theme, count]) => ({ theme, count })
)(Test)
```

Again, the decorator would work here as well:

```js
@context([ThemeContext, CounterContext], ([theme, count]) => ({ theme, count }))
export default class extends React.PureComponent {
    render() {
        ...
    }
}
```

Example: https://codesandbox.io/s/5v7n6k8j5p

# API

## context(contexts, mapContextToProps)

```js
import { context } from 'react-contextual'
```

`context` can be used as a functionwrapper or decorator, it generally works with any Context, it isn't bound to contextuals store model.

Example 1: Mapping a single context value as a prop.

```js
context(ThemeContext, theme => ({ theme }))(Component)
```

Example 2: mapContextToProps behaves similar to Reduxes mapStateToProps, the components own props can always be used as well.

```js
context(UsersContext, (users, props) => ({ user: users[props.id] }))(Component)
```

Example 3: Mapping several contexts is also possible, just wrap them into an array.

```js
context([ThemeContext, CountContext], ([theme, count]) => ({ theme, count }))(Component)
```

## connectStore(mapContextToProps)

```js
import { connectStore } from 'react-contextual'
```

`connectStore` is sugar for `connect`. You don't need to worry about the actual context in that case, but you could use `connect` if you supply it, then you could even mix it with other contexts:

```js
import { context, StoreContext } from 'react-contextual'

context(StoreContext, ({ state, actions }) => ({ ... }))(Component)
```

## StoreProvider

```js
import { StoreProvider } from 'react-contextual'
```

Perhaps the worlds smallest Redux-like store. It pulls it off by letting React handle context distribution and state diffing. Declare the initial state with the `initialState` prop, and actions with the `actions` prop. That's it! The Provider will distribute `{ state, actions }` to listening consumers, either using Reacts API directly or contextuals `connect` HOC.

StoreProvider will only render once to prevent sub-tree re-rendering on every occuring change. Children otherwise behave normally of course. Any change to the store caused by an action will trigger consuming components.

Actions are made of a collection of functions which return an object that is going to be merged back into the state using regular `setState` semantics.

They can be simple ...

```js
{
    setName: name => ({ name }),
    setAge: age => ({ age }),
}
```

Or slightly more complex when you pass functions instead, which allow you to access the stores state, useful for computed/derived props, composition, deep-merging or memoization:

```js
{
    setName: name => state => ({ name: `${state.title} ${state.surname}` },
    setAge: age => state => ({ age: state.age + 1 }),
}
```
