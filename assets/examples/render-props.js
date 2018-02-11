import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as Store, Subscribe } from 'react-contextual'
import { ThemeContext, ThemeProvider } from './Theme'
import { TimeContext, TimeProvider } from './Time'

ReactDOM.render(
    <ThemeProvider>
        <TimeProvider>
            <Store id="testStore" initialState={{ message: 'the time is:' }}>
                <Subscribe
                    to={[ThemeContext, TimeContext, 'testStore']}
                    select={['theme', 'time', 'store']}>

                    {({ theme, time, store }) => (
                        <h1 style={{ color: theme === 'light' ? '#000' : '#ddd' }}>
                            {store.message} {time}
                        </h1>
                    )}

                </Subscribe>
            </Store>
        </TimeProvider>
    </ThemeProvider>,
    document.getElementById('root'),
)