![](logo.jpg)

react-contextual is a tiny store/hoc pattern around [React 16's new context API](https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md).

It currently relies on [ReactTraining/react-broadcast](https://github.com/ReactTraining/react-broadcast/tree/next) until the official API is published.

# Installation

    npm install react-contextual

# How to use ...

Using react-contextual is very simple. It basically provides two things:

1. It offers a minimal redux-like store with setState semantics
2. It can help you dealing with context in general, especially multiple contexts without deep nesting

## 1. If you just need a simple, redux-like store ...

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
            setAge: age => state => ({ age: state.age }), // functional merge with more access
        }}>
        <TestStore />
    </StoreProvider>,
    document.getElementById('app'),
)
```

Then consume anywhere within the provider, as deeply nested as you wish ...

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

export default connectStore(({ state, actions }) => 
    ({ name: state.name, age: state.age, actions }))(TestStore)
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

## 2. Raw contexts of any kind

You can also use the `context` HOC for any or several regular React context object(s). The context values will be mapped to the components regular props very similar to how Redux operates. This makes it easy to deal with multiple contexts which would cause nesting otherwise. You provide these contexts as you normally would, look into Reacts [latest RFC](https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md) for more details.

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

export default context([ThemeContext, CounterContext], ([theme, count], props) => 
    ({ theme, count }))(Test)
```

Again, the decorator would work here as well, given that you want to risk its use:

```js
@context([ThemeContext, CounterContext], ([theme, count], props) => ({ theme, count }))
export default class extends React.PureComponent {
    render() {
        ...
    }
}
```

# API

## context(contexts, mapContextToProps)

```js
import { context } from 'react-contextual'
```

`context` can be used as a functionwrapper or decorator, it generally works with any Context, it isn't bound to contextuals store model.

Example 1: Mapping a single context value as a prop, now available to the receiving component under any name you choose.

```js
context(ThemeContext, theme => ({ theme }))(Component)
```

Example 2: Mapping several contexts is also possible, just wrap them into an array. mapContextToProps behaves similar to Reduxes otherwise, the components own props can always be used as well.

```js
context([ThemeContext, CountContext], ([theme, count], props) => ({ theme, count }))(Component)
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

Provides a redux-like store. Declare the initial state with the `initialState` prop, and actions with the `actions` prop. That's it! The Provider will distribute `{ state, actions }` to listening consumers, either using Reacts API directly or contextuals `connect` HOC.

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
    setAge: age => state => ({ age: state.somethingElse }),
}
```
