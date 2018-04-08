## 4.0.0

react-broadcast has been removed. react-contextual is now at the least reliant upon react@16.3.1.

## 3.8.0

* createStore

    Creates an [external store](https://github.com/drcmda/react-contextual/blob/master/API.md#createstore), which is a valid reference to `subscribe`. This store is fully reactive and you can trigger actions and read state. It also features a basic subscription model, similar to a redux store.

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

## 3.7.0

* transformContext

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
    ```

## 3.6.0

* moduleContext

    moduleContext *will not* inject `.Context` any longer, which was kind of dirty. It will use the symbol of the *wrapped component* as a reference. Consumers are allowed to simply pass component.

    ```js
    @moduleContext()
    class Theme extends React.PureComponent {
        // ...
    }

    // Previously: @subscribe(Theme.Context ...
    @subscribe(Theme, theme => ({ theme }))
    class Header extends React.PureComponent {
        // ...
    }
    ```

## 3.5.0

* mapContextToState accepts strings

    ```js
    // Make context available under the prop 'theme'
    subscribe(Context, 'theme')

    // Make multiple context providers available under the following names in their respective order
    subscribe([Theme, User, Language], ['theme', 'user', 'language'])
    
    // Make multiple context providers available under the prop 'values'
    subscribe([Theme, User, Language], 'values')
    ```

    That applies to `<Subscribe select={...}>` as well of course.

## 3.4.0

* moduleContext

    Creates a global module-scoped context object and injects it both as `this.props.context` into the wrapped component, as well as `Component.Context`, so consumers can import the component and readily use it:

    ```js
    import { moduleContext } from 'react-contextual'

    @moduleContext()
    class Theme extends React.PureComponent {
        render() {
            const { context: Context, children } = this.props
            return <Contest.Provider value="red" children={children} />
        } 
    }

    @subscribe(Theme.Context, theme => ({ theme }))
    class Header extends React.PureComponent {
        render() {
            return <h1 style={{ color: theme }}>hello</h1>
        }
    }
    ```
