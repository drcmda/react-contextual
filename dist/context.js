"use strict";

exports.__esModule = true;
exports.createNamedContext = createNamedContext;
exports.getNamedContext = getNamedContext;
exports.removeNamedContext = removeNamedContext;
exports.resolveContext = resolveContext;
exports.namedContext = namedContext;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactBroadcast = require("react-broadcast");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var providers = new Map();
var Context = (0, _reactBroadcast.createContext)();

function createNamedContext(name, initialState) {
  var context = (0, _reactBroadcast.createContext)(initialState);
  providers.set(name, context);
  return context;
}

function getNamedContext(name) {
  return providers.get(name);
}

function removeNamedContext(name) {
  providers.delete(name);
}

function resolveContext(context, props) {
  if (typeof context === 'string') return getNamedContext(context) || context;else if (typeof context === 'function') return resolveContext(context(props));else return context;
}

function namedContext(contextName, initialState) {
  return function (Wrapped) {
    return (
      /*#__PURE__*/
      function (_React$PureComponent) {
        _inheritsLoose(_class, _React$PureComponent);

        function _class(props) {
          var _this;

          _this = _React$PureComponent.call(this) || this;
          var name = resolveContext(contextName, props);
          _this.state = {
            context: createNamedContext(name, initialState),
            name: name
          };
          return _this;
        }

        var _proto = _class.prototype;

        _proto.componentWillUnmount = function componentWillUnmount() {
          removeNamedContext(this.state.name);
        };

        _proto.render = function render() {
          return _react.default.createElement(Wrapped, _extends({}, this.props, {
            context: this.state.context
          }));
        };

        return _class;
      }(_react.default.PureComponent)
    );
  };
}

var _default = Context;
exports.default = _default;