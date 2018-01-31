"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.context = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var context = function context(targets, mapContextToProps) {
  return function (Wrapped) {
    return function (props) {
      var isArray = Array.isArray(targets);
      var array = isArray ? targets : [targets];
      var values = [];
      return array.concat([Wrapped]).reduceRight(function (accumulator, Context) {
        return _react.default.createElement(Context.Consumer, null, function (value) {
          isArray && values.push(value);
          return accumulator !== Wrapped ? accumulator : _react.default.createElement(Wrapped, (0, _extends2.default)({}, props, mapContextToProps(isArray ? values : value, props)));
        });
      });
    };
  };
};

exports.context = context;