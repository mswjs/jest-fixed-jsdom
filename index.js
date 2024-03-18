const JSDOMEnvironment = require('jest-environment-jsdom').default

class FixedJSDOMEnvironment extends JSDOMEnvironment {
  constructor(...args) {
    super(...args)

    this.global.TextDecoder = TextDecoder
    this.global.TextEncoder = TextEncoder
    this.global.ReadableStream = ReadableStream

    this.global.EventTarget = EventTarget
    this.global.Event = Event
    this.global.MessageEvent = MessageEvent

    this.global.Blob = Blob
    this.global.Headers = Headers
    this.global.FormData = FormData
    this.global.Request = Request
    this.global.Response = Response
    this.global.fetch = fetch
    this.global.structuredClone = structuredClone
  }
}

module.exports = FixedJSDOMEnvironment
