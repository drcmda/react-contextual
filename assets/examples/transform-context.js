import { moduleContext, transformContext, subscribe } from 'react-contextual'
import manipulateColor from 'color'

@moduleContext()
class Theme extends React.PureComponent {
    render() {
        const { context, style, children } = this.props
        return <context.Provider value={{ color: 'white', backgroundColor: 'pink', ...style }} children={children} />
    }
}

@transformContext(Theme, theme => ({ theme }))
class InvertTheme extends React.PureComponent {
    invert = color => manipulateColor(color).negate().string()
    render() {
        const { context, theme, children } = this.props
        const inverted = Object.keys(theme).reduce((acc, key) => ({ ...acc, [key]: this.invert(theme[key]) }), {})
        return <context.Provider value={inverted} children={children} />
    }
}

@subscribe(Theme, theme => ({ theme }))
class Write extends React.PureComponent {
    render() {
        const { theme, text } = this.props
        return <span style={{ ...theme, padding: 10 }}>{text}</span>
    }
}

ReactDOM.render(
    <Theme style={{ color: 'red' }}>
        <Write text="all" />
        <Theme style={{ color: 'green' }}>
            <Write text="is" />
            <InvertTheme>
                <Write text="well" />
            </InvertTheme>
        </Theme>
    </Theme>,
    document.getElementById('root'),
)