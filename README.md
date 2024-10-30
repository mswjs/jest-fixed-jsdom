<h1 align="center">jest-fixed-jsdom</h1>
<p align="center">A superset of the JSDOM environment for Jest that respects Node.js globals.</p>

<!-- prettier-ignore-start -->
> [!WARNING]
> **This package is never meant as a solution to anything**. This is a workaround. Please consider testing browser code in the actual browser. You can do so both in [Vitest](https://vitest.dev/guide/browser/) and in [Playwright](https://playwright.dev/docs/test-components) at the moment.
<!-- prettier-ignore-end -->

## Motivation

When you use Jest with JSDOM you are getting a broken test environment. Some Node.js globals cease to exist (e.g. `Request`, `Response`, `TextEncoder`, `TextDecoder`, `ReadableStream`<sup><a href="https://github.com/mswjs/msw/issues/1916">1</a></sup>), while others stop behaving correctly (e.g. `Event`, `MessageEvent`<sup><a href="https://github.com/nodejs/undici/issues/2663">2</a></sup>, `structuredClone()`<sup><a href="https://github.com/mswjs/msw/issues/1931">3</a></sup>). That is caused by `jest-environment-jsdom` and JSDOM relying on polyfills to implement standard APIs that have been available globally both in the browser and in Node.js for years.

Here's a piece of valid JavaScript that works in both the browser and Node.js but fails in Jest/JSDOM:

```js
new TextEncoder().encode('hello')
```

```
ReferenceError: TextEncoder is not defined
```

**We strongly believe that a valid JavaScript code must compile regardless of what test environment you are using**. In fact, having a proper test environment is crucial to get any kind of value from your tests. Jest/JSDOM take that already working environment away from you.

We've built this project aims to fix that problem, restoring the global APIs that are present in both environments, providing better interoperability, stability, and consistent runtime behavior.

## Changes

This project "fixes" the following global APIs, overriding whichever polyfills they have with respective Node.js globals:

- `fetch()`
- `Blob`
- `FormData`
- `Headers`
- `Request`
- `Response`
- `ReadableStream`
- `TextEncoder`
- `TextDecoder`
- `TextEncoderStream`
- `TextDecoderStream`
- `structuredClone()`
- `URL`
- `URLSearchParams`

## Getting started

### Install

```sh
npm i jest-fixed-jsdom --save-dev
```

### Configure Jest

In your `jest.config.js`, set the `testEnvironment` option to `jest-fixed-jsdom`:

```js
// jest.config.js
module.exports = {
  testEnvironment: 'jest-fixed-jsdom',
}
```

> You can use any other `testEnvironmentOptions` you need. Those will be forwarded to the underlying `jest-environment-jsdom`.
