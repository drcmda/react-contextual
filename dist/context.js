"use strict";

exports.__esModule = true;
exports.createNamedContext = createNamedContext;
exports.getNamedContext = getNamedContext;
exports.removeNamedContext = removeNamedContext;
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
  var context = _react.default.createContext(initialState);

  providers.set(name, context);
  return context;
}

function getNamedContext(name) {
  return providers.get(name);
}

function removeNamedContext(name) {
  providers.delete(name);
}

function namedContext(name, initialState) {
  return function (Wrapped) {
    var context = createNamedContext(name, initialState);

    var hoc =
    /*#__PURE__*/
    function (_React$PureComponent) {
      _inheritsLoose(hoc, _React$PureComponent);

      function hoc() {
        return _React$PureComponent.apply(this, arguments) || this;
      }

      var _proto = hoc.prototype;

      _proto.componentWillUnmount = function componentWillUnmount() {
        removeNamedContext(Wrapped.Context);
      };

      _proto.render = function render() {
        return _react.default.createElement(Wrapped, _extends({}, this.props, {
          context: context
        }));
      };

      return hoc;
    }(_react.default.PureComponent);

    hoc.Context = context;
    return hoc;
  };
}

var _default = Context;
exports.default = _default;