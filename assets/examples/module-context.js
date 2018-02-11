import React from 'react'
import ReactDOM from 'react-dom'
import { moduleContext, subscribe } from 'react-contextual'

const ThemeProvider = moduleContext()(
    ({ context, color, children }) => <context.Provider value={color} children={children} />
)

const Say = subscribe(ThemeProvider, 'color')(
    ({ color, text }) => <span style={{ color }}>{text}</span>
}

ReactDOM.render(
    <ThemeProvider color="red">
        <Say text="hello" />
        <ThemeProvider color="green">
            <Say text="world" />
        </ThemeProvider>
    </ThemeProvider>,
    document.getElementById('root'),
)