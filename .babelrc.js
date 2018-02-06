const loose = true

module.exports = {
    presets: [
        ['@babel/preset-env', { loose, modules: false }],
        ['@babel/preset-stage-2', { loose }],
        '@babel/preset-react',
    ],
    plugins: [
        ['transform-react-remove-prop-types', { mode: 'unsafe-wrap' }],
        'annotate-pure-calls',
    ]
}
