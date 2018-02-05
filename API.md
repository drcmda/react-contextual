# API

## subscribe(consumers, mapContextToProps)

```js
import { subscribe } from 'react-contextual'
```

`subscribe` can be used as a functionwrapper or decorator, it generally works with any Context consumer, it isn't bound to contextuals store model. A consumer can be the following:

1. ObjectContext - any React context
2. "myContextId" - any string id of a regeistered provider
3. props => props.id - a function that returns a context object

Example 1: Mapping a single context value as a prop.

```js
subscribe(ThemeContext, theme => ({ theme }))(AnyComponent)
```

Example 2: mapContextToProps behaves similar to Reduxes mapStateToProps, the components own props can always be used as well.

```js
subscribe(UsersContext, (users, props) => ({ user: users[props.id] }))(AnyComponent)
```

Example 3: Mapping several contexts is also possible, just wrap them into an array. The props you receive in the selector (the 2nd argument) will also be wrapped as an array, where the order of props matches the order of the providers.

```js
subscribe([ThemeContext, CountContext], ([theme, count]) => ({ theme, count }))(AnyComponent)
```

## subscribe(mapContextToProps)

If you skip the context `subscribe` will fetch `react-contextuals` default context, which is used by its provider. It is basically a short cut for:

```js
import { subscribe, Context } from 'react-contextual'

subscribe(Context, mapContextToProps)(AnyComponent)
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

A small Redux-like store. Declare the initial state with the `initialState` prop, and actions with the `actions` prop. The provider will distribute `{ ...state, actions }` to listening components which either use Reacts API directly or contextuals `subscribe` hoc to consume it. There is an additional prop `renderOnce` that is `true` by default, it will prevent the sub-tree from rendering on state-changes so that you can safely wrap your app into the provider. Children otherwise behave normal. Any change to the store caused by an action will trigger consuming components.

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