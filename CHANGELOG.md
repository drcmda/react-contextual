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
