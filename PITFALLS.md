# Reacts new context api

The context api has been kept low-level which makes it very powerful and flexible, but at the same time there are a couple of annoyances you could run into if the api is used naively.

## Ease of use

React always had a nice and simple api to communicate changes: setState. Unfortunately it never was feasible for sub-tree changes. Neither passing state down the tree nor compound components could really fix it. Unfortunately there weren't any easy alternatives, and state managers like redux and mobX changed everything you know, so you go from simple setState to boilerplate heavy action-creators and intricate observable systems. The old context api was stale, it couldn't communicate changes made to the original object so many libs had to ship their own broadcast mechanisms: redux, mobx, react-router, they all carry that overhead.

The new context api does not solve the problem, it is too low-level and abstract to be easily applicable to component-to-component communication as well as something like global setState for application state (reasons below).

But, it pretty much paves the way for abstractions that can delegate the workload to React. react-contextual doesn't need broadcasters, scu fillers, diffing engine, bindings, etc. The overhead is actually minimal to elevate setState.

## Performance

### Sub-tree re-rendering

A context provider will re-render its sub-tree every time it changes, it is a component after all. If you plan to wrap your app in a provider like you would do with something like reduxes Provider you need to be aware of it, either using PureComponent or filling shouldComponentUpdate.

react-contextuals `Provider` behaves like reduxes in that it communicates changes down its sub-trees without causing components to re-render that shouldn't.

### Consuming context can trigger unnecessary renders

A context consumer wrapped in one or multiple providers can render needlessly, even if the state it is interested in remains the same. Again, safeguarding against it [brings its own pitfalls](https://github.com/facebook/react/issues/12185) you would have to be aware of.

react-contextual maps context state to component props, [similar to reduxes connect](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe). That means you can pick properties or even use [memoized selectors](https://codesandbox.io/embed/yvx9my007z). Extending the wrapped component from `React.PureComponent` will only render if the selected state has actually changed, even if components sit deeply nested in multiple prividers & consumers that trigger on various state changes.

## Nesting

Used raw the api can [cause heavy, visual nesting](https://user-images.githubusercontent.com/810438/36044918-090ab492-0dcc-11e8-9535-26495e3c8778.png), every time you consume a providers value, worse if you have to read out several.

react-contextual supports both render props and HOCs, allowing you to select multiple providers at once.

```js
subscribe(
    [ThemeContext, UserContext, LanguageContext], 
    (theme, user, language) => ({ theme, user, language })
)(Component)
```

## Render props

As powerful as they might be, they can stretch code and maybe sometimes you'd rather have connected components instead that you can simply place without having to wrap everything. Both have their props and cons, react-contextual offers better, more selective render props and higher order components with the same semantics you know from redux.

## Creating context

React.createContext creates an object that is not tied to a component any longer. Usually it's used as a singleton. That makes it harder if you want to have component-bound (like it used to be with the old api) or dynamic context. That also means you can't re-use a provider in a nested tree as it would overwrite values set by previous instances.

react-contextual solves this by offering a couple of higher order components like [namedContext](https://github.com/drcmda/react-contextual/blob/master/API.md#namedcontext), [moduleContext](https://github.com/drcmda/react-contextual/blob/master/API.md#modulecontext), [transformContext](https://github.com/drcmda/react-contextual/blob/master/API.md#transformcontext) and some [helper functions](https://github.com/drcmda/react-contextual/blob/master/API.md#imperative-context-handling).

## Sharing context

There are no prescriptions on how to share or distribute context. If you have a provider-component, how do you pass on its context so users can consume it? Do you add it to a components prototype? Do you export it next to your component? It's questionable if the api is meant for sharing at all as there will be conflicting standards on how or where to fetch context.

react-contextual makes sharing straight forward. It maps context internally and allows various ways to reference it: unique keys, component references, dynamic functions that determine context at runtime, and regular React context objects. In most of all cases you would probably want to use `moduleContext` and simlpy use the component itself as a reference for `subscribe`.

```js
@moduleContext()
class Theme extends React.PureComponent {
    render() {
        const { context, children } = this.props
        return <context.Provider value={{ color: "red", backgroundColor: "yellow" }} children={children} />
    }
}

// Refers to the actual class above, no need for a separate context-handle
@subscribe(Theme, theme => ({ color: theme.color }))
class Header extends React.PureComponent {
    render() {
        // renders only when theme.color changes ...
        return <h1 style={{ color: this.props.color }}>hello</h1>
    }
}

/*
// Any React context, polyfills work, too (react-broadcast, create-react-context, etc)
@subscribe(GenericReactContext, value => ({ value }))

// Any keyed context (creates by the namedContext hoc)
@namedContext('uniquelyNamedContext')
@subscribe('uniquelyNamedContext', value => ({ value }))

// Any dynamic context
@namedContext(props => props.dynamicallyDerivedKey)
@subscribe(props => props.dynamicallyDerivedKey, value => ({ value }))

// Any created store
const store = createStore(...)
@subscribe(store, value => ({ value }))
*/
```
