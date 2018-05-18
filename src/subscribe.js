import React from 'react'
import PropTypes from 'prop-types'
import ProviderContext, { getNamedContext, resolveContext } from './context'

const toArray = obj => (Array.isArray(obj) ? obj : [obj])

export function subscribe(...args) {
  return Wrapped =>
    function SubscribeWrap(props) {
      // Filter undefined args (can happen if Subscribe injects them)
      args = args.filter(a => a)
      let contextRefs = ProviderContext,
        mapContextToProps = props => props
      if (args.length === 1) {
        // Check if the argument is a valid context first, if not, assume mapContextToProps
        if (resolveContext(args[0], props, null)) contextRefs = args[0]
        else mapContextToProps = args[0]
      } else if (args.length === 2) {
        // subscribe(Context, mapContextToProps)
        contextRefs = args[0]
        mapContextToProps = args[1]
      }
      if (typeof mapContextToProps !== 'function') {
        // 'theme' or ['theme', 'user', 'language']
        const values = mapContextToProps
        mapContextToProps = (...args) =>
          toArray(values).reduce(
            (acc, key, index) => ({ ...acc, [key]: args[index] }),
            {}
          )
      }
      contextRefs = toArray(contextRefs).map(context =>
        resolveContext(context, props)
      )
      return contextRefs.reduceRight(
        (inner, ctx) => (...args) => (
          <ctx.Consumer>{value => inner(...args, value)}</ctx.Consumer>
        ),
        (...values) => {
          let context = mapContextToProps(...values, props)
          context = typeof context === 'object' ? context : { context }
          return <Wrapped {...props} {...context} />
        }
      )()
    }
}

export class Subscribe extends React.PureComponent {
  static propTypes = {
    to: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.object,
          PropTypes.string,
          PropTypes.func,
        ])
      ),
      PropTypes.object,
      PropTypes.string,
      PropTypes.func,
    ]),
    select: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    children: PropTypes.func.isRequired,
  }
  static defaultProps = { to: ProviderContext, select: props => props }

  render() {
    const { to, select, children, render, ...rest } = this.props
    return React.createElement(
      subscribe(to, select)(
        props =>
          render
            ? render({ ...props, ...rest, children })
            : children({ ...props, ...rest })
      ),
      rest
    )
  }
}
