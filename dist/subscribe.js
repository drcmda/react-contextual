"use strict";

exports.__esModule = true;
exports.subscribe = subscribe;
exports.Subscribe = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _context = _interopRequireDefault(require("./context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function subscribe() {
  var contextRefs, mapContextToProps;

  if (arguments.length === 1) {
    contextRefs = _context.default;
    mapContextToProps = arguments.length <= 0 ? undefined : arguments[0];
  } else if (arguments.length === 2) {
    contextRefs = arguments.length <= 0 ? undefined : arguments[0];
    mapContextToProps = arguments.length <= 1 ? undefined : arguments[1];
  } else throw 'subscribe called without arguments';

  return function (Wrapped) {
    return function (props) {
      var isArray = Array.isArray(contextRefs);
      var array = isArray ? contextRefs : [contextRefs];
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
    to: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.object).isRequired, _propTypes.default.object.isRequired]),
    select: _propTypes.default.func.isRequired,
    children: _propTypes.default.func.isRequired
  }
});
Object.defineProperty(Subscribe, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    to: _context.default
  }
});