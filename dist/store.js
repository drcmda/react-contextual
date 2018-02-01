"use strict";

exports.__esModule = true;
exports.Provider = exports.RenderOnce = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

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

var Provider =
/*#__PURE__*/
function (_React$Component2) {
  _inheritsLoose(Provider, _React$Component2);

  function Provider(props) {
    var _this;

    _this = _React$Component2.call(this) || this;
    _this.state = props.initialState || {};
    _this.actions = Object.keys(props.actions).reduce(function (accumulator, action) {
      var _extends2;

      return _extends({}, accumulator, (_extends2 = {}, _extends2[action] = function () {
        var _props$actions;

        var result = (_props$actions = props.actions)[action].apply(_props$actions, arguments);

        _this.setState(typeof result === 'function' ? result(_this.state) : result);
      }, _extends2));
    }, {});
    return _this;
  }

  var _proto2 = Provider.prototype;

  _proto2.render = function render() {
    var value = _extends({}, this.state, {
      actions: this.actions
    });

    return _react.default.createElement(_context.default.Provider, {
      value: value
    }, this.props.renderOnce ? _react.default.createElement(RenderOnce, {
      children: this.props.children
    }) : this.props.children);
  };

  return Provider;
}(_react.default.Component);

exports.Provider = Provider;
Object.defineProperty(Provider, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    initialState: _propTypes.default.object.isRequired,
    actions: _propTypes.default.object.isRequired,
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