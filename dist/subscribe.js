"use strict";

exports.__esModule = true;
exports.subscribe = subscribe;
exports.Subscribe = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _context = _interopRequireWildcard(require("./context"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function subscribe() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  // Filter undefined args (can happen if Subscribe injects them)
  args = args.filter(function (a) {
    return a;
  });

  var contextRefs = _context.default,
      mapContextToProps = function mapContextToProps(props) {
    return props;
  };

  if (args.length === 1) {
    // subscribe(mapContextToProps): default context, custom mapContextToProps
    mapContextToProps = args[0];
  } else if (args.length === 2) {
    // subscribe(Context, mapContextToProps): custom context, custom mapContextToProps
    contextRefs = args[0];
    mapContextToProps = args[1];
  }

  return function (Wrapped) {
    return function (props) {
      var isArray = Array.isArray(contextRefs);
      var array = (isArray ? contextRefs : [contextRefs]).map(function (context) {
        return (0, _context.resolveContext)(context, props);
      });
      var values = [];
      return array.concat([Wrapped]).reduceRight(function (accumulator, Context) {
        return _react.default.createElement(Context.Consumer, null, function (value) {
          isArray && values.push(value);
          return accumulator !== Wrapped ? accumulator : _react.default.createElement(Wrapped, _extends({}, props, mapContextToProps(isArray ? values : value, props)));
        });
      });
    };
  };
}

var Subscribe =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(Subscribe, _React$PureComponent);

  function Subscribe() {
    return _React$PureComponent.apply(this, arguments) || this;
  }

  var _proto = Subscribe.prototype;

  _proto.render = function render() {
    var _props = this.props,
        to = _props.to,
        select = _props.select,
        children = _props.children;
    var Sub = subscribe(to, select)(function (props) {
      return children(props);
    });
    return _react.default.createElement(Sub, null);
  };

  return Subscribe;
}(_react.default.PureComponent);

exports.Subscribe = Subscribe;
Object.defineProperty(Subscribe, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    to: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string, _propTypes.default.func])), _propTypes.default.object, _propTypes.default.string, _propTypes.default.func]),
    select: _propTypes.default.func,
    children: _propTypes.default.func.isRequired
  }
});
Object.defineProperty(Subscribe, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    to: _context.default,
    select: function select(props) {
      return props;
    }
  }
});