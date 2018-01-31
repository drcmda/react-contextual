"use strict";

exports.__esModule = true;
exports.default = context;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function context(consumers, mapContextToProps) {
  return function (Wrapped) {
    return function (props) {
      var isArray = Array.isArray(consumers);
      var array = isArray ? consumers : [consumers];
      var values = [];
      return array.concat([Wrapped]).reduceRight(function (accumulator, Consumer) {
        return _react.default.createElement(Consumer, null, function (value) {
          isArray && values.push(value);
          return accumulator !== Wrapped ? accumulator : _react.default.createElement(Wrapped, _extends({}, props, mapContextToProps(isArray ? values : value, props)));
        });
      });
    };
  };
}