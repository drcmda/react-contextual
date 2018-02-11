import React from 'react'
import ReactDOM from 'react-dom'
import { subscribe } from 'react-contextual'
import { ThemeContext, ThemeProvider } from './Theme'
import { TimeContext, TimeProvider } from './Time'

const Test = subscribe([ThemeContext, TimeContext], [theme, time])(
    ({ theme, time }) => <h1 style={{ color: theme === 'light' ? '#000' : '#ddd' }}>{time}</h1>
)

ReactDOM.render(
    <ThemeProvider>
        <TimeProvider>
            <Test />
        </TimeProvider>
    </ThemeProvider>,
    document.getElementById('root'),
)