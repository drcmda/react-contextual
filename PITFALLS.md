# Reacts new context api

The context api is deliberately kept low-level, which makes it very powerful and flexible, but at the same time hard if you plan to use it raw. There are a couple of pitfalls you could run into if the api is used naively.

## Performance

### Sub-tree re-rendering

A context provider will re-render its sub-tree every time it changes. It is a component after all. If you plan to wrap your app in a provider like you would normally do with something like redux you need to be aware of it.

### Consuming context will trigger render

A context consumer will trigger a render, even if the state is the same. It gets more complex if you're reading from several consumers or your component just happens to be in a sub-tree whose context isn't of particular interest.

react-contextuals selects state, [similar to reduxes connect](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe), simply make your component a `React.PureComponent` and it will only render if the particular state it selected has changed, even if is nested into multiple consumers.

## Nesting

Used raw the api will cause heavy nesting, every time you tap into a consumers value.

### Used raw

```
<ThemeContext.Consumer>
    {theme => (
        <UserContext.Consumer>
             {user => (
                <LanguageContext.Consumer>
                     {language => (
                         <div>
                            {theme}, {user}, {language}
                         <div>
                     )}
                </LanguageContext.Consumer>
             )}
        </UserContext.Consumer>
    )}
</ThemeContext.Consumer>
```

### react-contextual

```js
@subscribe(
    [ThemeContext, UserContext, LanguageContext], 
    ([theme, user, language]) => ({ theme, user, language })
)(Component)
```

## Creating context

Context is just an object that is not tied to a component any longer. That makes it harder if you want to have component-bound or dynamic context. If you plan to re-use a provider class it would overwrite values set by previous instances.

react-contextual solves this by offering a couple of higher order components like [namedContext](https://github.com/drcmda/react-contextual/blob/master/API.md#namedcontext), [moduleContext](https://github.com/drcmda/react-contextual/blob/master/API.md#modulecontext) and some [helper functions](https://github.com/drcmda/react-contextual/blob/master/API.md#imperative-context-handling).

## Sharing context

There are no prescriptions on how to share or distribute context. Do you add it to a components prototype? Do you export it next to your component? Will the end user by fine with conflicting standards on how or where to fetch context in order to consume it?

react-contextual either maps keyed, unique contexts internally or injects module-scoped context as `Component.Context`.