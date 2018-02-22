# Reacts new context api

The context api is deliberately kept low-level, which makes it very powerful and flexible, but at the same time there are a couple of pitfalls you could run into if the api is used naively.

## Performance

### Sub-tree re-rendering

A context provider will re-render its sub-tree every time it changes. It is a component after all. If you plan to wrap your app in a provider like you would normally do with something like redux you need to be aware of it (using PureComponents or employ strategies from shouldComponentUpdate).

react-contextual prevents its store from re-rendering its contents, which remain reactive of course. You use it in the same way you use reduxes `Provider`.

### Consuming context can trigger unnecessary renders

A context consumer wrapped in one or multiple providers can render needlessly, even if the state it is interested in remains the same. Safeguarding against it [brings its own pitfalls](https://github.com/facebook/react/issues/12185).

react-contextual selects state, [similar to reduxes connect](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe). Extend your wrapped components from `React.PureComponent` and they will only render if the selected state has actually changed, even if components sit deeply nested in multiple prividers & consumers.

## Nesting

Used raw the api can [cause heavy nesting](https://user-images.githubusercontent.com/810438/36044918-090ab492-0dcc-11e8-9535-26495e3c8778.png), every time you tap into a providers value, and worse if you have to read out several.

react-contextual on the other hand supports both render props and traditional HOC patterns, while allowing you to select from multiple context providers in one strike.

```js
subscribe(
    [ThemeContext, UserContext, LanguageContext], 
    (theme, user, language) => ({ theme, user, language })
)(Component)
```

## Creating context

Context is just an object that is not tied to a component any longer. That makes it harder if you want to have component-bound or dynamic context. If you plan to re-use a provider class it would overwrite values set by previous instances.

react-contextual solves this by offering a couple of higher order components like [namedContext](https://github.com/drcmda/react-contextual/blob/master/API.md#namedcontext), [moduleContext](https://github.com/drcmda/react-contextual/blob/master/API.md#modulecontext) and some [helper functions](https://github.com/drcmda/react-contextual/blob/master/API.md#imperative-context-handling).

## Sharing context

There are no prescriptions on how to share or distribute context. Do you add it to a components prototype? Do you export it next to your component? Will the end user by fine with conflicting standards on how or where to fetch context in order to consume it? Will end-users consume context at all or is it better to write bindings around it?

react-contextual makes sharing easy. It maps keyed, unique contexts internally and allows global, module-scoped context to be refered by the component that instanciates it.

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
@subscribe(GenericReactContext, value => ({ value }))

@namedContext('uniquelyNamedContext')
@subscribe('uniquelyNamedContext', value => ({ value }))

@namedContext(props => props.dynamicallyDerivedKey)
@subscribe(props => props.dynamicallyDerivedKey, value => ({ value }))
*/
```
