# subscribe

## subscribe(providers, mapContextToProps)(AnyComponent)

```js
import { subscribe } from 'react-contextual'
```

`subscribe` can be used as a functionwrapper or decorator, it generally works with any context, it is not bound to contextual's store model. A provider can one of the following:

1. any React context
2. any string key of a [registered provider](https://github.com/drcmda/react-contextual/blob/master/API.md#namedcontext)
3. any reference to a moduleContext/namedContext provider
4. any reference to a store created with createStore

Example 1: Mapping a single context value as a prop. Mapping helps performance. If you only pick the props your component is interested in it will only render when necessary and ignore context changes otherwise.

```js
subscribe(Store, store => ({ theme: store.theme }))(AnyComponent)
```

Example 2: mapContextToProps behaves similar to Reduxes mapStateToProps. The component's own props can always be used as well.

```js
subscribe(UsersContext, (users, props) => ({ user: users[props.id] }))(AnyComponent)
```

Example 3: Mapping several contexts is also possible, just wrap them into an array. The props you receive in the 2nd argument will be in the same order.

```js
subscribe([ThemeContext, CountContext], (theme, count) => ({ theme, count }))(AnyComponent)
```

You can also pass strings to mapContextToProps to make it shorter:

```js
subscribe(ThemeContext, 'theme')(AnyComponent)
subscribe([ThemeContext, CountContext], ['theme', 'count'])(AnyComponent)
```

Example 3: You can also pass a function which should return either a context object or key. You will be able to access the components props here as well.

```js
subscribe(props => props.id, theme => ({ theme }))(AnyComponent)
```

## subscribe(mapContextToProps)(AnyComponent)

If you skip the providers `subscribe` will fetch `react-contextuals` default context for its [own store](https://github.com/drcmda/react-contextual/blob/master/API.md#provider). It is basically a short cut for:

```js
import { subscribe, ProviderContext } from 'react-contextual'

subscribe(ProviderContext, mapContextToProps)(AnyComponent)
```

# Subscribe as a component

```js
import { Subscribe } from 'react-contextual'
```

The same as the higher-order-component above, but as a component: `<Subscribe to={} select={}/>`. The semantics are the same, it can digest one or multiple contexts. Mapped context will be passed as a render prop. Just like `subscribe` can skip the first argument and use `react-contextuals` default context, so can `Subscribe` if you omit the `to` property.

```
<Subscribe to={ProviderContext} select={({ state }) => state}>
    {state => <div>hi there {state.name}</div>}
</Subscribe>
```

# Provider

```js
import { Provider } from 'react-contextual'
```

A small Redux-like store. Declare the initial state with the `initialState` prop, and actions with the `actions` prop. The provider will distribute `{ ...state, actions }` to listening components which either use React's API directly or contextual's `subscribe` hoc to consume it. Alternatively you can pass an [external store](https://github.com/drcmda/react-contextual/blob/master/API.md#createstore) by the `store` props.

Actions are made of a collection of functions which return an object that is going to be merged back into the state using regular `setState` semantics.

They can be simple ...

```js
setName: name => ({ name }),
```

Or slightly more complex when you pass functions instead, which allow you to access the stores state, useful for computed/derived props, composition, deep-merging or memoization:

```js
increaseCount: by => state => ({ count: state.count + by }),
```

Or async actions, which are supported out of the box:

```js
setColor: backgroundColor => async state => {
    await delay(1000)
    return { backgroundColor }
}
```

# createStore

```jsx
import { createStore } from 'react-contextual'

const externalStore = createStore({
    initialState: { count: 1 },
    actions: { up: () => state => ({ count: state.count + 1 }) },
    // Everything you add on top will be available to components that subscribe to it:
    personalStuff: {
        something: 123
    }
})
```

Creates an external store. It takes an object that needs to provide `initialState` and `actions`. The store is fully reactive, that means you can read out state (`store.getState()`) and call actions (`store.actions.up()`) as well as `store.subscribe(callback)` to it whenever it changes. If you do not pass actions, it will create `actions.setState` with React's semantics by default. Note: the store will only be alive once it has been tied to a provider, it won't function on its own.

```jsx
const remove = externalStore.subscribe(state => console.log(state))
externalStore.actions.up()
const count = externalStore.getState().count
remove()
```

# namedContext

## namedContext(name, defaultValue)(AnyComponent)

```js
import { namedContext } from 'react-contextual'
```

`name` can either be a string, in which case a context will be created under that name and you can to refer it as such in `subscribe`. You can also pass a function, for instance `props => props.id`. It has to return a string which will be the name of the created context.

The context will be dynamically created when the wrapped component mounts and will be removed once it unmounts. The actual context will be injected as prop (`context`) so it is available for the wrapped component which can now render its Provider.

```js
@namedContext(props => props.id)
class Theme extends React.PureComponent {
    render() {
        const { context: Context, children } = this.props
        return <Context.Provider value="red" children={children} />
    }
}

ReactDOM.render((
    <Theme id="main-theme">
        <Subscribe to="main-theme" select="color">{props => props.color}</Subscribe>
    </Theme>,
    document.getElementById('root')
)
```

# moduleContext

## moduleContext(defaultValue)

```js
import { moduleContext } from 'react-contextual'
```

Creates a global module-scoped context object and injects it both as `this.props.context` into the wrapped component. Consumers can import the component and readily use it as a context provider:

```js
@moduleContext()
class Theme extends React.PureComponent {
    render() {
        const { context: Context, children } = this.props
        return <Context.Provider value="red" children={children} />
    }
}

@subscribe(Theme, theme => ({ theme }))
class Header extends React.PureComponent {
    render() {
        return <h1 style={{ color: theme }}>hello</h1>
    }
}
```

# transformContext

## transformContext(context, transform)

```js
import { transformContext } from 'react-contextual'
```

Reads a previous context provider and provides a transformed version of its value. Think of it as a middleware.

```js
@moduleContext()
class Theme extends React.PureComponent {
    render() {
        const { context, color, children } = this.props
        return <context.Provider value={color} children={children} />
    }
}

@transformContext(Theme, color => ({ color }))
class InvertTheme extends React.PureComponent {
    render() {
        const { context, color, children } = this.props
        return <context.Provider value={0xffffff ^ color} children={children} />
    }
}

@subscribe(Theme, color => ({ color }))
class Say extends React.PureComponent {
    render() {
        const { color, text } = this.props
        return <span style={{ color: '#' + ('000000' + color.toString(16)).substr(-6) }}>{text}</span>
    }
}

ReactDOM.render(
    <Theme color={0xff0000}>
        <Say text="all " />
        <Theme color={0x00ff00}>
            <Say text="is " />
            <InvertTheme>
                <Say text="well" />
            </InvertTheme>
        </Theme>
    </Theme>,
    document.getElementById('root'),
)
```

# imperative context handling

```js
import { getNamedContext, createNameContext, removeNamedContext } from 'react-contextual'
```

* createNameContext(name)

    Registers and returns a context.

* getNamedContext(name)

    Returns a context.

* removeNamedContext(name)

    Removes the context from the internal map.
