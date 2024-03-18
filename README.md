<h1 align="center">jest-fixed-jsdom</h1>
<p align="center">This library helps re-attach missing NodeJS globals definitions in JSDOM that Jest strips out</p>

## Motivation

Jest strips out a number of NodeJS globals that are used in tests and libraries involving JSDOM, such as structuredClone, ReadableStream, and so on. This library patches these globals back in - there is no polyfilling or mocking involved, it simply re-attaches the missing globals to the JSDOM environment. If you've ever come across errors such as `ReferenceError: ReadableStream is not defined` or `ReferenceError: structuredClone is not defined`, this library is for you. If you were previously using (undici)[https://www.npmjs.com/package/undici] purely to solve this, you will no longer need it. 

## Installation

`npm install jest-fixed-jsdom -D`

## Configuring your jest environment to use jest-fixed-jsdom

You will need to add/modify two properties in your jest configuration to use jest-fixed-jsdom. 

```json
{
  "testEnvironment": "jest-fixed-jsdom"
}
```

Setting `testEnvironment` to `jest-fixed-jsdom` will tell Jest to use jest-fixed-jsdom as the test environment. Setting `customExportConditions` to an empty array will stop JSDOM from using the browser environment to load exports.

