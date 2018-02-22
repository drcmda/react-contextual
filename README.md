<p align="center">
  <img width="500" height="314" src="assets/logo-3d-flat.png">
</p>

[![Build Status](https://travis-ci.org/drcmda/react-contextual.svg?branch=master)](https://travis-ci.org/drcmda/react-contextual) [![codecov](https://codecov.io/gh/drcmda/react-contextual/branch/master/graph/badge.svg)](https://codecov.io/gh/drcmda/react-contextual) [![npm version](https://badge.fury.io/js/react-contextual.svg)](https://badge.fury.io/js/react-contextual)

    npm install react-contextual

# Why 🤔

* consume (and create) context with ease, every kind of context, no matter which or whose or how many providers
* a minimal redux-like store pattern with setState semantics and central actions

Reacts new context api is very powerful albeit low-level as it does not prescribe patterns and can cause some issues if used naively. `react-contextual` makes creating, sharing and consuming context easier, maps context values to component props similar to how redux operates, takes care of nesting, renders only when necessary and provides a small store for state distribution. Click [this link](https://github.com/drcmda/react-contextual/blob/master/PITFALLS.md) for a detailed explanation.

# If you just need a light-weight no-frills store 🎰

Use the [Provider](https://github.com/drcmda/react-contextual/blob/master/API.md#provider) to distribute state and actions, wrap consumers within. Read by using the [subscribe](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe) HOC or the [Subscribe](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe-as-a-component) component.

### Render props

```jsx
import { Provider, Subscribe } from 'react-contextual'

const store = {
    initialState: { count: 0 },
    actions: {
        up: () => state => ({ count: state.count + 1 }),
        down: () => state => ({ count: state.count - 1 }),
    },
}

ReactDOM.render(
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
    document.getElementById('root'),
)
```

### Higher Order Component

```jsx
import { Provider, subscribe } from 'react-contextual'

const View = subscribe()(props => (
    <div>
        <h1>{props.count}</h1>
        <button onClick={props.actions.up}>Up</button>
        <button onClick={props.actions.down}>Down</button>
    </div>
))

ReactDOM.render(
    <Provider {...store}>
        <View />
    </Provider>,
    document.getElementById('root'),
)
```

### With decorator

```jsx
@subscribe()
class View extends React.PureComponent {
    // ...
}
```

### External store

Alternatively you can maintain an [external store](https://github.com/drcmda/react-contextual/blob/master/API.md#createstore), which is a valid reference to `subscribe`. This store is fully reactive and you can trigger actions and read state. It also features a basic subscription model, similar to a redux store.

```jsx
import { Provider, createStore, subscribe } from 'react-contextual'

const externalStore = createStore({
    initialState: { count: 1 },
    actions: { up: () => state => ({ count: state.count + 1 }) },
})

const Test = subscribe(externalStore, props => ({ count: props.count }))(
    props => <button onClick={() => externalStore.actions.up()}>{props.count}</button>,
)

render(
    <Provider store={externalStore}>
        <Test />
    </Provider>,
    document.getElementById('root'),
)
```

### Examples

* [Counter](https://codesandbox.io/embed/3vo9164z25)
* [Basic example](https://codesandbox.io/embed/lxly45lvkl)
* [Async actions](https://codesandbox.io/embed/ywyr3q5n4z)
* [Memoization/Reselect](https://codesandbox.io/embed/yvx9my007z)
* [Multiple stores](https://codesandbox.io/embed/0o8pj1jz7v)
* [External store](https://codesandbox.io/embed/3vo9164z25)

# If you like to provide context 🚀

Reacts default api works with singletons, that makes it tough to create multi-purpose, nestable providers. Use [namedContext](https://github.com/drcmda/react-contextual/blob/master/API.md#namedcontext) to create unique context bound to a components lifecycle, [moduleContext](https://github.com/drcmda/react-contextual/blob/master/API.md#modulecontext) for module-scoped context and [transformContext](https://github.com/drcmda/react-contextual/blob/master/API.md#transformcontext) to transform existing context providers (like a declarative middleware). Use [helper functions](https://github.com/drcmda/react-contextual/blob/master/API.md#imperative-context-handling) if you want to control the lifecycle of a context by yourself.

```jsx
import { subscribe, moduleContext, transformContext } from 'react-contextual'

const Theme = moduleContext()(({ context, color, children }) => <context.Provider value={color} children={children} />)

const Invert = transformContext(Theme, 'color')(({ context, color, children }) => (
    <context.Provider value={invert(color)} children={children} />
))

const Write = subscribe(Theme, 'color')(({ color, text }) => <span style={{ color }}>{text}</span>)

ReactDOM.render(
    <Theme color="red">
        <Write text="hello" />
        <Invert>
            <Write text="world" />
        </Invert>
    </Theme>,
    document.getElementById('root'),
)
```

### With decorator

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

### Examples

* [Unique context](https://codesandbox.io/embed/ox405qqopy)
* [Global context](https://codesandbox.io/embed/v8pn13nq77)
* [Imperative context](https://codesandbox.io/embed/30ql1rxzlq)
* [Generic React Context](https://codesandbox.io/embed/55wp11lv4)
* [Transforms](https://codesandbox.io/embed/mjv84k1kn9)

---

[API](https://github.com/drcmda/react-contextual/blob/master/API.md) | [Changelog](https://github.com/drcmda/react-contextual/blob/master/CHANGELOG.md) | [Pitfalls using context raw](https://github.com/drcmda/react-contextual/blob/master/PITFALLS.md)

## Who is using it

[![AWV](/assets/corp-awv.png)](https://github.com/awv-informatik)
