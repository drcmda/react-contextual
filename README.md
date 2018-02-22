<p align="center">
  <img width="300" height="300" src="assets/logo.png">
</p>

[![Build Status](https://travis-ci.org/drcmda/react-contextual.svg?branch=master)](https://travis-ci.org/drcmda/react-contextual) [![codecov](https://codecov.io/gh/drcmda/react-contextual/branch/master/graph/badge.svg)](https://codecov.io/gh/drcmda/react-contextual) [![npm version](https://badge.fury.io/js/react-contextual.svg)](https://badge.fury.io/js/react-contextual)

`react-contextual` is a tiny (less than 1KB) helper around [React 16s new context api](https://github.com/acdlite/rfcs/blob/new-version-of-context/text/0000-new-version-of-context.md).

It provides two things:

* consuming (and creating) context with ease, every kind of context, no matter which or whose or how many providers
* a minimal redux-like store pattern with setState semantics and central actions

# Why

Reacts new context api is very powerful albeit very low-level as it does not prescribe patterns and can cause some issues if used naively. `react-contextual` makes creating, sharing and consuming context easier, maps context values to component props similar to how redux operates, takes care of nesting, renders only when necessary and provides a small store for state distribution.

Click [this link](https://github.com/drcmda/react-contextual/blob/master/PITFALLS.md) for a detailed explanation.

# Installation

    npm install react-contextual

# If you just need a light-weight no-frills store

Use the [Provider](https://github.com/drcmda/react-contextual/blob/master/API.md#provider) to distribute state and actions, wrap consumers within, use [subscribe](https://github.com/drcmda/react-contextual/blob/master/API.md#subscribe) to connect components.

[![](assets/render-props.jpg)](https://codesandbox.io/embed/3vo9164z25)

Example 1: https://codesandbox.io/embed/ywyr3q5n4z (basic example)

Example 2: https://codesandbox.io/embed/lxly45lvkl (async actions)

Example 3: https://codesandbox.io/embed/yvx9my007z (memoization)

Example 4: https://codesandbox.io/embed/0o8pj1jz7v (multiple stores)

### Higher Order Component

[![](assets/higher-order.jpg)](https://codesandbox.io/embed/3ykqjvznwq)

### With decorator

![](assets/higher-order-decorator.jpg)

# If you like to provide context

Reacts default api works with singletons, that makes it tough to create multi-purpose, nestable providers. Use [namedContext](https://github.com/drcmda/react-contextual/blob/master/API.md#namedcontext) to create unique context bound to a components lifecycle, [moduleContext](https://github.com/drcmda/react-contextual/blob/master/API.md#modulecontext) for module-scoped context and [transformContext](https://github.com/drcmda/react-contextual/blob/master/API.md#transformcontext) to transform existing context providers (like a declarative middleware). Use [helper functions](https://github.com/drcmda/react-contextual/blob/master/API.md#imperative-context-handling) if you want to control the lifecycle of a context by yourself.

[![](assets/context.jpg)](https://github.com/drcmda/react-contextual/blob/master/assets/examples/context.js)

Example1: https://codesandbox.io/embed/ox405qqopy (namedContext)

Example2: https://codesandbox.io/embed/v8pn13nq77 (moduleContext)

Example3: https://codesandbox.io/embed/mjv84k1kn9 (transformContext)

Example4: https://codesandbox.io/embed/30ql1rxzlq (imperative API)

Example5: https://codesandbox.io/embed/55wp11lv4 (generic React context)

### With decorator

![](assets/context-decorator.jpg)

# API

https://github.com/drcmda/react-contextual/blob/master/API.md

# Changelog

https://github.com/drcmda/react-contextual/blob/master/CHANGELOG.md

# Pitfalls when using the context api raw

https://github.com/drcmda/react-contextual/blob/master/PITFALLS.md

# Who is using it

[![AWV](/assets/corp-awv.png)](https://github.com/awv-informatik)

