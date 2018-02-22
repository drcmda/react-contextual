import { subscribe, moduleContext, transformContext } from 'react-contextual'

const Theme = moduleContext()(
    ({ context, color, children }) => <context.Provider value={color} children={children} />
)

const Invert = transformContext(Theme, 'color')(
    ({ context, color, children }) => <context.Provider value={invert(color)} children={children} />
)

const Write = subscribe(Theme, 'color')(
    ({ color, text }) => <span style={{ color }}>{text}</span>
)

ReactDOM.render(
    <Theme>
        <Write text="hello" />
        <Invert>
            <Write text="world" />
        </Invert>
    </Theme>,
    document.getElementById('root'),
)
