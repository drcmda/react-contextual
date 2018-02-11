@moduleContext()
class ThemeProvider extends React.PureComponent {
    render() {
        const { context, color, children } = this.props
        return <context.Provider value={color} children={children} />
    }
}

@subscribe(ThemeProvider, 'color')
class Say extends React.PureComponent {
    render() {
        const { color, text } = this.props
        <span style={{ color }}>{text}</span>
    }
}