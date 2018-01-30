function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { createContext } from 'react-broadcast';
export var context = function context(targets, mapContextToProps) {
  return function (Wrapped) {
    return function (props) {
      var isArray = Array.isArray(targets);
      var array = isArray ? targets : [targets];
      var values = [];
      return array.concat([Wrapped]).reduceRight(function (accumulator, Context) {
        return React.createElement(Context.Consumer, null, function (value) {
          isArray && values.push(value);
          return accumulator !== Wrapped ? accumulator : React.createElement(Wrapped, _extends({}, props, mapContextToProps(isArray ? values : value, props)));
        });
      });
    };
  };
};

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
}(React.Component);

export var StoreContext = React.createContext({});
export var StoreProvider =
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
    return React.createElement(StoreContext.Provider, {
      value: value
    }, React.createElement(RenderOnce, {
      children: this.props.children
    }));
  };

  return StoreProvider;
}(React.Component);
