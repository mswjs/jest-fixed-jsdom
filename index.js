const JSDOMEnvironment = require('jest-environment-jsdom').default

class FixedJSDOMEnvironment extends JSDOMEnvironment {
  constructor(...args) {
    super(...args)

    /**
     * @note Opt-out from JSDOM using browser-style resolution
     * for dependencies. This is simply incorrect, as JSDOM is
     * not a browser, and loading browser-oriented bundles in
     * Node.js will break things.
     *
     * Consider migrating to a more modern test runner if you
     * don't want to deal with this.
     */
    this.customExportConditions = args.customExportConditions || ['']

    this.global.TextDecoder = TextDecoder
    this.global.TextEncoder = TextEncoder
    this.global.TextDecoderStream = TextDecoderStream
    this.global.TextEncoderStream = TextEncoderStream
    this.global.ReadableStream = ReadableStream

    this.global.Blob = Blob
    this.global.Headers = Headers
    this.global.FormData = FormData
    this.global.Request = Request
    this.global.Response = Response
    this.global.fetch = fetch
    const JSDOMAbortController = this.global.AbortController
    this.global.AbortController = AbortController
    this.global.AbortSignal = AbortSignal
    this.global.structuredClone = structuredClone
    this.global.URL = URL
    this.global.URLSearchParams = URLSearchParams

    this.global.BroadcastChannel = BroadcastChannel
    this.global.TransformStream = TransformStream
    this.global.WritableStream = WritableStream

    /**
     * @note JSDOM's "addEventListener()" only accepts its own "AbortSignal"
     * in the "signal" option and rejects the Node.js "AbortSignal" set above
     * (JSDOM 20+ throws, JSDOM 19 silently ignores it). Forward the Node.js
     * signal to a JSDOM signal so JSDOM keeps handling the listener removal
     * per spec. One JSDOM controller is reused per signal. Calls without
     * a Node.js signal are passed through untouched.
     * @see https://github.com/vitest-dev/vitest/pull/8704
     * @see https://github.com/vitest-dev/vitest/pull/9090
     */
    const jsdomControllers = new WeakMap()
    const patchAddEventListener = (target) => {
      const original = target.addEventListener
      target.addEventListener = function addEventListener(
        type,
        listener,
        options = undefined, // keep ".length" at 2 like the original
      ) {
        const signal = options?.signal
        if (!(signal instanceof AbortSignal)) {
          return original.apply(this, arguments)
        }

        let controller = jsdomControllers.get(signal)
        if (!controller) {
          controller = new JSDOMAbortController()
          signal.addEventListener('abort', () => controller.abort(), {
            once: true,
          })
          jsdomControllers.set(signal, controller)
        }
        if (signal.aborted) {
          controller.abort()
        }

        return original.call(this, type, listener, {
          capture: options.capture,
          once: options.once,
          passive: options.passive,
          signal: controller.signal,
        })
      }
    }
    // Jest also defines its own "addEventListener" on the global object.
    patchAddEventListener(this.global.EventTarget.prototype)
    patchAddEventListener(this.global)
  }
}

module.exports = FixedJSDOMEnvironment
