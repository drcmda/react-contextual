@moduleContext()
class Theme extends React.PureComponent {
    // ...
}

@transformContext(ThemeProvider, 'color')
class Invert extends React.PureComponent {
    // ...
}

@subscribe(ThemeProvider, 'color')
class Say extends React.PureComponent {
    // ...
}