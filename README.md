<p align="center">
  <img width="500" height="314" src="assets/logo-3d-flat.png">
</p>

[![Build Status](https://travis-ci.org/drcmda/react-contextual.svg?branch=master)](https://travis-ci.org/drcmda/react-contextual) [![codecov](https://codecov.io/gh/drcmda/react-contextual/branch/master/graph/badge.svg)](https://codecov.io/gh/drcmda/react-contextual) [![npm version](https://badge.fury.io/js/react-contextual.svg)](https://badge.fury.io/js/react-contextual)

    npm install react-contextual

# Why 🤔

* consume (and create) context with ease, every kind of context, no matter which or whose or how many providers
* a minimal redux-like store pattern with setState semantics and central actions

Click [this link](https://github.com/drcmda/react-contextual/blob/master/PITFALLS.md) for a detailed explanation.

# If you just need a light-weight no-frills store 🎰

Use [Provider](https://github.com/drcmda/react-contextual/blob/master/API.md#provider) to distribute state and actions. Connect components either by using a [HOC](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe) or [render-props](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe-as-a-component).

<b>Examples</b>: [Counter](https://codesandbox.io/embed/3vo9164z25) | [Global setState](https://codesandbox.io/embed/01l8z634qn) | [Async actions](https://codesandbox.io/embed/lxly45lvkl) | [Memoization/Reselect](https://codesandbox.io/embed/yvx9my007z) | [Multiple stores](https://codesandbox.io/embed/0o8pj1jz7v) | [External store](https://codesandbox.io/embed/jzwv46729y)

#### Render props

```jsx
import { Provider, Subscribe } from 'react-contextual'

const store = {
    initialState: { count: 0 },
    actions: {
        up: () => state => ({ count: state.count + 1 }),
        down: () => state => ({ count: state.count - 1 }),
    },
}

const App = () => (
    <Provider {...store}>
        <Subscribe>
            {props => (
                <div>
                    <h1>{props.count}</h1>
                    <button onClick={props.actions.up}>Up</button>
                    <button onClick={props.actions.down}>Down</button>
                </div>
            )}
        </Subscribe>
    </Provider>,
)
```

#### Higher Order Component

```jsx
import { Provider, subscribe } from 'react-contextual'

const View = subscribe()(props => (
    <div>
        <h1>{props.count}</h1>
        <button onClick={props.actions.up}>Up</button>
        <button onClick={props.actions.down}>Down</button>
    </div>
))

const App = () => (
    <Provider {...store}>
        <View />
    </Provider>,
)
```

#### With decorator

```jsx
@subscribe()
class View extends React.PureComponent {
    // ...
}
```

#### External store

Maintain your own store via [createStore](https://github.com/drcmda/react-contextual/blob/master/API.md#createstore). It is fully reactive and features a basic subscription model, similar to a redux store.

```jsx
import { Provider, createStore, subscribe } from 'react-contextual'

const externalStore = createStore({
    initialState: { count: 0 },
    actions: { up: () => state => ({ count: state.count + 1 }) },
})

const Test = subscribe(externalStore, props => ({ count: props.count }))(
    props => <button onClick={() => externalStore.actions.up()}>{props.count}</button>,
)

const App = () => (
    <Provider store={externalStore}>
        <Test />
    </Provider>,
)
```

#### Global setState

If you do not supply actions [createStore](https://github.com/drcmda/react-contextual/blob/master/API.md#createstore) will add setState by default.

```jsx
const store = createStore({ initialState: { count: 0 } })

// Mergers can be outside the store
const up = state => ({ count: state.count + 1 })
const dn = state => ({ count: state.count - 1 })

const Test = subscribe(store, props => props)(
    props => <button onClick={() => store.actions.setState(up)}>{props.count}</button>,
)
```

# If you like to provide context 🚀

[subscribe](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe) works with any React context, even polyfills. But contextual isn't limited to reading context and store patterns.

* [moduleContext](https://github.com/drcmda/react-contextual/blob/master/API.md#modulecontext) creates a global provider and injects it into a component
* [namedContext](https://github.com/drcmda/react-contextual/blob/master/API.md#namedcontext) creates a unique provider bound to a components lifecycle
* [transformContext](https://github.com/drcmda/react-contextual/blob/master/API.md#transformcontext) transforms existing providers (like a declarative middleware)
* [helper functions](https://github.com/drcmda/react-contextual/blob/master/API.md#imperative-context-handling) allow you to control a context by yourself

<b>Examples</b>: [Global context](https://codesandbox.io/embed/v8pn13nq77) | [Transforms](https://codesandbox.io/embed/mjv84k1kn9) | [Unique context](https://codesandbox.io/embed/ox405qqopy) | [Imperative context](https://codesandbox.io/embed/30ql1rxzlq) | [Generic React Context](https://codesandbox.io/embed/55wp11lv4)

#### Custom providers & transforms

```jsx
import { subscribe, moduleContext, transformContext } from 'react-contextual'

const Theme = moduleContext()(
    ({ context, color, children }) => <context.Provider value={color} children={children} />
)

const Invert = transformContext(Theme, 'color')(
    ({ context, color, children }) => <context.Provider value={invert(color)} children={children} />
)

const Write = subscribe(Theme, 'color')(
    ({ color, text }) => <span style={{ color }}>{text}</span>
)

const App = () => (
    <Theme color="red">
        <Write text="hello" />
        <Invert>
            <Write text="world" />
        </Invert>
    </Theme>,
)
```

#### With decorator

```jsx
@moduleContext()
class Theme extends React.PureComponent {
    // ...
}

@transformContext(ThemeProvider, 'color')
class Invert extends React.PureComponent {
    // ...
}

@subscribe(ThemeProvider, 'color')
class Say extends React.PureComponent {
    // ...
}
```

---

[API](https://github.com/drcmda/react-contextual/blob/master/API.md) | [Changelog](https://github.com/drcmda/react-contextual/blob/master/CHANGELOG.md) | [Pitfalls using context raw](https://github.com/drcmda/react-contextual/blob/master/PITFALLS.md)

## Who is using it

[![AWV](/assets/corp-awv.png)](https://github.com/awv-informatik)
