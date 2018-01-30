react-contextual is a tiny store/hoc pattern around React 16's new context API. It makes dealing with multiple contexts easier and provides a simple setState/redux-like store-pattern, also driven by context.

It currently relies on ReactTraining/react-broadcast until the official context API is officially published.

# Installation

    npm install react-contextual

# How to use ...

```js
import React from 'react'
import { context, StoreProvider, StoreContext } from 'react-contextual'

@context(StoreContext, ({ state, actions }) => ({ name: state.name, age: state.age, actions }))
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

React.Render(
    <StoreProvider
        initialState={{ name: 'max', age: 99,  }}
        actions={{
            setName: name => ({ name }),
            setAge: age => state => ({ age: state.age }),
        }}>
        <TestStore />
    </StoreProvider>,
    document.getelementbyid('app'),
)
```

# API

## @context(contexts, mapContextToProps)

`context` can be used as a functionwrapper or decorator, it generally works with any Context, it isn't bound to to contextuals store model.

Mapping a single context value as a prop, that will be available to the receiving component:

```js
@context(ThemeProvider.Context, theme => ({ theme }))
```

Mapping several contexts. (the components own props can always be used as well, just like as in Redux):

```js
@context([ThemeProvider.Context, CounterProvider.Context], ([theme, count], props) => ({ theme, count }))
```

## StoreProvider

Provides a minimal redux-like store. Provide the initial state via the `initialState` prop, and actions via the `action` prop. That's it, both the state and the actions will be distributed by the provider and can be consumed either with Reacts default api, or by contextuals HOC.

Simple actions get merged into the state:

```js
actions={{
    setName: name => ({ name }),
    setAge: age => ({ age }),
}}>
```

More complex actions can pass a function instead and access the stores state:

```js
actions={{
    setName: name => state => ({ name: state.name + state.surname },
    setAge: age => state => ({ age: state.somethingElse }),
}}>
```
