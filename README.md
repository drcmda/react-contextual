![](logo.jpg)

react-contextual is a tiny store/hoc pattern around [React 16's new context API](https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md). It makes dealing with multiple contexts easier and provides a simple setState/redux-like store-pattern, also driven by context.

It currently relies on [ReactTraining/react-broadcast](https://github.com/ReactTraining/react-broadcast/tree/next) until the official context API is officially published.

# Installation

    npm install react-contextual

# How to use ...

Using react-contextual is very simple ...

## If you just need a simple, redux-like store ...

Provide state:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { StoreProvider } from 'react-contextual'
import TestStore from './TestStore.js'

React.Render(
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

export default connectStore(TestStore)(({ state, actions }) =>
    ({ name: state.name, age: state.age, actions }))
```

The es-next `@` decorator works like in react-redux, but please be careful as the spec can still change any time!

```js
@connectStore(({ state, actions }) => ({ name: state.name, age: state.age, actions }))
export default class TestStore extends React.PureComponent {
    ...
}
```

## Raw contexts of any kind

You can also use the `context` HOC for any or several regular React context object(s). The context values will be mapped to the components regular props very similar to how Redux operates. This makes it easy to deal with multiple contexts which would cause nesting otherwise. You provide these contexts as you normally would, look into Reacts [latest RFC](https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md) for more details.

Make the consuming component a PureComponent and you get shallowEqual prop-checking for free, in other words, it only renders when the props you have mapped change.

```js
import React from 'react'
import { context } from 'react-contextual'

@context([ThemeContext, CounterContext], ([theme, count], props) => ({ theme, count }))
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
```

# API

## context(contexts, mapContextToProps)

`context` can be used as a functionwrapper or decorator, it generally works with any Context, it isn't bound to contextuals store model.

Example 1: Mapping a single context value as a prop, now available to the receiving component under any name you choose.

```js
import { context } from 'react-contextual'

@context(ThemeContext, theme => ({ theme }))
class ReceivingComponent extends React.PureComponent { ... }
```

Example 2: Mapping several contexts is also possible, just wrap them into an array. mapContextToProps behaves similar to Reduxes otherwise, the components own props can always be used as well.

```js
@context([ThemeContext, CountContext], ([theme, count], props) => ({ theme, count }))
class ReceivingComponent extends React.PureComponent { ... }
```

## connectStore(mapContextToProps)

`connectStore` is sugar for. You don't need to worry about the actual context in that case, but you could use the store with `connect` and even mix it with foreign contexts.

```js
import { context, StoreContext } from 'react-contextual'

@context(StoreProvider, ...)
class ReceivingComponent extends React.PureComponent { ... }
```

## StoreProvider

Provides a minimal redux-like store. Declare the initial state with the `initialState` prop, and actions with the `action` prop. That's it, state and actions will be distributed through the provider and can be consumed either by Reacts default API, or by contextuals HOC. StoreProvider will only render once to prevent re-rendering the entire sub-tree on every occuring change. Inside of course components behave normally. Any change to the store, caused by an action, will trigger consuming components.

The Provider will distribute `{ state, actions }` to listening consumers. Actions are declared by the `actions` prop. They're made of a collection of functions which return an object that is going to be merged back into the state using `setState` semantics.

They can be simple ...

```js
{
    setName: name => ({ name }),
    setAge: age => ({ age }),
}
```

Or slightly more complex when you pass a functions instead, which allows you to access the stores state which you could use to compute/derive props, compose, deep-merge or memoize:

```js
{
    setName: name => state => ({ name: `${state.title} ${state.surname}` },
    setAge: age => state => ({ age: state.somethingElse }),
}
```
