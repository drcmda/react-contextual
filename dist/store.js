"use strict";

exports.__esModule = true;
exports.StoreProvider = exports.connectStore = exports.StoreContext = exports.RenderOnce = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactBroadcast = require("react-broadcast");

var _context = _interopRequireDefault(require("./context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var RenderOnce =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(RenderOnce, _React$Component);

  function RenderOnce() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = RenderOnce.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate() {
    return false;
  };

  _proto.render = function render() {
    return this.props.children;
  };

  return RenderOnce;
}(_react.default.Component);

exports.RenderOnce = RenderOnce;
var StoreContext = (0, _reactBroadcast.createContext)({});
exports.StoreContext = StoreContext;

var connectStore = function connectStore(mapContextToProps) {
  return (0, _context.default)(StoreContext, mapContextToProps);
};

exports.connectStore = connectStore;

var StoreProvider =
/*#__PURE__*/
function (_React$Component2) {
  _inheritsLoose(StoreProvider, _React$Component2);

  function StoreProvider(props) {
    var _this;

    _this = _React$Component2.call(this) || this;
    _this.state = props.initialState || {};
    _this.actions = Object.keys(props.actions).reduce(function (acc, name) {
      var _extends2;

      return _extends({}, acc, (_extends2 = {}, _extends2[name] = function () {
        var _props$actions;

        var result = (_props$actions = props.actions)[name].apply(_props$actions, arguments);

        _this.setState(typeof result === 'function' ? result(_this.state) : result);
      }, _extends2));
    }, {});
    return _this;
  }

  var _proto2 = StoreProvider.prototype;

  _proto2.render = function render() {
    var value = {
      state: this.state,
      actions: this.actions
    };
    return _react.default.createElement(StoreContext.Provider, {
      value: value
    }, this.props.renderOnce ? _react.default.createElement(RenderOnce, {
      children: this.props.children
    }) : this.props.children);
  };

  return StoreProvider;
}(_react.default.Component);

exports.StoreProvider = StoreProvider;
Object.defineProperty(StoreProvider, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    initialState: _propTypes.default.object.isRequired,
    actions: _propTypes.default.object.isRequired,
    renderOnce: _propTypes.default.bool
  }
});
Object.defineProperty(StoreProvider, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    renderOnce: true
  }
});