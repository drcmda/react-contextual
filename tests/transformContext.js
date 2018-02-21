import React from 'react'
import manipulateColor from 'color'
import { moduleContext, transformContext, subscribe } from '../src/'

const invert = color =>
    manipulateColor(color)
        .negate()
        .string()

const defaultStyle = { color: 'white', backgroundColor: 'pink' }

const Theme = moduleContext()(
    class extends React.PureComponent {
        render() {
            const { context, style, children } = this.props
            const theme = { ...defaultStyle, ...style }
            return <context.Provider value={theme} children={children} />
        }
    },
)

const InvertTheme = transformContext(Theme, theme => ({ theme }))(
    class extends React.PureComponent {
        render() {
            const { context, theme, children } = this.props
            const inverted = Object.keys(theme).reduce((acc, key) => ({ ...acc, [key]: invert(theme[key]) }), {})
            return <context.Provider value={inverted} children={children} />
        }
    },
)

const Write = subscribe(Theme, theme => ({ theme }))(
    class extends React.PureComponent {
        render() {
            const { theme, text } = this.props
            return <span style={{ ...theme, padding: 10 }}>{text}</span>
        }
    },
)

it('renders correctly', async () => {
    await snapshot(
        <Theme style={{ color: 'red' }}>
            <Write text="is" />
            <Theme style={{ color: 'green' }}>
                <Write text="it" />
                <InvertTheme>
                    <Write text="friday" />
                    <InvertTheme>
                        <Write text="yet" />
                    </InvertTheme>
                </InvertTheme>
            </Theme>
        </Theme>,
    )
})
