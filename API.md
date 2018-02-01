# API

## subscribe(consumers, mapContextToProps)

```js
import { subscribe } from 'react-contextual'
```

`subscribe` can be used as a functionwrapper or decorator, it generally works with any Context consumer, it isn't bound to contextuals store model.

Example 1: Mapping a single context value as a prop.

```js
subscribe(ThemeContext, theme => ({ theme }))(Component)
```

Example 2: mapContextToProps behaves similar to Reduxes mapStateToProps, the components own props can always be used as well.

```js
subscribe(UsersContext, (users, props) => ({ user: users[props.id] }))(Component)
```

Example 3: Mapping several contexts is also possible, just wrap them into an array.

```js
subscribe([ThemeContext, CountContext], ([theme, count]) => ({ theme, count }))(Component)
```

## subscribe(mapContextToProps)

If you skip the context `subscribe` will fetch `react-contextuals` default context, which is used by its provider. It is basically a short cut for:

```js
import { subscribe, Context } from 'react-contextual'

subscribe(Context, mapContextToProps)(Component)
```

## Subscribe

```js
import { Subscribe } from 'react-contextual'
```

The same as the higher-order-component above, but as a component: `<Subscribe to={} select={}/>`. The semantics are the same, it can digest one or multiple contexts. The context that you have mapped to props will be passed as a render prop. Just like `subscribe` can skip the first argument and use `react-contextuals` default context, so can `Subscribe` if you omitt the `to` property.

```
<Subscribe to={Context} select={({ state }) => state}>
    {state => <div>hi there {state.name}</div>}
</Subscribe>
```

## Provider

```js
import { Provider } from 'react-contextual'
```

Perhaps the worlds smallest Redux-like store. It pulls it off by letting React handle context distribution and state diffing. Declare the initial state with the `initialState` prop, and actions with the `actions` prop. That's it! The provider will distribute `{ state, actions }` to listening consumers, either using Reacts API directly or contextuals `connect` HOC. There is an additional prop `renderOnce` that is `true` by default, it will prevent the sub-tree from rendering on state-changes so that you can safely wrap your app into the provider.

The provider will only render once to prevent sub-tree re-rendering on every occuring change. Children otherwise behave normally of course. Any change to the store caused by an action will trigger consuming components.

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