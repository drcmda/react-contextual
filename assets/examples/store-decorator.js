@subscribe(({ message, actions }) => ({ message, setMessage: actions.setMessage }))
class Message extends React.PureComponent {
    // ...
}