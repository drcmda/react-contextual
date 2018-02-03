"use strict";

exports.__esModule = true;
exports.Provider = exports.RenderOnce = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _context = _interopRequireWildcard(require("./context"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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

var Provider =
/*#__PURE__*/
function (_React$Component2) {
  _inheritsLoose(Provider, _React$Component2);

  function Provider(props) {
    var _this;

    _this = _React$Component2.call(this) || this;
    _this.state = props.initialState || {};
    _this.Context = props.id ? (0, _context.createNamedContext)(props.id) : _context.default;

    if (props.actions) {
      _this.actions = Object.keys(props.actions).reduce(function (acc, name) {
        var _extends2;

        return _extends({}, acc, (_extends2 = {}, _extends2[name] = function () {
          var _props$actions;

          return _this.setState((_props$actions = props.actions)[name].apply(_props$actions, arguments));
        }, _extends2));
      }, {});
    }

    return _this;
  }

  var _proto2 = Provider.prototype;

  _proto2.componentWillUnmount = function componentWillUnmount() {
    if (props.id) (0, _context.removeNamedContext)(this.props.id);
  };

  _proto2.render = function render() {
    var state = this.state,
        actions = this.actions,
        props = this.props,
        Context = this.Context;

    var value = _extends({}, state, actions ? {
      actions: actions
    } : {});

    return _react.default.createElement(Context.Provider, {
      value: value
    }, props.renderOnce ? _react.default.createElement(RenderOnce, {
      children: props.children
    }) : props.children);
  };

  return Provider;
}(_react.default.Component);

exports.Provider = Provider;
Object.defineProperty(Provider, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    id: _propTypes.default.string,
    initialState: _propTypes.default.object.isRequired,
    actions: _propTypes.default.object,
    renderOnce: _propTypes.default.bool
  }
});
Object.defineProperty(Provider, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    renderOnce: true
  }
});