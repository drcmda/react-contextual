[![Build Status](https://travis-ci.org/drcmda/react-contextual.svg?branch=master)](https://travis-ci.org/drcmda/react-contextual) [![codecov](https://codecov.io/gh/drcmda/react-contextual/branch/master/graph/badge.svg)](https://codecov.io/gh/drcmda/react-contextual) [![npm version](https://badge.fury.io/js/react-contextual.svg)](https://badge.fury.io/js/react-contextual)

    npm install react-contextual

# Why 🤔

* consume and create [context](https://reactjs.org/blog/2018/03/29/react-v-16-3.html#official-context-api) with ease, every kind of context, no matter which or whose or how many providers
* a cooked down redux-like store pattern with setState semantics and central actions

Click [this link](https://github.com/drcmda/react-contextual/blob/master/PITFALLS.md) for a detailed explanation.

# If you just need a light-weight no-frills store 🎰

<b>Examples</b>: [Counter](https://codesandbox.io/embed/3vo9164z25) | [Global setState](https://codesandbox.io/embed/01l8z634qn) | [Async actions](https://codesandbox.io/embed/lxly45lvkl) | [Memoization/Reselect](https://codesandbox.io/embed/yvx9my007z) | [Multiple stores](https://codesandbox.io/embed/0o8pj1jz7v) | [External store](https://codesandbox.io/embed/jzwv46729y)

Pass a `store` (which stores some state and actions to update the state) to [Provider](https://github.com/drcmda/react-contextual/blob/master/API.md#provider). Then receive the props in the store either by using a [HOC](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe) or [render-props](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe-as-a-component).

#### Render props

```jsx
import { Provider, Subscribe } from 'react-contextual'

const store = {
  count: 0,
  up: () => state => ({ count: state.count + 1 }),
  down: () => state => ({ count: state.count - 1 }),
}

const App = () => (
  <Provider {...store}>
    <Subscribe>
      {props => (
        <div>
          <h1>{props.count}</h1>
          <button onClick={props.up}>Up</button>
          <button onClick={props.down}>Down</button>
        </div>
      )}
    </Subscribe>
  </Provider>
)
```

#### Higher Order Component

```jsx
import { Provider, subscribe } from 'react-contextual'

const View = subscribe()(props => (
  <div>
    <h1>{props.count}</h1>
    <button onClick={props.up}>Up</button>
    <button onClick={props.down}>Down</button>
  </div>
))

const App = () => (
  <Provider {...store}>
    <View />
  </Provider>
)
```

#### With decorator

```jsx
@subscribe()
class View extends React.PureComponent {
  // ...
}
```

#### Default store vs External store

If you declare your store like above it becomes the default internal context, and is available by default to all subscribers. There is no need to explicitely refer to it when you subscribe to it.

When you need your store to be "external" so that you can refer to it and/or change its props from anywhere, you can declare it via [createStore](https://github.com/drcmda/react-contextual/blob/master/API.md#createstore). This also comes in handy when you need multiple stores.

There are a few key differences:

* the store must be passed to its provider with the `store` property
* it must be referred to either as first argument in `subscribe` or the `to` prop in `Subscribe`

```jsx
import { Provider, createStore, subscribe } from 'react-contextual'

const externalStore = createStore({
  text: 'Hello',
  setText: text => ({ text }),
})

const App = () => (
  <Provider store={externalStore}>
    <Subscribe to={externalStore}>{props => <div>{props.text}</div>}</Subscribe>
  </Provider>
)
```

#### Global setState

If you do not supply any functions in the object passed to [createStore](https://github.com/drcmda/react-contextual/blob/master/API.md#createstore), a `setState` function would be added automatically for you. This applies to both `createStore` and the `Provider` above.

```jsx
const store = createStore({ count: 0 })

const Test = subscribe(store)(props => (
  <button onClick={() => props.setState(state => ({ count: state.count + 1 }))}>
    {props.count}
  </button>
))
```

#### mapContextToProps

[subscribe](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe) and [Subscribe](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe-as-a-component) (the component) work with any React context, even polyfills. They pick providers and select state. Extend wrapped components from `React.PureComponent` and they will only render when picked state has changed.

```jsx
// Subscribes to all contents of the provider
subscribe(context)
// Picking a variable from the store, the component will only render when it changes ...
subscribe(context, store => ({ loggedIn: store.loggedIn }))
// Picking a variable from the store using the components own props
subscribe(context, (store, props) => ({ user: store.users[props.id] }))
// Making store context available under the 'store' prop
subscribe(context, 'store')
// Selecting several providers
subscribe([Theme, Store], (theme, store) => ({ theme, store }))
// Selecting several providers using the components own props
subscribe([Theme, Store], (theme, store, props) => ({
  store,
  theme: theme.colors[props.id],
}))
// Making two providers available under the props 'theme' and 'store'
subscribe([Theme, Store], ['theme', 'store'])
```

# If you like to provide context 🚀

<b>Examples</b>: [Global context](https://codesandbox.io/embed/v8pn13nq77) | [Transforms](https://codesandbox.io/embed/mjv84k1kn9) | [Unique context](https://codesandbox.io/embed/ox405qqopy) | [Generic React Context](https://codesandbox.io/embed/55wp11lv4)

Contextual isn't limited to reading context and store patterns, it also helps you to create and share providers.

* [moduleContext](https://github.com/drcmda/react-contextual/blob/master/API.md#modulecontext) creates a global provider and injects it into a component
* [namedContext](https://github.com/drcmda/react-contextual/blob/master/API.md#namedcontext) creates a unique provider bound to a components lifecycle
* [transformContext](https://github.com/drcmda/react-contextual/blob/master/API.md#transformcontext) transforms existing providers (like a declarative middleware)
* [helper functions](https://github.com/drcmda/react-contextual/blob/master/API.md#imperative-context-handling) allow you to control a context by yourself

#### Custom providers & transforms

```jsx
import { subscribe, moduleContext, transformContext } from 'react-contextual'

const Theme = moduleContext()(({ context, color, children }) => (
  <context.Provider value={{ color }} children={children} />
))

const Invert = transformContext(Theme)(({ context, color, children }) => (
  <context.Provider value={invert(color)} children={children} />
))

const Write = subscribe(Theme)(({ color, text }) => (
  <span style={{ color }}>{text}</span>
))

const App = () => (
  <Theme color="red">
    <Write text="hello" />
    <Invert>
      <Write text="world" />
    </Invert>
  </Theme>
)
```

#### With decorator

```jsx
@moduleContext()
class Theme extends React.PureComponent {
  // ...
}

@transformContext(Theme)
class Invert extends React.PureComponent {
  // ...
}

@subscribe(Theme)
class Say extends React.PureComponent {
  // ...
}
```

---

[API](https://github.com/drcmda/react-contextual/blob/master/API.md) | [Changelog](https://github.com/drcmda/react-contextual/blob/master/CHANGELOG.md) | [Pitfalls using context raw](https://github.com/drcmda/react-contextual/blob/master/PITFALLS.md)
